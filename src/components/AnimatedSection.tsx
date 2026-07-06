"use client";

import { useReducedMotion } from "motion/react";
import dynamic from "next/dynamic";
import type { ReactNode } from "react";

const MotionSection = dynamic(
  () => import("motion/react").then((mod) => mod.motion.section),
  {
    ssr: false,
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
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      {children}
    </MotionSection>
  );
}
