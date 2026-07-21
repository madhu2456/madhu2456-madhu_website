import { resolveSiteUrl } from "@/lib/site-url";

/** India-primary hreflang set (Semrush plan Phase 1.3 / 5.7). */
export function siteLanguageAlternates(pathname = "/") {
  const origin = resolveSiteUrl().replace(/\/$/, "");
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const url =
    path === "/"
      ? `${origin}/`
      : `${origin}${path.endsWith("/") ? path : `${path}/`}`;

  return {
    "en-IN": url,
    en: url,
    "x-default": url,
  } as const;
}
