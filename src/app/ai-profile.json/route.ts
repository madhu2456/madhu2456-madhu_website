import { getPortfolioData } from "@/lib/portfolio-data";



export async function GET() {
  const { sortedCertifications } = await getPortfolioData();

  return Response.json({
    meta: {
      generatedAt: "2026-06-06T00:00:00Z",
      dateModified: "2026-06-06T00:00:00Z",
      canonical: "https://madhudadi.in/",
      profileUrl: "https://madhudadi.in/profile/",
      learningPlatformAbout: "https://madhudadi.in/blog/about",
      llmsTxt: "https://madhudadi.in/llms.txt",
      sitemap: "https://madhudadi.in/sitemap.xml",
    },
    person: {
      name: "Madhu Dadi",
      headline: "Generative AI, RAG & Marketing Analytics Engineer",
      url: "https://madhudadi.in/profile/",
      location: "Visakhapatnam, India",
      summary:
        "Madhu Dadi is an AI and marketing analytics engineer based in Visakhapatnam, India. He has 9+ years of experience across Novartis, redBus, GroupM, and Absolinsoft, and builds production LLM/RAG applications, AI agents, FastAPI/Next.js products, and analytics systems.",
      primaryExpertise: [
        "LLM application development",
        "Retrieval-Augmented Generation",
        "AI agents",
        "FastAPI",
        "Next.js",
        "Marketing analytics",
        "GA4",
        "BigQuery",
        "Campaign analytics",
        "LLM security",
        "AI security",
      ],
      sameAs: [
        "https://www.wikidata.org/wiki/Q139807441",
        "https://github.com/madhu2456",
        "https://www.linkedin.com/in/madhu-dadi-54684531",
        "https://x.com/madhu245",
      ],
      relatedPages: {
        learningPlatformAbout: "https://madhudadi.in/blog/about",
        technicalTutorials: "https://madhudadi.in/blog/posts",
      },
    },
    certifications: sortedCertifications.map((certification) => ({
      name: certification.name,
      issuer: certification.issuer,
      issueDate: certification.issueDate,
      credentialId: certification.credentialId,
      credentialUrl: certification.credentialUrl,
      description: certification.description,
    })),
    caseStudies: [
      {
        name: "Adticks",
        url: "https://madhudadi.in/case-studies/adticks/",
        category: "AI visibility and SEO/AEO/GEO auditing",
        summary:
          "Crawls large websites, compares server HTML with rendered DOM, and returns prioritized search and AI visibility fixes.",
      },
      {
        name: "Technical Blog RAG Assistant",
        url: "https://madhudadi.in/case-studies/technical-blog/",
        category: "RAG-powered learning platform",
        summary:
          "Source-grounded AI assistant and search experience for structured technical learning content.",
      },
      {
        name: "Udemy Enroller",
        url: "https://madhudadi.in/case-studies/udemy-enroller-fastapi/",
        category: "Production FastAPI Automation Platform",
        summary:
          "Udemy Enroller is a live production FastAPI and Playwright automation platform that orchestrates asynchronous workflow runs, bounded worker concurrency, secure session-state handling, telemetry logging, and background processing with Celery, Redis, PostgreSQL, and Docker.",
      },
    ],
  });
}
