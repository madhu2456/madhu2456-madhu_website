import type { NextRequest } from "next/server";
import proxyLogic from "@/proxy/index";

export default function proxy(request: NextRequest) {
  return proxyLogic(request);
}

export const config = {
  matcher: ["/cms/:path*", "/api/cms/:path*"],
};
