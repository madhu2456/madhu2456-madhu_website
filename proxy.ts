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

  // Edge-safe nonce (no Node Buffer — Buffer crashes Edge and can drop CSP entirely).
  const nonce = btoa(crypto.randomUUID()).replace(/=+$/, "");
  const isProd = process.env.NODE_ENV === "production";
  const cspReportUri = process.env.CSP_REPORT_URI?.trim() || "/api/csp-report/";

  // Blog-compatible baseline that works even if a script misses a nonce:
  // nonce + strict-dynamic for modern browsers, 'unsafe-inline' ignored when
  // a nonce is present (CSP3), still allows GTM/CF insights hosts.
  const cspHeader = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-inline' https://www.googletagmanager.com https://static.cloudflareinsights.com${isProd ? "" : " 'unsafe-eval'"}`,
    "script-src-attr 'none'",
    `connect-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://static.cloudflareinsights.com https://api.resend.com${isProd ? "" : " ws: wss:"}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' blob: data: https://images.unsplash.com https://www.googletagmanager.com https://www.google-analytics.com",
    "font-src 'self' data:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "frame-src 'self' https://www.googletagmanager.com",
    ...(isProd ? ["upgrade-insecure-requests"] : []),
  ].join("; ");

  const cspWithReport = `${cspHeader}; report-uri ${cspReportUri}`;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set("Content-Security-Policy", cspWithReport);

  return response;
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
