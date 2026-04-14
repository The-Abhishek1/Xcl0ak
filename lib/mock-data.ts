import { generateUsername, generateId } from "./constants";

export function mockExploits(n = 20) {
  const titles = ["RCE via WebSocket Hijack in Apache httpd 2.4","Kernel PrivEsc through eBPF Verifier Bypass","OAuth2 Authentication Bypass (PKCE Flow)","GPU Driver Memory Corruption (NVIDIA 535.x)","Container Escape via cgroup v2 Namespace Confusion","DNS Rebinding on Internal API Gateway","JWT Forgery via Algorithm Confusion RS256→HS256","TOCTOU Race Condition in Filesystem Permission Check","Heap Spray for ASLR Bypass on Windows 11 23H2","Side-Channel Attack on AES-NI Implementation","Supply Chain Attack via npm Package Hijacking","Chrome V8 Use-After-Free in JIT Compiler","Spring Framework Deserialization RCE","SSRF via AWS IMDSv1 Cloud Metadata Endpoint","OpenSSL DTLS Integer Overflow","Bluetooth LE Pairing Bypass (KNOB Variant)","VMware ESXi Hypervisor Escape via USB Passthrough","Windows Print Spooler PrivEsc (PrintNightmare v3)","Redis Lua Sandbox Escape via debug.getinfo","Kubernetes RBAC Bypass via ServiceAccount Token Reuse"];
  return Array.from({length:n},(_,i)=>({
    id: generateId(), title: titles[i%titles.length],
    description: `## Summary\nCritical vulnerability allowing ${["remote code execution","local privilege escalation","authentication bypass","memory corruption","container escape"][i%5]}.\n\n## Impact\n${["Full system compromise","Kernel-level code execution","Admin access without credentials","Arbitrary read/write in kernel memory","Host access from container"][i%5]}\n\n## Reproduction\n1. Set up target environment\n2. Run exploit with target IP\n3. Observe code execution\n\n## Affected Versions\n${["Apache 2.4.0-2.4.58","Linux Kernel 6.1-6.8","Multiple OAuth2 libs","NVIDIA 535.x-545.x","Docker 24.x-25.x"][i%5]}`,
    code: `#!/usr/bin/env python3\n# ${titles[i%titles.length]}\n# CVE-2025-${3000+i} — PoC Exploit\n\nimport struct, socket, sys\n\nTARGET = sys.argv[1] if len(sys.argv) > 1 else "127.0.0.1"\nPORT = ${8000+i}\n\nclass Exploit:\n    def __init__(self, target, port):\n        self.target = target\n        self.port = port\n\n    def build_payload(self):\n        buf = b"\\x41" * 256\n        buf += struct.pack("<Q", 0x${(0x400000+i*0x100).toString(16)})\n        return buf\n\n    def run(self):\n        s = socket.socket()\n        s.connect((self.target, self.port))\n        s.send(self.build_payload())\n        print(s.recv(4096))\n\nif __name__ == "__main__":\n    Exploit(TARGET, PORT).run()`,
    author: generateUsername(),
    category: ["Buffer Overflow","SQL Injection","XSS","RCE","Privilege Escalation","DoS","CSRF","SSRF","Path Traversal","Deserialization","Memory Corruption","Logic Flaw","Race Condition","Supply Chain","Side Channel","Zero Day","Buffer Overflow","RCE","Privilege Escalation","RCE"][i%20],
    os: ["Linux","Windows","Cross-Platform","Linux","Linux","Windows","Cross-Platform","Linux","Windows","Cross-Platform","Cross-Platform","Cross-Platform","Cross-Platform","Linux","Cross-Platform","Android","Linux","Windows","Linux","Linux"][i%20],
    severity: ["critical","high","critical","high","critical","medium","high","medium","critical","high","critical","critical","high","high","medium","medium","critical","high","high","critical"][i%20],
    cveId: `CVE-2025-${3000+i}`,
    language: ["Python","C","Python","C++","Go","Python","JavaScript","C","Python","Assembly","JavaScript","C++","Java","Python","C","C","C","C++","Python","Go"][i%20],
    payloadType: ["Shellcode","Script","PoC","Binary","Module","Script","PoC","Binary","Shellcode","Shellcode","Script","Binary","PoC","Script","Binary","PoC","Binary","Script","PoC","Module"][i%20],
    tags: [["linux","kernel"],["windows","rce"],["web","xss"],["rce","zero-day"],["privesc","kernel"]][i%5],
    upvotes: ~~(Math.random()*800)+50, downvotes: ~~(Math.random()*30),
    commentCount: ~~(Math.random()*90), downloadCount: ~~(Math.random()*3000)+100, viewCount: ~~(Math.random()*12000)+500,
    verified: Math.random()>0.3, trending: Math.random()>0.5,
    createdAt: new Date(Date.now()-~~(Math.random()*14*86400000)),
    mitigations: "1. Apply vendor patch immediately\n2. Implement network segmentation\n3. Monitor for IoCs in SIEM\n4. Deploy WAF rules\n5. Enable enhanced audit logging",
    snortRule: `alert tcp any any -> any any (msg:"CVE-2025-${3000+i}"; content:"|41 41 41|"; sid:${1000000+i};)`,
    yaraRule: `rule CVE_2025_${3000+i} {\n  meta:\n    desc = "${titles[i%titles.length]}"\n  strings:\n    $a = { 41 41 41 41 }\n  condition:\n    $a\n}`,
    files: i<6 ? [{name:`exploit_${3000+i}.py`,size:"4.2 KB"},{name:"README.md",size:"1.8 KB"}] : [],
  }));
}

export function mockThreats() {
  return [
    {id:generateId(),type:"ransomware" as const,level:"critical" as const,latitude:40.71,longitude:-74.01,city:"New York",countryCode:"US",country:"United States",description:"LockBit 4.0 ransomware campaign targeting financial sector via Citrix NetScaler CVE.",source:"CISA",affectedSectors:["Finance","Banking"],attackVector:"Citrix NetScaler ADC",ttps:["T1566","T1059","T1486"],iocs:["185.220.101.0/24"],relatedCveIds:["CVE-2025-3000"],active:true,timestamp:new Date(Date.now()-3600000)},
    {id:generateId(),type:"apt" as const,level:"critical" as const,latitude:55.76,longitude:37.62,city:"Moscow",countryCode:"RU",country:"Russia",description:"APT29 conducting espionage against European government networks via Exchange zero-day.",source:"Mandiant",affectedSectors:["Government","Defense"],attackVector:"Exchange Zero-Day",ttps:["T1190","T1078"],iocs:[],relatedCveIds:["CVE-2025-3001"],active:true,timestamp:new Date(Date.now()-7200000)},
    {id:generateId(),type:"espionage" as const,level:"critical" as const,latitude:39.9,longitude:116.41,city:"Beijing",countryCode:"CN",country:"China",description:"Volt Typhoon pre-positioning in US critical infrastructure using LOTL techniques.",source:"NSA/CISA",affectedSectors:["Telecom","Energy","Water"],attackVector:"Living off the Land",ttps:["T1071","T1053"],iocs:[],relatedCveIds:[],active:true,timestamp:new Date(Date.now()-1800000)},
    {id:generateId(),type:"phishing" as const,level:"high" as const,latitude:51.51,longitude:-0.13,city:"London",countryCode:"GB",country:"United Kingdom",description:"AI-generated spear-phishing campaign targeting NHS healthcare delivering Cobalt Strike.",source:"NCSC UK",affectedSectors:["Healthcare"],attackVector:"AI Spear-phishing",ttps:["T1566.001","T1204"],iocs:["phish.example.co.uk"],relatedCveIds:[],active:true,timestamp:new Date(Date.now()-5400000)},
    {id:generateId(),type:"ddos" as const,level:"medium" as const,latitude:35.68,longitude:139.65,city:"Tokyo",countryCode:"JP",country:"Japan",description:"2.4 Tbps DDoS campaign against financial exchanges. HTTP/2 Rapid Reset.",source:"JPCERT/CC",affectedSectors:["Finance"],attackVector:"HTTP/2 Rapid Reset",ttps:["T1498"],iocs:[],relatedCveIds:["CVE-2025-3004"],active:true,timestamp:new Date(Date.now()-10800000)},
    {id:generateId(),type:"wiper"as const,level:"critical" as const,latitude:50.45,longitude:30.52,city:"Kyiv",countryCode:"UA",country:"Ukraine",description:"CaddyWiper variant deployed against energy grid. MBR overwrite + data destruction.",source:"CERT-UA",affectedSectors:["Energy","Government"],attackVector:"Supply Chain",ttps:["T1561","T1485"],iocs:["sha256:d4e5f6..."],relatedCveIds:[],active:true,timestamp:new Date(Date.now()-600000)},
    {id:generateId(),type:"zero_day" as const,level:"critical" as const,latitude:32.09,longitude:34.78,city:"Tel Aviv",countryCode:"IL",country:"Israel",description:"NSO Group zero-click iOS 18 exploit chain. iMessage exploit achieving kernel code exec.",source:"Citizen Lab",affectedSectors:["Journalism"],attackVector:"iOS Zero-Click",ttps:["T1203","T1068"],iocs:[],relatedCveIds:["CVE-2025-3006"],active:true,timestamp:new Date(Date.now()-14400000)},
    {id:generateId(),type:"banking_trojan" as const,level:"high" as const,latitude:-23.55,longitude:-46.63,city:"São Paulo",countryCode:"BR",country:"Brazil",description:"Grandoreiro banking trojan resurgence targeting Latin American banks.",source:"ESET",affectedSectors:["Banking"],attackVector:"Malspam",ttps:["T1566.001"],iocs:[],relatedCveIds:[],active:true,timestamp:new Date(Date.now()-21600000)},
    {id:generateId(),type:"ransomware" as const,level:"critical" as const,latitude:48.86,longitude:2.35,city:"Paris",countryCode:"FR",country:"France",description:"ALPHV successor targeting French municipal governments. Double extortion.",source:"ANSSI",affectedSectors:["Government"],attackVector:"VPN Compromise",ttps:["T1078","T1486"],iocs:[],relatedCveIds:[],active:true,timestamp:new Date(Date.now()-43200000)},
    {id:generateId(),type:"supply_chain" as const,level:"high" as const,latitude:52.52,longitude:13.41,city:"Berlin",countryCode:"DE",country:"Germany",description:"Compromised PyPI package distributing info-stealer. 50K+ downloads.",source:"GitHub Advisory",affectedSectors:["Software"],attackVector:"Typosquatting",ttps:["T1195.002"],iocs:["pypi:faker-extended"],relatedCveIds:[],active:true,timestamp:new Date(Date.now()-28800000)},
    {id:generateId(),type:"apt" as const,level:"high" as const,latitude:35.69,longitude:51.39,city:"Tehran",countryCode:"IR",country:"Iran",description:"Charming Kitten deploying custom backdoor against defense contractors.",source:"Recorded Future",affectedSectors:["Defense"],attackVector:"Confluence CVE",ttps:["T1190"],iocs:[],relatedCveIds:["CVE-2025-3010"],active:true,timestamp:new Date(Date.now()-36000000)},
    {id:generateId(),type:"malware" as const,level:"high" as const,latitude:37.57,longitude:126.98,city:"Seoul",countryCode:"KR",country:"South Korea",description:"Lazarus Group macOS malware via trojanized crypto trading apps.",source:"Kaspersky",affectedSectors:["Cryptocurrency"],attackVector:"Trojanized App",ttps:["T1195.002"],iocs:[],relatedCveIds:[],active:true,timestamp:new Date(Date.now()-72000000)},
    {id:generateId(),type:"data_breach" as const,level:"high" as const,latitude:28.61,longitude:77.21,city:"Delhi",countryCode:"IN",country:"India",description:"Major telecom breach exposing 200M+ subscriber records via SQL injection.",source:"CERT-IN",affectedSectors:["Telecom"],attackVector:"SQL Injection",ttps:["T1190"],iocs:[],relatedCveIds:["CVE-2025-3013"],active:true,timestamp:new Date(Date.now()-86400000)},
    {id:generateId(),type:"cryptojacking" as const,level:"medium" as const,latitude:1.35,longitude:103.82,city:"Singapore",countryCode:"SG",country:"Singapore",description:"Large-scale cryptojacking via misconfigured Docker APIs across APAC cloud.",source:"Aqua Security",affectedSectors:["Cloud"],attackVector:"Exposed Docker API",ttps:["T1610"],iocs:[],relatedCveIds:[],active:true,timestamp:new Date(Date.now()-50000000)},
    {id:generateId(),type:"phishing" as const,level:"medium" as const,latitude:-33.87,longitude:151.21,city:"Sydney",countryCode:"AU",country:"Australia",description:"Credential harvesting targeting Australian government employees.",source:"ACSC",affectedSectors:["Government"],attackVector:"Credential Phishing",ttps:["T1566"],iocs:[],relatedCveIds:[],active:false,timestamp:new Date(Date.now()-100000000)},
  ];
}

export function mockNews(n = 12) {
  const articles = [
    {title:"Critical Zero-Day in Linux Kernel Actively Exploited by State Actors",source:"BleepingComputer",country:"US",region:"North America",severity:"critical",category:"Vulnerabilities",summary:"A critical zero-day in the Linux kernel's eBPF subsystem is being actively exploited by nation-state actors.",content:"Security researchers at Google Project Zero have disclosed a critical zero-day affecting the Linux kernel's eBPF verifier. CVE-2025-3000 allows unprivileged local users to achieve kernel code execution.\n\nAll distributions running kernels 6.1-6.8 are affected.\n\n**Mitigation:** Set kernel.unprivileged_bpf_disabled=1",cves:["CVE-2025-3000"]},
    {title:"New Ransomware Group 'BlackVault' Targets Healthcare Globally",source:"KrebsOnSecurity",country:"GB",region:"Europe",severity:"critical",category:"Malware",summary:"BlackVault RaaS group launched attacks against healthcare across 12 countries.",content:"A new ransomware operation called BlackVault has emerged targeting healthcare. Victims include hospitals in the UK, Germany, France, and the US.\n\nFBI and Europol issued a joint advisory.",cves:[]},
    {title:"Massive Supply Chain Attack Compromises Popular NPM Package",source:"The Hacker News",country:"US",region:"North America",severity:"high",category:"Breaches",summary:"Typosquatting attack on npm distributed info-stealer through package with 500K+ downloads.",content:"A malicious npm package mimicking 'colors' contained an info-stealer targeting env vars, SSH keys, and AWS credentials.",cves:[]},
    {title:"200M Telecom Records Exposed in Indian Data Breach",source:"DarkReading",country:"IN",region:"Asia",severity:"high",category:"Breaches",summary:"India's second-largest telecom confirms massive breach including Aadhaar-linked data.",content:"SQL injection via legacy API endpoint compromised 200M+ subscriber records.",cves:["CVE-2025-3013"]},
    {title:"Iran-Linked Hackers Deploy Wiper Against Israeli Infrastructure",source:"Reuters",country:"IL",region:"Middle East",severity:"critical",category:"Government",summary:"Destructive wiper malware targets Israeli water treatment and energy systems.",content:"Israeli cybersecurity agencies confirmed attacks on SCADA systems attributed to Iranian actors.",cves:[]},
    {title:"AI-Powered Phishing Shows 400% Increase in Success Rate",source:"Wired",country:"US",region:"North America",severity:"medium",category:"AI Security",summary:"AI-generated phishing emails achieving success rates 4x higher than traditional campaigns.",content:"Research shows near-perfect grammar and context-aware social engineering in AI-generated phishing.",cves:[]},
    {title:"CISA Issues Emergency Directive for Federal VPN Patching",source:"SecurityWeek",country:"US",region:"North America",severity:"critical",category:"Government",summary:"CISA mandates federal agencies patch critical VPN vulnerabilities within 48 hours.",content:"Emergency Directive 25-03 covers Fortinet, Ivanti, and Palo Alto VPN products.",cves:["CVE-2025-3015"]},
    {title:"North Korean Hackers Target Crypto Developers with Fake Jobs",source:"Mandiant",country:"KR",region:"Asia",severity:"high",category:"APT",summary:"Lazarus Group social engineering via fake job interviews on LinkedIn.",content:"Trojanized coding challenges delivered during fake interview processes targeting blockchain developers.",cves:[]},
    {title:"Critical RCE Discovered in Enterprise VPN Solutions",source:"Ars Technica",country:"US",region:"North America",severity:"critical",category:"Vulnerabilities",summary:"Pre-auth RCE affects multiple enterprise SSL-VPN vendors.",content:"The vulnerability exists in the SSL-VPN web interface and requires no authentication.",cves:["CVE-2025-3020"]},
    {title:"Russian APT Targets Ukrainian Power Grid with Industroyer Variant",source:"CERT-UA",country:"UA",region:"Europe",severity:"critical",category:"APT",summary:"Sandworm deploys updated Industroyer against electrical distribution networks.",content:"The updated malware variant targets ICS/SCADA protocols specific to Ukrainian grid infrastructure.",cves:[]},
    {title:"Major Cloud Provider Patches Critical Container Escape",source:"The Register",country:"US",region:"North America",severity:"high",category:"Vulnerabilities",summary:"Container escape in managed K8s service could affect millions of workloads.",content:"The vulnerability allows breaking out of container isolation to access the host node.",cves:["CVE-2025-3025"]},
    {title:"Cryptocurrency Exchange Loses $150M in Smart Contract Exploit",source:"CoinDesk",country:"SG",region:"Asia",severity:"high",category:"Breaches",summary:"DeFi protocol suffers reentrancy vulnerability exploitation.",content:"Attackers exploited a reentrancy bug in the lending contract to drain $150M in assets.",cves:[]},
  ];
  return articles.slice(0,n).map((a,i)=>({id:generateId(),...a,publishedAt:new Date(Date.now()-i*7200000)}));
}

export function mockCVEs(n = 15) {
  const vendors = ["Apache","Linux Kernel","OAuth2 Libs","NVIDIA","Docker","Kubernetes","PostgreSQL","Redis","Node.js","Spring","OpenSSL","Chrome V8","VMware","Fortinet","Palo Alto"];
  return Array.from({length:n},(_,i)=>({
    id:`CVE-2025-${3000+i}`,
    title:`${["RCE","PrivEsc","Auth Bypass","Memory Corruption","Info Disclosure","DoS","SSRF","Command Injection","Path Traversal","Deserialization RCE","Buffer Overflow","Use-After-Free","Integer Overflow","Logic Flaw","Race Condition"][i]} in ${vendors[i]}`,
    description:`Vulnerability in ${vendors[i]} allowing ${["remote code execution","privilege escalation","authentication bypass","memory corruption","information disclosure"][i%5]}. Affects versions ${i+1}.0 through ${i+1}.${i+3}.`,
    severity:["critical","high","critical","high","critical","medium","high","high","medium","critical","medium","critical","high","critical","high"][i],
    cvss:parseFloat((9.8-i*0.4).toFixed(1)),vendor:vendors[i],product:vendors[i],
    status:["Active","Patched","Active","Under Review","Patched","Active","Patched","Active","Under Review","Active","Patched","Active","Patched","Active","Under Review"][i],
    exploitCount:~~(Math.random()*8)+1,published:`2025-0${(i%9)+1}-${10+i}`,
    mitigations:"1. Update to latest version\n2. Apply vendor patch\n3. Implement WAF rules\n4. Network segmentation\n5. Monitor for IoCs",
    snortRule:`alert tcp any any -> any any (msg:"CVE-2025-${3000+i}"; content:"|41 42|"; sid:${1000000+i};)`,
    yaraRule:`rule CVE_2025_${3000+i} {\n  strings: $a = { 41 42 43 }\n  condition: $a\n}`,
    timeline:[
      {date:`2025-0${(i%9)+1}-01`,event:"Vulnerability discovered",type:"discovery"},
      {date:`2025-0${(i%9)+1}-05`,event:"Vendor notified",type:"notification"},
      {date:`2025-0${(i%9)+1}-${10+i}`,event:"CVE assigned & published",type:"published"},
      ...(i%3===0?[{date:`2025-0${(i%9)+1}-${15+i%10}`,event:"Public exploit released",type:"exploit"}]:[]),
      ...(i%2===0?[{date:`2025-0${(i%9)+1}-${20+i%10}`,event:"Vendor patch released",type:"patch"}]:[]),
    ],
  }));
}

export function mockCTF() {
  return [
    {id:generateId(),title:"Binary Bomb Defusal",desc:"Reverse engineer the binary bomb. 6 phases of increasing difficulty. Wrong input = BOOM.\n\nTools: GDB, objdump, strings",category:"Binary",difficulty:"Hard",points:500,solves:47,flag:"XCLOAK{b0mb_d3fus3d}",hints:["Phase 1 expects a string","Phase 3 is a switch"],files:[{name:"bomb",size:"12.4 KB"},{name:"bomb.c",size:"3.2 KB"}],author:generateUsername()},
    {id:generateId(),title:"SQL Injection Gauntlet",desc:"5 levels of SQL injection from basic UNION to blind boolean with WAF bypass.",category:"Web",difficulty:"Medium",points:300,solves:124,flag:"XCLOAK{sql_m4st3r}",hints:["Level 4: Try HTTP param pollution"],files:[{name:"challenge.zip",size:"2.1 MB"}],author:generateUsername()},
    {id:generateId(),title:"RSA Weak Key Recovery",desc:"RSA public key with weak parameters. Recover private key.\n\nHint: Fermat factorization works when p,q are close.",category:"Crypto",difficulty:"Easy",points:150,solves:312,flag:"XCLOAK{f3rm4t_w1ns}",hints:["p and q differ by < 10000"],files:[{name:"pubkey.pem",size:"0.4 KB"},{name:"cipher.bin",size:"256 B"}],author:generateUsername()},
    {id:generateId(),title:"Firmware Backdoor Hunt",desc:"Extract firmware, find hardcoded creds, identify the backdoor.\n\nTools: binwalk, firmware-mod-kit, ghidra",category:"Reverse",difficulty:"Hard",points:500,solves:31,flag:"XCLOAK{f1rmw4r3_pr0}",hints:["SquashFS filesystem","Check /etc/ for base64"],files:[{name:"firmware.bin",size:"8.7 MB"}],author:generateUsername()},
    {id:generateId(),title:"Memory Forensics Lab",desc:"Windows memory dump analysis. Find malware, extract C2, recover exfiltrated data.\n\nUse Volatility 3.",category:"Forensics",difficulty:"Medium",points:350,solves:89,flag:"XCLOAK{v0l4t1l1ty}",hints:["Unusual parent-child processes","Process hollowing"],files:[{name:"memdump.raw.gz",size:"512 MB"},{name:"README.txt",size:"2 KB"}],author:generateUsername()},
    {id:generateId(),title:"Network Traffic Decoder",desc:"PCAP analysis. Reconstruct attack timeline. Flag in exfiltrated data.",category:"Network",difficulty:"Easy",points:200,solves:198,flag:"XCLOAK{pc4p_pr0}",hints:["Check DNS queries","DNS tunneling"],files:[{name:"capture.pcap",size:"45 MB"}],author:generateUsername()},
  ];
}

export function mockLeaderboard(n = 20) {
  return Array.from({length:n},(_,i)=>({
    rank:i+1, username:generateUsername(), sessionId:generateId(),
    reputation:Math.max(100,8500-i*380+~~(Math.random()*200)),
    exploitCount:Math.max(1,65-i*3), ctfSolves:Math.max(0,40-i*2), commentCount:Math.max(0,180-i*8),
    badges:["🩸","⚔️","⭐","🏴","🔬","🔥","💀","🛡️","👑"].slice(0,Math.max(1,9-i)),
    country:["US","GB","DE","IN","CN","RU","JP","KR","BR","IL","FR","UA","AU","SG","IR","TW","NG","ZA","SA","KP"][i%20],
    region:["North America","Europe","Europe","Asia","Asia","Europe","Asia","Asia","South America","Middle East","Europe","Europe","Oceania","Asia","Middle East","Asia","Africa","Africa","Middle East","Asia"][i%20],
    streak:Math.max(0,35-i*2), joinedAt:new Date(Date.now()-(90+i*7)*86400000),
  }));
}
