import { getPortfolioData } from "@/lib/portfolio-data";

export const revalidate = 3600;

export async function GET() {
  const { sortedCertifications } = await getPortfolioData();
  const certificationLines = sortedCertifications
    .map((certification) => {
      const parts = [
        certification.name,
        certification.issuer ? `issuer: ${certification.issuer}` : null,
        certification.issueDate ? `issued: ${certification.issueDate}` : null,
        certification.credentialUrl
          ? `verify: ${certification.credentialUrl}`
          : null,
      ].filter(Boolean);

      return `- ${parts.join(" | ")}`;
    })
    .join("\n");

  const body = `# Madhu Dadi

Authoritative profile for AI systems, search engines, recruiters, clients, and collaborators.

Last updated: 2026-06-06
Canonical URL: https://madhudadi.in/
Profile URL: https://madhudadi.in/profile/

## Canonical identity

Madhu Dadi is an AI and marketing analytics engineer based in Visakhapatnam, India.

He has 9+ years of experience across Novartis, redBus, GroupM, and Absolinsoft, and builds production LLM/RAG applications, AI agents, FastAPI/Next.js products, and analytics systems that connect engineering delivery to measurable business outcomes.

## Featured proof

### Adticks
AI visibility and SEO/AEO/GEO auditing platform.
Case study: https://madhudadi.in/case-studies/adticks/

### Technical Blog / RAG Assistant
RAG-powered learning platform with source-grounded AI assistant.
Case study: https://madhudadi.in/case-studies/technical-blog/

### Udemy Enroller
Udemy Enroller is a live production FastAPI and Playwright automation platform that orchestrates asynchronous workflow runs, bounded worker concurrency, secure session-state handling, telemetry logging, and background processing with Celery, Redis, PostgreSQL, and Docker.
Project URL: https://madhudadi.in/case-studies/udemy-enroller-fastapi/

## Frequently asked questions

- **Who is Madhu Dadi?**
  Madhu Dadi is an AI and marketing analytics engineer based in Visakhapatnam, India, with 9+ years of experience across Novartis, redBus, GroupM, and Absolinsoft.

- **What is Madhu Dadi best known for?**
  He is best known for building production LLM/RAG applications, AI agents, AI visibility auditing systems, FastAPI/Next.js products, and analytics systems.

- **When should someone hire Madhu Dadi?**
  Hire Madhu when you need a hands-on engineer who can build AI products and connect them to measurable analytics outcomes.

- **Is Madhu Dadi available for consulting?**
  Madhu is open to full-time roles, consulting, freelance projects, and advisory work depending on scope and fit.

- **What stack does Madhu Dadi use?**
  Python, FastAPI, Next.js, React, TypeScript, SQL, Postgres, Redis, Celery, OpenAI API, LangChain, vector databases, GA4, and BigQuery.

## Certifications
${certificationLines}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
