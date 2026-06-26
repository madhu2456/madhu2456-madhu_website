import { Buffer } from "node:buffer";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const config = {
  matcher: ["/cms/:path*", "/api/cms/:path*"],
};

const unauthorized = () =>
  new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Portfolio CMS", charset="UTF-8"',
      "Cache-Control": "no-store",
    },
  });

export default function proxy(request: NextRequest) {
  const cmsUsername = process.env.CMS_AUTH_USERNAME?.trim() ?? "";
  const cmsPassword = process.env.CMS_AUTH_PASSWORD ?? "";

  const expectedCredentials =
    cmsUsername && cmsPassword
      ? Buffer.from(`${cmsUsername}:${cmsPassword}`).toString("base64")
      : "";

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

  if (credentials.length !== expectedCredentials.length) {
    return unauthorized();
  }

  let isEqual = false;

  // manual fallback for edge environments that lack timingSafeEqual
  let result = 0;
  for (let i = 0; i < expectedCredentials.length; i++) {
    result |= expectedCredentials.charCodeAt(i) ^ credentials.charCodeAt(i);
  }
  isEqual = result === 0 && expectedCredentials.length === credentials.length;

  if (!isEqual) {
    return unauthorized();
  }

  return NextResponse.next();
}
