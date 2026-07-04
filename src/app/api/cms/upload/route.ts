import { Buffer } from "node:buffer";
import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { resolveSiteUrl } from "@/lib/site-url";

const uploadRateLimit = new Map<string, { count: number; resetAt: number }>();
const UPLOAD_RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_UPLOADS_PER_WINDOW = 5;
const MAX_RATE_LIMIT_ENTRIES = 10_000;

function isUploadRateLimited(ip: string): boolean {
  const now = Date.now();

  // Evict expired rate limit records on-demand during new requests
  // instead of using a setInterval timer to avoid memory leaks in serverless.
  for (const [key, value] of uploadRateLimit.entries()) {
    if (now > value.resetAt) {
      uploadRateLimit.delete(key);
    }
  }

  // Bounded eviction: if the map is still too large after cleanup, drop the
  // oldest entries (first inserted) to cap memory usage on long-lived servers.
  if (uploadRateLimit.size >= MAX_RATE_LIMIT_ENTRIES) {
    const evictCount = MAX_RATE_LIMIT_ENTRIES >> 2; // evict 25%
    let evicted = 0;
    for (const key of uploadRateLimit.keys()) {
      if (evicted >= evictCount) break;
      uploadRateLimit.delete(key);
      evicted++;
    }
  }

  const record = uploadRateLimit.get(ip);
  if (!record) {
    uploadRateLimit.set(ip, {
      count: 1,
      resetAt: now + UPLOAD_RATE_LIMIT_WINDOW,
    });
    return false;
  }

  record.count += 1;
  return record.count > MAX_UPLOADS_PER_WINDOW;
}

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const validateCmsOrigin = (request: Request) => {
  const origin = request.headers.get("origin");
  const siteUrl = resolveSiteUrl();
  const isAllowedOrigin =
    origin === siteUrl ||
    origin === `${siteUrl}/` ||
    (process.env.NODE_ENV !== "production" &&
      Boolean(
        origin?.startsWith("http://localhost:") ||
          origin?.startsWith("http://127.0.0.1:"),
      ));
  return isAllowedOrigin;
};

const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/avif",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const extensionByMime: Record<string, string> = {
  "image/avif": ".avif",
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

const sanitizeBaseName = (value: string) =>
  value
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "image";

const MIME_MAGIC_BYTES: Record<string, (buf: Buffer) => boolean> = {
  "image/jpeg": (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  "image/png": (b) =>
    b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47,
  "image/gif": (b) =>
    b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x38,
  "image/webp": (b) =>
    b[0] === 0x52 &&
    b[1] === 0x49 &&
    b[2] === 0x46 &&
    b[3] === 0x46 &&
    b[8] === 0x57 &&
    b[9] === 0x45 &&
    b[10] === 0x42 &&
    b[11] === 0x50,
  "image/avif": (b) =>
    b[4] === 0x66 &&
    b[5] === 0x74 &&
    b[6] === 0x79 &&
    b[7] === 0x70 &&
    b[8] === 0x61 &&
    b[9] === 0x76 &&
    b[10] === 0x69 &&
    b[11] === 0x66,
};

const hasValidMagicBytes = (buffer: Buffer, mimeType: string): boolean => {
  const check = MIME_MAGIC_BYTES[mimeType];
  if (!check) return false;
  return buffer.length >= 12 && check(buffer);
};

export async function POST(request: Request) {
  if (!validateCmsOrigin(request)) {
    return NextResponse.json({ error: "Forbidden origin." }, { status: 403 });
  }

  const cfConnectingIp = request.headers.get("cf-connecting-ip");
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip =
    cfConnectingIp?.trim() ||
    (forwardedFor ? forwardedFor.split(",")[0].trim() : "anonymous");
  if (isUploadRateLimited(ip)) {
    return NextResponse.json(
      { error: "Rate limit exceeded." },
      { status: 429 },
    );
  }

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
          "Unsupported file type. Please upload a JPG, PNG, WEBP, AVIF, or GIF image.",
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

  const buffer = Buffer.from(await fileValue.arrayBuffer());
  if (!hasValidMagicBytes(buffer, fileValue.type)) {
    return NextResponse.json(
      { error: "File content does not match the declared image type." },
      { status: 400 },
    );
  }

  const outputDirectory = path.join(process.cwd(), "public", "uploads", "cms");
  await fs.mkdir(outputDirectory, { recursive: true });

  const extension = extensionByMime[fileValue.type] || ".png";
  const baseName = sanitizeBaseName(fileValue.name);
  const fileName = `${baseName}-${Date.now()}-${crypto.randomUUID().slice(0, 8)}${extension}`;
  const outputFilePath = path.join(outputDirectory, fileName);

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
