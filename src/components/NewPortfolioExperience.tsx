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
  useState,
  useTransition,
} from "react";
import { submitContactForm } from "@/app/actions/submit-contact-form";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { Experience } from "@/components/sections/Experience";
import { formatMonthYear } from "@/lib/utils";
import { FormattedText } from "@/components/FormattedText";
import { Header } from "@/components/Header";
import { SafeEmailLink } from "@/components/SafeEmailLink";
import { Section } from "@/components/Section";
import {
  normalizeImageSource,
  shouldUseUnoptimizedImage,
} from "@/lib/image-source";
import type {
  CertificationItem,
  ExperienceItem,
  NavigationItem,
  PageContent,
  Profile,
  ProjectItem,
  ServiceItem,
  SkillItem,
} from "@/lib/portfolio-data";
import { useInView } from "@/lib/useInView";

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
  const faqItems = useMemo(
    () =>
      pageContent.home.faqItems?.map((item) => ({
        q: item.question,
        a: item.answer,
      })) || [],
    [pageContent.home.faqItems],
  );

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <Header profile={profile} navigationItems={navigationItems} />
      <main id="main-content" className="min-h-screen">
        <Hero
          profile={profile}
          experiences={experiences}
          pageContent={pageContent}
        />
        <DirectAnswer pageContent={pageContent} />
        <Stats stats={profile.stats} />
        <Projects projects={projects} />
        <Services services={services} />
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


function DirectAnswer({ pageContent }: { pageContent: PageContent }) {
  return (
    <Section
      id="about"
      eyebrow="Direct Answer"
      title={pageContent.home.directAnswer?.title || "Who is Madhu Dadi?"}
    >
      <div className="relative flex min-h-56 flex-col justify-between overflow-hidden rounded-3xl border border-border/80 bg-surface/35 p-8 backdrop-blur-md md:p-10">
        <div className="absolute top-0 right-0 h-40 w-40 bg-primary/5 rounded-full blur-3xl -z-10" />
        <div className="grid gap-8 sm:grid-cols-2 lg:gap-12 text-sm sm:text-base leading-relaxed text-muted-foreground">
          <div className="space-y-4">
            {(pageContent.home.directAnswer?.paragraphs || [])
              .slice(
                0,
                Math.ceil(
                  (pageContent.home.directAnswer?.paragraphs?.length || 0) / 2,
                ),
              )
              .map((para) => (
                <p key={para}>{para}</p>
              ))}
          </div>
          <div className="space-y-4">
            {(pageContent.home.directAnswer?.paragraphs || [])
              .slice(
                Math.ceil(
                  (pageContent.home.directAnswer?.paragraphs?.length || 0) / 2,
                ),
              )
              .map((para) => (
                <p key={para}>{para}</p>
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
      {href.startsWith("mailto:") ? (
        <SafeEmailLink
          email={href.replace("mailto:", "")}
          className="block transition-colors hover:[&_span]:text-primary"
        >
          {content}
        </SafeEmailLink>
      ) : (
        <a
          href={href}
          className="block transition-colors hover:[&_span]:text-primary"
        >
          {content}
        </a>
      )}
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
  const grouped = new Map<string, string[]>();
  for (const skill of skills) {
    const cat = skill.category || "other";
    if (!grouped.has(cat)) grouped.set(cat, []);
    grouped.get(cat)?.push(skill.name);
  }

  return [
    { title: "AI / LLM", items: grouped.get("ai-llm") || [] },
    { title: "Analytics", items: grouped.get("analytics") || [] },
    { title: "Data / Cloud", items: grouped.get("data-cloud") || [] },
    { title: "Marketing", items: grouped.get("marketing") || [] },
    { title: "Product", items: grouped.get("product") || [] },
  ].filter((group) => group.items.length > 0);
}



