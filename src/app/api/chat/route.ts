import { NextResponse } from "next/server";
import { answerWithAgenticRag, type ChatTurn } from "@/lib/agentic-rag";
import { getPortfolioData } from "@/lib/portfolio-data";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type ChatRequestBody = {
  message?: unknown;
  history?: unknown;
};

const parseHistory = (value: unknown): ChatTurn[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  const turns: ChatTurn[] = [];
  for (const item of value) {
    if (typeof item !== "object" || item === null) {
      continue;
    }

    const role = (item as { role?: unknown }).role;
    const content = (item as { content?: unknown }).content;
    if (
      (role === "user" || role === "assistant") &&
      typeof content === "string" &&
      content.trim().length > 0
    ) {
      turns.push({ role, content: content.trim() });
    }
  }

  return turns.slice(-12);
};

// Basic in-memory rate limiting for serverless-ish environments.
// For production, use Upstash, Redis, or an edge-level WAF.
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10;

function isRateLimited(ip: string): boolean {
  const now = Date.now();

  // Evict expired rate limit records on-demand during new requests
  // instead of using a setInterval timer to avoid memory leaks in serverless.
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetAt) {
      rateLimitMap.delete(key);
    }
  }

  const record = rateLimitMap.get(ip);
  if (!record) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  record.count += 1;
  return record.count > MAX_REQUESTS_PER_WINDOW;
}

export async function POST(request: Request) {
  // When hosted behind a proxy, x-forwarded-for may contain multiple IPs. Extract the first one.
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "anonymous";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      {
        error: "Too many requests. Please wait a minute before trying again.",
      },
      { status: 429, headers: { "Cache-Control": "no-store" } },
    );
  }

  const body = (await request
    .json()
    .catch(() => null)) as ChatRequestBody | null;
  if (!body) {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }
  const message =
    typeof body.message === "string" ? body.message.trim() : undefined;

  if (!message) {
    return NextResponse.json(
      { error: "Message is required." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  if (message.length > 1200) {
    return NextResponse.json(
      { error: "Message is too long. Please keep it under 1200 characters." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  const history = parseHistory(body.history);
  const portfolioData = await getPortfolioData();
  const result = await answerWithAgenticRag(message, history, portfolioData);

  return NextResponse.json(
    {
      reply: result.reply,
      blocked: result.blocked,
      suggestedPrompts: result.suggestedPrompts ?? [],
      updatedAt: portfolioData.portfolioLastUpdatedAt,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
