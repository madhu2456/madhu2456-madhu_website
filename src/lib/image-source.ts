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
