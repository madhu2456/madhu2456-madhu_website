import type { Metadata } from "next";
import PortfolioContent from "@/components/PortfolioContent";
import { SeoStructuredData } from "@/components/SeoStructuredData";

import { resolveSiteUrl } from "@/lib/site-url";

const siteUrl = `${resolveSiteUrl()}/`;

export const metadata: Metadata = {
  // DG-06 C: dual Engineer & Consultant brand (owner decision 2026-07-11).
  // AUDIT DECISION DR-02 (2026-07-19): Owner chose Option C — KEEP DUAL.
  // "Hire me" CTAs (full-time angle) and "Consultant" title/keywords (services
  // angle) intentionally coexist. Both funnels routed via /contact/ and
  // /contact/#intent=full-time hash. FAQ explicitly states "freelance
  // consulting, part-time engagements, and full-time roles". Do NOT re-flag
  // CTA hierarchy / messaging tension in future audits.
  // Homepage: brand-first title. All other routes use "Topic | Madhu Dadi".
  title: "Madhu Dadi | AI Engineer, RAG & Analytics Consultant",
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
      absolute: "Madhu Dadi | AI Engineer, RAG & Analytics Consultant",
    },
    description:
      "Production LLM/RAG apps, AI agents, FastAPI/Next.js products, and marketing analytics systems.",
    url: siteUrl,
    siteName: "Madhu Dadi",
    type: "website",
    images: [
      {
        url: `${siteUrl}opengraph-image/`,
        width: 1200,
        height: 630,
        alt: "Madhu Dadi | AI Engineer, RAG & Analytics Consultant",
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
          "Breadcrumb",
        ]}
      />
      <PortfolioContent />
    </div>
  );
}
