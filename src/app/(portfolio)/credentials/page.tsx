import {
  IconAward,
  IconBriefcase,
  IconCertificate,
  IconChevronLeft,
  IconChevronRight,
  IconDownload,
  IconExternalLink,
  IconFileText,
  IconLink,
  IconSchool,
  IconShieldCheck,
  IconTrophy,
} from "@tabler/icons-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getPortfolioData } from "@/lib/portfolio-data";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const { pageContent } = await getPortfolioData();
  const siteUrl = `${(process.env.NEXT_PUBLIC_SITE_URL || "https://madhudadi.in").replace(/\/+$/, "")}/`;
  const canonicalPath =
    pageContent.credentials.seo?.canonicalPath || "/credentials/";
  const canonicalUrl = `${siteUrl}${canonicalPath.replace(/^\//, "")}`;

  return {
    title:
      pageContent.credentials.seo?.title ||
      "Madhu Dadi Credentials - AI, RAG, GA4 & Analytics Certifications",
    description:
      pageContent.credentials.seo?.description ||
      "Verified credentials, certifications, awards, work history, and public proof for Madhu Dadi, AI and marketing analytics engineer.",
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function CredentialsPage() {
  const {
    profile,
    sortedCertifications,
    sortedEducation,
    sortedExperiences,
    sortedProjects,
    sortedNavigationItems,
    pageContent,
  } = await getPortfolioData();

  const siteUrl = `${(process.env.NEXT_PUBLIC_SITE_URL || "https://madhudadi.in").replace(/\/+$/, "")}/`;
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
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
        name: "Credentials",
        item: `${siteUrl}credentials/`,
      },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: safe — server-controlled JSON-LD only
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Header profile={profile} navigationItems={sortedNavigationItems} />

      <main id="main-content" className="flex-1 px-6 py-28 bg-background/50">
        <div className="container mx-auto max-w-4xl space-y-16">
          {/* Back Button */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
            >
              <IconChevronLeft className="h-4 w-4" /> Back to Home
            </Link>
          </div>

          {/* Hero Header Section */}
          <section className="relative rounded-3xl border border-border bg-surface/30 p-8 md:p-12 shadow-card backdrop-blur-md overflow-hidden text-center space-y-4">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-40 w-40 bg-primary/5 rounded-full blur-3xl -z-10" />
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              <IconShieldCheck className="h-3.5 w-3.5" /> Verified Credentials &
              Professional Proof
            </span>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
              {pageContent.credentials.heroTitle ||
                "Verified Credentials & Professional Proof"}
            </h1>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {pageContent.credentials.heroSubtitle ||
                "Factual, verifiable proof of professional competencies, academic history, quarter achievements, and verified certification registries."}
            </p>
          </section>

          {/* Downloadable Resume Callout */}
          <section className="rounded-2xl border border-primary/20 bg-surface/20 p-6 md:p-8 backdrop-blur-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1.5 text-center md:text-left">
              <h3 className="font-bold text-lg text-foreground flex items-center justify-center md:justify-start gap-2">
                <IconFileText className="h-5 w-5 text-primary" />{" "}
                {pageContent.credentials.resumeCallout?.title ||
                  "Curated PDF Resume"}
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                {pageContent.credentials.resumeCallout?.description ||
                  "Download a clean, printer-friendly PDF containing comprehensive project history and technical details."}
              </p>
            </div>
            <a
              href="/resume.pdf"
              download
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-md hover:scale-[1.02] transition-all whitespace-nowrap"
            >
              Download PDF Resume
              <IconDownload className="h-4.5 w-4.5" />
            </a>
          </section>

          {/* High-Trust Proof Table */}
          <section className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl md:text-2xl font-bold tracking-tight flex items-center gap-2">
                <IconLink className="h-5 w-5 text-primary" /> Verified Proof &
                Achievements
              </h2>
              <p className="text-xs md:text-sm text-muted-foreground">
                Consolidated matrix of active third-party credentials and
                professional performance recognitions.
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-border bg-surface/20 backdrop-blur-md shadow-sm">
              <table className="min-w-full divide-y divide-border/60 text-sm">
                <thead className="bg-surface-elevated/40 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-4 text-left">
                      Proof / Achievement
                    </th>
                    <th scope="col" className="px-6 py-4 text-left">
                      Verification Link
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 divide-dashed">
                  {pageContent.credentials.proofLinks?.map((row) => (
                    <tr
                      key={row.proof}
                      className="hover:bg-surface/10 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                            row.type === "Credential"
                              ? "bg-primary/10 text-primary border-primary/20"
                              : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                          }`}
                        >
                          {row.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-foreground">
                        {row.proof}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a
                          href={row.linkUrl}
                          target={
                            row.linkUrl.startsWith("http") ? "_blank" : "_self"
                          }
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-hover transition-colors"
                        >
                          {row.linkText}{" "}
                          <IconExternalLink className="h-3 w-3 shrink-0" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Verified Certifications Detail Grid */}
          <section className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl md:text-2xl font-bold tracking-tight flex items-center gap-2">
                <IconCertificate className="h-5 w-5 text-primary" /> Verified
                Registries
              </h2>
              <p className="text-xs md:text-sm text-muted-foreground">
                Official licensing details and credentials retrieved directly
                from professional issuer databases.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {sortedCertifications.map((cert) => (
                <div
                  key={cert.name}
                  className="group flex flex-col justify-between p-6 border border-border bg-surface/20 rounded-2xl hover:border-primary/30 transition-all duration-300 backdrop-blur-md"
                >
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                        <IconCertificate className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
                          {cert.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Issued by{" "}
                          <span className="font-medium text-foreground/80">
                            {cert.issuer}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="pl-12 space-y-2 text-xs">
                      {cert.credentialId && (
                        <p className="font-mono text-[10px] text-muted-foreground bg-surface-elevated/40 border border-border/30 px-2 py-0.5 rounded w-fit">
                          ID: {cert.credentialId}
                        </p>
                      )}
                      {cert.issueDate && (
                        <p className="text-muted-foreground">
                          Issue Date:{" "}
                          <span className="font-mono text-foreground">
                            {cert.issueDate}
                          </span>
                        </p>
                      )}
                      {cert.description && (
                        <p className="text-muted-foreground leading-relaxed pt-1">
                          {cert.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pl-12 mt-6 pt-4 border-t border-border/40 flex items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-1">
                      {cert.skills?.slice(0, 3).map((skill) => (
                        <span
                          key={skill.name}
                          className="rounded-full border border-border/35 bg-background/20 px-2 py-0.5 text-[9px] font-mono text-muted-foreground"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>

                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-hover transition-colors whitespace-nowrap"
                      >
                        Verify <IconExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Awards & Recognition Section */}
          <section id="awards-recognition" className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl md:text-2xl font-bold tracking-tight flex items-center gap-2">
                <IconTrophy className="h-5 w-5 text-primary" /> Awards &
                Recognition
              </h2>
              <p className="text-xs md:text-sm text-muted-foreground">
                Quarterly and annual performance awards proving commercial
                impact and lead engineering execution.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {pageContent.credentials.awards?.map((award) => (
                <div
                  key={award.title}
                  className="rounded-2xl border border-border bg-surface/20 p-6 space-y-3 backdrop-blur-md hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 h-20 w-20 bg-primary/5 rounded-full blur-xl -z-10" />
                  <div className="flex items-center gap-2">
                    <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <IconAward className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-muted-foreground uppercase font-mono tracking-wider">
                        {award.organization}
                      </h4>
                    </div>
                  </div>
                  <h3 className="font-bold text-sm text-foreground leading-snug">
                    {award.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                    {award.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Work History Timeline */}
          {sortedExperiences.length > 0 && (
            <section className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight flex items-center gap-2">
                  <IconBriefcase className="h-5 w-5 text-primary" />{" "}
                  Professional Work History
                </h2>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Chronological career timeline detailing engineering positions
                  and primary telemetry milestones.
                </p>
              </div>

              <div className="relative border-l border-border/80 pl-6 ml-3 space-y-8">
                {sortedExperiences.map((exp) => (
                  <div key={exp.company} className="relative space-y-2">
                    {/* Circle bullet */}
                    <div
                      aria-hidden="true"
                      className="absolute -left-9.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-background border border-primary"
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div>
                        <h3 className="font-bold text-base text-foreground leading-snug">
                          {exp.company}
                        </h3>
                        <p className="text-xs font-semibold text-primary mt-0.5">
                          {exp.position}
                        </p>
                      </div>
                      <span className="text-[10px] font-mono font-semibold text-muted-foreground bg-surface-elevated/60 border border-border/40 px-2 py-0.5 rounded w-fit sm:mt-0">
                        {exp.startDate} – {exp.endDate || "Present"}
                      </span>
                    </div>

                    {exp.description && (
                      <p className="text-xs md:text-sm text-muted-foreground leading-relaxed pt-1">
                        {exp.description}
                      </p>
                    )}

                    {exp.responsibilities &&
                      exp.responsibilities.length > 0 && (
                        <ul className="space-y-1.5 text-xs text-muted-foreground pt-2 pl-2">
                          {exp.responsibilities.map((resp) => (
                            <li
                              key={resp}
                              className="relative pl-3 before:absolute before:left-0 before:content-['•'] before:text-muted-foreground/60"
                            >
                              {resp}
                            </li>
                          ))}
                        </ul>
                      )}

                    {exp.achievements && exp.achievements.length > 0 && (
                      <ul className="space-y-1.5 text-xs text-muted-foreground pt-1.5 pl-2 border-t border-dashed border-border/40 mt-2">
                        {exp.achievements.map((ach) => (
                          <li
                            key={ach}
                            className="relative pl-3 before:absolute before:left-0 before:content-['•'] before:text-primary/60 text-primary font-medium"
                          >
                            {ach}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Dynamic Public Case Studies Projects */}
          {sortedProjects.length > 0 && (
            <section className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight flex items-center gap-2">
                  <IconFileText className="h-5 w-5 text-primary" /> Public
                  Projects & Code Proof
                </h2>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Verifiable full-stack and AI software solutions mapping
                  search-citable codebases to client outcomes.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {sortedProjects.map((project) => (
                  <div
                    key={project.title}
                    className="group rounded-2xl border border-border bg-surface/20 p-6 flex flex-col justify-between hover:border-primary/30 transition-all duration-300 backdrop-blur-md"
                  >
                    <div className="space-y-3">
                      <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {project.tagline}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-border/40 mt-4 flex items-center justify-between gap-4">
                      <div className="flex flex-wrap gap-1">
                        {project.technologies?.slice(0, 3).map((tech) => (
                          <span
                            key={tech.name}
                            className="rounded-full border border-border/40 bg-background/20 px-2 py-0.5 text-[9px] font-mono text-muted-foreground"
                          >
                            {tech.name}{" "}
                          </span>
                        ))}
                      </div>

                      <Link
                        href={`/case-studies/${project.slug}/`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-hover transition-colors"
                      >
                        Code Details{" "}
                        <IconChevronRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Academic Profile */}
          {sortedEducation.length > 0 && (
            <section className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight border-b border-border/80 pb-2 flex items-center gap-2">
                  <IconSchool className="h-6 w-6 text-primary" /> Academic
                  Profile
                </h2>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Undergraduate degrees and university certifications.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {sortedEducation.map((edu) => (
                  <div
                    key={edu.institution}
                    className="p-6 border border-border/60 bg-surface/25 rounded-xl space-y-2 hover:border-primary/20 transition-all duration-300 backdrop-blur-md"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary border border-primary/10 shrink-0">
                        <IconSchool className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground leading-snug">
                          {edu.institution}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {edu.degree}
                        </p>
                      </div>
                    </div>
                    <div className="pl-10 space-y-1">
                      <p className="text-xs text-muted-foreground">
                        {edu.fieldOfStudy}
                      </p>
                      <p className="text-xs font-mono text-muted-foreground mt-2">
                        {edu.startDate.slice(0, 4)} –{" "}
                        {edu.endDate ? edu.endDate.slice(0, 4) : "Present"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* External Profiles Grid */}
          <section className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl md:text-2xl font-bold tracking-tight flex items-center gap-2">
                <IconLink className="h-5 w-5 text-primary" /> External Portals
              </h2>
              <p className="text-xs md:text-sm text-muted-foreground">
                Citable external profiles displaying active open-source updates
                and technical writings.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {pageContent.credentials.externalProfiles?.map((profile) => (
                <a
                  key={profile.name}
                  href={profile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col justify-between p-5 border border-border bg-surface/20 rounded-xl hover:border-primary/30 transition-all duration-300 backdrop-blur-md"
                >
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                      {profile.name}{" "}
                      <IconExternalLink className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {profile.description}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* Verification Notes */}
          <section className="relative rounded-3xl border border-border/60 bg-surface/20 p-8 md:p-10 overflow-hidden text-center max-w-4xl mx-auto">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-40 w-40 bg-primary/5 rounded-full blur-[60px] -z-10" />
            <div className="max-w-2xl mx-auto space-y-4">
              <h2 className="text-xl md:text-2xl font-bold tracking-tight">
                Verification Notes
              </h2>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                Credential IDs and verification links are mapped to their
                issuing platforms where available. This page is maintained as a
                source of truth for Madhu Dadi’s professional certifications,
                awards, work history, and public project proof.
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer profile={profile} navigationItems={sortedNavigationItems} projects={sortedProjects} />
    </div>
  );
}
