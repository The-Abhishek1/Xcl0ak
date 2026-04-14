import { NextRequest, NextResponse } from "next/server";
import { rateLimitResponse } from "@/lib/rate-limit";

// ─── GET /api/leaderboard ───
export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const rateLimited = rateLimitResponse(ip, "apiGeneral");
  if (rateLimited) return rateLimited;

  const { searchParams } = new URL(req.url);
  const region = searchParams.get("region");
  const country = searchParams.get("country");
  const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);

  // In production:
  // const where = {
  //   ...(region && { region }),
  //   ...(country && { country }),
  // };
  // const leaders = await prisma.session.findMany({
  //   where,
  //   orderBy: { reputation: "desc" },
  //   take: limit,
  //   select: {
  //     id: true, username: true, reputation: true, country: true, region: true, streak: true,
  //     _count: { select: { exploits: true, comments: true, ctfAttempts: { where: { correct: true } } } },
  //     badges: { include: { badge: true } },
  //   },
  // });

  return NextResponse.json({ data: [], message: "Connect PostgreSQL to enable." });
}
