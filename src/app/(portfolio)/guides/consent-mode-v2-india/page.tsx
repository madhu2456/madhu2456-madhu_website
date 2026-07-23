import type { Metadata } from "next";
import { GuideArticle } from "@/components/GuideArticle";
import { CONSENT_MODE_V2_INDIA_GUIDE } from "@/lib/content/consent-mode-v2-india-guide";
import { getPortfolioData } from "@/lib/portfolio-data";
import { siteLanguageAlternates } from "@/lib/seo/hreflang";
import { resolveSiteUrl } from "@/lib/site-url";

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = `${resolveSiteUrl()}/`;
  const canonicalUrl = `${siteUrl}guides/consent-mode-v2-india/`;
  const image = `${siteUrl}opengraph-image/`;
  return {
    title: { absolute: CONSENT_MODE_V2_INDIA_GUIDE.seoTitle },
    description: CONSENT_MODE_V2_INDIA_GUIDE.seoDescription,
    alternates: {
      canonical: canonicalUrl,
      languages: siteLanguageAlternates("/guides/consent-mode-v2-india/"),
    },
    openGraph: {
      title: { absolute: CONSENT_MODE_V2_INDIA_GUIDE.seoTitle },
      description: CONSENT_MODE_V2_INDIA_GUIDE.seoDescription,
      url: canonicalUrl,
      siteName: "Madhu Dadi",
      type: "article",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: CONSENT_MODE_V2_INDIA_GUIDE.seoTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: CONSENT_MODE_V2_INDIA_GUIDE.seoTitle,
      description: CONSENT_MODE_V2_INDIA_GUIDE.seoDescription,
      images: [image],
    },
  };
}

export default async function ConsentModeV2IndiaGuidePage() {
  const data = await getPortfolioData();
  return <GuideArticle guide={CONSENT_MODE_V2_INDIA_GUIDE} data={data} />;
}
