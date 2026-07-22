import { Section } from "@/components/Section";
import type { EducationItem } from "@/lib/portfolio-data";
import { formatPeriod } from "@/lib/utils";

type EducationProps = {
  education: EducationItem[];
};

/**
 * Visible education timeline (homepage + shared).
 * Source of truth: resume.pdf + portfolio-content.json education[].
 */
export function Education({ education }: EducationProps) {
  if (education.length === 0) return null;

  return (
    <Section id="education" eyebrow="Education" title="Academic background">
      <ol className="relative space-y-8 border-l border-border pl-6">
        {education.map((item) => (
          <li key={`${item.institution}-${item.degree}`} className="relative">
            <span
              className="shadow-glow absolute top-2 -left-[31px] h-3 w-3 rounded-full bg-primary"
              aria-hidden
            />
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-display text-2xl font-semibold">
                {item.degree}
                {item.fieldOfStudy ? (
                  <span className="text-muted-foreground">
                    {" "}
                    · {item.fieldOfStudy}
                  </span>
                ) : null}
              </h3>
              <p className="text-xs text-muted-foreground">
                {formatPeriod(item.startDate, item.endDate, item.current)}
              </p>
            </div>
            <p className="mt-1 text-base font-medium text-foreground/90">
              {item.website ? (
                <a
                  href={item.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-offset-4 hover:text-primary hover:underline"
                >
                  {item.institution}
                </a>
              ) : (
                item.institution
              )}
            </p>
            {item.gpa ? (
              <p className="mt-1 text-sm text-muted-foreground">
                Grade: {item.gpa}
              </p>
            ) : null}
            {item.description ? (
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            ) : null}
            {item.achievements?.[0] ? (
              <p className="mt-3 inline-block rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary">
                ★ {item.achievements[0]}
              </p>
            ) : null}
          </li>
        ))}
      </ol>
    </Section>
  );
}
