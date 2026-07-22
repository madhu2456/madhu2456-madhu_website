import { Section } from "@/components/Section";
import type { ExperienceItem } from "@/lib/portfolio-data";
import { formatPeriod, normalizeCompanyName } from "@/lib/utils";

type ExperienceProps = {
  experiences: ExperienceItem[];
  /** CMS profile.yearsOfExperience — display only; do not invent a new value. */
  yearsOfExperience?: number | null;
};

export function Experience({
  experiences,
  yearsOfExperience,
}: ExperienceProps) {
  if (experiences.length === 0) return null;

  const yearsLabel =
    typeof yearsOfExperience === "number" &&
    Number.isFinite(yearsOfExperience) &&
    yearsOfExperience > 0
      ? `${yearsOfExperience}+ years since first full-time role (2016).`
      : "Experience across analytics and AI.";

  return (
    <Section id="experience" eyebrow="Experience" title={yearsLabel}>
      <p className="mb-8 max-w-3xl text-sm leading-relaxed text-muted-foreground">
        Timeline matches the résumé: industry roles from May 2016, MBA at IIM
        Amritsar (2018–2020) in the Education section below, then GroupM →
        redBus → Novartis (current full-time). Independent consulting is offered
        alongside where policy allows—not instead of disclosing the day job.
      </p>
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
                {experience.current ? (
                  <span className="ml-2 align-middle text-xs font-medium tracking-wide text-primary uppercase">
                    Current full-time
                  </span>
                ) : null}
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
