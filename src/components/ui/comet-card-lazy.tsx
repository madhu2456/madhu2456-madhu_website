"use client";

import dynamic from "next/dynamic";

// CometCard uses motion/react for 3D hover effects.
// Lazy-loading keeps the motion runtime out of the initial JS bundle
// since the certifications section is well below the fold.
export const LazyCometCard = dynamic(
  () => import("@/components/ui/comet-card").then((m) => m.CometCard),
  { ssr: false }
);
