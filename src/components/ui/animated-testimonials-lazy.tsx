"use client";

import dynamic from "next/dynamic";

// AnimatedTestimonials pulls in motion/react (~65 KiB).
// Lazy-loading it keeps it out of the initial JS bundle
// since the testimonials section is well below the fold.
export const LazyAnimatedTestimonials = dynamic(
  () =>
    import("@/components/ui/animated-testimonials").then(
      (m) => m.AnimatedTestimonials
    ),
  { ssr: false }
);
