"use client";

import { useReducedMotion } from "motion/react";
import dynamic from "next/dynamic";
import type { ReactNode } from "react";

const MotionSection = dynamic(
  () => import("motion/react").then((mod) => mod.motion.section),
  {
    ssr: true,
  },
);

export function AnimatedSection({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <MotionSection
      id={id}
      data-motion-initial
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.7 }}
      className="scroll-mt-28 py-8 md:py-12"
    >
      {children}
    </MotionSection>
  );
}
