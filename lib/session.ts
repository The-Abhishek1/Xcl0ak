import { cookies } from "next/headers";
import prisma from "./db";
import { generateUsername } from "./constants";

export interface SessionData {
  id: string;
  username: string;
  role: "USER" | "ADMIN";
  reputation: number;
}

export async function getOrCreateSession(): Promise<SessionData | null> {
  const cookieStore = cookies();
  const sessionId = cookieStore.get("xc_session")?.value;
  if (!sessionId) return null;

  try {
    let session = await prisma.session.findUnique({
      where: { id: sessionId },
      select: { id: true, username: true, role: true, reputation: true, expiresAt: true },
    });

    if (session && session.expiresAt > new Date()) {
      await prisma.session.update({ where: { id: sessionId }, data: { lastActiveAt: new Date() } });
      return { id: session.id, username: session.username, role: session.role, reputation: session.reputation };
    }

    // Create new session with cookie ID
    session = await prisma.session.create({
      data: {
        id: sessionId,
        username: generateUsername(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      select: { id: true, username: true, role: true, reputation: true, expiresAt: true },
    });
    return { id: session.id, username: session.username, role: session.role, reputation: session.reputation };
  } catch (e) {
    console.error("Session error:", e);
    return null;
  }
}

export async function getSessionFromRequest(req: Request): Promise<SessionData | null> {
  const cookieHeader = req.headers.get("cookie") || "";
  const match = cookieHeader.match(/xc_session=([^;]+)/);
  if (!match) return null;
  try {
    const session = await prisma.session.findUnique({
      where: { id: match[1] },
      select: { id: true, username: true, role: true, reputation: true, expiresAt: true },
    });
    if (session && session.expiresAt > new Date()) return { id: session.id, username: session.username, role: session.role, reputation: session.reputation };
  } catch { }
  return null;
}

export async function requireAdmin(req: Request): Promise<SessionData> {
  const session = await getSessionFromRequest(req);
  if (!session || session.role !== "ADMIN") throw new Error("Unauthorized: Admin required");
  return session;
}
