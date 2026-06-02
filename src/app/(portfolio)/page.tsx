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
  title:
    "Madhu Dadi — AI & Marketing Analytics Engineer | LLM, RAG, FastAPI, GA4",
  description:
    "Madhu Dadi is an AI and marketing analytics engineer with 9+ years of experience across Novartis, redBus, GroupM, and Absolinsoft. He builds production LLM/RAG apps, AI agents, FastAPI/Next.js products, and analytics systems.",
  alternates: {
    canonical: siteUrl,
    languages: {
      en: siteUrl,
      "en-US": siteUrl,
      "x-default": siteUrl,
    },
  },
  openGraph: {
    title: "Madhu Dadi — AI & Marketing Analytics Engineer",
    description:
      "Production LLM/RAG apps, AI agents, FastAPI/Next.js products, and marketing analytics systems.",
    url: siteUrl,
    siteName: "Madhu Dadi",
    type: "profile",
    images: [
      {
        url: `${siteUrl}og/home.png`,
        width: 1200,
        height: 630,
        alt: "Madhu Dadi — AI & Marketing Analytics Engineer",
      },
    ],
  },
};

export default async function Home() {
  return (
    <main id="main-content" className="min-h-screen">
      <SeoStructuredData />
      <PortfolioContent />
    </main>
  );
}
