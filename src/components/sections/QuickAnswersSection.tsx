import Link from "next/link";
import { getPortfolioData } from "@/lib/portfolio-data";

const industryByCompany: Record<string, string> = {
  novartis: "healthcare",
  redbus: "travel-tech",
  groupm: "media and marketing",
  absolinsoft: "software services",
};

export async function QuickAnswersSection() {
  const { profile, sortedExperiences, sortedProjects, sortedServices } =
    await getPortfolioData();
  const projectCount = sortedProjects.length;

  const fullName =
    [profile.firstName, profile.lastName].filter(Boolean).join(" ") ||
    "Madhu Dadi";

  const serviceList = sortedServices
    .map((service) => service.title?.trim())
    .filter((value): value is string => Boolean(value))
    .slice(0, 3);

  const industries = Array.from(
    new Set(
      sortedExperiences
        .map((item) => item.company.toLowerCase())
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
    typeof profile.yearsOfExperience === "number" &&
    profile.yearsOfExperience > 0
      ? `${profile.yearsOfExperience}+ years`
      : "strong multi-domain experience";

  const industryAnswer = industries.length
    ? `${fullName} has delivered work across ${industries.join(", ")} with ${experienceYears} of practical delivery.`
    : `${fullName} has delivered projects across healthcare, e-commerce, and digital platforms with ${experienceYears} of practical delivery.`;

  return (
    <section id="answers" className="py-20 px-6 bg-muted/20">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked Questions (FAQ)
          </h2>
          <p className="text-xl text-muted-foreground">
            Fast answers for hiring and collaboration decisions
          </p>
        </div>

        <dl className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="rounded-xl border bg-card p-6 space-y-3">
            <dt className="text-lg font-semibold">What can Madhu build?</dt>
            <dd className="text-sm text-muted-foreground">{buildAnswer}</dd>
            <dd>
              <Link
                href="/case-studies/"
                className="text-sm text-primary underline"
              >
                Browse case studies
              </Link>
            </dd>
          </div>

          <div className="rounded-xl border bg-card p-6 space-y-3">
            <dt className="text-lg font-semibold">
              Which industries has he worked in?
            </dt>
            <dd className="text-sm text-muted-foreground">{industryAnswer}</dd>
            <dd className="text-xs text-muted-foreground">
              Highlighted projects: {projectCount}
            </dd>
          </div>

          <div className="rounded-xl border bg-card p-6 space-y-3">
            <dt className="text-lg font-semibold">Does he have a blog?</dt>
            <dd className="text-sm text-muted-foreground">
              Yes, Madhu writes a technical blog on AI engineering, RAG systems,
              and full-stack product delivery at madhudadi.in/blog.
            </dd>
            <dd>
              <a
                href="https://madhudadi.in/blog"
                className="text-sm text-primary underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Read articles
              </a>
            </dd>
          </div>

          <div className="rounded-xl border bg-card p-6 space-y-3">
            <dt className="text-lg font-semibold">
              How can I hire or collaborate?
            </dt>
            <dd className="text-sm text-muted-foreground">
              Use the contact section for direct outreach, or connect on
              LinkedIn for project discussions and consulting.
            </dd>
            <dd>
              <Link href="#contact" className="text-sm text-primary underline">
                Contact now
              </Link>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
