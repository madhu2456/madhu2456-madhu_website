import { formatLastUpdated } from "@/lib/utils";

type LastUpdatedProps = {
  date?: string | null;
  className?: string;
  prefix?: string;
};

/** Visible last-updated stamp for service/case-study freshness (AEO/GEO). */
export function LastUpdated({
  date,
  className = "text-xs text-muted-foreground",
  prefix = "Last updated",
}: LastUpdatedProps) {
  const label = formatLastUpdated(date);
  if (!label || !date) return null;

  const iso = (() => {
    const d = new Date(date);
    return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
  })();

  return (
    <p className={className}>
      {prefix} <time dateTime={iso}>{label}</time>
    </p>
  );
}
