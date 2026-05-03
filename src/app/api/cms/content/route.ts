import { NextResponse } from "next/server";
import { revalidatePortfolioRoutes } from "@/lib/cms-revalidate";
import { portfolioContentSchema } from "@/lib/cms-schema";
import {
  getPortfolioContentPath,
  readPortfolioContent,
  savePortfolioContent,
} from "@/lib/portfolio-data";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const LOCK_KEY = "cms-content-write";
const locks = new Map<string, Promise<void>>();

async function acquireLock(key: string): Promise<() => void> {
  while (locks.has(key)) {
    try {
      await locks.get(key);
    } catch {
      // previous lock failed; continue
    }
  }

  let release: (() => void) | undefined;
  const promise = new Promise<void>((resolve) => {
    release = resolve;
  });
  locks.set(key, promise);

  return () => {
    if (release) {
      release();
    }
    locks.delete(key);
  };
}

export async function GET() {
  const content = await readPortfolioContent();

  return NextResponse.json(
    {
      content,
      contentPath: getPortfolioContentPath(),
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}

export async function PUT(request: Request) {
  const release = await acquireLock(LOCK_KEY);

  try {
    const payload: unknown = await request.json();

    if (!payload || typeof payload !== "object" || !("content" in payload)) {
      return NextResponse.json(
        { error: "Request body must include a content object." },
        { status: 400 },
      );
    }

    const result = portfolioContentSchema.safeParse(payload.content);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Content payload does not match the expected portfolio shape.",
          details: result.error.format(),
        },
        { status: 400 },
      );
    }

    const savedContent = await savePortfolioContent(result.data);
    revalidatePortfolioRoutes();

    return NextResponse.json(
      {
        content: savedContent,
        contentPath: getPortfolioContentPath(),
        updatedAt: savedContent.profile.updatedAt,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } finally {
    release();
  }
}
