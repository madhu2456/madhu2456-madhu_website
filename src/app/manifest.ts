import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Madhu Dadi — Portfolio",
    short_name: "Madhu Dadi",
    description:
      "AI and analytics engineering portfolio for Madhu Dadi, covering LLM applications, RAG systems, full-stack products, and marketing analytics.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#1a1410",
    orientation: "portrait-primary",
    categories: ["portfolio", "technology", "developer"],
    lang: "en",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "48x48",
        type: "image/x-icon",
        purpose: "any",
      },
      {
        src: "/icon.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
