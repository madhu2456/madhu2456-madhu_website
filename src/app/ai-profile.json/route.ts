import { getPortfolioData } from "@/lib/portfolio-data";

export async function GET() {
  const {
    sortedCertifications,
    sortedServices,
    sortedProjects,
    portfolioLastUpdatedAt,
  } = await getPortfolioData();
  const lastUpdatedStr = portfolioLastUpdatedAt
    ? new Date(portfolioLastUpdatedAt).toISOString()
    : "2026-06-06T00:00:00Z";

  return Response.json({
    meta: {
      generatedAt: lastUpdatedStr,
      dateModified: lastUpdatedStr,
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
        "Madhu Dadi is an AI and marketing analytics engineer based in Visakhapatnam, India. He has 9+ years of experience across Novartis, redBus, GroupM (WPP), and Absolinsoft, and builds production LLM/RAG applications, AI agents, FastAPI/Next.js products, and analytics systems.",
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
      contactPoints: [
        {
          contactType: "Consulting and projects",
          email: "madhu.kumar245@gmail.com",
          url: "https://madhudadi.in/contact/",
        },
      ],
    },
    certifications: sortedCertifications.map((certification) => ({
      name: certification.name,
      issuer: certification.issuer,
      issueDate: certification.issueDate,
      credentialId: certification.credentialId,
      credentialUrl: certification.credentialUrl,
      description: certification.description,
    })),
    services: sortedServices.map((service) => ({
      title: service.title,
      url: `https://madhudadi.in/services/${service.slug}/`,
      description: service.shortDescription,
    })),
    caseStudies: sortedProjects.map((project) => ({
      name: project.title,
      url: `https://madhudadi.in/case-studies/${project.slug}/`,
      category: project.category,
      summary: project.impactSummary || project.tagline,
    })),
  });
}
