import { Buffer } from "node:buffer";
import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

const extensionByMime: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/svg+xml": ".svg",
};

const sanitizeBaseName = (value: string) =>
  value
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "image";

export async function POST(request: Request) {
  const formData = await request.formData();
  const fileValue = formData.get("file");

  if (!(fileValue instanceof File)) {
    return NextResponse.json(
      { error: "A file field named 'file' is required." },
      { status: 400 },
    );
  }

  if (!ALLOWED_TYPES.has(fileValue.type)) {
    return NextResponse.json(
      {
        error:
          "Unsupported file type. Please upload a JPG, PNG, WEBP, GIF, or SVG image.",
      },
      { status: 400 },
    );
  }

  if (fileValue.size > MAX_FILE_SIZE_BYTES) {
    return NextResponse.json(
      { error: "File is too large. Maximum upload size is 8MB." },
      { status: 400 },
    );
  }

  const outputDirectory = path.join(process.cwd(), "public", "uploads", "cms");
  await fs.mkdir(outputDirectory, { recursive: true });

  const extension = extensionByMime[fileValue.type] || ".png";
  const baseName = sanitizeBaseName(fileValue.name);
  const fileName = `${baseName}-${Date.now()}-${crypto.randomUUID().slice(0, 8)}${extension}`;
  const outputFilePath = path.join(outputDirectory, fileName);

  const buffer = Buffer.from(await fileValue.arrayBuffer());
  await fs.writeFile(outputFilePath, buffer);

  return NextResponse.json(
    {
      url: `/uploads/cms/${fileName}`,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
