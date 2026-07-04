import { createOgImage, OG_SIZE } from "@/lib/og-template";
import { getPortfolioData } from "@/lib/portfolio-data";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Profile of Madhu Dadi";

export default async function OGImage() {
  const { profile } = await getPortfolioData();
  const headline = profile.headline ?? "AI & Analytics Leader";

  return createOgImage({
    title:
      [profile.firstName, profile.lastName].filter(Boolean).join(" ") ||
      "Madhu Dadi",
    subtitle: headline,
  });
}
