// lib/fetchers.ts — Replace your existing file
// Fixes: &nbsp; in news, duplicate content, better CVE details

function cleanHtml(str: string): string {
  if (!str) return "";
  return str.replace(/<!\[CDATA\[|\]\]>/g, "").replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#039;|&apos;|&#8217;|&#8216;/g, "'")
    .replace(/&#8220;|&#8221;/g, '"').replace(/&#8211;/g, "–").replace(/&#8212;/g, "—")
    .replace(/&#\d+;/g, "").replace(/\s+/g, " ").trim();
}

export async function fetchRealCVEs(keyword?: string, limit = 20) {
  const params = new URLSearchParams({ resultsPerPage: String(limit) });
  if (keyword) params.set("keywordSearch", keyword);
  const headers: Record<string, string> = {};
  if (process.env.NVD_API_KEY) headers["apiKey"] = process.env.NVD_API_KEY;

  try {
    const res = await fetch(`https://services.nvd.nist.gov/rest/json/cves/2.0?${params}`, { headers, next: { revalidate: 300 } });
    if (!res.ok) throw new Error(`NVD ${res.status}`);
    const data = await res.json();
    return (data.vulnerabilities || []).map((v: any) => {
      const cve = v.cve;
      const m31 = cve.metrics?.cvssMetricV31?.[0]?.cvssData;
      const m2 = cve.metrics?.cvssMetricV2?.[0]?.cvssData;
      const cvss = m31?.baseScore || m2?.baseScore || 0;
      const sev = (m31?.baseSeverity || "MEDIUM").toLowerCase();
      const cpe = cve.configurations?.[0]?.nodes?.[0]?.cpeMatch?.[0]?.criteria || "";
      const p = cpe.split(":");
      const vendor = (p[3] || "unknown").replace(/_/g, " ");
      const product = (p[4] || "unknown").replace(/_/g, " ");
      const desc = cve.descriptions?.find((d: any) => d.lang === "en")?.value || "";
      const refs = (cve.references || []).slice(0, 8).map((r: any) => ({ url: r.url, source: r.source || "", tags: r.tags || [] }));
      const hasExploit = refs.some((r: any) => r.tags.some((t: string) => t.toLowerCase().includes("exploit")));
      const weaknesses = cve.weaknesses?.flatMap((w: any) => w.description?.map((d: any) => d.value)).filter(Boolean) || [];
      return {
        id: cve.id,
        title: `${sev.charAt(0).toUpperCase()+sev.slice(1)} vulnerability in ${vendor} ${product}`,
        description: desc, severity: sev, cvss,
        cvssVector: m31?.vectorString || m2?.vectorString || "",
        vendor: vendor.charAt(0).toUpperCase()+vendor.slice(1),
        product: product.charAt(0).toUpperCase()+product.slice(1),
        affectedVersions: p[5] || "See advisory", weaknesses,
        status: hasExploit ? "Exploited" : "Active",
        exploitCount: hasExploit ? 1 : 0, hasExploit,
        published: cve.published?.split("T")[0] || "",
        lastModified: cve.lastModified?.split("T")[0] || "",
        references: refs,
        mitigations: `1. Check if you are running ${vendor} ${product}\n2. Apply vendor patch immediately\n3. Monitor vendor advisory for updates\n4. Implement compensating controls\n5. Review logs for exploitation indicators`,
        snortRule: `alert tcp any any -> any any (msg:"${cve.id}"; sid:${~~(Math.random()*9999999)}; rev:1;)`,
        yaraRule: `rule ${cve.id.replace(/-/g,"_")} {\n  meta:\n    cve = "${cve.id}"\n    severity = "${sev}"\n  condition: true\n}`,
        timeline: [
          { date: cve.published?.split("T")[0] || "", event: "CVE Published", type: "published" },
          ...(cve.lastModified && cve.lastModified !== cve.published ? [{ date: cve.lastModified.split("T")[0], event: "Last Modified", type: "notification" }] : []),
          ...(hasExploit ? [{ date: "Active", event: "Exploit available in the wild", type: "exploit" }] : []),
        ],
      };
    });
  } catch (e) { console.error("NVD:", e); return []; }
}

export async function fetchRealNews() {
  const feeds = [
    { url: "https://feeds.feedburner.com/TheHackersNews", source: "The Hacker News", country: "US", region: "North America" },
    { url: "https://www.bleepingcomputer.com/feed/", source: "BleepingComputer", country: "US", region: "North America" },
    { url: "https://krebsonsecurity.com/feed/", source: "KrebsOnSecurity", country: "US", region: "North America" },
    { url: "https://www.darkreading.com/rss.xml", source: "Dark Reading", country: "US", region: "North America" },
    { url: "https://www.securityweek.com/feed", source: "SecurityWeek", country: "US", region: "North America" },
  ];
  const articles: any[] = [];
  for (const feed of feeds) {
    try {
      const res = await fetch(feed.url, { next: { revalidate: 600 }, headers: { "User-Agent": "Xcloak/2.0" } });
      if (!res.ok) continue;
      const xml = await res.text();
      const items = xml.match(/<item[\s\S]*?<\/item>/gi) || [];
      for (const item of items.slice(0, 8)) {
        const getTag = (tag: string) => { const m = item.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`)); return m ? m[1].trim() : ""; };
        const title = cleanHtml(getTag("title"));
        const link = cleanHtml(getTag("link"));
        const rawDesc = getTag("description");
        const rawContent = getTag("content:encoded") || getTag("content");
        const pubDate = getTag("pubDate");
        if (!title) continue;

        // FIX: clean everything, and make content different from summary
        const summary = cleanHtml(rawDesc).slice(0, 280);
        let content = rawContent ? cleanHtml(rawContent) : cleanHtml(rawDesc);
        // If content is basically same as summary, set empty so UI only shows summary once
        if (content.length <= summary.length + 30) content = "";

        const tl = title.toLowerCase();
        let category = "General", severity = "medium";
        if (tl.includes("breach")||tl.includes("leak")||tl.includes("exposed")) category = "Breaches";
        else if (tl.includes("malware")||tl.includes("ransomware")||tl.includes("trojan")) category = "Malware";
        else if (tl.includes("cve")||tl.includes("vulnerability")||tl.includes("patch")||tl.includes("zero-day")||tl.includes("flaw")||tl.includes("exploit")) category = "Vulnerabilities";
        else if (tl.includes("government")||tl.includes("cisa")||tl.includes("fbi")) category = "Government";
        else if (tl.includes("apt")||tl.includes("nation-state")) category = "APT";
        if (tl.includes("critical")||tl.includes("zero-day")||tl.includes("actively exploit")) severity = "critical";
        else if (tl.includes("high")||tl.includes("severe")||tl.includes("major")) severity = "high";

        const cves = [...new Set([...(title.match(/CVE-\d{4}-\d+/g)||[]),...((content||summary).match(/CVE-\d{4}-\d+/g)||[])])];

        // Auto-detect country from content
        let country = feed.country, region = feed.region;
        const cl = (content||summary+title).toLowerCase();
        const countryMap: Record<string,{c:string,r:string}> = {russia:{c:"RU",r:"Europe"},china:{c:"CN",r:"Asia"},iran:{c:"IR",r:"Middle East"},"north korea":{c:"KP",r:"Asia"},india:{c:"IN",r:"Asia"},ukraine:{c:"UA",r:"Europe"},israel:{c:"IL",r:"Middle East"},japan:{c:"JP",r:"Asia"},germany:{c:"DE",r:"Europe"},france:{c:"FR",r:"Europe"},australia:{c:"AU",r:"Oceania"},"united kingdom":{c:"GB",r:"Europe"},brazil:{c:"BR",r:"South America"}};
        for (const [k,v] of Object.entries(countryMap)) { if (cl.includes(k)) { country = v.c; region = v.r; break; } }

        articles.push({ id: Buffer.from(link||title).toString("base64").slice(0,24), title, summary, content, sourceUrl: link, sourceName: feed.source, country, region, severity, category, tags: cves.length > 0 ? cves : [category], publishedAt: pubDate ? new Date(pubDate) : new Date(), cves });
      }
    } catch (e) { console.error(`RSS ${feed.source}:`, e); }
  }
  const seen = new Set<string>();
  return articles.filter(a => { const k = a.title.toLowerCase().slice(0,50); if (seen.has(k)) return false; seen.add(k); return true; }).sort((a,b) => new Date(b.publishedAt).getTime()-new Date(a.publishedAt).getTime());
}

export async function fetchRealThreats() {
  if (!process.env.OTX_API_KEY) return [];
  try {
    const res = await fetch(`https://otx.alienvault.com/api/v1/pulses/subscribed?limit=30&modified_since=${new Date(Date.now()-7*86400000).toISOString()}`, { headers: { "X-OTX-API-KEY": process.env.OTX_API_KEY }, next: { revalidate: 900 } });
    if (!res.ok) throw new Error(`OTX ${res.status}`);
    const data = await res.json();
    const LOCS: Record<string,{lat:number;lng:number;city:string;country:string;countryName:string}> = {russia:{lat:55.76,lng:37.62,city:"Moscow",country:"RU",countryName:"Russia"},china:{lat:39.9,lng:116.41,city:"Beijing",country:"CN",countryName:"China"},iran:{lat:35.69,lng:51.39,city:"Tehran",country:"IR",countryName:"Iran"},"north korea":{lat:39.02,lng:125.75,city:"Pyongyang",country:"KP",countryName:"North Korea"},"united states":{lat:38.9,lng:-77.04,city:"Washington DC",country:"US",countryName:"United States"},ukraine:{lat:50.45,lng:30.52,city:"Kyiv",country:"UA",countryName:"Ukraine"},israel:{lat:32.09,lng:34.78,city:"Tel Aviv",country:"IL",countryName:"Israel"},india:{lat:28.61,lng:77.21,city:"Delhi",country:"IN",countryName:"India"},germany:{lat:52.52,lng:13.41,city:"Berlin",country:"DE",countryName:"Germany"},france:{lat:48.86,lng:2.35,city:"Paris",country:"FR",countryName:"France"},japan:{lat:35.68,lng:139.65,city:"Tokyo",country:"JP",countryName:"Japan"},brazil:{lat:-23.55,lng:-46.63,city:"São Paulo",country:"BR",countryName:"Brazil"},australia:{lat:-33.87,lng:151.21,city:"Sydney",country:"AU",countryName:"Australia"},singapore:{lat:1.35,lng:103.82,city:"Singapore",country:"SG",countryName:"Singapore"},"south korea":{lat:37.57,lng:126.98,city:"Seoul",country:"KR",countryName:"South Korea"}};
    return (data.results||[]).map((pulse:any) => {
      const allText = ((pulse.description||"")+" "+(pulse.tags||[]).join(" ")+" "+(pulse.name||"")).toLowerCase();
      let loc = {lat:40+(Math.random()-.5)*60,lng:(Math.random()-.5)*300,city:"Unknown",country:"XX",countryName:"Unknown"};
      for (const [k,v] of Object.entries(LOCS)) { if (allText.includes(k)) { loc = v; break; } }
      let type = "malware";
      const tags = (pulse.tags||[]).map((t:string)=>t.toLowerCase());
      if (tags.some((t:string)=>t.includes("ransomware"))) type = "ransomware";
      else if (tags.some((t:string)=>t.includes("apt")||t.includes("espionage"))) type = "apt";
      else if (tags.some((t:string)=>t.includes("phish"))) type = "phishing";
      else if (tags.some((t:string)=>t.includes("ddos"))) type = "ddos";
      const iocCount = pulse.indicators?.length||0;
      let level = "medium";
      if (iocCount>50) level = "critical"; else if (iocCount>20) level = "high";
      return { id:pulse.id, type, level, lat:loc.lat+(Math.random()-.5)*2, lng:loc.lng+(Math.random()-.5)*2, city:loc.city, country:loc.country, countryName:loc.countryName, desc:cleanHtml(pulse.description||pulse.name).slice(0,400), source:"AlienVault OTX", sectors:pulse.targeted_countries||[], vector:tags[0]||"Unknown", ttps:(pulse.attack_ids||[]).map((a:any)=>a.id).slice(0,5), iocs:(pulse.indicators||[]).slice(0,5).map((i:any)=>i.indicator), cves:((pulse.description||"").match(/CVE-\d{4}-\d+/g)||[]).slice(0,3), active:true, timestamp:new Date(pulse.modified||pulse.created) };
    });
  } catch (e) { console.error("OTX:", e); return []; }
}
