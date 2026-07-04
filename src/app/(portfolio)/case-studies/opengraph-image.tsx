import { createOgImage, OG_SIZE } from "@/lib/og-template";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "AI, RAG & Analytics Case Studies by Madhu Dadi";

export default async function OGImage() {
  return createOgImage({
    title: "Case Studies",
    subtitle: "Real projects, measurable outcomes",
  });
}
