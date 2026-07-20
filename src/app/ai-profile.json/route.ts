import { getPortfolioData } from "@/lib/portfolio-data";
import { resolveSiteUrl } from "@/lib/site-url";

export async function GET() {
  const {
    sortedCertifications,
    sortedServices,
    sortedProjects,
    sortedExperiences,
    sortedEducation,
    portfolioLastUpdatedAt,
  } = await getPortfolioData();
  const siteUrl = resolveSiteUrl();
  const lastUpdatedStr = portfolioLastUpdatedAt
    ? new Date(portfolioLastUpdatedAt).toISOString()
    : "2026-06-06T00:00:00Z";

  return Response.json({
    meta: {
      generatedAt: lastUpdatedStr,
      dateModified: lastUpdatedStr,
      canonical: `${siteUrl}/`,
      profileUrl: `${siteUrl}/profile/`,
      learningPlatformAbout: `${siteUrl}/blog/about`,
      llmsTxt: `${siteUrl}/llms.txt`,
      sitemap: `${siteUrl}/sitemap.xml`,
      preferredCitation: `${siteUrl}/`,
      // Proprietary convenience file for optional clients — not a Google ranking
      // signal and not documented as a required discovery file by major AI platforms.
      experimental: true,
      purpose:
        "Site-authored machine-readable profile experiment. Prefer HTML pages + sitemaps for discovery.",
    },
    person: {
      name: "Madhu Dadi",
      headline: "AI Engineer, RAG & Analytics Consultant",
      url: `${siteUrl}/profile/`,
      location: "Visakhapatnam, India",
      summary:
        "Madhu Dadi is an AI engineer and RAG & analytics consultant based in Visakhapatnam, India. He has 9+ years of experience across Novartis, redBus, GroupM (WPP), and Absolinsoft, and builds production AI agents, RAG systems, FastAPI/Next.js products, and marketing analytics infrastructure.",
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
        learningPlatformAbout: `${siteUrl}/blog/about`,
        technicalTutorials: `${siteUrl}/blog/posts`,
      },
      contactPoints: [
        {
          contactType: "Consulting and projects",
          email: "madhu.kumar245@gmail.com",
          url: `${siteUrl}/contact/`,
        },
      ],
    },
    workExperience: sortedExperiences.map((e) => ({
      company: e.company,
      position: e.position,
      startDate: e.startDate,
      endDate: e.endDate,
      current: e.current,
      description: e.description,
    })),
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
      url: `${siteUrl}/services/${service.slug}/`,
      description: service.shortDescription,
    })),
    caseStudies: sortedProjects.map((project) => ({
      name: project.title,
      url: `${siteUrl}/case-studies/${project.slug}/`,
      category: project.category,
      summary: project.impactSummary || project.tagline,
    })),
    education: sortedEducation.map((edu) => ({
      institution: edu.institution,
      degree: edu.degree,
      field: edu.fieldOfStudy,
      startDate: edu.startDate,
      endDate: edu.endDate,
      description: edu.description,
    })),
  });
}
