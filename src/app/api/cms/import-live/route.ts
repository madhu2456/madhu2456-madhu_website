import { NextResponse } from "next/server";
import { importPortfolioContentFromWebsite } from "@/lib/cms-live-import";
import { revalidatePortfolioRoutes } from "@/lib/cms-revalidate";
import {
  getPortfolioContentPath,
  readPortfolioContent,
  savePortfolioContent,
} from "@/lib/portfolio-data";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const toSourceUrl = (value?: string) =>
  (
    value?.trim() ||
    process.env.CMS_IMPORT_SOURCE_URL ||
    "https://madhudadi.in"
  ).replace(/\/+$/, "");

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => ({}));
  const requestedSourceUrl =
    typeof body === "object" && body !== null && "sourceUrl" in body
      ? body.sourceUrl
      : undefined;

  const sourceUrl =
    typeof requestedSourceUrl === "string"
      ? toSourceUrl(requestedSourceUrl)
      : toSourceUrl();

  const currentContent = await readPortfolioContent();
  const importedResult = await importPortfolioContentFromWebsite(
    currentContent,
    sourceUrl,
  );
  const savedContent = await savePortfolioContent(importedResult.content);
  revalidatePortfolioRoutes();

  return NextResponse.json(
    {
      content: savedContent,
      contentPath: getPortfolioContentPath(),
      updatedAt: savedContent.profile.updatedAt,
      sourceUrl: importedResult.sourceUrl,
      importedAt: importedResult.importedAt,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
