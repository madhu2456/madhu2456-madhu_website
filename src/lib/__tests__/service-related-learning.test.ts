import { describe, expect, test } from "vitest";
import {
  getRelatedLearning,
  relatedLearningKindLabel,
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

  test("returns at most three links for card layouts", () => {
    const links = getRelatedLearning("ai-llm-application-development");
    expect(links.length).toBeLessThanOrEqual(3);
    expect(links.length).toBeGreaterThan(0);
  });

  test("fallback returns blog + guide + case studies hub", () => {
    const links = getRelatedLearning("unknown-service");
    expect(links.some((l) => l.href.includes("/blog"))).toBe(true);
    expect(links.some((l) => l.href.includes("/case-studies"))).toBe(true);
    expect(links.length).toBeLessThanOrEqual(3);
  });

  test("kind labels cover guide", () => {
    expect(relatedLearningKindLabel("guide")).toBe("Guide");
    expect(relatedLearningKindLabel("blog")).toBe("Blog");
  });
});
