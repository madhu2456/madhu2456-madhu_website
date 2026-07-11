import { NextResponse } from "next/server";
import { answerWithAgenticRag, type ChatTurn } from "@/lib/agentic-rag";
import { getPortfolioData } from "@/lib/portfolio-data";
import {
  checkChatRateLimit,
  rateLimitResponseHeaders,
  resolveClientIp,
} from "@/lib/rate-limit";
import { resolveSiteUrl } from "@/lib/site-url";

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

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const siteUrl = resolveSiteUrl();
  const isAllowedOrigin =
    origin === siteUrl ||
    origin === `${siteUrl}/` ||
    (process.env.NODE_ENV !== "production" &&
      Boolean(
        origin?.startsWith("http://localhost:") ||
          origin?.startsWith("http://127.0.0.1:"),
      ));
  if (!isAllowedOrigin) {
    return NextResponse.json(
      { error: "Forbidden origin." },
      { status: 403, headers: { "Cache-Control": "no-store" } },
    );
  }

  const ip = resolveClientIp(request);
  const rate = await checkChatRateLimit(ip);
  if (rate.limited) {
    return NextResponse.json(
      {
        error: "Too many requests. Please wait a minute before trying again.",
      },
      {
        status: 429,
        headers: rateLimitResponseHeaders(rate),
      },
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

  try {
    const result = await answerWithAgenticRag(message, history, portfolioData);

    return NextResponse.json(
      {
        reply: result.reply,
        blocked: result.blocked,
        suggestedPrompts: result.suggestedPrompts ?? [],
        // Allowlisted title/section/url only — never full chunk bodies
        sources: result.sources ?? [],
        updatedAt: portfolioData.portfolioLastUpdatedAt,
      },
      {
        headers: {
          "Cache-Control": "no-store",
          "X-RateLimit-Limit": String(rate.limit),
          "X-RateLimit-Remaining": String(Math.max(0, rate.remaining)),
          "X-RateLimit-Reset": String(Math.ceil(rate.resetAt / 1000)),
        },
      },
    );
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
