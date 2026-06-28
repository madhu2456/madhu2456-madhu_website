import { NextResponse } from "next/server";

const MAX_BODY_BYTES = 4_000;
const LOGGING_ENABLED = process.env.WEB_VITALS_LOG === "true";

const ALLOWED_METRICS = new Set(["CLS", "FCP", "INP", "LCP", "TTFB"]);

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Payload too large." }, { status: 413 });
  }

  const payload = (await request.json().catch(() => null)) as unknown;
  if (!isWebVitalPayload(payload)) {
    return NextResponse.json({ error: "Invalid metric." }, { status: 400 });
  }

  if (LOGGING_ENABLED) {
    console.info("[web-vitals]", payload);
  }

  return new Response(null, { status: 204 });
}

function isWebVitalPayload(value: unknown): value is {
  name: string;
  value: number;
  id: string;
  rating: string;
  page: string;
} {
  if (!value || typeof value !== "object") return false;

  const payload = value as Record<string, unknown>;
  return (
    typeof payload.name === "string" &&
    ALLOWED_METRICS.has(payload.name) &&
    typeof payload.value === "number" &&
    Number.isFinite(payload.value) &&
    typeof payload.id === "string" &&
    typeof payload.rating === "string" &&
    typeof payload.page === "string"
  );
}
