import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { COMMERCIAL_LANDERS } from "./src/lib/seo/commercial-landers";
import cmsAuthProxy from "./src/proxy";

/** Top-level segments that have real App Router pages (308 slash is correct). */
const KNOWN_TOP_LEVEL = new Set([
  "profile",
  "services",
  "case-studies",
  "credentials",
  "contact",
  "privacy",
  "privacy-policy",
  "ai-consultant-india",
  "guides",
  "cms",
  "search",
  "about",
  "google",
  "reviews",
  ...COMMERCIAL_LANDERS.map((lander) => lander.slug),
]);

/** Nested prefixes that always use trailingSlash 308 (valid or not). */
const KNOWN_PREFIXES = [
  "/services/",
  "/case-studies/",
  "/guides/",
  "/cms/",
  "/api/",
  "/blog/",
];

function hasFileExtension(pathname: string): boolean {
  const last = pathname.split("/").pop() ?? "";
  return last.includes(".");
}

/**
 * Audit v4: unknown bare paths were 308 → trailing slash → 404 (extra hop).
 * Known routes keep Next trailingSlash 308. Unknown bare paths rewrite to
 * the slash form so not-found returns 404 in one response.
 */
function maybeRewriteUnknownBarePath(
  request: NextRequest,
): NextResponse | null {
  const pathname = request.nextUrl.pathname;
  if (
    pathname === "/" ||
    pathname.endsWith("/") ||
    hasFileExtension(pathname)
  ) {
    return null;
  }

  const withSlash = `${pathname}/`;
  if (KNOWN_PREFIXES.some((prefix) => withSlash.startsWith(prefix))) {
    return null;
  }

  const segment = pathname.replace(/^\//, "").split("/")[0] ?? "";
  if (KNOWN_TOP_LEVEL.has(segment)) {
    return null;
  }

  const url = request.nextUrl.clone();
  url.pathname = withSlash;
  return NextResponse.rewrite(url);
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // F-01: single-hop legacy /about → canonical /profile/ (before trailingSlash can
  // insert an intermediate /about/ hop from bare /about).
  if (pathname === "/about" || pathname === "/about/") {
    const url = request.nextUrl.clone();
    url.pathname = "/profile/";
    return NextResponse.redirect(url, 308);
  }

  if (pathname.startsWith("/cms") || pathname.startsWith("/api/cms")) {
    const authResponse = cmsAuthProxy(request);
    if (authResponse.status === 401 || authResponse.status === 429) {
      return authResponse;
    }
  }

  const unknownBare = maybeRewriteUnknownBarePath(request);
  if (unknownBare) {
    return unknownBare;
  }

  // CSP is emitted by next.config.ts headers() — not here.
  // Portfolio layout intentionally does not read request headers (edge-cacheable HTML).
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes), UNLESS starting with api/cms
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, sitemap-portfolio.xml, robots.txt (metadata files)
     */
    "/((?!api(?!/cms)|_next/static|_next/image|favicon.ico|sitemap.xml|sitemap-portfolio.xml|robots.txt).*)",
  ],
};
