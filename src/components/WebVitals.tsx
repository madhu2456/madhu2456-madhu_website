"use client";

import { useEffect } from "react";
import { pushToDataLayer } from "@/lib/gtm";

/**
 * Reports Core Web Vitals to Google Tag Manager.
 * Only loads in production and only after GTM is ready.
 */
export function WebVitals() {
  useEffect(() => {
    // Dynamic import to avoid adding web-vitals to the critical bundle
    import("web-vitals").then(({ onCLS, onINP, onLCP, onFCP, onTTFB }) => {
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
      };

      onCLS(report);
      onINP(report);
      onLCP(report);
      onFCP(report);
      onTTFB(report);
    });
  }, []);

  return null;
}
