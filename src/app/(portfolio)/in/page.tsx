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
  title: "Madhu Dadi — AI Consultant in India | Visakhapatnam, Hyderabad, Bangalore",
  description:
    "Hire an expert AI consultant and marketing analytics engineer in India. Specializing in production LLM/RAG apps, AI agents, FastAPI, and Next.js.",
  alternates: {
    canonical: `${siteUrl}in/`,
  },
  openGraph: {
    title: "Madhu Dadi — AI Consultant in India",
    description:
      "Expert AI engineering, RAG applications, and marketing analytics consulting based in Visakhapatnam, India.",
    url: `${siteUrl}in/`,
    siteName: "Madhu Dadi",
    type: "website",
    images: [
      {
        url: `${siteUrl}og/home.png`,
        width: 1200,
        height: 630,
        alt: "Madhu Dadi — AI Consultant in India",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Madhu Dadi — AI Consultant in India",
    description:
      "Expert AI engineering, RAG applications, and marketing analytics consulting based in Visakhapatnam, India.",
    images: [`${siteUrl}og/home.png`],
  },
};

export default async function IndiaLandingPage() {
  return (
    <main id="main-content" className="min-h-screen">
      <SeoStructuredData />
      <PortfolioContent />
    </main>
  );
}
