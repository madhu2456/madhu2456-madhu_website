"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// ssr: false must live in a Client Component — cannot be used in Server Components.
// This thin wrapper lets server components (e.g. HeroSection) import the
// 216-cell interactive grid without blocking initial paint.
const BackgroundRippleEffect = dynamic(
  () =>
    import("@/components/ui/background-ripple-effect").then(
      (m) => m.BackgroundRippleEffect,
    ),
  { ssr: false },
);

export function LazyBackgroundRippleEffect({ cellSize = 56 }: { cellSize?: number }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (enabled) return;

    const shouldEnable = () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      return window.innerWidth >= 1024 && !prefersReducedMotion;
    };

    const activate = () => {
      if (!shouldEnable()) {
        return;
      }
      setEnabled(true);
      for (const eventName of interactionEvents) {
        window.removeEventListener(eventName, activate);
      }
    };

    const interactionEvents = [
      "pointermove",
      "pointerdown",
      "keydown",
      "touchstart",
      "scroll",
    ] as const;

    for (const eventName of interactionEvents) {
      window.addEventListener(eventName, activate, {
        passive: true,
        once: true,
      });
    }

    return () => {
      for (const eventName of interactionEvents) {
        window.removeEventListener(eventName, activate);
      }
    };
  }, [enabled]);

  if (!enabled) {
    return null;
  }

  return <BackgroundRippleEffect cellSize={cellSize} />;
}
