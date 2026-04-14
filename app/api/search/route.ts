import { NextRequest, NextResponse } from "next/server";
import { fetchRealCVEs, fetchRealNews } from "@/lib/fetchers";

// GET /api/search?q=apache
export async function GET(req: NextRequest) {
  const q = new URL(req.url).searchParams.get("q");
  if (!q || q.length < 2) return NextResponse.json({ exploits: [], cves: [], news: [] });

  try {
    // Fetch CVEs matching the query
    const [cves, news] = await Promise.all([
      fetchRealCVEs(q, 10),
      fetchRealNews(),
    ]);

    // Filter news by query
    const qLower = q.toLowerCase();
    const matchedNews = news.filter((n: any) =>
      n.title.toLowerCase().includes(qLower) ||
      n.summary.toLowerCase().includes(qLower) ||
      n.sourceName.toLowerCase().includes(qLower)
    ).slice(0, 10);

    return NextResponse.json({
      cves: cves.slice(0, 10),
      news: matchedNews,
      exploits: [], // exploits come from DB — add prisma query when DB has data
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message, cves: [], news: [], exploits: [] });
  }
}
