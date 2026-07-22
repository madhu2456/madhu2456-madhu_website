import { createHash } from "node:crypto";

const DEFAULT_CACHE =
  "public, max-age=3600, stale-while-revalidate=86400" as const;

/** Weak ETag from body bytes (stable for identical content). */
export function buildWeakEtag(body: string): string {
  const hash = createHash("sha256").update(body).digest("hex").slice(0, 16);
  return `W/"${hash}"`;
}

export function toHttpDate(value: string | Date): string {
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime())
    ? new Date(0).toUTCString()
    : d.toUTCString();
}

/**
 * RFC 9110 conditional GET: prefer If-None-Match over If-Modified-Since.
 */
export function isNotModified(
  request: Request,
  etag: string,
  lastModified: Date,
): boolean {
  const inm = request.headers.get("if-none-match");
  if (inm) {
    const tags = inm.split(",").map((t) => t.trim());
    if (tags.includes("*") || tags.includes(etag)) return true;
    // Strong/weak match: some clients strip W/ prefix comparison loosely
    const bare = etag.replace(/^W\//, "");
    if (tags.some((t) => t.replace(/^W\//, "") === bare)) return true;
  }

  const ims = request.headers.get("if-modified-since");
  if (ims && !inm) {
    const since = Date.parse(ims);
    if (!Number.isNaN(since) && lastModified.getTime() <= since) {
      return true;
    }
  }

  return false;
}

type DiscoveryResponseOptions = {
  contentType: string;
  lastModifiedAt: string | Date;
  cacheControl?: string;
};

/**
 * Text/JSON discovery body with ETag + Last-Modified and optional 304.
 */
export function discoveryBodyResponse(
  request: Request,
  body: string,
  options: DiscoveryResponseOptions,
): Response {
  const lastModified = new Date(options.lastModifiedAt);
  const safeLast = Number.isNaN(lastModified.getTime())
    ? new Date()
    : lastModified;
  const etag = buildWeakEtag(body);
  const headers = new Headers({
    "Content-Type": options.contentType,
    "Cache-Control": options.cacheControl ?? DEFAULT_CACHE,
    ETag: etag,
    "Last-Modified": toHttpDate(safeLast),
  });

  if (isNotModified(request, etag, safeLast)) {
    return new Response(null, { status: 304, headers });
  }

  return new Response(body, { status: 200, headers });
}
