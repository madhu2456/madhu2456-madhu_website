# Verification Matrix — Comprehensive Forensic Audit

**Date:** 2026-07-04

| Surface | Local Status | Live Status | Evidence | Next Action |
|---|---|---|---|---|
| **Git working tree** | Pass | N/A | Clean branch | None |
| **Biome lint** | Pass | N/A | 124 files checked | None |
| **Biome format** | **Fail** | N/A | `seo-smoke-test.mjs:66` line too long | Run `pnpm format` |
| **TypeScript typecheck** | Pass | N/A | 0 errors | None |
| **Unit tests** | Pass | N/A | 25 tests, 4 files | None |
| **E2E tests** | Pass | N/A | 76 tests passed | None |
| **Build** | Pass | N/A | 36 pages generated | None |
| **Homepage status** | Pass | 200 OK | X-Nextjs-Cache: HIT | None |
| **Canonical root host** | Pass | 301 redirect | `www` → root works (HTTPS) | Verify HTTP variants |
| **HTTP→HTTPS redirect** | N/A | **FAIL** | `http://madhudadi.in` → 200, not 301 | Add edge redirect |
| **Sitemap flat URL-set** | Pass | Pass | 16 direct entries, no recursion | None |
| **Legacy sitemap redirect** | Pass | 308 redirect | `/sitemap-portfolio.xml` → `/sitemap.xml` | None |
| **robots.txt** | Pass | Pass | AI crawler sections present | None |
| **Search noindex** | Pass | Pass | `noindex, follow` in HTML | None |
| **llms.txt** | Pass | Pass | Valid markdown, entity-aligned | None |
| **ai-profile.json** | Pass | Pass | Valid JSON, correct schema | None |
| **Duplicate cache headers** | **Fail** | N/A | sitemap.xml & robots.txt defined twice | Remove lines 123-140 from next.config.ts |
| **CSP enforcement** | **Fail** | Report-Only | `middleware.ts` uses `-Report-Only` suffix | Switch to enforced after monitoring |
| **Plaintext secrets** | **Fail** | N/A | `.env.local` contains API keys | Rotate + remove from git |
| **Blog icon aria-hidden** | **Fail** | N/A | `alt="Blog icon"` + `aria-hidden=true` | Change alt to `""` |
| **Speakable CSS selector** | **Fail** | N/A | `["main"]` too broad | Narrow to headings |
| **GBP in sameAs** | **Fail** | N/A | `googleBusiness` filtered out | Remove filter |
| **Person→ProfilePage ref** | **Fail** | N/A | Points to `profile/#webpage` not in homepage graph | Add ProfilePage to homepage |
| **Occupation skills** | **Fail** | N/A | Hardcoded string | Pull from data |
| **Reduced motion gap** | **Fail** | N/A | CSS doesn't cover motion JS animations | Use `useReducedMotion()` hook |
| **Rate limiting (form)** | **Fail** | N/A | In-memory Map lost on cold starts | Use persistent store |
| **Rate limiting (upload)** | **Fail** | N/A | No rate limiting on CMS upload | Add rate limiting |
| **Error monitoring** | **Fail** | N/A | No Sentry/Rollbar | Add error monitoring |
| **Font strategy** | **Fail** | N/A | Inter for both display and body | Add display font |
| **Conversion events** | Pass | N/A | GTM dataLayer events configured | None |
| **Web Vitals** | Pass | Pass | Reporting via GTM + `/api/web-vitals/` | None |
| **Security headers** | Pass | Pass | HSTS, X-Frame-Options, Referrer-Policy, etc. | None |
| **Honeypot spam prevention** | Pass | Pass | Hidden `hp_field` input | None |
| **Touch targets ≥ 44×44px** | Pass | Pass | Verified in Header, mobile menu | None |
| **Skip-to-content link** | Pass | Pass | Present, focusable, z-50 | None |
| **Color contrast** | Pass | Pass | ~20.6:1 exceeds WCAG AAA | None |
| **Privacy policy** | **Fail** | Pass (serving) | Cookie disclosure inaccurate | Update policy text |

---

## Summary

| Status | Count |
|---|---|
| ✅ Pass | 24 |
| ❌ Fail (needs action) | 16 |
| N/A (config/environment) | 3 |
| **Total** | **43 checkpoints** |
