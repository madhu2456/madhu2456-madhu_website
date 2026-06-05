export const revalidate = 3600;

export async function GET() {
  return Response.json(
    {
      meta: {
        generatedAt: "2026-06-02T00:00:00Z",
        dateModified: "2026-06-02T00:00:00Z",
        canonical: "https://madhudadi.in/",
        profileUrl: "https://madhudadi.in/profile/",
        llmsTxt: "https://madhudadi.in/llms.txt",
        sitemap: "https://madhudadi.in/sitemap.xml",
      },
      person: {
        name: "Madhu Dadi",
        headline: "Generative AI, RAG & Marketing Analytics Engineer",
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
        ],
      },
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
          category: "FastAPI browser-workflow automation",
          summary:
            "A private FastAPI automation case study exploring async task queues, Playwright workflow orchestration, bounded concurrency, secure session-state handling, telemetry logging, and background processing.",
        },
      ],
    },
    {
      headers: {
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
        "X-Robots-Tag": "index, follow, max-snippet:-1",
      },
    }
  );
}
