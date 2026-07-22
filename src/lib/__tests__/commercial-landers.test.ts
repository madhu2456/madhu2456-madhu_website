import { describe, expect, test } from "vitest";
import {
  COMMERCIAL_LANDERS,
  getCommercialLander,
  requireCommercialLander,
} from "@/lib/seo/commercial-landers";

describe("commercial landers", () => {
  test("defines days 1–30 commercial landers", () => {
    expect(COMMERCIAL_LANDERS.map((l) => l.slug)).toEqual([
      "ga4-consultant",
      "google-analytics-consultant",
      "marketing-analytics-consultant",
      "marketing-mix-modeling-consultant",
      "attribution-modeling-consultant",
    ]);
  });

  test("meta titles and descriptions stay within SERP-safe lengths", () => {
    for (const lander of COMMERCIAL_LANDERS) {
      expect(lander.seoTitle.length).toBeLessThanOrEqual(60);
      expect(lander.seoDescription.length).toBeLessThanOrEqual(160);
      expect(lander.seoTitle).toContain("Madhu Dadi");
      expect(lander.directAnswer.length).toBeGreaterThanOrEqual(1);
      expect(lander.faqs.length).toBeGreaterThanOrEqual(4);
      expect(lander.baseServiceSlug.length).toBeGreaterThan(0);
    }
  });

  test("lookup helpers work", () => {
    expect(getCommercialLander("ga4-consultant")?.title).toMatch(/GA4/i);
    expect(requireCommercialLander("marketing-analytics-consultant").slug).toBe(
      "marketing-analytics-consultant",
    );
    expect(getCommercialLander("missing")).toBeUndefined();
  });
});
