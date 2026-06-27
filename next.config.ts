import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

// NOTE: 'unsafe-inline' in script-src weakens XSS protection. Next.js requires it without nonce setup.
// TODO: Replace with nonce-based approach — see https://nextjs.org/docs/app/building-your-application/configuring/content-security-policy
const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' ${!isProd ? "'unsafe-eval'" : ""} https://www.googletagmanager.com https://static.cloudflareinsights.com;
    connect-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://static.cloudflareinsights.com https://api.resend.com${!isProd ? " ws: wss:" : ""};
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://images.unsplash.com https://www.googletagmanager.com https://www.google-analytics.com;
    font-src 'self' data:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    frame-src 'self' https://www.googletagmanager.com;
    ${isProd ? "upgrade-insecure-requests;" : ""}
`
  .replace(/\s{2,}/g, " ")
  .trim();

const securityHeaders = [
  { key: "Content-Security-Policy", value: cspHeader },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-XSS-Protection", value: "0" },
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
  // Ensure all URLs have a trailing slash to avoid duplicate content SEO issues.
  trailingSlash: true,
  poweredByHeader: false,

  experimental: {
    optimizePackageImports: ["@tabler/icons-react", "motion"],
    // Inline CSS for first-load paint to reduce render-blocking stylesheet requests.
    inlineCss: false,
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
      {
        source: "/feed.xml",
        destination: "https://madhudadi.in/blog/feed.xml",
        permanent: true,
      },
      {
        source: "/feed.atom",
        destination: "https://madhudadi.in/blog/feed.xml",
        permanent: true,
      },
      {
        source: "/sitemap-portfolio.xml",
        destination: "/sitemap.xml",
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
        headers: securityHeaders,
      },
      // SEO/GEO discovery files - serve as plain text with generous caching
      {
        source: "/llms.txt",
        headers: [
          { key: "Content-Type", value: "text/plain; charset=utf-8" },
          {
            key: "Cache-Control",
            value: "public, max-age=3600, stale-while-revalidate=86400",
          },
        ],
      },
      {
        source: "/llms.txt/",
        headers: [
          { key: "Content-Type", value: "text/plain; charset=utf-8" },
          {
            key: "Cache-Control",
            value: "public, max-age=3600, stale-while-revalidate=86400",
          },
        ],
      },
      {
        source: "/llms-full.txt",
        headers: [
          { key: "Content-Type", value: "text/plain; charset=utf-8" },
          {
            key: "Cache-Control",
            value: "public, max-age=3600, stale-while-revalidate=86400",
          },
        ],
      },
      {
        source: "/llms-full.txt/",
        headers: [
          { key: "Content-Type", value: "text/plain; charset=utf-8" },
          {
            key: "Cache-Control",
            value: "public, max-age=3600, stale-while-revalidate=86400",
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
      // Sitemap - revalidate hourly, serve stale for a day
      {
        source: "/sitemap.xml",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, stale-while-revalidate=86400",
          },
        ],
      },

      // robots.txt - cache for a day
      {
        source: "/robots.txt",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400" }],
      },
      // IndexNow verification key
      {
        source: "/4987000e306144ec8609ede9a23f9b4b.txt",
        headers: [
          { key: "Content-Type", value: "text/plain; charset=utf-8" },
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Prevent AI markdown endpoint indexation
      {
        source: "/:path*/markdown",
        headers: [{ key: "X-Robots-Tag", value: "noindex, follow" }],
      },
    ];
  },
};

export default nextConfig;
