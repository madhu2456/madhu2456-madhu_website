import { resolveSiteUrl } from "@/lib/site-url";

export const dynamic = "force-static";
export const revalidate = 86400;

/**
 * RFC 9116 security.txt for the portfolio apex.
 * Production may also serve a blog-scoped file; this route covers the site root.
 */
export async function GET() {
  const siteUrl = resolveSiteUrl().replace(/\/$/, "");
  const expires = new Date();
  expires.setUTCFullYear(expires.getUTCFullYear() + 1);

  const body = [
    "Contact: mailto:madhu.kumar245@gmail.com",
    `Contact: ${siteUrl}/contact/`,
    "Preferred-Languages: en",
    `Canonical: ${siteUrl}/.well-known/security.txt`,
    `Expires: ${expires.toISOString()}`,
    "# Portfolio of Madhu Dadi — AI engineer & analytics consultant",
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
