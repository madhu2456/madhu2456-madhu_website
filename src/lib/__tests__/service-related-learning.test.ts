import { describe, expect, test } from "vitest";
import {
  getRelatedLearning,
  SERVICE_RELATED_LEARNING,
} from "@/lib/seo/service-related-learning";

describe("service related learning", () => {
  test("covers all six commercial service slugs", () => {
    const expected = [
      "rag-consultant-india",
      "ai-llm-application-development",
      "ai-agent-development",
      "marketing-analytics-consultant",
      "ga4-bigquery-campaign-analytics",
      "full-stack-ai-product-development",
    ];
    for (const slug of expected) {
      expect(SERVICE_RELATED_LEARNING[slug]?.length).toBeGreaterThan(0);
    }
  });

  test("fallback returns blog + case studies hub", () => {
    const links = getRelatedLearning("unknown-service");
    expect(links.some((l) => l.href.includes("/blog"))).toBe(true);
    expect(links.some((l) => l.href.includes("/case-studies"))).toBe(true);
  });
});
