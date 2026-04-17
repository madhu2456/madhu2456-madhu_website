import { NextResponse } from "next/server";
import { revalidatePortfolioRoutes } from "@/lib/cms-revalidate";
import {
  getPortfolioContentPath,
  type PortfolioContent,
  readPortfolioContent,
  savePortfolioContent,
} from "@/lib/portfolio-data";

export const dynamic = "force-dynamic";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isPortfolioContentPayload = (
  value: unknown,
): value is PortfolioContent => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isRecord(value.profile) &&
    isRecord(value.siteSettings) &&
    Array.isArray(value.navigationItems) &&
    Array.isArray(value.skills) &&
    Array.isArray(value.experiences) &&
    Array.isArray(value.education) &&
    Array.isArray(value.projects) &&
    Array.isArray(value.services) &&
    Array.isArray(value.certifications)
  );
};

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

  if (!isRecord(payload) || !("content" in payload)) {
    return NextResponse.json(
      { error: "Request body must include a content object." },
      { status: 400 },
    );
  }

  const nextContent = payload.content;
  if (!isPortfolioContentPayload(nextContent)) {
    return NextResponse.json(
      { error: "Content payload does not match the expected portfolio shape." },
      { status: 400 },
    );
  }

  const savedContent = await savePortfolioContent(nextContent);
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
