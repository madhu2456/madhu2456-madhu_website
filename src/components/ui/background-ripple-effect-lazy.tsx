"use client";

import dynamic from "next/dynamic";

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

export { BackgroundRippleEffect as LazyBackgroundRippleEffect };
