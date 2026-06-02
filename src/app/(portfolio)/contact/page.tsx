import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandX,
  IconChevronLeft,
  IconMail,
  IconMapPin,
  IconPhone,
  IconSparkles,
} from "@tabler/icons-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getPortfolioData } from "@/lib/portfolio-data";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = `${(process.env.NEXT_PUBLIC_SITE_URL || "https://madhudadi.in").replace(/\/+$/, "")}/`;
  const canonicalUrl = `${siteUrl}contact/`;

  return {
    title: "Contact & Collaboration | Madhu Dadi",
    description:
      "Get in touch with Madhu Dadi for generative AI development, RAG systems, and advanced marketing analytics consulting. Available worldwide.",
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function ContactPage() {
  const { profile, sortedProjects } = await getPortfolioData();

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
        name: "Contact",
        item: `${siteUrl}contact/`,
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

          {/* Intro Section */}
          <section className="space-y-4 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              <IconSparkles className="h-3.5 w-3.5" /> Collaboration & Hiring
            </span>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
              Let&apos;s build{" "}
              <span className="text-gradient">something great</span>
            </h1>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              Wherever you are in the world, drop a note about your technical
              challenge, hiring timeline, or project inquiry. I respond within
              24 hours.
            </p>
          </section>

          {/* Form and Contact Detail Split */}
          <div className="grid gap-10 lg:grid-cols-2 pt-4">
            {/* Info and Socials */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h2 className="text-xl font-bold tracking-tight border-b border-border/80 pb-2">
                  Direct Contact Info
                </h2>
                <ul className="space-y-4 text-sm">
                  <li className="flex items-center gap-3 p-4 rounded-xl border border-border/60 bg-surface/20 hover:border-primary/10 transition-colors">
                    <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary border border-primary/10 shrink-0">
                      <IconMail className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">
                        Email
                      </span>
                      <a
                        href={`mailto:${profile.email}`}
                        className="font-medium text-foreground hover:text-primary transition-colors"
                      >
                        {profile.email}
                      </a>
                    </div>
                  </li>

                  {profile.phone && (
                    <li className="flex items-center gap-3 p-4 rounded-xl border border-border/60 bg-surface/20 hover:border-primary/10 transition-colors">
                      <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary border border-primary/10 shrink-0">
                        <IconPhone className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground block">
                          Phone
                        </span>
                        <a
                          href={`tel:${profile.phone.replace(/[^\d+]/g, "")}`}
                          className="font-medium text-foreground hover:text-primary transition-colors"
                        >
                          {profile.phone}
                        </a>
                      </div>
                    </li>
                  )}

                  <li className="flex items-center gap-3 p-4 rounded-xl border border-border/60 bg-surface/20 hover:border-primary/10 transition-colors">
                    <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary border border-primary/10 shrink-0">
                      <IconMapPin className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">
                        Location
                      </span>
                      <span className="font-medium text-foreground">
                        {profile.location}
                      </span>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Social Channels */}
              <div className="space-y-4">
                <h2 className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
                  Social Channels
                </h2>
                <div className="flex flex-wrap gap-3">
                  {profile.socialLinks.github && (
                    <a
                      href={profile.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground border border-border bg-surface/30 rounded-xl hover:border-primary/20 transition-all"
                    >
                      <IconBrandGithub className="h-4.5 w-4.5" /> GitHub
                    </a>
                  )}
                  {profile.socialLinks.linkedin && (
                    <a
                      href={profile.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground border border-border bg-surface/30 rounded-xl hover:border-primary/20 transition-all"
                    >
                      <IconBrandLinkedin className="h-4.5 w-4.5" /> LinkedIn
                    </a>
                  )}
                  {profile.socialLinks.twitter && (
                    <a
                      href={profile.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground border border-border bg-surface/30 rounded-xl hover:border-primary/20 transition-all"
                    >
                      <IconBrandX className="h-4.5 w-4.5" /> Twitter
                    </a>
                  )}
                  {profile.socialLinks.website && (
                    <a
                      href={profile.socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground border border-border bg-surface/30 rounded-xl hover:border-primary/20 transition-all"
                    >
                      <div className="flex h-4.5 w-4.5 items-center justify-center overflow-hidden rounded-full border border-border/50 bg-surface shadow-inner shrink-0">
                        <Image
                          src="/new-ui/logo.png"
                          alt=""
                          width={18}
                          height={18}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      Blog
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Interactive Form Component */}
            <div className="space-y-4">
              <Suspense
                fallback={
                  <div className="flex flex-col items-center justify-center h-80 rounded-2xl border border-border bg-surface/30 p-6 space-y-4 animate-pulse">
                    <div className="h-8 w-8 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin" />
                    <p className="text-sm text-muted-foreground">
                      Preparing contact form...
                    </p>
                  </div>
                }
              >
                <ContactForm />
              </Suspense>
            </div>
          </div>
        </div>
      </main>

      <Footer profile={profile} projects={sortedProjects} />
    </div>
  );
}
