import type { Metadata } from "next";
import { GuideArticle } from "@/components/GuideArticle";
import { FRACTIONAL_AI_PLAYBOOK_GUIDE } from "@/lib/content/fractional-ai-playbook-guide";
import { getPortfolioData } from "@/lib/portfolio-data";
import { siteLanguageAlternates } from "@/lib/seo/hreflang";
import { resolveSiteUrl } from "@/lib/site-url";

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = `${resolveSiteUrl()}/`;
  const canonicalUrl = `${siteUrl}guides/fractional-ai-playbook/`;
  const image = `${siteUrl}opengraph-image/`;
  return {
    title: { absolute: FRACTIONAL_AI_PLAYBOOK_GUIDE.seoTitle },
    description: FRACTIONAL_AI_PLAYBOOK_GUIDE.seoDescription,
    alternates: {
      canonical: canonicalUrl,
      languages: siteLanguageAlternates("/guides/fractional-ai-playbook/"),
    },
    openGraph: {
      title: { absolute: FRACTIONAL_AI_PLAYBOOK_GUIDE.seoTitle },
      description: FRACTIONAL_AI_PLAYBOOK_GUIDE.seoDescription,
      url: canonicalUrl,
      siteName: "Madhu Dadi",
      type: "article",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: FRACTIONAL_AI_PLAYBOOK_GUIDE.seoTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: FRACTIONAL_AI_PLAYBOOK_GUIDE.seoTitle,
      description: FRACTIONAL_AI_PLAYBOOK_GUIDE.seoDescription,
      images: [image],
    },
  };
}

export default async function FractionalAiPlaybookGuidePage() {
  const data = await getPortfolioData();
  return <GuideArticle guide={FRACTIONAL_AI_PLAYBOOK_GUIDE} data={data} />;
}
