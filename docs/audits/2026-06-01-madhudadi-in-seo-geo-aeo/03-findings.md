# Findings Ledger

Severity scale: Critical, High, Medium, Low  
Confidence scale: high, medium, low

## SEO-001 - Recursive production sitemap

Severity: Critical  
Confidence: high  
Status: live issue; locally fixed but not deployed

Evidence:

- Live `/sitemap.xml` points to `https://madhudadi.in/sitemap-portfolio.xml`.
- Live `/sitemap-portfolio.xml` returns a sitemap index that points back to `https://madhudadi.in/sitemap-portfolio.xml`.
- Local `src/app/sitemap.xml/route.ts` emits direct URL entries and no longer references `sitemap-portfolio.xml`.

Impact:

- Crawlers may waste crawl budget following a recursive sitemap index.
- Portfolio case-study URLs are less directly discoverable through the live sitemap.
- Search Console sitemap processing may show warnings or incomplete URL discovery.

Recommended remediation:

- Deploy the local direct URL-set sitemap implementation.
- Remove or redirect `/sitemap-portfolio.xml` to `/sitemap.xml` only if it will not create another sitemap index loop.
- Purge CDN/cache for `/sitemap.xml`, `/sitemap-portfolio.xml`, and `/robots.txt`.

Acceptance criteria:

- `/sitemap.xml` returns direct `<url>` entries for home, case-studies index, and all case-study slugs, or a non-recursive sitemap index.
- No live response contains `<loc>https://madhudadi.in/sitemap-portfolio.xml</loc>`.
- Google Search Console accepts the sitemap with no recursion/index fetch errors.

## SEO-002 - Root robots drift between production and local source

Severity: High  
Confidence: high  
Status: live/local drift

Evidence:

- Production `robots.txt` is consolidated for portfolio and blog and includes blog admin/auth/payment disallows plus `blog/api/v1/sitemap-index.xml`.
- Local `src/app/robots.ts` is portfolio-focused and only emits `/sitemap.xml` and `/blog/sitemap.xml`.

Impact:

- Deploying the local route as root `robots.txt` could remove blog-specific crawl protections and sitemap discovery.
- Search and AI crawler rules could diverge between the blog and portfolio.

Recommended remediation:

- Decide root `robots.txt` ownership.
- If the portfolio app owns root robots, merge production blog rules into local `robots.ts`.
- If another edge/proxy layer owns root robots, document that ownership and keep local route from overriding it unexpectedly.

Acceptance criteria:

- Root `robots.txt` preserves portfolio rules, blog protections, AI crawler allow rules, and all intended sitemap links.
- `/api/`, `/studio/`, blog admin/auth/payment/profile/private paths remain disallowed.

## SEO-003 - Production not aligned with local pending sitemap/meta improvements

Severity: High  
Confidence: high  
Status: release drift

Evidence:

- Production still serves recursive sitemap behavior.
- Local source has removed `sitemap-portfolio` references and has search noindex, metadata, JSON-LD, and `llms.txt` improvements pending.
- `git status` shows many local uncommitted changes from SEO cleanup and unused-code cleanup.

Impact:

- Crawlers and LLMs continue to see the older production state.
- Audit verification can be misleading unless live and local are tracked separately.

Recommended remediation:

- Finish reviewing, commit, and deploy the local cleanup/SEO changes.
- After deployment, rerun live checks and update this audit with post-deploy evidence.

Acceptance criteria:

- Live sitemap matches local direct URL-set behavior.
- Live search page is `noindex, follow`.
- Live metadata, JSON-LD, `llms.txt`, and `ai-profile.json` match the intended local data model.

## META-001 - Entity positioning is inconsistent across surfaces

Severity: Medium  
Confidence: high  
Status: live/local issue

Evidence:

- Production title surfaced as `Madhu Dadi | AI, Python & Marketing Analytics Leader`.
- Local site title is `Madhu Dadi | AI & Analytics Engineer · LLM, RAG, GA4`.
- Local profile headline is `AI Developer & Marketing Analytics Leader`.
- Live `llms.txt` job title used `AI, Python & Marketing Analytics Leader`; local pending `llms.txt` uses `profile.headline`.

Impact:

- Search snippets and LLM summaries may describe the entity differently depending on source.
- "Developer", "engineer", "leader", and "consultant" all appear; this is not fatal, but the hierarchy needs to be deliberate.

Recommended remediation:

- Define one primary entity phrase, e.g. `AI & Analytics Engineer`.
- Use supporting phrases in body copy, not as competing titles.
- Align page title, H1/H2, `llms.txt`, `ai-profile.json`, Person schema `jobTitle`, and OG/Twitter titles.

Acceptance criteria:

- Primary descriptor is consistent across metadata, homepage, JSON-LD, and machine-readable endpoints.
- Secondary descriptors are still present in body content for keyword coverage.

## GEO-001 - Keyword list overuses generic company/agency terms

Severity: High  
Confidence: high  
Status: local and live issue

Evidence:

- Local `Data/portfolio-content.json` includes `AI consulting company`, `top AI consulting firms`, and `AI consulting company in India`.
- Live `llms.txt` exposes those terms in the SEO/GEO/AEO keyword section.

Impact:

- The site may be classified as a generic company/agency rather than a personal expert portfolio.
- LLM answers may overstate business structure or authority.
- Keyword stuffing risk increases without adding meaningful proof.

Recommended remediation:

- Replace generic company/firm terms with personal-entity terms:
  - `AI consultant in India`
  - `AI and analytics engineer`
  - `LLM application developer`
  - `RAG consultant`
  - `marketing analytics consultant`
  - `FastAPI and Next.js AI developer`
- Keep only terms supported by homepage copy, services, projects, credentials, or experience.

Acceptance criteria:

- `llms.txt` keyword list reads like an entity profile, not a keyword dump.
- No keyword implies a company/team unless the page explicitly supports that claim.

## GEO-002 - Machine-readable endpoints are strong but need post-deploy consistency checks

Severity: Medium  
Confidence: high  
Status: positive with validation need

Evidence:

- Live `llms.txt` contains identity, services, work history, projects, case studies, credentials, pricing, hiring process, and evidence links.
- Local `llms.txt` is more data-driven than production.
- Local `ai-profile.json` attempts to synchronize blog metadata from the live blog endpoint.

Impact:

- Strong GEO foundation, but inconsistent live/local generated text can create entity drift.
- Runtime fetch dependency for blog metadata can create stale or unavailable subgraphs.

Recommended remediation:

- After deploy, diff live `llms.txt` and `ai-profile.json` against local expected output.
- Add a lightweight endpoint test that verifies required keys/sections exist and no old title/keyword strings remain.
- Consider caching or graceful fallback telemetry for blog profile fetches.

Acceptance criteria:

- `llms.txt` and `ai-profile.json` agree on title, services, projects, evidence links, and canonical URLs.
- Blog metadata failure does not break the endpoint or remove core portfolio identity.

## AEO-001 - FAQ answers need sharper answer-engine formatting

Severity: Medium  
Confidence: high  
Status: live content opportunity

Evidence:

- Live FAQ answers are present and crawlable.
- Example live answer: "Madhu Dadi builds AI & LLM Application Development, Marketing Analytics & Decision Intelligence, Full-Stack Web Product Development..."
- Live FAQ includes "Highlighted projects: 2" while local data has three featured projects.

Impact:

- Answers are understandable but not yet ideal for answer extraction.
- Service-title phrasing reads less natural than direct human answers.
- Project count drift weakens trust.

Recommended remediation:

- Rewrite FAQ answers as concise 40-70 word answer blocks.
- Include entity, service, proof point, and next action where useful.
- Replace "Highlighted projects: 2" with a data-derived count or remove the count.

Acceptance criteria:

- Each FAQ answer stands alone when extracted.
- FAQ schema text matches visible FAQ text.
- Counts and project references are data-derived.

## CONTENT-001 - Education typo reduces trust

Severity: Medium  
Confidence: high  
Status: live and local issue

Evidence:

- Production rendered content shows `Batchelor of Technology`.
- Local `Data/portfolio-content.json` also contains `"degree": "Batchelor of Technology"`.

Impact:

- Typo can appear in snippets, JSON-LD, AI answers, and user-facing content.
- Trust signal is weakened on a portfolio that sells analytics and engineering quality.

Recommended remediation:

- Change to `Bachelor of Technology`.
- Rebuild and verify homepage, `llms.txt`, `ai-profile.json`, and JSON-LD no longer contain the typo.

Acceptance criteria:

- `rg -n "Batchelor" Data src docs` returns no active content matches except historical audit notes if retained.

## CONTENT-002 - Project and proof hierarchy needs alignment

Severity: Medium  
Confidence: medium  
Status: live/local drift

Evidence:

- Live homepage showed two highlighted projects in FAQ context.
- Local data marks three projects as featured: Adticks, Technical Blog, and Udemy Enroller.
- Local project evidence is stronger than live rendered project visibility suggests.

Impact:

- Adticks appears to be a major current proof asset but may not be fully surfaced in live production.
- LLMs and users may miss the strongest current SEO/GEO-relevant project.

Recommended remediation:

- Ensure live homepage, case-study index, `llms.txt`, `ai-profile.json`, and JSON-LD all surface the same featured project set.
- Give Adticks explicit visible proof near services and case studies.

Acceptance criteria:

- Featured project count and project list match across homepage, machine-readable endpoints, and structured data.

## SCHEMA-001 - Structured data graph may overextend entity types

Severity: Low  
Confidence: medium  
Status: local review item

Evidence:

- Local graph includes Person, Occupation, Organization, WebSite, SoftwareApplication, ProfilePage, ItemLists, FAQ, Breadcrumb, and HowTo.
- Organization is used for the personal brand.
- SoftwareApplication appears to describe the portfolio/site broadly.

Impact:

- Rich schema coverage is good, but over-broad nodes can dilute entity clarity.
- Search engines may ignore unsupported schema, but LLMs may ingest ambiguous relationships.

Recommended remediation:

- Keep Person as the primary entity.
- Use Organization only if representing the personal brand with clear name/logo/sameAs.
- Use SoftwareApplication only if the node describes the portfolio AI assistant or a specific app, not the entire personal site generically.

Acceptance criteria:

- JSON-LD graph has a clear primary Person entity and no node implies unsupported business structure.

## META-002 - Search page should remain noindex

Severity: Low  
Confidence: high for local; medium for live
Status: local fixed; live needs verification

Evidence:

- Local `src/app/(portfolio)/search/page.tsx` sets `robots: { index: false, follow: true }`.
- Live `/search/` returns `200 OK`; exact production meta robots was not fully captured due intermittent live HTML fetch failures.

Impact:

- Indexing internal search pages can create low-value URLs.
- Local fix is correct.

Recommended remediation:

- Verify production search meta after deployment.
- Keep `/search/` out of sitemap.

Acceptance criteria:

- Live `/search/` contains `noindex, follow`.
- `/search/` is absent from `/sitemap.xml`.

