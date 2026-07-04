# Implementation Plan: madhudadi.in Forensic Audit Remediation

**Plan ID:** `madhudadi-in-forensic-remediation-2026-07-04`
**Created:** 2026-07-04
**Status:** Ready for Execution
**Scope:** 17 validated issues across Security, SEO, Accessibility, Structured Data, Performance, UX

---

## 1. Implementation Summary

| Metric | Value |
|--------|-------|
| Total Issues | 17 |
| Critical | 2 (SEC-001, SEO-001) |
| High | 4 (SEO-003, SEC-002, SEC-004, A11Y-001) |
| Medium | 7 (SD-001, SD-002, SD-003, SEC-005, SEC-006, SEC-007, SEC-008, A11Y-002, SEO-002) |
| Low/Enhancement | 5 (SEC-009, UX-001, PERF-002, AN-004, Format Fix) |
| Files to Edit | 14 unique files |
| Estimated Waves | 6 batches |
| Risk Level | Medium (secrets rotation requires coordination) |

---

## 2. Dependency Map

```
WAVE 1 (No Dependencies - Start Immediately)
├── SEC-001: Rotate secrets in .env.local
├── SEC-004: Change Basic Auth credentials
├── SEO-001: HTTP→HTTPS redirect (Cloudflare/Vercel config)
└── Format Fix: biome formatting in seo-smoke-test.mjs

WAVE 2 (After Wave 1 - Security Hardening)
├── SEC-002: CSP header enforcement (middleware.ts)
├── SEC-005: Constant-time comparison fix (proxy.ts)
├── SEC-007: Upload rate limiting (cms/upload/route.ts)
└── SEC-008: Privacy policy cookie disclosure

WAVE 3 (After Wave 2 - Infrastructure)
├── SEC-006: Persistent rate limiting (submit-contact-form.ts)
└── SEO-003: Remove duplicate cache headers (next.config.ts)

WAVE 4 (After Wave 2 - Frontend/A11y)
├── A11Y-001: Reduced-motion support (Section.tsx)
└── A11Y-002: Blog icon aria-hidden fix (NewPortfolioExperience.tsx)

WAVE 5 (After Wave 2 - Structured Data)
├── SD-001: Add ProfilePage node (page.tsx)
├── SD-002: Fix speakable selector (SeoStructuredData.tsx)
└── SD-003: Include Google Business Profile (jsonld.ts)

WAVE 6 (After Wave 5 - Optional/Low Priority)
├── SEC-009: CMS origin validation (upload/route.ts)
├── UX-001: Font pairing opportunity
├── PERF-002: Section.tsx client boundary
└── AN-004: Error monitoring (Sentry integration)
```

---

## 3. Batch Plan (6 Waves)

### Wave 1: Critical Secrets & Infrastructure (4 tasks)
**Goal:** Remove plaintext secrets and establish HTTPS
**Parallelizable:** Yes (all independent)
**Risk:** Medium (credentials change affects live auth)

| Task | File | Effort | Agent |
|------|------|--------|-------|
| SEC-001 | `.env.local` | Small | Manual |
| SEC-004 | `.env.local` | Small | Manual |
| SEO-001 | Cloudflare/Vercel | Medium | DevOps |
| Format Fix | `scripts/seo-smoke-test.mjs` | Small | Implementer |

### Wave 2: Security Hardening (4 tasks)
**Goal:** Enforce CSP, fix crypto, add rate limiting
**Parallelizable:** Yes (all independent)
**Risk:** Low (defensive changes)

| Task | File | Effort | Agent |
|------|------|--------|-------|
| SEC-002 | `middleware.ts` | Small | Implementer |
| SEC-005 | `src/proxy.ts` | Small | Implementer |
| SEC-007 | `src/app/api/cms/upload/route.ts` | Small | Implementer |
| SEC-008 | `src/app/(portfolio)/privacy/page.tsx` | Small | Implementer |

### Wave 3: Infrastructure & Config (2 tasks)
**Goal:** Persistent rate limiting, clean config
**Parallelizable:** Yes
**Risk:** Low

| Task | File | Effort | Agent |
|------|------|--------|-------|
| SEC-006 | `src/app/actions/submit-contact-form.ts` | Medium | Implementer |
| SEO-003 | `next.config.ts` | Small | Implementer |

### Wave 4: Accessibility (2 tasks)
**Goal:** Respect user motion preferences
**Parallelizable:** Yes
**Risk:** Low

| Task | File | Effort | Agent |
|------|------|--------|-------|
| A11Y-001 | `src/components/Section.tsx` | Medium | Implementer |
| A11Y-002 | `src/components/NewPortfolioExperience.tsx` | Small | Implementer |

### Wave 5: Structured Data SEO (3 tasks)
**Goal:** Fix JSON-LD graph completeness
**Parallelizable:** Yes
**Risk:** Low (additive changes)

| Task | File | Effort | Agent |
|------|------|--------|-------|
| SD-001 | `src/app/(portfolio)/page.tsx` | Small | Implementer |
| SD-002 | `src/components/SeoStructuredData.tsx` | Small | Implementer |
| SD-003 | `src/lib/jsonld.ts` | Small | Implementer |

### Wave 6: Enhancements (4 tasks)
**Goal:** Optional improvements
**Parallelizable:** Yes
**Risk:** Low

| Task | File | Effort | Agent |
|------|------|--------|-------|
| SEC-009 | `src/app/api/cms/upload/route.ts` | Small | Implementer |
| UX-001 | `src/lib/fonts.ts` | Small | Designer |
| PERF-002 | `src/components/Section.tsx` | Small | Implementer |
| AN-004 | New integration | Medium | DevOps |

---

## 4. Detailed Implementation Cards

### SEC-001: Plaintext Secrets in .env.local
**Priority:** CRITICAL
**File:** `.env.local`
**Current State:**
```bash
OPENAI_API_KEY="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"
RESEND_API_KEY=re_DnmF2LJr_JxpxT63btPkUC1NBvccBgrst
```

**Implementation:**
1. Generate new OpenAI API key at https://platform.openai.com/api-keys
2. Generate new Resend API key at https://resend.com/api-keys
3. Update `.env.local` with new values
4. Update production environment variables (Vercel/Cloudflare)
5. Revoke old keys
6. Add `.env.local` to `.gitignore` (already present - verified)

**Acceptance Criteria:**
- [ ] Old API keys are revoked and no longer work
- [ ] New keys are set in production
- [ ] `.env.local` is in `.gitignore` (verified: line 34)
- [ ] Site functions correctly with new keys

**Risk:** Medium (coordination required between dev and production)
**Mitigation:** Rotate production keys during low-traffic window

---

### SEC-004: Basic Auth Credentials in Plaintext
**Priority:** HIGH
**File:** `.env.local`
**Current State:**
```bash
CMS_AUTH_USERNAME=madhu
CMS_AUTH_PASSWORD=Madhu22444@.
```

**Implementation:**
1. Generate new strong password (20+ chars, mixed case, symbols)
2. Update `.env.local`
3. Update production environment variables
4. Update any stored browser credentials

**New Password Pattern:**
```bash
CMS_AUTH_PASSWORD=<generate-20-char-random-password>
```

**Acceptance Criteria:**
- [ ] New password is 20+ characters
- [ ] Password includes uppercase, lowercase, numbers, symbols
- [ ] Old password no longer works
- [ ] CMS access works with new credentials

---

### SEO-001: No HTTP→HTTPS Redirect
**Priority:** CRITICAL
**File:** Cloudflare/Vercel configuration
**Current State:** No automatic redirect from http://madhudadi.in to https://madhudadi.in

**Implementation:**

**Option A - Cloudflare (Recommended):**
1. Login to Cloudflare dashboard
2. Go to SSL/TLS → Edge Certificates
3. Enable "Always Use HTTPS"
4. Verify redirect works

**Option B - Vercel:**
1. Go to Project Settings → Domains
2. Ensure "Force HTTPS" is enabled
3. Add redirect rule if needed

**Acceptance Criteria:**
- [ ] `curl -I http://madhudadi.in` returns 301 to https
- [ ] `curl -I http://www.madhudadi.in` returns 301 to https://madhudadi.in
- [ ] No mixed content warnings
- [ ] HSTS header present (already configured in next.config.ts)

---

### SEC-002: CSP in Report-Only Mode
**Priority:** HIGH
**File:** `middleware.ts`
**Current State:** Line 39 and 47 set `Content-Security-Policy-Report-Only`

**Implementation:**
```typescript
// Line 39: Change from
requestHeaders.set("Content-Security-Policy-Report-Only", cspWithReport);
// To
requestHeaders.set("Content-Security-Policy", cspWithReport);

// Line 47: Change from
response.headers.set("Content-Security-Policy-Report-Only", cspWithReport);
// To
response.headers.set("Content-Security-Policy", cspWithReport);
```

**Acceptance Criteria:**
- [ ] CSP header is `Content-Security-Policy` (not Report-Only)
- [ ] No CSP violations in browser console on live site
- [ ] Report-URI still receives violation reports
- [ ] All resources load correctly

**Risk:** Medium (may block resources if CSP is too strict)
**Mitigation:** Test in staging first; keep Report-URI for monitoring

---

### SEC-005: Constant-Time Comparison Early Exit
**Priority:** MEDIUM
**File:** `src/proxy.ts`
**Current State:** Lines 18-19 have early return on length mismatch

```typescript
function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;  // <-- Early exit leaks timing info
  }
  // ...
}
```

**Implementation:**
```typescript
function constantTimeEqual(a: string, b: string): boolean {
  const len = Math.max(a.length, b.length);
  let result = 0;
  for (let i = 0; i < len; i++) {
    result |= (a.charCodeAt(i % a.length) ^ b.charCodeAt(i % b.length));
  }
  return result === 0 && a.length === b.length;
}
```

**Acceptance Criteria:**
- [ ] Function always iterates full length
- [ ] Returns false for different lengths (still secure)
- [ ] No timing difference detectable
- [ ] CMS auth still works

---

### SEC-006: In-Memory Rate Limiting Lost on Cold Starts
**Priority:** MEDIUM
**File:** `src/app/actions/submit-contact-form.ts`
**Current State:** Lines 38-41 use in-memory Map

**Implementation Options:**

**Option A - Upstash Redis (Recommended):**
```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "10 m"),
});
```

**Option B - Vercel KV:**
```typescript
import { kv } from "@vercel/kv";
```

**Option C - Keep in-memory (if cost is concern):**
- Add comment documenting limitation
- Accept cold-start bypass risk
- Consider this acceptable for portfolio site

**Acceptance Criteria:**
- [ ] Rate limiting persists across cold starts (if Option A/B)
- [ ] OR limitation is documented (if Option C)
- [ ] Contact form still works
- [ ] Rate limit is 3 requests per 10 minutes per IP

---

### SEC-007: No Upload Rate Limiting
**Priority:** MEDIUM
**File:** `src/app/api/cms/upload/route.ts`
**Current State:** No rate limiting on POST endpoint

**Implementation:**
```typescript
// Add at top of file
const uploadRateLimit = new Map<string, { count: number; resetAt: number }>();
const UPLOAD_RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_UPLOADS_PER_WINDOW = 5;

function isUploadRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = uploadRateLimit.get(ip);
  if (!record || now > record.resetAt) {
    uploadRateLimit.set(ip, { count: 1, resetAt: now + UPLOAD_RATE_LIMIT_WINDOW });
    return false;
  }
  record.count++;
  return record.count > MAX_UPLOADS_PER_WINDOW;
}

// In POST handler, after origin validation:
const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
if (isUploadRateLimited(ip)) {
  return NextResponse.json({ error: "Rate limit exceeded." }, { status: 429 });
}
```

**Acceptance Criteria:**
- [ ] Upload endpoint has rate limiting
- [ ] Rate limit is reasonable (5 uploads/minute)
- [ ] CMS upload still works for normal usage
- [ ] Returns 429 when exceeded

---

### SEC-008: Privacy Policy Misleading Cookie Statement
**Priority:** MEDIUM
**File:** `src/app/(portfolio)/privacy/page.tsx`
**Current State:** Line 89 says "I do not collect personal information through cookies" but GTM sets cookies

**Implementation:**
Update Section 1 to clarify:

```tsx
<p className="text-muted-foreground leading-relaxed">
  I do not collect personal information through cookies for the purpose of
  identifying you individually. The site uses Google Tag Manager for anonymous
  analytics, which may set functional cookies for session tracking. These cookies
  do not contain personally identifiable information.
</p>
```

**Acceptance Criteria:**
- [ ] Privacy policy accurately describes cookie usage
- [ ] No misleading claims about data collection
- [ ] Compliant with DPDPA 2023

---

### A11Y-001: Reduced-Motion Gap for JS Animations
**Priority:** HIGH
**File:** `src/components/Section.tsx`
**Current State:** Lines 18-24 use motion/react without checking prefers-reduced-motion

**Implementation:**
```typescript
"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.section
      id={id}
      data-motion-initial
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      whileInView={prefersReducedMotion ? false : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.7 }}
      className="scroll-mt-28 py-8 md:py-12"
    >
      {/* ... rest unchanged */}
    </motion.section>
  );
}
```

**Acceptance Criteria:**
- [ ] Animations respect `prefers-reduced-motion: reduce`
- [ ] Section content visible without JS (SSR)
- [ ] No layout shift when motion is reduced
- [ ] Works with motion/react library

---

### A11Y-002: Blog Icon aria-hidden Conflict
**Priority:** MEDIUM
**File:** `src/components/NewPortfolioExperience.tsx`
**Current State:** Lines 639-647 have `alt="Blog icon"` + `aria-hidden="true"`

```tsx
<Image
  src="/new-ui/logo.png"
  alt="Blog icon"
  aria-hidden="true"  // Conflict: alt text is ignored when aria-hidden
  width={16}
  height={16}
  className="h-full w-full object-cover"
/>
```

**Implementation:**
```tsx
<Image
  src="/new-ui/logo.png"
  alt=""  // Empty alt for decorative image
  aria-hidden="true"
  width={16}
  height={16}
  className="h-full w-full object-cover"
/>
```

**Acceptance Criteria:**
- [ ] No aria-hidden + alt text conflict
- [ ] Image is properly decorative
- [ ] Screen readers ignore the image

---

### SEO-003/PERF-001: Duplicate Cache Headers
**Priority:** HIGH
**File:** `next.config.ts`
**Current State:** Duplicate entries for sitemap.xml and robots.txt

Lines 123-140: no-cache, no-store, must-revalidate
Lines 199-214: public, max-age=3600, stale-while-revalidate=86400

**Implementation:**
Remove the duplicate entries (lines 199-214) and keep only one set. Decision: keep the more aggressive caching for sitemap/robots since they're regenerated on build.

```typescript
// REMOVE these duplicate entries (lines 199-214):
// Sitemap - revalidate hourly, serve stale for a day
{
  source: "/sitemap.xml",
  headers: [
    {
      key: "Cache-Control",
      value: "public, max-age=3600, stale-while-revalidate=86400",
    },
  ],
},
// robots.txt - cache for a day
{
  source: "/robots.txt",
  headers: [{ key: "Cache-Control", value: "public, max-age=86400" }],
},
```

**Acceptance Criteria:**
- [ ] No duplicate header entries
- [ ] Sitemap and robots.txt have consistent caching
- [ ] Next.js doesn't error on config

---

### SD-001: Person.mainEntityOfPage References ProfilePage
**Priority:** MEDIUM
**File:** `src/app/(portfolio)/page.tsx`
**Current State:** Homepage graph includes Person but not ProfilePage node

**Implementation:**
```tsx
// Line 46-53: Add "ProfilePage" to nodes array
<SeoStructuredData
  nodes={[
    "Person",
    "Occupation",
    "WebSite",
    "WebPage",
    "ProfilePage",  // Add this
    "Breadcrumb",
    "FAQ",
  ]}
/>
```

**Acceptance Criteria:**
- [ ] ProfilePage node appears in homepage JSON-LD
- [ ] Person.mainEntityOfPage references correct ProfilePage @id
- [ ] No duplicate nodes

---

### SD-002: Speakable cssSelector Too Broad
**Priority:** MEDIUM
**File:** `src/components/SeoStructuredData.tsx`
**Current State:** Line 170 has `cssSelector: ["main"]`

**Implementation:**
```typescript
// Line 168-171: Change from
speakable: {
  "@type": "SpeakableSpecification",
  cssSelector: ["main"],
},
// To
speakable: {
  "@type": "SpeakableSpecification",
  cssSelector: ["#main-content h1", "#main-content h2", "#main-content p"],
},
```

**Acceptance Criteria:**
- [ ] Speakable targets specific headings/paragraphs
- [ ] Not too broad (entire main element)
- [ ] Google Rich Results test passes

---

### SD-003: Google Business Profile Excluded from sameAs
**Priority:** MEDIUM
**File:** `src/lib/jsonld.ts`
**Current State:** Lines 156-161 filter out googleBusiness

```typescript
const sameAs = Object.entries(socialLinks ?? {})
  .filter(
    ([key, v]) =>
      key !== "googleBusiness" && typeof v === "string" && v.length > 0,
  )
  .map(([, v]) => v as string);
```

**Implementation:**
```typescript
const sameAs = Object.entries(socialLinks ?? {})
  .filter(
    ([, v]) =>
      typeof v === "string" && v.length > 0,
  )
  .map(([, v]) => v as string);
```

**Acceptance Criteria:**
- [ ] Google Business Profile URL appears in sameAs
- [ ] No invalid URLs in sameAs array
- [ ] JSON-LD validates

---

### Format Fix: Biome Formatting Error
**Priority:** LOW
**File:** `scripts/seo-smoke-test.mjs`
**Current State:** Line 66 formatting issue

**Implementation:**
```bash
# Run biome formatter
pnpm format scripts/seo-smoke-test.mjs
```

**Acceptance Criteria:**
- [ ] `pnpm format:check` passes
- [ ] No biome errors

---

## 5. Proposed Diffs for High-Priority Safe Fixes

### SEC-005: Constant-Time Comparison Fix
```diff
--- a/src/proxy.ts
+++ b/src/proxy.ts
@@ -15,12 +15,12 @@
   });
 };
 
 function constantTimeEqual(a: string, b: string): boolean {
-  if (a.length !== b.length) {
-    return false;
-  }
+  const len = Math.max(a.length, b.length);
   let result = 0;
-  for (let i = 0; i < a.length; i++) {
-    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
+  for (let i = 0; i < len; i++) {
+    result |= (a.charCodeAt(i % a.length) ^ b.charCodeAt(i % b.length));
   }
-  return result === 0;
+  return result === 0 && a.length === b.length;
 }
 
 export default function proxy(request: NextRequest) {
```

### A11Y-002: Blog Icon Fix
```diff
--- a/src/components/NewPortfolioExperience.tsx
+++ b/src/components/NewPortfolioExperience.tsx
@@ -636,7 +636,7 @@
                 <div className="flex h-4 w-4 items-center justify-center overflow-hidden rounded-full border border-border/50 bg-surface shadow-inner">
                   <Image
                     src="/new-ui/logo.png"
-                    alt="Blog icon"
+                    alt=""
                     aria-hidden="true"
                     width={16}
                     height={16}
```

### SEO-003: Remove Duplicate Cache Headers
```diff
--- a/next.config.ts
+++ b/next.config.ts
@@ -196,20 +196,6 @@
         ],
       },
-      // Sitemap - revalidate hourly, serve stale for a day
-      {
-        source: "/sitemap.xml",
-        headers: [
-          {
-            key: "Cache-Control",
-            value: "public, max-age=3600, stale-while-revalidate=86400",
-          },
-        ],
-      },
-
-      // robots.txt - cache for a day
-      {
-        source: "/robots.txt",
-        headers: [{ key: "Cache-Control", value: "public, max-age=86400" }],
-      },
       // IndexNow verification key
```

### SD-002: Fix Speakable Selector
```diff
--- a/src/components/SeoStructuredData.tsx
+++ b/src/components/SeoStructuredData.tsx
@@ -167,7 +167,7 @@
           description: description,
           dateModified: dateModified,
           isPartOf: { "@id": `${siteUrl}#website` },
           about: { "@id": `${siteUrl}#person` },
           speakable: {
             "@type": "SpeakableSpecification",
-            cssSelector: ["main"],
+            cssSelector: ["#main-content h1", "#main-content h2", "#main-content p"],
           },
         }
       : null,
```

---

## 6. Test Plan

### Wave 1 Tests (Critical)
```bash
# SEC-001/SEC-004: Verify old keys don't work
curl -H "Authorization: Basic <old-credentials>" https://madhudadi.in/cms/
# Expected: 401 Unauthorized

# SEO-001: Verify HTTPS redirect
curl -I http://madhudadi.in
# Expected: 301 → https://madhudadi.in/

curl -I http://www.madhudadi.in
# Expected: 301 → https://madhudadi.in/
```

### Wave 2 Tests (Security)
```bash
# SEC-002: Verify CSP enforcement
curl -I https://madhudadi.in/ | grep -i "content-security-policy"
# Expected: Content-Security-Policy (not Report-Only)

# SEC-005: Verify constant-time comparison
# Manual test: attempt CMS login with wrong password
# Expected: Same response time regardless of password length

# SEC-007: Verify upload rate limiting
for i in {1..6}; do
  curl -X POST https://madhudadi.in/api/cms/upload/ -F "file=@test.jpg"
done
# Expected: 429 on 6th request
```

### Wave 3 Tests (Infrastructure)
```bash
# SEC-006: Verify rate limiting persists
# Deploy, wait for cold start, submit 4 forms rapidly
# Expected: 4th submission blocked

# SEO-003: Verify no duplicate headers
curl -I https://madhudadi.in/sitemap.xml | grep -c "cache-control"
# Expected: 1 (not 2)
```

### Wave 4 Tests (Accessibility)
```bash
# A11Y-001: Test reduced motion
# In Chrome DevTools → Rendering → Emulate CSS media feature prefers-reduced-motion: reduce
# Expected: No animations on section load

# A11Y-002: Validate with screen reader
# NVDA/VoiceOver should not announce "Blog icon" image
```

### Wave 5 Tests (Structured Data)
```bash
# SD-001/SD-002/SD-003: Validate JSON-LD
# Use Google Rich Results Test: https://search.google.com/test/rich-results
# Expected: No errors, ProfilePage node present, speakable targets correct
```

### Final Validation
```bash
# Run full test suite
pnpm test
pnpm test:e2e
pnpm typecheck
pnpm lint

# Run SEO smoke test
node scripts/seo-smoke-test.mjs
```

---

## 7. Stop/Go Checklist

### Pre-Execution Gate
- [ ] All secrets have been rotated (SEC-001, SEC-004)
- [ ] HTTPS redirect verified (SEO-001)
- [ ] Staging environment available for testing
- [ ] Backup of current `.env.local` created

### Wave 1 Go/No-Go
- [ ] New API keys generated and tested locally
- [ ] New CMS password works
- [ ] HTTPS redirect active on production
- [ ] No breaking changes to site functionality

### Wave 2 Go/No-Go
- [ ] CSP violations checked in staging (0 violations)
- [ ] CMS auth still works after proxy.ts change
- [ ] Upload endpoint rate limiting tested
- [ ] Privacy policy text reviewed for accuracy

### Wave 3 Go/No-Go
- [ ] Contact form rate limiting tested
- [ ] No duplicate headers in response
- [ ] Build completes without errors

### Wave 4 Go/No-Go
- [ ] Reduced motion tested in Chrome DevTools
- [ ] Screen reader test passed
- [ ] No visual regressions

### Wave 5 Go/No-Go
- [ ] Google Rich Results Test passes
- [ ] No JSON-LD validation errors
- [ ] ProfilePage node present in homepage

### Final Release Gate
- [ ] All 17 issues addressed
- [ ] Full test suite passes
- [ ] SEO smoke test passes
- [ ] No console errors on live site
- [ ] Performance metrics unchanged or improved
- [ ] Documentation updated (if needed)

---

## 8. Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| CSP blocks legitimate resources | Medium | High | Test in staging first; keep Report-URI |
| Rate limiting too aggressive | Low | Medium | Monitor 429 responses; adjust thresholds |
| JSON-LD breaks Google indexing | Low | High | Validate with Rich Results Test before deploy |
| Secret rotation causes downtime | Low | Critical | Rotate during low-traffic window; test locally first |
| Motion library API changes | Low | Medium | Pin motion version; test useReducedMotion |

---

## 9. Success Metrics

| Metric | Before | After Target |
|--------|--------|--------------|
| Plaintext secrets in repo | 2 | 0 |
| CSP enforcement | Report-Only | Enforced |
| HTTPS redirect | None | 301 automatic |
| Rate limiting persistence | In-memory | Persistent (or documented) |
| Accessibility score | Partial | Full WCAG 2.1 AA |
| JSON-LD completeness | Partial | Full graph |

---

## 10. Post-Implementation

1. **Monitor** CSP violations for 7 days via report-uri
2. **Monitor** rate limiting 429 responses
3. **Verify** Google Search Console for indexing issues
4. **Run** SEO smoke test weekly
5. **Update** AGENTS.md with new patterns learned

---

*Plan generated by weave-planner on 2026-07-04*
*Based on forensic audit findings from 2026-07-04*
