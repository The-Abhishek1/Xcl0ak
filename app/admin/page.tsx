"use client";
import { useState } from "react";
import { SevBadge, Tag, StatusBadge } from "@/components/ui";
import { generateUsername, timeAgo } from "@/lib/constants";
import { Settings, ShieldAlert, Check, X, Eye, ArrowLeft, Clock, AlertTriangle, Flag, FileCode, Shield } from "lucide-react";

interface PendingItem {
  id: string;
  type: "cve" | "ctf";
  title: string;
  by: string;
  submittedAt: number;
  severity?: string;
  category?: string;
  description: string;
  details: Record<string, string>;
}

const MOCK_PENDING: PendingItem[] = [
  { id: "CVE-2025-4001", type: "cve", title: "Remote Code Execution in libexpat XML Parser", by: generateUsername(), submittedAt: Date.now() - 3600000, severity: "critical", description: "Type confusion in libexpat 2.6.0 through 2.6.3 allows remote attackers to execute arbitrary code via crafted XML input that triggers an out-of-bounds write in the XML_Parse function.", details: { cvss: "9.8", vendor: "libexpat", product: "libexpat", affected: "2.6.0-2.6.3" } },
  { id: "CVE-2025-4002", type: "cve", title: "SQL Injection in WordPress REST API Endpoint", by: generateUsername(), submittedAt: Date.now() - 7200000, severity: "high", description: "Improper input sanitization in the wp-json/wp/v2/posts endpoint allows authenticated users with contributor role to execute arbitrary SQL queries.", details: { cvss: "8.6", vendor: "WordPress", product: "WordPress Core", affected: "6.4.0-6.5.2" } },
  { id: "ctf-001", type: "ctf", title: "Heap Exploitation 101 — Use After Free", by: generateUsername(), submittedAt: Date.now() - 14400000, category: "Binary", description: "Exploit a use-after-free vulnerability in a custom memory allocator. The challenge binary has ASLR and NX enabled but no stack canary. Your goal is to get a shell.", details: { difficulty: "Hard", points: "500", files: "2 (binary + source)" } },
  { id: "ctf-002", type: "ctf", title: "Advanced JWT Attacks — Algorithm Confusion", by: generateUsername(), submittedAt: Date.now() - 28800000, category: "Web", description: "A web application uses JWT for authentication. Find and exploit the algorithm confusion vulnerability to forge an admin token and access the flag.", details: { difficulty: "Medium", points: "300", files: "1 (docker-compose)" } },
  { id: "CVE-2025-4003", type: "cve", title: "Privilege Escalation via Container Runtime Vulnerability", by: generateUsername(), submittedAt: Date.now() - 36000000, severity: "high", description: "A flaw in the container runtime's mount handling allows a container process to escape its namespace and gain root access on the host system.", details: { cvss: "8.8", vendor: "containerd", product: "containerd", affected: "1.7.0-1.7.18" } },
];

export default function AdminPage() {
  const [items, setItems] = useState(MOCK_PENDING);
  const [activeTab, setActiveTab] = useState<"all" | "cve" | "ctf">("all");
  const [viewing, setViewing] = useState<PendingItem | null>(null);

  const filtered = activeTab === "all" ? items : items.filter(i => i.type === activeTab);
  const remove = (id: string) => { setItems(p => p.filter(i => i.id !== id)); setViewing(null); };

  // ─── Detail view ───
  if (viewing) return (
    <div className="animate-fade-in">
      <button onClick={() => setViewing(null)} className="inline-flex items-center gap-1.5 text-sm text-brand-500 hover:underline mb-5"><ArrowLeft size={14} /> Back to Queue</button>
      <div className="xc-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase ${viewing.type === "cve" ? "bg-warn-muted text-warn" : "bg-info-muted text-info"}`}>{viewing.type}</span>
          {viewing.severity && <SevBadge severity={viewing.severity} size="md" />}
          {viewing.category && <Tag color="#06b6d4">{viewing.category}</Tag>}
        </div>

        <h2 className="text-lg font-display font-bold mb-2">{viewing.title}</h2>

        <div className="flex gap-3 text-xs text-[var(--text-muted)] mb-5">
          <span>Submitted by <span className="text-brand-500 font-mono font-medium">@{viewing.by}</span></span>
          <span className="flex items-center gap-1"><Clock size={10} /> {timeAgo(viewing.submittedAt)}</span>
        </div>

        {/* Description */}
        <div className="xc-card p-4 mb-4">
          <h3 className="text-xs font-semibold text-[var(--text-muted)] mb-2">Description</h3>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{viewing.description}</p>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-6">
          {Object.entries(viewing.details).map(([k, v]) => (
            <div key={k} className="rounded-xl bg-[var(--bg-tertiary)] p-3">
              <div className="text-[9px] text-[var(--text-muted)] uppercase">{k}</div>
              <div className="text-sm font-semibold font-mono mt-0.5">{v}</div>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 pt-4 border-t border-[var(--border)]">
          <button onClick={() => remove(viewing.id)}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-green-500 text-white font-semibold text-sm shadow-md hover:shadow-lg transition">
            <Check size={14} /> Approve & Publish
          </button>
          <button onClick={() => remove(viewing.id)}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-danger text-white font-semibold text-sm shadow-md hover:shadow-lg transition">
            <X size={14} /> Reject
          </button>
        </div>
      </div>
    </div>
  );

  // ─── Queue list ───
  return (
    <div className="animate-fade-in">
      <h1 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
        <Settings size={18} className="text-danger" /> Admin Panel
      </h1>

      <div className="rounded-xl bg-danger-muted border border-danger/20 px-5 py-3 mb-5 text-xs text-danger flex items-start gap-2">
        <ShieldAlert size={14} className="mt-0.5 shrink-0" />
        <div>
          <strong>Admin controls.</strong> CVE submissions and CTF challenges require your approval before becoming visible to all users.
          All actions are logged with your session ID.
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1.5 mb-5">
        {(["all", "cve", "ctf"] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition uppercase flex items-center gap-1.5 ${activeTab === tab
              ? "bg-danger-muted text-danger border-danger/20"
              : "text-[var(--text-muted)] border-[var(--border)] hover:bg-[var(--bg-tertiary)]"}`}>
            {tab === "cve" && <AlertTriangle size={11} />}
            {tab === "ctf" && <Flag size={11} />}
            {tab === "all" ? `All Pending (${items.length})` : `${tab.toUpperCase()} (${items.filter(i => i.type === tab).length})`}
          </button>
        ))}
      </div>

      {/* Queue */}
      <div className="xc-card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <Check size={32} className="mx-auto text-green-500 mb-3" />
            <p className="text-sm font-semibold">All caught up!</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">No pending items to review.</p>
          </div>
        ) : (
          filtered.map((item, i) => (
            <div key={item.id} className={`flex items-center gap-4 px-5 py-4 hover:bg-[var(--bg-tertiary)] transition-colors ${i < filtered.length - 1 ? "border-b border-[var(--border)]" : ""}`}>
              <span className={`px-2.5 py-1 rounded-lg text-[9px] font-mono font-bold uppercase shrink-0 ${item.type === "cve" ? "bg-warn-muted text-warn" : "bg-info-muted text-info"}`}>
                {item.type}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate">{item.title}</div>
                <div className="text-[10px] text-[var(--text-muted)] mt-0.5 flex items-center gap-2 flex-wrap">
                  By <span className="text-brand-500 font-mono">@{item.by}</span>
                  <span className="flex items-center gap-0.5"><Clock size={9} /> {timeAgo(item.submittedAt)}</span>
                  {item.severity && <SevBadge severity={item.severity} />}
                  {item.category && <Tag color="#06b6d4">{item.category}</Tag>}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => setViewing(item)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border)] text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition">
                  <Eye size={11} /> Review
                </button>
                <button onClick={() => remove(item.id)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-success-muted text-success text-xs font-semibold border border-success/20 hover:bg-success/10 transition">
                  <Check size={11} /> Approve
                </button>
                <button onClick={() => remove(item.id)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-danger-muted text-danger text-xs font-semibold border border-danger/20 hover:bg-danger/10 transition">
                  <X size={11} /> Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
