import type { Metadata } from "next";
import { GuideArticle } from "@/components/GuideArticle";
import { ATTRIBUTION_AFTER_COOKIES_GUIDE } from "@/lib/content/attribution-after-cookies-guide";
import { getPortfolioData } from "@/lib/portfolio-data";
import { siteLanguageAlternates } from "@/lib/seo/hreflang";
import { resolveSiteUrl } from "@/lib/site-url";

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = `${resolveSiteUrl()}/`;
  const canonicalUrl = `${siteUrl}guides/attribution-after-cookies/`;
  const image = `${siteUrl}opengraph-image/`;
  return {
    title: { absolute: ATTRIBUTION_AFTER_COOKIES_GUIDE.seoTitle },
    description: ATTRIBUTION_AFTER_COOKIES_GUIDE.seoDescription,
    alternates: {
      canonical: canonicalUrl,
      languages: siteLanguageAlternates("/guides/attribution-after-cookies/"),
    },
    openGraph: {
      title: { absolute: ATTRIBUTION_AFTER_COOKIES_GUIDE.seoTitle },
      description: ATTRIBUTION_AFTER_COOKIES_GUIDE.seoDescription,
      url: canonicalUrl,
      siteName: "Madhu Dadi",
      type: "article",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: ATTRIBUTION_AFTER_COOKIES_GUIDE.seoTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ATTRIBUTION_AFTER_COOKIES_GUIDE.seoTitle,
      description: ATTRIBUTION_AFTER_COOKIES_GUIDE.seoDescription,
      images: [image],
    },
  };
}

export default async function AttributionAfterCookiesGuidePage() {
  const data = await getPortfolioData();
  return <GuideArticle guide={ATTRIBUTION_AFTER_COOKIES_GUIDE} data={data} />;
}
