import type { Metadata } from "next";
import PortfolioContent from "@/components/PortfolioContent";
import { SeoStructuredData } from "@/components/SeoStructuredData";
import { siteLanguageAlternates } from "@/lib/seo/hreflang";
import { resolveSiteUrl } from "@/lib/site-url";

const siteUrl = `${resolveSiteUrl()}/`;

/** ~58–60 chars: brand + money queries (audit §5 / Semrush Phase 2). */
const HOME_TITLE = "Madhu Dadi — AI Engineer: RAG, AI Agents & Analytics";
const HOME_DESCRIPTION =
  "AI engineer: production RAG, AI agents, FastAPI/Next.js, marketing analytics. 9+ years since 2016. India & remote. Select consulting or full-time.";

export const metadata: Metadata = {
  // DG-06 C / DR-02: dual full-time + consulting funnels coexist via /contact/.
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  alternates: {
    canonical: siteUrl,
    languages: siteLanguageAlternates("/"),
  },
  openGraph: {
    title: {
      absolute: HOME_TITLE,
    },
    description: HOME_DESCRIPTION,
    url: siteUrl,
    siteName: "Madhu Dadi",
    type: "website",
    images: [
      {
        url: `${siteUrl}opengraph-image/`,
        width: 1200,
        height: 630,
        alt: HOME_TITLE,
      },
    ],
  },
};

export default async function Home() {
  // Hero LCP: Next.js Image `priority` in Hero.tsx injects imageSrcSet preload.
  // Do not add a raw <link rel="preload" href="/new-ui/hero-portrait.webp">.

  return (
    <div className="min-h-screen">
      <SeoStructuredData
        nodes={["Person", "Occupation", "WebSite", "WebPage", "Breadcrumb"]}
      />
      <PortfolioContent />
    </div>
  );
}
