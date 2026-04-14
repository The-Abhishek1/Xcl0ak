"use client";
import { useState } from "react";
import { SevBadge, StatusBadge, CodeBlock } from "@/components/ui";
import { useFetch } from "@/hooks/use-fetch";
import { SEVERITY_CONFIG } from "@/lib/constants";
import { AlertTriangle, ArrowLeft, Shield, Clock, Search, RefreshCw, Loader2 } from "lucide-react";

export default function CVEPage() {
  const [keyword, setKeyword] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const { data: cves, loading, error, refetch } = useFetch<any[]>(
    `/api/cves?keyword=${encodeURIComponent(keyword)}&limit=25`,
    []
  );
  const [sel, setSel] = useState<any>(null);
  const [fSev, setFSev] = useState("All");
  const [rTab, setRTab] = useState<"snort" | "yara">("snort");

  const filtered = fSev === "All" ? cves : cves.filter((c: any) => c.severity === fSev);

  const doSearch = () => { setKeyword(searchInput); setSel(null); };

  // ─── Detail View ───
  if (sel) return (
    <div className="animate-fade-in">
      <button onClick={() => setSel(null)} className="inline-flex items-center gap-1.5 text-sm text-brand-500 hover:underline mb-5"><ArrowLeft size={14} /> Back</button>
      <div className="flex gap-3 flex-wrap mb-3">
        <span className="font-mono text-lg font-bold text-brand-500">{sel.id}</span>
        <SevBadge severity={sel.severity} size="md" />
        <StatusBadge status={sel.status} />
      </div>
      <h1 className="text-lg font-display font-bold mb-4">{sel.title}</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-5">
        {[["CVSS", sel.cvss, SEVERITY_CONFIG[sel.severity as keyof typeof SEVERITY_CONFIG]?.color || "#ef4444"], ["Vendor", sel.vendor, "#06b6d4"], ["Product", sel.product, "#8b5cf6"], ["Published", sel.published, "#f59e0b"]].map(([l, v, c]) =>
          <div key={l as string} className="rounded-xl bg-[var(--bg-tertiary)] p-3"><div className="text-[9px] text-[var(--text-muted)]">{l as string}</div><div className="text-sm font-bold font-mono" style={{ color: c as string }}>{String(v)}</div></div>
        )}
      </div>
      <div className="xc-card p-5 mb-4">
        <h3 className="text-sm font-semibold mb-2">Description</h3>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{sel.description}</p>
      </div>
      {sel.timeline && sel.timeline.length > 0 && (
        <div className="xc-card p-5 mb-4">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><Clock size={13} /> Timeline</h3>
          <div className="relative pl-4 border-l-2 border-[var(--border)] space-y-4">
            {sel.timeline.map((t: any, i: number) => (
              <div key={i} className="relative">
                <span className="absolute -left-[calc(1rem+5px)] w-2.5 h-2.5 rounded-full border-2 border-[var(--bg)]" style={{ background: { discovery: "#06b6d4", notification: "#f59e0b", published: "#ef4444", exploit: "#8b5cf6", patch: "#22c55e" }[t.type as string] || "#94a3b8" }} />
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-[var(--text-muted)] w-24 shrink-0">{t.date}</span>
                  <span className="text-xs text-[var(--text-secondary)]">{t.event}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {sel.references && sel.references.length > 0 && (
        <div className="xc-card p-5 mb-4">
          <h3 className="text-sm font-semibold mb-2">References</h3>
          <div className="space-y-1">
            {sel.references.map((ref: string, i: number) => (
              <a key={i} href={ref} target="_blank" rel="noopener noreferrer" className="block text-xs text-brand-500 hover:underline truncate">{ref}</a>
            ))}
          </div>
        </div>
      )}
      <div className="xc-card p-5 mb-4">
        <h3 className="text-sm font-semibold mb-2 flex items-center gap-2"><Shield size={13} /> Mitigations</h3>
        <div className="rounded-xl bg-[var(--bg-tertiary)] p-3.5 text-xs font-mono text-[var(--text-secondary)] leading-loose whitespace-pre-wrap">{sel.mitigations}</div>
      </div>
      <div className="xc-card p-5">
        <h3 className="text-sm font-semibold mb-3">Detection Rules</h3>
        <div className="flex gap-1.5 mb-3">
          {(["snort", "yara"] as const).map(r => <button key={r} onClick={() => setRTab(r)} className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-semibold uppercase border transition ${rTab === r ? "bg-brand-500/8 text-brand-500 border-brand-500/20" : "text-[var(--text-muted)] border-transparent hover:bg-[var(--bg-tertiary)]"}`}>{r}</button>)}
        </div>
        <CodeBlock code={rTab === "snort" ? sel.snortRule : sel.yaraRule} lang={rTab} />
      </div>
    </div>
  );

  // ─── List View ───
  return (
    <div className="animate-fade-in">
      <h1 className="text-xl font-display font-bold mb-4">CVE <span className="text-gradient-brand">Tracker</span></h1>

      {/* Search */}
      <div className="flex gap-2 mb-4">
        <div className="flex items-center gap-2 flex-1 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-xl px-3 py-2 focus-within:border-brand-400">
          <Search size={14} className="text-[var(--text-muted)]" />
          <input value={searchInput} onChange={e => setSearchInput(e.target.value)} onKeyDown={e => e.key === "Enter" && doSearch()}
            placeholder="Search CVEs (e.g. apache, linux kernel, chrome)..."
            className="bg-transparent text-sm outline-none w-full" />
        </div>
        <button onClick={doSearch} className="px-4 py-2 rounded-xl bg-brand-500 text-white text-sm font-semibold">Search NVD</button>
        <button onClick={refetch} className="p-2 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)]">
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Severity filter */}
      <div className="flex gap-1.5 mb-4">
        {["All", "critical", "high", "medium", "low"].map(s => (
          <button key={s} onClick={() => setFSev(s)} className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold border capitalize transition ${fSev === s ? "bg-brand-500/8 text-brand-500 border-brand-500/20" : "text-[var(--text-muted)] border-[var(--border)] hover:bg-[var(--bg-tertiary)]"}`}>{s}</button>
        ))}
      </div>

      {/* Status */}
      <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-3">
        <AlertTriangle size={11} />
        {loading ? <span className="flex items-center gap-1"><Loader2 size={11} className="animate-spin" /> Fetching from NVD...</span>
          : error ? <span className="text-danger">Error: {error}</span>
            : <span>{filtered.length} CVEs from NVD • Click for full details</span>}
      </div>

      {/* Table */}
      <div className="xc-card overflow-hidden">
        <div className="hidden md:grid grid-cols-[120px_1fr_70px_50px_90px_70px] items-center px-4 py-2.5 border-b border-[var(--border)] text-[10px] font-mono font-semibold text-[var(--text-muted)] uppercase tracking-wider gap-2">
          <span>CVE ID</span><span>Description</span><span>Severity</span><span>CVSS</span><span>Vendor</span><span>Status</span>
        </div>
        {loading && filtered.length === 0 ? (
          <div className="py-16 text-center"><Loader2 size={24} className="mx-auto text-brand-500 animate-spin mb-2" /><p className="text-sm text-[var(--text-muted)]">Loading CVEs from NVD...</p></div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center"><p className="text-sm text-[var(--text-muted)]">No CVEs found. Try a different search.</p></div>
        ) : filtered.map((c: any, i: number) => (
          <button key={c.id} onClick={() => setSel(c)} className={`w-full text-left grid grid-cols-1 md:grid-cols-[120px_1fr_70px_50px_90px_70px] items-center px-4 py-2.5 gap-2 hover:bg-[var(--bg-tertiary)] transition-colors group ${i < filtered.length - 1 ? "border-b border-[var(--border)]" : ""}`}>
            <span className="font-mono text-xs text-brand-500 font-medium group-hover:underline">{c.id}</span>
            <span className="text-xs text-[var(--text-secondary)] truncate group-hover:text-[var(--text)] transition-colors">{c.description?.slice(0, 120)}...</span>
            <SevBadge severity={c.severity} />
            <span className="font-mono text-sm font-bold" style={{ color: SEVERITY_CONFIG[c.severity as keyof typeof SEVERITY_CONFIG]?.color }}>{c.cvss}</span>
            <span className="text-[10px] text-[var(--text-muted)] truncate">{c.vendor}</span>
            <StatusBadge status={c.status} />
          </button>
        ))}
      </div>
    </div>
  );
}
