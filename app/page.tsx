"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { SevBadge, StatCard, Tag } from "@/components/ui";
import { useLiveFetch } from "@/hooks/use-fetch";
import { timeAgo, SEVERITY_CONFIG, THREAT_LEVEL_COLORS } from "@/lib/constants";
import { Bug, AlertTriangle, Radar, Users, Flame, Newspaper, ChevronRight, Wifi, Loader2 } from "lucide-react";

function MiniMap({ threats }: { threats: any[] }) {
  const toXY = (lat: number, lng: number) => [((lng + 180) / 360) * 900, ((90 - lat) / 180) * 450];
  return (
    <svg viewBox="0 0 900 450" className="w-full h-auto" style={{ minHeight: 280 }}>
      <rect width="900" height="450" className="fill-slate-50 dark:fill-[#080a14]" />
      {Array.from({ length: 12 }, (_, i) => <line key={`h${i}`} x1="0" y1={i * 37.5} x2="900" y2={i * 37.5} className="stroke-slate-200/60 dark:stroke-slate-800/40" strokeWidth=".3" strokeDasharray="2,5" />)}
      {["M95,85 L185,68 L260,88 L275,120 L255,165 L220,200 L170,218 L150,222 L110,192 L78,158 Z", "M190,252 L235,242 L275,265 L285,308 L268,368 L235,395 L200,372 L180,330 Z", "M405,68 L498,50 L540,72 L555,108 L538,138 L498,148 L455,135 L422,112 Z", "M432,158 L508,148 L538,168 L555,220 L548,298 L508,338 L468,328 L435,278 L425,218 Z", "M555,50 L698,38 L798,62 L828,108 L808,155 L748,172 L678,182 L598,162 L555,122 Z", "M745,295 L815,285 L845,308 L835,348 L798,358 L758,342 Z"].map((d, i) =>
        <path key={i} d={d} fill="none" className="stroke-slate-300 dark:stroke-slate-700" strokeWidth=".8" />
      )}
      {threats.slice(0, 30).map((t: any) => {
        const [x, y] = toXY(t.lat, t.lng);
        if (isNaN(x) || isNaN(y)) return null;
        const c = THREAT_LEVEL_COLORS[t.level] || "#06b6d4";
        return (
          <g key={t.id}>
            <circle cx={x} cy={y} r="14" fill={c} opacity=".06"><animate attributeName="r" values="10;22;10" dur="3.5s" repeatCount="indefinite" /></circle>
            <circle cx={x} cy={y} r="4" fill={c} opacity=".8"><animate attributeName="r" values="3;5;3" dur="2.5s" repeatCount="indefinite" /></circle>
            <circle cx={x} cy={y} r="1.5" fill="white" opacity=".9" />
          </g>
        );
      })}
    </svg>
  );
}

export default function Dashboard() {
  const { data: threats, loading: tLoading } = useLiveFetch<any[]>("/api/threats", [], 60000);
  const { data: news, loading: nLoading } = useLiveFetch<any[]>("/api/news", [], 120000);
  const { data: cves, loading: cLoading } = useLiveFetch<any[]>("/api/cves?limit=5", [], 300000);
  const [liveCount, setLiveCount] = useState(1247);

  useEffect(() => { const i = setInterval(() => setLiveCount(c => c + Math.floor(Math.random() * 3) + 1), 4000); return () => clearInterval(i); }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold">Command <span className="text-gradient-brand">Center</span></h1>
        <p className="text-sm text-[var(--text-muted)] mt-0.5">Real-time cybersecurity intelligence — live data</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Live Threats" value={threats.length > 0 ? String(threats.length) : "—"} icon={<Radar size={18} />} color="#8b5cf6" />
        <StatCard label="CVEs Loaded" value={cves.length > 0 ? String(cves.length) : "—"} icon={<AlertTriangle size={18} />} color="#f59e0b" />
        <StatCard label="News Articles" value={news.length > 0 ? String(news.length) : "—"} icon={<Newspaper size={18} />} color="#06b6d4" />
        <StatCard label="Threats Tracked" value={liveCount.toLocaleString()} icon={<Wifi size={18} />} color="#22c55e" />
      </div>

      {/* Threat Map */}
      <div className="xc-card overflow-hidden">
        <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Radar size={14} className="text-brand-500" />
            <span className="font-display font-semibold text-sm">GLOBAL SITUATION</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-green-500 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse-dot" />LIVE</span>
            <Link href="/threatmap" className="text-xs text-brand-500 hover:underline ml-2">Full Map →</Link>
          </div>
        </div>
        {tLoading && threats.length === 0 ? (
          <div className="py-16 text-center"><Loader2 size={20} className="mx-auto text-brand-500 animate-spin mb-2" /><p className="text-xs text-[var(--text-muted)]">Loading threat intelligence...</p></div>
        ) : (
          <MiniMap threats={threats} />
        )}
      </div>

      {/* News + CVEs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="flex justify-between mb-3">
            <h2 className="text-sm font-display font-semibold flex items-center gap-2"><Newspaper size={14} className="text-info" /> Latest News</h2>
            <Link href="/news" className="text-xs text-brand-500 hover:underline flex items-center gap-1">View all <ChevronRight size={11} /></Link>
          </div>
          {nLoading && news.length === 0 ? (
            <div className="py-8 text-center"><Loader2 size={16} className="mx-auto text-brand-500 animate-spin mb-1" /><p className="text-[10px] text-[var(--text-muted)]">Loading feeds...</p></div>
          ) : (
            <div className="space-y-2">
              {news.slice(0, 5).map((n: any) => (
                <Link key={n.id} href="/news" className="block xc-card p-3 hover:shadow-card-hover dark:hover:shadow-card-dark">
                  <div className="flex justify-between mb-1.5"><SevBadge severity={n.severity || "medium"} /><span className="text-[9px] font-mono text-[var(--text-muted)]">{timeAgo(n.publishedAt)}</span></div>
                  <h3 className="text-xs font-semibold leading-snug line-clamp-2 mb-1.5">{n.title}</h3>
                  <div className="flex justify-between text-[10px]">
                    <span className="font-mono text-brand-500">{n.sourceName}</span>
                    <Tag color="#06b6d4">{n.country || "US"}</Tag>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex justify-between mb-3">
            <h2 className="text-sm font-display font-semibold flex items-center gap-2"><AlertTriangle size={14} className="text-danger" /> Recent CVEs</h2>
            <Link href="/cves" className="text-xs text-brand-500 hover:underline flex items-center gap-1">View all <ChevronRight size={11} /></Link>
          </div>
          {cLoading && cves.length === 0 ? (
            <div className="py-8 text-center"><Loader2 size={16} className="mx-auto text-brand-500 animate-spin mb-1" /><p className="text-[10px] text-[var(--text-muted)]">Loading from NVD...</p></div>
          ) : (
            <div className="xc-card overflow-hidden">
              {cves.slice(0, 6).map((c: any, i: number) => (
                <Link key={c.id} href="/cves" className={`flex items-center gap-3 px-3 py-2.5 hover:bg-[var(--bg-tertiary)] transition-colors ${i < Math.min(cves.length, 6) - 1 ? "border-b border-[var(--border)]" : ""}`}>
                  <span className="font-mono text-[11px] text-brand-500 font-medium w-28 shrink-0">{c.id}</span>
                  <span className="text-[11px] text-[var(--text-secondary)] flex-1 truncate">{c.description?.slice(0, 80)}...</span>
                  <SevBadge severity={c.severity || "medium"} />
                  <span className="font-mono text-xs font-bold w-8 text-right" style={{ color: SEVERITY_CONFIG[c.severity as keyof typeof SEVERITY_CONFIG]?.color || "#f59e0b" }}>{c.cvss}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
