import type { Metadata } from "next";
import { CommercialServiceLander } from "@/components/CommercialServiceLander";
import { getPortfolioData } from "@/lib/portfolio-data";
import { requireCommercialLander } from "@/lib/seo/commercial-landers";
import { siteLanguageAlternates } from "@/lib/seo/hreflang";
import { resolveSiteUrl } from "@/lib/site-url";

const lander = requireCommercialLander("marketing-analytics-consultant");

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = `${resolveSiteUrl()}/`;
  const canonicalUrl = `${siteUrl}${lander.slug}/`;
  const image = `${siteUrl}opengraph-image/`;
  return {
    title: { absolute: lander.seoTitle },
    description: lander.seoDescription,
    alternates: {
      canonical: canonicalUrl,
      languages: siteLanguageAlternates(`/${lander.slug}/`),
    },
    openGraph: {
      title: { absolute: lander.seoTitle },
      description: lander.seoDescription,
      url: canonicalUrl,
      siteName: "Madhu Dadi",
      type: "website",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: lander.seoTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: lander.seoTitle,
      description: lander.seoDescription,
      images: [image],
    },
  };
}

export default async function MarketingAnalyticsConsultantPage() {
  const data = await getPortfolioData();
  return <CommercialServiceLander lander={lander} data={data} />;
}
