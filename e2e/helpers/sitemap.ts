import type { APIRequestContext } from "@playwright/test";

function extractLocs(xml: string): string[] {
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) =>
    match[1].trim(),
  );
}

export function isSitemapIndex(xml: string): boolean {
  return xml.includes("<sitemapindex");
}

export function isUrlSet(xml: string): boolean {
  return xml.includes("<urlset");
}

export function isValidSitemapXml(xml: string): boolean {
  return isSitemapIndex(xml) || isUrlSet(xml);
}

/** Resolve sitemap fetches to the local test server regardless of absolute loc host. */
function toSitemapRequestPath(loc: string): string {
  try {
    return new URL(loc).pathname;
  } catch {
    return loc;
  }
}

export async function collectPageUrlsFromSitemap(
  request: APIRequestContext,
  sitemapPath: string,
  visited = new Set<string>(),
): Promise<string[]> {
  const normalized = toSitemapRequestPath(sitemapPath).replace(/\/$/, "");
  if (visited.has(normalized)) return [];
  visited.add(normalized);

  const response = await request.get(normalized);
  if (!response.ok()) {
    throw new Error(`${normalized} returned status ${response.status()}`);
  }

  const text = await response.text();
  if (!isValidSitemapXml(text)) {
    throw new Error(`${normalized} returned invalid sitemap XML`);
  }

  if (isSitemapIndex(text)) {
    const pageUrls: string[] = [];
    for (const childLoc of extractLocs(text)) {
      pageUrls.push(
        ...(await collectPageUrlsFromSitemap(
          request,
          toSitemapRequestPath(childLoc),
          visited,
        )),
      );
    }
    return pageUrls;
  }

  return extractLocs(text);
}
