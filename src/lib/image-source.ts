const ABSOLUTE_HTTP_URL = /^https?:\/\//i;
const DATA_URL = /^data:/i;
const SVG_EXTENSION = /\.svg(?:$|\?)/i;

export const normalizeImageSource = (value?: string | null) => {
  const trimmed = value?.trim();
  if (!trimmed) return null;

  if (ABSOLUTE_HTTP_URL.test(trimmed) || DATA_URL.test(trimmed)) {
    return trimmed;
  }

  if (trimmed.startsWith("/")) {
    return trimmed;
  }

  return `/${trimmed.replace(/^\/+/, "")}`;
};

export const shouldUseUnoptimizedImage = (value: string) =>
  SVG_EXTENSION.test(value) ||
  ABSOLUTE_HTTP_URL.test(value) ||
  DATA_URL.test(value);

export const resolveAbsoluteImageUrl = (value?: string | null) => {
  const normalized = normalizeImageSource(value);
  if (!normalized) return null;
  if (ABSOLUTE_HTTP_URL.test(normalized) || DATA_URL.test(normalized)) {
    return normalized;
  }
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://madhudadi.in";
  return `${siteUrl.replace(/\/$/, "")}${normalized}`;
};
