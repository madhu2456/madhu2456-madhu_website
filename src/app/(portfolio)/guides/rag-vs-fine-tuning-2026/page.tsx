import type { Metadata } from "next";
import { GuideArticle } from "@/components/GuideArticle";
import { RAG_VS_FINE_TUNING_2026_GUIDE } from "@/lib/content/rag-vs-fine-tuning-2026-guide";
import { getPortfolioData } from "@/lib/portfolio-data";
import { siteLanguageAlternates } from "@/lib/seo/hreflang";
import { resolveSiteUrl } from "@/lib/site-url";

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = `${resolveSiteUrl()}/`;
  const canonicalUrl = `${siteUrl}guides/rag-vs-fine-tuning-2026/`;
  const image = `${siteUrl}opengraph-image/`;
  return {
    title: { absolute: RAG_VS_FINE_TUNING_2026_GUIDE.seoTitle },
    description: RAG_VS_FINE_TUNING_2026_GUIDE.seoDescription,
    alternates: {
      canonical: canonicalUrl,
      languages: siteLanguageAlternates("/guides/rag-vs-fine-tuning-2026/"),
    },
    openGraph: {
      title: { absolute: RAG_VS_FINE_TUNING_2026_GUIDE.seoTitle },
      description: RAG_VS_FINE_TUNING_2026_GUIDE.seoDescription,
      url: canonicalUrl,
      siteName: "Madhu Dadi",
      type: "article",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: RAG_VS_FINE_TUNING_2026_GUIDE.seoTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: RAG_VS_FINE_TUNING_2026_GUIDE.seoTitle,
      description: RAG_VS_FINE_TUNING_2026_GUIDE.seoDescription,
      images: [image],
    },
  };
}

export default async function RagVsFineTuning2026GuidePage() {
  const data = await getPortfolioData();
  return <GuideArticle guide={RAG_VS_FINE_TUNING_2026_GUIDE} data={data} />;
}
