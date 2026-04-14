import { NextRequest, NextResponse } from "next/server";
import { fetchRealThreats } from "@/lib/fetchers";
import { mockThreats } from "@/lib/mock-data";

// GET /api/threats
export async function GET(req: NextRequest) {
  try {
    let threats = await fetchRealThreats();

    // If OTX returned nothing (no key or error), use mock data as fallback
    if (threats.length === 0) {
      threats = mockThreats();
      return NextResponse.json({ data: threats, count: threats.length, source: "mock (set OTX_API_KEY for real data)" });
    }

    return NextResponse.json({ data: threats, count: threats.length, source: "AlienVault OTX" });
  } catch (e: any) {
    // Fallback to mock
    const threats = mockThreats();
    return NextResponse.json({ data: threats, count: threats.length, source: "mock (fallback)", error: e.message });
  }
}
