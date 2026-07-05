import type { MetadataRoute } from "next";

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
