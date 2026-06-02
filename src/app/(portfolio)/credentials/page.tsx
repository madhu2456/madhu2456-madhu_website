import {
  IconAward,
  IconChevronLeft,
  IconExternalLink,
  IconSchool,
} from "@tabler/icons-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getPortfolioData } from "@/lib/portfolio-data";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = `${(process.env.NEXT_PUBLIC_SITE_URL || "https://madhudadi.in").replace(/\/+$/, "")}/`;
  const canonicalUrl = `${siteUrl}credentials/`;

  return {
    title: "Credentials & Verification | Madhu Dadi",
    description:
      "Verified certifications, professional credentials, and academic profile of Madhu Dadi. Including GitHub Actions, Azure AI, MongoDB, and Dataiku.",
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function CredentialsPage() {
  const { profile, sortedCertifications, sortedEducation, sortedProjects } =
    await getPortfolioData();

  return (
    <div className="flex flex-col min-h-screen">
      <Header profile={profile} />

      <main id="main-content" className="flex-1 px-6 py-28 bg-background/50">
        <div className="container mx-auto max-w-4xl space-y-12">
          {/* Back Button */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <IconChevronLeft className="h-4 w-4" /> Back to Home
            </Link>
          </div>

          {/* Hero Header Section */}
          <section className="relative rounded-2xl border border-border bg-surface/30 p-8 md:p-10 backdrop-blur-md overflow-hidden text-center space-y-4">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-32 w-32 bg-primary/5 rounded-full blur-3xl -z-10" />
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              <IconAward className="h-3.5 w-3.5" /> Professional Verification &
              Trust
            </span>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
              Certifications &{" "}
              <span className="text-gradient">Credentials</span>
            </h1>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Curated list of professional certifications, badges, licenses, and
              verified verification links validating engineering competence.
            </p>
          </section>

          {/* Academic Profile */}
          {sortedEducation.length > 0 && (
            <section className="space-y-6">
              <h2 className="text-2xl font-bold tracking-tight border-b border-border/80 pb-2 flex items-center gap-2">
                <IconSchool className="h-6 w-6 text-primary" /> Academic Profile
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {sortedEducation.map((edu) => (
                  <div
                    key={edu.institution}
                    className="p-6 border border-border/60 bg-surface/20 rounded-xl space-y-2 hover:border-primary/20 transition-all duration-300 backdrop-blur-md"
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

          {/* Professional Certifications & Badges */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight border-b border-border/80 pb-2 flex items-center gap-2">
              <IconAward className="h-6 w-6 text-primary" /> Professional
              Certifications
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {sortedCertifications.map((cert) => (
                <div
                  key={cert.name}
                  className="group flex flex-col justify-between p-6 border border-border bg-surface/25 rounded-2xl hover:border-primary/30 hover:bg-surface-elevated/20 transition-all duration-300 backdrop-blur-md relative overflow-hidden"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/10 group-hover:scale-105 transition-transform duration-300">
                          <IconAward className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
                            {cert.name}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Issued by{" "}
                            <span className="text-foreground/80 font-medium">
                              {cert.issuer}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pl-13 space-y-2">
                      {cert.credentialId && (
                        <p className="text-[11px] font-mono text-muted-foreground flex items-center gap-1 bg-surface-elevated/40 border border-border/30 px-2 py-0.5 rounded w-fit">
                          ID: {cert.credentialId}
                        </p>
                      )}

                      {cert.issueDate && (
                        <p className="text-xs text-muted-foreground">
                          Issued:{" "}
                          <span className="font-mono text-foreground">
                            {cert.issueDate}
                          </span>
                        </p>
                      )}

                      {cert.description && (
                        <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                          {cert.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pl-13 mt-6 pt-4 border-t border-border/50 flex items-center justify-between gap-4">
                    {/* Skills tags */}
                    <div className="flex flex-wrap gap-1">
                      {cert.skills?.map((skill) => (
                        <span
                          key={skill.name}
                          className="rounded-full border border-border/40 bg-background/20 px-2 py-0.5 text-[9px] font-mono text-muted-foreground"
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

          {/* Continuous Learning Footer banner */}
          <section className="relative rounded-3xl border border-border/60 bg-surface/20 p-8 md:p-10 overflow-hidden text-center max-w-4xl mx-auto">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-40 w-40 bg-primary/5 rounded-full blur-[60px] -z-10" />
            <div className="max-w-2xl mx-auto space-y-4">
              <h2 className="text-xl md:text-2xl font-bold tracking-tight">
                Rigorous Technical Standards
              </h2>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                All credentials are up to date and verified against official
                registration catalogs. I consistently expand my skills through
                validated courses, bootcamps, and platform benchmarks to deliver
                standard-compliant systems.
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer profile={profile} projects={sortedProjects} />
    </div>
  );
}
