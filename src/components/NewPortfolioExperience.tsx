"use client";

import {
  IconAward,
  IconChartBar,
  IconSparkles,
  IconTrendingUp,
} from "@tabler/icons-react";
import { ArrowRight, ExternalLink } from "lucide-react";
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
} from "@/lib/portfolio-data";

type NewPortfolioExperienceProps = {
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

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Work" },
  { href: "#services", label: "Services" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
];

const LINKEDIN_CERTS_URL =
  "https://www.linkedin.com/in/madhu-dadi-54684531/details/certifications/";

export function NewPortfolioExperience({
  profile,
  skills,
  experiences,
  projects,
  services,
  certifications,
}: NewPortfolioExperienceProps) {
  const faqItems = useMemo(
    () => buildFaqItems(profile, skills, experiences),
    [profile, skills, experiences],
  );

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <Header profile={profile} />
      <main id="main">
        <Hero profile={profile} experiences={experiences} />
        <Stats stats={profile.stats} />
        <About profile={profile} />
        <Projects projects={projects} />
        <Services services={services} />
        <Skills skills={skills} />
        <Experience experiences={experiences} />
        <Certifications certifications={certifications} />
        <Faq items={faqItems} />
        <Contact profile={profile} />
      </main>
      <Footer profile={profile} projects={projects} />
    </div>
  );
}

export function Header({ profile }: { profile: Profile }) {
  const [isClient, setIsClient] = useState(false);
  const [isCaseStudy, setIsCaseStudy] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      setIsCaseStudy(window.location.pathname.includes("/case-studies"));
    }
  }, []);

  const scrollActive = useActiveSection(
    navLinks.map((link) => link.href.slice(1)),
  );
  const [active, setActive] = useState("");

  useEffect(() => {
    if (isCaseStudy) {
      setActive("projects");
    } else {
      setActive(scrollActive || "about");
    }
  }, [scrollActive, isCaseStudy]);

  const getHref = (href: string) => {
    if (!isClient) return href;
    return isCaseStudy ? `/${href}` : href;
  };

  const getLogoHref = () => {
    if (!isClient) return "#main";
    return isCaseStudy ? "/" : "#main";
  };

  return (
    <header className="fixed top-0 right-0 left-0 z-50">
      <div className="mx-auto mt-3 flex w-[min(1400px,94%)] items-center justify-between rounded-full border border-border/90 bg-surface-elevated/85 px-3 py-2 sm:mt-4 sm:px-5 sm:py-3 shadow-lg shadow-black/20 backdrop-blur-md">
        <a
          href={getLogoHref()}
          className="group flex items-center gap-2.5 font-display text-base font-semibold tracking-tight transition-colors hover:text-primary sm:text-lg"
          aria-label="Madhu Dadi home"
        >
          <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-border/80 bg-surface shadow-inner transition-all duration-300 group-hover:scale-105 group-hover:border-primary/30">
            <Image
              src="/new-ui/logo.png"
              alt=""
              aria-hidden
              width={32}
              height={32}
              className="h-full w-full object-cover"
            />
          </div>
          <span className="text-foreground/90 transition-colors group-hover:text-foreground">
            {profile.firstName}&nbsp;{profile.lastName}
          </span>
        </a>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-1 rounded-full border border-border/30 bg-black/30 p-1 md:flex"
        >
          {navLinks.map((link) => {
            const id = link.href.slice(1);
            const isActive = active === id;

            return (
              <a
                key={link.href}
                href={getHref(link.href)}
                aria-current={isActive ? "location" : undefined}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide transition-all duration-300 ${
                  isActive
                    ? "bg-primary/15 text-primary border border-primary/20 shadow-sm"
                    : "text-muted-foreground border border-transparent hover:bg-white/5 hover:text-foreground"
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={() =>
            prefillContact({
              subject: "Hiring inquiry, full-time AI & Analytics Engineer",
              message:
                "Hi Madhu,\n\nWe'd like to talk about a full-time role.\n\nCompany:\nRole / team:\nLocation (remote, hybrid, onsite):\nTech stack:\nIdeal start date:\n\nLooking forward to connecting.",
            })
          }
          className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm shadow-primary/25 transition-all duration-300 hover:scale-[1.04] hover:shadow-glow sm:px-5 sm:text-sm"
        >
          Hire me
        </button>
      </div>
    </header>
  );
}

function Hero({
  profile,
  experiences,
}: {
  profile: Profile;
  experiences: ExperienceItem[];
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
            Available now · Replies within 24 hours
          </p>
          <p className="mb-3 font-display text-[11px] tracking-[0.18em] text-muted-foreground uppercase sm:text-sm sm:tracking-[0.2em]">
            {profile.firstName} {profile.lastName}, {profile.headline}
          </p>
          <h1 className="font-display text-[clamp(2rem,8vw,4.75rem)] leading-[1.15] font-bold tracking-tight sm:leading-[1.1]">
            I build{" "}
            <span className="text-gradient-amber italic inline-block">AI</span>{" "}
            <span className="text-gradient-amber italic inline-block">
              that
            </span>{" "}
            <span className="text-gradient-amber italic inline-block">
              actually
            </span>{" "}
            <span className="text-gradient-amber italic inline-block">
              ships
            </span>
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            and moves{" "}
            <span className="text-gradient">numbers you care about.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:mt-6 sm:text-lg">
            {profile.shortBio}
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center">
            <button
              type="button"
              onClick={() =>
                prefillContact({
                  subject: "Intro call, AI consulting",
                  message:
                    "Hi Madhu,\n\nI'd like to book a 20-minute intro call to discuss:\n\nWhat I'm trying to build:\nTimeline:\nBudget range:\n\nThanks!",
                })
              }
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:scale-[1.03] sm:px-6"
            >
              Book a 20-min intro call
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </button>
            <a
              href="#projects"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-white/5 px-5 py-3 text-sm font-medium hover:bg-surface-elevated hover:border-primary/30 sm:px-6 transition-all duration-300"
            >
              See case studies
            </a>
          </div>
          {workedAt.length > 0 ? (
            <div className="mt-8 sm:mt-10">
              <p className="mb-3 text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
                Worked at
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
  const display = useCountUp(value, start);

  const getIcon = (label: string) => {
    const l = label.toLowerCase();
    if (l.includes("experience") || l.includes("year")) {
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
      l.includes("retention")
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
        opacity: start ? 1 : 0,
        transform: start ? "translateY(0)" : "translateY(20px)",
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

      <dd className="text-gradient-amber font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
        {display}
      </dd>

      <dt className="mt-3 text-xs font-semibold text-foreground/90 tracking-wider uppercase sm:text-sm">
        {label}
      </dt>
    </div>
  );
}

function About({ profile }: { profile: Profile }) {
  const formatBioText = (text: string) => {
    const highlights = [
      "build AI",
      "LLMs, RAG, and AI agents",
      "marketing data",
    ];
    let result: (string | ReactNode)[] = [text];

    for (const phrase of highlights) {
      const nextResult: (string | ReactNode)[] = [];
      for (const part of result) {
        if (typeof part !== "string") {
          nextResult.push(part);
          continue;
        }

        const index = part.indexOf(phrase);
        if (index === -1) {
          nextResult.push(part);
          continue;
        }

        const before = part.slice(0, index);
        const after = part.slice(index + phrase.length);

        if (before) nextResult.push(before);
        nextResult.push(
          <strong
            key={`${phrase}-${index}`}
            className="font-semibold text-foreground"
          >
            {phrase}
          </strong>,
        );
        if (after) nextResult.push(after);
      }
      result = nextResult;
    }

    return result;
  };

  return (
    <Section
      id="about"
      eyebrow="About"
      title="Strategy and execution, together."
    >
      <div className="grid gap-10 lg:grid-cols-3">
        <div className="space-y-4 text-lg leading-relaxed text-muted-foreground lg:col-span-2">
          {profile.fullBioParagraphs.slice(0, 2).map((paragraph) => (
            <p key={paragraph}>{formatBioText(paragraph)}</p>
          ))}
        </div>
        <ul className="space-y-3 text-sm">
          {[
            "Small, senior team. Usually just me.",
            "Evals and monitoring ship with the launch.",
            "You keep the code, the docs, and the keys.",
            "Shipped in healthcare, travel, media, and SaaS.",
          ].map((item) => (
            <li
              key={item}
              className="flex gap-3 rounded-xl border border-border bg-surface/50 px-4 py-3"
            >
              <span className="text-primary">◆</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </Section>
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
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
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
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                  <Link
                    href={`/case-studies/${project.slug}/`}
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
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                ◇
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
                      <span className="text-primary">›</span>
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
                    {tech}
                  </span>
                ))}
              </div>
              <button
                type="button"
                onClick={() =>
                  prefillContact({
                    subject: `${service.title}, project inquiry`,
                    message: `Hi Madhu,\n\nI'm interested in your ${service.title} work.\n\nWhat I'm trying to build:\nTimeline:\nCurrent stack / context:\n\nThanks!`,
                  })
                }
                className="group mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:scale-[1.02]"
              >
                Start a {service.title.split(" ")[0]} project
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </button>
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
            Wherever you are in the world, drop a note about your problem and
            I&apos;ll respond within 24 hours with whether and how I can help.
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
              <SocialLink href={profile.socialLinks.github} label="GitHub" />
            ) : null}
            {profile.socialLinks.linkedin ? (
              <SocialLink
                href={profile.socialLinks.linkedin}
                label="LinkedIn"
              />
            ) : null}
            {profile.socialLinks.twitter ? (
              <SocialLink href={profile.socialLinks.twitter} label="Twitter" />
            ) : null}
            {profile.socialLinks.website ? (
              <SocialLink href={profile.socialLinks.website} label="Blog" />
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
}: {
  href: string;
  label: string;
  children?: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-full border border-border bg-white/5 px-4 py-2 text-sm hover:bg-surface-elevated hover:border-primary/30 transition-all duration-300"
    >
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

function Footer({
  profile,
  projects,
}: {
  profile: Profile;
  projects: ProjectItem[];
}) {
  const sitemap = [
    {
      heading: "Explore",
      links: [
        { label: "About", href: "#about" },
        { label: "Work", href: "#projects" },
        { label: "Services", href: "#services" },
        { label: "Experience", href: "#experience" },
        { label: "FAQ", href: "#faq" },
        { label: "Contact", href: "#contact" },
      ],
    },
    {
      heading: "Case studies",
      links: [
        ...projects.slice(0, 3).map((project) => ({
          label: project.title,
          href: `/case-studies/${project.slug}/`,
        })),
        { label: "All case studies", href: "/case-studies/" },
      ],
    },
    {
      heading: "Connect",
      links: [
        { label: "Email", href: `mailto:${profile.email}` },
        ...(profile.socialLinks.linkedin
          ? [{ label: "LinkedIn", href: profile.socialLinks.linkedin }]
          : []),
        ...(profile.socialLinks.github
          ? [{ label: "GitHub", href: profile.socialLinks.github }]
          : []),
        ...(profile.socialLinks.website
          ? [{ label: "Blog", href: profile.socialLinks.website }]
          : []),
      ],
    },
  ];

  return (
    <footer className="border-t border-border bg-surface/30 py-12">
      <div className="mx-auto w-[min(1400px,92%)]">
        <nav
          aria-label="Footer"
          className="grid gap-8 sm:grid-cols-2 md:grid-cols-3"
        >
          {sitemap.map((column) => (
            <div key={column.heading}>
              <h2 className="mb-3 text-xs tracking-widest text-muted-foreground uppercase">
                {column.heading}
              </h2>
              <ul className="space-y-2 text-sm">
                {column.links.map((link) => (
                  <li key={`${column.heading}-${link.href}`}>
                    <FooterLink href={link.href}>{link.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-border/60 pt-6 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Madhu Dadi. Built with intention.</p>
          <p>{profile.location} · Available worldwide</p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  const isInternal = href.startsWith("/");
  const isHash = href.startsWith("#");

  if (isInternal) {
    return (
      <Link
        href={href}
        className="text-foreground/80 underline-offset-4 hover:text-foreground hover:underline"
      >
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      {...(!isHash && !href.startsWith("mailto:")
        ? { target: "_blank", rel: "noreferrer" }
        : {})}
      className="text-foreground/80 underline-offset-4 hover:text-foreground hover:underline"
    >
      {children}
    </a>
  );
}

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

function useCountUp(target: string, start: boolean, duration = 1400) {
  const match = target.match(/^([^\d]*)(\d+(?:\.\d+)?)(.*)$/);
  const prefix = match?.[1] ?? "";
  const end = match ? Number.parseFloat(match[2]) : 0;
  const suffix = match?.[3] ?? "";
  const hasNumber = Boolean(match);
  const [value, setValue] = useState(hasNumber ? 0 : end);

  useEffect(() => {
    if (!start || !hasNumber) return;

    let raf = 0;
    const startTime = performance.now();
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
  }, [start, end, duration, hasNumber]);

  if (!hasNumber) return target;
  return `${prefix}${Number.isInteger(end) ? Math.round(value) : value.toFixed(1)}${suffix}`;
}

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0] ?? "");
  const intersectionStates = useRef<Record<string, boolean>>({});

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // 1. Record the intersection state of changed elements
        for (const entry of entries) {
          intersectionStates.current[entry.target.id] = entry.isIntersecting;
        }

        // 2. Gather all currently intersecting section IDs
        const intersectingIds = Object.keys(intersectionStates.current).filter(
          (id) => intersectionStates.current[id],
        );

        if (intersectingIds.length === 0) return;

        // 3. Find which intersecting section is closest to the viewing window's top-margin (navbar focus area ~120px)
        let bestId = active;
        let minDistance = Number.MAX_VALUE;

        for (const id of intersectingIds) {
          const el = document.getElementById(id);
          if (!el) continue;
          const rect = el.getBoundingClientRect();
          const distance = Math.abs(rect.top - 120);

          if (distance < minDistance) {
            minDistance = distance;
            bestId = id;
          }
        }

        if (bestId && bestId !== active) {
          setActive(bestId);
        }
      },
      // rootMargin: starts below navbar (~100px) down to 80% screen height to cover fluid scrolling
      { rootMargin: "-100px 0px -20% 0px", threshold: 0 },
    );

    for (const element of elements) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [ids, active]);

  return active;
}

function setContactPrefill(prefill: Prefill) {
  try {
    sessionStorage.setItem("contact-prefill", JSON.stringify(prefill));
    window.dispatchEvent(new Event("contact-prefill"));
  } catch {
    // Contact prefill is progressive enhancement.
  }
}

function prefillContact(prefill: Prefill) {
  setContactPrefill(prefill);
  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
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

function buildFaqItems(
  profile: Profile,
  skills: SkillItem[],
  experiences: ExperienceItem[],
) {
  const skillNames = skills
    .map((skill) => skill.name)
    .filter(Boolean)
    .slice(0, 8)
    .join(", ");
  const companies = experiences
    .map((experience) => normalizeCompanyName(experience.company))
    .filter(Boolean)
    .slice(0, 4)
    .join(", ");

  return [
    {
      q: `What does ${profile.firstName} build?`,
      a: "LLM and RAG features inside real products, marketing analytics that teams use to make decisions, and the full-stack code that holds both together.",
    },
    {
      q: "Where has he worked?",
      a: companies
        ? `${companies}. ${profile.yearsOfExperience}+ years in total.`
        : `${profile.yearsOfExperience}+ years across AI, analytics, and product engineering.`,
    },
    {
      q: "Is he open to full-time roles?",
      a:
        profile.availability === "unavailable"
          ? "He is not actively available right now, but the best way to confirm is to reach out directly."
          : "Yes. He is open to a full-time position where he can own AI and analytics end-to-end on a serious product team.",
    },
    {
      q: "What's his core stack?",
      a:
        skillNames ||
        "Python, TypeScript, FastAPI, Next.js, SQL, and modern AI engineering tools.",
    },
    {
      q: "What's the fastest way to reach him?",
      a: `Email ${profile.email}${
        profile.phone ? ` or call ${profile.phone}` : ""
      }. He replies within a day.`,
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
