import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { ChatBubble } from "../components/ChatBubble";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

const SITE_URL = "https://madhudadi.in";
const PERSON_ID = `${SITE_URL}/#person`;
const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const LOGO_ID = `${SITE_URL}/#logo`;

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": PERSON_ID,
  name: "Madhu Dadi",
  alternateName: "MadhuDadi",
  givenName: "Madhu",
  familyName: "Dadi",
  jobTitle: "AI & Analytics Engineer",
  description:
    "AI and analytics engineer with 9+ years of experience building LLM applications, RAG pipelines, AI agents, and the marketing analytics that prove they drive outcomes. Open to full-time roles.",
  url: SITE_URL,
  mainEntityOfPage: SITE_URL,
  image: `${SITE_URL}/og.jpg`,
  email: "mailto:madhu.kumar245@gmail.com",
  telephone: "+91-9985422444",
  nationality: { "@type": "Country", name: "India" },
  worksFor: { "@id": ORG_ID },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Visakhapatnam",
    addressRegion: "Andhra Pradesh",
    addressCountry: "IN",
  },
  sameAs: [
    "https://github.com/madhu2456",
    "https://www.linkedin.com/in/madhu-dadi-54684531",
    "https://x.com/madhu245",
  ],
  knowsAbout: [
    "Generative AI",
    "Large Language Models",
    "Retrieval Augmented Generation",
    "AI Agents",
    "LangChain",
    "LangGraph",
    "LlamaIndex",
    "Prompt Engineering",
    "Vector Databases",
    "pgvector",
    "Pinecone",
    "Weaviate",
    "Embeddings",
    "Fine-tuning",
    "Python",
    "FastAPI",
    "TypeScript",
    "Node.js",
    "Next.js",
    "Postgres",
    "Redis",
    "SQL",
    "Airflow",
    "dbt",
    "Docker",
    "AWS",
    "GCP",
    "Marketing Analytics",
    "Google Analytics 4",
    "BigQuery",
    "Dataiku",
    "Looker",
    "Tableau",
    "Marketing Mix Modeling",
    "Attribution Modeling",
    "A/B Testing",
    "Customer Segmentation",
  ],
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "Indian Institute of Management, Amritsar" },
    { "@type": "CollegeOrUniversity", name: "MVGR College of Engineering" },
  ],
  hasOccupation: {
    "@type": "Occupation",
    name: "AI Engineer & Marketing Analytics Leader",
    occupationLocation: { "@type": "City", name: "Visakhapatnam" },
    skills:
      "Generative AI, LLM applications, RAG pipelines, AI agents, marketing analytics, GA4 attribution, Python, FastAPI, Next.js, Postgres, vector databases",
  },
  seeks: {
    "@type": "Demand",
    name: "Full-time AI & analytics engineering role",
    description:
      "Open to full-time positions leading AI and marketing analytics end-to-end on serious product teams.",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": ["Organization", "ProfessionalService"],
  "@id": ORG_ID,
  name: "Madhu Dadi",
  alternateName: "Madhu Dadi — AI & Analytics Engineering",
  legalName: "Madhu Dadi",
  url: SITE_URL,
  description:
    "Independent AI and analytics engineering practice led by Madhu Dadi. LLM applications, RAG pipelines, AI agents, and marketing analytics that ship and drive measurable outcomes.",
  founder: { "@id": PERSON_ID },
  employee: { "@id": PERSON_ID },
  founders: [{ "@id": PERSON_ID }],
  foundingDate: "2016",
  foundingLocation: { "@type": "City", name: "Visakhapatnam" },
  email: "mailto:madhu.kumar245@gmail.com",
  telephone: "+91-9985422444",
  image: `${SITE_URL}/og.jpg`,
  logo: {
    "@type": "ImageObject",
    "@id": LOGO_ID,
    url: `${SITE_URL}/icon-512.png`,
    contentUrl: `${SITE_URL}/icon-512.png`,
    width: 512,
    height: 512,
    caption: "Madhu Dadi",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Visakhapatnam",
    addressRegion: "Andhra Pradesh",
    addressCountry: "IN",
  },
  areaServed: { "@type": "Place", name: "Worldwide (remote)" },
  serviceType: [
    "LLM application development",
    "RAG pipelines",
    "AI agent engineering",
    "Marketing analytics & attribution",
    "Data engineering",
  ],
  knowsAbout: personJsonLd.knowsAbout,
  sameAs: personJsonLd.sameAs,
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "hiring",
      email: "madhu.kumar245@gmail.com",
      telephone: "+91-9985422444",
      areaServed: "Worldwide",
      availableLanguage: ["English", "Hindi", "Telugu"],
    },
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  name: "Madhu Dadi",
  alternateName: "Madhu Dadi — AI & Analytics Engineer",
  url: SITE_URL,
  description:
    "Portfolio and case studies of Madhu Dadi: LLM applications, RAG pipelines, AI agents, and marketing analytics.",
  inLanguage: "en",
  publisher: { "@id": ORG_ID },
  author: { "@id": PERSON_ID },
  copyrightHolder: { "@id": PERSON_ID },
  about: { "@id": PERSON_ID },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: ["h1", "#about p", "#faq h3", "#faq [role='region']"],
  },
};

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#1a1410" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Madhu Dadi" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@madhu245" },
      { name: "twitter:creator", content: "@madhu245" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap",
      },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32.png" },
      { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16.png" },
      { rel: "manifest", href: "/site.webmanifest" },
    ],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(organizationJsonLd) },
      { type: "application/ld+json", children: JSON.stringify(personJsonLd) },
      { type: "application/ld+json", children: JSON.stringify(websiteJsonLd) },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
      <ChatBubble />
    </QueryClientProvider>
  );
}
