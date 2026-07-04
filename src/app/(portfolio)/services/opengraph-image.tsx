import { createOgImage, OG_SIZE } from "@/lib/og-template";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "AI, RAG & Analytics Services by Madhu Dadi";

export default async function OGImage() {
  return createOgImage({
    title: "AI, RAG & Analytics Services",
    subtitle: "Consulting, development, and deployment",
  });
}
