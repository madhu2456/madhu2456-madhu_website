import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import cmsAuthProxy from "./src/proxy";

function hasFileExtension(pathname: string): boolean {
  const last = pathname.split("/").pop() ?? "";
  return last.includes(".");
}

/**
 * Audit v4/v5: trailingSlash:true emits external 308 for bare paths (known and
 * unknown). Internal rewrite to the slash form so clients see one hop:
 * known routes → 200, unknown → 404, without a 308 redirect chain.
 */
function rewriteBarePathToTrailingSlash(
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

  const url = request.nextUrl.clone();
  url.pathname = `${pathname}/`;
  return NextResponse.rewrite(url);
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // F-01: single-hop legacy /about → canonical /profile/
  if (pathname === "/about" || pathname === "/about/") {
    const url = request.nextUrl.clone();
    url.pathname = "/profile/";
    return NextResponse.redirect(url, 308);
  }

  // Branded short links (next.config also has these; handle early if proxy runs first)
  if (pathname === "/google" || pathname === "/google/") {
    return NextResponse.redirect(
      "https://maps.google.com/?cid=CXaUijPkQhVkEBM",
      302,
    );
  }
  if (pathname === "/reviews" || pathname === "/reviews/") {
    return NextResponse.redirect(
      "https://g.page/r/CXaUijPkQhVkEBM/review",
      302,
    );
  }

  if (pathname.startsWith("/cms") || pathname.startsWith("/api/cms")) {
    const authResponse = cmsAuthProxy(request);
    if (authResponse.status === 401 || authResponse.status === 429) {
      return authResponse;
    }
  }

  const bareRewrite = rewriteBarePathToTrailingSlash(request);
  if (bareRewrite) {
    return bareRewrite;
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
