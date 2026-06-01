# Findings Ledger - Rerun

Severity scale: Critical, High, Medium, Low  
Confidence scale: high, medium, low

## SEO-001 - Production sitemap still serves legacy sitemap index

Severity: Critical  
Confidence: high  
Status: open on production; fixed in local source

Evidence:

- Live `/sitemap.xml` returns a sitemap index with `https://madhudadi.in/sitemap-portfolio.xml`.
- Local `src/app/sitemap.xml/route.ts` emits direct canonical URL entries and has no `sitemap-portfolio` reference.

Impact:

- Search engines still receive the stale sitemap topology.
- Portfolio URL discovery is not aligned with local source or intended canonical routes.

Recommended remediation:

- Identify whether `/sitemap.xml` is served by the current Next app, a previous deployment, Cloudflare, or another service.
- Deploy the local sitemap route to the production host answering `madhudadi.in`.
- Purge Cloudflare/hosting cache for `/sitemap.xml`.

Acceptance criteria:

- Live `/sitemap.xml` contains direct URL entries or a non-recursive sitemap index.
- Live `/sitemap.xml` does not contain `sitemap-portfolio`.

## SEO-002 - Legacy `/sitemap-portfolio.xml` still returns `200 OK`

Severity: High  
Confidence: high  
Status: open on production; absent from active local source

Evidence:

- Live `HEAD https://madhudadi.in/sitemap-portfolio.xml` returns `200 OK`.
- Active local source/content/package/config probes have no `sitemap-portfolio` reference.

Impact:

- Old sitemap URL remains discoverable.
- If crawlers cached it, they can continue requesting stale sitemap content.

Recommended remediation:

- Return `301` from `/sitemap-portfolio.xml` to `/sitemap.xml`, or return a valid non-recursive URL set if legacy support is required.
- If an edge rule creates this route, remove or update that edge rule.

Acceptance criteria:

- `/sitemap-portfolio.xml` no longer returns a self-referencing sitemap index.
- `/sitemap-portfolio.xml` either redirects cleanly or emits the same valid direct URL set.

## SEO-003 - Deployment/cache drift between local and production

Severity: High  
Confidence: high  
Status: open

Evidence:

- Local repo is clean and source probes pass.
- Local build passes.
- Production `/sitemap.xml` still serves old behavior.
- Production response includes cache indicators such as `x-nextjs-cache: HIT`.

Impact:

- Engineers may believe fixes are deployed when crawlers still see stale output.
- Search Console and AI crawlers continue to evaluate production's old sitemap.

Recommended remediation:

- Verify deployment commit SHA and runtime host for `madhudadi.in`.
- Inspect Cloudflare cache/page rules/workers for `/sitemap.xml` and `/sitemap-portfolio.xml`.
- Purge cache after deploying.

Acceptance criteria:

- Live route output matches local build output.
- Cache-busted `/sitemap.xml?verify=<timestamp>` also returns the corrected sitemap.

## ROBOTS-001 - Root robots is consolidated and mostly healthy

Severity: Low  
Confidence: high  
Status: passing with dependency on sitemap fix

Evidence:

- Production robots includes portfolio and blog private-path disallows.
- Production robots includes AI crawler user agents and safe boundaries.
- Production robots lists `/sitemap.xml`, `/blog/sitemap.xml`, and `/blog/api/v1/sitemap-index.xml`.
- Local `robots.ts` now aligns with this intent.

Impact:

- Robots itself is not the immediate blocker.
- Sitemap listed in robots remains stale because `/sitemap.xml` is stale.

Recommended remediation:

- Keep current consolidated robots model.
- Revalidate after fixing `/sitemap.xml`.

Acceptance criteria:

- Robots continues to include blog protections and AI crawler rules.
- Listed sitemaps all return valid non-recursive sitemap content.

## GEO-001 - Live GEO endpoint verification is blocked by fetch instability

Severity: Medium  
Confidence: medium  
Status: needs external/live recheck

Evidence:

- During this rerun, repeated curl attempts to `/llms.txt` and `/ai-profile.json` failed from this environment with connection errors.
- Local source for those endpoints is available and build passes.

Impact:

- Cannot confidently mark live GEO endpoint content as current during this rerun.
- If bots see similar connectivity issues, AI retrieval freshness may suffer; however, this audit cannot prove global outage.

Recommended remediation:

- Recheck from deployment provider logs, Cloudflare dashboard, Search Console URL Inspection, and an external machine.
- Confirm live endpoints do not contain old agency/company keywords or the `Batchelor` typo.

Acceptance criteria:

- `/llms.txt` and `/ai-profile.json` return `200 OK` from at least two networks.
- Their content matches local entity/content cleanup.

## GEO-002 - Local entity keyword strategy is improved

Severity: Low  
Confidence: high  
Status: resolved locally; live needs confirmation

Evidence:

- Active local content no longer contains `AI consulting company`, `top AI consulting firms`, or `AI consulting company in India`.
- Local keyword list now includes personal/expert terms such as `AI consultant in India`, `AI and analytics engineer`, `LLM application developer`, and `RAG consultant`.

Impact:

- Better alignment for LLM/entity extraction.
- Reduces risk of being classified as a generic agency/company.

Recommended remediation:

- Verify live `llms.txt`, `ai-profile.json`, metadata, and rendered homepage reflect the local keyword strategy.

Acceptance criteria:

- Live machine-readable endpoints and rendered pages do not expose removed broad company keywords.

## AEO-001 - Search noindex is fixed locally but unverified live

Severity: Medium  
Confidence: high for local; low for live
Status: resolved locally; live unavailable during rerun

Evidence:

- Local `src/app/(portfolio)/search/page.tsx` sets `robots: { index: false, follow: true }`.
- Live `/search/` fetch failed during rerun after retries.

Impact:

- Local behavior is correct.
- Production still needs verification so internal search pages do not enter the index.

Recommended remediation:

- After deploy/cache purge, fetch `/search/` and confirm `noindex, follow`.

Acceptance criteria:

- Live `/search/` contains noindex robots metadata.
- `/search/` is absent from live sitemap.

## CONTENT-001 - Prior content trust issues are fixed locally

Severity: Low  
Confidence: high  
Status: resolved locally; live needs confirmation

Evidence:

- Local active probes show no `Batchelor`, `DataIku`, or `Highlighted projects: 2`.
- Local data shows `Bachelor of Technology`.

Impact:

- Local content quality has improved.
- Live production verification is still required due endpoint fetch instability.

Recommended remediation:

- Recheck rendered live homepage and machine-readable endpoints after deployment/cache purge.

Acceptance criteria:

- Live homepage, `llms.txt`, `ai-profile.json`, and JSON-LD do not contain the old strings.

## SCHEMA-001 - Structured data graph remains broad

Severity: Low  
Confidence: medium  
Status: review item

Evidence:

- Local graph includes Person, Occupation, Organization, WebSite, SoftwareApplication, ProfilePage, ItemLists, FAQ, Breadcrumb, and HowTo.

Impact:

- Broad graph coverage is useful, but `SoftwareApplication` can dilute entity clarity if it describes the entire personal website instead of a specific application or assistant.

Recommended remediation:

- Keep Person as the primary identity node.
- Keep Organization only as the personal brand.
- Scope SoftwareApplication to a specific app/assistant or remove it if not needed.

Acceptance criteria:

- Schema validators pass.
- JSON-LD does not imply unsupported product/company claims.

