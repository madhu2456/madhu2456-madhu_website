import { createOgImage, OG_SIZE } from "@/lib/og-template";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Contact Madhu Dadi";

export default async function OGImage() {
  return createOgImage({
    title: "Get in Touch",
    subtitle: "Available for AI, RAG, and full-stack projects",
  });
}
