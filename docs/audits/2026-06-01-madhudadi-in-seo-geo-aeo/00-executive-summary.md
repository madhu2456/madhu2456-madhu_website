# madhudadi.in SEO / GEO / AEO Audit - Executive Summary

Date: 2026-06-01  
Primary goal: rank growth plus AI/LLM visibility  
Audit target: live production `https://madhudadi.in/` plus current local pending repo state

## Bottom line

The portfolio has strong raw material for search and AI retrieval: clear personal entity, technical services, case studies, a blog, JSON-LD, `llms.txt`, and `ai-profile.json`. The largest current risk is not lack of SEO infrastructure. It is drift: live production, robots, sitemap behavior, local code, and machine-readable profile copy are not fully aligned.

The highest priority is to deploy or reconcile the already-pending local sitemap/meta cleanup, then tighten the entity language so search engines and LLMs understand this as a personal AI/analytics engineer portfolio, not a generic AI consulting company.

## Highest-priority opportunities

| Priority | Area | Finding | Why it matters |
| --- | --- | --- | --- |
| P0 | Technical SEO | Production sitemap points to `sitemap-portfolio.xml`, and that URL returns a sitemap index pointing back to itself. | Can waste crawler budget and delay discovery of canonical case-study URLs. |
| P0 | Release drift | Local code fixes the sitemap shape, but production still serves the old sitemap index. | Search engines see production, not local fixes. |
| P1 | Robots ownership | Production robots is a consolidated blog + portfolio file; local `robots.ts` is portfolio-focused and would drop several blog-specific protections/sitemap references if deployed as-is. | A root `robots.txt` regression could affect both portfolio and blog crawl control. |
| P1 | GEO/entity clarity | Keyword list includes broad terms like "AI consulting company" and "top AI consulting firms". | LLMs may classify the site as a company directory or generic agency rather than Madhu Dadi's personal expertise graph. |
| P1 | Content quality | Local data still has "Batchelor of Technology"; production rendered content also shows it. | Visible typo reduces trust and may be repeated in snippets/LLM summaries. |
| P2 | AEO | FAQ answers are useful but not yet written as concise, citation-friendly answer blocks. | Answer engines prefer direct answers with entity, service, proof, and next action in one compact paragraph. |

## What already looks strong

- Live homepage is indexable and returns 200.
- `www.madhudadi.in` redirects to canonical `https://madhudadi.in/`.
- Live `llms.txt` is substantial and includes identity, services, projects, credentials, evidence links, and machine-readable endpoint links.
- Local code includes a cleaner `sitemap.xml` route that emits direct URL entries for home, case studies index, and each case study.
- Local code has `search` set to `noindex, follow`, which is appropriate for an internal search results page.
- Local code emits a unified JSON-LD graph through `SeoStructuredData`, avoiding duplicate Organization scripts.

## Recommended order

1. Fix production sitemap recursion and deploy the local sitemap route.
2. Reconcile root `robots.txt` ownership so portfolio and blog rules are preserved together.
3. Deploy the pending local metadata, JSON-LD, `llms.txt`, manifest, and search noindex changes.
4. Rewrite the keyword strategy from broad agency terms to personal-entity and proof-backed service terms.
5. Fix content trust issues: "Bachelor", Dataiku casing consistency, current project count, service positioning.
6. Strengthen FAQ/AEO copy and case-study summaries for answer extraction.
7. Run external validation after deployment: Google Search Console sitemap inspection, Rich Results Test, URL Inspection, Bing Webmaster Tools, and an AI visibility prompt sample.

## External data not available

The audit did not inspect Search Console, GA4, Cloudflare logs, CrUX field data, or private LLM visibility dashboards. Findings that need those sources are marked as external validation needs rather than assumed conclusions.

## Local validation completed

These checks passed after writing the audit files:

- `.\node_modules\.bin\biome.cmd check --max-diagnostics=200`
- `.\node_modules\.bin\vitest.cmd run` - 4 test files, 19 tests
- `node .\node_modules\next\dist\bin\next build --webpack`
- `rg -n "sitemap-portfolio\.xml|sitemap-portfolio" src Data package.json next.config.ts` - no active app/code matches

Targeted content probes confirmed the active local content still contains the keyword and typo issues reported in this audit, so those are remediation items, not false positives.
