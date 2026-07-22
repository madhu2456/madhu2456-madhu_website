import { IconAward, IconExternalLink, IconQuote } from "@tabler/icons-react";
import Link from "next/link";
import { Section } from "@/components/Section";
import type { PageContent, ProjectItem } from "@/lib/portfolio-data";

type Testimonial = NonNullable<
  NonNullable<PageContent["home"]["testimonials"]>[number]
>;

type Award = PageContent["credentials"]["awards"][number];

type SocialProofProps = {
  awards: Award[];
  projects: ProjectItem[];
  testimonials?: Testimonial[] | null;
  linkedInUrl?: string | null;
};

/**
 * Verifiable proof layer (audit §7.4).
 * Prefer employer awards + case-study metrics over empty self-praise.
 * Named testimonials render only when present in CMS (never invented).
 */
export function SocialProof({
  awards,
  projects,
  testimonials,
  linkedInUrl,
}: SocialProofProps) {
  const quotes = (testimonials || []).filter((t) => t.quote && t.name);
  const outcomeCards = projects
    .filter((p) => p.featured || p.impactMetrics?.length)
    .slice(0, 3)
    .map((p) => {
      const metric = p.impactMetrics?.[0];
      return {
        slug: p.slug,
        title: p.title,
        line: metric
          ? `${metric.value} ${metric.label}`.trim()
          : p.impactSummary || p.tagline || "",
      };
    })
    .filter((c) => c.line);

  if (awards.length === 0 && outcomeCards.length === 0 && quotes.length === 0) {
    return null;
  }

  return (
    <Section
      id="proof"
      eyebrow="Proof"
      title="Outcomes and recognition you can verify"
    >
      <p className="mb-8 max-w-3xl text-sm leading-relaxed text-muted-foreground">
        Employer awards and production case-study metrics are listed below.
        Named client or colleague quotes appear only when permission is
        granted—never invented for the page.
      </p>

      {awards.length > 0 ? (
        <div className="mb-10">
          <h3 className="mb-4 text-sm font-semibold tracking-widest text-muted-foreground uppercase">
            Employer awards
          </h3>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {awards.map((award) => (
              <li
                key={`${award.organization}-${award.title}`}
                className="rounded-2xl border border-border bg-surface/40 p-5"
              >
                <p className="inline-flex items-center gap-2 text-xs font-semibold text-primary">
                  <IconAward className="h-4 w-4" aria-hidden />
                  {award.organization}
                </p>
                <p className="mt-2 font-display text-lg font-semibold text-foreground">
                  {award.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {award.description}
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">
            Full context on the{" "}
            <Link
              href="/credentials/#awards-recognition"
              className="text-primary underline-offset-4 hover:underline"
            >
              credentials page
            </Link>
            .
          </p>
        </div>
      ) : null}

      {outcomeCards.length > 0 ? (
        <div className="mb-10">
          <h3 className="mb-4 text-sm font-semibold tracking-widest text-muted-foreground uppercase">
            Case-study outcomes
          </h3>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {outcomeCards.map((card) => (
              <li key={card.slug}>
                <Link
                  href={`/case-studies/${card.slug}/`}
                  className="block h-full rounded-2xl border border-border bg-surface/40 p-5 transition-colors hover:border-primary/40"
                >
                  <p className="text-xs font-semibold tracking-wide text-primary uppercase">
                    {card.title}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                    {card.line}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary">
                    Read case study
                    <IconExternalLink className="h-3 w-3" aria-hidden />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {quotes.length > 0 ? (
        <div className="mb-6">
          <h3 className="mb-4 text-sm font-semibold tracking-widest text-muted-foreground uppercase">
            Recommendations
          </h3>
          <ul className="grid gap-4 md:grid-cols-2">
            {quotes.map((t) => (
              <li
                key={`${t.name}-${t.quote.slice(0, 24)}`}
                className="rounded-2xl border border-border bg-surface/40 p-6"
              >
                <IconQuote
                  className="mb-3 h-5 w-5 text-primary/80"
                  aria-hidden
                />
                <blockquote className="text-sm leading-relaxed text-foreground/90">
                  “{t.quote}”
                </blockquote>
                <p className="mt-4 text-sm font-semibold text-foreground">
                  {t.name}
                </p>
                {(t.role || t.company) && (
                  <p className="text-xs text-muted-foreground">
                    {[t.role, t.company].filter(Boolean).join(" · ")}
                  </p>
                )}
                {t.sourceUrl ? (
                  <a
                    href={t.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    Source
                    <IconExternalLink className="h-3 w-3" aria-hidden />
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : linkedInUrl ? (
        <p className="text-sm text-muted-foreground">
          Named written recommendations live on{" "}
          <a
            href={linkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            LinkedIn
          </a>
          . I can republish quotes here with permission—ask if you want them on
          this page.
        </p>
      ) : null}
    </Section>
  );
}
