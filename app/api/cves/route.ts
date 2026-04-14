import { NextRequest, NextResponse } from "next/server";
import { fetchRealCVEs } from "@/lib/fetchers";

// GET /api/cves?keyword=apache&limit=20
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get("keyword") || undefined;
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);

  try {
    const cves = await fetchRealCVEs(keyword, limit);
    return NextResponse.json({ data: cves, count: cves.length, source: "NVD" });
  } catch (e: any) {
    return NextResponse.json({ error: e.message, data: [] }, { status: 500 });
  }
}
