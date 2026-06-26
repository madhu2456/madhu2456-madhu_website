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

const toSourceUrl = (value?: string) => {
  const rawUrl = (
    value?.trim() ||
    process.env.CMS_IMPORT_SOURCE_URL ||
    "https://madhudadi.in"
  ).replace(/\/+$/, "");

  try {
    const url = new URL(rawUrl);
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      throw new Error("Invalid protocol");
    }

    if (
      url.hostname === "localhost" ||
      url.hostname === "127.0.0.1" ||
      url.hostname === "::1"
    ) {
      throw new Error("Localhost is not allowed");
    }
    if (
      url.hostname.match(/^10\./) ||
      url.hostname.match(/^192\.168\./) ||
      url.hostname.match(/^172\.(1[6-9]|2[0-9]|3[0-1])\./)
    ) {
      throw new Error("Internal IPs are not allowed");
    }

    return rawUrl;
  } catch (_error) {
    return process.env.CMS_IMPORT_SOURCE_URL || "https://madhudadi.in";
  }
};

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
