import { NextRequest, NextResponse } from "next/server";
import { approvalSchema } from "@/lib/validation";
import { rateLimitResponse } from "@/lib/rate-limit";
// import { requireAdmin } from "@/lib/session";
// import prisma from "@/lib/db";

// ─── GET /api/admin ───
// List all pending items (CVEs + CTF challenges)
export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const rateLimited = rateLimitResponse(ip, "apiGeneral");
  if (rateLimited) return rateLimited;

  try {
    // In production:
    // const session = await requireAdmin(req);
    //
    // const [pendingCVEs, pendingCTFs] = await Promise.all([
    //   prisma.cVEEntry.findMany({ where: { status: "PENDING" }, orderBy: { publishedAt: "desc" } }),
    //   prisma.cTFChallenge.findMany({ where: { status: "PENDING" }, orderBy: { createdAt: "desc" } }),
    // ]);

    return NextResponse.json({
      pendingCVEs: [],
      pendingCTFs: [],
      message: "Connect PostgreSQL to enable admin features.",
    });
  } catch (error: any) {
    if (error.message?.includes("Unauthorized")) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ─── POST /api/admin ───
// Approve or reject a pending item
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { itemId, itemType, ...approval } = body;
    const validated = approvalSchema.parse(approval);

    // In production:
    // const session = await requireAdmin(req);
    //
    // if (itemType === "cve") {
    //   await prisma.cVEEntry.update({
    //     where: { id: itemId },
    //     data: { status: validated.status.toUpperCase() as any },
    //   });
    // } else if (itemType === "ctf") {
    //   await prisma.cTFChallenge.update({
    //     where: { id: itemId },
    //     data: { status: validated.status.toUpperCase() as any },
    //   });
    // }
    //
    // // Update submitter reputation
    // if (validated.status === "approved") {
    //   await prisma.session.update({
    //     where: { id: submitterSessionId },
    //     data: { reputation: { increment: 50 } },
    //   });
    // }

    return NextResponse.json({
      success: true,
      message: `Item ${validated.status}. Connect PostgreSQL to persist.`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
