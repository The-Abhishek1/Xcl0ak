# 🔒 Xcloak v2 — Cybersecurity Intelligence Platform

**Light theme (default) + Dark mode** • Next.js 14 • TailwindCSS • PostgreSQL via Prisma • Supabase

## Quick Start
```bash
npm install
cp .env.example .env  # add your Supabase credentials
npx prisma db push
npm run dev
```

## Theme
- Default: **Clean white** with subtle glassmorphism
- Toggle: Sun/Moon icon in header switches to dark mode
- All components adapt automatically via CSS variables

## Architecture
- `app/` — Next.js App Router pages
- `components/` — Reusable UI components  
- `lib/` — Constants, DB, session, validation, data fetchers
- `prisma/` — Database schema (PostgreSQL)
- `middleware.ts` — Session cookie management

## Features
- 🌐 Live cybersecurity news (RSS feeds + API)
- 💣 Exploit database with upload, voting, comments
- 🗺️ Threat intelligence map (2D/3D)
- 🛰️ CVE tracker with timelines and detection rules
- 🧩 CTF challenges with file downloads
- 💬 Category-based chat rooms
- 🏆 Leaderboard with user profiles
- 🤖 AI assistant (expert + beginner mode)
- 🛡️ Defense mode (Snort/YARA rules)
- 👤 Anonymous persistent sessions (7-day cookies)
- 🔒 Admin panel (server-side auth)

## Database: Supabase (recommended)
Already configured for your Supabase project in Mumbai.
