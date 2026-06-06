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
  title: "Madhu Dadi — Generative AI Engineer | RAG, AI Agents, FastAPI, GA4",
  description:
    "AI and marketing analytics engineer. 9+ years exp (Novartis, redBus, GroupM). I build production LLM/RAG apps, AI agents, FastAPI, Next.js, and analytics.",
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
    type: "website",
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
  const siteUrl = `${(process.env.NEXT_PUBLIC_SITE_URL || "https://madhudadi.in").replace(/\/+$/, "")}/`;

  const coreEntityGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${siteUrl}#person`,
        name: "Madhu Dadi",
        givenName: "Madhu",
        familyName: "Dadi",
        alternateName: ["madhu2456"],
        url: siteUrl,
        image: `${siteUrl}new-ui/hero-portrait.jpg`,
        jobTitle: "AI & Marketing Analytics Engineer",
        description:
          "Madhu Dadi is an AI and marketing analytics engineer based in Visakhapatnam, India. He has 9+ years of experience across Novartis, redBus, GroupM, and Absolinsoft, and builds production LLM/RAG applications, AI agents, FastAPI/Next.js products, and analytics systems.",
        disambiguatingDescription:
          "AI and marketing analytics engineer based in Visakhapatnam, India; specializes in LLM/RAG applications, AI agents, FastAPI/Next.js products, and marketing analytics.",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Visakhapatnam",
          addressCountry: "IN",
        },
        email: "mailto:madhu.kumar245@gmail.com",
        sameAs: [
          "https://github.com/madhu2456",
          "https://www.linkedin.com/in/madhu-dadi-54684531",
          "https://dev.to/madhudadi",
          "https://peerlist.io/madhudadi",
          "https://x.com/madhu245",
        ],
        knowsAbout: [
          "LLM application development",
          "Retrieval-Augmented Generation",
          "AI agents",
          "FastAPI",
          "Next.js",
          "Python",
          "SQL",
          "PostgreSQL",
          "Marketing analytics",
          "GA4",
          "BigQuery",
          "Campaign measurement",
          "Data pipelines",
          "Full-stack AI product development",
        ],
        worksFor: {
          "@type": "Organization",
          name: "Novartis",
        },
        alumniOf: [
          {
            "@type": "CollegeOrUniversity",
            name: "Indian Institute of Management Amritsar",
          },
          {
            "@type": "CollegeOrUniversity",
            name: "MVGR College of Engineering",
          },
        ],
        mainEntityOfPage: `${siteUrl}profile/`,
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}#website`,
        name: "Madhu Dadi",
        url: siteUrl,
        publisher: {
          "@id": `${siteUrl}#person`,
        },
      },
      {
        "@type": "ProfilePage",
        "@id": `${siteUrl}profile/#webpage`,
        url: `${siteUrl}profile/`,
        name: "Madhu Dadi — AI & Marketing Analytics Engineer",
        mainEntity: {
          "@id": `${siteUrl}#person`,
        },
      },
    ],
  };

  return (
    <main id="main-content" className="min-h-screen">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: safe — server-controlled JSON-LD only
        dangerouslySetInnerHTML={{ __html: JSON.stringify(coreEntityGraph) }}
      />
      <SeoStructuredData />
      <PortfolioContent />
    </main>
  );
}
