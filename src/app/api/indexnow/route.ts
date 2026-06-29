import { NextResponse } from "next/server";
import { resolveSiteUrl } from "@/lib/site-url";

const INDEXNOW_KEY = "4987000e306144ec8609ede9a23f9b4b";
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/IndexNow";
const INDEXNOW_MAX_URLS = 1000;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 10;
const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();

export const dynamic = "force-dynamic";

/**
 * IndexNow API route — submits URLs to Bing, Yandex, and other
 * IndexNow-compatible search engines for immediate re-indexing.
 *
 * POST /api/indexnow
 * Body: { "urls": ["/path1/", "/path2/"] }
 * Header: Authorization: Bearer $INDEXNOW_SECRET
 *     or: X-IndexNow-Secret: $INDEXNOW_SECRET
 *
 * This is a server-side utility. It can be called from:
 * - CMS save hooks
 * - Deployment scripts
 * - Cron jobs after content updates
 */
export async function POST(request: Request) {
  if (isRateLimited(request)) {
    return NextResponse.json(
      { error: "Too many IndexNow requests." },
      { status: 429 },
    );
  }

  const authResult = authorizeRequest(request);
  if (!authResult.authorized) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status },
    );
  }

  const body = await request.json().catch(() => null);
  if (!body || !Array.isArray(body.urls)) {
    return NextResponse.json(
      { error: "Missing 'urls' array in request body." },
      { status: 400 },
    );
  }

  const siteUrl = resolveSiteUrl();
  const urls = normalizeUrls(body.urls, siteUrl);

  if (urls.length === 0) {
    return NextResponse.json(
      { error: "No valid URLs provided." },
      { status: 400 },
    );
  }

  try {
    const res = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: new URL(siteUrl).host,
        key: INDEXNOW_KEY,
        urlList: urls,
      }),
    });

    if (res.ok || res.status === 202) {
      return NextResponse.json({ success: true, submitted: urls.length });
    }

    return NextResponse.json(
      { error: `IndexNow returned ${res.status}` },
      { status: 502 },
    );
  } catch (_err) {
    return NextResponse.json(
      { error: "Failed to reach IndexNow API." },
      { status: 502 },
    );
  }
}

function authorizeRequest(
  request: Request,
):
  | { authorized: true }
  | { authorized: false; status: 401 | 503; error: string } {
  const configuredSecret = process.env.INDEXNOW_SECRET?.trim();
  if (!configuredSecret) {
    return {
      authorized: false,
      status: 503,
      error: "IndexNow API is not configured.",
    };
  }

  const providedSecret = readProvidedSecret(request);
  if (!providedSecret || !safeEquals(providedSecret, configuredSecret)) {
    return {
      authorized: false,
      status: 401,
      error: "Unauthorized.",
    };
  }

  return { authorized: true };
}

function readProvidedSecret(request: Request): string | null {
  const explicitHeader = request.headers.get("x-indexnow-secret")?.trim();
  if (explicitHeader) return explicitHeader;

  const authorization = request.headers.get("authorization")?.trim();
  const bearerPrefix = "Bearer ";
  if (authorization?.startsWith(bearerPrefix)) {
    return authorization.slice(bearerPrefix.length).trim();
  }

  return null;
}

function safeEquals(provided: string, expected: string) {
  if (provided.length !== expected.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < provided.length; i++) {
    result |= provided.charCodeAt(i) ^ expected.charCodeAt(i);
  }

  return result === 0;
}

function isRateLimited(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const key = ip || "unknown";
  const now = Date.now();
  const current = rateLimitBuckets.get(key);

  if (!current || current.resetAt <= now) {
    rateLimitBuckets.set(key, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return false;
  }

  current.count += 1;
  rateLimitBuckets.set(key, current);
  return current.count > RATE_LIMIT_MAX_REQUESTS;
}

function normalizeUrls(input: unknown[], siteUrl: string) {
  const origin = new URL(siteUrl).origin;
  const seen = new Set<string>();

  for (const value of input) {
    if (seen.size >= INDEXNOW_MAX_URLS || typeof value !== "string") {
      continue;
    }

    const path = value.trim();
    if (!path.startsWith("/") || path.startsWith("//")) {
      continue;
    }

    const url = new URL(path, `${origin}/`);
    if (url.origin !== origin) {
      continue;
    }

    url.hash = "";
    seen.add(url.href);
  }

  return [...seen];
}
