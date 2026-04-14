"use client";

import { useState, useRef, useEffect } from "react";
import { Brain, Send, GraduationCap, Monitor, Sparkles } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const EXPERT_RESPONSES: Record<string, string> = {
  default: `**Analysis:** This exploit leverages a type confusion vulnerability in the target component's input validation logic. The vulnerability allows an attacker to bypass security checks and achieve code execution in the context of the vulnerable process.

**Attack Vector:** Network-accessible, no authentication required
**Complexity:** Low — reliable exploitation with provided PoC

**Recommended Mitigations:**
• Apply vendor patch immediately (check advisory)
• Implement WAF rules to filter exploit payloads
• Monitor for IoCs listed in the threat feed
• Restrict network access to vulnerable services
• Deploy the detection rules from Defense Mode

**Detection (Snort):**
\`alert ip any any -> any any (msg:"Exploit Attempt"; content:"|65 00|"; depth:2; sid:1000001;)\``,
};

const BEGINNER_RESPONSES: Record<string, string> = {
  default: `**In simple terms:** Think of this vulnerability like a door with a broken lock. The software is supposed to check who's trying to get in, but because of a bug in how it checks, an attacker can slip through without the right key.

**What does this mean for you?**
If you're running the affected software, you should update it as soon as possible. Think of it like a security patch for your front door.

**What should you do?**
1. Check if you're running the affected version
2. Update to the latest version (this fixes the "broken lock")
3. If you can't update right now, the Defense Mode tab has temporary fixes

**Is this serious?**
Yes — this is rated as high severity, meaning attackers can potentially take control of affected systems. But the good news is that a fix exists.`,
};

export function AIAssistantPanel({ context }: { context?: string }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "I'm Xcloak AI. Ask me to explain any exploit, suggest mitigations, generate detection rules, or break down a CVE at any skill level.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"expert" | "beginner">("expert");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setInput("");
    setLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = mode === "expert" ? EXPERT_RESPONSES : BEGINNER_RESPONSES;
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: responses.default },
      ]);
      setLoading(false);
    }, 1200 + Math.random() * 800);
  };

  const quickActions = [
    "Explain this exploit",
    "Generate Snort rule",
    "Suggest mitigations",
    "Create YARA rule",
    "Analyze payload",
    "Compare similar CVEs",
  ];

  return (
    <div className="bg-xc-card border border-xc-border rounded-xl overflow-hidden flex flex-col" style={{ height: 520 }}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-xc-border flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Brain size={16} className="text-xc-purple" />
          <span className="text-sm font-semibold">Xcloak AI</span>
        </div>
        <div className="flex gap-1">
          {(["expert", "beginner"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-semibold capitalize border transition-all ${
                mode === m
                  ? m === "expert"
                    ? "bg-xc-purple-muted text-xc-purple border-xc-purple/20"
                    : "bg-xc-accent-muted text-xc-accent border-xc-accent/20"
                  : "text-xc-text-muted border-transparent hover:bg-xc-elevated"
              }`}
            >
              {m === "expert" ? <Monitor size={10} /> : <GraduationCap size={10} />}
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[88%] animate-fade-in ${msg.role === "user" ? "ml-auto" : "mr-auto"}`}
          >
            <div
              className={`rounded-xl px-3.5 py-2.5 text-[13px] leading-relaxed whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-xc-accent text-xc-bg"
                  : "bg-xc-elevated border border-xc-border text-xc-text-secondary font-mono text-xs"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="mr-auto">
            <div className="bg-xc-elevated border border-xc-border rounded-xl px-3.5 py-2.5">
              <span className="text-xc-purple font-mono text-xs animate-pulse">analyzing...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick actions */}
      {messages.length <= 2 && (
        <div className="px-3 pb-2 flex gap-1.5 flex-wrap shrink-0">
          {quickActions.slice(0, 4).map((action) => (
            <button
              key={action}
              onClick={() => { setInput(action); }}
              className="px-2.5 py-1 rounded-lg text-[10px] font-medium text-xc-text-muted bg-xc-elevated border border-xc-border hover:border-xc-purple hover:text-xc-purple transition-colors"
            >
              <Sparkles size={9} className="inline mr-1" />{action}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-3 border-t border-xc-border flex gap-2 shrink-0">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder={
            mode === "beginner"
              ? "Ask anything (I'll explain simply)..."
              : "Analyze exploit, generate rules, explain CVE..."
          }
          className="flex-1 bg-xc-elevated border border-xc-border rounded-lg px-3.5 py-2.5 text-sm text-xc-text placeholder:text-xc-text-muted outline-none"
        />
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          className="p-2.5 rounded-lg bg-xc-accent text-xc-bg hover:brightness-110 transition-all disabled:opacity-40"
        >
          <Send size={15} />
        </button>
      </div>
    </div>
  );
}
