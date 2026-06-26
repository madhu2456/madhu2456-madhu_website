import type { Metadata } from "next";
import { preload } from "react-dom";
import PortfolioContent from "@/components/PortfolioContent";
import { SeoStructuredData } from "@/components/SeoStructuredData";

import { resolveSiteUrl } from "@/lib/site-url";

const siteUrl = `${resolveSiteUrl()}/`;

export const metadata: Metadata = {
  title: "Madhu Dadi - Generative AI, RAG & Marketing Analytics Consultant",
  description:
    "AI and marketing analytics engineer. 9+ years exp (Novartis, redBus, GroupM (WPP)). I build production LLM/RAG apps, AI agents, FastAPI, Next.js, and analytics.",
  alternates: {
    canonical: siteUrl,
    languages: {
      "en-IN": `${siteUrl}in/`,
      "x-default": siteUrl,
    },
  },
  openGraph: {
    title: "Madhu Dadi - Generative AI, RAG & Marketing Analytics Consultant",
    description:
      "Production LLM/RAG apps, AI agents, FastAPI/Next.js products, and marketing analytics systems.",
    url: siteUrl,
    siteName: "Madhu Dadi",
    type: "website",
    images: [
      {
        url: `${siteUrl}opengraph-image?ext=.png`,
        width: 1200,
        height: 630,
        alt: "Madhu Dadi - Generative AI, RAG & Marketing Analytics Consultant",
      },
    ],
  },
};

export default async function Home() {
  preload("/new-ui/hero-portrait.jpg", { as: "image", fetchPriority: "high" });

  return (
    <div className="min-h-screen">
      <SeoStructuredData
        nodes={[
          "Person",
          "WebSite",
          "WebPage",
          "ProfessionalService",
          "Organization",
          "SoftwareApplication",
          "Breadcrumb",
          "FAQ",
        ]}
      />
      <PortfolioContent />
    </div>
  );
}
