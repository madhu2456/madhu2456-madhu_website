import {
  IconChevronLeft,
  IconCode,
  IconMail,
  IconMapPin,
  IconPhone,
  IconSchool,
} from "@tabler/icons-react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  buildFullGraph,
  buildPersonSchema,
  buildProfilePageSchema,
} from "@/lib/jsonld";
import { getPortfolioData } from "@/lib/portfolio-data";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const { profile } = await getPortfolioData();
  const siteUrl = `${(process.env.NEXT_PUBLIC_SITE_URL || "https://madhudadi.in").replace(/\/+$/, "")}/`;
  const canonicalUrl = `${siteUrl}profile/`;

  return {
    title: "Profile | Madhu Dadi — AI & Marketing Analytics Engineer",
    description: profile.shortBio,
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function ProfilePage() {
  const { profile, sortedExperiences, skills, sortedEducation } =
    await getPortfolioData();
  const siteUrl = `${(process.env.NEXT_PUBLIC_SITE_URL || "https://madhudadi.in").replace(/\/+$/, "")}/`;

  const graph = buildFullGraph([
    buildPersonSchema({
      fullName: `${profile.firstName} ${profile.lastName}`,
      headline: profile.headline,
      bio: profile.shortBio,
      email: profile.email,
      location: profile.location,
      profileImageUrl: `${siteUrl}new-ui/hero-portrait.jpg`,
      siteUrl,
      socialLinks: profile.socialLinks,
      yearsOfExperience: profile.yearsOfExperience,
      nationality: "India",
    }),
    buildProfilePageSchema({
      fullName: `${profile.firstName} ${profile.lastName}`,
      url: `${siteUrl}profile/`,
      description: profile.shortBio,
      profileImageUrl: `${siteUrl}new-ui/hero-portrait.jpg`,
    }),
  ]);

  return (
    <main
      id="main-content"
      className="min-h-screen px-6 py-20 bg-background/50"
    >
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: safe — server-controlled JSON-LD only
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
      />

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

        {/* Hero Info Card */}
        <section className="relative rounded-2xl border border-border bg-surface/30 p-8 md:p-10 backdrop-blur-md overflow-hidden">
          <div className="absolute top-0 right-0 h-40 w-40 bg-primary/5 rounded-full blur-3xl -z-10" />

          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
            <div className="space-y-4 min-w-0 flex-1">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                Canonical Profile Page
              </span>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                {profile.firstName}{" "}
                <span className="text-primary">{profile.lastName}</span>
              </h1>
              <p className="text-lg md:text-xl font-medium text-foreground/90">
                {profile.headline}
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <IconMapPin className="h-4 w-4" /> {profile.location}
                </span>
                <span className="flex items-center gap-1">
                  <IconMail className="h-4 w-4" /> {profile.email}
                </span>
                {profile.phone && (
                  <span className="flex items-center gap-1">
                    <IconPhone className="h-4 w-4" /> {profile.phone}
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Canonical Bio */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight border-b border-border/80 pb-2">
            Canonical Identity Statement
          </h2>
          <p className="text-lg text-foreground/80 leading-relaxed bg-surface-elevated/20 border border-border/40 p-6 rounded-2xl">
            {profile.shortBio}
          </p>
        </section>

        {/* Narrative Biography */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight border-b border-border/80 pb-2">
            Professional Narrative
          </h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            {profile.fullBioParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>

        {/* Skills Stack */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight border-b border-border/80 pb-2">
            Core Skill Matrix
          </h2>
          <div className="flex flex-wrap gap-2.5">
            {skills.map((skill) => (
              <span
                key={skill.name}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-surface/50 text-sm font-medium transition-all hover:border-primary/20 hover:bg-surface-elevated"
              >
                <IconCode className="h-3.5 w-3.5 text-primary/70" />
                {skill.name}
              </span>
            ))}
          </div>
        </section>

        {/* Professional Experience */}
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
                {/* Dot */}
                <div className="absolute -left-[31px] top-1.5 h-4 w-4 rounded-full border-2 border-primary bg-background group-hover:scale-115 transition-transform" />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h3 className="font-semibold text-lg text-foreground">
                    {exp.position}{" "}
                    <span className="text-primary">@ {exp.company}</span>
                  </h3>
                  <span className="text-xs font-mono text-muted-foreground bg-surface/60 border border-border/40 px-2 py-1 rounded-md">
                    {exp.startDate.slice(0, 7)} –{" "}
                    {exp.current ? "Present" : exp.endDate?.slice(0, 7)}
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

        {/* Academic Profile */}
        {sortedEducation.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight border-b border-border/80 pb-2">
              Education
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {sortedEducation.map((edu) => (
                <div
                  key={edu.institution}
                  className="p-5 border border-border/60 bg-surface/20 rounded-xl space-y-1"
                >
                  <div className="flex items-center gap-2 text-primary">
                    <IconSchool className="h-5 w-5" />
                    <h3 className="font-semibold text-foreground">
                      {edu.institution}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{edu.degree}</p>
                  <p className="text-xs text-muted-foreground">
                    {edu.fieldOfStudy}
                  </p>
                  <p className="text-xs font-mono text-muted-foreground pt-1">
                    {edu.startDate.slice(0, 4)} –{" "}
                    {edu.endDate ? edu.endDate.slice(0, 4) : "Present"}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
