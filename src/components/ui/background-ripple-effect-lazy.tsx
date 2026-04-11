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
    };

    if (typeof requestIdleCallback !== "undefined") {
      requestIdleCallback(activate, { timeout: 3000 });
    } else {
      setTimeout(activate, 0);
    }
  }, []);

  if (!enabled) {
    return null;
  }

  return <BackgroundRippleEffect cellSize={cellSize} />;
}
