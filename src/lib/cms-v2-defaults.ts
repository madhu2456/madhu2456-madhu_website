import type { PageContentSchema, ServiceItem } from "./cms-schema";

export const buildV2PageContentDefaults = (): PageContentSchema => {
  return {
    home: {
      seo: {
        title: "Madhu Dadi - AI, RAG & Marketing Analytics Engineer",
        description:
          "Profile of Madhu Dadi, AI & analytics engineer. 9+ years exp across Novartis, redBus, and GroupM (WPP). Expert in LLM/RAG, FastAPI, Next.js, and GA4.",
      },
      heroTitle: "Build reliable AI agents & analytics infrastructure.",
      heroAvailabilityText: "Available for new projects",
      workedAtLabel: "Previously built systems at",
      directAnswer: {
        title: "Who is Madhu Dadi?",
        paragraphs: [
          "Madhu Dadi is an AI and marketing analytics engineer based in Visakhapatnam, India. He builds production LLM/RAG applications, AI agents, FastAPI/Next.js products, and analytics systems.",
          "With 9+ years of experience across Novartis, redBus, GroupM (WPP), and Absolinsoft, he specializes in high-confidence data pipelines, secure workflow automation, and sophisticated search-intent architectures.",
        ],
      },
      faqItems: [
        {
          question: "What is your core tech stack?",
          answer:
            "Python (FastAPI), TypeScript (Next.js, React), SQL (PostgreSQL, BigQuery), AI/LLMs (OpenAI, LangChain, RAG), and analytics tools (GA4, GTM).",
        },
        {
          question: "Do you take freelance projects?",
          answer:
            "Yes, I am available for freelance consulting, part-time engagements, and full-time roles depending on project fit.",
        },
        {
          question: "Are you available for new projects?",
          answer:
            "Yes. I am currently open to full-time roles, freelance consulting, and part-time engagements. You can reach out via the contact form or email me directly.",
        },
        {
          question: "Do you work remotely?",
          answer:
            "Yes. I am remote-first and available worldwide. Relocation is also possible for the right full-time role.",
        },
        {
          question: "What industries have you worked in?",
          answer:
            "Healthcare (Novartis), travel-tech (redBus), media and advertising (GroupM / WPP), SaaS, and education. I adapt quickly to new domains.",
        },
        {
          question: "How can I contact you?",
          answer:
            "Use the contact form on this site, email madhu.kumar245@gmail.com, or message me on LinkedIn. I usually respond within 24 hours.",
        },
        {
          question: "What is your typical project timeline?",
          answer:
            "It depends on scope. A focused RAG or analytics engagement can be 2–6 weeks. A full-stack product build is typically 4–12 weeks. I share a clear timeline after the discovery call.",
        },
        {
          question: "Do you build AI agents and RAG systems?",
          answer:
            "Yes. I build production-grade AI agents with tool calling and guardrails, and RAG systems with hybrid search, cross-encoder reranking, and citation verification.",
        },
      ],
      primaryCta: {
        label: "Contact Me",
        href: "/contact",
        variant: "primary",
      },
      secondaryCta: {
        label: "View Services",
        href: "/services",
        variant: "secondary",
      },
    },
    profile: {
      seo: {
        title: "Madhu Dadi - AI, RAG & Marketing Analytics Engineer",
        description:
          "Profile of Madhu Dadi, AI & analytics engineer. 9+ years exp across Novartis, redBus, and GroupM (WPP). Expert in LLM/RAG, FastAPI, Next.js, and GA4.",
        canonicalPath: "/profile/",
      },
      heroTitle: "Madhu Dadi",
      coreStackGroups: [
        {
          title: "ai",
          items: [
            "OpenAI API",
            "RAG",
            "LangChain",
            "LangSmith",
            "AI Agents",
            "Model Evals",
          ],
        },
        {
          title: "backend",
          items: ["Python", "FastAPI", "SQL", "Postgres", "Redis", "Celery"],
        },
        {
          title: "frontend",
          items: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
        },
        {
          title: "analytics",
          items: [
            "GA4",
            "BigQuery",
            "Campaign Analytics",
            "BI Dashboards",
            "Attribution",
          ],
        },
      ],
    },
    servicesIndex: {
      seo: {
        title: "Services - AI, RAG & Full-Stack Development | Madhu Dadi",
        description:
          "Professional services across AI agent development, RAG systems, marketing analytics, and full-stack product development by Madhu Dadi.",
        canonicalPath: "/services/",
      },
      heroTitle: "Professional Services & Capabilities",
      heroSubtitle:
        "Strategic consulting, engineering, and implementation for AI and analytics.",
      outcomeCallout: {
        title: "Ready to scale your technical capabilities?",
        description:
          "Whether you need a custom LLM integration or robust marketing analytics, I deliver reliable, production-ready systems.",
        cta: {
          label: "Discuss your project",
          href: "/contact",
          variant: "primary",
        },
      },
    },
    caseStudiesIndex: {
      seo: {
        title: "Case Studies & Projects | Madhu Dadi",
        description:
          "Technical case studies, system architecture, and production impact metrics for AI, RAG, and analytics projects by Madhu Dadi.",
        canonicalPath: "/case-studies/",
      },
      heroTitle: "Case Studies & Engineering Projects",
      heroSubtitle:
        "Detailed technical breakdowns of production systems and automated workflows.",
    },
    credentials: {
      seo: {
        title: "Credentials & Certifications | Madhu Dadi",
        description:
          "Verified professional credentials, certifications, and awards for Madhu Dadi. Includes Azure AI, MongoDB, and RAG certifications.",
        canonicalPath: "/credentials/",
      },
      heroTitle: "Verified Credentials & Professional Proof",
      resumeCallout: {
        title: "Curated PDF Resume",
        description:
          "Download a clean, printer-friendly PDF containing comprehensive project history and technical details.",
        href: "/resume.pdf",
      },
      proofLinks: [
        {
          type: "Credential",
          proof: "Certified LLM Security Professional (CLLMSP)",
          linkText: "Red Team Leaders Credential",
          linkUrl:
            "https://courses.redteamleaders.com/exam-completion/18f1aed947dcd334",
        },
        {
          type: "Credential",
          proof: "Ultimate RAG Bootcamp",
          linkText: "Udemy Credential",
          linkUrl:
            "https://www.udemy.com/certificate/UC-23e59045-812e-4b6c-9411-9a74284bf425/",
        },
        {
          type: "Credential",
          proof: "Azure AI Fundamentals",
          linkText: "Microsoft Credential",
          linkUrl:
            "https://learn.microsoft.com/en-us/users/madhudadi-6748/credentials/838cb018adda8dc8",
        },
        {
          type: "Credential",
          proof: "MongoDB Python Developer Path",
          linkText: "MongoDB Credential",
          linkUrl:
            "https://learn.mongodb.com/c/3c7f90f2-9d33-4f89-8d62-f703672b1da7",
        },
        {
          type: "Credential",
          proof: "GitHub Actions Professional",
          linkText: "Credly Badge",
          linkUrl:
            "https://www.credly.com/badges/df23e5a5-91ab-4411-b0e2-f7123bf045ca",
        },
        {
          type: "Credential",
          proof: "Dataiku Core Designer",
          linkText: "Skilljar Verification",
          linkUrl: "https://verify.skilljar.com/c/bm4dvx7mymim",
        },
        {
          type: "Award",
          proof: "Best Performer of the Quarter Q1 2024",
          linkText: "Novartis Context",
          linkUrl: "#awards-recognition",
        },
        {
          type: "Award",
          proof: "Q3 Trailblazer, redBus",
          linkText: "redBus Context",
          linkUrl: "#awards-recognition",
        },
        {
          type: "Award",
          proof: "Performer of the Year 2020–21, WPP NextGen",
          linkText: "GroupM (WPP) Context",
          linkUrl: "#awards-recognition",
        },
      ],
      awards: [
        {
          title: "Best Performer of the Quarter Q1 2024",
          organization: "Novartis",
          description:
            "Awarded for lead engineering role in designing Novartis' global Patient Support warehouse telemetry. Mapped complex patient onboarding workflows, established strict schema validation checks, and delivered highly trusted operations dashboards for senior leaders.",
        },
        {
          title: "Q3 Trailblazer",
          organization: "redBus",
          description:
            "Recognized for architecting redBus' campaign measurement and transaction CAC attribution databases. Unified disparate multi-million dollar marketing campaigns under a structured, source-of-truth SQL analytics layer.",
        },
        {
          title: "Performer of the Year 2020–21",
          organization: "WPP NextGen (GroupM)",
          description:
            "Awarded for exceptional engineering delivery during Google Ads Data Hub (ADH) pilot integrations. Developed secure SQL attribution pipelines, preserving cross-channel insights under GDPR-compliant criteria.",
        },
      ],
      externalProfiles: [
        {
          name: "GitHub",
          url: "https://github.com/madhu2456",
          description:
            "Open-source projects, automation utilities, and code patterns.",
        },
        {
          name: "LinkedIn",
          url: "https://linkedin.com/in/madhu-dadi-54684531",
          description:
            "Professional background, verified credentials, and client references.",
        },
        {
          name: "DEV Community",
          url: "https://dev.to/madhudadi",
          description:
            "Technical articles covering FastAPI, Next.js, and RAG systems.",
        },
        {
          name: "Peerlist",
          url: "https://peerlist.io/madhudadi",
          description:
            "Work verification history, professional profile, and product launches.",
        },
      ],
    },
    contact: {
      seo: {
        title: "Contact Madhu Dadi | AI, RAG & Analytics Consulting",
        description:
          "Contact Madhu Dadi for AI consulting, RAG systems, and marketing analytics. Freelance, full-time roles, FastAPI/Next.js builds. Reply within 24 hours.",
        canonicalPath: "/contact/",
      },
      eyebrow: "Consulting & roles",
      heroTitle: "Contact Madhu Dadi for AI, RAG & Analytics Consulting",
      heroSubtitle:
        "Share your project for AI agents, RAG applications, marketing analytics, or full-stack AI products. Freelance consulting, contract work, and full-time roles welcome.",
      bestFitAreas: [
        "AI agents",
        "RAG applications",
        "marketing analytics",
        "FastAPI/Next.js products",
      ],
      responseTimeText: "I usually respond within 24 hours.",
    },
  };
};

export const upgradeServiceDefaults = (
  service: unknown,
): Partial<ServiceItem> => {
  const source =
    service && typeof service === "object"
      ? (service as Partial<ServiceItem>)
      : {};
  const title = typeof source.title === "string" ? source.title : "Service";
  const shortDescription =
    typeof source.shortDescription === "string" ? source.shortDescription : "";
  const fullDescription =
    typeof source.fullDescription === "string" ? source.fullDescription : "";

  // Minimal defaults so migration doesn't fail; we preserve existing slug/title
  return {
    ...source,
    seoTitle: `${title} | Madhu Dadi`,
    seoDescription: shortDescription || title,
    heroTitle: title,
    heroEyebrow: "Service",
    directAnswerParagraphs: fullDescription ? [fullDescription] : [],
    targetQueries: [],
    audience: [],
    problemsSolved: [],
    capabilityCards: [],
    techStackGroups: [],
    faqs: [],
    proofProjectSlugs: [],
    contactIntent: `Inquiry regarding ${title}`,
    offerCatalog: [],
  };
};
