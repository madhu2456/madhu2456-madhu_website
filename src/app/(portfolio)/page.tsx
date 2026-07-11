import type { Metadata } from "next";
import PortfolioContent from "@/components/PortfolioContent";
import { SeoStructuredData } from "@/components/SeoStructuredData";

import { resolveSiteUrl } from "@/lib/site-url";

const siteUrl = `${resolveSiteUrl()}/`;

export const metadata: Metadata = {
  // DG-06 C: dual Engineer & Consultant brand (owner decision 2026-07-11)
  title: "Madhu Dadi - AI Engineer & Analytics Consultant",
  description:
    "AI and marketing analytics engineer with 9+ years (Novartis, redBus, GroupM). Production LLM/RAG apps, AI agents, FastAPI, Next.js, and analytics systems.",
  alternates: {
    canonical: siteUrl,
    languages: {
      "x-default": siteUrl,
    },
  },
  openGraph: {
    title: {
      absolute: "Madhu Dadi - AI Engineer & Analytics Consultant",
    },
    description:
      "Production LLM/RAG apps, AI agents, FastAPI/Next.js products, and marketing analytics systems.",
    url: siteUrl,
    siteName: "Madhu Dadi",
    type: "website",
    images: [
      {
        url: `${siteUrl}opengraph-image/?ext=.png`,
        width: 1200,
        height: 630,
        alt: "Madhu Dadi - AI Engineer & Analytics Consultant",
      },
    ],
  },
};

export default async function Home() {
  // Hero image preload is handled by Next.js Image `priority` prop in Hero.tsx

  return (
    <div className="min-h-screen">
      <SeoStructuredData
        nodes={[
          "Person",
          "Occupation",
          "WebSite",
          "WebPage",
          "ProfilePage",
          "Breadcrumb",
          "FAQ",
        ]}
      />
      <PortfolioContent />
    </div>
  );
}
