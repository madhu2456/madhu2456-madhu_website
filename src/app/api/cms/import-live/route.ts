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

const BLOCKED_HOSTNAMES = new Set(["localhost", "127.0.0.1", "::1", "0.0.0.0"]);

const PRIVATE_IP_RANGES = [
  /^10\./,
  /^192\.168\./,
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
  /^169\.254\./,
  /^127\./,
  /^0\./,
];

/**
 * Decode hex/octal-encoded IPv4 addresses that resolve to localhost.
 * e.g. 0x7f000001, 0177.0.0.1, 2130706433
 */
function isEncodedLocalhost(hostname: string): boolean {
  // Hex-encoded: 0x7f000001 or 0x7F000001
  if (/^0x[0-9a-f]+$/i.test(hostname)) {
    try {
      const num = Number.parseInt(hostname, 16);
      // 127.0.0.1 = 0x7F000001 = 2130706433
      if (num >= 0x7f000000 && num <= 0x7fffffff) return true;
      if (num === 0) return true; // 0.0.0.0
    } catch {
      // ignore
    }
  }
  // Decimal-encoded: 2130706433
  if (/^\d{9,10}$/.test(hostname)) {
    const num = Number.parseInt(hostname, 10);
    if (num >= 0x7f000000 && num <= 0x7fffffff) return true;
    if (num === 0) return true;
  }
  // Octal first octet: 0177.0.0.1
  if (/^0\d+\.\d+\.\d+\.\d+$/.test(hostname)) return true;
  return false;
}

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

    // Normalize IPv6-mapped IPv4: [::ffff:127.0.0.1] → 127.0.0.1
    const hostname = url.hostname
      .replace(/^\[|\]$/g, "") // strip IPv6 brackets
      .replace(/^::ffff:/i, ""); // unwrap IPv4-mapped IPv6

    if (BLOCKED_HOSTNAMES.has(hostname)) {
      throw new Error("Localhost is not allowed");
    }

    for (const range of PRIVATE_IP_RANGES) {
      if (range.test(hostname)) {
        throw new Error("Internal IPs are not allowed");
      }
    }

    if (isEncodedLocalhost(hostname)) {
      throw new Error("Encoded localhost is not allowed");
    }

    // IPv6 loopback
    if (/^::1?$/.test(hostname) || hostname === "0:0:0:0:0:0:0:1") {
      throw new Error("IPv6 loopback is not allowed");
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
