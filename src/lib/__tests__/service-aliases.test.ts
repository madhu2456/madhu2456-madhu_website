import { describe, expect, test } from "vitest";
import {
  getIndiaServiceAlias,
  INDIA_SERVICE_ALIASES,
  isIndiaServiceAliasSlug,
} from "@/lib/seo/service-aliases";

describe("India service aliases", () => {
  test("defines the three Phase 5 landers", () => {
    const slugs = INDIA_SERVICE_ALIASES.map((a) => a.slug);
    expect(slugs).toEqual([
      "llm-developer-india",
      "marketing-analytics-consultant-india",
      "ai-consultant-visakhapatnam",
    ]);
  });

  test("each lander has unique India copy and FAQs", () => {
    for (const alias of INDIA_SERVICE_ALIASES) {
      expect(alias.seoTitle.length).toBeGreaterThan(20);
      expect(alias.directAnswer.length).toBeGreaterThan(0);
      expect(alias.faqs.length).toBeGreaterThanOrEqual(3);
      expect(alias.baseServiceSlug.length).toBeGreaterThan(0);
      expect(isIndiaServiceAliasSlug(alias.slug)).toBe(true);
    }
  });

  test("lookup helper works", () => {
    expect(getIndiaServiceAlias("llm-developer-india")?.title).toMatch(/LLM/i);
    expect(getIndiaServiceAlias("missing")).toBeUndefined();
  });
});
