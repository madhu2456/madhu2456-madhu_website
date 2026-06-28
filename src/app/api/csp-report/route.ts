import { NextResponse } from "next/server";

const MAX_REPORT_BYTES = 20_000;
const REPORT_LOGGING_ENABLED = process.env.CSP_REPORT_LOG === "true";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_REPORT_BYTES) {
    return NextResponse.json({ error: "Report too large." }, { status: 413 });
  }

  const rawBody = await request.text();
  if (rawBody.length > MAX_REPORT_BYTES) {
    return NextResponse.json({ error: "Report too large." }, { status: 413 });
  }

  if (REPORT_LOGGING_ENABLED && rawBody.trim()) {
    console.warn("[csp-report]", rawBody.slice(0, MAX_REPORT_BYTES));
  }

  return new Response(null, { status: 204 });
}
