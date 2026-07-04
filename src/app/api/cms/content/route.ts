import { NextResponse } from "next/server";
import { revalidatePortfolioRoutes } from "@/lib/cms-revalidate";
import { portfolioContentSchema } from "@/lib/cms-schema";
import {
  getPortfolioContentPath,
  readPortfolioContent,
  savePortfolioContent,
} from "@/lib/portfolio-data";
import { resolveSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_CMS_BODY_BYTES = 2 * 1024 * 1024; // 2 MB

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
  const isProd = process.env.NODE_ENV === "production";

  return NextResponse.json(
    {
      content,
      ...(isProd ? {} : { contentPath: getPortfolioContentPath() }),
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}

const validateCmsOrigin = (request: Request) => {
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
  return isAllowedOrigin;
};

const tooLarge = () =>
  NextResponse.json({ error: "Request body too large." }, { status: 413 });

export async function PUT(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_CMS_BODY_BYTES) {
    return tooLarge();
  }

  if (!validateCmsOrigin(request)) {
    return NextResponse.json({ error: "Forbidden origin." }, { status: 403 });
  }

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

    const isProd = process.env.NODE_ENV === "production";

    return NextResponse.json(
      {
        content: savedContent,
        ...(isProd ? {} : { contentPath: getPortfolioContentPath() }),
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
