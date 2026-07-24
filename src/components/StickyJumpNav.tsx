"use client";

import { useEffect, useState } from "react";

export type StickyJumpNavItem = {
  id: string;
  label: string;
};

type StickyJumpNavProps = {
  items: StickyJumpNavItem[];
  /** Accessible name for the landmark. */
  "aria-label"?: string;
};

/**
 * Fixed in-page jump nav for the long homepage.
 * Appears after the hero; highlights the section in view.
 */
export function StickyJumpNav({
  items,
  "aria-label": ariaLabel = "Page sections",
}: StickyJumpNavProps) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (items.length < 2) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const hero = document.getElementById("home");
    const onScroll = () => {
      const threshold = hero ? hero.offsetHeight * 0.55 : 280;
      setVisible(window.scrollY > threshold);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const sectionEls = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (sectionEls.length === 0) {
      return () => window.removeEventListener("scroll", onScroll);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0) ||
              a.boundingClientRect.top - b.boundingClientRect.top,
          );
        if (intersecting[0]?.target?.id) {
          setActiveId(intersecting[0].target.id);
        }
      },
      {
        rootMargin: reduceMotion ? "-20% 0px -55% 0px" : "-25% 0px -50% 0px",
        threshold: [0.1, 0.25, 0.5],
      },
    );

    for (const el of sectionEls) observer.observe(el);

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, [items]);

  if (items.length < 2) return null;

  return (
    <div
      className={`fixed top-[4.25rem] right-0 left-0 z-40 sm:top-[4.75rem] motion-reduce:transition-none ${
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-2 opacity-0"
      } transition-[opacity,transform] duration-300`}
      aria-hidden={!visible}
    >
      <nav
        aria-label={ariaLabel}
        tabIndex={visible ? 0 : -1}
        className="mx-auto w-[min(1400px,94%)] overflow-x-auto rounded-full border border-border/80 bg-surface-elevated/90 px-2 py-1.5 shadow-lg shadow-black/15 backdrop-blur-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <ol className="flex min-w-max items-center gap-0.5">
          {items.map((item) => {
            const isActive = activeId === item.id;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  tabIndex={visible ? 0 : -1}
                  className={`inline-flex items-center rounded-full px-2.5 py-1.5 text-[11px] font-semibold tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:px-3 sm:text-xs ${
                    isActive
                      ? "bg-primary/15 text-primary border border-primary/25"
                      : "border border-transparent text-muted-foreground hover:bg-white/5 hover:text-foreground"
                  }`}
                  aria-current={isActive ? "true" : undefined}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
          <li className="ml-0.5 border-l border-border/50 pl-0.5">
            <a
              href="#home"
              tabIndex={visible ? 0 : -1}
              className="inline-flex items-center rounded-full border border-transparent px-2.5 py-1.5 text-[11px] font-semibold tracking-wide text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:px-3 sm:text-xs"
            >
              Top
            </a>
          </li>
        </ol>
      </nav>
    </div>
  );
}
