export const DEFAULT_SITE_URL = "https://madhudadi.in";

export const resolveSiteUrl = (rawUrl?: string): string => {
  const url = (
    rawUrl?.trim() ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    DEFAULT_SITE_URL
  ).replace(/\/+$/, "");
  return url;
};
