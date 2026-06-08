"use client";

import { useEffect, useState } from "react";
import type { TocEntry } from "@/lib/guide-markdown";

export function GuideTableOfContents({ toc }: { toc: TocEntry[] }) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -80% 0px" },
    );

    toc.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [toc]);

  if (toc.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
        Table of Contents
      </h3>
      <nav className="flex flex-col gap-2 text-sm">
        {toc.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`transition-colors hover:text-primary ${
              item.level === 3 ? "ml-4" : ""
            } ${
              activeId === item.id
                ? "font-semibold text-foreground"
                : "text-muted-foreground"
            }`}
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById(item.id);
              if (el) {
                el.scrollIntoView({ behavior: "smooth" });
                setActiveId(item.id);
                // Update URL hash without scroll jump
                history.pushState(null, "", `#${item.id}`);
              }
            }}
          >
            {item.title}
          </a>
        ))}
      </nav>
    </div>
  );
}
