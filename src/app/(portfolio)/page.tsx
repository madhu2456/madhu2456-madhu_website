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
  title: "Madhu Dadi - AI & Marketing Analytics Engineer",
  description:
    "AI and marketing analytics engineer. 9+ years exp (Novartis, redBus, GroupM). I build production LLM/RAG apps, AI agents, FastAPI, Next.js, and analytics.",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "Madhu Dadi - AI & Marketing Analytics Engineer",
    description:
      "Production LLM/RAG apps, AI agents, FastAPI/Next.js products, and marketing analytics systems.",
    url: siteUrl,
    siteName: "Madhu Dadi",
    type: "website",
    images: [
      {
        url: `${siteUrl}opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Madhu Dadi - AI & Marketing Analytics Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Madhu Dadi - AI & Marketing Analytics Engineer",
    description:
      "Production LLM/RAG apps, AI agents, FastAPI/Next.js products, and marketing analytics systems.",
    images: [`${siteUrl}opengraph-image`],
  },
};

export default async function Home() {
  const siteUrl = `${(process.env.NEXT_PUBLIC_SITE_URL || "https://madhudadi.in").replace(/\/+$/, "")}/`;
  return (
    <main id="main-content" className="min-h-screen">
      <SeoStructuredData />
      <PortfolioContent />
    </main>
  );
}
