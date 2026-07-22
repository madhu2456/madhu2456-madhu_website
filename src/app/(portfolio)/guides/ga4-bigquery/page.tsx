import type { Metadata } from "next";
import { GuideArticle } from "@/components/GuideArticle";
import { GA4_BIGQUERY_GUIDE } from "@/lib/content/ga4-bigquery-guide";
import { getPortfolioData } from "@/lib/portfolio-data";
import { siteLanguageAlternates } from "@/lib/seo/hreflang";
import { resolveSiteUrl } from "@/lib/site-url";

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = `${resolveSiteUrl()}/`;
  const canonicalUrl = `${siteUrl}guides/ga4-bigquery/`;
  const image = `${siteUrl}opengraph-image/`;
  return {
    title: { absolute: GA4_BIGQUERY_GUIDE.seoTitle },
    description: GA4_BIGQUERY_GUIDE.seoDescription,
    alternates: {
      canonical: canonicalUrl,
      languages: siteLanguageAlternates("/guides/ga4-bigquery/"),
    },
    openGraph: {
      title: { absolute: GA4_BIGQUERY_GUIDE.seoTitle },
      description: GA4_BIGQUERY_GUIDE.seoDescription,
      url: canonicalUrl,
      siteName: "Madhu Dadi",
      type: "article",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: GA4_BIGQUERY_GUIDE.seoTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: GA4_BIGQUERY_GUIDE.seoTitle,
      description: GA4_BIGQUERY_GUIDE.seoDescription,
      images: [image],
    },
  };
}

export default async function Ga4BigQueryGuidePage() {
  const data = await getPortfolioData();
  return <GuideArticle guide={GA4_BIGQUERY_GUIDE} data={data} />;
}
