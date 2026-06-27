import { NextResponse } from "next/server";
import { resolveSiteUrl } from "@/lib/site-url";

const INDEXNOW_KEY = "4987000e306144ec8609ede9a23f9b4b";
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/IndexNow";

export const dynamic = "force-dynamic";

/**
 * IndexNow API route — submits URLs to Bing, Yandex, and other
 * IndexNow-compatible search engines for immediate re-indexing.
 *
 * POST /api/indexnow
 * Body: { "urls": ["/path1/", "/path2/"] }
 *
 * This is a server-side utility. It can be called from:
 * - CMS save hooks
 * - Deployment scripts
 * - Cron jobs after content updates
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || !Array.isArray(body.urls)) {
    return NextResponse.json(
      { error: "Missing 'urls' array in request body." },
      { status: 400 },
    );
  }

  const siteUrl = resolveSiteUrl();
  const urls = (body.urls as string[])
    .filter((url) => typeof url === "string" && url.startsWith("/"))
    .map((url) => `${siteUrl}${url.replace(/^\//, "")}`)
    .slice(0, 10_000); // IndexNow limit

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
        host: "madhudadi.in",
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
