import type { Metadata } from "next";
import { IndiaServiceLander } from "@/components/IndiaServiceLander";
import { getPortfolioData } from "@/lib/portfolio-data";
import { siteLanguageAlternates } from "@/lib/seo/hreflang";
import { requireIndiaServiceAlias } from "@/lib/seo/service-aliases";
import { resolveSiteUrl } from "@/lib/site-url";

const alias = requireIndiaServiceAlias("ai-consultant-visakhapatnam");

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = `${resolveSiteUrl()}/`;
  const canonicalUrl = `${siteUrl}services/${alias.slug}/`;
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
    },
    twitter: {
      card: "summary_large_image",
      title: alias.seoTitle,
      description: alias.seoDescription,
    },
  };
}

export default async function AiConsultantVisakhapatnamPage() {
  const data = await getPortfolioData();
  return <IndiaServiceLander alias={alias} data={data} />;
}
