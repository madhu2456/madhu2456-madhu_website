import type { MetadataRoute } from "next";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function formatLastModified(
  value: MetadataRoute.Sitemap[number]["lastModified"],
): string | null {
  if (!value) return null;

  if (value instanceof Date) {
    return value.toISOString().split("T")[0];
  }

  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) return null;
  return new Date(timestamp).toISOString().split("T")[0];
}

function renderHreflangLinks(
  languages: Record<string, string | undefined> | undefined,
): string {
  if (!languages) return "";

  return Object.entries(languages)
    .filter((entry): entry is [string, string] => typeof entry[1] === "string")
    .map(
      ([hreflang, href]) =>
        `\n    <xhtml:link rel="alternate" hreflang="${escapeXml(hreflang)}" href="${escapeXml(href)}" />`,
    )
    .join("");
}

export function serializeSitemapXml(entries: MetadataRoute.Sitemap): string {
  const hasHreflang = entries.some((entry) => {
    const languages = entry.alternates?.languages;
    return Boolean(languages && Object.keys(languages).length > 0);
  });

  const urls = entries
    .map((entry) => {
      const lastModified = formatLastModified(entry.lastModified);
      const changeFrequency = entry.changeFrequency
        ? `<changefreq>${entry.changeFrequency}</changefreq>`
        : "";
      const priority =
        entry.priority !== undefined
          ? `<priority>${entry.priority}</priority>`
          : "";
      const lastMod = lastModified ? `<lastmod>${lastModified}</lastmod>` : "";
      const languages = entry.alternates?.languages as
        | Record<string, string | undefined>
        | undefined;
      const hreflang = renderHreflangLinks(languages);

      return `  <url>
    <loc>${escapeXml(entry.url)}</loc>${lastMod ? `\n    ${lastMod}` : ""}${changeFrequency ? `\n    ${changeFrequency}` : ""}${priority ? `\n    ${priority}` : ""}${hreflang}
  </url>`;
    })
    .join("\n");

  const xmlnsExtra = hasHreflang
    ? ' xmlns:xhtml="http://www.w3.org/1999/xhtml"'
    : "";

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"${xmlnsExtra}>
${urls}
</urlset>
`;
}
