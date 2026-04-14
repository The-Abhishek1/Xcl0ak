"use client";
import { useState, useEffect } from "react";
import { SevBadge, Tag } from "@/components/ui";
import { useLiveFetch } from "@/hooks/use-fetch";
import { timeAgo, THREAT_LEVEL_COLORS } from "@/lib/constants";
import { Radar, MapPin, Shield, Clock, Crosshair, Server, X, Wifi, Layers, RefreshCw, Loader2 } from "lucide-react";

const CONTS = ["M95,85 L185,68 L260,88 L275,120 L255,165 L220,200 L170,218 L150,222 L110,192 L78,158 Z", "M190,252 L235,242 L275,265 L285,308 L268,368 L235,395 L200,372 L180,330 Z", "M405,68 L498,50 L540,72 L555,108 L538,138 L498,148 L455,135 L422,112 Z", "M432,158 L508,148 L538,168 L555,220 L548,298 L508,338 L468,328 L435,278 L425,218 Z", "M555,50 L698,38 L798,62 L828,108 L808,155 L748,172 L678,182 L598,162 L555,122 Z", "M538,130 L598,118 L618,150 L598,182 L562,175 L538,155 Z", "M745,295 L815,285 L845,308 L835,348 L798,358 L758,342 Z"];

export default function ThreatMapPage() {
  const { data: threats, loading, refetch } = useLiveFetch<any[]>("/api/threats", [], 60000); // refresh every minute
  const [sel, setSel] = useState<any>(null);
  const [layerOpen, setLayerOpen] = useState(true);
  const [live, setLive] = useState(1247);
  const [typeFilter, setTypeFilter] = useState("All");

  useEffect(() => { const i = setInterval(() => setLive(c => c + Math.floor(Math.random() * 3) + 1), 3500); return () => clearInterval(i); }, []);

  const filtered = typeFilter === "All" ? threats : threats.filter((t: any) => t.type === typeFilter);
  const types = [...new Set(threats.map((t: any) => t.type))];
  const xy = (lat: number, lng: number): [number, number] => [(lng + 180) / 360 * 900, (90 - lat) / 180 * 450];

  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-display font-bold">Threat <span className="text-gradient-brand">Intelligence</span></h1>
        <button onClick={refetch} className="p-2 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)]">
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="xc-card overflow-hidden">
        <div className="px-4 py-2.5 border-b border-[var(--border)] flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <Radar size={14} className="text-brand-500" />
            <span className="font-display font-semibold text-sm">GLOBAL SITUATION</span>
            <span className="text-[9px] font-mono text-[var(--text-muted)]">{new Date().toUTCString().slice(0, 25)} UTC</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-green-500 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse-dot" />LIVE</span>
            <span className="text-[10px] font-mono text-[var(--text-muted)]">{live.toLocaleString()} threats</span>
          </div>
        </div>

        <div className="relative" style={{ minHeight: 420 }}>
          {/* Type filter sidebar */}
          {layerOpen && (
            <div className="absolute top-3 left-3 w-44 glass-strong rounded-xl overflow-hidden z-20 shadow-lg">
              <div className="px-3 py-2 border-b border-[var(--border)] text-[10px] font-mono font-semibold text-[var(--text-muted)]">THREAT TYPES</div>
              <div className="py-1 max-h-64 overflow-y-auto">
                <button onClick={() => setTypeFilter("All")} className={`w-full text-left px-3 py-1.5 text-[10px] font-mono transition ${typeFilter === "All" ? "bg-brand-500/8 text-brand-500" : "text-[var(--text-muted)] hover:bg-[var(--bg-tertiary)]"}`}>
                  ALL ({threats.length})
                </button>
                {types.map(type => (
                  <button key={type} onClick={() => setTypeFilter(type)}
                    className={`w-full text-left px-3 py-1.5 text-[10px] font-mono capitalize transition ${typeFilter === type ? "bg-brand-500/8 text-brand-500" : "text-[var(--text-muted)] hover:bg-[var(--bg-tertiary)]"}`}>
                    {type.replace(/_/g, " ")} ({threats.filter((t: any) => t.type === type).length})
                  </button>
                ))}
              </div>
            </div>
          )}

          <button onClick={() => setLayerOpen(!layerOpen)} className="absolute top-3 right-3 z-20 p-2 glass-strong rounded-lg text-[var(--text-muted)] hover:text-[var(--text)]"><Layers size={14} /></button>

          {loading && threats.length === 0 ? (
            <div className="flex items-center justify-center" style={{ minHeight: 400 }}>
              <div className="text-center"><Loader2 size={24} className="mx-auto text-brand-500 animate-spin mb-2" /><p className="text-sm text-[var(--text-muted)]">Loading threat intelligence...</p></div>
            </div>
          ) : (
            <svg viewBox="0 0 900 450" className="w-full" style={{ minHeight: 400 }}>
              <rect width="900" height="450" className="fill-slate-50 dark:fill-[#080a14]" />
              {Array.from({ length: 13 }, (_, i) => <line key={`h${i}`} x1="0" y1={i * 37.5} x2="900" y2={i * 37.5} className="stroke-slate-200/60 dark:stroke-slate-800/40" strokeWidth=".3" strokeDasharray="2,6" />)}
              {Array.from({ length: 25 }, (_, i) => <line key={`v${i}`} x1={i * 37.5} y1="0" x2={i * 37.5} y2="450" className="stroke-slate-200/60 dark:stroke-slate-800/40" strokeWidth=".3" strokeDasharray="2,6" />)}
              {CONTS.map((d, i) => <path key={i} d={d} fill="none" className="stroke-slate-300 dark:stroke-slate-700" strokeWidth=".8" />)}
              {filtered.map((t: any) => {
                const [x, y] = xy(t.lat, t.lng);
                if (isNaN(x) || isNaN(y)) return null;
                const c = THREAT_LEVEL_COLORS[t.level] || "#06b6d4";
                const s = sel?.id === t.id;
                return (
                  <g key={t.id} onClick={() => setSel(t)} className="cursor-pointer">
                    <circle cx={x} cy={y} r="16" fill={c} opacity=".06"><animate attributeName="r" values="10;24;10" dur="3.5s" repeatCount="indefinite" /></circle>
                    <circle cx={x} cy={y} r={s ? 6 : 4} fill={c} opacity=".85"><animate attributeName="r" values={s ? "5;7;5" : "3;5;3"} dur="2.5s" repeatCount="indefinite" /></circle>
                    <circle cx={x} cy={y} r="1.5" fill="white" opacity=".9" />
                    {s && <text x={x} y={y - 14} textAnchor="middle" fill={c} fontSize="8" fontFamily="monospace" fontWeight="600">{t.city}</text>}
                  </g>
                );
              })}
              <g transform="translate(16,428)"><text className="fill-slate-400 dark:fill-slate-600" fontSize="7" fontFamily="monospace" fontWeight="600">LEGEND</text>{[["critical", "High Alert"], ["high", "Elevated"], ["medium", "Monitoring"]].map(([k, v], i) => <g key={k} transform={`translate(${55 + i * 110},0)`}><circle cx="0" cy="-2" r="3.5" fill={THREAT_LEVEL_COLORS[k]} /><text x="7" y="1" className="fill-slate-500" fontSize="7" fontFamily="monospace">{v}</text></g>)}</g>
            </svg>
          )}

          {/* Detail panel */}
          {sel && (
            <div className="absolute top-3 right-14 w-80 glass-strong rounded-xl overflow-hidden z-20 shadow-xl animate-slide-right">
              <div className="px-4 py-3 border-b border-[var(--border)] flex justify-between"><span className="font-semibold text-sm flex items-center gap-1.5"><MapPin size={13} style={{ color: THREAT_LEVEL_COLORS[sel.level] }} />{sel.city}{sel.countryName ? `, ${sel.countryName}` : ""}</span><button onClick={() => setSel(null)} className="text-[var(--text-muted)] hover:text-[var(--text)] p-1"><X size={14} /></button></div>
              <div className="p-4 space-y-3">
                <div className="flex gap-2 flex-wrap">
                  <SevBadge severity={sel.level === "monitoring" ? "low" : sel.level === "elevated" ? "medium" : sel.level} />
                  <Tag color="#06b6d4">{(sel.type || "").replace(/_/g, " ")}</Tag>
                  {sel.active && <span className="text-[9px] font-mono text-danger flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse-dot" />ACTIVE</span>}
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{sel.desc}</p>
                <div className="space-y-1.5 text-[10px] text-[var(--text-muted)]">
                  {sel.timestamp && <div><Clock size={10} className="inline" /> {timeAgo(sel.timestamp)}</div>}
                  <div><Shield size={10} className="inline" /> Source: <span className="text-[var(--text-secondary)]">{sel.source}</span></div>
                  {sel.vector && <div><Crosshair size={10} className="inline" /> Vector: <span className="text-[var(--text-secondary)]">{sel.vector}</span></div>}
                  {sel.sectors?.length > 0 && <div><Server size={10} className="inline" /> Sectors: <span className="text-[var(--text-secondary)]">{sel.sectors.join(", ")}</span></div>}
                </div>
                {sel.ttps?.length > 0 && <div><div className="text-[9px] font-mono text-[var(--text-muted)] mb-1">MITRE ATT&CK</div><div className="flex gap-1 flex-wrap">{sel.ttps.map((t: string) => <Tag key={t} color="#8b5cf6">{t}</Tag>)}</div></div>}
                {sel.iocs?.length > 0 && <div><div className="text-[9px] font-mono text-[var(--text-muted)] mb-1">IOCs</div><div className="rounded-lg bg-[var(--bg-tertiary)] p-2">{sel.iocs.map((i: string) => <div key={i} className="text-[10px] font-mono text-danger break-all">{i}</div>)}</div></div>}
                {sel.cves?.length > 0 && <div className="flex gap-1.5">{sel.cves.map((c: string) => <Tag key={c} color="#22d3ee">{c}</Tag>)}</div>}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Threat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {filtered.map((t: any) => {
          const c = THREAT_LEVEL_COLORS[t.level] || "#06b6d4";
          return (
            <button key={t.id} onClick={() => setSel(t)} className="xc-card p-4 text-left hover:shadow-card-hover dark:hover:shadow-card-dark transition-all">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-sm flex items-center gap-1.5"><MapPin size={12} style={{ color: c }} /> {t.city || "Unknown"}</span>
                {t.active && <span className="w-2 h-2 rounded-full bg-danger animate-pulse-dot" />}
              </div>
              <div className="flex gap-1.5 mb-2">
                <SevBadge severity={t.level === "monitoring" ? "low" : t.level === "elevated" ? "medium" : t.level} />
                <Tag color="#06b6d4">{(t.type || "").replace(/_/g, " ")}</Tag>
              </div>
              <p className="text-[10px] text-[var(--text-muted)] leading-relaxed line-clamp-2 mb-2">{t.desc}</p>
              <div className="flex items-center gap-3 text-[9px] text-[var(--text-muted)]">
                {t.timestamp && <span><Clock size={9} className="inline" /> {timeAgo(t.timestamp)}</span>}
                <span><Shield size={9} className="inline" /> {t.source}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
