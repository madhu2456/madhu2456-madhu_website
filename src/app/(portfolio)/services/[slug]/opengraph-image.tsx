import { createOgImage, OG_SIZE } from "@/lib/og-template";
import { getPortfolioData } from "@/lib/portfolio-data";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Service details";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const { sortedServices } = await getPortfolioData();
  const service = sortedServices.find((s) => s.slug === slug);
  return { alt: service ? `${service.title} service` : "Service" };
}

export default async function OGImage({ params }: Props) {
  const { slug } = await params;
  const { sortedServices } = await getPortfolioData();
  const service = sortedServices.find((s) => s.slug === slug);

  return createOgImage({
    title: service?.title ?? "Service",
    subtitle: service?.shortDescription?.slice(0, 80),
  });
}
