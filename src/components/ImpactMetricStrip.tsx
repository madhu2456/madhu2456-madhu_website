import type { ImpactMetric } from "@/lib/portfolio-data";

type ImpactMetricStripProps = {
  metrics?: ImpactMetric[] | null;
  /** Max figures to show (audit: three-figure result strip). */
  max?: number;
  className?: string;
  /** Larger type for case-study hero. */
  size?: "sm" | "md";
};

/**
 * Outcome-first metric strip for case study cards and detail heroes.
 * Renders nothing when metrics are empty.
 */
export function ImpactMetricStrip({
  metrics,
  max = 3,
  className = "",
  size = "sm",
}: ImpactMetricStripProps) {
  const items = (metrics ?? []).filter((m) => m.value && m.label).slice(0, max);
  if (items.length === 0) return null;

  const valueClass =
    size === "md"
      ? "text-lg font-bold tracking-tight text-primary sm:text-xl"
      : "text-sm font-bold tracking-tight text-primary sm:text-base";
  const labelClass =
    size === "md"
      ? "mt-0.5 text-xs leading-snug text-muted-foreground sm:text-sm"
      : "mt-0.5 text-[10px] leading-snug text-muted-foreground sm:text-[11px]";
  const howClass =
    size === "md"
      ? "mt-1.5 text-[11px] leading-snug text-muted-foreground/80 sm:text-xs"
      : "mt-1 text-[10px] leading-snug text-muted-foreground/75";

  return (
    <dl
      className={`grid gap-2 sm:grid-cols-3 ${className}`}
      aria-label="Key results"
    >
      {items.map((metric) => (
        <div
          key={`${metric.value}-${metric.label}`}
          className="rounded-xl border border-border/60 bg-background/40 px-3 py-2.5"
        >
          <dt className={valueClass}>{metric.value}</dt>
          <dd>
            <p className={labelClass}>{metric.label}</p>
            {metric.howMeasured ? (
              <p className={howClass}>
                <span className="font-medium text-muted-foreground/90">
                  How measured:{" "}
                </span>
                {metric.howMeasured}
              </p>
            ) : null}
          </dd>
        </div>
      ))}
    </dl>
  );
}
