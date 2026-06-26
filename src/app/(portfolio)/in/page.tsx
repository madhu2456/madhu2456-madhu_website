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
    <div className="min-h-screen">
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

      {/* India-specific content for SEO/AEO differentiation */}
      <section className="py-12 px-6">
        <div className="container mx-auto max-w-4xl space-y-8">
          <div className="rounded-2xl border border-border bg-surface/30 p-6 md:p-8 space-y-4">
            <h2 className="font-display text-2xl font-semibold text-foreground">
              AI Consulting Services in India
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Based in Visakhapatnam, Andhra Pradesh, Madhu Dadi provides
              end-to-end AI engineering and marketing analytics consulting to
              startups and enterprises across India — including Hyderabad,
              Bangalore, Mumbai, Delhi NCR, Chennai, and Pune. With 9+ years of
              experience spanning Novartis, redBus, GroupM (WPP), and
              Absolinsoft, he brings production-grade LLM/RAG architectures, AI
              agent development, FastAPI backends, and Next.js full-stack
              products to Indian businesses scaling their digital operations.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Whether you are a SaaS startup in Koramangala, a fintech firm in
              HITEC City, or an e-commerce brand in Noida — the core challenge
              is the same: turning complex AI and data infrastructure into
              measurable business outcomes. Madhu specializes in building
              retrieval-augmented generation (RAG) pipelines for Indian
              enterprise knowledge bases, deploying server-side GTM and GA4 /
              BigQuery analytics stacks for multi-region campaigns, and shipping
              production Next.js applications optimized for Indian mobile-first
              audiences.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-surface/30 p-6 space-y-3">
              <h3 className="font-semibold text-foreground">
                Hyderabad & Bangalore
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Serving the major Indian tech hubs. AI agent development, RAG
                pipelines, and marketing analytics for SaaS, fintech, and
                e-commerce companies in South India.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-surface/30 p-6 space-y-3">
              <h3 className="font-semibold text-foreground">
                Mumbai, Delhi NCR & Pan-India
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Remote-first consulting for enterprises across India. Full-stack
                AI product development, GA4/BigQuery analytics, and production
                LLM applications delivered end-to-end.
              </p>
            </div>
          </div>
        </div>
      </section>

      <PortfolioContent />
    </div>
  );
}
