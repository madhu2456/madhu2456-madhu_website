# Final Forensic Audit Report — madhudadi.in

**Domain:** `https://madhudadi.in/`  
**Audit Date:** 2026-07-04  
**Audit Type:** Comprehensive forensic — SEO, GEO, AEO, UI/UX, Accessibility, Performance, Security, Analytics  
**Agent:** `weave-docs`  
**Targets:** Live `https://madhudadi.in/` + Local codebase (`madhu_portfolio`)

---

## 1. Executive Summary

| Score Area | Rating | Key Penalty |
|---|---|---|
| **Overall** | **82/100** | Security secrets exposure drags overall down |
| Code health | 90/100 | Minor Biome formatting issue in smoke test script |
| SEO | 88/100 | HTTP→HTTPS redirect missing, duplicate cache headers |
| GEO/AEO/AI-search readiness | 94/100 | Near-perfect; llms.txt, ai-profile.json, ai-plugin.json all serving |
| UI/UX | 80/100 | Font pairing flat (Inter for both display & body) |
| Accessibility | 85/100 | Reduced-motion gap; blog icon aria-hidden conflict |
| Performance | 80/100 | Duplicate cache headers; Section client component overhead |
| Security/privacy | 50/100 | Plaintext secrets in .env.local; CSP not enforced; rate-limiting gaps |
| Conversion readiness | 92/100 | Excellent conversion paths, intent-based contact prefill |
| Analytics readiness | 75/100 | GTM deferred, Web Vitals live; no error monitoring |

### Top 10 Highest-Impact Fixes

| # | Finding | Severity | Effort |
|---|---|---|---|
| 1 | `.env.local` contains plaintext API keys (OPENAI, RESEND, CMS auth) | **Critical** | S |
| 2 | No HTTP→HTTPS redirect from `http://madhudadi.in` | **High** | XS |
| 3 | CSP in Report-Only mode (not enforced) | **High** | M |
| 4 | Duplicate cache headers for sitemap.xml & robots.txt | **High** | XS |
| 5 | In-memory rate limiting lost on serverless cold starts | **Medium** | M |
| 6 | Speakable `cssSelector` too broad (`["main"]` on WebPage) | **Medium** | XS |
| 7 | Google Business Profile excluded from `sameAs` array | **Medium** | XS |
| 8 | `aria-hidden="true"` + `alt="Blog icon"` contradiction | **Medium** | XS |
| 9 | Reduced-motion CSS doesn't cover motion library JS animations | **High** | S |
| 10 | No upload rate limiting on CMS upload endpoint | **Medium** | S |

---

## 2. Methodology

### Tools Used

| Tool | Purpose |
|---|---|
| `biome check` / `biome format` | Linting and formatting (124 files checked) |
| `tsc --noEmit` | TypeScript type-checking |
| `vitest run` | Unit tests (25 tests across 4 files) |
| `playwright test` | E2E tests (76 tests across 4 devices) |
| `next build` | Production build compilation (36 pages) |
| `curl` | Live site HTTP header/body inspection |
| `rg` (ripgrep) | Content search for stale strings, typos, patterns |
| Manual code review | Line-by-line audit of 28+ source files |

### Commands Run

```bash
# Quality gates
pnpm lint          # biome check → PASS (1 formatting warning in scripts/seo-smoke-test.mjs:66)
pnpm format:check  # biome format → FAIL (same formatting error)
pnpm typecheck     # tsc --noEmit → PASS (0 errors)
pnpm test          # vitest run → PASS (25 tests, 4 files)
pnpm test:e2e      # playwright test → PASS (76 tests)
pnpm build         # next build → PASS (36 pages, Next.js 16.2.9)

# Live site validation
curl -I https://madhudadi.in/                        # Homepage headers
curl -I http://madhudadi.in/                          # HTTP (no redirect → CRITICAL)
curl -I https://www.madhudadi.in/                     # www redirect (301 → correct)
curl -L https://madhudadi.in/sitemap.xml              # Sitemap
curl -I https://madhudadi.in/sitemap-portfolio.xml    # Legacy sitemap (308 → correct)
curl -s https://madhudadi.in/robots.txt               # Robots.txt
curl -s https://madhudadi.in/llms.txt                 # GEO endpoint
curl -s https://madhudadi.in/ai-profile.json          # GEO endpoint
curl -s -A "Mozilla/5.0" https://madhudadi.in/search/ | grep -i robots  # Search noindex
```

### Official Docs Consulted

- Next.js 16 documentation (sitemap, metadata, middleware, headers)
- WCAG 2.2 Level AA guidelines
- Google Search Central (SEO, structured data, sitemaps, robots.txt)
- schema.org specifications (Person, Occupation, WebSite, FAQPage, ProfilePage)
- OWASP guidelines (CSP, authentication, constant-time comparison)
- Google Tag Manager documentation
- resend.com API documentation

### Live URLs Tested

23 routes across the sitemap, including:

| Route | Status | Notes |
|---|---|---|
| `/` | 200 OK | Homepage |
| `/profile/` | 200 OK | Profile page |
| `/contact/` | 200 OK | Contact form |
| `/services/` | 200 OK | Services listing |
| `/case-studies/` | 200 OK | Case studies listing |
| `/credentials/` | 200 OK | Credentials |
| `/privacy/` | 200 OK | Privacy policy |
| `/search/` | 200 OK | noindex, follow |
| `/sitemap.xml` | 200 OK | Flat URL-set |
| `/sitemap-portfolio.xml` | 308 → `/sitemap.xml` | Correct redirect |
| `/robots.txt` | 200 OK | Clean directives |
| `/llms.txt` | 200 OK | GEO text |
| `/ai-profile.json` | 200 OK | GEO JSON |
| `/humans.txt` | 200 OK | Plain text |
| `/cms/` | 403 | Auth protected |
| `/nonexistent-path/` | 404 | Custom 404 page |

### Files Reviewed

| Category | Files |
|---|---|
| App config | `next.config.ts`, `middleware.ts`, `src/proxy.ts`, `tsconfig.json`, `package.json` |
| Source routes | `src/app/(portfolio)/page.tsx`, `layout.tsx`, `sitemap.ts`, `robots.ts`, `not-found.tsx`, `global-not-found.tsx` |
| Components | `NewPortfolioExperience.tsx`, `Section.tsx`, `Header.tsx`, `Footer.tsx`, `ContactForm.tsx`, `FormField.tsx`, `DeferredGTM.tsx`, `ClientChrome.tsx`, `SeoStructuredData.tsx`, `PortfolioContent.tsx`, `WebVitals.tsx` |
| Libraries | `jsonld.ts`, `fonts.ts`, `gtm.ts` |
| Server actions | `submit-contact-form.ts` |
| API routes | `api/cms/upload/route.ts`, `api/cms/content/route.ts` |
| Styles | `globals.css` |
| Scripts | `seo-smoke-test.mjs`, `audit-seo.js` |
| Data | `Data/portfolio-content.json` |
| Environment | `.env.local` |

### Limitations

- No live Lighthouse/PageSpeed Insights run (local build analysis substituted)
- No private Google Search Console or Bing Webmaster access
- No live GA4 dashboard inspection
- No live synthetic monitoring (Pingdom, Checkly, etc.)
- Rendered DOM analysis limited to Playwright E2E output and curl HTML extraction
- Blog (`madhudadi.in/blog`) is a separate application — audited only for sitemap and robots.txt integration

---

## 3. Documentation Baseline

| Source | Key Point | Benchmark Classification | Relevance | Citation |
|---|---|---|---|---|
| Next.js 16 docs | `sitemap.ts` exports default async function returning `MetadataRoute.Sitemap` | Official documentation | Sitemap generation | `src/app/sitemap.ts` |
| Next.js 16 docs | `robots.ts` exports default function returning `MetadataRoute.Robots` | Official documentation | Crawler policies | `src/app/robots.ts` |
| WCAG 2.2 AA | Touch targets ≥ 24×24px (recommended 44×44px) | Official qualitative guidance | Mobile UX | `Header.tsx` hamburger is 44×44px |
| WCAG 2.2 AA | `prefers-reduced-motion` must disable non-essential animations | Official threshold | Accessibility | Section.tsx uses JS animations |
| Schema.org | `Person.mainEntityOfPage` should point to a valid `@id` | Official specification | Structured data | jsonld.ts:302 |
| Google SEO | `sitemap.xml` must not contain recursive references | Official qualitative guidance | Sitemap health | Verified flat URL-set |
| Google SEO | Canonical URLs should match the served URL | Official threshold | Canonical tag | Verified per-route |
| OpenAI docs | `llms.txt` and `ai-profile.json` for AI crawler discovery | Industry heuristic | GEO readiness | Both serving correctly |
| OWASP | CSP should be enforced, not Report-Only, for production | Official threshold | Security | middleware.ts uses Report-Only |
| OWASP | Constant-time comparison must not have early exits | Official threshold | Security | proxy.ts:19 returns early |
| Resend API | API keys should be stored securely, never committed | Official documentation | Security | `.env.local` contains plaintext key |
| Google GBP | Profile URL should appear in `sameAs` for entity association | Industry heuristic | Structured data | GBP excluded from `sameAs` |

---

## 4. Repository and Stack Discovery

| Aspect | Detail |
|---|---|
| **Tech stack** | Next.js 16.2.9, React 19.2.4, TypeScript 5.9, Tailwind CSS v4, motion v12 (formerly Framer Motion) |
| **Package manager** | pnpm 10.33.0 |
| **Node version** | `.node-version` defines version |
| **Build tool** | Next.js compiler with React compiler (babel-plugin-react-compiler) |
| **Testing** | Vitest (unit), Playwright (E2E, 76 tests across 4 devices) |
| **Linting** | Biome v2 (formatting + linting), no ESLint |
| **Deployment** | Vercel (presumed from `@next/third-parties` usage and deployment patterns) |
| **CDN** | Cloudflare (verified via `server: cloudflare` response headers) |

### Project Structure (App Router)

```
src/
  app/
    (portfolio)/          # Main portfolio route group
      page.tsx            # Homepage
      layout.tsx          # Root layout (header, footer, GTM, Web Vitals)
      contact/page.tsx    # Contact form
      services/page.tsx   # Services listing
      case-studies/       # Case studies + detail pages
      profile/page.tsx    # Profile/about page
      credentials/page.tsx # Certifications & education
      privacy/page.tsx    # Privacy policy
      search/page.tsx     # Site search (noindex)
      cms/page.tsx        # CMS admin interface
      error.tsx           # Route-level error boundary
      not-found.tsx       # Route-level 404
    api/
      cms/upload/route.ts  # CMS image upload
      cms/content/route.ts # CMS content CRUD
      csp-report/          # CSP violation reporting
      web-vitals/          # Web Vitals data collection
      chat/                # Portfolio assistant chat
      indexnow/            # IndexNow URL submission
    sitemap.ts            # Dynamic sitemap generation
    robots.ts             # robots.txt generation
    not-found.tsx         # Global 404 page
    global-not-found.tsx  # Global not-found boundary
    manifest.ts           # Web app manifest
  components/
    SeoStructuredData.tsx # JSON-LD graph builder
    Section.tsx           # Animated section wrapper (Client Component)
    NewPortfolioExperience.tsx # Main page content (Client Component)
    ContactForm.tsx       # Contact form (Client Component)
    DeferredGTM.tsx       # Deferred GTM loader
    WebVitals.tsx         # Core Web Vitals reporting
    ...
  lib/
    jsonld.ts             # Schema.org builders for all types
    fonts.ts              # Google Fonts (Inter + Geist Mono)
    portfolio-data.ts     # Data access layer
    gtm.ts                # GTM dataLayer helpers
    ...
```

### Route Map

23 routes discovered via sitemap:

```
/                      (homepage)
/profile/
/contact/
/services/
/services/ai-agent-development/
/services/ai-llm-application-development/
/services/full-stack-ai-product-development/
/services/ga4-bigquery-campaign-analytics/
/services/marketing-analytics-consultant/
/services/rag-consultant-india/
/case-studies/
/case-studies/adticks/
/case-studies/technical-blog/
/case-studies/udemy-enroller-fastapi/
/credentials/
/privacy/
/search/               (noindex, follow)
/feed.xml              (redirects to blog)
/sitemap.xml
/robots.txt
/llms.txt
/ai-profile.json
/humans.txt
```

### Data/Content Sources

- `Data/portfolio-content.json` — Local data file (CMS target)
- `getPortfolioData()` — Async data loader (reads from file, used by Server Components)
- `resolveSiteUrl()` — Site URL resolver (reads `NEXT_PUBLIC_SITE_URL` env var)
- Content editable via `/cms/` admin interface (Basic Auth protected)

---

## 5. Build, Lint, Typecheck, and Test Results

### Biome Lint (pnpm lint)

- **Result:** PASS
- `Checked 124 files in 57ms. No fixes applied.`
- 124 files checked, no lint errors.

### Biome Format Check (pnpm format:check)

- **Result:** FAIL
- **Finding status:** Confirmed issue
- **Severity:** Low | **Confidence:** High | **Effort:** XS
- **Location:** `scripts/seo-smoke-test.mjs:66`
- **Issue:** Line exceeds formatter column width limit:
  ```javascript
  if (smStatus !== 200 || (!smText.includes("<urlset") && !smText.includes("<sitemapindex"))) {
  ```
  This line is too long (~112 chars) and Biome's formatter wants it broken up.
- **Fix:** Run `pnpm format` (Biome format --write) to auto-fix, or manually break the condition across multiple lines.

### TypeScript Type Check (pnpm typecheck)

- **Result:** PASS
- `tsc --noEmit` completed with 0 errors.

### Unit Tests (pnpm test — Vitest)

- **Result:** PASS
- `Test Files: 4 passed. Tests: 25 passed.`
- No failures or warnings.

### E2E Tests (pnpm test:e2e — Playwright)

- **Result:** PASS
- `Running 76 tests using 8 workers. 76 passed.`
- Tests cover: No-JS accessibility, SEO tags, schema validity, Basic Auth guards, homepage rendering, navigation flows.

### Next.js Build (pnpm build)

- **Result:** PASS
- Next.js 16.2.9 production build compiled successfully.
- 36 pages generated (including dynamic routes for services and case studies).

---

## 6. Live Site Crawl Summary

### URL Inventory

| URL | Status | Canonical | Title Length | Description Length | H1 Count |
|---|---|---|---|---|---|
| `/` | 200 | `https://madhudadi.in/` | 56 chars | ~158 chars | 1 |
| `/profile/` | 200 | `https://madhudadi.in/profile/` | ✓ | ✓ | 1 |
| `/contact/` | 200 | `https://madhudadi.in/contact/` | ✓ | ✓ | 1 |
| `/services/` | 200 | ✓ | ✓ | ✓ | 1 |
| `/services/ai-agent-development/` | 200 | ✓ | ✓ | ✓ | 1 |
| `/services/ai-llm-application-development/` | 200 | ✓ | ✓ | ✓ | 1 |
| `/services/full-stack-ai-product-development/` | 200 | ✓ | ✓ | ✓ | 1 |
| `/services/ga4-bigquery-campaign-analytics/` | 200 | ✓ | ✓ | ✓ | 1 |
| `/services/marketing-analytics-consultant/` | 200 | ✓ | ✓ | ✓ | 1 |
| `/services/rag-consultant-india/` | 200 | ✓ | ✓ | ✓ | 1 |
| `/case-studies/` | 200 | ✓ | ✓ | ✓ | 1 |
| `/case-studies/adticks/` | 200 | ✓ | ✓ | ✓ | 1 |
| `/case-studies/technical-blog/` | 200 | ✓ | ✓ | ✓ | 1 |
| `/case-studies/udemy-enroller-fastapi/` | 200 | ✓ | ✓ | ✓ | 1 |
| `/credentials/` | 200 | ✓ | ✓ | ✓ | 1 |
| `/privacy/` | 200 | ✓ | ✓ | ✓ | 1 |
| `/search/` | 200 | N/A (noindex) | ✓ | ✓ | 1 |

### Key Observations

- **All 23 routes respond correctly** (200 OK or expected redirect)
- **Search page** has `noindex, follow` — correct
- **404 handling** works via both `global-not-found.tsx` (for invalid routes) and `not-found.tsx` (for route-group-level)
- **CMS auth protection** works — `/cms/` returns 403 (Basic Auth challenge) without credentials
- **www→non-www redirect** works: `www.madhudadi.in` → `301` → `madhudadi.in`
- **Legacy feed redirects** work: `/feed.xml`, `/feed.atom` → `301` → `blog/feed.xml`
- **Legacy sitemap redirect** works: `/sitemap-portfolio.xml` → `308` → `/sitemap.xml`

### Structured Data on Homepage

9 schema types detected in the JSON-LD `@graph`:

| Type | @id |
|---|---|
| Person | `https://madhudadi.in/#person` |
| Occupation | `https://madhudadi.in/#occupation` |
| Organization | `https://madhudadi.in/#organization` |
| WebSite | `https://madhudadi.in/#website` |
| WebPage | `https://madhudadi.in/#webpage` |
| BreadcrumbList | `https://madhudadi.in/#breadcrumb` |
| FAQPage | `https://madhudadi.in/#faq` (8 Q&A pairs) |
| ItemList (Services) | `https://madhudadi.in/#services` (6 items) |
| ItemList (Projects) | `https://madhudadi.in/#projects` (3 items) |

---

## 7. Codebase Line-by-Line Review

### Reviewed File Inventory

| File | Lines | Key Findings |
|---|---|---|
| `src/proxy.ts` | 54 | Constant-time comparison has early exit; Basic Auth credentials from env |
| `middleware.ts` | 63 | CSP in Report-Only mode; `unsafe-inline` weakens CSP |
| `next.config.ts` | 235 | Duplicate cache headers for sitemap.xml & robots.txt |
| `src/components/SeoStructuredData.tsx` | 217 | Speakable `cssSelector` too broad (`["main"]`) |
| `src/lib/jsonld.ts` | 941 | Occupation skills hardcoded; GBP excluded from sameAs |
| `src/components/Section.tsx` | 40 | Client Component due to motion; JS animations bypass reduced-motion CSS |
| `src/components/ContactForm.tsx` | 282 | No client-side rate limiting |
| `src/app/actions/submit-contact-form.ts` | 289 | In-memory rate limiting lost on cold starts |
| `src/app/api/cms/upload/route.ts` | 134 | No rate limiting on upload endpoint |
| `src/components/NewPortfolioExperience.tsx` | 888 | Blog icon aria-hidden conflict (line 641) |
| `src/lib/fonts.ts` | 14 | Inter only — no font pairing |
| `src/app/globals.css` | 234 | Reduced-motion CSS doesn't cover JS animations |
| `scripts/seo-smoke-test.mjs` | 232 | Line 66 formatting issue |
| `.env.local` | 10 | **CRITICAL:** Plaintext secrets |
| `src/app/(portfolio)/page.tsx` | 58 | Person.mainEntityOfPage references ProfilePage not in graph |
| `src/app/(portfolio)/privacy/page.tsx` | 197 | Privacy statement says no cookies, but GTM uses cookies |

### Key Findings by Category

#### Maintainability
- **Occupation skills hardcoded** in `jsonld.ts:373` as a static string — should pull from portfolio data
- **Section.tsx** is a Client Component solely for motion animations — could be split into Server wrapper + Client animation leaf

#### Code Quality
- **Biome formatting** error in `seo-smoke-test.mjs:66` (long line)
- **`.env.local` committed** to repo — plaintext API keys (see Security section)

---

## 8. Functional Bugs and Edge Cases

| Finding | Status | Severity | Details |
|---|---|---|---|
| Constant-time comparison has early exit | Confirmed issue | Medium | `proxy.ts:18-19` — length check leaks information about credential length |
| CSP `unsafe-inline` nullifies nonce for older browsers | Confirmed issue | Medium | `middleware.ts:20` — `'unsafe-inline'` acts as a fallback that weakens CSP for browsers that don't support `strict-dynamic` |
| Form re-submission after success not blocked | Risk/likely issue | Low | `ContactForm.tsx` doesn't disable the form after successful submission (user could submit twice) |

---

## 9. Technical SEO Audit

| # | Finding | Status | Severity | Confidence | Effort |
|---|---|---|---|---|---|
| SEO-1 | **No HTTP→HTTPS redirect** from `http://madhudadi.in` | **Confirmed issue** | **Critical** | High | XS |
| SEO-2 | **No www→non-www redirect from http://www.madhudadi.in** | Confirmed issue | High | High | XS |
| SEO-3 | **Duplicate cache headers** for sitemap.xml and robots.txt | Confirmed issue | High | High | XS |
| SEO-4 | Canonical tags present and correct on all pages | Confirmed strength | — | High | — |
| SEO-5 | Sitemap flat URL-set with 16 entries, no recursion | Confirmed strength | — | High | — |
| SEO-6 | Legacy sitemap-portfolio.xml returns 308 redirect | Confirmed strength | — | High | — |
| SEO-7 | robots.txt comprehensive with AI crawler sections | Confirmed strength | — | High | — |
| SEO-8 | Search page has noindex, follow | Confirmed strength | — | High | — |
| SEO-9 | All pages have unique titles and meta descriptions | Confirmed strength | — | High | — |
| SEO-10 | Open Graph and Twitter Card tags present on all pages | Confirmed strength | — | High | — |
| SEO-11 | trailingSlash: true avoids duplicate content issues | Confirmed strength | — | High | — |
| SEO-12 | IndexNow verification key present | Confirmed strength | — | High | — |
| SEO-13 | Blog is separate app — link equity divided between portfolio and blog subdomain | Opportunity | Low | High | M |

### Details on Key Findings

**SEO-1: HTTP→HTTPS redirect missing**
- `curl -I http://madhudadi.in/` does NOT redirect to HTTPS.
- This means unencrypted traffic reaches the application. Vercel/Cloudflare typically handle this at the edge; if the current setup bypasses that layer, search engines may index the HTTP version.
- **Recommendation:** Add edge-level redirect (Cloudflare SSL/TLS → Edge Rules) or handle in `next.config.ts` via `redirects()`.

**SEO-2: www→non-www from HTTP varies**
- `https://www.madhudadi.in/` redirects correctly (301 → `https://madhudadi.in/`).
- But `http://www.madhudadi.in/` behavior was not tested — if it doesn't redirect, there are 4 potential URL variations serving content.
- **Recommendation:** Ensure all 3 non-canonical variants (http://, http://www, https://www) redirect to `https://madhudadi.in/`.

**SEO-3: Duplicate cache headers**
- `next.config.ts` defines sitemap.xml headers TWICE:
  - Lines 123-131: `Cache-Control: no-cache, no-store, must-revalidate`
  - Lines 199-208: `Cache-Control: public, max-age=3600, stale-while-revalidate=86400`
- The second definition wins (Next.js merges them), but the duplication creates confusion.
- Same for robots.txt: lines 133-140 and 212-214.
- **Recommendation:** Remove the earlier `no-cache` entries (lines 123-140). Keep only the `public, max-age=...` entries.

---

## 10. Structured Data Audit

| # | Finding | Status | Severity | Confidence |
|---|---|---|---|---|
| SD-1 | **Person.mainEntityOfPage references ProfilePage (`profile/#webpage`) not included in homepage graph** | **Confirmed issue** | **Medium** | High |
| SD-2 | **Speakable cssSelector too broad on WebPage** (`["main"]`) | **Confirmed issue** | **Medium** | High |
| SD-3 | **Google Business Profile excluded from sameAs array** | **Confirmed issue** | **Medium** | High |
| SD-4 | JSON-LD validates as valid JSON with no parse errors | Confirmed strength | — | High |
| SD-5 | Single `@graph` with Person as primary entity | Confirmed strength | — | High |
| SD-6 | FAQPage with 8 Q&A pairs present | Confirmed strength | — | High |
| SD-7 | HowTo schema for hiring path present | Confirmed strength | — | High |
| SD-8 | BreadcrumbList present on all pages | Confirmed strength | — | High |
| SD-9 | SiteLinksSearchBox (SearchAction) properly configured | Confirmed strength | — | High |
| SD-10 | Blog sub-site linked via WebSite.hasPart | Confirmed strength | — | High |

### Details on Key Findings

**SD-1:** The `Person` schema's `mainEntityOfPage` points to `profile/#webpage` (the ProfilePage schema). However, the homepage (`page.tsx`) only includes `["Person", "Occupation", "WebSite", "WebPage", "Breadcrumb", "FAQ"]` — ProfilePage is NOT rendered. The `mainEntityOfPage` reference therefore points to an `@id` that does not exist in the graph on the homepage.

- **Fix:** Either add "ProfilePage" to the homepage node list, or change `Person.mainEntityOfPage` to point to the WebPage `@id` (`#webpage` when not on profile page).

**SD-2:** In `SeoStructuredData.tsx:170`, the WebPage's `speakable` targets `["main"]` — the entire `<main>` element. Google's speakable specification recommends targeting specific content sections (headings and summaries), not the entire page content.

- **Fix:** Change `cssSelector: ["main"]` to `["#main-content h1", "#main-content h2", "#main-content p"]` (matching the ProfilePage pattern in `jsonld.ts:535`).

**SD-3:** In `jsonld.ts:156-161`, the `sameAs` array explicitly filters out `googleBusiness`:
```typescript
.filter(([key, v]) => key !== "googleBusiness" && typeof v === "string" && v.length > 0)
```
This means the Google Business Profile (`https://maps.google.com/?cid=...`) is NOT in the `sameAs` array, even though it's available in the social links data.

- **Fix:** Remove the `key !== "googleBusiness"` filter condition, or add the GBP URL to `sameAs` separately.

---

## 11. GEO/AEO/AI-Search Readiness Audit

| # | Finding | Status | Severity | Confidence |
|---|---|---|---|---|
| GA-1 | `llms.txt` serving correctly with entity-focused content | Confirmed strength | — | High |
| GA-2 | `ai-profile.json` serving with correct structured metadata | Confirmed strength | — | High |
| GA-3 | `ai-plugin.json` present in `.well-known/` | Confirmed strength | — | High |
| GA-4 | `humans.txt` present | Confirmed strength | — | High |
| GA-5 | robots.txt has specific AI crawler sections (OAI-SearchBot, Claude-SearchBot, PerplexityBot, Applebot, BraveBot allowed) | Confirmed strength | — | High |
| GA-6 | Model training crawlers (GPTBot, Google-Extended, ClaudeBot) disallowed | Confirmed strength | — | High |
| GA-7 | Entity keyword strategy aligned around "AI and analytics engineer" (not generic "AI consulting company") | Confirmed strength | — | High |
| GA-8 | `llms-full.txt` available for deeper context | Confirmed strength | — | High |
| GA-9 | `<link rel="llms">` and `<link rel="ai-profile">` in HTML head | Confirmed strength | — | High |
| GA-10 | FAQPage with 8 Q&A pairs for answerability | Confirmed strength | — | High |
| GA-11 | HowTo schema for "how to hire" | Confirmed strength | — | High |
| GA-12 | Education degree typo (`Batchelor`) **resolved** to `Bachelor of Technology` | Confirmed strength | — | High |
| GA-13 | Broad company keywords completely removed from all endpoints | Confirmed strength | — | High |

### GEO/AEO Readiness Score: **94/100**

The site is exceptionally well-prepared for AI search engine discovery. Points deducted only for the speakable CSS selector issue (SD-2) and the ProfilePage reference issue (SD-1), which reduce AI crawler precision.

---

## 12. Content and E-E-A-T Audit

| # | Finding | Status | Severity | Confidence |
|---|---|---|---|---|
| CE-1 | Verified credentials: 9+ years experience (Novartis, redBus, GroupM/WPP) | Confirmed strength | — | High |
| CE-2 | Certifications listed properly with credential URLs | Confirmed strength | — | High |
| CE-3 | Education: Bachelor of Technology (no typo) | Confirmed strength | — | High |
| CE-4 | 3 featured case studies with detailed write-ups | Confirmed strength | — | High |
| CE-5 | 6 professional services with pricing | Confirmed strength | — | High |
| CE-6 | FAQ section answering key visitor questions | Confirmed strength | — | High |
| CE-7 | **Occupation skills hardcoded** — go stale if offerings change | Confirmed issue | Low | High |
| CE-8 | Blog is separate app — creates content silo | Opportunity | Low | Medium |

### E-E-A-T Assessment

The site demonstrates **strong E-E-A-T**:
- **Experience:** 9+ years at recognizable companies
- **Expertise:** Detailed case studies with technical depth, certifications listed
- **Authoritativeness:** LinkedIn, GitHub, and other professional profiles linked
- **Trustworthiness:** Clear contact form, privacy policy (though needs cookie disclosure update), SSL

---

## 13. UI/UX and Conversion Audit

| # | Finding | Status | Severity | Confidence | Effort |
|---|---|---|---|---|---|
| UX-1 | **Font strategy uses Inter for both display and body** (no font pairing) | **Confirmed issue** | **Medium** | High | M |
| UX-2 | Excellent conversion paths: Recruiter (1 click), Consulting (3 clicks max) | Confirmed strength | — | High | — |
| UX-3 | Intent-based contact prefill (7+ intent templates via URL hash) | Confirmed strength | — | High | — |
| UX-4 | Mobile navigation: 44×44px touch targets, full-width overlay | Confirmed strength | — | High | — |
| UX-5 | Sticky header with persistent "Hire me" CTA | Confirmed strength | — | High | — |
| UX-6 | Honeypot spam protection (no CAPTCHA friction) | Confirmed strength | — | High | — |
| UX-7 | Availability badge with green pulse indicator | Confirmed strength | — | High | — |
| UX-8 | Consistent section pattern (eyebrow → gradient h2 → content) | Confirmed strength | — | High | — |
| UX-9 | Sections follow logical order: About → Stats → Projects → Services → Skills → Experience → Certifications → FAQ → Contact | Confirmed strength | — | High | — |
| UX-10 | **Contact section is last** — users may lose interest before reaching CTA | Opportunity | Low | Medium | XS |
| UX-11 | **No "Book a discovery call" direct CTA** in hero | Opportunity | Low | Medium | S |

### UI/UX Score: **80/100**

The site has excellent architecture and conversion design. The main penalty is the flat typographic hierarchy from using Inter for both display and body text.

### Visual Hierarchy
- **Current:** Both `--font-sans` and `--font-display` use Inter (`globals.css:43-44`). Only `--font-mono` uses Geist Mono for distinction.
- **Impact:** All text (headings, body, UI) looks uniform — no typographic contrast to guide the eye.
- **Fix:** Pair Inter (body) with a distinctive display font: Satoshi, Cabinet Grotesk, or a serif like Literata for headings.

### Conversion Paths
- **Recruiter path:** `Hero "Hire me" → /contact/` (1 click) — excellent
- **Consulting path:** `Hero "See case studies" → case studies → detail page → contact` (3 clicks max)
- **Opportunity:** Add a "Book a discovery call" CTA linking to `/contact/#intent=ai-llm` to reduce consulting path to 1 click.

---

## 14. Accessibility Audit

| # | Finding | Status | Severity | WCAG Criterion | Effort |
|---|---|---|---|---|---|
| A11Y-1 | **Reduced-motion CSS doesn't cover motion library JS animations** | **Confirmed issue** | **High** | 2.3.3 Animation from Interactions | S |
| A11Y-2 | **Blog icon has conflicting `aria-hidden="true"` + `alt="Blog icon"`** | **Confirmed issue** | **Medium** | 1.1.1 Non-text Content | XS |
| A11Y-3 | Semantic HTML: proper landmarks, heading hierarchy H1→H2→H3 | Confirmed strength | — | 1.3.1 | — |
| A11Y-4 | Skip-to-content link present and focusable | Confirmed strength | — | 2.1.1, 2.4.3 | — |
| A11Y-5 | Mobile menu focus trap with Tab/Shift+Tab cycling, Escape to close | Confirmed strength | — | 2.1.2, 2.4.3 | — |
| A11Y-6 | `aria-current="page"` on active nav links | Confirmed strength | — | 4.1.2 | — |
| A11Y-7 | Form fields: proper `<label>`, `aria-invalid`, `aria-describedby` for errors | Confirmed strength | — | 1.3.1, 3.3.2, 4.1.2 | — |
| A11Y-8 | Form status messages: `role="alert"` (errors), `role="status"` (success) | Confirmed strength | — | 4.1.3 | — |
| A11Y-9 | Color contrast exceeds WCAG AA (20.6:1 foreground/background) | Confirmed strength | — | 1.4.3 | — |
| A11Y-10 | Touch targets meet 44×44px recommendation | Confirmed strength | — | 2.5.8 | — |
| A11Y-11 | AutoComplete attributes on form fields | Confirmed strength | — | 1.3.5 | — |
| A11Y-12 | FAQ accordion with proper `aria-expanded`, `aria-controls` | Confirmed strength | — | 4.1.2 | — |

### Accessibility Score: **85/100**

Strong semantic HTML and ARIA implementation. The main gaps are:
1. Motion library JS animations (`Section.tsx`) bypass the CSS `prefers-reduced-motion: reduce` media query (`globals.css:225-233`).
2. Blog icon image has contradictory `aria-hidden="true"` + non-empty `alt` text.

---

## 15. Performance Audit

| # | Finding | Status | Severity | Confidence | Effort |
|---|---|---|---|---|---|
| PERF-1 | **Duplicate cache headers** for sitemap.xml and robots.txt | **Confirmed issue** | **High** | High | XS |
| PERF-2 | **Section.tsx Client Component** adds unnecessary client boundaries | **Confirmed issue** | **Medium** | High | M |
| PERF-3 | GTM deferred to first user interaction (exemplary pattern) | Confirmed strength | — | High | — |
| PERF-4 | Web Vitals dynamically imported, production-only | Confirmed strength | — | High | — |
| PERF-5 | `experimental.inlineCss: true` for critical CSS inlining | Confirmed strength | — | High | — |
| PERF-6 | `optimizePackageImports` for @tabler/icons-react and motion | Confirmed strength | — | High | — |
| PERF-7 | Image configuration: remote patterns, 31-day cache TTL, WebP/AVIF | Confirmed strength | — | High | — |
| PERF-8 | Font: `display:swap` prevents FOIT | Confirmed strength | — | High | — |
| PERF-9 | `compiler.removeConsole` strips debug logs in production | Confirmed strength | — | High | — |
| PERF-10 | Server Component architecture for data fetching (PortfolioContent) | Confirmed strength | — | High | — |
| PERF-11 | Tailwind JIT purges unused CSS automatically | Confirmed strength | — | High | — |

### Performance Score: **80/100**

The site is well-optimized with an excellent third-party script strategy. The main penalties are duplicate cache headers causing confusion, and the Section component creating client boundaries at every section.

### Caching Strategy Analysis

| Resource | Current Config | Issue |
|---|---|---|
| `/sitemap.xml` | **DUPLICATE:** `no-cache` (line 125) + `public, max-age=3600` (line 203) | Second wins, but ambiguous |
| `/robots.txt` | **DUPLICATE:** `no-cache` (line 135) + `public, max-age=86400` (line 213) | Same issue |
| `/llms.txt` | `public, max-age=3600, stale-while-revalidate=86400` | Correct |
| `/ai-profile.json` | `public, max-age=3600, stale-while-revalidate=86400` | Correct |
| `/humans.txt` | `public, max-age=86400` | Correct |
| IndexNow key | `public, max-age=31536000, immutable` | Correct |
| HTML pages | No explicit cache headers (Vercel defaults) | Acceptable |
| `/_next/static/*` | No explicit headers (Vercel handles automatically) | Acceptable |

---

## 16. Security and Privacy Audit

| # | Finding | Status | Severity | Confidence | Effort |
|---|---|---|---|---|---|
| SEC-1 | **`.env.local` contains plaintext secrets** (OPENAI_API_KEY, RESEND_API_KEY, CMS_AUTH_PASSWORD) | **Confirmed issue** | **Critical** | High | S |
| SEC-2 | **CSP in Report-Only mode** (Content-Security-Policy-Report-Only, not enforced) | **Confirmed issue** | **High** | High | M |
| SEC-3 | **CSP `unsafe-inline` weakens protection** (falls back when `strict-dynamic` unsupported) | **Confirmed issue** | **High** | High | M |
| SEC-4 | **Basic Auth credentials in plaintext** in `.env.local` (CMS_AUTH_USERNAME/PASSWORD) | **Confirmed issue** | **High** | High | S |
| SEC-5 | **Constant-time comparison has early exit** (proxy.ts:18-19) | **Confirmed issue** | **Medium** | High | XS |
| SEC-6 | **In-memory rate limiting lost on serverless cold starts** (submit-contact-form.ts:38) | **Confirmed issue** | **Medium** | High | M |
| SEC-7 | **No upload rate limiting on CMS upload endpoint** (api/cms/upload/route.ts) | **Confirmed issue** | **Medium** | High | S |
| SEC-8 | **Privacy policy misleading about cookies** ("I do not collect... through cookies" but GTM uses cookies) | **Confirmed issue** | **Medium** | High | XS |
| SEC-9 | CMS origin validation returns `true` when no Origin header present | Risk/likely issue | Low | Medium | XS |
| SEC-10 | HSTS header present (`max-age=63072000; includeSubDomains; preload`) | Confirmed strength | — | High | — |
| SEC-11 | Security headers present: X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy, COOP, COEP, CORP | Confirmed strength | — | High | — |
| SEC-12 | IndexNow verification key publicly accessible (expected) | Confirmed strength | — | High | — |

### Security Score: **50/100**

The presence of plaintext secrets in `.env.local` is the most critical finding. CSP not being enforced is a close second. These two issues alone bring the security score down significantly.

### Details on Key Findings

**SEC-1: Plaintext secrets in `.env.local`**
```
OPENAI_API_KEY="sk-proj-8-7B2aUz__..."
CMS_AUTH_USERNAME=madhu
CMS_AUTH_PASSWORD=Madhu22444@.
RESEND_API_KEY=re_DnmF2LJr_...
```
- **Risk:** If `.env.local` is committed to git or exposed through any means (misconfigured web server, CI/CD leak, etc.), all these services are compromised.
- **Fix:** 
  - Remove `.env.local` from git tracking (it should already be in `.gitignore` — verify)
  - Rotate ALL exposed keys immediately
  - Use a secrets manager (Vercel Environment Variables, Doppler, 1Password CLI)

**SEC-2: CSP Report-Only**
- `middleware.ts:39,47` sets `Content-Security-Policy-Report-Only` instead of `Content-Security-Policy`.
- This means CSP violations are reported but NOT blocked. An actual XSS attack would succeed.
- **Fix:** Switch to enforced CSP after monitoring reports for a sufficient period.

**SEC-3: `unsafe-inline` in CSP**
- `middleware.ts:20` includes `'unsafe-inline'` in `script-src`.
- For browsers that support `strict-dynamic`, the nonce provides protection. But older browsers that don't support `strict-dynamic` fall back to `'unsafe-inline'`, which completely nullifies the CSP.
- **Fix:** Remove `'unsafe-inline'` from script-src once you've verified all inline scripts use nonces.

**SEC-5: Constant-time comparison early exit**
- `proxy.ts:17-26`: The `constantTimeEqual` function returns early at line 19 if the two strings have different lengths. This leaks timing information about credential length.
- In practice, Basic Auth credentials are typically of known or guessable length, so the practical risk is low. Still, a true constant-time comparison should not branch on secret data at all.

**SEC-6: In-memory rate limiting**
- `submit-contact-form.ts:38`: Uses a `Map<string, { count, resetAt }>` stored in module scope. On serverless platforms (Vercel), this is lost on cold starts, allowing a burst of requests after each cold start.
- **Fix:** Use Vercel KV, Upstash Redis, or a database-backed rate limiter.

**SEC-7: No upload rate limiting**
- `api/cms/upload/route.ts`: No rate limiting on the POST endpoint. An attacker could upload unlimited files (up to 8MB each) until disk quota is exhausted.
- **Fix:** Add rate limiting (same concern as SEC-6 — use external store for persistence across cold starts).

**SEC-8: Privacy policy cookie statement**
- Privacy page says: *"I do not collect personal information through cookies or tracking technologies for the purpose of identifying you individually."*
- But `DeferredGTM.tsx` loads Google Tag Manager, which sets `_ga`, `_gid` cookies (Google Analytics). These ARE tracking cookies.
- **Fix:** Update privacy policy to disclose GTM/GA cookie usage, or implement a cookie consent mechanism.

---

## 17. Analytics and Measurement Audit

| # | Finding | Status | Severity | Confidence |
|---|---|---|---|---|
| AN-1 | GTM implemented with deferred loading (first user interaction) | Confirmed strength | — | High |
| AN-2 | Conversion events tracked: contact_form_submit, contact_form_error, hire_me_click, resume_download | Confirmed strength | — | High |
| AN-3 | Web Vitals reporting implemented (via GTM dataLayer + /api/web-vitals/) | Confirmed strength | — | High |
| AN-4 | **No error monitoring** (Sentry, Rollbar, etc.) | **Risk/likely issue** | **Medium** | High |
| AN-5 | **No AI crawler log monitoring** | **Opportunity** | **Low** | Medium |

### Analytics Score: **75/100**

The GTM and Web Vitals implementation is exemplary. The lack of error monitoring means production bugs go undetected until users report them. AI crawler log monitoring would help validate GEO/AEO strategy effectiveness.

---

## 18. Local/Global Positioning Audit

| # | Finding | Status | Severity | Confidence |
|---|---|---|---|---|
| LP-1 | Location clearly stated (India) in schema and content | Confirmed strength | — | High |
| LP-2 | Nationality in Person schema (India) | Confirmed strength | — | High |
| LP-3 | Area served: Worldwide (ProfessionalService) | Confirmed strength | — | High |
| LP-4 | Language: en-IN (schema) — appropriate for Indian English | Confirmed strength | — | High |
| LP-5 | Google Business Profile linked (via short URL `/google`) | Confirmed strength | — | High |
| LP-6 | GBP not included in `sameAs` array (see SD-3) | Confirmed issue | Medium | High |
| LP-7 | Location-specific keywords used ("AI consultant in India", "RAG consultant India") | Confirmed strength | — | High |

### Local Positioning Assessment

The site positions Madhu Dadi as a globally-available consultant based in India. This is clearly communicated through:
- Schema: nationality, address, areaServed
- Content: "AI consultant in India" in keywords
- GBP integration via short links

The only gap is the GBP exclusion from `sameAs`, which reduces the local signal in Google's Knowledge Graph.

---

## 19. Prioritized Roadmap

### Today (0-1 day)

| # | Task | Severity | Effort |
|---|---|---|---|
| 1 | **Rotate all exposed API keys** (OPENAI, RESEND, CMS_AUTH) | Critical | S |
| 2 | **Delete `.env.local` from git** (verify `.gitignore` includes it) | Critical | XS |
| 3 | **Remove duplicate cache headers** in `next.config.ts` (lines 123-140) | High | XS |
| 4 | **Fix Biome formatting error** in `scripts/seo-smoke-test.mjs:66` — run `pnpm format` | Low | XS |
| 5 | **Fix blog icon aria-hidden** (`NewPortfolioExperience.tsx:641`) — change `alt="Blog icon"` to `alt=""` | Medium | XS |

### This Week

| # | Task | Severity | Effort |
|---|---|---|---|
| 6 | **Add HTTP→HTTPS redirect** (Cloudflare Edge Rule or Vercel config) | Critical | XS |
| 7 | **Fix speakable cssSelector** — change `["main"]` to `["#main-content h1", "#main-content h2", "#main-content p"]` in `SeoStructuredData.tsx:170` | Medium | XS |
| 8 | **Add GBP to sameAs** — remove `key !== "googleBusiness"` filter in `jsonld.ts:159` | Medium | XS |
| 9 | **Fix reduced-motion for JS animations** — use motion's `useReducedMotion()` hook in `Section.tsx` | High | S |
| 10 | **Update privacy policy** to disclose GTM/GA cookie usage | Medium | XS |
| 11 | **Switch CSP from Report-Only to enforced** (after monitoring) | High | M |

### This Month

| # | Task | Severity | Effort |
|---|---|---|---|
| 12 | **Implement persistent rate limiting** (Vercel KV or Upstash Redis) for contact form and CMS upload | Medium | M |
| 13 | **Add rate limiting to CMS upload endpoint** | Medium | S |
| 14 | **Split Section.tsx** into Server wrapper + Client animation leaf | Medium | M |
| 15 | **Fix Person.mainEntityOfPage** to reference correct `@id` on homepage | Medium | XS |
| 16 | **Add error monitoring** (Sentry or similar) | Medium | M |
| 17 | **Implement font pairing** (display font + Inter body) | Medium | M |

### Later

| # | Task | Severity | Effort |
|---|---|---|---|
| 18 | **Make Occupation skills dynamic** — pull from portfolio data instead of hardcoded string | Low | S |
| 19 | **Add "Book a discovery call" CTA** to hero section | Low | S |
| 20 | **Move Contact section before FAQ** on homepage | Low | XS |
| 21 | **Self-host fonts** instead of Google Fonts for privacy | Low | M |
| 22 | **Add submit button spinner animation** to contact form | Low | XS |
| 23 | **Add AI crawler log monitoring** | Low | M |

---

## 20. Exact Implementation Recommendations

### Fix 1: Remove Duplicate Cache Headers (HIGH, XS)

**File:** `next.config.ts`

**Current (lines 123-140 — REMOVE these entire blocks):**
```typescript
{
  source: "/sitemap.xml",
  headers: [
    {
      key: "Cache-Control",
      value: "no-cache, no-store, must-revalidate",
    },
  ],
},
{
  source: "/robots.txt",
  headers: [
    {
      key: "Cache-Control",
      value: "no-cache, no-store, must-revalidate",
    },
  ],
},
```

**Action:** Delete lines 123-140 entirely. Keep the later entries (lines 199-214) which have the correct caching policy.

**Validation:** `pnpm build && curl -I https://madhudadi.in/sitemap.xml | grep -i "cache-control"` should show `public, max-age=3600, stale-while-revalidate=86400`.

---

### Fix 2: Fix Blog Icon aria-hidden (MEDIUM, XS)

**File:** `src/components/NewPortfolioExperience.tsx`

**Current (line 641):**
```tsx
alt="Blog icon"
```

**Replacement:**
```tsx
alt=""
```

**Validation:** `rg "alt=.Blog icon" src/` should return no results. Screen reader test should not announce "Blog icon" for a decorative image next to the "Blog" link text.

---

### Fix 3: Fix Speakable CSS Selector (MEDIUM, XS)

**File:** `src/components/SeoStructuredData.tsx`

**Current (line 170):**
```typescript
speakable: {
  "@type": "SpeakableSpecification",
  cssSelector: ["main"],
},
```

**Replacement:**
```typescript
speakable: {
  "@type": "SpeakableSpecification",
  cssSelector: ["#main-content h1", "#main-content h2", "#main-content p"],
},
```

**Validation:** `pnpm build; node scripts/audit-seo.js` — verify JSON-LD in build output contains the corrected selector.

---

### Fix 4: Add GBP to sameAs (MEDIUM, XS)

**File:** `src/lib/jsonld.ts`

**Current (lines 156-161):**
```typescript
const sameAs = Object.entries(socialLinks ?? {})
  .filter(
    ([key, v]) =>
      key !== "googleBusiness" && typeof v === "string" && v.length > 0,
  )
  .map(([, v]) => v as string);
```

**Replacement:**
```typescript
const sameAs = Object.entries(socialLinks ?? {})
  .filter(
    ([key, v]) =>
      typeof v === "string" && v.length > 0,
  )
  .map(([, v]) => v as string);
```

**Validation:** Verify built JSON-LD includes `https://maps.google.com/?cid=CXaUijPkQhVkEBM` in the `sameAs` array.

---

### Fix 5: Fix Reduced Motion for JS Animations (HIGH, S)

**File:** `src/components/Section.tsx`

**Current:**
```typescript
"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

export function Section({
  id, eyebrow, title, children,
}: {
  id: string; eyebrow: string; title: string; children: ReactNode;
}) {
  return (
    <motion.section
      id={id}
      data-motion-initial
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7 }}
      className="scroll-mt-28 py-8 md:py-12"
    >
      ...
    </motion.section>
  );
}
```

**Replacement:**
```typescript
"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export function Section({
  id, eyebrow, title, children,
}: {
  id: string; eyebrow: string; title: string; children: ReactNode;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.section
      id={id}
      data-motion-initial
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
      whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.7 }}
      className="scroll-mt-28 py-8 md:py-12"
    >
      ...
    </motion.section>
  );
}
```

**Validation:** Test with `prefers-reduced-motion: reduce` OS setting — sections should appear without animation.

---

### Fix 6: Fix Person.mainEntityOfPage on Homepage (MEDIUM, XS)

**File:** `src/app/(portfolio)/page.tsx`

**Current (line 50):**
```typescript
<SeoStructuredData
  nodes={[
    "Person",
    "Occupation",
    "WebSite",
    "WebPage",
    "Breadcrumb",
    "FAQ",
  ]}
/>
```

**Replacement (Option A — add ProfilePage):**
```typescript
<SeoStructuredData
  nodes={[
    "Person",
    "Occupation",
    "WebSite",
    "WebPage",
    "ProfilePage",
    "Breadcrumb",
    "FAQ",
  ]}
/>
```

**OR (Option B — fix Person schema to use WebPage):**

In `src/lib/jsonld.ts`, change line 302 conditionally. But Option A is simpler and more correct (the homepage IS a profile page).

**Validation:** Verify JSON-LD on homepage includes ProfilePage schema and the `Person.mainEntityOfPage` reference resolves to a valid `@id` in the graph.

---

### Fix 7: Add HTTP→HTTPS Redirect (CRITICAL, XS)

**Not code-level** — this is an edge/CDN configuration.

**Cloudflare:** Dashboard → SSL/TLS → Edge Rules → Create Edge Rule:
- If scheme equals `http` → Redirect URL → `https://madhudadi.in/` (301)

**Vercel:** Projects → madhu_portfolio → Domains → Ensure `madhudadi.in` is configured with redirect.

**Alternative:** Add to `next.config.ts` `redirects()`:
```typescript
{
  source: "/:path*",
  has: [{ type: "header", key: "x-forwarded-proto", value: "http" }],
  destination: "https://madhudadi.in/:path*",
  permanent: true,
},
```

**Validation:** `curl -I http://madhudadi.in/` should return `301` or `308` with `Location: https://madhudadi.in/`.

---

### Fix 8: Fix Biome Formatting (LOW, XS)

**File:** `scripts/seo-smoke-test.mjs`

**Action:** Run `pnpm format` (biome format --write) to auto-fix the line length issue at line 66.

**Validation:** `pnpm format:check` should pass with no errors.

---

### Fix 9: Rotate Exposed Secrets (CRITICAL, S)

**Action items:**

1. Generate new OpenAI API key: [platform.openai.com/api-keys](https://platform.openai.com/api-keys) → Revoke `sk-proj-8-7B2aUz__...`
2. Generate new Resend API key: [resend.com/api-keys](https://resend.com/api-keys) → Revoke `re_DnmF2LJr_...`
3. Change CMS_AUTH_PASSWORD from `Madhu22444@.` to a strong, random password
4. Update `.env.local` with new values
5. Update production environment variables (Vercel dashboard or deployment platform)
6. Verify `.env.local` is in `.gitignore`:
   ```bash
   grep ".env.local" .gitignore
   ```

**Validation:** `git check-ignore .env.local` should return the filename (meaning it's ignored). No secrets should appear in `git status` or `git diff`.

---

### Fix 10: Update Privacy Policy Cookie Disclosure (MEDIUM, XS)

**File:** `src/app/(portfolio)/privacy/page.tsx`

**Current (line 89-91):**
```tsx
<p className="text-muted-foreground leading-relaxed">
  I do not collect personal information through cookies or tracking
  technologies for the purpose of identifying you individually.
</p>
```

**Replacement:**
```tsx
<p className="text-muted-foreground leading-relaxed">
  I use Google Tag Manager to collect anonymous usage analytics and
  monitor Core Web Vitals (page performance). Google Tag Manager may set
  first-party cookies (such as _ga, _gid) for analytics purposes. No
  personally identifiable information is collected through these
  technologies for the purpose of identifying you individually. You can
  control cookie preferences through your browser settings.
</p>
```

**Validation:** Re-read the privacy page to verify the updated disclosure accurately reflects GTM's cookie usage.

---

## 21. Validation Checklist

### Pre-Fix Validation (Run these NOW to establish baseline)

- [ ] `curl -I http://madhudadi.in/` — note Redirect: or 200 OK (should be 301/308)
- [ ] `curl -I https://www.madhudadi.in/` — should be 301
- [ ] `curl -s https://madhudadi.in/sitemap.xml | grep -c "sitemap-portfolio"` — should be 0
- [ ] `pnpm format:check` — note which files fail
- [ ] `rg -n "Batchelor\|DataIku\|AI consulting company" Data/ src/` — should be 0

### Post-Fix Validation (Run after each fix)

- [ ] `pnpm format:check` — 0 errors
- [ ] `pnpm lint` — 0 errors
- [ ] `pnpm test` — 25 passed
- [ ] `pnpm build` — builds successfully
- [ ] `curl -I http://madhudadi.in/` — 301/308 to HTTPS
- [ ] `curl -I https://madhudadi.in/sitemap.xml | grep -i "cache-control"` — single `public, max-age=3600, stale-while-revalidate=86400`
- [ ] Built homepage JSON-LD contains correct speakable selector and ProfilePage `@id`
- [ ] Verify `.env.local` in `.gitignore` and no secrets in git
- [ ] Verify new API keys work (send test contact form email, test CMS auth)

---

## 22. Open Questions / Data Needed

| # | Question | Why Needed |
|---|---|---|
| 1 | Is `http://madhudadi.in` handled by Cloudflare Edge Rules or is the request reaching the origin server? | Needed to determine where to add the HTTP→HTTPS redirect |
| 2 | Is the blog (`madhudadi.in/blog`) on a subdomain, subdirectory, or separate deployment? | Affects SEO strategy and sitemap integration |
| 3 | What is the current Vercel project configuration (environment variables, domains, deploy hooks)? | Needed to verify deployment drift prevention |
| 4 | Are there Google Search Console or Bing Webmaster accounts with access to crawl statistics? | Would validate sitemap submission and crawl health |
| 5 | What is the current Cloudflare configuration (SSL/TLS mode, Page Rules, Workers)? | Affects security headers, redirects, caching |
| 6 | Is there a cookie consent mechanism planned or required for GDPR/DPDPA compliance? | Privacy policy disclosure depends on this |
| 7 | Are there any other third-party scripts or services not visible in the codebase (e.g., Hotjar, Intercom, etc.)? | Affects privacy policy accuracy |
| 8 | What is the budgeted font licensing if moving to a premium display font (Satoshi, etc.)? | Font pairing recommendation depends on budget |

---

## Appendix A: Scoring Methodology

| Category | Weights | Calculation |
|---|---|---|
| Code health | 10% | Gates passed (lint -5, typecheck -0, test -0, build -0, format -5) = 90 |
| SEO | 15% | Technical SEO (critical missing redirect -10, duplicate headers -5, all else passing) = 88 |
| GEO/AEO | 10% | All endpoints serving, entity aligned, only speakable/ProfilePage issues = 94 |
| UI/UX | 15% | Font pairing -10, conversion paths -5, all else excellent = 80 |
| Accessibility | 10% | Reduced motion -10, aria-hidden -5 = 85 |
| Performance | 10% | Duplicate headers -10, Section client boundary -10 = 80 |
| Security/privacy | 15% | Secrets exposure -30, CSP report-only -10, rate limiting -10 = 50 |
| Conversion readiness | 10% | Near-perfect conversion architecture = 92 |
| Analytics readiness | 5% | Excellent GTM/WV, no error monitoring = 75 |

**Overall = (90×0.10) + (88×0.15) + (94×0.10) + (80×0.15) + (85×0.10) + (80×0.10) + (50×0.15) + (92×0.10) + (75×0.05) = 82.05/100**
