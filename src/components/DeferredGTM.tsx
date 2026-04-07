"use client";

/**
 * Defers Google Tag Manager until the first real user interaction
 * (mousemove, scroll, touchstart, or keydown).
 *
 * No timer fallback — bots and PageSpeed auditors that never interact
 * will never load GTM, which keeps it out of the critical path entirely.
 * Real visitors trigger it within milliseconds of the first scroll or
 * mouse move, so no analytics data is lost in practice.
 *
 * requestIdleCallback is used so even the first-interaction load
 * happens during idle time and doesn't block anything.
 */

import { GoogleTagManager } from "@next/third-parties/google";
import { useEffect, useState } from "react";

const EVENTS = ["mousemove", "scroll", "touchstart", "keydown"] as const;

export function DeferredGTM({ gtmId }: { gtmId: string }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const load = () => {
      for (const ev of EVENTS) window.removeEventListener(ev, load);
      // Schedule during idle time so it doesn't compete with LCP
      if (typeof requestIdleCallback !== "undefined") {
        requestIdleCallback(() => setReady(true), { timeout: 2_000 });
      } else {
        setTimeout(() => setReady(true), 0);
      }
    };

    for (const ev of EVENTS) window.addEventListener(ev, load, { passive: true, once: true });

    return () => {
      for (const ev of EVENTS) window.removeEventListener(ev, load);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!ready) return null;
  return <GoogleTagManager gtmId={gtmId} />;
}
