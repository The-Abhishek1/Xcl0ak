"use client";
import { useState } from "react";
import { SevBadge, Tag } from "@/components/ui";
import { useLiveFetch } from "@/hooks/use-fetch";
import { timeAgo, REGIONS, NEWS_CATEGORIES } from "@/lib/constants";
import { ArrowLeft, Clock, ExternalLink, RefreshCw, Loader2, Rss } from "lucide-react";

export default function NewsPage() {
  const { data: news, loading, refetch } = useLiveFetch<any[]>("/api/news", [], 120000);
  const [sel, setSel] = useState<any>(null);
  const [fRegion, setFRegion] = useState("All");
  const [fCat, setFCat] = useState("All");
  const filtered = news.filter((n: any) => (fRegion === "All" || n.region === fRegion) && (fCat === "All" || n.category === fCat));

  if (sel) return (
    <div className="animate-fade-in">
      <button onClick={() => setSel(null)} className="inline-flex items-center gap-1.5 text-sm text-brand-500 hover:underline mb-5">
        <ArrowLeft size={14} /> Back to News
      </button>
      <div className="xc-card p-6">
        <div className="flex gap-2 flex-wrap mb-3">
          <SevBadge severity={sel.severity} size="md" />
          <Tag color="#06b6d4">{sel.country}</Tag>
          <Tag color="#8b5cf6">{sel.category}</Tag>
        </div>
        <h1 className="text-xl font-display font-bold leading-tight mb-3">{sel.title}</h1>
        <div className="flex gap-4 text-sm text-[var(--text-muted)] mb-6">
          <span className="font-mono text-brand-500">{sel.sourceName}</span>
          <span className="flex items-center gap-1"><Clock size={11} /> {timeAgo(sel.publishedAt)}</span>
          {sel.sourceUrl && (
            <a href={sel.sourceUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 text-info hover:underline">
              <ExternalLink size={11} /> Read original
            </a>
          )}
        </div>

        {/* Summary — always show */}
        <div className="rounded-xl bg-brand-500/5 dark:bg-brand-400/5 p-4 mb-6" style={{ borderLeft: "3px solid var(--brand)" }}>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-medium">{sel.summary}</p>
        </div>

        {/* Full content — ONLY show if different from summary */}
        {sel.content && sel.content.length > 0 && (
          <div className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap mb-6">
            {sel.content}
          </div>
        )}

        {/* If no extra content, show a note */}
        {(!sel.content || sel.content.length === 0) && (
          <div className="text-sm text-[var(--text-muted)] italic mb-6">
            Full article available at the source.{" "}
            {sel.sourceUrl && (
              <a href={sel.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-brand-500 hover:underline not-italic">
                Read the full article →
              </a>
            )}
          </div>
        )}

        {sel.cves?.length > 0 && (
          <div className="flex items-center gap-2 pt-4 border-t border-[var(--border)]">
            <span className="text-xs font-semibold text-[var(--text-muted)]">Related CVEs:</span>
            {sel.cves.map((c: string) => <Tag key={c} color="#22d3ee">{c}</Tag>)}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-display font-bold">Cybersecurity <span className="text-gradient-brand">News</span></h1>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-[var(--text-muted)] flex items-center gap-1"><Rss size={10} className="text-brand-500" /> Live RSS</span>
          <button onClick={refetch} className="p-2 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)]">
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>
      <div className="flex gap-1.5 mb-2 flex-wrap">
        {REGIONS.map(r => <button key={r} onClick={() => setFRegion(r)} className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold border transition ${fRegion === r ? "bg-brand-500/8 text-brand-500 border-brand-500/20" : "text-[var(--text-muted)] border-[var(--border)] hover:bg-[var(--bg-tertiary)]"}`}>{r}</button>)}
      </div>
      <div className="flex gap-1.5 mb-4 flex-wrap">
        {["All", ...NEWS_CATEGORIES].map(c => <button key={c} onClick={() => setFCat(c)} className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition ${fCat === c ? "bg-purple-500/8 text-purple-600 dark:text-purple-400 border-purple-500/20" : "text-[var(--text-muted)] border-[var(--border)] hover:bg-[var(--bg-tertiary)]"}`}>{c}</button>)}
      </div>
      <div className="text-xs text-[var(--text-muted)] mb-3">
        {loading ? <span className="flex items-center gap-1"><Loader2 size={11} className="animate-spin" /> Fetching...</span> : <span>{filtered.length} articles</span>}
      </div>
      {loading && news.length === 0 ? (
        <div className="py-20 text-center"><Loader2 size={24} className="mx-auto text-brand-500 animate-spin mb-2" /><p className="text-sm text-[var(--text-muted)]">Loading live feeds...</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {filtered.map((n: any) => (
            <button key={n.id} onClick={() => setSel(n)} className="xc-card p-4 text-left hover:shadow-card-hover dark:hover:shadow-card-dark transition-all group">
              <div className="flex justify-between items-start mb-2"><SevBadge severity={n.severity} /><span className="text-[9px] font-mono text-[var(--text-muted)]">{timeAgo(n.publishedAt)}</span></div>
              <h3 className="text-sm font-semibold leading-snug line-clamp-2 mb-2 group-hover:text-brand-500 transition-colors">{n.title}</h3>
              <p className="text-[10px] text-[var(--text-muted)] leading-relaxed line-clamp-2 mb-3">{n.summary}</p>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono text-brand-500">{n.sourceName}</span>
                <div className="flex gap-1.5"><Tag color="#06b6d4">{n.country}</Tag><Tag color="#8b5cf6">{n.category}</Tag></div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
