import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { TrackedLink } from "@/components/TrackedLink";
import type {
  ExperienceItem,
  PageContent,
  Profile,
} from "@/lib/portfolio-data";
import { normalizeCompanyName } from "@/lib/utils";

export function Hero({
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
            {(pageContent.home.introParagraphs || []).map((para) => (
              <p key={para}>{para}</p>
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
            <TrackedLink
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              gtmEvent="resume_download"
              gtmData={{ download_type: "pdf", download_location: "hero" }}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-white/5 px-5 py-3 text-sm font-medium hover:bg-surface-elevated hover:border-primary/30 sm:px-6 transition-all duration-300"
            >
              Resume
            </TrackedLink>
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
                      <span aria-hidden className="text-muted-foreground/60">
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
              fetchPriority="high"
              sizes="(min-width: 1024px) 44vw, 92vw"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="glass absolute right-3 bottom-3 left-3 rounded-xl p-3 sm:right-5 sm:bottom-5 sm:left-5 sm:rounded-2xl sm:p-4">
            <p className="font-display text-base italic sm:text-lg">
              Let's build something meaningful.
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
