export type PageTocItem = {
  id: string;
  label: string;
};

type PageTocProps = {
  items: PageTocItem[];
  className?: string;
  /** Accessible name for the landmark (defaults to “On this page”). */
  "aria-label"?: string;
};

/**
 * Compact in-page jump nav for long service/case pages.
 * Renders nothing when fewer than two destinations exist.
 */
export function PageToc({
  items,
  className = "",
  "aria-label": ariaLabel = "On this page",
}: PageTocProps) {
  if (items.length < 2) return null;

  return (
    <nav
      aria-label={ariaLabel}
      className={`rounded-2xl border border-border/60 bg-surface/20 p-4 sm:p-5 ${className}`}
    >
      <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
        On this page
      </p>
      <ol className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="inline-flex items-center rounded-full border border-border/70 bg-background/40 px-3 py-1.5 text-xs font-medium text-foreground/90 transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
