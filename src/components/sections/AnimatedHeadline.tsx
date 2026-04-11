"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";

const LayoutTextFlip = dynamic(
  () => import("@/components/ui/layout-text-flip").then((m) => m.LayoutTextFlip),
  { ssr: false },
);

interface AnimatedHeadlineProps {
  staticText: string;
  words: string[];
  duration: number;
  fallbackText: string;
}

export function AnimatedHeadline({
  staticText,
  words,
  duration,
  fallbackText,
}: AnimatedHeadlineProps) {
  const [enableAnimation, setEnableAnimation] = useState(false);

  const fallbackCopy = useMemo(() => {
    if (fallbackText) {
      return fallbackText;
    }
    if (staticText && words && words.length > 0) {
      return `${staticText} ${words[0]}`;
    }
    return staticText;
  }, [fallbackText, staticText, words]);

  useEffect(() => {
    if (!staticText || !words || words.length === 0) {
      setEnableAnimation(false);
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const shouldAnimate = window.innerWidth >= 1024 && !prefersReducedMotion;
    setEnableAnimation(shouldAnimate);
  }, [staticText, words]);

  return (
    <h2 className="text-xl @md/hero:text-2xl @lg/hero:text-3xl text-muted-foreground font-medium min-h-[1.5em]">
      {enableAnimation ? (
        <LayoutTextFlip
          text={staticText}
          words={words}
          duration={duration}
          className="text-xl @md/hero:text-2xl @lg/hero:text-3xl text-muted-foreground font-medium"
        />
      ) : (
        fallbackCopy
      )}
    </h2>
  );
}
