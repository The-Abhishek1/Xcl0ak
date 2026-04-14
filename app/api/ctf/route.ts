import { NextRequest, NextResponse } from "next/server";
import { ctfChallengeSchema, flagSubmitSchema } from "@/lib/validation";
import { rateLimitResponse } from "@/lib/rate-limit";

// ─── GET /api/ctf ───
export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const rateLimited = rateLimitResponse(ip, "apiGeneral");
  if (rateLimited) return rateLimited;

  // In production:
  // const challenges = await prisma.cTFChallenge.findMany({
  //   where: { status: "APPROVED" },
  //   select: { id, title, description, category, difficulty, points, solveCount, hints: false, flagHash: false },
  //   orderBy: { createdAt: "desc" },
  // });

  return NextResponse.json({ data: [], message: "Connect PostgreSQL to enable." });
}

// ─── POST /api/ctf ───
// Submit a CTF challenge (requires admin approval)
export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const rateLimited = rateLimitResponse(ip, "upload");
  if (rateLimited) return rateLimited;

  try {
    const body = await req.json();
    const validated = ctfChallengeSchema.parse(body);

    // In production:
    // const session = await getSessionFromRequest(req);
    // const bcrypt = require("bcryptjs");
    // const flagHash = await bcrypt.hash(validated.flag, 12);
    // 
    // await prisma.cTFChallenge.create({
    //   data: {
    //     ...validated,
    //     flag: undefined,
    //     flagHash,
    //     authorId: session.id,
    //     status: "PENDING", // Requires admin approval
    //   },
    // });

    return NextResponse.json({
      success: true,
      message: "CTF challenge submitted for admin review.",
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
