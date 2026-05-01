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
}
