"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

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
  return (
    <motion.section
      id={id}
      data-motion-initial
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7 }}
      className="scroll-mt-28 py-8 md:py-12"
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
    </motion.section>
  );
}
