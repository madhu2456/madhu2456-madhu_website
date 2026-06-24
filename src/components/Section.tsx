"use client";

import type { ReactNode } from "react";
import { useInView } from "@/lib/useInView";

export function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <section
      id={id}
      ref={ref}
      className="scroll-mt-28 py-8 transition-all duration-700 md:py-12"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(20px)",
      }}
    >
      <div className="mx-auto w-[min(1400px,92%)]">
        <header className="mb-8 max-w-none">
          <p className="mb-3 text-xs tracking-[0.25em] text-primary uppercase">
            {eyebrow}
          </p>
          <h2 className="font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-[clamp(2.25rem,2.8vw,3.25rem)]">
            <span className="text-gradient">{title}</span>
          </h2>
        </header>
        {children}
      </div>
    </section>
  );
}
