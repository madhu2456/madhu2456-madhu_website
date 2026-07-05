import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const config = {
  matcher: ["/cms/:path*", "/api/cms/:path*"],
};

// ---------------------------------------------------------------------------
// Brute-force rate limiting for CMS auth (in-memory, per-IP).
// Mirrors the pattern in src/app/actions/submit-contact-form.ts.
// ---------------------------------------------------------------------------
const authRateLimitMap = new Map<string, { count: number; resetAt: number }>();
const AUTH_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const AUTH_MAX_ATTEMPTS = 5;
const AUTH_MAP_CAP = 5_000;

function isAuthRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = authRateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    if (record) authRateLimitMap.delete(ip);
    // Evict oldest entries when the map grows too large.
    if (authRateLimitMap.size >= AUTH_MAP_CAP) {
      const evictCount = AUTH_MAP_CAP >> 2;
      let evicted = 0;
      for (const key of authRateLimitMap.keys()) {
        if (evicted >= evictCount) break;
        authRateLimitMap.delete(key);
        evicted++;
      }
    }
    authRateLimitMap.set(ip, { count: 1, resetAt: now + AUTH_WINDOW_MS });
    return false;
  }

  record.count += 1;
  return record.count > AUTH_MAX_ATTEMPTS;
}

const unauthorized = () =>
  new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Portfolio CMS", charset="UTF-8"',
      "Cache-Control": "no-store",
    },
  });

function constantTimeEqual(a: string, b: string): boolean {
  const len = Math.max(a.length, b.length);
  let result = 0;
  for (let i = 0; i < len; i++) {
    result |= a.charCodeAt(i % a.length) ^ b.charCodeAt(i % b.length);
  }
  return result === 0 && a.length === b.length;
}

export default function proxy(request: NextRequest) {
  // --- Rate-limit check (before any credential validation) ----------------
  const ip =
    request.headers.get("cf-connecting-ip")?.trim() ||
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    "anonymous";

  if (isAuthRateLimited(ip)) {
    return new NextResponse(
      "Too many authentication attempts. Try again later.",
      {
        status: 429,
        headers: { "Cache-Control": "no-store", "Retry-After": "900" },
      },
    );
  }

  const cmsUsername = process.env.CMS_AUTH_USERNAME?.trim() ?? "";
  const cmsPassword = process.env.CMS_AUTH_PASSWORD ?? "";

  const expectedCredentials =
    cmsUsername && cmsPassword ? btoa(`${cmsUsername}:${cmsPassword}`) : "";

  if (!expectedCredentials) {
    return unauthorized();
  }

  const authorizationHeader = request.headers.get("authorization");
  if (!authorizationHeader) {
    return unauthorized();
  }

  const [scheme, credentials] = authorizationHeader.trim().split(/\s+/, 2);
  if (scheme.toLowerCase() !== "basic" || !credentials) {
    return unauthorized();
  }

  if (!constantTimeEqual(credentials, expectedCredentials)) {
    return unauthorized();
  }

  return NextResponse.next();
}
