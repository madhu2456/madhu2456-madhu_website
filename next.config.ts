import type { NextConfig } from "next";

// Portfolio CSP is set here (next.config headers), not only in proxy.ts.
// Root cause (2026-07-21): Next 16.2 proxy bundles and runs, but CSP headers set
// on NextResponse.next() are not merged onto the final HTML response for App
// Router pages. next.config headers() always apply — same pattern as other
// security headers below. Aligned with blog's working non-nonce marketing CSP.
const portfolioCsp = [
  "default-src 'self'",
  "upgrade-insecure-requests",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://static.cloudflareinsights.com",
  "script-src-attr 'none'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data: https://images.unsplash.com https://www.googletagmanager.com https://www.google-analytics.com",
  "font-src 'self' data:",
  "connect-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://static.cloudflareinsights.com https://api.resend.com",
  "frame-src 'self' https://www.googletagmanager.com",
  "worker-src 'self' blob:",
  "report-uri /api/csp-report/",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-XSS-Protection", value: "0" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value:
      "geolocation=(), microphone=(), camera=(), payment=(), usb=(), midi=(), display-capture=(), accelerometer=(), gyroscope=(), magnetometer=()",
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
  // Restricts who can load this origin's resources cross-origin
  {
    key: "Cross-Origin-Resource-Policy",
    value: "same-site",
  },
  {
    key: "Content-Security-Policy",
    value: portfolioCsp,
  },
];

const nextConfig: NextConfig = {
  // Ensure all URLs have a trailing slash to avoid duplicate content SEO issues.
  trailingSlash: true,
  poweredByHeader: false,
  reactStrictMode: true,

  experimental: {
    globalNotFound: true,
    optimizePackageImports: ["@tabler/icons-react"],
    // Inline CSS for first-load paint to reduce render-blocking stylesheet requests.
    inlineCss: true,
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
        source: "/about",
        destination: "/profile/",
        permanent: true,
      },
      {
        source: "/about/",
        destination: "/profile/",
        permanent: true,
      },
      {
        // AUDIT DECISION DR-06 (2026-07-19): Owner confirmed a real, verified
        // Google Business Profile exists for Madhu Dadi (CID CXaUijPkQhVkEBM
        // is genuine and the GBP appears in Google Maps). Option A — KEEP
        // AS-IS. The /google and /reviews branded short links (302) and the
        // googleBusiness field in schema/UI remain active. Note: GBP is
        // treated as a service-area/online business (no fake storefront),
        // consistent with DR-05 personal-brand decision. Do NOT re-flag GBP
        // eligibility in future audits.
        // Branded short link to the Google Business Profile.
        // 302 (permanent: false) because the destination may change.
        source: "/google",
        destination: "https://maps.google.com/?cid=CXaUijPkQhVkEBM",
        permanent: false,
      },
      {
        // Branded short link for Google Business Profile review requests.
        // 302 (permanent: false) because the GBP review URL may change.
        source: "/reviews",
        destination: "https://g.page/r/CXaUijPkQhVkEBM/review",
        permanent: false,
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

  // AUDIT DECISION DR-04 (2026-07-19): /resume.pdf is intentionally kept
  // indexable. No X-Robots-Tag: noindex is applied to it. Owner reviewed the
  // exposure trade-off (recruiter discoverability vs. PII crawling) and chose
  // to keep the resume crawlable. Do NOT re-flag this in future audits.
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
        source: "/.well-known/security.txt",
        headers: [
          { key: "Content-Type", value: "text/plain; charset=utf-8" },
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
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
      {
        source: "/sitemap-portfolio.xml",
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
