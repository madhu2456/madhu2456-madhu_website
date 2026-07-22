"use client";

import { useEffect } from "react";
import { pushToDataLayer } from "@/lib/gtm";

const INTERACTION_EVENTS = [
  "mousemove",
  "scroll",
  "touchstart",
  "keydown",
] as const;

/**
 * Reports Core Web Vitals to GTM + /api/web-vitals/.
 *
 * Deferred until first real interaction, then requestIdleCallback — same
 * posture as DeferredGTM. Headless tools that never interact avoid long-lived
 * web-vitals observers that block networkidle (v2 audit LOW).
 */
export function WebVitals() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;

    let cancelled = false;
    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const startReporting = () => {
      if (cancelled) return;

      import("web-vitals").then(({ onCLS, onINP, onLCP, onFCP, onTTFB }) => {
        if (cancelled) return;

        const report = (metric: {
          name: string;
          value: number;
          id: string;
          rating: string;
        }) => {
          pushToDataLayer({
            event: "web_vitals",
            metric_name: metric.name,
            metric_value: Math.round(
              metric.name === "CLS" ? metric.value * 1000 : metric.value,
            ),
            metric_id: metric.id,
            metric_rating: metric.rating,
          });

          const body = JSON.stringify({
            name: metric.name,
            value: metric.value,
            id: metric.id,
            rating: metric.rating,
            page: window.location.pathname,
          });

          if (navigator.sendBeacon) {
            navigator.sendBeacon("/api/web-vitals/", body);
            return;
          }

          fetch("/api/web-vitals/", {
            method: "POST",
            body,
            headers: { "Content-Type": "application/json" },
            keepalive: true,
          }).catch(() => undefined);
        };

        onCLS(report);
        onINP(report);
        onLCP(report);
        onFCP(report);
        onTTFB(report);
      });
    };

    const onInteract = () => {
      for (const ev of INTERACTION_EVENTS) {
        window.removeEventListener(ev, onInteract);
      }

      if (typeof requestIdleCallback !== "undefined") {
        idleId = requestIdleCallback(() => startReporting(), {
          timeout: 2_000,
        });
      } else {
        timeoutId = setTimeout(startReporting, 0);
      }
    };

    for (const ev of INTERACTION_EVENTS) {
      window.addEventListener(ev, onInteract, { passive: true, once: true });
    }

    return () => {
      cancelled = true;
      for (const ev of INTERACTION_EVENTS) {
        window.removeEventListener(ev, onInteract);
      }
      if (idleId !== undefined && typeof cancelIdleCallback !== "undefined") {
        cancelIdleCallback(idleId);
      }
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, []);

  return null;
}
