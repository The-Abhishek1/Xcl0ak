// ─── Core Types ───
export type Severity = "critical" | "high" | "medium" | "low" | "info";
export type ThreatLevel = "critical" | "high" | "medium" | "elevated" | "monitoring";
export type ApprovalStatus = "pending" | "approved" | "rejected";
export type VoteDirection = "up" | "down";

// ─── Session & Identity ───
export interface AnonSession {
  id: string;
  username: string;
  createdAt: Date;
  expiresAt: Date;
  reputation: number;
  role: "user" | "admin";
}

// ─── Exploits ───
export interface Exploit {
  id: string;
  title: string;
  description: string;
  code: string;
  author: string;         // anonymous username
  authorSessionId: string;
  category: ExploitCategory;
  os: OperatingSystem;
  severity: Severity;
  cveId: string | null;
  language: ProgrammingLanguage;
  payloadType: PayloadType;
  tags: string[];
  upvotes: number;
  downvotes: number;
  commentCount: number;
  downloadCount: number;
  viewCount: number;
  verified: boolean;
  trending: boolean;
  status: ApprovalStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type ExploitCategory =
  | "Buffer Overflow" | "SQL Injection" | "XSS" | "RCE"
  | "Privilege Escalation" | "DoS" | "CSRF" | "SSRF"
  | "Path Traversal" | "Deserialization" | "Memory Corruption"
  | "Logic Flaw" | "Race Condition" | "Supply Chain"
  | "Side Channel" | "Zero Day" | "Other";

export type OperatingSystem =
  | "Windows" | "Linux" | "macOS" | "Android"
  | "iOS" | "Cross-Platform" | "IoT" | "Embedded";

export type ProgrammingLanguage =
  | "Python" | "C" | "C++" | "Go" | "Rust"
  | "Assembly" | "JavaScript" | "Ruby" | "Bash" | "PowerShell" | "Other";

export type PayloadType =
  | "Shellcode" | "Script" | "Binary" | "PoC"
  | "Module" | "Framework" | "Exploit Kit" | "Other";

// ─── CVE ───
export interface CVEEntry {
  id: string;            // CVE-YYYY-NNNNN
  title: string;
  description: string;
  severity: Severity;
  cvssScore: number;
  cvssVector: string;
  vendor: string;
  product: string;
  affectedVersions: string;
  patchUrl: string | null;
  exploitIds: string[];  // linked exploit IDs
  references: string[];
  submittedBy: string;
  status: ApprovalStatus;
  cveStatus: "Active" | "Patched" | "Under Review" | "Disputed";
  publishedAt: Date;
  updatedAt: Date;
  mitigations: string;
  detectionRules: DetectionRules;
}

export interface DetectionRules {
  snort: string;
  yara: string;
  sigma: string;
}

// ─── News ───
export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  sourceUrl: string;
  sourceName: string;
  country: string;
  region: string;
  severity: Severity;
  tags: string[];
  publishedAt: Date;
  relatedCveIds: string[];
  relatedExploitIds: string[];
}

// ─── Threat Map ───
export interface ThreatEvent {
  id: string;
  type: ThreatType;
  level: ThreatLevel;
  latitude: number;
  longitude: number;
  country: string;
  countryCode: string;
  city: string;
  description: string;
  source: string;
  affectedSectors: string[];
  attackVector: string;
  ttps: string[];         // MITRE ATT&CK
  iocs: string[];         // indicators of compromise
  relatedCveIds: string[];
  timestamp: Date;
  active: boolean;
}

export type ThreatType =
  | "ransomware" | "apt" | "phishing" | "ddos"
  | "malware" | "zero_day" | "supply_chain" | "espionage"
  | "wiper" | "banking_trojan" | "cryptojacking" | "data_breach"
  | "scam" | "defacement" | "insider_threat";

// ─── Layers (like reference image) ───
export interface MapLayer {
  id: string;
  label: string;
  icon: string;
  color: string;
  enabled: boolean;
}

// ─── CTF ───
export interface CTFChallenge {
  id: string;
  title: string;
  description: string;
  category: CTFCategory;
  difficulty: "Easy" | "Medium" | "Hard" | "Insane";
  points: number;
  flag: string;          // hashed, never sent to client
  hints: string[];
  solveCount: number;
  maxAttempts: number;
  authorUsername: string;
  status: ApprovalStatus;
  createdAt: Date;
  files: string[];       // download URLs
}

export type CTFCategory =
  | "Web" | "Binary" | "Crypto" | "Reverse"
  | "Forensics" | "Network" | "OSINT" | "Misc";

// ─── Chat ───
export interface ChatRoom {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: ChatRoomCategory;
  memberCount: number;
  messageCount: number;
  lastActivity: Date;
}

export type ChatRoomCategory =
  | "general" | "exploits" | "malware" | "web-security"
  | "reverse-engineering" | "ctf-discussion" | "news"
  | "gaming" | "career" | "tools" | "off-topic";

export interface ChatMessage {
  id: string;
  roomId: string;
  authorUsername: string;
  authorSessionId: string;
  content: string;
  timestamp: Date;
  replyToId: string | null;
}

// ─── Comments ───
export interface Comment {
  id: string;
  targetType: "exploit" | "cve" | "news" | "ctf";
  targetId: string;
  authorUsername: string;
  authorSessionId: string;
  content: string;
  parentId: string | null;  // for threading
  upvotes: number;
  downvotes: number;
  createdAt: Date;
  replies?: Comment[];
}

// ─── Leaderboard ───
export interface LeaderboardEntry {
  rank: number;
  username: string;
  sessionId: string;
  reputation: number;
  exploitCount: number;
  ctfSolves: number;
  commentCount: number;
  badges: Badge[];
  country: string | null;
  region: string | null;
  streak: number;
  joinedAt: Date;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  awardedAt: Date;
}

// ─── API Types ───
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}
