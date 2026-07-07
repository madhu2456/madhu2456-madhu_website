import type { MetadataRoute } from "next";

// Production serves robots.txt from nginx (blog + portfolio consolidated rules).
// This route exists for local dev, CI, and localhost deploy checks only.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/llms.txt", "/llms-full.txt"],
      },
    ],
    sitemap: "https://madhudadi.in/sitemap.xml",
  };
}
