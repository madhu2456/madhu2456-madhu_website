import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useInView, useCountUp, useActiveSection } from "@/hooks/useReveal";
import heroPortrait from "@/assets/hero-portrait.jpg";
import heroPortraitAvif from "@/assets/hero-portrait.jpg?format=avif&quality=70&w=694;1388&as=srcset";
import heroPortraitWebp from "@/assets/hero-portrait.jpg?format=webp&quality=78&w=694;1388&as=srcset";
import heroPortraitPreload from "@/assets/hero-portrait.jpg?format=avif&quality=70&w=694&url";
import logo from "@/assets/logo.png";

const SITE_URL = "https://madhudadi.in";

const stats = [
  { value: "9+", label: "Years experience" },
  { value: "30%", label: "New-customer growth" },
  { value: "20%", label: "Churn reduction" },
  { value: "15%", label: "Brand-awareness lift" },
];

const services = [
  {
    title: "AI & LLM Application Development",
    summary:
      "RAG, agents, and chatbots built for real users. Not just a happy-path demo.",
    features: [
      "RAG pipelines that cite their sources",
      "Model choices that fit your budget",
      "Agents that don't loop forever",
      "Evals, guardrails, and quiet observability",
    ],
    price: "From $2,500",
    timeline: "3–8 weeks",
    stack: ["Python", "OpenAI", "LangChain", "FastAPI", "Next.js"],
  },
  {
    title: "Marketing Analytics & Decision Intelligence",
    summary:
      "Attribution and dashboards your team will open on Monday. And trust by Friday.",
    features: [
      "Measurement that holds up in a CMO Q&A",
      "Attribution without hand-waving",
      "Dashboards for execs and operators",
      "A/B tests read honestly, not optimistically",
    ],
    price: "From $2,000",
    timeline: "2–6 weeks",
    stack: ["SQL", "Python", "Snowflake", "GA4", "Dataiku"],
  },
  {
    title: "Full-Stack Web Product Development",
    summary:
      "Web products that load fast, rank well, and don't break the day after launch.",
    features: [
      "Full-stack builds, front to back",
      "REST and GraphQL APIs",
      "Postgres schemas you can live with",
      "Performance, SEO, and a CI you trust",
    ],
    price: "From $3,000",
    timeline: "4–12 weeks",
    stack: ["Next.js", "TypeScript", "React", "FastAPI", "Postgres"],
  },
];

const experience = [
  {
    role: "Senior Analytics Manager",
    company: "Novartis",
    period: "Mar 2023 to Present",
    location: "Hyderabad, India",
    summary:
      "Lead digital analytics strategy for Novartis Patient Support Services, driving data-informed decisions across patient-engagement platforms.",
    highlight: "Best Performer of the Quarter, Q1 2024",
  },
  {
    role: "Marketing Analytics Manager",
    company: "redBus (MakeMyTrip Group)",
    period: "Jun 2022 to Mar 2023",
    location: "Bangalore, India",
    summary:
      "Led measurement for ATL, BTL, and digital campaigns across India, Malaysia, Indonesia, and Singapore. Built brand playbooks and CLM strategy.",
    highlight: "Q3 Trailblazer, 30% new-customer growth",
  },
  {
    role: "Analytics Manager",
    company: "GroupM (WPP)",
    period: "Sep 2020 to May 2022",
    location: "Gurgaon, India",
    summary:
      "Led Google Ads Data Hub projects for top-5% GroupM clients: frequency reach, brand lift studies, and first-party data activation.",
    highlight: "Performer of the Year 2020–21 · WPP NextGen",
  },
  {
    role: "Web Developer & Penetration Tester",
    company: "Absolinsoft",
    period: "May 2016 to Jul 2018",
    location: "Visakhapatnam, India",
    summary:
      "Web analytics, SEO, SMM, and SEM with descriptive and predictive modelling. Reduced bounce 25%, lifted CTR 20%.",
    highlight: "Foundations in analytics + engineering",
  },
];

type Project = {
  brand: string;
  headline: string;
  name: string;
  category: string;
  description: string;
  stack: string[];
  links: { label: string; href: string }[];
  faqs: { q: string; a: string }[];
};

const makeProject = (
  p: Omit<Project, "name">,
): Project => ({ ...p, name: `${p.brand}, ${p.headline}` });

const projects: Project[] = [
  makeProject({
    brand: "Adticks",
    headline: "AI Visibility & SEO Auditing Platform",
    category: "SaaS · SEO / AEO / GEO",
    description:
      "Crawls 10,000+ pages in parallel with Playwright. Compares server HTML to the rendered DOM. Returns a ranked fix list for SEO, AEO, and GEO. Audits that took a week now take an afternoon.",
    stack: ["Next.js", "FastAPI", "Postgres", "Redis", "Celery", "Playwright"],
    links: [
      { label: "Read the Adticks AI visibility & SEO audit case study", href: "/case-studies/adticks" },
      { label: "Live", href: "https://adticks.com/" },
    ],
    faqs: [
      {
        q: "What does Adticks do?",
        a: "Adticks is a search intelligence and AI visibility auditing platform that crawls websites at scale, diagnoses how generative engines (ChatGPT, Claude, Gemini, Perplexity) see them, and produces severity-ranked SEO, AEO, and GEO fix queues.",
      },
      {
        q: "How does Adticks detect AI visibility issues?",
        a: "Parallel Playwright crawls compare raw server HTML against the fully client-rendered DOM to surface render-parity gaps. It also audits robots.txt, sitemaps, schema.org markup, and llms.txt to find content hidden from LLM crawlers.",
      },
      {
        q: "What stack powers Adticks?",
        a: "A Next.js + React frontend with a FastAPI + Celery backend on PostgreSQL and Redis, running 18 parallel audit analyzers with selectolax parsing and Playwright rendering.",
      },
    ],
  }),
  makeProject({
    brand: "Technical Blog",
    headline: "RAG-Powered Learning Platform with AI Assistant",
    category: "Education · RAG / AI assistant",
    description:
      "A series-based tech blog with an assistant that has actually read the blog. Vector-grounded answers with citations. Instant in-page search. Ranks for humans and LLMs alike.",
    stack: ["Next.js", "TypeScript", "Tailwind", "FastAPI", "RAG", "Vector DB"],
    links: [
      { label: "See the RAG-powered technical blog case study", href: "/case-studies/technical-blog" },
      { label: "Read", href: "https://madhudadi.in/blog" },
    ],
    faqs: [
      {
        q: "What is the Technical Blog?",
        a: "A learning-focused publication with series-based paths covering AI, RAG, LLMs, and modern web engineering, paired with an embedded AI assistant that answers questions from the blog's own vector database.",
      },
      {
        q: "How does the RAG AI Assistant work?",
        a: "User queries are embedded and matched against a localized vector index of blog content. A FastAPI backend grounds the LLM response in the retrieved chunks and returns cited, contextually accurate answers in real time.",
      },
      {
        q: "Why is the blog fast for both users and bots?",
        a: "Next.js delivers server-rendered pages, and automated CI plus post-deployment cache warming stabilize TTFB so search and AI crawlers index content reliably alongside human readers.",
      },
    ],
  }),
  makeProject({
    brand: "Udemy Enroller",
    headline: "Async FastAPI Course Enrollment Automation",
    category: "Web app · Automation",
    description:
      "Scrapes Udemy coupon sources, validates each link, and enrolls users automatically through an async FastAPI and Celery queue. Has delivered 20,000+ free courses in six months. Roughly ₹10L in saved tuition.",
    stack: ["Python", "FastAPI", "Celery", "Redis", "GitHub Actions"],
    links: [
      { label: "Read the async FastAPI Udemy enrollment automation case study", href: "/case-studies/udemy-enroller-fastapi" },
      { label: "Live", href: "https://udemyenroller.madhudadi.in/" },
      { label: "GitHub", href: "https://github.com/madhu2456/udemy_enroller_fastapi" },
    ],
    faqs: [
      {
        q: "What problem does Udemy Enroller solve?",
        a: "Free Udemy coupons expire quickly and are scattered across many sites. The tool scrapes coupon sources, validates links, and auto-enrolls users so they never miss time-limited offers.",
      },
      {
        q: "How does it scale enrollments?",
        a: "A FastAPI service queues work to Celery workers backed by Redis, running concurrent enrollments while respecting Udemy's rate limits and handling CAPTCHAs and IP blocks gracefully.",
      },
      {
        q: "What impact has it delivered?",
        a: "It cut manual enrollment effort by ~90% and delivered 20,000+ courses to users in 6 months, with estimated savings of ₹10,00,000+.",
      },
    ],
  }),
];

const LINKEDIN_CERTS_URL =
  "https://www.linkedin.com/in/madhu-dadi-54684531/details/certifications/";

const certifications = [
  { name: "Ultimate RAG Bootcamp, LangChain, LangGraph, LangSmith", issuer: "Udemy", date: "Apr 2026", url: LINKEDIN_CERTS_URL },
  { name: "Complete Data Science, ML, DL, NLP Bootcamp", issuer: "Udemy", date: "Feb 2026", url: LINKEDIN_CERTS_URL },
  { name: "Azure AI Fundamentals", issuer: "Microsoft", date: "Jun 2025", url: LINKEDIN_CERTS_URL },
  { name: "MongoDB Python Developer Path", issuer: "MongoDB", date: "May 2025", url: LINKEDIN_CERTS_URL },
  { name: "GitHub Actions Professional", issuer: "GitHub", date: "May 2025", url: LINKEDIN_CERTS_URL },
  { name: "Dataiku Core Designer", issuer: "Dataiku", date: "May 2025", url: LINKEDIN_CERTS_URL },
];

const faqs = [
  {
    q: "What does Madhu build?",
    a: "Three things, mostly. LLM and RAG features inside real products. Marketing analytics teams use to make decisions. The full-stack code that holds both together. Stack: Python, FastAPI, Next.js, Postgres.",
  },
  {
    q: "Where has he worked?",
    a: "Pharma at Novartis. Travel at redBus and the MMT group. Media and marketing at GroupM (WPP). A few smaller software shops before that. Nine years in total.",
  },
  {
    q: "Is he open to full-time roles?",
    a: "Yes. He's actively looking for a full-time position where he can own AI and analytics end-to-end on a serious product team. Open to remote or relocation for the right opportunity.",
  },
  {
    q: "What's his core stack?",
    a: "Python and TypeScript day to day. FastAPI and Next.js for services and apps. Postgres, Redis, and vector databases for data. OpenAI, LangChain, and LangGraph for LLM and agent work. SQL, GA4, and Dataiku for analytics.",
  },
  {
    q: "What's the fastest way to reach him?",
    a: "Email madhu.kumar245@gmail.com. Or message him on LinkedIn at linkedin.com/in/madhu-dadi-54684531. Phone: +91 99854 22444. He replies within a day.",
  },
];

const professionalServiceJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Madhu Dadi, AI & Analytics Consulting",
  image: `${SITE_URL}/og.jpg`,
  url: SITE_URL,
  telephone: "+91-9985422444",
  email: "madhu.kumar245@gmail.com",
  areaServed: "Worldwide",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Visakhapatnam",
    addressRegion: "Andhra Pradesh",
    addressCountry: "IN",
  },
  geo: { "@type": "GeoCoordinates", latitude: 17.6868, longitude: 83.2185 },
  founder: { "@type": "Person", name: "Madhu Dadi" },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Capabilities",
    itemListElement: services.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s.title, description: s.summary },
    })),
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Work", item: `${SITE_URL}/#projects` },
    { "@type": "ListItem", position: 3, name: "Case Studies", item: `${SITE_URL}/case-studies` },
    { "@type": "ListItem", position: 4, name: "Services", item: `${SITE_URL}/#services` },
  ],
};

const caseStudySources: { slug: string; image?: string }[] = [
  { slug: "adticks" },
  { slug: "technical-blog" },
  { slug: "udemy-enroller-fastapi" },
];

const caseStudyItemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Case studies by Madhu Dadi",
  itemListOrder: "https://schema.org/ItemListOrderAscending",
  numberOfItems: projects.length,
  itemListElement: projects.map((p, i) => ({
    "@type": "ListItem",
    position: i + 1,
    url: `${SITE_URL}${p.links.find((l) => l.href.startsWith("/case-studies/"))?.href ?? "/case-studies"}`,
    name: p.name,
  })),
};

const caseStudyArticleJsonLd = projects.map((p) => {
  const slug = caseStudySources.find((c) => p.links.some((l) => l.href === `/case-studies/${c.slug}`))?.slug;
  const url = slug ? `${SITE_URL}/case-studies/${slug}` : SITE_URL;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: p.name,
    description: p.description,
    about: p.category,
    keywords: p.stack.join(", "),
    author: { "@type": "Person", name: "Madhu Dadi", url: SITE_URL },
    publisher: { "@type": "Person", name: "Madhu Dadi", url: SITE_URL },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
  };
});

const caseStudyFaqJsonLd = projects.map((p) => {
  const slug = caseStudySources.find((c) => p.links.some((l) => l.href === `/case-studies/${c.slug}`))?.slug;
  const url = slug ? `${SITE_URL}/case-studies/${slug}` : SITE_URL;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    about: { "@type": "CreativeWork", name: p.name, url },
    mainEntity: p.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
});

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Madhu Dadi | AI & Analytics Engineer · LLM, RAG, GA4" },
      {
        name: "description",
        content:
          "Madhu Dadi is an AI and analytics engineer with 9+ years building LLM applications, RAG pipelines, AI agents, and marketing analytics that move the numbers. Open to full-time roles.",
      },
      { name: "author", content: "Madhu Dadi" },
      { name: "keywords", content: "Madhu Dadi, AI engineer, LLM developer, RAG developer, AI agents, marketing analytics engineer, GA4 attribution, Python, FastAPI, Next.js, full-time AI engineer" },
      { property: "og:title", content: "Madhu Dadi | AI & Analytics Engineer" },
      {
        property: "og:description",
        content:
          "9+ years building LLM apps, RAG pipelines, AI agents, and the analytics that prove they drive outcomes. Open to full-time roles.",
      },
      { property: "og:url", content: SITE_URL },
      { property: "og:type", content: "profile" },
      { property: "og:site_name", content: "Madhu Dadi" },
      { property: "profile:first_name", content: "Madhu" },
      { property: "profile:last_name", content: "Dadi" },
      { property: "profile:username", content: "madhu245" },
      { property: "og:image", content: `${SITE_URL}/og.jpg` },
      { property: "og:image:secure_url", content: `${SITE_URL}/og.jpg` },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Madhu Dadi — AI & Analytics Engineer" },
      { property: "og:logo", content: `${SITE_URL}/icon-512.png` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@madhu245" },
      { name: "twitter:creator", content: "@madhu245" },
      { name: "twitter:title", content: "Madhu Dadi | AI & Analytics Engineer" },
      {
        name: "twitter:description",
        content: "9+ years building LLM apps, RAG pipelines, AI agents, and marketing analytics. Open to full-time roles.",
      },
      { name: "twitter:image", content: `${SITE_URL}/og.jpg` },
      { name: "twitter:image:alt", content: "Madhu Dadi — AI & Analytics Engineer" },
      { name: "geo.region", content: "IN-AP" },
      { name: "geo.placename", content: "Visakhapatnam" },
      { name: "geo.position", content: "17.6868;83.2185" },
      { name: "ICBM", content: "17.6868, 83.2185" },
    ],
    links: [
      { rel: "canonical", href: SITE_URL },
      {
        rel: "preload",
        as: "image",
        href: heroPortraitPreload,
        type: "image/avif",
        imagesrcset: heroPortraitAvif,
        imagesizes: "(min-width: 1024px) 480px, 90vw",
        fetchpriority: "high",
      },
    ],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(professionalServiceJsonLd) },
      { type: "application/ld+json", children: JSON.stringify(faqJsonLd) },
      { type: "application/ld+json", children: JSON.stringify(breadcrumbJsonLd) },
      { type: "application/ld+json", children: JSON.stringify(caseStudyItemListJsonLd) },
      ...caseStudyArticleJsonLd.map((j) => ({
        type: "application/ld+json",
        children: JSON.stringify(j),
      })),
      ...caseStudyFaqJsonLd.map((j) => ({
        type: "application/ld+json",
        children: JSON.stringify(j),
      })),
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground focus:shadow-lg"
      >
        Skip to main content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Stats />
        <About />
        <Projects />
        <Services />
        <Skills />
        <Experience />
        <Certifications />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

/* ---------------- Header ---------------- */

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Work" },
  { href: "#services", label: "Services" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
];

function Header() {
  const active = useActiveSection(navLinks.map((l) => l.href.slice(1)));
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto mt-3 flex w-[min(1200px,94%)] items-center justify-between rounded-full glass px-3 py-2 sm:mt-4 sm:px-5 sm:py-3">
        <a href="#main" className="flex items-center gap-2 font-display text-base sm:text-lg">
          <img src={logo} alt="" aria-hidden width={28} height={28} className="h-7 w-7 rounded-md" />
          <span>Madhu&nbsp;Dadi</span>
        </a>
        <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
          {navLinks.map((l) => {
            const isActive = active === l.href.slice(1);
            return (
              <a
                key={l.href}
                href={l.href}
                aria-current={isActive ? "location" : undefined}
                className={`relative text-sm transition-colors hover:text-foreground ${isActive ? "text-foreground" : "text-muted-foreground"}`}
              >
                {l.label}
                <span
                  aria-hidden
                  className={`pointer-events-none absolute -bottom-1 left-0 h-px w-full origin-left bg-primary transition-transform duration-300 ${isActive ? "scale-x-100" : "scale-x-0"}`}
                />
              </a>
            );
          })}
        </nav>
        <a
          href="#contact"
          onClick={() => {
            try {
              sessionStorage.setItem(
                "contact-prefill",
                JSON.stringify({
                  subject: "Hiring inquiry, full-time AI & Analytics Engineer",
                  message:
                    "Hi Madhu,\n\nWe'd like to talk about a full-time role.\n\n• Company:\n• Role / team:\n• Location (remote, hybrid, onsite):\n• Tech stack:\n• Ideal start date:\n\nLooking forward to connecting.",
                }),
              );
              window.dispatchEvent(new Event("contact-prefill"));
            } catch {}
          }}
          className="rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-transform hover:scale-[1.03] sm:px-4 sm:py-2 sm:text-sm"
        >
          Hire me
        </a>
      </div>
    </header>
  );
}

/* ---------------- Hero ---------------- */

function Hero() {
  return (
    <section className="relative isolate bg-hero-glow pt-24 pb-16 sm:pt-32 sm:pb-20 lg:min-h-[100svh]">
      <div className="grain absolute inset-0 -z-10" aria-hidden />
      <div className="mx-auto grid w-[min(1200px,92%)] gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-14">
        <div className="animate-fade-up">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[11px] text-emerald-300 sm:mb-5 sm:text-xs">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            Available now · Replies within 24 hours
          </p>
          <p className="mb-3 font-display text-[11px] uppercase tracking-[0.18em] text-muted-foreground sm:text-sm sm:tracking-[0.2em]">
            Madhu Dadi, AI Developer & Marketing Analytics Leader
          </p>
          <h1 className="font-display text-[clamp(2rem,8vw,4.75rem)] font-medium leading-[1.05] tracking-tight sm:leading-[1.02]">
            I build <span className="text-gradient-amber italic">AI that actually ships</span>
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            and moves <span className="text-gradient">numbers you care about.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:mt-6 sm:text-lg">
            I'm Madhu, an AI and analytics engineer with nine years of
            experience building LLM applications, RAG pipelines, AI agents,
            and the marketing analytics that prove they drive real outcomes.
            I work across Python, FastAPI, Next.js, Postgres, vector
            databases, and GA4. I'm looking for a full-time role on a serious
            team where I can own AI and analytics end-to-end.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center">
            <a
              href="#contact"
              onClick={() => {
                try {
                  sessionStorage.setItem(
                    "contact-prefill",
                    JSON.stringify({
                      subject: "Intro call, AI consulting",
                      message:
                        "Hi Madhu,\n\nI'd like to book a 20-minute intro call to discuss:\n\n• What I'm trying to build:\n• Timeline:\n• Budget range:\n\nThanks!",
                    }),
                  );
                  window.dispatchEvent(new Event("contact-prefill"));
                } catch {}
              }}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:scale-[1.03] sm:px-6"
            >
              Book a 20-min intro call
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
            </a>
            <a
              href="#projects"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-surface/60 px-5 py-3 text-sm font-medium hover:bg-surface-elevated sm:px-6"
            >
              See case studies
            </a>
          </div>
          <div className="mt-8 sm:mt-10">
            <p className="mb-3 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Worked at
            </p>
            <ul className="flex flex-wrap items-center gap-x-4 gap-y-2 font-display text-sm text-foreground/80 sm:gap-x-6 sm:text-base">
              <li>Novartis</li>
              <li aria-hidden className="text-muted-foreground/40">·</li>
              <li>MakeMyTrip</li>
              <li aria-hidden className="text-muted-foreground/40">·</li>
              <li>GroupM</li>
              <li aria-hidden className="text-muted-foreground/40">·</li>
              <li>redBus</li>
              <li aria-hidden className="text-muted-foreground/40">·</li>
              <li>Absolinsoft</li>
            </ul>
          </div>
        </div>

        <div className="relative animate-fade-up">
          <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-tr from-accent/30 via-transparent to-primary/20 blur-2xl sm:-inset-6" />
          <div className="overflow-hidden rounded-[1.5rem] border border-border shadow-card sm:rounded-[1.75rem]">
            <picture>
              <source
                type="image/avif"
                srcSet={heroPortraitAvif}
                sizes="(min-width: 1024px) 480px, 90vw"
              />
              <source
                type="image/webp"
                srcSet={heroPortraitWebp}
                sizes="(min-width: 1024px) 480px, 90vw"
              />
              <img
                src={heroPortrait}
                alt="Portrait of Madhu Dadi, AI consultant and ML engineer"
                width={694}
                height={925}
                loading="eager"
                decoding="async"
                fetchPriority="high"
                className="h-full w-full object-cover"
              />
            </picture>
          </div>
          <div className="absolute bottom-3 left-3 right-3 glass rounded-xl p-3 sm:bottom-5 sm:left-5 sm:right-5 sm:rounded-2xl sm:p-4">
            <p className="font-display text-base italic sm:text-lg">Let's build something meaningful.</p>
            <p className="mt-1 text-[11px] text-muted-foreground sm:text-xs">
              AI · LLM · RAG · Analytics · Full-stack
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Stats ---------------- */

function Stats() {
  const { ref, inView } = useInView<HTMLDListElement>();
  return (
    <section aria-label="Key results" className="border-y border-border bg-surface/40">
      <dl ref={ref} className="mx-auto grid w-[min(1200px,92%)] grid-cols-2 gap-px md:grid-cols-4">
        {stats.map((s, i) => (
          <StatItem key={s.label} value={s.value} label={s.label} start={inView} delay={i * 80} />
        ))}
      </dl>
    </section>
  );
}

function StatItem({ value, label, start, delay }: { value: string; label: string; start: boolean; delay: number }) {
  const display = useCountUp(value, start);
  return (
    <div
      className="py-10 text-center transition-all duration-700"
      style={{
        opacity: start ? 1 : 0,
        transform: start ? "translateY(0)" : "translateY(12px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      <dd className="font-display text-4xl md:text-5xl text-gradient-amber">{display}</dd>
      <dt className="mt-2 text-sm text-muted-foreground">{label}</dt>
    </div>
  );
}

/* ---------------- About ---------------- */

function About() {
  return (
    <Section id="about" eyebrow="About" title="Strategy and execution, together.">
      <div className="grid gap-10 lg:grid-cols-3">
        <div className="space-y-4 text-lg leading-relaxed text-muted-foreground lg:col-span-2">
          <p>
            I <strong className="text-foreground">build AI</strong>. I don't
            just talk about it. My work splits in two. I help teams put{" "}
            <strong className="text-foreground">LLMs, RAG, and AI agents</strong>{" "}
            into real products without the demo to prod cliff. And I clean up
            the <strong className="text-foreground">marketing data</strong>{" "}
            that's meant to tell them whether any of it actually works.
          </p>
          <p>
            I write Python and TypeScript every day. I live in FastAPI,
            Next.js, and SQL. I care about the boring things that keep AI
            shipping. Evals. Guardrails. Logs. p95s. Who gets paged at 2am.
            If a project doesn't have a number attached to it, I'll ask you
            for one before we start.
          </p>
        </div>
        <ul className="space-y-3 text-sm">
          {[
            "Small, senior team. Usually just me.",
            "Evals and monitoring ship with the launch.",
            "You keep the code, the docs, and the keys.",
            "I've shipped in healthcare, travel, media, and SaaS.",
          ].map((t) => (
            <li key={t} className="flex gap-3 rounded-xl border border-border bg-surface/50 px-4 py-3">
              <span className="text-primary">◆</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

/* ---------------- Services ---------------- */

function Services() {
  return (
    <Section id="services" eyebrow="Services" title="Generative AI & engineering services.">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <article
            key={s.title}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface/60 p-6 shadow-card transition-all hover:-translate-y-1 hover:border-primary/40"
          >
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
              ◇
            </div>
            <h3 className="font-display text-2xl">{s.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.summary}</p>

            <ul className="mt-5 space-y-2 text-sm">
              {s.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="text-primary">›</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto flex flex-wrap gap-1.5 border-t border-border pt-4">
              {s.stack.map((t) => (
                <span key={t} className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground">
                  {t}
                </span>
              ))}
            </div>
            <a
              href="#contact"
              onClick={() => {
                try {
                  sessionStorage.setItem(
                    "contact-prefill",
                    JSON.stringify({
                      subject: `${s.title}, project inquiry`,
                      message: `Hi Madhu,\n\nI'm interested in your ${s.title} work.\n\n• What I'm trying to build:\n• Timeline:\n• Current stack / context:\n\nThanks!`,
                    }),
                  );
                  window.dispatchEvent(new Event("contact-prefill"));
                } catch {}
              }}
              className="group mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:scale-[1.02]"
            >
              Start a {s.title.split(" ")[0]} project
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
            </a>
          </article>
        ))}
      </div>
    </Section>
  );
}

/* ---------------- Skills ---------------- */

const skillGroups = [
  {
    title: "AI & LLM Engineering",
    items: [
      "LLM application design",
      "RAG pipelines",
      "Agentic workflows (LangGraph)",
      "LangChain, LlamaIndex",
      "OpenAI, Anthropic, Gemini",
      "Prompt engineering & evals",
      "Vector DBs (pgvector, Pinecone, Weaviate)",
      "Fine-tuning & embeddings",
    ],
  },
  {
    title: "Backend & Data Engineering",
    items: [
      "Python, FastAPI",
      "TypeScript, Node.js",
      "Postgres, Redis",
      "SQL (advanced)",
      "Airflow, dbt",
      "REST & streaming APIs",
      "Docker, CI/CD",
      "AWS, GCP",
    ],
  },
  {
    title: "Marketing & Product Analytics",
    items: [
      "GA4, GTM, BigQuery",
      "Dataiku, Looker",
      "Attribution & MMM",
      "Experimentation (A/B, causal)",
      "Customer segmentation",
      "Funnel & cohort analysis",
      "Dashboarding (Looker, Tableau)",
      "Reverse ETL (Hightouch, Census)",
    ],
  },
];

function Skills() {
  const skillsJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Madhu Dadi — Skills",
    description:
      "Skills and tools Madhu Dadi works with across AI engineering, backend, and marketing analytics.",
    numberOfItems: skillGroups.reduce((n, g) => n + g.items.length, 0),
    itemListElement: skillGroups.flatMap((g, gi) =>
      g.items.map((s, i) => ({
        "@type": "ListItem",
        position: gi * 100 + i + 1,
        item: {
          "@type": "DefinedTerm",
          name: s,
          inDefinedTermSet: g.title,
        },
      })),
    ),
  };
  return (
    <Section id="skills" eyebrow="Skills" title="The stack I work in every day.">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(skillsJsonLd) }}
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((g) => (
          <div
            key={g.title}
            className="rounded-2xl border border-border bg-surface/60 p-6 shadow-card transition-all hover:-translate-y-1 hover:border-primary/40"
          >
            <h3 className="font-display text-xl">{g.title}</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {g.items.map((s) => (
                <li
                  key={s}
                  className="rounded-full border border-border bg-surface-elevated/60 px-3 py-1 text-xs text-muted-foreground"
                >
                  {s}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ---------------- Experience ---------------- */

function Experience() {
  return (
    <Section id="experience" eyebrow="Experience" title="Nine years across analytics and AI.">
      <ol className="relative space-y-8 border-l border-border pl-6">
        {experience.map((e) => (
          <li key={e.role + e.company} className="relative">
            <span className="absolute -left-[31px] top-2 h-3 w-3 rounded-full bg-primary shadow-glow" aria-hidden />
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-display text-2xl">
                {e.role} <span className="text-muted-foreground">· {e.company}</span>
              </h3>
              <p className="text-xs text-muted-foreground">{e.period} · {e.location}</p>
            </div>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">{e.summary}</p>
            <p className="mt-3 inline-block rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary">
              ★ {e.highlight}
            </p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

/* ---------------- Projects ---------------- */

function Projects() {
  return (
    <Section id="projects" eyebrow="Selected work" title="Case studies: AI, RAG & full-stack engineering.">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <article
            key={p.name}
            className="group flex flex-col rounded-2xl border border-border bg-surface/60 p-5 transition-all hover:-translate-y-1 hover:border-primary/40 sm:p-6"
          >
            <p className="text-[11px] uppercase tracking-widest text-primary sm:text-xs">{p.category}</p>
            <h3 className="mt-2 min-h-[3.75rem] font-display text-xl leading-tight sm:text-2xl">{p.headline}</h3>
            <p className="mt-1 text-sm font-medium text-foreground/80">{p.brand}</p>
            <p className="mt-3 min-h-[9rem] text-sm leading-relaxed text-muted-foreground">{p.description}</p>
            <div className="mt-4 flex min-h-[3.5rem] flex-wrap content-start gap-1.5">
              {p.stack.map((t) => (
                <span key={t} className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground">
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              {p.links.map((l) => {
                const isInternal = l.href.startsWith("/");
                const isCaseStudy = isInternal && l.href.startsWith("/case-studies/");
                if (isCaseStudy) {
                  return (
                    <Link
                      key={l.href}
                      to={l.href}
                      aria-label={l.label}
                      className="inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-4 transition-colors hover:underline"
                    >
                      Read case study <span aria-hidden>→</span>
                    </Link>
                  );
                }
                return isInternal ? (
                  <Link
                    key={l.href}
                    to={l.href}
                    className="inline-flex items-center gap-1 text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                  >
                    {l.label} →
                  </Link>
                ) : (
                  <a
                    key={l.href}
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                  >
                    {l.label} ↗
                  </a>
                );
              })}
            </div>
            {p.faqs.length > 0 && (
              <div className="mt-6">
                <div className="border-t border-border/60 pt-4">
                <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">FAQs</p>
                <ul className="space-y-2">
                  {p.faqs.map((f) => (
                    <li key={f.q}>
                      <details className="group rounded-lg border border-border/60 bg-surface/40 px-3 py-2 text-sm">
                        <summary className="cursor-pointer list-none font-medium text-foreground marker:hidden">
                          <span className="mr-2 text-primary">+</span>
                          {f.q}
                        </summary>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                      </details>
                    </li>
                  ))}
                </ul>
                </div>
              </div>
            )}
          </article>
        ))}
      </div>
    </Section>
  );
}

/* ---------------- Certifications ---------------- */

function Certifications() {
  const certsJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Madhu Dadi — Certifications",
    description:
      "Professional certifications held by Madhu Dadi across AI, data, cloud, and developer tooling.",
    numberOfItems: certifications.length,
    itemListElement: certifications.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: c.url,
      item: {
        "@type": "EducationalOccupationalCredential",
        name: c.name,
        url: c.url,
        credentialCategory: "certification",
        dateCreated: c.date,
        recognizedBy: {
          "@type": "Organization",
          name: c.issuer,
        },
        about: {
          "@type": "Person",
          name: "Madhu Dadi",
          url: "https://madhudadi.in",
        },
      },
    })),
  };
  return (
    <Section id="certifications" eyebrow="Credentials" title="Certifications.">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(certsJsonLd) }}
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {certifications.map((c) => (
          <a
            key={c.name}
            href={c.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${c.name} certification from ${c.issuer}`}
            className="group flex flex-col rounded-xl border border-border bg-surface/50 p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-surface-elevated/60"
          >
            <p className="text-xs text-muted-foreground">{c.date} · {c.issuer}</p>
            <p className="mt-1 text-sm text-foreground">{c.name}</p>
            <p className="mt-3 inline-flex items-center gap-1 text-xs text-primary opacity-80 group-hover:opacity-100">
              View credential
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">↗</span>
            </p>
          </a>
        ))}
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        All credentials are listed on{" "}
        <a href={LINKEDIN_CERTS_URL} target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
          LinkedIn
        </a>
        .
      </p>
    </Section>
  );
}

/* ---------------- FAQ ---------------- */

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Section id="faq" eyebrow="FAQ" title="Frequently asked questions.">
      <div className="mx-auto max-w-3xl divide-y divide-border rounded-2xl border border-border bg-surface/50">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          const panelId = `faq-panel-${i}`;
          const buttonId = `faq-trigger-${i}`;
          return (
            <div key={f.q}>
              <h3 className="m-0">
                <button
                  id={buttonId}
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                >
                  <span className="font-display text-lg">{f.q}</span>
                  <span aria-hidden className={`text-primary transition-transform ${isOpen ? "rotate-45" : ""}`}>+</span>
                </button>
              </h3>
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                hidden={!isOpen}
                className="px-6 pb-5 text-sm leading-relaxed text-muted-foreground"
              >
                {f.a}
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

/* ---------------- Contact ---------------- */

function Contact() {
  const [prefill, setPrefill] = useState<{ name?: string; email?: string; subject?: string; message?: string }>({});
  useEffect(() => {
    const read = () => {
      try {
        const raw = sessionStorage.getItem("contact-prefill");
        if (!raw) return;
        setPrefill(JSON.parse(raw));
        sessionStorage.removeItem("contact-prefill");
        setTimeout(() => {
          document.querySelector<HTMLInputElement>('input[name="name"]')?.focus();
        }, 400);
      } catch {}
    };
    read();
    window.addEventListener("contact-prefill", read);
    return () => window.removeEventListener("contact-prefill", read);
  }, []);
  return (
    <Section id="contact" eyebrow="Contact" title="Let's work together.">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-6">
          <p className="text-lg leading-relaxed text-muted-foreground">
            Wherever you are in the world, drop a note about your problem and I'll respond within 24 hours
            with whether (and how) I can help.
          </p>
          <ul className="space-y-3 text-sm">
            <ContactRow label="Email" value="madhu.kumar245@gmail.com" href="mailto:madhu.kumar245@gmail.com" />
            <ContactRow label="Phone" value="+91 99854 22444" href="tel:+919985422444" />
            <ContactRow label="Location" value="Visakhapatnam, India" />
          </ul>
          <div className="flex flex-wrap gap-3 pt-2">
            {[
              { l: "GitHub", h: "https://github.com/madhu2456" },
              { l: "LinkedIn", h: "https://www.linkedin.com/in/madhu-dadi-54684531" },
              { l: "Twitter", h: "https://x.com/madhu245" },
              { l: "Blog", h: "https://madhudadi.in/blog" },
            ].map((s) => (
              <a
                key={s.l}
                href={s.h}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-border bg-surface/60 px-4 py-2 text-sm hover:bg-surface-elevated"
              >
                {s.l} ↗
              </a>
            ))}
          </div>
        </div>

        <form
          key={`${prefill.subject ?? ""}|${prefill.message ?? ""}`}
          className="space-y-4 rounded-2xl border border-border bg-surface/60 p-6"
          onSubmit={(e) => {
            e.preventDefault();
            const data = new FormData(e.currentTarget);
            const subject = encodeURIComponent(String(data.get("subject") || "Hello Madhu"));
            const body = encodeURIComponent(
              `From: ${data.get("name")} <${data.get("email")}>\n\n${data.get("message")}`,
            );
            window.location.href = `mailto:madhu.kumar245@gmail.com?subject=${subject}&body=${body}`;
          }}
        >
          <Field label="Name" name="name" required defaultValue={prefill.name} />
          <Field label="Email" name="email" type="email" required defaultValue={prefill.email} />
          <Field label="Subject" name="subject" defaultValue={prefill.subject} />
          <Field label="Message" name="message" textarea required defaultValue={prefill.message} />
          <button
            type="submit"
            className="w-full rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02]"
          >
            Send message
          </button>
        </form>
      </div>
    </Section>
  );
}

function ContactRow({ label, value, href }: { label: string; value: string; href?: string }) {
  const content = (
    <div className="flex items-baseline justify-between gap-4 rounded-xl border border-border bg-surface/40 px-4 py-3">
      <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
      <span className="text-sm">{value}</span>
    </div>
  );
  return href ? (
    <li>
      <a href={href} className="block transition-colors hover:[&_span]:text-primary">
        {content}
      </a>
    </li>
  ) : (
    <li>{content}</li>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  textarea,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  textarea?: boolean;
  defaultValue?: string;
}) {
  const cls =
    "w-full rounded-lg border border-border bg-background/60 px-4 py-3 text-sm outline-none transition-colors focus:border-primary";
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">
        {label}{required && " *"}
      </span>
      {textarea ? (
        <textarea key={defaultValue ?? ""} name={name} required={required} rows={4} className={cls} defaultValue={defaultValue} />
      ) : (
        <input key={defaultValue ?? ""} name={name} type={type} required={required} className={cls} defaultValue={defaultValue} />
      )}
    </label>
  );
}

/* ---------------- Footer ---------------- */

function Footer() {
  const sitemap = [
    { heading: "Explore", links: [
      { l: "About", h: "#about" },
      { l: "Work", h: "#projects" },
      { l: "Services", h: "#services" },
      { l: "Experience", h: "#experience" },
      { l: "FAQ", h: "#faq" },
      { l: "Contact", h: "#contact" },
    ] },
    { heading: "Case studies", links: [
      { l: "Adticks, AI visibility & SEO auditing", h: "/case-studies/adticks" },
      { l: "RAG-powered technical blog", h: "/case-studies/technical-blog" },
      { l: "Async FastAPI Udemy enroller", h: "/case-studies/udemy-enroller-fastapi" },
      { l: "All case studies", h: "/case-studies" },
    ] },
    { heading: "Connect", links: [
      { l: "Email", h: "mailto:madhu.kumar245@gmail.com" },
      { l: "LinkedIn", h: "https://www.linkedin.com/in/madhu-dadi-54684531" },
      { l: "GitHub", h: "https://github.com/madhu2456" },
      { l: "Blog", h: "https://madhudadi.in/blog" },
    ] },
  ];
  return (
    <footer className="border-t border-border bg-surface/30 py-12">
      <div className="mx-auto w-[min(1200px,92%)]">
        <nav aria-label="Footer" className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
          {sitemap.map((col) => (
            <div key={col.heading}>
              <h2 className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">{col.heading}</h2>
              <ul className="space-y-2 text-sm">
                {col.links.map((l) => {
                  const isInternal = l.h.startsWith("/") && !l.h.startsWith("//");
                  const isHash = l.h.startsWith("#");
                  if (isInternal) {
                    return (
                      <li key={l.h}>
                        <Link to={l.h} className="text-foreground/80 underline-offset-4 hover:text-foreground hover:underline">
                          {l.l}
                        </Link>
                      </li>
                    );
                  }
                  return (
                    <li key={l.h}>
                      <a
                        href={l.h}
                        {...(!isHash && !l.h.startsWith("mailto:") ? { target: "_blank", rel: "noreferrer" } : {})}
                        className="text-foreground/80 underline-offset-4 hover:text-foreground hover:underline"
                      >
                        {l.l}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-border/60 pt-6 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Madhu Dadi. Built with intention.</p>
          <p>Visakhapatnam, India · Available worldwide</p>
        </div>
      </div>
    </footer>
  );
}

/* ---------------- Section primitive ---------------- */

function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  const { ref, inView } = useInView<HTMLElement>();
  return (
    <section
      id={id}
      ref={ref}
      className="scroll-mt-28 py-8 transition-all duration-700 md:py-12"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(20px)",
      }}
    >
      <div className="mx-auto w-[min(1200px,92%)]">
        <header className="mb-8 max-w-3xl">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-primary">{eyebrow}</p>
          <h2 className="font-display text-4xl leading-tight md:text-6xl">
            <span className="text-gradient">{title}</span>
          </h2>
        </header>
        {children}
      </div>
    </section>
  );
}
