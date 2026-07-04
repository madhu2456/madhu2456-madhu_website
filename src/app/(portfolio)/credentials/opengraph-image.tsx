import { createOgImage, OG_SIZE } from "@/lib/og-template";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Credentials and certifications of Madhu Dadi";

export default async function OGImage() {
  return createOgImage({
    title: "Credentials & Certifications",
    subtitle: "Verified skills and professional certifications",
  });
}
