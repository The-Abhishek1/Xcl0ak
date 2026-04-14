"use client";
import { useState, useMemo } from "react";
import { SevBadge, Tag } from "@/components/ui";
import { mockLeaderboard, mockExploits } from "@/lib/mock-data";
import { REGIONS, COUNTRIES, BADGES, timeAgo } from "@/lib/constants";
import { Trophy, ArrowLeft, Bug, Flag, MessageSquare, Award, Flame, MapPin, Calendar } from "lucide-react";

export default function LeaderboardPage() {
  const leaders = useMemo(() => mockLeaderboard(25), []);
  const [sel, setSel] = useState<any>(null);
  const [fRegion, setFRegion] = useState("All");
  const [fCountry, setFCountry] = useState("All");
  const filtered = useMemo(() => {
    let r = leaders;
    if (fRegion !== "All") r = r.filter(l => l.region === fRegion);
    if (fCountry !== "All") r = r.filter(l => l.country === fCountry);
    return r.map((l, i) => ({ ...l, rank: i + 1 }));
  }, [leaders, fRegion, fCountry]);
  const regionCountries = COUNTRIES.filter(c => fRegion === "All" || c.region === fRegion);

  // ─── User Profile Detail ───
  if (sel) {
    const userExploits = mockExploits(6).map(e => ({ ...e, author: sel.username }));
    const countryName = COUNTRIES.find(c => c.code === sel.country)?.name || sel.country;
    return (
      <div className="animate-fade-in">
        <button onClick={() => setSel(null)} className="inline-flex items-center gap-1.5 text-sm text-brand-500 hover:underline mb-5"><ArrowLeft size={14} /> Back to Leaderboard</button>
        <div className="xc-card overflow-hidden">
          {/* Profile header */}
          <div className="px-6 py-5 border-b border-[var(--border)]" style={{ background: "linear-gradient(135deg, rgba(42,151,255,0.04), transparent)" }}>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border)] flex items-center justify-center text-2xl font-display font-bold text-brand-500">
                #{sel.rank}
              </div>
              <div>
                <h2 className="text-lg font-display font-bold flex items-center gap-2">
                  <span className="text-brand-500 font-mono">@{sel.username}</span>
                  {sel.rank <= 3 && <span className="text-xl">{["🥇", "🥈", "🥉"][sel.rank - 1]}</span>}
                </h2>
                <div className="flex items-center gap-3 text-xs text-[var(--text-muted)] mt-1">
                  {sel.country && <span className="flex items-center gap-1"><MapPin size={10} /> {countryName}</span>}
                  <span className="flex items-center gap-1"><Calendar size={10} /> Joined {timeAgo(sel.joinedAt)}</span>
                  {sel.streak > 0 && <span className="flex items-center gap-1 text-warn"><Flame size={10} /> {sel.streak}d streak</span>}
                </div>
              </div>
              <div className="ml-auto text-right">
                <div className="text-2xl font-display font-bold text-brand-500 font-mono">{sel.reputation.toLocaleString()}</div>
                <div className="text-xs text-[var(--text-muted)]">reputation</div>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Stats grid */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: "Exploits", value: sel.exploitCount, color: "#ef4444", icon: <Bug size={15} /> },
                { label: "CTF Solves", value: sel.ctfSolves, color: "#f59e0b", icon: <Flag size={15} /> },
                { label: "Comments", value: sel.commentCount, color: "#06b6d4", icon: <MessageSquare size={15} /> },
                { label: "Badges", value: sel.badges.length, color: "#8b5cf6", icon: <Award size={15} /> },
              ].map(s => (
                <div key={s.label} className="rounded-xl bg-[var(--bg-tertiary)] p-3.5 text-center">
                  <div className="flex justify-center mb-1.5" style={{ color: s.color }}>{s.icon}</div>
                  <div className="text-lg font-display font-bold font-mono" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-[9px] text-[var(--text-muted)]">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Badges */}
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><Award size={14} /> Badges</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {sel.badges.map((badge: string, i: number) => {
                  const info = BADGES[i];
                  return (
                    <div key={i} className="flex items-center gap-2.5 rounded-xl bg-[var(--bg-tertiary)] p-3">
                      <span className="text-xl">{badge}</span>
                      <div>
                        <div className="text-xs font-semibold">{info?.name || "Badge"}</div>
                        <div className="text-[9px] text-[var(--text-muted)]">{info?.desc || ""}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* User's exploits */}
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><Bug size={14} /> Exploits by @{sel.username}</h3>
              <div className="space-y-1.5">
                {userExploits.slice(0, 5).map(e => (
                  <div key={e.id} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border)]">
                    <SevBadge severity={e.severity} />
                    <span className="text-xs flex-1 truncate">{e.title}</span>
                    <span className="text-[10px] font-mono text-[var(--text-muted)]">▲ {e.upvotes - e.downvotes}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Leaderboard list ───
  return (
    <div className="animate-fade-in">
      <h1 className="text-xl font-display font-bold mb-4">Community <span className="text-gradient-brand">Leaderboard</span></h1>

      {/* Region filter */}
      <div className="flex gap-1.5 mb-2 flex-wrap">
        {REGIONS.map(r => (
          <button key={r} onClick={() => { setFRegion(r); setFCountry("All"); }}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold border transition ${fRegion === r ? "bg-brand-500/8 text-brand-500 border-brand-500/20" : "text-[var(--text-muted)] border-[var(--border)] hover:bg-[var(--bg-tertiary)]"}`}>{r}</button>
        ))}
      </div>

      {/* Country filter */}
      {fRegion !== "All" && (
        <div className="flex gap-1.5 mb-3 flex-wrap">
          {regionCountries.map(c => (
            <button key={c.code} onClick={() => setFCountry(c.code)}
              className={`px-2 py-1 rounded-lg text-[10px] font-semibold border transition ${fCountry === c.code ? "bg-info-muted text-info border-info/20" : "text-[var(--text-muted)] border-[var(--border)]"}`}>{c.code}</button>
          ))}
        </div>
      )}

      <div className="text-xs text-[var(--text-muted)] mb-3">{filtered.length} users</div>

      <div className="xc-card overflow-hidden">
        <div className="px-4 py-3 border-b border-[var(--border)] flex items-center gap-2">
          <Trophy size={15} className="text-warn" />
          <span className="text-sm font-semibold">Top Contributors</span>
        </div>
        {filtered.map((u, i) => (
          <button key={u.sessionId} onClick={() => setSel(u)}
            className={`w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-[var(--bg-tertiary)] transition-colors group ${i < filtered.length - 1 ? "border-b border-[var(--border)]" : ""} ${i < 3 ? ["bg-yellow-500/[0.02]", "bg-slate-400/[0.02]", "bg-orange-500/[0.02]"][i] : ""}`}>
            <span className={`font-mono font-bold text-sm w-10 text-center shrink-0 ${i < 3 ? "text-base" : ""}`}
              style={{ color: i < 3 ? ["#fbbf24", "#94a3b8", "#cd7f32"][i] : "var(--text-muted)" }}>
              {i < 3 ? ["🥇", "🥈", "🥉"][i] : `#${u.rank}`}
            </span>
            <span className="font-mono text-xs text-brand-500 font-medium w-32 truncate group-hover:underline">@{u.username}</span>
            <span className="font-mono text-sm font-bold w-16">{u.reputation.toLocaleString()}</span>
            <span className="text-[10px] text-[var(--text-muted)] w-20 hidden sm:block">{u.exploitCount} exploits</span>
            <span className="text-[10px] text-[var(--text-muted)] w-14 hidden sm:block">{u.ctfSolves} CTFs</span>
            <span className="flex gap-0.5 flex-1 min-w-0">{u.badges.slice(0, 5).map((b: string, j: number) => <span key={j} className="text-xs">{b}</span>)}</span>
            <span className="text-[9px] font-mono text-[var(--text-muted)] shrink-0">{u.country}</span>
          </button>
        ))}
      </div>

      {/* Badge showcase */}
      <div className="mt-8">
        <h2 className="text-sm font-display font-semibold mb-4 flex items-center gap-2"><Award size={14} className="text-purple-500" /> All Badges</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {BADGES.map(b => (
            <div key={b.id} className="xc-card p-4 text-center hover:shadow-card-hover dark:hover:shadow-card-dark transition">
              <div className="text-2xl mb-2">{b.icon}</div>
              <div className="text-xs font-semibold mb-0.5">{b.name}</div>
              <div className="text-[9px] text-[var(--text-muted)]">{b.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
