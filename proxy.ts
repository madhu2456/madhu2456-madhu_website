import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import cmsAuthProxy from "./src/proxy";

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

  // CSP is emitted by next.config.ts headers() — not here.
  // (Next 16.2 App Router does not reliably merge CSP set on NextResponse.next()
  // onto the final HTML response; verified locally 2026-07-21.)
  // Keep a request nonce for components that still read x-nonce (optional).
  const nonce = btoa(crypto.randomUUID()).replace(/=+$/, "");
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
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
