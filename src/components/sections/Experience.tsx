import { Section } from "@/components/Section";
import type { ExperienceItem } from "@/lib/portfolio-data";
import { formatPeriod, normalizeCompanyName } from "@/lib/utils";

export function Experience({ experiences }: { experiences: ExperienceItem[] }) {
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