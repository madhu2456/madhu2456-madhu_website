import { IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";
import {
  type RelatedLearningLink,
  relatedLearningKindLabel,
} from "@/lib/seo/service-related-learning";

type RelatedReadingProps = {
  items: RelatedLearningLink[];
  /** Section heading (default: Related reading). */
  title?: string;
  className?: string;
  /** Optional landmark id for ToC jump links. */
  id?: string;
};

/**
 * 3-card related reading block for service + consultant landers (audit M5).
 * Renders nothing when fewer than one link is provided.
 */
export function RelatedReading({
  items,
  title = "Related reading",
  className = "",
  id = "related-reading",
}: RelatedReadingProps) {
  if (items.length === 0) return null;

  return (
    <section
      id={id}
      className={`scroll-mt-28 space-y-4 ${className}`}
      aria-labelledby={`${id}-heading`}
    >
      <h2
        id={`${id}-heading`}
        className="text-xl font-bold tracking-tight border-b border-border/80 pb-2"
      >
        {title}
      </h2>
      <p className="text-sm text-muted-foreground max-w-2xl">
        Guides, case studies, and tools that deepen this topic—use these for
        internal context before a discovery call.
      </p>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const external = item.href.startsWith("http");
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                {...(external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : { prefetch: false })}
                className="group flex h-full flex-col rounded-2xl border border-border/70 bg-surface/30 p-5 transition-colors hover:border-primary/40 hover:bg-surface/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <span className="text-[10px] font-semibold tracking-wider text-primary uppercase">
                  {relatedLearningKindLabel(item.kind)}
                </span>
                <span className="mt-2 flex-1 text-sm font-medium leading-snug text-foreground group-hover:text-primary">
                  {item.label}
                </span>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground group-hover:text-primary">
                  Read
                  <IconArrowRight
                    className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
