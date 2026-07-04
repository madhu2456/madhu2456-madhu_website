# Findings Ledger — Comprehensive Forensic Audit

Finding status classifications: Confirmed issue, Confirmed strength, Risk/likely issue, Needs verification, Opportunity.  
Severity: Critical, High, Medium, Low, Enhancement.  
Confidence: High, Medium, Low.  
Effort: XS, S, M, L, XL.

---

## SECURITY FINDINGS

### SEC-001 — Plaintext secrets in .env.local
- **Status:** Confirmed issue
- **Severity:** Critical | **Confidence:** High | **Effort:** S
- **Evidence:** `.env.local` contains: `OPENAI_API_KEY`, `RESEND_API_KEY`, `CMS_AUTH_PASSWORD` in plaintext.
- **Recommendation:** Rotate all keys immediately. Remove from git. Use Vercel Environment Variables or secrets manager.

### SEC-002 — CSP in Report-Only mode
- **Status:** Confirmed issue
- **Severity:** High | **Confidence:** High | **Effort:** M
- **Evidence:** `middleware.ts:39,47` sets `Content-Security-Policy-Report-Only` instead of `Content-Security-Policy`.
- **Recommendation:** Switch to enforced CSP after monitoring reports.

### SEC-003 — CSP includes unsafe-inline
- **Status:** Confirmed issue
- **Severity:** High | **Confidence:** High | **Effort:** M
- **Evidence:** `middleware.ts:20`: `script-src` includes `'unsafe-inline'`, which nullifies nonce-based CSP for older browsers.
- **Recommendation:** Remove `'unsafe-inline'` from script-src after verifying all scripts use nonces.

### SEC-004 — Basic Auth credentials in plaintext
- **Status:** Confirmed issue
- **Severity:** High | **Confidence:** High | **Effort:** S
- **Evidence:** `CMS_AUTH_USERNAME=madhu` and `CMS_AUTH_PASSWORD=...[REDACTED]` in `.env.local`.
- **Recommendation:** Use strong random password. Store only in environment variables.

### SEC-005 — Constant-time comparison has early exit
- **Status:** Confirmed issue
- **Severity:** Medium | **Confidence:** High | **Effort:** XS
- **Evidence:** `proxy.ts:18-19`: `constantTimeEqual()` returns early when `a.length !== b.length`, leaking timing info.
- **Recommendation:** Remove length check or pad to equal length before comparing.

### SEC-006 — In-memory rate limiting lost on cold starts
- **Status:** Confirmed issue
- **Severity:** Medium | **Confidence:** High | **Effort:** M
- **Evidence:** `submit-contact-form.ts:38`: Rate limit `Map` in module scope — lost on every serverless cold start.
- **Recommendation:** Use Vercel KV, Upstash Redis, or database-backed rate limiter.

### SEC-007 — No upload rate limiting on CMS upload endpoint
- **Status:** Confirmed issue
- **Severity:** Medium | **Confidence:** High | **Effort:** S
- **Evidence:** `api/cms/upload/route.ts`: No rate limiting on POST endpoint. Attacker can upload files until disk full.
- **Recommendation:** Add rate limiting (same persistent strategy as SEC-006).

### SEC-008 — Privacy policy misleading about cookies
- **Status:** Confirmed issue
- **Severity:** Medium | **Confidence:** High | **Effort:** XS
- **Evidence:** Privacy page says "I do not collect... through cookies" but GTM uses `_ga`, `_gid` cookies.
- **Recommendation:** Update privacy policy to disclose GTM/GA cookie usage.

### SEC-009 — CMS origin validation returns true when no Origin header
- **Status:** Risk/likely issue
- **Severity:** Low | **Confidence:** Medium | **Effort:** XS
- **Evidence:** `api/cms/upload/route.ts:12`: `if (!origin) return true;` — requests without Origin header bypass validation.
- **Recommendation:** Default-deny: reject requests missing Origin header.

---

## SEO FINDINGS

### SEO-001 — No HTTP→HTTPS redirect
- **Status:** Confirmed issue
- **Severity:** Critical | **Confidence:** High | **Effort:** XS
- **Evidence:** `curl -I http://madhudadi.in/` does not redirect to HTTPS.
- **Recommendation:** Add Cloudflare Edge Rule or Vercel redirect.

### SEO-002 — HTTP www→non-www redirect untested
- **Status:** Risk/likely issue
- **Severity:** High | **Confidence:** Medium | **Effort:** XS
- **Evidence:** `https://www` → `https://root` works (301), but `http://www` behavior not verified.
- **Recommendation:** Verify all 3 non-canonical variants redirect to canonical HTTPS+non-www.

### SEO-003 — Duplicate cache headers
- **Status:** Confirmed issue
- **Severity:** High | **Confidence:** High | **Effort:** XS
- **Evidence:** `next.config.ts`: sitemap.xml and robots.txt headers defined twice (lines 123-140 + 199-214).
- **Recommendation:** Remove the earlier `no-cache` entries.

### SEO-004 — Canonical tags present on all pages
- **Status:** Confirmed strength
- **Severity:** — | **Confidence:** High
- **Evidence:** Verified per-route: canonical URLs match served URLs.

### SEO-005 — Sitemap flat URL-set, no recursion
- **Status:** Confirmed strength
- **Severity:** — | **Confidence:** High
- **Evidence:** Live `/sitemap.xml` serves flat `<urlset>` with 16 direct URL entries.

### SEO-006 — Legacy sitemap redirects correctly
- **Status:** Confirmed strength
- **Severity:** — | **Confidence:** High
- **Evidence:** `/sitemap-portfolio.xml` → `308` → `/sitemap.xml`.

### SEO-007 — robots.txt comprehensive
- **Status:** Confirmed strength
- **Severity:** — | **Confidence:** High
- **Evidence:** AI crawler sections, model training disallow, proper sitemap references.

### SEO-008 — Search page noindex,follow
- **Status:** Confirmed strength
- **Severity:** — | **Confidence:** High
- **Evidence:** Live `/search/` HTML contains `<meta name="robots" content="noindex, follow"/>`.

---

## STRUCTURED DATA FINDINGS

### SD-001 — Person.mainEntityOfPage references ProfilePage not in homepage graph
- **Status:** Confirmed issue
- **Severity:** Medium | **Confidence:** High | **Effort:** XS
- **Evidence:** `jsonld.ts:302`: Person points to `profile/#webpage` but homepage doesn't render ProfilePage node.
- **Recommendation:** Add "ProfilePage" to homepage node list.

### SD-002 — Speakable cssSelector too broad (WebPage)
- **Status:** Confirmed issue
- **Severity:** Medium | **Confidence:** High | **Effort:** XS
- **Evidence:** `SeoStructuredData.tsx:170`: `cssSelector: ["main"]` targets entire page.
- **Recommendation:** Change to `["#main-content h1", "#main-content h2", "#main-content p"]`.

### SD-003 — Google Business Profile excluded from sameAs
- **Status:** Confirmed issue
- **Severity:** Medium | **Confidence:** High | **Effort:** XS
- **Evidence:** `jsonld.ts:159`: `key !== "googleBusiness"` filter excludes GBP from sameAs.
- **Recommendation:** Remove the `googleBusiness` filter exclusion.

### SD-004 — JSON-LD validates as valid JSON
- **Status:** Confirmed strength
- **Severity:** — | **Confidence:** High
- **Evidence:** All JSON-LD blocks parse correctly in build output and live HTML.

### SD-005 — Single @graph with Person as primary entity
- **Status:** Confirmed strength
- **Severity:** — | **Confidence:** High
- **Evidence:** Unified graph with Person as root; all other types connected.

---

## UI/UX FINDINGS

### UX-001 — Font strategy uses Inter for display and body
- **Status:** Confirmed issue
- **Severity:** Medium | **Confidence:** High | **Effort:** M
- **Evidence:** `globals.css:43-44`: both `--font-sans` and `--font-display` use Inter.
- **Recommendation:** Add a distinctive display font (Satoshi, Cabinet Grotesk, Literata).

### UX-002 — Excellent conversion paths
- **Status:** Confirmed strength
- **Severity:** — | **Confidence:** High
- **Evidence:** Recruiter path: 1 click. Consulting path: 3 clicks max. Intent prefill for 7+ templates.

### UX-003 — Intent-based contact prefill
- **Status:** Confirmed strength
- **Severity:** — | **Confidence:** High
- **Evidence:** URL hash-based intent system (`#intent=ai-llm`, `#intent=rag`, etc.).

---

## ACCESSIBILITY FINDINGS

### A11Y-001 — Reduced-motion gap for JS animations
- **Status:** Confirmed issue
- **Severity:** High | **Confidence:** High | **Effort:** S
- **Evidence:** `Section.tsx` uses `motion` JS animations; CSS `prefers-reduced-motion` doesn't override inline styles.
- **Recommendation:** Use `useReducedMotion()` hook from `motion/react`.

### A11Y-002 — Blog icon aria-hidden conflict
- **Status:** Confirmed issue
- **Severity:** Medium | **Confidence:** High | **Effort:** XS
- **Evidence:** `NewPortfolioExperience.tsx:641-642`: `alt="Blog icon"` + `aria-hidden="true"`.
- **Recommendation:** Change `alt="Blog icon"` to `alt=""`.

### A11Y-003 — Strong semantic HTML
- **Status:** Confirmed strength
- **Severity:** — | **Confidence:** High
- **Evidence:** Proper landmarks (`<header>`, `<main>`, `<footer>`), H1→H2→H3 hierarchy, semantic lists.

### A11Y-004 — Proper ARIA implementation
- **Status:** Confirmed strength
- **Severity:** — | **Confidence:** High
- **Evidence:** `aria-current="page"`, `aria-expanded`, `aria-controls`, `aria-invalid`, `aria-describedby` all correct.

### A11Y-005 — Color contrast exceeds WCAG AA
- **Status:** Confirmed strength
- **Severity:** — | **Confidence:** High
- **Evidence:** ~20.6:1 foreground/background, ~16.6:1 primary/background.

---

## PERFORMANCE FINDINGS

### PERF-001 — Duplicate cache headers (see SEO-003)
- **Status:** Confirmed issue
- **Severity:** High | **Confidence:** High | **Effort:** XS
- **Same as SEO-003.**

### PERF-002 — Section.tsx Client Component boundary
- **Status:** Confirmed issue
- **Severity:** Medium | **Confidence:** High | **Effort:** M
- **Evidence:** `Section.tsx` is `"use client"` solely for motion animations — creates client boundary at every section.
- **Recommendation:** Split into Server wrapper + Client animation leaf.

### PERF-003 — Deferred GTM (exemplary)
- **Status:** Confirmed strength
- **Severity:** — | **Confidence:** High
- **Evidence:** GTM loads only after first user interaction via `requestIdleCallback`.

### PERF-004 — Web Vitals dynamically imported
- **Status:** Confirmed strength
- **Severity:** — | **Confidence:** High
- **Evidence:** `web-vitals` package imported dynamically via `next/dynamic`.

### PERF-005 — Critical CSS inlining
- **Status:** Confirmed strength
- **Severity:** — | **Confidence:** High
- **Evidence:** `experimental.inlineCss: true` in next.config.ts.

---

## GEO/AEO FINDINGS

### GA-001 — llms.txt serving correctly
- **Status:** Confirmed strength
- **Severity:** — | **Confidence:** High
- **Evidence:** Valid markdown, entity-focused content, no stale typos.

### GA-002 — ai-profile.json serving correctly
- **Status:** Confirmed strength
- **Severity:** — | **Confidence:** High
- **Evidence:** Valid JSON, correct schema, typos resolved.

### GA-003 — AI crawler policies configured
- **Status:** Confirmed strength
- **Severity:** — | **Confidence:** High
- **Evidence:** robots.txt has sections for OAI-SearchBot, Claude-SearchBot, PerplexityBot, Applebot, BraveBot.

### GA-004 — Model training crawlers disallowed
- **Status:** Confirmed strength
- **Severity:** — | **Confidence:** High
- **Evidence:** GPTBot, Google-Extended, ClaudeBot all set to `Disallow: /`.

### GA-005 — Entity keyword strategy aligned
- **Status:** Confirmed strength
- **Severity:** — | **Confidence:** High
- **Evidence:** "AI and analytics engineer" consistently used; broad agency terms removed.

### GA-006 — Education typo resolved
- **Status:** Confirmed strength
- **Severity:** — | **Confidence:** High
- **Evidence:** `"Batchelor"` → `"Bachelor of Technology"` in all endpoints.

---

## ANALYTICS FINDINGS

### AN-001 — GTM deferred to first interaction
- **Status:** Confirmed strength
- **Severity:** — | **Confidence:** High
- **Evidence:** `DeferredGTM.tsx`: Loads on mousemove/scroll/touchstart/keydown + requestIdleCallback.

### AN-002 — Conversion events tracked
- **Status:** Confirmed strength
- **Severity:** — | **Confidence:** High
- **Evidence:** `contact_form_submit`, `contact_form_error`, `hire_me_click`, `resume_download` in GTM dataLayer.

### AN-003 — Web Vitals reporting implemented
- **Status:** Confirmed strength
- **Severity:** — | **Confidence:** High
- **Evidence:** `WebVitals.tsx`: Reports via GTM dataLayer + `/api/web-vitals/` beacon.

### AN-004 — No error monitoring
- **Status:** Risk/likely issue
- **Severity:** Medium | **Confidence:** High | **Effort:** M
- **Evidence:** No Sentry, Rollbar, or similar error tracking in codebase.
- **Recommendation:** Add Sentry or alternative error monitoring.

---

## OPPORTUNITIES

### OPP-001 — Blog is separate app (link equity division)
- **Status:** Opportunity
- **Severity:** Low | **Confidence:** Medium | **Effort:** M
- **Evidence:** Blog served at `/blog/` with separate data source and sitemap.
- **Recommendation:** Consider consolidating or strengthening internal linking.

### OPP-002 — Add "Book a discovery call" CTA
- **Status:** Opportunity
- **Severity:** Low | **Confidence:** Medium | **Effort:** S
- **Evidence:** Consulting path is 3 clicks; a direct CTA would reduce to 1.
- **Recommendation:** Add CTA to hero linking to `/contact/#intent=ai-llm`.

### OPP-003 — Self-host fonts
- **Status:** Opportunity
- **Severity:** Low | **Confidence:** Medium | **Effort:** M
- **Evidence:** Google Fonts loaded from Google's CDN (external request).
- **Recommendation:** Self-host Inter and any display font for privacy + reliability.
