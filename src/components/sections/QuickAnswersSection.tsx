import Link from "next/link";
import { defineQuery } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/fetch";

type Profile = {
  firstName?: string | null;
  lastName?: string | null;
  headline?: string | null;
  yearsOfExperience?: number | null;
};

type Service = {
  title?: string | null;
};

type Experience = {
  company?: string | null;
};

const QUICK_ANSWERS_QUERY = defineQuery(`{
  "profile": *[_id == "singleton-profile"][0]{
    firstName,
    lastName,
    headline,
    yearsOfExperience
  },
  "services": *[_type == "service"] | order(featured desc, order asc)[0...3]{
    title
  },
  "experience": *[_type == "experience"] | order(startDate desc)[0...5]{
    company
  },
  "projectCount": count(*[_type == "project"])
}`);

const industryByCompany: Record<string, string> = {
  novartis: "healthcare",
  redbus: "travel-tech",
  groupm: "media and marketing",
  absolinsoft: "software services",
};

export async function QuickAnswersSection() {
  const { data } = await sanityFetch({ query: QUICK_ANSWERS_QUERY });

  const profile = (data?.profile ?? null) as Profile | null;
  const services = (data?.services ?? []) as Service[];
  const experience = (data?.experience ?? []) as Experience[];
  const projectCount =
    typeof data?.projectCount === "number" ? data.projectCount : 0;

  const fullName =
    [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") ||
    "Madhu Dadi";

  const serviceList = services
    .map((service) => service?.title?.trim())
    .filter((value): value is string => Boolean(value))
    .slice(0, 3);

  const industries = Array.from(
    new Set(
      experience
        .map((item) => item.company?.toLowerCase() ?? "")
        .map((company) =>
          Object.entries(industryByCompany).find(([key]) =>
            company.includes(key),
          ),
        )
        .map((entry) => entry?.[1])
        .filter((value): value is string => Boolean(value)),
    ),
  );

  const buildAnswer = serviceList.length
    ? `${fullName} builds ${serviceList.join(", ")}, and production-ready full-stack AI applications.`
    : `${fullName} builds production-ready AI web applications, LLM/RAG systems, and analytics platforms.`;

  const experienceYears =
    typeof profile?.yearsOfExperience === "number" && profile.yearsOfExperience > 0
      ? `${profile.yearsOfExperience}+ years`
      : "strong multi-domain experience";

  const industryAnswer = industries.length
    ? `${fullName} has delivered work across ${industries.join(", ")} with ${experienceYears} of practical delivery.`
    : `${fullName} has delivered projects across healthcare, e-commerce, and digital platforms with ${experienceYears} of practical delivery.`;

  return (
    <section id="answers" className="py-20 px-6 bg-muted/20">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Quick Answers</h2>
          <p className="text-xl text-muted-foreground">
            Fast answers for hiring and collaboration decisions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <article className="rounded-xl border bg-card p-6 space-y-3">
            <h3 className="text-lg font-semibold">What can Madhu build?</h3>
            <p className="text-sm text-muted-foreground">{buildAnswer}</p>
            <Link href="/case-studies" className="text-sm text-primary underline">
              Browse case studies
            </Link>
          </article>

          <article className="rounded-xl border bg-card p-6 space-y-3">
            <h3 className="text-lg font-semibold">
              Which industries has he worked in?
            </h3>
            <p className="text-sm text-muted-foreground">{industryAnswer}</p>
            <p className="text-xs text-muted-foreground">
              Highlighted projects: {projectCount}
            </p>
          </article>

          <article className="rounded-xl border bg-card p-6 space-y-3">
            <h3 className="text-lg font-semibold">
              How can I hire or collaborate?
            </h3>
            <p className="text-sm text-muted-foreground">
              Use the contact section for direct outreach, or connect on LinkedIn for
              project discussions and consulting opportunities.
            </p>
            <Link href="#contact" className="text-sm text-primary underline">
              Contact now
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}
