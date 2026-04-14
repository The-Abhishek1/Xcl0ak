"use client";

import { useState } from "react";
import { SEVERITY_CONFIG } from "@/lib/constants";
import { ChevronUp, ChevronDown, Copy, Check } from "lucide-react";
import clsx from "clsx";

export function SevBadge({ severity, size = "sm" }: { severity: string; size?: "sm" | "md" }) {
  const c = SEVERITY_CONFIG[severity as keyof typeof SEVERITY_CONFIG] || SEVERITY_CONFIG.info;
  return (
    <span className={clsx("tag-pill border", size === "md" ? "px-2.5 py-1 text-xs" : "px-2 py-0.5 text-[10px]")}
      style={{ color: c.color, background: c.bg, borderColor: `${c.color}20` }}>
      <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: c.color }} />
      {c.label}
    </span>
  );
}

export function Tag({ children, color, onClick }: { children: React.ReactNode; color?: string; onClick?: () => void }) {
  const col = color || "var(--brand)";
  return (
    <span onClick={onClick}
      className={clsx("tag-pill border transition-all", onClick && "cursor-pointer hover:brightness-110")}
      style={{ color: col, background: `${col}08`, borderColor: `${col}18` }}>
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const m: Record<string, { c: string; b: string }> = {
    Active: { c: "#ef4444", b: "rgba(239,68,68,0.08)" },
    Patched: { c: "#22c55e", b: "rgba(34,197,94,0.08)" },
    "Under Review": { c: "#eab308", b: "rgba(234,179,8,0.08)" },
    PENDING: { c: "#eab308", b: "rgba(234,179,8,0.08)" },
    APPROVED: { c: "#22c55e", b: "rgba(34,197,94,0.08)" },
    REJECTED: { c: "#ef4444", b: "rgba(239,68,68,0.08)" },
  };
  const cfg = m[status] || m.PENDING;
  return <span className="tag-pill" style={{ color: cfg.c, background: cfg.b }}>{status}</span>;
}

export function Votes({ up, down, id }: { up: number; down: number; id: string }) {
  const [votes, setVotes] = useState({ up, down, userVote: null as "up" | "down" | null });
  const handle = (dir: "up" | "down") => {
    setVotes(v => {
      if (v.userVote === dir) return { ...v, [dir]: v[dir] - 1, userVote: null };
      const prev = v.userVote;
      return { up: v.up + (dir === "up" ? 1 : 0) - (prev === "up" ? 1 : 0), down: v.down + (dir === "down" ? 1 : 0) - (prev === "down" ? 1 : 0), userVote: dir };
    });
  };
  const score = votes.up - votes.down;
  return (
    <div className="flex flex-col items-center gap-0.5">
      <button onClick={() => handle("up")} className={clsx("p-1 rounded-lg transition-all", votes.userVote === "up" ? "bg-brand-500/10 text-brand-500" : "text-[var(--text-muted)] hover:text-brand-500 hover:bg-brand-500/5")}>
        <ChevronUp size={16} strokeWidth={2.5} />
      </button>
      <span className={clsx("font-mono text-xs font-bold tabular-nums min-w-[24px] text-center", score > 0 ? "text-brand-500" : score < 0 ? "text-danger" : "text-[var(--text-muted)]")}>{score}</span>
      <button onClick={() => handle("down")} className={clsx("p-1 rounded-lg transition-all", votes.userVote === "down" ? "bg-danger-muted text-danger" : "text-[var(--text-muted)] hover:text-danger hover:bg-danger-muted")}>
        <ChevronDown size={16} strokeWidth={2.5} />
      </button>
    </div>
  );
}

export function StatCard({ label, value, icon, color }: { label: string; value: string; icon: React.ReactNode; color: string }) {
  return (
    <div className="xc-card p-4 flex items-center gap-3.5">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}0a`, color }}>{icon}</div>
      <div>
        <div className="text-xl font-bold font-mono" style={{ color }}>{value}</div>
        <div className="text-[11px] text-[var(--text-muted)]">{label}</div>
      </div>
    </div>
  );
}

export function CodeBlock({ code, lang }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div className="rounded-xl border border-[var(--border)] overflow-hidden bg-[var(--bg-secondary)] dark:bg-[#0d1117]">
      <div className="flex justify-between items-center px-4 py-2 border-b border-[var(--border)]">
        <span className="text-[10px] font-mono text-[var(--text-muted)]">{lang || "code"}</span>
        <button onClick={copy} className="text-[10px] font-mono text-[var(--text-muted)] hover:text-[var(--text)] transition-colors flex items-center gap-1">
          {copied ? <><Check size={10} /> Copied</> : <><Copy size={10} /> Copy</>}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto"><code className="text-[11px] font-mono text-[var(--text-secondary)] dark:text-[#c9d1d9] leading-relaxed whitespace-pre">{code}</code></pre>
    </div>
  );
}
