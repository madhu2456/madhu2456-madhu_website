"use client";

import dynamic from "next/dynamic";

// CometCard uses motion/react for 3D hover effects.
// Code-split so the motion runtime isn't in the initial JS bundle.
//
// NOTE: ssr MUST be true here (default) because CertificationsSection is a
// server component that passes children JSX into CometCard. Using ssr:false
// on a wrapper component that receives server-rendered children causes React
// hydration mismatches and console errors.
export const LazyCometCard = dynamic(() =>
  import("@/components/ui/comet-card").then((m) => m.CometCard),
);
