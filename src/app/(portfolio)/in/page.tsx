import type { Metadata } from "next";
import PortfolioContent from "@/components/PortfolioContent";
import { SeoStructuredData } from "@/components/SeoStructuredData";

import { resolveSiteUrl } from "@/lib/site-url";

const siteUrl = `${resolveSiteUrl()}/`;

export const metadata: Metadata = {
  title:
    "Madhu Dadi - AI Consultant in India | Visakhapatnam, Hyderabad, Bangalore",
  description:
    "Hire an expert AI consultant and marketing analytics engineer in India. Specializing in production LLM/RAG apps, AI agents, FastAPI, and Next.js.",
  alternates: {
    canonical: `${siteUrl}in/`,
  },
  openGraph: {
    title: "Madhu Dadi - AI Consultant in India",
    description:
      "Expert AI engineering, RAG applications, and marketing analytics consulting based in Visakhapatnam, India.",
    url: `${siteUrl}in/`,
    siteName: "Madhu Dadi",
    type: "website",
    images: [
      {
        url: `${siteUrl}opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Madhu Dadi - AI Consultant in India",
      },
    ],
  },
};

export default async function IndiaLandingPage() {
  return (
    <div id="main-content" className="min-h-screen">
      <SeoStructuredData
        nodes={[
          "Person",
          "WebSite",
          "ProfessionalService",
          "Organization",
          "SoftwareApplication",
          "Breadcrumb",
          "FAQ",
        ]}
      />

      {/* Unique Regional Context for India */}
      <section className="bg-primary/5 py-3 px-6 border-b border-primary/10">
        <div className="container mx-auto max-w-4xl flex items-center gap-3 text-sm text-foreground/80 font-medium">
          <span className="text-xl shrink-0" aria-hidden="true">
            🇮🇳
          </span>
          <p>
            <strong>India Regional Profile:</strong> Operating from
            Visakhapatnam, Andhra Pradesh. Providing AI consulting, Next.js
            engineering, and RAG architectures for businesses across Hyderabad,
            Bangalore, and all of India.
          </p>
        </div>
      </section>

      <PortfolioContent />
    </div>
  );
}
