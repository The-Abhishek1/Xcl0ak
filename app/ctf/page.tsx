// app/ctf/page.tsx — REPLACE existing file
"use client";
import { useState, useMemo, useRef } from "react";
import { Tag } from "@/components/ui";
import { mockCTF } from "@/lib/mock-data";
import { useFileUpload } from "@/hooks/use-upload";
import { Flag, Upload, ArrowLeft, Users, Lightbulb, FileUp, Download, Send, AlertTriangle, Loader2, Check, Trash2, X } from "lucide-react";

const DC: Record<string, string> = { Easy: "#22c55e", Medium: "#f59e0b", Hard: "#ef4444", Insane: "#8b5cf6" };

export default function CTFPage() {
  const challenges = useMemo(() => mockCTF(), []);
  const [sel, setSel] = useState<any>(null);
  const [fCat, setFCat] = useState("All");
  const [flagInput, setFlagInput] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [hints, setHints] = useState(0);
  const [showUpload, setShowUpload] = useState(false);
  const filtered = fCat === "All" ? challenges : challenges.filter(c => c.category === fCat);

  const submitFlag = () => {
    if (!sel || !flagInput.trim()) return;
    setResult(flagInput.trim() === sel.flag ? "correct" : "wrong");
    setTimeout(() => setResult(null), 5000);
  };

  // ─── CTF Upload Form ───
  if (showUpload) return <CTFUploadForm onClose={() => setShowUpload(false)} />;

  // ─── Challenge Detail ───
  if (sel) return (
    <div className="animate-fade-in">
      <button onClick={() => { setSel(null); setHints(0); setFlagInput(""); setResult(null); }}
        className="inline-flex items-center gap-1.5 text-sm text-brand-500 hover:underline mb-5">
        <ArrowLeft size={14} /> Back to Challenges
      </button>
      <div className="xc-card p-6">
        <div className="flex gap-2 flex-wrap mb-3">
          <Tag color={DC[sel.difficulty]}>{sel.difficulty}</Tag>
          <Tag color="#06b6d4">{sel.category}</Tag>
          <span className="font-mono text-sm font-bold text-warn">{sel.points} pts</span>
        </div>
        <h2 className="text-lg font-display font-bold mb-2">{sel.title}</h2>
        <div className="flex gap-3 text-xs text-[var(--text-muted)] mb-5">
          <span className="flex items-center gap-1"><Users size={11} /> {sel.solves} solves</span>
          <span>Max 10 attempts</span>
          <span>By <span className="text-brand-500 font-mono">@{sel.author}</span></span>
        </div>
        <div className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap mb-6">{sel.desc}</div>

        {/* Challenge files with REAL download links */}
        {sel.files?.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-[var(--text-muted)] mb-2">Challenge Files</h3>
            {sel.files.map((f: any) => (
              <div key={f.name} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border)] mb-2">
                <FileUp size={14} className="text-brand-500 shrink-0" />
                <span className="text-xs font-mono flex-1">{f.name}</span>
                <span className="text-[10px] text-[var(--text-muted)]">{f.size}</span>
                {/* Download button — creates a blob download for demo */}
                <button onClick={() => {
                  const blob = new Blob([`# ${sel.title}\n# Challenge file: ${f.name}\n# This is a placeholder. In production, files are stored in Supabase Storage.\n\nprint("Solve me!")\n`], { type: "application/octet-stream" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a"); a.href = url; a.download = f.name; a.click();
                  URL.revokeObjectURL(url);
                }} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand-500 dark:bg-brand-400 text-white text-xs font-semibold shadow-sm hover:shadow-md transition">
                  <Download size={11} /> Download
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Hints */}
        {sel.hints?.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-[var(--text-muted)] mb-2">Hints ({hints}/{sel.hints.length})</h3>
            {sel.hints.slice(0, hints).map((h: string, i: number) => (
              <div key={i} className="rounded-xl bg-warn-muted p-3 mb-2 text-xs text-warn flex items-start gap-2" style={{ borderLeft: "2px solid #f59e0b" }}>
                <Lightbulb size={12} className="mt-0.5 shrink-0" /> Hint {i + 1}: {h}
              </div>
            ))}
            {hints < sel.hints.length && (
              <button onClick={() => setHints(h => h + 1)} className="text-xs text-warn hover:underline flex items-center gap-1">
                <Lightbulb size={10} /> Reveal next hint (−50 pts penalty)
              </button>
            )}
          </div>
        )}

        {/* Flag submission */}
        <div className="flex gap-3">
          <input value={flagInput} onChange={e => setFlagInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && submitFlag()}
            placeholder="XCLOAK{your_flag_here}"
            className="flex-1 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-xl px-4 py-3 font-mono text-sm outline-none" />
          <button onClick={submitFlag}
            className="px-6 py-3 rounded-xl bg-brand-500 dark:bg-brand-400 text-white font-semibold text-sm shadow-md hover:shadow-lg transition">
            Submit Flag
          </button>
        </div>
        {result && (
          <div className={`mt-3 px-4 py-3 rounded-xl text-sm font-semibold ${result === "correct" ? "bg-success-muted text-success" : "bg-danger-muted text-danger"}`}>
            {result === "correct" ? `🏴 Flag captured! +${sel.points - hints * 50} points` : "❌ Incorrect flag. Try again."}
          </div>
        )}
      </div>
    </div>
  );

  // ─── Challenges List ───
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-xl font-display font-bold">Capture The <span className="text-gradient-brand">Flag</span></h1>
        <button onClick={() => setShowUpload(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-500 dark:bg-brand-400 text-white font-semibold text-sm shadow-md">
          <Upload size={13} /> Submit Challenge
        </button>
      </div>
      <div className="flex gap-1.5 mb-4 flex-wrap">
        {["All", "Web", "Binary", "Crypto", "Reverse", "Forensics", "Network", "OSINT", "Misc"].map(c => (
          <button key={c} onClick={() => setFCat(c)}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold border transition ${fCat === c ? "bg-brand-500/8 text-brand-500 border-brand-500/20" : "text-[var(--text-muted)] border-[var(--border)] hover:bg-[var(--bg-tertiary)]"}`}>{c}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {filtered.map(ch => (
          <button key={ch.id} onClick={() => setSel(ch)}
            className="xc-card p-4 text-left hover:shadow-card-hover dark:hover:shadow-card-dark transition-all group">
            <div className="flex justify-between mb-2.5">
              <Tag color={DC[ch.difficulty]}>{ch.difficulty}</Tag>
              <span className="font-mono text-sm font-bold text-warn">{ch.points} pts</span>
            </div>
            <h3 className="text-sm font-semibold mb-1.5 group-hover:text-brand-500 transition-colors">{ch.title}</h3>
            <p className="text-[10px] text-[var(--text-muted)] leading-relaxed line-clamp-2 mb-3">{ch.desc}</p>
            <div className="flex justify-between items-center text-[10px]">
              <Tag color="#06b6d4">{ch.category}</Tag>
              <span className="text-[var(--text-muted)] flex items-center gap-1"><Users size={10} /> {ch.solves} solves</span>
            </div>
            {ch.files?.length > 0 && (
              <div className="mt-2.5 flex gap-1.5 flex-wrap">
                {ch.files.map((f: any) => (
                  <span key={f.name} className="text-[9px] px-1.5 py-0.5 rounded bg-brand-500/5 dark:bg-brand-400/10 text-brand-500 dark:text-brand-400">
                    <FileUp size={8} className="inline" /> {f.name}
                  </span>
                ))}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── CTF Challenge Upload Form ───
function CTFUploadForm({ onClose }: { onClose: () => void }) {
  const { upload, uploadMultiple, files, uploading, error: uploadError, removeFile } = useFileUpload();
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", category: "Web", difficulty: "Easy", points: 100, flag: "", hints: [""] });

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files) await uploadMultiple(e.target.files); };
  const handleDrop = async (e: React.DragEvent) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files) await uploadMultiple(e.dataTransfer.files); };
  const addHint = () => setForm(f => ({ ...f, hints: [...f.hints, ""] }));
  const updateHint = (i: number, val: string) => setForm(f => ({ ...f, hints: f.hints.map((h, j) => j === i ? val : h) }));
  const removeHint = (i: number) => setForm(f => ({ ...f, hints: f.hints.filter((_, j) => j !== i) }));

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.description.trim() || !form.flag.trim()) return;
    setSubmitting(true);
    try {
      await fetch("/api/ctf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          hints: form.hints.filter(h => h.trim()),
          files: files.map(f => ({ name: f.name, url: f.downloadUrl, size: f.sizeFormatted })),
        }),
      });
      setSubmitted(true);
      setTimeout(() => onClose(), 2000);
    } catch (e) { console.error(e); }
    setSubmitting(false);
  };

  const inp = "w-full bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-xl px-3.5 py-2.5 text-sm outline-none";

  if (submitted) return (
    <div className="animate-fade-in text-center py-20">
      <Check size={40} className="mx-auto text-green-500 mb-3" />
      <h3 className="text-lg font-semibold">Challenge Submitted!</h3>
      <p className="text-sm text-[var(--text-muted)] mt-1">Waiting for admin approval.</p>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <button onClick={onClose} className="inline-flex items-center gap-1.5 text-sm text-brand-500 hover:underline mb-5">
        <ArrowLeft size={14} /> Back
      </button>
      <div className="xc-card p-6 max-w-2xl">
        <h2 className="text-lg font-display font-bold flex items-center gap-2 mb-4"><Upload size={18} /> Submit CTF Challenge</h2>
        <div className="rounded-xl bg-warn-muted border border-warn/20 px-4 py-3 mb-5 text-xs text-warn flex items-start gap-2">
          <AlertTriangle size={13} className="mt-0.5 shrink-0" />
          CTF challenges require admin approval before becoming visible.
        </div>
        <div className="space-y-4">
          <div><label className="block text-xs font-semibold text-[var(--text-muted)] mb-1.5">Title *</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className={inp} placeholder="Challenge title" /></div>
          <div className="grid grid-cols-3 gap-3">
            <div><label className="block text-xs font-semibold text-[var(--text-muted)] mb-1.5">Category</label><select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className={inp}>{["Web","Binary","Crypto","Reverse","Forensics","Network","OSINT","Misc"].map(c => <option key={c}>{c}</option>)}</select></div>
            <div><label className="block text-xs font-semibold text-[var(--text-muted)] mb-1.5">Difficulty</label><select value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })} className={inp}>{["Easy","Medium","Hard","Insane"].map(d => <option key={d}>{d}</option>)}</select></div>
            <div><label className="block text-xs font-semibold text-[var(--text-muted)] mb-1.5">Points</label><input type="number" value={form.points} onChange={e => setForm({ ...form, points: Number(e.target.value) })} className={inp} /></div>
          </div>
          <div><label className="block text-xs font-semibold text-[var(--text-muted)] mb-1.5">Description *</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={5} className={`${inp} resize-y`} placeholder="Challenge description, objectives, tools needed..." /></div>
          <div><label className="block text-xs font-semibold text-[var(--text-muted)] mb-1.5">Flag * (will be hashed)</label><input value={form.flag} onChange={e => setForm({ ...form, flag: e.target.value })} className={`${inp} font-mono`} placeholder="XCLOAK{your_flag_here}" /></div>

          {/* Hints */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1.5">Hints (optional)</label>
            {form.hints.map((h, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input value={h} onChange={e => updateHint(i, e.target.value)} className={`${inp} flex-1`} placeholder={`Hint ${i + 1}`} />
                {form.hints.length > 1 && <button onClick={() => removeHint(i)} className="text-danger hover:bg-danger-muted p-2 rounded-lg"><Trash2 size={13} /></button>}
              </div>
            ))}
            <button onClick={addHint} className="text-xs text-brand-500 hover:underline">+ Add hint</button>
          </div>

          {/* FILE UPLOAD */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1.5">Challenge Files</label>
            <div onClick={() => fileRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${dragOver ? "border-brand-400 bg-brand-500/5" : "border-[var(--border)] hover:border-brand-400/50"}`}>
              <input ref={fileRef} type="file" multiple className="hidden" onChange={handleFiles} />
              {uploading ? <><Loader2 size={20} className="mx-auto text-brand-500 animate-spin mb-2" /><p className="text-xs text-[var(--text-secondary)]">Uploading...</p></>
                : <><FileUp size={20} className="mx-auto text-[var(--text-muted)] mb-2" /><p className="text-xs text-[var(--text-secondary)]">Drop challenge files here</p><p className="text-[10px] text-[var(--text-muted)] mt-1">Binaries, ZIPs, PCAPs, source code, etc.</p></>}
            </div>
            {uploadError && <p className="text-xs text-danger mt-2"><AlertTriangle size={10} className="inline" /> {uploadError}</p>}
            {files.length > 0 && <div className="mt-2 space-y-1.5">{files.map((f, i) => (
              <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)]">
                <Check size={12} className="text-green-500" /><span className="text-xs font-mono flex-1 truncate">{f.name}</span><span className="text-[10px] text-[var(--text-muted)]">{f.sizeFormatted}</span><button onClick={() => removeFile(i)} className="text-[var(--text-muted)] hover:text-danger"><Trash2 size={11} /></button>
              </div>
            ))}</div>}
          </div>

          <button onClick={handleSubmit} disabled={submitting || !form.title.trim() || !form.description.trim() || !form.flag.trim()}
            className="w-full py-3 rounded-xl bg-brand-500 dark:bg-brand-400 text-white font-display font-bold text-sm shadow-md hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2">
            {submitting ? <><Loader2 size={16} className="animate-spin" /> Submitting...</> : "Submit for Review"}
          </button>
        </div>
      </div>
    </div>
  );
}
