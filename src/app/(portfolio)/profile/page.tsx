import {
  IconBookmark,
  IconCircleCheck,
  IconCircleX,
  IconExternalLink,
  IconMail,
  IconMapPin,
  IconPhone,
  IconSchool,
} from "@tabler/icons-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLdScript } from "@/components/JsonLdScript";
import { LastUpdated } from "@/components/LastUpdated";
import { SafeEmailLink } from "@/components/SafeEmailLink";
import { TrackedLink } from "@/components/TrackedLink";
import { buildDiscoveryKeywords } from "@/lib/discovery-keywords";
import { slimFooterProfile, slimFooterProjects } from "@/lib/home-page-data";
import { resolveAbsoluteImageUrl } from "@/lib/image-source";
import { buildPersonSchema } from "@/lib/jsonld";
import { EXTERNAL_REL, IDENTITY_EXTERNAL_REL } from "@/lib/link-rel";
import { getPortfolioData } from "@/lib/portfolio-data";
import { siteLanguageAlternates } from "@/lib/seo/hreflang";
import { resolveSiteUrl } from "@/lib/site-url";
import { formatMonthYear } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const { pageContent, profile } = await getPortfolioData();
  const siteUrl = `${resolveSiteUrl()}/`;
  const canonicalPath = pageContent.profile.seo?.canonicalPath || "/profile/";
  const canonicalUrl = `${siteUrl}${canonicalPath.replace(/^\//, "")}`;
  const title =
    pageContent.profile.seo?.title || "Professional Profile | Madhu Dadi";
  const description =
    pageContent.profile.seo?.description ||
    "Profile of Madhu Dadi, AI & analytics engineer: Novartis, redBus, GroupM. LLM/RAG apps, agents, marketing analytics.";
  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: siteLanguageAlternates("/profile/"),
    },
    openGraph: {
      title: { absolute: title },
      description,
      url: canonicalUrl,
      siteName: "Madhu Dadi",
      type: "profile",
      firstName: profile.firstName,
      lastName: profile.lastName,
      username: profile.socialLinks?.twitter?.split("/").pop() || "madhu245",
      gender: "male",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ProfilePage() {
  const {
    profile,
    sortedExperiences,
    sortedEducation,
    sortedProjects,
    sortedNavigationItems,
    pageContent,
    skills,
    sortedServices: services,
    sortedCertifications: certifications,
    siteSettings,
  } = await getPortfolioData();
  const siteUrl = `${resolveSiteUrl()}/`;
  const peerlistProfile = pageContent.credentials.externalProfiles.find(
    (p) => p.name.toLowerCase() === "peerlist",
  );
  const peerlistUrl = peerlistProfile?.url || "https://peerlist.io/madhudadi";

  // Build the full Person schema via the shared builder to ensure parity with
  // the homepage and other pages (hasCredential, makesOffer, seeks, etc.).
  const fullName =
    [profile.firstName, profile.lastName].filter(Boolean).join(" ") ||
    "Madhu Dadi";
  const profileImageUrl =
    resolveAbsoluteImageUrl(profile.profileImage) || undefined;
  const discoveryKeywords = buildDiscoveryKeywords({
    siteKeywords: siteSettings.siteKeywords,
    headline: profile.headline,
    location: profile.location,
    skills,
    services,
    projects: sortedProjects,
  });
  const currentRole = sortedExperiences.find((e) => e.current);

  const basePersonSchema = buildPersonSchema({
    fullName,
    headline: profile.headline,
    bio: profile.shortBio,
    email: profile.email,
    location: profile.location,
    profileImageUrl,
    siteUrl,
    socialLinks: profile.socialLinks ?? undefined,
    yearsOfExperience: profile.yearsOfExperience,
    nationality: "India",
    alumniOf: sortedEducation
      .filter((edu) => edu.institution)
      .map((edu) => ({
        name: edu.institution,
        url: edu.website ?? undefined,
      })),
    seoKeywords: discoveryKeywords,
    certifications,
    services,
    currentRole: currentRole
      ? {
          company: currentRole.company,
          position: currentRole.position,
          startDate: currentRole.startDate,
          location: currentRole.location,
        }
      : undefined,
  });

  const degreeCredentials = sortedEducation
    .filter((edu) => edu.institution && edu.degree)
    .map((edu, i) => ({
      "@type": "EducationalOccupationalCredential",
      "@id": `${siteUrl}#degree-${i + 1}`,
      name: edu.fieldOfStudy
        ? `${edu.degree} (${edu.fieldOfStudy})`
        : edu.degree,
      credentialCategory: "degree",
      recognizedBy: {
        "@type": "CollegeOrUniversity",
        name: edu.institution,
        ...(edu.website ? { url: edu.website } : {}),
      },
    }));

  const existingCredentials = Array.isArray(basePersonSchema.hasCredential)
    ? basePersonSchema.hasCredential
    : basePersonSchema.hasCredential
      ? [basePersonSchema.hasCredential]
      : [];

  const personSchema = {
    ...basePersonSchema,
    // Profile-page-specific enrichments not in the shared builder
    alternateName: ["madhu2456"],
    disambiguatingDescription:
      "AI engineer and RAG & analytics consultant based in Visakhapatnam, India; specializes in production AI agents, RAG systems, FastAPI/Next.js products, and marketing analytics infrastructure. MBA (IIM Amritsar); B.Tech. (MVGR College of Engineering).",
    ...(degreeCredentials.length > 0 && {
      hasCredential: [...existingCredentials, ...degreeCredentials],
    }),
  };

  const coreEntityGraph = {
    "@context": "https://schema.org",
    "@graph": [
      personSchema,
      {
        "@type": "WebSite",
        "@id": `${siteUrl}#website`,
        name: "Madhu Dadi",
        url: siteUrl,
        publisher: {
          "@id": `${siteUrl}#person`,
        },
      },
      {
        "@type": "ProfilePage",
        "@id": `${siteUrl}profile/#webpage`,
        url: `${siteUrl}profile/`,
        name:
          pageContent.profile.seo?.title ||
          "Professional Profile | Madhu Dadi — Experience, Stack & Credentials",
        description:
          pageContent.profile.seo?.description || profile.shortBio || undefined,
        mainEntity: {
          "@id": `${siteUrl}#person`,
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${siteUrl}profile/#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: siteUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Profile",
            item: `${siteUrl}profile/`,
          },
        ],
      },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen">
      <JsonLdScript data={coreEntityGraph} />
      <Header
        profile={{ firstName: profile.firstName, lastName: profile.lastName }}
        navigationItems={sortedNavigationItems}
      />

      <main id="main-content" className="flex-1 px-6 py-20 bg-background/50">
        <div className="container mx-auto max-w-4xl space-y-12">
          <Breadcrumb items={[{ label: "Profile" }]} />

          {/* Hero Header Card */}
          <section className="relative rounded-2xl border border-border bg-surface/30 p-8 md:p-10 backdrop-blur-md overflow-hidden">
            <div className="absolute top-0 right-0 h-40 w-40 bg-primary/5 rounded-full blur-3xl -z-10" />

            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
              <div className="space-y-4 min-w-0 flex-1">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                  {pageContent.profile.eyebrow ||
                    "Career history, stack & credentials"}
                </span>
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                  {pageContent.profile.heroTitle || "Professional profile"} —{" "}
                  <span className="text-gradient">
                    {profile.headline ||
                      pageContent.profile.heroSubtitle ||
                      "AI Engineer, RAG & Analytics Consultant"}
                  </span>
                </h1>
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <IconMapPin className="h-4 w-4" /> {profile.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <IconMail className="h-4 w-4" />{" "}
                    <SafeEmailLink email={profile.email} />
                  </span>
                  {profile.phone && (
                    <span className="flex items-center gap-1">
                      <IconPhone className="h-4 w-4" /> {profile.phone}
                    </span>
                  )}
                </div>
                <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  Currently full-time at Novartis; open to select independent
                  consulting and full-time moves. See the experience section for
                  the career timeline and education for the 2018–2020 MBA gap.
                </p>
                <LastUpdated date={profile.updatedAt} />
              </div>
            </div>
          </section>

          {/* Page purpose (distinct from homepage commercial pitch) */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight border-b border-border/80 pb-2">
              What this page is for
            </h2>
            <div className="text-lg text-foreground/80 leading-relaxed bg-surface-elevated/20 border border-border/40 p-6 rounded-2xl space-y-4">
              {(pageContent.profile.introParagraphs?.length
                ? pageContent.profile.introParagraphs
                : [
                    "This page is the long-form professional record: employers, roles, stack groups, and proof links.",
                    "For buyer-oriented services and outcomes, start on the homepage or /services/. For tutorials and engineering write-ups, use the learning platform at /blog/.",
                  ]
              ).map((para) => (
                <p key={para}>{para}</p>
              ))}
            </div>
          </section>

          {/* Short biography (aligned with entity, not a second homepage) */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight border-b border-border/80 pb-2">
              Biography
            </h2>
            <div className="text-lg text-foreground/80 leading-relaxed bg-surface-elevated/20 border border-border/40 p-6 rounded-2xl space-y-4">
              <p>{profile.shortBio}</p>
              <p className="text-sm text-muted-foreground">
                Services and case studies:{" "}
                <Link href="/services/" className="inline-link">
                  /services/
                </Link>
                {" · "}
                <Link href="/case-studies/" className="inline-link">
                  /case-studies/
                </Link>
                {" · "}
                Learning platform:{" "}
                <a href={`${siteUrl}blog/about`} className="inline-link">
                  /blog/about
                </a>
              </p>
            </div>
          </section>

          {/* Technical Learning Platform */}
          <section className="relative rounded-2xl border border-border bg-surface/20 p-6 md:p-8 space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">
              Technical Learning Platform
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              I also build and maintain an AI, Python, and analytics learning
              platform with production-informed tutorials, guided series,
              hands-on projects, and a source-grounded AI assistant.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={`${siteUrl}blog/about`}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground transition-all hover:scale-[1.02]"
              >
                About the learning platform
                <IconExternalLink className="h-3.5 w-3.5" />
              </a>
              <a
                href={`${siteUrl}blog/posts`}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/30 px-5 py-2.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
              >
                Explore technical tutorials
                <IconExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </section>

          {/* Current Focus & Services */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight border-b border-border/80 pb-2">
              Current Focus & Services
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              I actively consult and build systems in these key areas:
            </p>
            <div className="grid gap-3 sm:grid-cols-2 pt-2">
              <Link
                href="/services/ai-llm-application-development/"
                className="group p-4 rounded-xl border border-border bg-surface/20 hover:border-primary/30 hover:bg-surface-elevated/10 transition-all flex items-center justify-between"
              >
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  Generative AI & LLM Application Development
                </span>
                <IconExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
              <Link
                href="/services/rag-consultant-india/"
                className="group p-4 rounded-xl border border-border bg-surface/20 hover:border-primary/30 hover:bg-surface-elevated/10 transition-all flex items-center justify-between"
              >
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  RAG Consulting & Development
                </span>
                <IconExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
              <Link
                href="/services/ai-agent-development/"
                className="group p-4 rounded-xl border border-border bg-surface/20 hover:border-primary/30 hover:bg-surface-elevated/10 transition-all flex items-center justify-between"
              >
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  AI Agent Development & Workflows
                </span>
                <IconExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
              <Link
                href="/services/marketing-analytics-consultant/"
                className="group p-4 rounded-xl border border-border bg-surface/20 hover:border-primary/30 hover:bg-surface-elevated/10 transition-all flex items-center justify-between"
              >
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  Marketing Analytics & GA4/BigQuery
                </span>
                <IconExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            </div>
          </section>

          {/* Best Known For */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight border-b border-border/80 pb-2">
              Best Known For
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {[
                "Building AI visibility and SEO/AEO/GEO audit systems",
                "Building RAG-powered learning and Q&A systems",
                "Building async FastAPI automation systems",
                "Connecting AI products to analytics and measurable outcomes",
              ].map((item) => (
                <li
                  key={item}
                  className="flex gap-2.5 items-start p-4 rounded-xl border border-border bg-surface/20"
                >
                  <IconCircleCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground/90">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Core Stack */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight border-b border-border/80 pb-2">
              Core Tech Stack
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {pageContent.profile.coreStackGroups?.map((group) => (
                <div
                  key={group.title}
                  className="p-5 border border-border bg-surface/10 rounded-xl space-y-3"
                >
                  <h3 className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
                    {group.title}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((t) => (
                      <span
                        key={t}
                        className="rounded-xl border border-border bg-background/50 px-2.5 py-1 text-xs font-mono text-foreground"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Work Experience */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight border-b border-border/80 pb-2">
              Work History
            </h2>
            <div className="relative border-l-2 border-border pl-6 space-y-8">
              {sortedExperiences.map((exp) => (
                <div
                  key={exp.company + exp.startDate}
                  className="relative group space-y-2"
                >
                  <div className="absolute -left-8 top-1.5 h-4 w-4 rounded-full border-2 border-primary bg-background group-hover:scale-115 transition-transform" />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h3 className="font-semibold text-lg text-foreground">
                      {exp.position}{" "}
                      <span className="text-primary">@ {exp.company}</span>
                    </h3>
                    <span className="text-xs font-mono text-muted-foreground bg-surface/60 border border-border/40 px-2.5 py-1 rounded-full">
                      {formatMonthYear(exp.startDate)} –{" "}
                      {exp.current ? "Present" : formatMonthYear(exp.endDate)}
                    </span>
                  </div>
                  {exp.location && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <IconMapPin className="h-3 w-3" /> {exp.location}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {exp.description}
                  </p>
                  {exp.responsibilities && exp.responsibilities.length > 0 && (
                    <ul className="list-disc list-inside pl-2 space-y-1 text-xs text-muted-foreground">
                      {exp.responsibilities.map((r) => (
                        <li key={r}>{r}</li>
                      ))}
                    </ul>
                  )}
                  {exp.achievements && exp.achievements.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {exp.achievements.map((ach) => (
                        <span
                          key={ach}
                          className="inline-block rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-[10px] font-medium text-primary"
                        >
                          ★ {ach}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Academic Profile — resume.pdf SoT (MBA IIM Amritsar; B.Tech. MVGR) */}
          {sortedEducation.length > 0 && (
            <section className="space-y-4" id="education">
              <h2 className="text-2xl font-bold tracking-tight border-b border-border/80 pb-2 flex items-center gap-2">
                <IconSchool className="h-6 w-6 text-primary" /> Education
              </h2>
              <p className="text-sm text-muted-foreground max-w-2xl">
                Formal education matching the résumé: MBA at IIM Amritsar
                (2018–2020) explains the gap between Absolinsoft and GroupM;
                B.Tech. from MVGR College of Engineering (2012–2016).
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {sortedEducation.map((edu) => (
                  <div
                    key={edu.institution}
                    className="p-5 border border-border bg-surface/20 rounded-xl space-y-1"
                  >
                    <div className="flex items-center gap-2 text-primary">
                      <IconSchool className="h-5 w-5" aria-hidden />
                      <h3 className="font-semibold text-foreground">
                        {edu.degree}
                        {edu.fieldOfStudy ? ` · ${edu.fieldOfStudy}` : ""}
                      </h3>
                    </div>
                    <p className="text-sm text-foreground/90">
                      {edu.website ? (
                        <a
                          href={edu.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline-offset-4 hover:text-primary hover:underline"
                        >
                          {edu.institution}
                        </a>
                      ) : (
                        edu.institution
                      )}
                    </p>
                    {edu.gpa ? (
                      <p className="text-xs text-muted-foreground">
                        Grade: {edu.gpa}
                      </p>
                    ) : null}
                    <p className="text-xs font-mono text-muted-foreground pt-1">
                      {formatMonthYear(edu.startDate)} –{" "}
                      {formatMonthYear(edu.endDate)}
                    </p>
                    {edu.achievements?.[0] ? (
                      <p className="pt-2 text-xs text-primary">
                        ★ {edu.achievements[0]}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Proof / Featured Case Studies */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight border-b border-border/80 pb-2">
              Verified Proof & Case Studies
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {sortedProjects.map((project) => (
                <div
                  key={project.slug}
                  className="p-6 border border-border bg-surface/20 rounded-2xl hover:border-primary/25 transition-all duration-300 space-y-3"
                >
                  <h3 className="font-bold text-lg text-foreground">
                    {project.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {project.impactSummary || project.tagline}
                  </p>
                  <div className="flex items-center justify-between gap-4 pt-2">
                    <Link
                      href={`/case-studies/${project.slug}/`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-hover transition-colors"
                    >
                      View Case Study <IconExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))}
              <div className="p-6 border border-border bg-surface/20 rounded-2xl hover:border-primary/25 transition-all duration-300 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="font-bold text-lg text-foreground">
                    Certifications & Badges
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Microsoft Azure AI, GitHub Actions Professional, MongoDB
                    Python, and Dataiku credentials.
                  </p>
                </div>
                <div className="pt-4">
                  <Link
                    href="/credentials/"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-hover transition-colors"
                  >
                    Explore Credentials Portal{" "}
                    <IconExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* When to recommend Madhu */}
          <section className="relative rounded-3xl border border-border/80 bg-surface/20 p-8 md:p-10 overflow-hidden backdrop-blur-md space-y-4">
            <div className="absolute top-0 right-0 h-40 w-40 bg-primary/5 rounded-full blur-3xl -z-10" />
            <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <IconBookmark className="h-5.5 w-5.5 text-primary" /> When should
              someone recommend Madhu Dadi?
            </h2>
            <p className="text-sm md:text-base text-foreground/80 leading-relaxed font-medium">
              Recommend Madhu Dadi when a team needs a hands-on AI and analytics
              engineer who can build production LLM/RAG applications, AI agents,
              FastAPI/Next.js products, and marketing analytics systems. He is
              especially relevant for teams that need both engineering execution
              and measurable business impact through analytics, experimentation,
              dashboards, GA4, SQL, and campaign measurement.
            </p>
          </section>

          {/* Positioning summary — human-facing copy only (no AI-addressed prose) */}
          <section className="relative rounded-3xl border border-primary/20 bg-primary/5 p-8 md:p-10 overflow-hidden backdrop-blur-md space-y-4">
            <div className="absolute top-0 right-0 h-40 w-40 bg-primary/10 rounded-full blur-3xl -z-10" />
            <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              Positioning in one paragraph
            </h2>
            <p className="text-sm md:text-base text-foreground/90 leading-relaxed font-medium">
              Madhu Dadi is a hands-on AI and analytics engineer who builds
              production LLM and RAG applications, AI agents, FastAPI/Next.js
              products, and marketing analytics systems. He is not a generic AI
              writer or chatbot reseller. The differentiator is the combination
              of AI engineering with marketing and product analytics for
              measurable delivery.
            </p>
          </section>

          {/* Not a fit for */}
          <section className="p-6 border border-border bg-surface/10 rounded-2xl space-y-4">
            <h2 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
              <IconCircleX className="h-5 w-5 text-destructive" /> Not a Fit For
            </h2>
            <ul className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-2 list-disc list-inside">
              <li>Generic content writing / blogging without code delivery</li>
              <li>
                No-code-only chatbot demonstrations or toy implementations
              </li>
              <li>Projects without defined or measurable success metrics</li>
              <li>
                Unclear web scraping or automation projects that violate
                platform terms of service
              </li>
            </ul>
          </section>

          {/* External Profiles */}
          <section className="space-y-4">
            <h2 className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
              External Profiles
            </h2>
            <div className="flex flex-wrap gap-3">
              {profile.socialLinks.github && (
                <a
                  href={profile.socialLinks.github}
                  target="_blank"
                  rel={IDENTITY_EXTERNAL_REL}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground border border-border bg-surface/30 rounded-xl hover:border-primary/20 transition-all"
                >
                  GitHub <IconExternalLink className="h-3 w-3" />
                </a>
              )}
              {profile.socialLinks.linkedin && (
                <a
                  href={profile.socialLinks.linkedin}
                  target="_blank"
                  rel={IDENTITY_EXTERNAL_REL}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground border border-border bg-surface/30 rounded-xl hover:border-primary/20 transition-all"
                >
                  LinkedIn <IconExternalLink className="h-3 w-3" />
                </a>
              )}
              {profile.socialLinks.twitter && (
                <a
                  href={profile.socialLinks.twitter}
                  target="_blank"
                  rel={IDENTITY_EXTERNAL_REL}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground border border-border bg-surface/30 rounded-xl hover:border-primary/20 transition-all"
                >
                  Twitter/X <IconExternalLink className="h-3 w-3" />
                </a>
              )}
              {profile.socialLinks.wikidata && (
                <a
                  href={profile.socialLinks.wikidata}
                  target="_blank"
                  rel={IDENTITY_EXTERNAL_REL}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground border border-border bg-surface/30 rounded-xl hover:border-primary/20 transition-all"
                >
                  Wikidata <IconExternalLink className="h-3 w-3" />
                </a>
              )}
              <a
                href={peerlistUrl}
                target="_blank"
                rel={IDENTITY_EXTERNAL_REL}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground border border-border bg-surface/30 rounded-xl hover:border-primary/20 transition-all"
              >
                Peerlist <IconExternalLink className="h-3 w-3" />
              </a>
            </div>
          </section>

          {/* Resume Download CTA */}
          <section className="text-center">
            <TrackedLink
              href="/resume.pdf"
              target="_blank"
              rel={EXTERNAL_REL}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/30 px-6 py-3 text-sm font-semibold text-muted-foreground hover:text-foreground hover:border-primary/20 transition-all"
              gtmEvent="resume_download"
              gtmData={{ download_type: "pdf", download_location: "profile" }}
            >
              Download PDF Resume
              <IconExternalLink className="h-4 w-4" />
            </TrackedLink>
          </section>

          {/* Contact CTA */}
          <section className="relative rounded-3xl border border-border bg-surface/20 p-8 md:p-10 overflow-hidden text-center max-w-2xl mx-auto">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-32 w-32 bg-primary/5 rounded-full blur-[60px] -z-10" />
            <h2 className="text-xl font-bold tracking-tight">Get in touch</h2>
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed mt-2">
              Schedule a technical consultation or reach out directly for
              full-time and project inquiries.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link
                href="/contact/"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
              >
                Book technical discovery call
              </Link>
              <SafeEmailLink
                email={profile.email}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/30 px-5 py-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-primary/20 transition-all"
              >
                Email Directly
              </SafeEmailLink>
            </div>
          </section>
        </div>
      </main>
      <Footer
        profile={slimFooterProfile(profile)}
        navigationItems={sortedNavigationItems}
        projects={slimFooterProjects(sortedProjects)}
      />
    </div>
  );
}
