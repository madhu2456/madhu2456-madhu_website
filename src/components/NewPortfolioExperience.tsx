"use client";

import {
  IconAward,
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandX,
  IconChartBar,
  IconSparkles,
  IconTrendingUp,
} from "@tabler/icons-react";
import { ArrowRight, ChevronRight, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  type FormEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { submitContactForm } from "@/app/actions/submit-contact-form";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import {
  normalizeImageSource,
  shouldUseUnoptimizedImage,
} from "@/lib/image-source";
import type {
  CertificationItem,
  ExperienceItem,
  Profile,
  ProjectItem,
  ServiceItem,
  SkillItem,
  PageContent,
} from "@/lib/portfolio-data";

import type { NavigationItem } from "@/lib/portfolio-data";
type NewPortfolioExperienceProps = {
  navigationItems: NavigationItem[];
  pageContent: PageContent;
  profile: Profile;
  skills: SkillItem[];
  experiences: ExperienceItem[];
  projects: ProjectItem[];
  services: ServiceItem[];
  certifications: CertificationItem[];

};

type Prefill = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
};

const _navLinks = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Work" },
  { href: "#services", label: "Services" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
  { href: "https://madhudadi.in/blog", label: "Blog" },
];

const LINKEDIN_CERTS_URL =
  "https://www.linkedin.com/in/madhu-dadi-54684531/details/certifications/";

export function NewPortfolioExperience({
  profile,
  navigationItems,
  skills,
  experiences,
  projects,
  services,
  certifications,
  pageContent,

}: NewPortfolioExperienceProps) {
  const faqItems = useMemo(() => buildFaqItems(), []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <Header profile={profile} navigationItems={navigationItems} />
      <main id="main">
        <Hero
          profile={profile}
          experiences={experiences}
          pageContent={pageContent}
        />
        <DirectAnswer pageContent={pageContent} />
        <Projects projects={projects} />
        <Services services={services} />

        <Stats stats={profile.stats} />
        <Skills skills={skills} />
        <Experience experiences={experiences} />
        <Certifications certifications={certifications} />
        <Faq items={faqItems} />
        <Contact profile={profile} />
      </main>
      <Footer
        navigationItems={navigationItems}
        profile={profile}
        projects={projects}
      />
    </div>
  );
}

// Shared Header is imported from @/components/Header

function Hero({
  profile,
  experiences,
  pageContent,
}: {
  profile: Profile;
  experiences: ExperienceItem[];
  pageContent: PageContent;
}) {
  const workedAt = Array.from(
    new Set(
      experiences
        .map((item) => normalizeCompanyName(item.company))
        .filter(Boolean),
    ),
  ).slice(0, 5);

  return (
    <section
      id="home"
      className="relative isolate bg-hero-glow pt-24 pb-16 sm:pt-32 sm:pb-20 lg:min-h-[100svh]"
    >
      <div className="grain absolute inset-0 -z-10" aria-hidden />
      <div className="mx-auto grid w-[min(1400px,92%)] gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-14">
        <div className="animate-fade-up">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[11px] text-emerald-300 sm:mb-5 sm:text-xs">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            {pageContent.home.heroAvailabilityText ||
              "Available for new projects"}
          </p>
          <p className="mb-3 font-display text-[11px] tracking-[0.18em] text-primary uppercase sm:text-sm sm:tracking-[0.2em] font-semibold">
            {pageContent.home.eyebrow}
          </p>
          <h1 className="font-display text-[clamp(2rem,6vw,4rem)] leading-[1.15] font-bold tracking-tight sm:leading-[1.1]">
            {profile.firstName} {profile.lastName} -{" "}
            <span className="text-gradient">{pageContent.home.heroTitle}</span>
          </h1>
          <div className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:mt-6 sm:text-lg space-y-4">
            {(pageContent.home.introParagraphs || []).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
          <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center">
            <Link
              href="/contact/"
              prefetch={false}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:scale-[1.03] sm:px-6"
            >
              Hire me
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-white/5 px-5 py-3 text-sm font-medium hover:bg-surface-elevated hover:border-primary/30 sm:px-6 transition-all duration-300"
            >
              Resume
            </a>
            <Link
              href="/case-studies/"
              prefetch={false}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-white/5 px-5 py-3 text-sm font-medium hover:bg-surface-elevated hover:border-primary/30 sm:px-6 transition-all duration-300"
            >
              See case studies
            </Link>
          </div>
          {workedAt.length > 0 ? (
            <div className="mt-8 sm:mt-10">
              <p className="mb-3 text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
                {pageContent.home.workedAtLabel || "Worked at"}
              </p>
              <ul className="flex flex-wrap items-center gap-x-4 gap-y-2 font-display text-sm text-foreground/80 sm:gap-x-6 sm:text-base">
                {workedAt.map((company, index) => (
                  <li key={company} className="contents">
                    <span>{company}</span>
                    {index < workedAt.length - 1 ? (
                      <span aria-hidden className="text-muted-foreground/40">
                        ·
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div className="relative animate-fade-up">
          <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-tr from-accent/30 via-transparent to-primary/20 blur-2xl sm:-inset-6" />
          <div className="overflow-hidden rounded-[1.5rem] border border-border shadow-card sm:rounded-[1.75rem]">
            <Image
              src="/new-ui/hero-portrait.jpg"
              alt={`Portrait of ${profile.firstName} ${profile.lastName}, ${profile.headline}`}
              width={694}
              height={925}
              priority
              className="h-full w-full object-cover"
            />
          </div>
          <div className="glass absolute right-3 bottom-3 left-3 rounded-xl p-3 sm:right-5 sm:bottom-5 sm:left-5 sm:rounded-2xl sm:p-4">
            <p className="font-display text-base italic sm:text-lg">
              Let&apos;s build something meaningful.
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground sm:text-xs">
              AI · LLM · RAG · Analytics · Full-stack
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function DirectAnswer({ pageContent }: { pageContent: PageContent }) {
  return (
    <Section
      id="about"
      eyebrow="Direct Answer"
      title={pageContent.home.directAnswer?.title || "Who is Madhu Dadi?"}
    >
      <div className="relative rounded-3xl border border-border/80 bg-surface/35 p-8 md:p-10 backdrop-blur-md overflow-hidden flex flex-col justify-between min-h-[220px]">
        <div className="absolute top-0 right-0 h-40 w-40 bg-primary/5 rounded-full blur-3xl -z-10" />
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 sm:flex-row">
          <p className="text-base text-muted-foreground">
            {pageContent.home.directAnswer?.title || "Who is Madhu Dadi?"}
          </p>
        </div>
        <div className="mt-4 grid gap-8 sm:grid-cols-2 lg:gap-12 text-sm sm:text-base leading-relaxed text-muted-foreground">
          <div className="space-y-4">
            {(pageContent.home.directAnswer?.paragraphs || [])
              .slice(
                0,
                Math.ceil(
                  (pageContent.home.directAnswer?.paragraphs?.length || 0) / 2,
                ),
              )
              .map((para, i) => (
                <p key={i}>{para}</p>
              ))}
          </div>
          <div className="space-y-4">
            {(pageContent.home.directAnswer?.paragraphs || [])
              .slice(
                Math.ceil(
                  (pageContent.home.directAnswer?.paragraphs?.length || 0) / 2,
                ),
              )
              .map((para, i) => (
                <p key={i}>{para}</p>
              ))}
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-4 border-t border-border/30 pt-6">
          <Link
            href="/profile/"
            prefetch={false}
            className="group inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-hover transition-colors"
          >
            Full profile
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <span className="text-muted-foreground/30 select-none" aria-hidden>
            |
          </span>
          <Link
            href="/credentials/"
            prefetch={false}
            className="group inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-hover transition-colors"
          >
            Credentials
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </Section>
  );
}

function Stats({ stats }: { stats: Profile["stats"] }) {
  const { ref, inView } = useInView<HTMLDivElement>();

  if (stats.length === 0) return null;

  return (
    <section aria-label="Key results" className="py-12 sm:py-16">
      <div
        ref={ref}
        className="mx-auto grid w-[min(1400px,92%)] grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((stat, index) => (
          <StatItem
            key={stat.label}
            value={stat.value}
            label={stat.label}
            start={inView}
            delay={index * 80}
          />
        ))}
      </div>
    </section>
  );
}

function StatItem({
  value,
  label,
  start,
  delay,
}: {
  value: string;
  label: string;
  start: boolean;
  delay: number;
}) {
  const display = useHydratedCountUp(value, start);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const getIcon = (label: string) => {
    const l = label.toLowerCase();
    if (
      l.includes("experience") ||
      l.includes("year") ||
      l.includes("enrollment") ||
      l.includes("udemy") ||
      l.includes("learning") ||
      l.includes("value")
    ) {
      return (
        <IconAward className="h-6 w-6 text-primary transition-transform duration-300 group-hover:scale-115 group-hover:rotate-6" />
      );
    }
    if (l.includes("customer") || l.includes("growth") || l.includes("user")) {
      return (
        <IconTrendingUp className="h-6 w-6 text-primary transition-transform duration-300 group-hover:scale-115 group-hover:translate-y-[-2px]" />
      );
    }
    if (
      l.includes("churn") ||
      l.includes("reduction") ||
      l.includes("retention") ||
      l.includes("page") ||
      l.includes("audit") ||
      l.includes("domain")
    ) {
      return (
        <IconChartBar className="h-6 w-6 text-primary transition-transform duration-300 group-hover:scale-115 group-hover:translate-x-[2px]" />
      );
    }
    return (
      <IconSparkles className="h-6 w-6 text-primary transition-transform duration-300 group-hover:scale-115 group-hover:rotate-12" />
    );
  };

  return (
    <div
      className="group relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-border/60 bg-surface/30 px-6 py-8 text-center shadow-sm backdrop-blur-md transition-all duration-300 hover:scale-[1.03] hover:border-primary/25 hover:shadow-glow"
      style={{
        opacity: !isMounted || start ? 1 : 0,
        transform: !isMounted || start ? "translateY(0)" : "translateY(20px)",
        transitionDelay: `${delay}ms`,
        transitionProperty: "opacity, transform, border-color, box-shadow",
      }}
    >
      {/* Dynamic ambient radial backdrop glow */}
      <div className="absolute inset-0 -z-10 bg-radial from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {/* Floating Icon Wrapper */}
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-border/80 bg-surface/50 shadow-inner group-hover:border-primary/20">
        {getIcon(label)}
      </div>

      <dd
        className="text-gradient-amber font-display text-4xl font-extrabold tracking-tight sm:text-5xl"
        data-count-to={value}
        suppressHydrationWarning
      >
        {display}
      </dd>

      <dt className="mt-3 text-xs font-semibold text-foreground/90 tracking-wider uppercase sm:text-sm">
        {label}
      </dt>
    </div>
  );
}

function Projects({ projects }: { projects: ProjectItem[] }) {
  if (projects.length === 0) return null;

  return (
    <Section
      id="projects"
      eyebrow="Selected work"
      title="Case studies: AI, RAG & full-stack engineering."
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => {
          const stack = project.technologies?.map((tech) => tech.name) ?? [];

          return (
            <article
              key={project.slug}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface/60 transition-all hover:-translate-y-1 hover:border-primary/40 shadow-card"
            >
              {project.coverImage ? (
                <div className="relative aspect-video w-full overflow-hidden border-b border-border/80 bg-surface">
                  <Image
                    src={normalizeImageSource(project.coverImage) || ""}
                    alt={project.coverImageAlt || project.title}
                    width={800}
                    height={450}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-[1.04]"
                    unoptimized={shouldUseUnoptimizedImage(project.coverImage)}
                  />
                </div>
              ) : null}
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                {project.category ? (
                  <p className="text-[11px] tracking-widest text-primary uppercase sm:text-xs">
                    {project.category}
                  </p>
                ) : null}
                <h3 className="mt-2 min-h-[3.75rem] font-display text-xl font-semibold leading-tight sm:text-2xl">
                  {project.tagline || project.title}
                </h3>
                <p className="mt-1 text-sm font-medium text-foreground/80">
                  {project.title}
                </p>
                {project.impactSummary ? (
                  <p className="mt-3 min-h-[9rem] text-sm leading-relaxed text-muted-foreground">
                    {project.impactSummary}
                  </p>
                ) : null}
                <div className="mt-4 flex min-h-[3.5rem] flex-wrap content-start gap-1.5">
                  {stack.slice(0, 8).map((tech) => (
                    <span
                      key={`${project.slug}-${tech}`}
                      className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground"
                    >
                      {tech}{" "}
                    </span>
                  ))}
                </div>
                <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                  <Link
                    href={`/case-studies/${project.slug}/`}
                    prefetch={false}
                    className="inline-flex items-center gap-1 font-medium text-primary underline-offset-4 transition-colors hover:underline"
                  >
                    Read case study <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  {project.liveUrl ? (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                    >
                      Live <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ) : null}
                  {project.githubUrl ? (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                    >
                      GitHub <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ) : null}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </Section>
  );
}

function Services({ services }: { services: ServiceItem[] }) {
  if (services.length === 0) return null;

  return (
    <Section
      id="services"
      eyebrow="Services"
      title="Generative AI & engineering services."
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => {
          const stack = service.technologies?.map((tech) => tech.name) ?? [];

          return (
            <article
              key={service.slug}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface/60 p-6 shadow-card transition-all hover:-translate-y-1 hover:border-primary/40"
            >
              <div
                className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary"
                aria-hidden="true"
              >
                <IconSparkles className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-display text-2xl font-semibold">
                {service.title}
              </h3>
              {service.shortDescription ? (
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {service.shortDescription}
                </p>
              ) : null}

              {service.features && service.features.length > 0 ? (
                <ul className="mt-5 space-y-2 text-sm">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex gap-2">
                      <ChevronRight
                        className="h-4 w-4 text-primary shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              ) : null}

              <div className="mt-auto flex flex-wrap gap-1.5 border-t border-border pt-4">
                {stack.map((tech) => (
                  <span
                    key={`${service.slug}-${tech}`}
                    className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground"
                  >
                    {tech}{" "}
                  </span>
                ))}
              </div>
              <Link
                href={`/services/${service.slug}/`}
                prefetch={false}
                className="group mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:scale-[1.02]"
              >
                Explore {service.title.split(" ")[0]}
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>
            </article>
          );
        })}
      </div>
    </Section>
  );
}

function Skills({ skills }: { skills: SkillItem[] }) {
  const groups = useMemo(() => buildSkillGroups(skills), [skills]);

  if (groups.length === 0) return null;

  return (
    <Section
      id="skills"
      eyebrow="Skills"
      title="The stack I work in every day."
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <div
            key={group.title}
            className="rounded-2xl border border-border bg-surface/60 p-6 shadow-card transition-all hover:-translate-y-1 hover:border-primary/40"
          >
            <h3 className="font-display text-xl font-semibold">
              {group.title}
            </h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {group.items.map((skill) => (
                <li
                  key={`${group.title}-${skill}`}
                  className="rounded-full border border-border bg-surface-elevated/60 px-3 py-1 text-xs text-muted-foreground"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Experience({ experiences }: { experiences: ExperienceItem[] }) {
  if (experiences.length === 0) return null;

  return (
    <Section
      id="experience"
      eyebrow="Experience"
      title="Nine years across analytics and AI."
    >
      <ol className="relative space-y-8 border-l border-border pl-6">
        {experiences.map((experience) => (
          <li
            key={`${experience.company}-${experience.position}`}
            className="relative"
          >
            <span
              className="shadow-glow absolute top-2 -left-[31px] h-3 w-3 rounded-full bg-primary"
              aria-hidden
            />
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-display text-2xl font-semibold">
                {experience.position}{" "}
                <span className="text-muted-foreground">
                  · {normalizeCompanyName(experience.company)}
                </span>
              </h3>
              <p className="text-xs text-muted-foreground">
                {formatPeriod(
                  experience.startDate,
                  experience.endDate,
                  experience.current,
                )}
                {experience.location ? ` · ${experience.location}` : ""}
              </p>
            </div>
            {experience.description ? (
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                {experience.description}
              </p>
            ) : null}
            {experience.achievements?.[0] ? (
              <p className="mt-3 inline-block rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary">
                ★ {experience.achievements[0]}
              </p>
            ) : null}
          </li>
        ))}
      </ol>
    </Section>
  );
}

function Certifications({
  certifications,
}: {
  certifications: CertificationItem[];
}) {
  if (certifications.length === 0) return null;

  return (
    <Section id="certifications" eyebrow="Credentials" title="Certifications.">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {certifications.map((certification) => (
          <a
            key={`${certification.name}-${certification.issuer}`}
            href={certification.credentialUrl || LINKEDIN_CERTS_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${certification.name} certification`}
            className="group flex flex-col rounded-xl border border-border bg-surface/50 p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-surface-elevated/60"
          >
            <p className="text-xs text-muted-foreground">
              {formatMonthYear(certification.issueDate)}
              {certification.issuer ? ` · ${certification.issuer}` : ""}
            </p>
            <p className="mt-1 text-sm text-foreground">{certification.name}</p>
            <p className="mt-3 inline-flex items-center gap-1 text-xs text-primary opacity-80 group-hover:opacity-100">
              View credential
              <ExternalLink className="h-3 w-3" aria-hidden />
            </p>
          </a>
        ))}
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        All credentials are listed on{" "}
        <a
          href={LINKEDIN_CERTS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-foreground"
        >
          LinkedIn
        </a>
        .
      </p>
    </Section>
  );
}

function Faq({ items }: { items: Array<{ q: string; a: string }> }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section id="faq" eyebrow="FAQ" title="Frequently asked questions.">
      <div className="mx-auto max-w-3xl divide-y divide-border rounded-2xl border border-border bg-surface/50">
        {items.map((item, index) => {
          const isOpen = open === index;
          const panelId = `faq-panel-${index}`;
          const buttonId = `faq-trigger-${index}`;

          return (
            <div key={item.q}>
              <h3 className="m-0">
                <button
                  id={buttonId}
                  type="button"
                  onClick={() => setOpen(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                >
                  <span className="font-display text-lg font-semibold">
                    {item.q}
                  </span>
                  <span
                    aria-hidden
                    className={`text-primary transition-transform ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>
              </h3>
              <section
                id={panelId}
                aria-labelledby={buttonId}
                hidden={!isOpen}
                className="px-6 pb-5 text-sm leading-relaxed text-muted-foreground"
              >
                {item.a}
              </section>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

function Contact({ profile }: { profile: Profile }) {
  const [prefill, setPrefill] = useState<Prefill>({});
  const [status, setStatus] = useState<{
    tone: "success" | "error";
    message: string;
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const read = () => {
      try {
        const raw = sessionStorage.getItem("contact-prefill");
        if (!raw) return;
        setPrefill(JSON.parse(raw) as Prefill);
        sessionStorage.removeItem("contact-prefill");
        window.setTimeout(() => {
          document
            .querySelector<HTMLInputElement>('input[name="name"]')
            ?.focus();
        }, 400);
      } catch {
        // Ignore malformed session storage entries.
      }
    };

    read();
    window.addEventListener("contact-prefill", read);
    return () => window.removeEventListener("contact-prefill", read);
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setStatus(null);

    startTransition(async () => {
      const result = await submitContactForm(formData);
      if (result.success) {
        form.reset();
        setPrefill({});
        setStatus({
          tone: "success",
          message: "Message sent. Madhu will reply as soon as possible.",
        });
        return;
      }

      setStatus({ tone: "error", message: result.error });
    });
  };

  return (
    <Section id="contact" eyebrow="Contact" title="Let's work together.">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-6">
          <p className="text-lg leading-relaxed text-muted-foreground">
            Have an AI, RAG, analytics, or full-stack product problem? Send me
            the problem statement, current stack, timeline, and desired business
            outcome. I will reply within 24 hours with whether I can help and
            what the best next step should be.
          </p>
          <ul className="space-y-3 text-sm">
            <ContactRow
              label="Email"
              value={profile.email}
              href={`mailto:${profile.email}`}
            />
            {profile.phone ? (
              <ContactRow
                label="Phone"
                value={profile.phone}
                href={`tel:${profile.phone.replace(/[^\d+]/g, "")}`}
              />
            ) : null}
            <ContactRow label="Location" value={profile.location} />
          </ul>
          <div className="flex flex-wrap gap-3 pt-2">
            {profile.socialLinks.github ? (
              <SocialLink
                href={profile.socialLinks.github}
                label="GitHub"
                icon={<IconBrandGithub className="h-4 w-4" />}
              />
            ) : null}
            {profile.socialLinks.linkedin ? (
              <SocialLink
                href={profile.socialLinks.linkedin}
                label="LinkedIn"
                icon={<IconBrandLinkedin className="h-4 w-4" />}
              />
            ) : null}
            {profile.socialLinks.twitter ? (
              <SocialLink
                href={profile.socialLinks.twitter}
                label="Twitter"
                icon={<IconBrandX className="h-4 w-4" />}
              />
            ) : null}
            {profile.socialLinks.website ? (
              <SocialLink
                href={profile.socialLinks.website}
                label="Blog"
                icon={
                  <div className="flex h-4 w-4 items-center justify-center overflow-hidden rounded-full border border-border/50 bg-surface shadow-inner">
                    <Image
                      src="/new-ui/logo.png"
                      alt="Blog icon"
                      aria-hidden="true"
                      width={16}
                      height={16}
                      className="h-full w-full object-cover"
                    />
                  </div>
                }
              />
            ) : null}
          </div>
        </div>

        <form
          key={`${prefill.subject ?? ""}|${prefill.message ?? ""}`}
          className="space-y-4 rounded-2xl border border-border bg-surface/60 p-6"
          onSubmit={handleSubmit}
        >
          <input type="text" name="hp_field" className="hidden" tabIndex={-1} />
          <Field
            label="Name"
            name="name"
            required
            defaultValue={prefill.name}
          />
          <Field
            label="Email"
            name="email"
            type="email"
            required
            defaultValue={prefill.email}
          />
          <Field
            label="Subject"
            name="subject"
            required
            defaultValue={prefill.subject}
          />
          <Field
            label="Message"
            name="message"
            textarea
            required
            defaultValue={prefill.message}
          />
          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Sending..." : "Send message"}
          </button>
          {status ? (
            <p
              className={`rounded-lg border px-4 py-3 text-sm ${
                status.tone === "success"
                  ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
                  : "border-destructive/30 bg-destructive/10 text-destructive-foreground"
              }`}
            >
              {status.message}
            </p>
          ) : null}
        </form>
      </div>
    </Section>
  );
}

function ContactRow({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="flex items-baseline justify-between gap-4 rounded-xl border border-border bg-surface/40 px-4 py-3">
      <span className="text-xs tracking-widest text-muted-foreground uppercase">
        {label}
      </span>
      <span className="text-sm">{value}</span>
    </div>
  );

  return href ? (
    <li>
      <a
        href={href}
        className="block transition-colors hover:[&_span]:text-primary"
      >
        {content}
      </a>
    </li>
  ) : (
    <li>{content}</li>
  );
}

function SocialLink({
  href,
  label,
  children,
  icon,
}: {
  href: string;
  label: string;
  children?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-full border border-border bg-white/5 px-4 py-2 text-sm hover:bg-surface-elevated hover:border-primary/30 transition-all duration-300"
    >
      {icon}
      {children}
      {label}
      <ExternalLink className="h-3.5 w-3.5" aria-hidden />
    </a>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  textarea,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  textarea?: boolean;
  defaultValue?: string;
}) {
  const className =
    "w-full rounded-lg border border-border bg-background/60 px-4 py-3 text-sm outline-none transition-colors focus:border-primary";

  const id = `contact-${name}`;

  return (
    <label htmlFor={id} className="block">
      <span className="mb-1.5 block text-xs tracking-widest text-muted-foreground uppercase">
        {label}
        {required ? " *" : ""}
      </span>
      {textarea ? (
        <textarea
          key={defaultValue ?? ""}
          id={id}
          name={name}
          required={required}
          rows={4}
          className={className}
          defaultValue={defaultValue}
        />
      ) : (
        <input
          key={defaultValue ?? ""}
          id={id}
          name={name}
          type={type}
          required={required}
          className={className}
          defaultValue={defaultValue}
        />
      )}
    </label>
  );
}

// Shared Footer is imported from @/components/Footer

function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <section
      id={id}
      ref={ref}
      className="scroll-mt-28 py-8 transition-all duration-700 md:py-12"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(20px)",
      }}
    >
      <div className="mx-auto w-[min(1400px,92%)]">
        <header className="mb-8 max-w-none">
          <p className="mb-3 text-xs tracking-[0.25em] text-primary uppercase">
            {eyebrow}
          </p>
          <h2 className="font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-[clamp(2.25rem,2.8vw,3.25rem)]">
            <span className="text-gradient">{title}</span>
          </h2>
        </header>
        {children}
      </div>
    </section>
  );
}

function useInView<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || inView) return;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px", ...options },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [inView, options]);

  return { ref, inView };
}

function useHydratedCountUp(target: string, start: boolean, duration = 1400) {
  const match = target.match(/^([^\d]*)(\d+(?:\.\d+)?)(.*)$/);
  const prefix = match?.[1] ?? "";
  const end = match ? Number.parseFloat(match[2].replace(/,/g, "")) : 0;
  const suffix = match?.[3] ?? "";
  const hasNumber = Boolean(match);

  const [isMounted, setIsMounted] = useState(false);
  const [value, setValue] = useState(end);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!start || !hasNumber || !isMounted) return;

    let raf = 0;
    const startTime = performance.now();
    setValue(0);

    const tick = (now: number) => {
      const progress = Math.min(1, (now - startTime) / duration);
      const eased = 1 - (1 - progress) ** 3;
      setValue(end * eased);
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, end, duration, hasNumber, isMounted]);

  if (!hasNumber) return target;
  if (!isMounted) return target;

  const formattedValue = Number.isInteger(end)
    ? Math.round(value).toLocaleString("en-US")
    : value.toFixed(1);

  return `${prefix}${formattedValue}${suffix}`;
}

function buildSkillGroups(skills: SkillItem[]) {
  const byName = new Map(
    skills.map((skill) => [skill.name.toLowerCase(), skill.name]),
  );
  const byCategory = (categories: string[], preferred: string[]) => {
    const preferredMatches = preferred
      .map((name) => byName.get(name.toLowerCase()))
      .filter((name): name is string => Boolean(name));
    const categoryMatches = skills
      .filter((skill) => skill.category && categories.includes(skill.category))
      .map((skill) => skill.name);

    return Array.from(new Set([...preferredMatches, ...categoryMatches])).slice(
      0,
      10,
    );
  };

  return [
    {
      title: "AI & LLM Engineering",
      items: byCategory(
        ["ai-ml"],
        [
          "OpenAI API",
          "RAG",
          "LangChain",
          "LangSmith",
          "Agentic AI",
          "Machine Learning",
          "NLP",
        ],
      ),
    },
    {
      title: "Backend & Data Engineering",
      items: byCategory(
        ["backend", "database", "devops", "cloud"],
        [
          "Python",
          "FastAPI",
          "SQL",
          "PostgreSQL",
          "Redis",
          "Docker",
          "GCP",
          "AWS",
        ],
      ),
    },
    {
      title: "Marketing & Product Analytics",
      items: byCategory(
        ["tools", "other"],
        [
          "Google Analytics",
          "BigQuery",
          "Dataiku",
          "Power BI",
          "Tableau",
          "Looker Studio",
          "Campaign Analytics",
        ],
      ),
    },
  ].filter((group) => group.items.length > 0);
}

function buildFaqItems() {
  return [
    {
      q: "Who is Madhu Dadi?",
      a: "Madhu Dadi is an AI and marketing analytics engineer based in Visakhapatnam, India, with 9+ years of experience across Novartis, redBus, GroupM, and Absolinsoft.",
    },
    {
      q: "What is Madhu Dadi best known for?",
      a: "He is best known for building production LLM/RAG applications, AI agents, AI visibility auditing systems, FastAPI/Next.js products, and analytics systems.",
    },
    {
      q: "When should someone hire Madhu Dadi?",
      a: "Hire Madhu when you need a hands-on engineer who can build AI products and connect them to measurable analytics outcomes.",
    },
    {
      q: "Is Madhu Dadi available for consulting?",
      a: "Madhu is open to full-time roles, consulting, freelance projects, and advisory work depending on scope and fit.",
    },
    {
      q: "What stack does Madhu Dadi use?",
      a: "Python, FastAPI, Next.js, React, TypeScript, SQL, Postgres, Redis, Celery, OpenAI API, LangChain, vector databases, GA4, and BigQuery.",
    },
  ];
}

function normalizeCompanyName(company: string) {
  if (/redbus/i.test(company)) return "redBus";
  if (/groupm/i.test(company)) return "GroupM";
  return company.replace(/\s*\([^)]*\)\s*/g, "").trim();
}

function formatPeriod(startDate: string, endDate?: string, current?: boolean) {
  const start = formatMonthYear(startDate);
  const end = current ? "Present" : formatMonthYear(endDate);
  return `${start} to ${end}`;
}

function formatMonthYear(value?: string) {
  if (!value) return "Present";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
