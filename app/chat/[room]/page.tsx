"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { CHAT_ROOMS, generateUsername, generateId, sanitize, timeAgo } from "@/lib/constants";
import { MessageSquare, Send, Lock, Users, Hash, Reply } from "lucide-react";

export default function ChatPage() {
  const params = useParams();
  const slug = (params.room as string) || "general";
  const room = CHAT_ROOMS.find(r => r.slug === slug) || CHAT_ROOMS[0];
  const myName = useMemo(() => generateUsername(), []);
  const [msgs, setMsgs] = useState([
    { id: "1", author: "PhantomViper42", text: "Anyone tracking the new APT campaign against NATO targets?", time: Date.now() - 300000, replyTo: null as any },
    { id: "2", author: "ShadowRaven88", text: "Yeah, Mandiant dropped the report this morning. GRU Unit 29155 attributed.", time: Date.now() - 240000, replyTo: null },
    { id: "3", author: "CipherNode07", text: "TTPs are consistent with previous Sandworm operations. Modified Industroyer variant.", time: Date.now() - 180000, replyTo: { author: "ShadowRaven88", text: "Mandiant dropped the report..." } },
    { id: "4", author: "NullByte333", text: "Check the CVE tracker — I linked the Exchange zero-day they're exploiting.", time: Date.now() - 120000, replyTo: null },
    { id: "5", author: "DarkFalcon91", text: "Good catch. YARA rules are up in the defense panel for anyone who needs them.", time: Date.now() - 60000, replyTo: null },
  ]);
  const [input, setInput] = useState("");
  const [replyTo, setReplyTo] = useState<any>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const send = () => {
    if (!input.trim()) return;
    setMsgs(p => [...p, {
      id: generateId(), author: myName, text: sanitize(input), time: Date.now(),
      replyTo: replyTo ? { author: replyTo.author, text: replyTo.text.slice(0, 60) + "..." } : null,
    }]);
    setInput("");
    setReplyTo(null);
  };

  const cats: Record<string, typeof CHAT_ROOMS[number][]> = {};
  CHAT_ROOMS.forEach(r => { if (!cats[r.category]) cats[r.category] = []; cats[r.category].push(r); });

  return (
    <div className="animate-fade-in flex gap-4" style={{ height: "calc(100vh - 7.5rem)" }}>
      {/* Room sidebar */}
      <div className="w-48 shrink-0 hidden lg:block overflow-y-auto">
        <h3 className="text-sm font-display font-semibold mb-3 flex items-center gap-2">
          <MessageSquare size={14} /> Chat Rooms
        </h3>
        {Object.entries(cats).map(([cat, rooms]) => (
          <div key={cat} className="mb-4">
            <div className="text-[9px] font-mono text-[var(--text-muted)] font-semibold px-2 uppercase tracking-wider mb-1.5">{cat}</div>
            {rooms.map(r => (
              <Link key={r.id} href={`/chat/${r.slug}`}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs transition-all ${slug === r.slug
                  ? "bg-brand-500/8 dark:bg-brand-400/10 text-brand-500 dark:text-brand-400 font-medium"
                  : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-tertiary)]"}`}>
                <span>{r.icon}</span>{r.name}
              </Link>
            ))}
          </div>
        ))}
      </div>

      {/* Chat area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Room header */}
        <div className="glass-strong rounded-t-xl px-4 py-3 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <Hash size={14} className="text-brand-500" />
            <span className="font-semibold text-sm">{room.name}</span>
            <span className="text-xs text-[var(--text-muted)] hidden sm:block">— {room.desc}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-brand-500 flex items-center gap-1"><Lock size={10} /> E2E Encrypted</span>
            <span className="text-[10px] font-mono text-[var(--text-muted)] flex items-center gap-1"><Users size={10} /> {Math.floor(Math.random() * 40) + 8} online</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[var(--bg-secondary)] dark:bg-[var(--bg-secondary)]">
          {msgs.map(m => (
            <div key={m.id} className="animate-fade-in group">
              {m.replyTo && (
                <div className="ml-1 mb-1 pl-3 border-l-2 border-[var(--border)] text-[10px] text-[var(--text-muted)] truncate">
                  ↳ <span className="text-info">@{m.replyTo.author}</span>: {m.replyTo.text}
                </div>
              )}
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center text-[10px] font-mono font-bold text-[var(--text-muted)] shrink-0 mt-0.5">
                  {m.author[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className={`font-mono text-xs font-semibold ${m.author === myName ? "text-brand-500" : "text-info"}`}>@{m.author}</span>
                    <span className="text-[9px] text-[var(--text-muted)]">{timeAgo(m.time)}</span>
                    <button onClick={() => setReplyTo(m)} className="text-[10px] text-[var(--text-muted)] hover:text-brand-500 opacity-0 group-hover:opacity-100 transition-all ml-auto flex items-center gap-0.5">
                      <Reply size={10} /> Reply
                    </button>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] mt-0.5 leading-relaxed">{m.text}</p>
                </div>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="p-3 border-t border-[var(--border)] bg-[var(--card)] rounded-b-xl shrink-0">
          {replyTo && (
            <div className="flex items-center gap-2 mb-2 text-xs text-info">
              <Reply size={10} /> Replying to @{replyTo.author}
              <button onClick={() => setReplyTo(null)} className="text-[var(--text-muted)] hover:text-[var(--text)] ml-auto text-[10px]">✕ Cancel</button>
            </div>
          )}
          <div className="flex gap-2">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
              placeholder={`Message #${room.slug} as @${myName}...`}
              className="flex-1 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-xl px-3.5 py-2.5 text-sm outline-none" />
            <button onClick={send} className="p-2.5 rounded-xl bg-brand-500 dark:bg-brand-400 text-white shadow-sm hover:shadow-md transition">
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
