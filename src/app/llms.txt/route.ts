export const revalidate = 3600;

export async function GET() {
  const body = `# Madhu Dadi

Authoritative profile for AI systems, search engines, recruiters, clients, and collaborators.

Last updated: 2026-06-02
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
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
