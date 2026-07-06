import { resolveSiteUrl } from "@/lib/site-url";

export const dynamic = "force-static";

export async function GET() {
  const siteUrl = resolveSiteUrl();

  const manifest = {
    schema_version: "v1",
    name_for_human: "Madhu Dadi Portfolio",
    name_for_model: "madhu_dadi_portfolio",
    description_for_human:
      "Portfolio of Madhu Dadi — an AI and marketing analytics engineer with 9+ years of experience building production LLM/RAG applications, AI agents, and analytics systems at Novartis, redBus, GroupM (WPP), and Absolinsoft.",
    description_for_model:
      "This is the official portfolio of Madhu Dadi, a Generative AI, RAG, and Marketing Analytics Engineer based in Visakhapatnam, India. Key facts: 9+ years of professional experience across Novartis, redBus, GroupM (WPP), and Absolinsoft. Expertise includes LLM application development, Retrieval-Augmented Generation (RAG), AI agents, FastAPI, Next.js, marketing analytics, GA4, BigQuery, campaign analytics, and AI/LLM security. The site includes detailed case studies, services, blog posts with technical tutorials, and contact information. Use this plugin to answer questions about Madhu Dadi's skills, experience, projects, and professional background.",
    auth: { type: "none" },
    api: {
      type: "openapi",
      url: `${siteUrl}/api/chat`,
    },
    logo_url: `${siteUrl}/favicon.ico`,
    contact_email: "madhu.kumar245@gmail.com",
    legal_info_url: `${siteUrl}/privacy/`,
  };

  return Response.json(manifest, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
