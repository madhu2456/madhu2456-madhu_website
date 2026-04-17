import { Buffer } from "node:buffer";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const cmsUsername = process.env.CMS_AUTH_USERNAME?.trim() ?? "";
const cmsPassword = process.env.CMS_AUTH_PASSWORD ?? "";
const expectedCredentials =
  cmsUsername && cmsPassword
    ? Buffer.from(`${cmsUsername}:${cmsPassword}`, "utf-8").toString("base64")
    : "";

const unauthorized = () =>
  new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Portfolio CMS", charset="UTF-8"',
      "Cache-Control": "no-store",
    },
  });

const isAuthorized = (request: NextRequest) => {
  if (!expectedCredentials) {
    return false;
  }

  const authorizationHeader = request.headers.get("authorization");
  if (!authorizationHeader) {
    return false;
  }

  const [scheme, credentials] = authorizationHeader.trim().split(/\s+/, 2);
  if (scheme.toLowerCase() !== "basic" || !credentials) {
    return false;
  }

  return credentials === expectedCredentials;
};

export function proxy(request: NextRequest) {
  if (!isAuthorized(request)) {
    return unauthorized();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/cms/:path*", "/api/cms/:path*"],
};
