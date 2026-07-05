"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export function AnimatedSection({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.section
      id={id}
      data-motion-initial
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.7 }}
      className="scroll-mt-28 py-8 md:py-12"
    >
      {children}
    </motion.section>
  );
}
