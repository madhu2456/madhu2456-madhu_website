import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Madhu Dadi — Portfolio",
    short_name: "Madhu Dadi",
    description:
      "Personal portfolio of Madhu Dadi — software engineer, full-stack developer, and AI enthusiast.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#7c3aed",
    orientation: "portrait-primary",
    categories: ["portfolio", "technology", "developer"],
    lang: "en",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
