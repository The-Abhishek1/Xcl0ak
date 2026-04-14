import { NextRequest, NextResponse } from "next/server";
import { fetchRealNews } from "@/lib/fetchers";

// GET /api/news?region=North+America&category=Malware
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const region = searchParams.get("region");
  const category = searchParams.get("category");

  try {
    let articles = await fetchRealNews();

    if (region && region !== "All") {
      articles = articles.filter((a: any) => a.region === region);
    }
    if (category && category !== "All") {
      articles = articles.filter((a: any) => a.category === category);
    }

    return NextResponse.json({ data: articles, count: articles.length, source: "RSS Feeds" });
  } catch (e: any) {
    return NextResponse.json({ error: e.message, data: [] }, { status: 500 });
  }
}
