// app/chat/[room]/page.tsx — REPLACE existing file
"use client";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { CHAT_ROOMS, generateUsername, generateId, sanitize, timeAgo } from "@/lib/constants";
import { MessageSquare, Send, Lock, Users, Hash, Reply, Loader2, Wifi } from "lucide-react";

// In-memory message store (persists across room switches, not page reloads)
// In production: replace with Supabase Realtime or Socket.IO
const messageStore: Record<string, any[]> = {};

function getStoredMessages(room: string) {
  if (!messageStore[room]) {
    // Seed with some starter messages per room
    const seeds: Record<string, any[]> = {
      general: [
        { id: "s1", author: "PhantomViper42", text: "Anyone tracking the new APT campaign against NATO targets?", time: Date.now() - 300000 },
        { id: "s2", author: "ShadowRaven88", text: "Mandiant dropped the report — GRU Unit 29155 attributed.", time: Date.now() - 240000 },
        { id: "s3", author: "CipherNode07", text: "TTPs consistent with Sandworm. Modified Industroyer variant.", time: Date.now() - 180000 },
      ],
      exploits: [
        { id: "s1", author: "NullByte333", text: "New eBPF verifier bypass just dropped. Testing on Ubuntu 24.04.", time: Date.now() - 600000 },
        { id: "s2", author: "DarkFalcon91", text: "Confirmed working. Root shell in 2 seconds. Pretty clean exploit chain.", time: Date.now() - 500000 },
      ],
      malware: [
        { id: "s1", author: "MalwareHunter99", text: "Anyone seen the new Grandoreiro variant? Banking trojan targeting LATAM.", time: Date.now() - 900000 },
      ],
      "ctf-discussion": [
        { id: "s1", author: "CTFPlayer42", text: "That binary bomb challenge is brutal. Stuck on phase 4.", time: Date.now() - 400000 },
        { id: "s2", author: "RevEngineer77", text: "Phase 4 is a recursive function. Use GDB to trace the call stack.", time: Date.now() - 350000 },
      ],
    };
    messageStore[room] = seeds[room] || [
      { id: "s0", author: "System", text: `Welcome to #${room}. Be respectful, share knowledge.`, time: Date.now() - 86400000 },
    ];
  }
  return messageStore[room];
}

export default function ChatPage() {
  const params = useParams();
  const slug = (params.room as string) || "general";
  const room = CHAT_ROOMS.find(r => r.slug === slug) || CHAT_ROOMS[0];
  const myName = useMemo(() => {
    // Persist username in sessionStorage so it stays consistent
    if (typeof window !== "undefined") {
      let name = sessionStorage.getItem("xc_chat_name");
      if (!name) { name = generateUsername(); sessionStorage.setItem("xc_chat_name", name); }
      return name;
    }
    return generateUsername();
  }, []);

  const [msgs, setMsgs] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [replyTo, setReplyTo] = useState<any>(null);
  const [onlineCount] = useState(Math.floor(Math.random() * 30) + 8);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load messages for current room
  useEffect(() => {
    setMsgs(getStoredMessages(slug));
    setReplyTo(null);
    setInput("");
    // Focus input on room switch
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [slug]);

  // Auto-scroll
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  // Poll for new messages (simulates real-time)
  // In production: use Supabase Realtime subscription
  useEffect(() => {
    const i = setInterval(() => {
      setMsgs([...getStoredMessages(slug)]);
    }, 2000);
    return () => clearInterval(i);
  }, [slug]);

  const send = useCallback(() => {
    if (!input.trim()) return;
    const msg = {
      id: generateId(),
      author: myName,
      text: sanitize(input.trim()),
      time: Date.now(),
      replyTo: replyTo ? { author: replyTo.author, text: replyTo.text.slice(0, 80) } : null,
    };
    messageStore[slug] = [...getStoredMessages(slug), msg];
    setMsgs([...messageStore[slug]]);
    setInput("");
    setReplyTo(null);
    inputRef.current?.focus();
  }, [input, myName, replyTo, slug]);

  // Group rooms by category
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
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs transition-all ${
                  slug === r.slug
                    ? "bg-brand-500/8 dark:bg-brand-400/10 text-brand-500 dark:text-brand-400 font-medium"
                    : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-tertiary)]"
                }`}>
                <span>{r.icon}</span>
                <span className="flex-1">{r.name}</span>
                {slug === r.slug && <span className="w-1.5 h-1.5 rounded-full bg-green-500" />}
              </Link>
            ))}
          </div>
        ))}
      </div>

      {/* Chat area */}
      <div className="flex-1 min-w-0 flex flex-col xc-card overflow-hidden">
        {/* Room header */}
        <div className="px-4 py-3 border-b border-[var(--border)] flex justify-between items-center shrink-0 bg-[var(--bg-secondary)]">
          <div className="flex items-center gap-2">
            <span className="text-lg">{room.icon}</span>
            <div>
              <div className="font-semibold text-sm flex items-center gap-1.5">
                <Hash size={13} className="text-brand-500" /> {room.name}
              </div>
              <div className="text-[10px] text-[var(--text-muted)]">{room.desc}</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-mono text-green-500 flex items-center gap-1.5">
              <Wifi size={10} /> Connected
            </span>
            <span className="text-[10px] font-mono text-brand-500 flex items-center gap-1">
              <Lock size={10} /> E2E
            </span>
            <span className="text-[10px] font-mono text-[var(--text-muted)] flex items-center gap-1">
              <Users size={10} /> {onlineCount}
            </span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[var(--bg-secondary)]">
          {msgs.map(m => (
            <div key={m.id} className="animate-fade-in group">
              {m.replyTo && (
                <div className="ml-9 mb-0.5 pl-3 border-l-2 border-[var(--border)] text-[10px] text-[var(--text-muted)] truncate">
                  ↳ <span className="text-info">@{m.replyTo.author}</span>: {m.replyTo.text}
                </div>
              )}
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center text-[10px] font-mono font-bold text-[var(--text-muted)] shrink-0 mt-0.5 border border-[var(--border)]">
                  {m.author[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className={`font-mono text-xs font-semibold ${m.author === myName ? "text-brand-500" : m.author === "System" ? "text-[var(--text-muted)]" : "text-info"}`}>
                      @{m.author}
                    </span>
                    <span className="text-[9px] text-[var(--text-muted)]">{timeAgo(m.time)}</span>
                    <button onClick={() => setReplyTo(m)}
                      className="text-[10px] text-[var(--text-muted)] hover:text-brand-500 opacity-0 group-hover:opacity-100 transition-all ml-auto flex items-center gap-0.5">
                      <Reply size={10} /> Reply
                    </button>
                  </div>
                  <p className={`text-sm mt-0.5 leading-relaxed ${m.author === "System" ? "text-[var(--text-muted)] italic text-xs" : "text-[var(--text-secondary)]"}`}>
                    {m.text}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Reply indicator */}
        {replyTo && (
          <div className="px-4 py-2 bg-[var(--bg-tertiary)] border-t border-[var(--border)] flex items-center gap-2 text-xs text-info">
            <Reply size={10} /> Replying to <span className="font-mono font-medium">@{replyTo.author}</span>
            <span className="text-[var(--text-muted)] truncate flex-1">"{replyTo.text.slice(0, 50)}..."</span>
            <button onClick={() => setReplyTo(null)} className="text-[var(--text-muted)] hover:text-[var(--text)] text-[10px]">✕</button>
          </div>
        )}

        {/* Input */}
        <div className="p-3 border-t border-[var(--border)] flex gap-2 shrink-0">
          <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
            placeholder={`Message #${room.slug} as @${myName}...`}
            className="flex-1 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-xl px-3.5 py-2.5 text-sm outline-none" />
          <button onClick={send} disabled={!input.trim()}
            className="p-2.5 rounded-xl bg-brand-500 dark:bg-brand-400 text-white shadow-sm hover:shadow-md transition disabled:opacity-40">
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
