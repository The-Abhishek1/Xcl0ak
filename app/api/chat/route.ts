import { NextRequest, NextResponse } from "next/server";
import { chatMessageSchema } from "@/lib/validation";
import { rateLimitResponse } from "@/lib/rate-limit";

// ─── GET /api/chat?room=general ───
export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const rateLimited = rateLimitResponse(ip, "apiGeneral");
  if (rateLimited) return rateLimited;

  const { searchParams } = new URL(req.url);
  const roomSlug = searchParams.get("room") || "general";
  const before = searchParams.get("before"); // cursor pagination
  const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);

  // In production:
  // const room = await prisma.chatRoom.findUnique({ where: { slug: roomSlug } });
  // if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 });
  //
  // const messages = await prisma.chatMessage.findMany({
  //   where: {
  //     roomId: room.id,
  //     ...(before && { timestamp: { lt: new Date(before) } }),
  //   },
  //   orderBy: { timestamp: "desc" },
  //   take: limit,
  //   include: { author: { select: { username: true } } },
  // });

  return NextResponse.json({ data: [], room: roomSlug, message: "Connect PostgreSQL to enable." });
}

// ─── POST /api/chat ───
export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const rateLimited = rateLimitResponse(ip, "chat");
  if (rateLimited) return rateLimited;

  try {
    const body = await req.json();
    const { roomSlug, ...msgData } = body;
    const validated = chatMessageSchema.parse(msgData);

    // In production:
    // const session = await getSessionFromRequest(req);
    // const room = await prisma.chatRoom.findUnique({ where: { slug: roomSlug } });
    // const message = await prisma.chatMessage.create({
    //   data: { roomId: room.id, authorId: session.id, content: validated.content, replyToId: validated.replyToId },
    // });
    // // Also emit via Socket.IO for real-time:
    // io.to(roomSlug).emit("message", message);

    return NextResponse.json({ success: true, message: "Connect PostgreSQL and Socket.IO to enable." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
