import type { Metadata } from "next";
import PortfolioContent from "@/components/PortfolioContent";
import { SeoStructuredData } from "@/components/SeoStructuredData";
import { siteLanguageAlternates } from "@/lib/seo/hreflang";
import { resolveSiteUrl } from "@/lib/site-url";

const siteUrl = `${resolveSiteUrl()}/`;

/** ≤60 chars, brand + commercial intent (Semrush plan Phase 2). */
const HOME_TITLE = "Madhu Dadi – AI Consultant & Analytics Leader";
const HOME_DESCRIPTION =
  "AI consultant & analytics leader: 9+ years since 2016 (Novartis full-time + consulting). Production RAG, agents, FastAPI/Next.js. India & remote.";

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
  // Hero image preload is handled by Next.js Image `priority` prop in Hero.tsx

  return (
    <div className="min-h-screen">
      <SeoStructuredData
        nodes={["Person", "Occupation", "WebSite", "WebPage", "Breadcrumb"]}
      />
      <PortfolioContent />
    </div>
  );
}
