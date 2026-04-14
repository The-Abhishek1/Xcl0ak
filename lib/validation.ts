import { z } from "zod";

export const exploitUploadSchema = z.object({
  title: z.string().min(10).max(200).transform(s => s.trim()),
  description: z.string().min(30).max(10000).transform(s => s.trim()),
  code: z.string().max(500000).optional().default(""),
  category: z.string().max(50),
  os: z.string().max(30),
  severity: z.enum(["critical","high","medium","low","info"]),
  language: z.string().max(30),
  payloadType: z.string().max(50),
  cveId: z.string().regex(/^CVE-\d{4}-\d{4,}$/).nullable().optional(),
  tags: z.array(z.string().max(30)).max(10).optional().default([]),
});

export const cveSubmitSchema = z.object({
  id: z.string().regex(/^CVE-\d{4}-\d{4,}$/),
  title: z.string().min(10).max(300),
  description: z.string().min(30).max(20000),
  severity: z.enum(["critical","high","medium","low","info"]),
  cvssScore: z.number().min(0).max(10),
  vendor: z.string().min(1).max(100),
  product: z.string().min(1).max(100),
  affectedVersions: z.string().max(500).optional(),
  patchUrl: z.string().url().optional().nullable(),
  references: z.array(z.string().url()).max(20).optional().default([]),
  mitigations: z.string().max(10000).optional(),
});

export const ctfChallengeSchema = z.object({
  title: z.string().min(5).max(150),
  description: z.string().min(20).max(10000),
  category: z.enum(["Web","Binary","Crypto","Reverse","Forensics","Network","OSINT","Misc"]),
  difficulty: z.enum(["Easy","Medium","Hard","Insane"]),
  points: z.number().int().min(10).max(5000),
  flag: z.string().min(5).max(200),
  hints: z.array(z.string().max(500)).max(5).optional().default([]),
});

export const commentSchema = z.object({
  content: z.string().min(2).max(5000).transform(s => s.trim()),
  parentId: z.string().optional().nullable(),
});

export const chatMessageSchema = z.object({
  content: z.string().min(1).max(2000).transform(s => s.trim()),
  replyToId: z.string().optional().nullable(),
});

export const searchSchema = z.object({
  q: z.string().min(2).max(200),
  type: z.enum(["all","exploits","cves","news"]).optional().default("all"),
});
