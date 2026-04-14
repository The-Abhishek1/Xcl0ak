// ─── Identity ───
const ADJ = ["Shadow","Ghost","Phantom","Cipher","Silent","Neon","Void","Hex","Null","Binary","Stealth","Omega","Echo","Flux","Rogue","Spectral","Cobalt","Quantum","Arctic","Crimson","Iron","Onyx"];
const NOUN = ["Hacker","Runner","Fox","Wolf","Hawk","Viper","Knight","Raven","Storm","Byte","Vector","Proxy","Shell","Root","Daemon","Wraith","Mantis","Falcon","Cobra","Phoenix","Titan","Pulse"];
export const generateUsername = () => `${ADJ[~~(Math.random()*ADJ.length)]}${NOUN[~~(Math.random()*NOUN.length)]}${~~(Math.random()*999)}`;
export const generateId = () => `${Date.now().toString(36)}_${Math.random().toString(36).slice(2,8)}`;

// ─── Sanitization ───
export function sanitize(str: string): string {
  return str.replace(/[<>"'&]/g, c => ({"<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;","&":"&amp;"}[c] || c)).trim();
}

// ─── Time ───
export function timeAgo(date: Date | string | number): string {
  const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (s < 10) return "now";
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.floor(s/60)}m`;
  if (s < 86400) return `${Math.floor(s/3600)}h`;
  if (s < 604800) return `${Math.floor(s/86400)}d`;
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ─── Severity ───
export const SEVERITY_CONFIG = {
  critical: { label: "Critical", color: "#ef4444", bg: "rgba(239,68,68,0.08)", darkBg: "rgba(239,68,68,0.12)" },
  high:     { label: "High",     color: "#f59e0b", bg: "rgba(245,158,11,0.08)", darkBg: "rgba(245,158,11,0.12)" },
  medium:   { label: "Medium",   color: "#eab308", bg: "rgba(234,179,8,0.08)",  darkBg: "rgba(234,179,8,0.12)" },
  low:      { label: "Low",      color: "#22c55e", bg: "rgba(34,197,94,0.08)",  darkBg: "rgba(34,197,94,0.12)" },
  info:     { label: "Info",     color: "#06b6d4", bg: "rgba(6,182,212,0.08)",  darkBg: "rgba(6,182,212,0.12)" },
} as const;

export const THREAT_LEVEL_COLORS: Record<string, string> = {
  critical: "#ef4444", high: "#f59e0b", medium: "#eab308", elevated: "#06b6d4", monitoring: "#22c55e",
};

// ─── Categories ───
export const EXPLOIT_CATEGORIES = ["Buffer Overflow","SQL Injection","XSS","RCE","Privilege Escalation","DoS","CSRF","SSRF","Path Traversal","Deserialization","Memory Corruption","Race Condition","Supply Chain","Zero Day","Logic Flaw","Other"] as const;
export const OS_TYPES = ["Windows","Linux","macOS","Android","iOS","Cross-Platform","IoT","Embedded"] as const;
export const LANGUAGES = ["Python","C","C++","Go","Rust","Assembly","JavaScript","Ruby","Bash","PowerShell","Other"] as const;
export const NEWS_CATEGORIES = ["Breaches","Malware","Vulnerabilities","Government","APT","Ransomware","Supply Chain","IoT","AI Security"] as const;
export const REGIONS = ["All","North America","Europe","Asia","Middle East","Africa","South America","Oceania"] as const;
export const COUNTRIES = [
  {code:"US",name:"United States",region:"North America"},{code:"GB",name:"United Kingdom",region:"Europe"},
  {code:"DE",name:"Germany",region:"Europe"},{code:"FR",name:"France",region:"Europe"},
  {code:"UA",name:"Ukraine",region:"Europe"},{code:"RU",name:"Russia",region:"Europe"},
  {code:"CN",name:"China",region:"Asia"},{code:"JP",name:"Japan",region:"Asia"},
  {code:"KR",name:"South Korea",region:"Asia"},{code:"IN",name:"India",region:"Asia"},
  {code:"IL",name:"Israel",region:"Middle East"},{code:"IR",name:"Iran",region:"Middle East"},
  {code:"AU",name:"Australia",region:"Oceania"},{code:"BR",name:"Brazil",region:"South America"},
  {code:"SG",name:"Singapore",region:"Asia"},{code:"TW",name:"Taiwan",region:"Asia"},
] as const;

export const CHAT_ROOMS = [
  {id:"general",name:"General",slug:"general",desc:"General discussion",category:"Community",icon:"💬"},
  {id:"exploits",name:"Exploit Dev",slug:"exploits",desc:"Exploit development",category:"Security",icon:"💣"},
  {id:"malware",name:"Malware Analysis",slug:"malware",desc:"Malware RE",category:"Security",icon:"🦠"},
  {id:"web",name:"Web Security",slug:"web-security",desc:"Web app security",category:"Security",icon:"🌐"},
  {id:"ctf",name:"CTF",slug:"ctf-discussion",desc:"CTF strategies",category:"Security",icon:"🏁"},
  {id:"osint",name:"OSINT",slug:"osint",desc:"Open source intel",category:"Security",icon:"🔍"},
  {id:"news",name:"News",slug:"news",desc:"Breaking news",category:"Community",icon:"📰"},
  {id:"gaming",name:"Gaming",slug:"gaming",desc:"Gaming & off-topic",category:"Community",icon:"🎮"},
  {id:"career",name:"Career",slug:"career",desc:"InfoSec careers",category:"Community",icon:"💼"},
] as const;

export const BADGES = [
  {id:"first_blood",name:"First Blood",icon:"🩸",desc:"Upload your first exploit"},
  {id:"arsenal",name:"Arsenal",icon:"⚔️",desc:"Upload 10 exploits"},
  {id:"influencer",name:"Influencer",icon:"⭐",desc:"Receive 100 upvotes"},
  {id:"flag_hunter",name:"Flag Hunter",icon:"🏴",desc:"Solve a CTF challenge"},
  {id:"analyst",name:"Analyst",icon:"🔬",desc:"Post 50 comments"},
  {id:"persistent",name:"Persistent",icon:"🔥",desc:"7-day streak"},
  {id:"zero_day",name:"Zero Day",icon:"💀",desc:"Submit verified zero-day"},
  {id:"defender",name:"Defender",icon:"🛡️",desc:"Submit 10 mitigations"},
  {id:"elite",name:"Elite",icon:"👑",desc:"Top 10 reputation"},
] as const;

// ─── Rate Limits ───
export const RATE_LIMITS = {
  vote: { points: 15, duration: 60 },
  comment: { points: 5, duration: 60 },
  upload: { points: 3, duration: 300 },
  chat: { points: 10, duration: 10 },
  search: { points: 30, duration: 60 },
  flagSubmit: { points: 5, duration: 60 },
  api: { points: 100, duration: 60 },
} as const;

// ─── API Sources ───
export const API_SOURCES = {
  nvd: "https://services.nvd.nist.gov/rest/json/cves/2.0",
  news_feeds: [
    {url:"https://feeds.feedburner.com/TheHackersNews", source:"The Hacker News"},
    {url:"https://www.bleepingcomputer.com/feed/", source:"BleepingComputer"},
    {url:"https://krebsonsecurity.com/feed/", source:"KrebsOnSecurity"},
  ],
  otx: "https://otx.alienvault.com/api/v1/pulses/subscribed",
} as const;
