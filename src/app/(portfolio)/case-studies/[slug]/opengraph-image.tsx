import { createOgImage, OG_SIZE } from "@/lib/og-template";
import { getPortfolioData } from "@/lib/portfolio-data";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Case study";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const { sortedProjects } = await getPortfolioData();
  const project = sortedProjects.find((p) => p.slug === slug);
  return { alt: project ? `${project.title} case study` : "Case study" };
}

export default async function OGImage({ params }: Props) {
  const { slug } = await params;
  const { sortedProjects } = await getPortfolioData();
  const project = sortedProjects.find((p) => p.slug === slug);

  return createOgImage({
    title: project?.title ?? "Case Study",
    subtitle: project?.tagline?.slice(0, 80),
  });
}
