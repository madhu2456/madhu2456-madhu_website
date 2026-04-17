import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // Isolates the browsing context to prevent cross-origin attacks (Spectre etc.)
  // "same-origin-allow-popups" lets OAuth/payment popups still work
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin-allow-popups",
  },
  // Prevents the page from being loaded in a cross-origin iframe
  {
    key: "Cross-Origin-Embedder-Policy",
    value: "unsafe-none",
  },
];

const nextConfig: NextConfig = {
  experimental: {
    // Enable scroll restoration for better UX on navigation
    scrollRestoration: true,
    // Inline CSS for first-load paint to reduce render-blocking stylesheet requests.
    inlineCss: true,
    // Ensure unmatched routes use a single global 404 with multiple root layouts.
    globalNotFound: true,
  },

  compiler: {
    // Strip console.log / console.info / console.debug from production builds.
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },

  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.madhudadi.in" }],
        destination: "https://madhudadi.in/:path*",
        permanent: true,
      },
      // Ensure direct canonical HTTPS redirect for apex host when a proxy
      // forwards protocol information to the app.
      {
        source: "/:path*",
        has: [
          { type: "host", value: "madhudadi.in" },
          { type: "header", key: "x-forwarded-proto", value: "http" },
        ],
        destination: "https://madhudadi.in/:path*",
        permanent: true,
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    minimumCacheTTL: 2678400, // 31 days
    qualities: [60, 75],
    deviceSizes: [360, 420, 640, 768, 1024, 1280, 1536, 1920],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [...securityHeaders],
      },
      // SEO/GEO discovery files — serve as plain text with generous caching
      {
        source: "/llms.txt",
        headers: [
          { key: "Content-Type", value: "text/plain; charset=utf-8" },
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
      {
        source: "/humans.txt",
        headers: [
          { key: "Content-Type", value: "text/plain; charset=utf-8" },
          { key: "Cache-Control", value: "public, max-age=86400" },
        ],
      },
      {
        source: "/ai-profile.json",
        headers: [
          { key: "Content-Type", value: "application/json; charset=utf-8" },
          {
            key: "Cache-Control",
            value: "public, max-age=3600, stale-while-revalidate=86400",
          },
        ],
      },
      // Sitemap — revalidate hourly, serve stale for a day
      {
        source: "/sitemap.xml",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, stale-while-revalidate=86400",
          },
        ],
      },
      // robots.txt — cache for a day
      {
        source: "/robots.txt",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400" }],
      },
    ];
  },
};

export default nextConfig;
