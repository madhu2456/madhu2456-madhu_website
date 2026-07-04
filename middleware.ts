import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import proxy from "./src/proxy";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (pathname.startsWith("/cms") || pathname.startsWith("/api/cms")) {
    const authResponse = proxy(request);
    if (authResponse.status === 401) {
      return authResponse;
    }
  }

  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const isProd = process.env.NODE_ENV === "production";
  const cspReportUri = process.env.CSP_REPORT_URI?.trim() || "/api/csp-report/";

  const cspHeader = `
    default-src 'self';
    script-src 'nonce-${nonce}' 'strict-dynamic'${!isProd ? " 'unsafe-eval'" : ""};
    script-src-elem 'self' 'nonce-${nonce}' https://www.googletagmanager.com https://static.cloudflareinsights.com;
    script-src-attr 'none';
    connect-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://static.cloudflareinsights.com https://api.resend.com${!isProd ? " ws: wss:" : ""};
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://images.unsplash.com https://www.googletagmanager.com https://www.google-analytics.com;
    font-src 'self' data:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    frame-src 'self' https://www.googletagmanager.com;
    ${isProd ? "upgrade-insecure-requests;" : ""}
  `
    .replace(/\s{2,}/g, " ")
    .trim();

  const cspWithReport = `${cspHeader} report-uri ${cspReportUri};`;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", cspWithReport);

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
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api(?!/cms)|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
