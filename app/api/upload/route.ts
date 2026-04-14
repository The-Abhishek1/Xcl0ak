// app/api/upload/route.ts — CREATE THIS NEW FILE
// mkdir -p app/api/upload first
import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import crypto from "crypto";

const UPLOAD_DIR = join(process.cwd(), "public", "uploads");
const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_EXT = [".py", ".c", ".cpp", ".go", ".rs", ".asm", ".sh", ".js", ".rb", ".zip", ".tar.gz", ".gz", ".bin", ".elf", ".pcap", ".txt", ".md", ".json", ".yaml", ".yml", ".pdf"];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    // Validate size
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: `File too large. Max ${MAX_SIZE / 1024 / 1024}MB` }, { status: 400 });
    }

    // Validate extension
    const name = file.name.toLowerCase();
    const hasAllowedExt = ALLOWED_EXT.some(ext => name.endsWith(ext));
    if (!hasAllowedExt) {
      return NextResponse.json({ error: `File type not allowed. Allowed: ${ALLOWED_EXT.join(", ")}` }, { status: 400 });
    }

    // Create upload directory if it doesn't exist
    await mkdir(UPLOAD_DIR, { recursive: true });

    // Generate unique filename
    const hash = crypto.randomBytes(8).toString("hex");
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const filename = `${Date.now()}_${hash}_${safeName}`;
    const filepath = join(UPLOAD_DIR, filename);

    // Write file
    const bytes = await file.arrayBuffer();
    await writeFile(filepath, Buffer.from(bytes));

    // Return download URL
    const downloadUrl = `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      filename: file.name,
      storedAs: filename,
      size: file.size,
      sizeFormatted: file.size > 1024 * 1024
        ? `${(file.size / 1024 / 1024).toFixed(1)} MB`
        : `${(file.size / 1024).toFixed(1)} KB`,
      downloadUrl,
    });
  } catch (e: any) {
    console.error("Upload error:", e);
    return NextResponse.json({ error: e.message || "Upload failed" }, { status: 500 });
  }
}
