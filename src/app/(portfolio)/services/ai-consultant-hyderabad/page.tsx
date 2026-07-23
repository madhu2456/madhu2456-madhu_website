import type { Metadata } from "next";
import { IndiaServiceLander } from "@/components/IndiaServiceLander";
import { getPortfolioData } from "@/lib/portfolio-data";
import { siteLanguageAlternates } from "@/lib/seo/hreflang";
import { requireIndiaServiceAlias } from "@/lib/seo/service-aliases";
import { resolveSiteUrl } from "@/lib/site-url";

const alias = requireIndiaServiceAlias("ai-consultant-hyderabad");

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = `${resolveSiteUrl()}/`;
  const canonicalUrl = `${siteUrl}services/${alias.slug}/`;
  const image = `${siteUrl}opengraph-image/`;
  return {
    title: alias.seoTitle,
    description: alias.seoDescription,
    alternates: {
      canonical: canonicalUrl,
      languages: siteLanguageAlternates(`/services/${alias.slug}/`),
    },
    openGraph: {
      title: { absolute: alias.seoTitle },
      description: alias.seoDescription,
      url: canonicalUrl,
      siteName: "Madhu Dadi",
      type: "website",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: alias.seoTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: alias.seoTitle,
      description: alias.seoDescription,
      images: [image],
    },
  };
}

export default async function Page() {
  const data = await getPortfolioData();
  return <IndiaServiceLander alias={alias} data={data} />;
}
