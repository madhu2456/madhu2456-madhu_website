"use client";

import dynamic from "next/dynamic";

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
  return (
    <h2 className="text-xl @md/hero:text-2xl @lg/hero:text-3xl text-muted-foreground font-medium min-h-[1.5em]">
      {staticText && words && words.length > 0 ? (
        <LayoutTextFlip
          text={staticText}
          words={words}
          duration={duration}
          className="text-xl @md/hero:text-2xl @lg/hero:text-3xl text-muted-foreground font-medium"
        />
      ) : (
        fallbackText
      )}
    </h2>
  );
}
