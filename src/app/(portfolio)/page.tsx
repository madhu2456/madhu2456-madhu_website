import type { Metadata } from "next";
import PortfolioContent from "@/components/PortfolioContent";
import { SeoStructuredData } from "@/components/SeoStructuredData";

const DEFAULT_SITE_URL = "https://madhudadi.in";
const resolveSiteUrl = (rawUrl?: string) => {
  const url = (rawUrl?.trim() || DEFAULT_SITE_URL).replace(/\/+$/, "");
  return `${url}/`;
};
const siteUrl = resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);

export const metadata: Metadata = {
  title: "Madhu Dadi - Generative AI, RAG & Marketing Analytics Consultant",
  description:
    "AI and marketing analytics engineer. 9+ years exp (Novartis, redBus, GroupM). I build production LLM/RAG apps, AI agents, FastAPI, Next.js, and analytics.",
  alternates: {
    canonical: siteUrl,
    languages: {
      "en-IN": siteUrl,
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
  twitter: {
    card: "summary_large_image",
    title: "Madhu Dadi - Generative AI, RAG & Marketing Analytics Consultant",
    description:
      "Production LLM/RAG apps, AI agents, FastAPI/Next.js products, and marketing analytics systems.",
    images: [`${siteUrl}opengraph-image?ext=.png`],
  },
};

export default async function Home() {
  return (
    <main id="main-content" className="min-h-screen">
      <SeoStructuredData
        nodes={[
          "Person",
          "WebSite",
          "ProfessionalService",
          "Organization",
          "SoftwareApplication",
          "Breadcrumb",
        ]}
      />
      <PortfolioContent />
    </main>
  );
}
