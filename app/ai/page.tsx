"use client";
import { useState, useRef, useEffect } from "react";
import { Brain, Send, Sparkles, GraduationCap, Monitor, ChevronRight, Shield, FileCode, AlertTriangle, Target } from "lucide-react";

export default function AIPage() {
  const [msgs, setMsgs] = useState([{ role: "assistant", text: "I'm Xcloak AI. Ask me to explain exploits, suggest mitigations, generate detection rules, analyze payloads, or break down CVEs at any skill level.\n\nTry the quick actions on the right, or ask me anything." }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"expert" | "beginner">("expert");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const send = () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setMsgs(p => [...p, { role: "user", text: userMsg }]);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      const expertResp = `**Analysis:** ${userMsg.toLowerCase().includes("cve") ? "This CVE targets a critical vulnerability in the affected component's input validation. The flaw allows bypassing security checks to achieve unauthorized access." : "This exploit leverages a type confusion vulnerability to bypass security boundaries and achieve code execution in the target context."}

**Impact Assessment:**
• Severity: Critical (CVSS 9.8)
• Attack Vector: Network (no authentication required)
• Complexity: Low — reliable exploitation with provided PoC

**Recommended Mitigations:**
• Apply vendor patch immediately (check advisory)
• Deploy WAF rules to filter exploit payloads
• Monitor SIEM for indicators of compromise
• Restrict network access to vulnerable services
• Implement network segmentation for critical assets

**Detection (Snort):**
\`alert tcp any any -> any any (msg:"Exploit Attempt"; content:"|65 00|"; depth:2; sid:1000001;)\`

**YARA Rule:**
\`rule Exploit_Detection { strings: $a = { 65 00 00 00 } condition: $a }\``;

      const beginnerResp = `**In simple terms:** ${userMsg.toLowerCase().includes("cve") ? "A CVE is like a public notice about a security flaw in software. Think of it as a recall notice for a car — it tells everyone about the problem so it can be fixed." : "Think of this vulnerability like a broken lock on a door. The software is supposed to check who's trying to get in, but because of a bug, an attacker can slip through without the right key."}

**What does this mean for you?**
If you're running the affected software, you should update it as soon as possible. It's like installing a new, working lock on your door.

**What should you do?**
1. ✅ Check if you're running the affected version
2. ✅ Update to the latest version (this fixes the "broken lock")
3. ✅ If you can't update right now, check the Defense Mode panel for temporary fixes
4. ✅ Monitor your systems for any signs of compromise

**Is this serious?**
Yes — this is rated as high severity. But the good news is that a fix already exists. Update your software and you're protected!`;

      setMsgs(p => [...p, { role: "assistant", text: mode === "expert" ? expertResp : beginnerResp }]);
      setLoading(false);
    }, 1500);
  };

  const quickActions = [
    { label: "Explain this CVE for a beginner", icon: <GraduationCap size={11} /> },
    { label: "Generate Snort detection rule", icon: <Shield size={11} /> },
    { label: "Analyze exploit payload", icon: <FileCode size={11} /> },
    { label: "Suggest mitigations", icon: <Shield size={11} /> },
    { label: "Create YARA rule", icon: <Target size={11} /> },
    { label: "Risk assessment for CVE-2025-3000", icon: <AlertTriangle size={11} /> },
    { label: "Generate incident response plan", icon: <Shield size={11} /> },
    { label: "Compare similar exploits", icon: <FileCode size={11} /> },
  ];

  return (
    <div className="animate-fade-in">
      <h1 className="text-xl font-display font-bold mb-5">AI <span className="text-gradient-brand">Assistant</span></h1>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
        {/* Chat panel */}
        <div className="xc-card overflow-hidden flex flex-col" style={{ height: 560 }}>
          <div className="px-4 py-3 border-b border-[var(--border)] flex justify-between items-center shrink-0">
            <span className="text-sm font-semibold flex items-center gap-2">
              <Brain size={15} className="text-purple-500" /> Xcloak AI
            </span>
            <div className="flex gap-1.5">
              {(["expert", "beginner"] as const).map(m => (
                <button key={m} onClick={() => setMode(m)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold capitalize border transition ${mode === m
                    ? (m === "expert" ? "bg-purple-500/8 text-purple-600 dark:text-purple-400 border-purple-500/20" : "bg-brand-500/8 text-brand-500 border-brand-500/20")
                    : "text-[var(--text-muted)] border-transparent hover:bg-[var(--bg-tertiary)]"}`}>
                  {m === "expert" ? <Monitor size={10} /> : <GraduationCap size={10} />} {m}
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {msgs.map((m, i) => (
              <div key={i} className={`max-w-[88%] animate-fade-in ${m.role === "user" ? "ml-auto" : "mr-auto"}`}>
                <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${m.role === "user"
                  ? "bg-brand-500 text-white"
                  : "bg-[var(--bg-tertiary)] border border-[var(--border)] text-[var(--text-secondary)]"}`}
                  style={m.role === "assistant" ? { fontFamily: "'Fira Code', monospace", fontSize: 12 } : {}}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="mr-auto">
                <div className="bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-2xl px-4 py-3">
                  <span className="text-purple-500 font-mono text-xs animate-pulse">analyzing threat data...</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick suggestions (show when few messages) */}
          {msgs.length <= 2 && (
            <div className="px-4 pb-2 flex gap-1.5 flex-wrap shrink-0">
              {quickActions.slice(0, 4).map(a => (
                <button key={a.label} onClick={() => setInput(a.label)}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-medium text-[var(--text-muted)] bg-[var(--bg-tertiary)] border border-[var(--border)] hover:border-purple-500/30 hover:text-purple-500 dark:hover:text-purple-400 transition-all">
                  <Sparkles size={8} className="inline mr-1" />{a.label}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-[var(--border)] flex gap-2 shrink-0">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
              placeholder={mode === "beginner" ? "Ask anything (I'll explain simply)..." : "Analyze exploit, generate rules, explain CVE..."}
              className="flex-1 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-xl px-3.5 py-2.5 text-sm outline-none" />
            <button onClick={send} disabled={loading || !input.trim()}
              className="p-2.5 rounded-xl bg-brand-500 dark:bg-brand-400 text-white disabled:opacity-40 shadow-sm hover:shadow-md transition">
              <Send size={14} />
            </button>
          </div>
        </div>

        {/* Quick actions sidebar */}
        <div className="xc-card p-4 h-fit">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><Sparkles size={14} /> Quick Actions</h3>
          <div className="space-y-2">
            {quickActions.map(a => (
              <button key={a.label} onClick={() => { setInput(a.label); }}
                className="block w-full text-left xc-card p-3 text-xs text-[var(--text-secondary)] hover:text-brand-500 hover:border-brand-500/20 dark:hover:text-brand-400 transition-all group">
                <span className="text-brand-500 dark:text-brand-400 mr-1.5 inline-flex">{a.icon}</span>
                {a.label}
              </button>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-[var(--border)]">
            <h4 className="text-xs font-semibold text-[var(--text-muted)] mb-2">Capabilities</h4>
            <div className="space-y-1.5 text-[10px] text-[var(--text-muted)]">
              <div>• Explain exploits & CVEs at any level</div>
              <div>• Generate Snort, YARA, Sigma rules</div>
              <div>• Suggest mitigations & patches</div>
              <div>• Analyze payloads & attack chains</div>
              <div>• Create incident response plans</div>
              <div>• Risk assessment & scoring</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
