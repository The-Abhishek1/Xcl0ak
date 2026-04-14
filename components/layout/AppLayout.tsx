"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  LayoutDashboard, Bug, Globe, Map, AlertTriangle, Flag, Trophy, Brain,
  MessageSquare, Search, Upload, Menu, X, Shield, Settings, Lock, Wifi,
  Sun, Moon, Radar, Newspaper,
} from "lucide-react";
import { useUIStore, useSessionStore } from "@/lib/store";
import clsx from "clsx";

const NAV = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/exploits", label: "Exploits", icon: Bug },
  { href: "/threatmap", label: "Threat Map", icon: Radar },
  { href: "/cves", label: "CVE Tracker", icon: AlertTriangle },
  { href: "/news", label: "News", icon: Newspaper },
  { href: "/ctf", label: "CTF", icon: Flag },
  { href: "/chat/general", label: "Chat", icon: MessageSquare, live: true },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/ai", label: "AI Assistant", icon: Brain },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { sidebarOpen, setSidebarOpen, setUploadOpen } = useUIStore();
  const { username, role } = useSessionStore();
  const [mounted, setMounted] = useState(false);
  const [liveCount, setLiveCount] = useState(1247);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { const i = setInterval(() => setLiveCount(c => c + Math.floor(Math.random() * 3) + 1), 4000); return () => clearInterval(i); }, []);

  const isActive = (h: string) => h === "/" ? pathname === "/" : pathname.startsWith(h);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] font-sans transition-colors duration-200">
      {/* ─── Header ─── */}
      <header className="glass-strong fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-tertiary)] transition-colors">
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-500 dark:bg-brand-400 flex items-center justify-center shadow-md">
              <span className="font-display font-extrabold text-sm text-white">X</span>
            </div>
            <span className="font-display font-bold text-lg tracking-tight hidden sm:block">
              <span className="text-brand-500 dark:text-brand-400">X</span>cloak
            </span>
          </Link>
          <span className="hidden md:inline-flex text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-warn-muted dark:bg-yellow-500/10 text-warn border border-warn/20">BETA</span>
          <div className="hidden lg:flex items-center gap-2 ml-4">
            <Wifi size={11} className="text-success" />
            <span className="text-[10px] font-mono text-success">LIVE</span>
            <span className="text-[10px] font-mono text-[var(--text-muted)]">{liveCount.toLocaleString()} threats</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-xl px-3 py-1.5 w-64 focus-within:border-brand-400 transition-colors">
            <Search size={14} className="text-[var(--text-muted)] shrink-0" />
            <input type="text" placeholder="Search exploits, CVEs, news..." className="bg-transparent text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] outline-none w-full" />
            <kbd className="hidden lg:inline text-[9px] font-mono px-1.5 py-0.5 rounded bg-[var(--bg-secondary)] text-[var(--text-muted)] border border-[var(--border)]">/</kbd>
          </div>
          <button onClick={() => setUploadOpen(true)} className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-500 dark:bg-brand-400 text-white font-semibold text-xs shadow-md hover:shadow-lg transition-all">
            <Upload size={13} /> <span className="hidden sm:inline">Upload</span>
          </button>
          {/* Theme toggle */}
          <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="p-2 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          {/* Identity */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border)]">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse-dot" />
            <span className="text-[10px] font-mono text-[var(--text-secondary)] truncate max-w-[90px]">@{username || "anon"}</span>
            {role === "ADMIN" && <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-danger-muted text-danger font-bold">ADMIN</span>}
          </div>
        </div>
      </header>

      <div className="flex pt-14">
        {/* ─── Sidebar ─── */}
        <nav className={clsx(
          "fixed lg:sticky top-14 left-0 z-40 h-[calc(100vh-3.5rem)] w-52 glass-strong flex flex-col transition-transform duration-200",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}>
          <div className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
            {NAV.map(item => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                  className={clsx(
                    "flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all",
                    active
                      ? "bg-brand-500/8 dark:bg-brand-400/10 text-brand-600 dark:text-brand-400 font-semibold shadow-sm"
                      : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-tertiary)]"
                  )}>
                  <Icon size={16} />
                  <span>{item.label}</span>
                  {item.live && <span className="ml-auto w-2 h-2 rounded-full bg-success animate-pulse-dot" />}
                </Link>
              );
            })}
            {role === "ADMIN" && <>
              <div className="h-px bg-[var(--border)] my-3" />
              <Link href="/admin" className={clsx(
                "flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all",
                pathname.startsWith("/admin") ? "bg-danger-muted text-danger font-semibold" : "text-[var(--text-muted)] hover:text-danger hover:bg-danger-muted"
              )}>
                <Settings size={16} /> <span>Admin</span>
              </Link>
            </>}
          </div>
          <div className="p-3 border-t border-[var(--border)]">
            <div className="px-2 space-y-1">
              <div className="flex items-center gap-1.5 text-[9px] font-mono text-brand-500 dark:text-brand-400"><Lock size={9} /> Anonymous Mode</div>
              <div className="text-[9px] font-mono text-[var(--text-muted)] leading-relaxed">Session persists 7 days<br/>No tracking • No cookies</div>
            </div>
          </div>
        </nav>

        {sidebarOpen && <div className="fixed inset-0 bg-black/30 dark:bg-black/50 z-30 lg:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />}

        <main className="flex-1 min-h-[calc(100vh-3.5rem)] p-4 lg:p-6 overflow-x-hidden max-w-[1280px]">
          {children}
        </main>
      </div>
    </div>
  );
}
