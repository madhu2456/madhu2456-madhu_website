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

export async function POST(request: Request) {
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
