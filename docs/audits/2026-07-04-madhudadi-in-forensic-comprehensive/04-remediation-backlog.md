# Remediation Backlog — Comprehensive Forensic Audit

---

## P0 - Rotate exposed secrets and remove .env.local from git

**Findings:** SEC-001, SEC-004

**Actions:**
- Generate new OpenAI API key (revoke `sk-proj-8-7B2aUz__...`)
- Generate new Resend API key (revoke `re_DnmF2LJr_...`)
- Change CMS_AUTH_PASSWORD to a strong random password
- Verify `.env.local` is in `.gitignore`
- Update production environment variables on Vercel

**Validation:**
```bash
grep ".env.local" .gitignore
git check-ignore .env.local
# Should output: .env.local
```

**Acceptance:**
- No secrets visible in `git status` or `git diff`
- All three rotated API keys work in production

---

## P0 - Add HTTP→HTTPS redirect

**Findings:** SEO-001

**Actions:**
- Option A: Add Cloudflare Edge Rule (recommended)
- Option B: Add redirect in `next.config.ts`

**Validation:**
```bash
curl -I http://madhudadi.in/ | grep -i "location\|HTTP/"
# Expected: HTTP/1.1 301 Moved Permanently
# Expected: location: https://madhudadi.in/
```

**Acceptance:**
- `http://madhudadi.in/` redirects to `https://madhudadi.in/` with 301
- `http://www.madhudadi.in/` redirects to `https://madhudadi.in/` with 301

---

## P1 - Fix duplicate cache headers

**Findings:** SEO-003, PERF-001

**Actions:**
- Delete lines 123-140 from `next.config.ts` (first sitemap.xml + robots.txt entries)
- Keep only the later entries (lines 199-214)

**Validation:**
```bash
pnpm build
curl -I https://madhudadi.in/sitemap.xml | grep -i "cache-control"
# Expected: cache-control: public, max-age=3600, stale-while-revalidate=86400
# Expected: (single header, no duplicates)
```

**Acceptance:**
- Each route has exactly one `Cache-Control` header
- sitemap.xml uses `public, max-age=3600, stale-while-revalidate=86400`
- robots.txt uses `public, max-age=86400`

---

## P1 - Fix reduced motion gap

**Findings:** A11Y-001

**Actions:**
- Import `useReducedMotion` from `motion/react` in `Section.tsx`
- Conditionally set `initial`, `whileInView`, and `transition` to empty/non-animated values when reduced motion is preferred

**Validation:**
```bash
# Test with prefers-reduced-motion: reduce in browser DevTools
# Sections should appear without fade-up animation
```

**Acceptance:**
- All motion library animations respect `prefers-reduced-motion: reduce`
- No animation when user has motion sensitivity preference

---

## P1 - Switch CSP from Report-Only to enforced (after monitoring)

**Findings:** SEC-002

**Actions:**
- Monitor CSP report endpoint (`/api/csp-report/`) for a week
- Address any legitimate violations
- Change `Content-Security-Policy-Report-Only` to `Content-Security-Policy` in `middleware.ts`
- Remove `'unsafe-inline'` from script-src (SEC-003)

**Validation:**
```bash
curl -I https://madhudadi.in/ | grep -i "content-security-policy"
# Expected: content-security-policy: default-src 'self'; ...
# NOT: content-security-policy-report-only: ...
```

**Acceptance:**
- CSP header is enforced (not Report-Only)
- No `'unsafe-inline'` in script-src
- All site functionality works correctly under enforced CSP

---

## P1 - Fix structured data issues

**Findings:** SD-001, SD-002, SD-003

**Actions:**
- Add "ProfilePage" to homepage `SeoStructuredData` node list in `page.tsx`
- Change speakable `cssSelector` from `["main"]` to `["#main-content h1", "#main-content h2", "#main-content p"]` in `SeoStructuredData.tsx`
- Remove `key !== "googleBusiness"` filter in `jsonld.ts`

**Validation:**
```bash
pnpm build
# Manually inspect built JSON-LD
```

**Acceptance:**
- Homepage JSON-LD includes ProfilePage schema
- Person.mainEntityOfPage resolves to a valid @id in the graph
- Speakable selector targets specific content sections, not entire main
- Google Business Profile URL appears in sameAs array

---

## P1 - Fix accessibility issues

**Findings:** A11Y-002

**Actions:**
- Change `alt="Blog icon"` to `alt=""` in `NewPortfolioExperience.tsx:641`

**Validation:**
```bash
rg "alt=.Blog icon" src/
# Expected: No output
```

**Acceptance:**
- Blog link image is properly marked as decorative (empty alt)
- No contradictory `aria-hidden="true"` + non-empty `alt`

---

## P1 - Update privacy policy cookie disclosure

**Findings:** SEC-008

**Actions:**
- Update `src/app/(portfolio)/privacy/page.tsx` to disclose GTM/GA cookie usage
- Consider implementing cookie consent mechanism

**Validation:**
```bash
# Re-read the privacy page
```

**Acceptance:**
- Privacy policy accurately reflects that GTM/GA may set cookies
- Users are informed about analytics data collection

---

## P2 - Add persistent rate limiting

**Findings:** SEC-006, SEC-007

**Actions:**
- Replace in-memory `Map` in `submit-contact-form.ts` with Vercel KV or Upstash Redis
- Add rate limiting to `api/cms/upload/route.ts`
- Apply same rate limit window (10 min, 3 requests) to both endpoints

**Validation:**
```bash
# Verify by sending request bursts
# After 3 rapid submissions, 4th should be rejected
```

**Acceptance:**
- Rate limits persist across cold starts
- Contact form rejects >3 submissions per 10 min per IP
- CMS upload endpoint has equivalent rate limiting

---

## P2 - Fix Section.tsx client boundary

**Findings:** PERF-002

**Actions:**
- Split Section into a Server Component wrapper (HTML structure only)
- Create a smaller Client Component for animation wrapper only

**Validation:**
```bash
pnpm build
# Check client bundle size reduction
```

**Acceptance:**
- Section structure renders on the server
- Only the animation wrapper ships as client JS
- Client bundle is smaller

---

## P2 - Fix formatting issue

**Findings:** (Biome format check failure)

**Actions:**
- Run `pnpm format`

**Validation:**
```bash
pnpm format:check
# Expected: No errors
```

**Acceptance:**
- `biome format .` reports no formatting issues

---

## P3 - Implement font pairing

**Findings:** UX-001

**Actions:**
- Choose a display font (Satoshi, Cabinet Grotesk, or Literata)
- Add via `next/font/google` or `next/font/local`
- Update `globals.css` to use new font for `--font-display`

**Validation:**
```bash
pnpm build
# Visual inspection of rendered headings
```

**Acceptance:**
- Display headings (`h1`, `h2`, `h3`) use a different font from body text
- Typographic hierarchy is visually distinct

---

## P3 - Add error monitoring

**Findings:** AN-004

**Actions:**
- Add Sentry (`@sentry/nextjs`) or alternative
- Configure source maps for production error stack traces
- Set up alerts for critical errors

**Validation:**
```bash
# Trigger a test error
# Verify it appears in Sentry dashboard
```

**Acceptance:**
- Client-side and server-side errors are captured
- Error reports include stack traces with source mapping
- Alerts configured for 500 errors

---

## Maintenance Schedule

| Interval | Task |
|---|---|
| Weekly | Check CSP report endpoint for violations |
| Monthly | Review error monitoring dashboard |
| Quarterly | Update `llms.txt` and `ai-profile.json` if certifications/services change |
| Quarterly | Rotate API keys (if not using auto-rotation) |
| Yearly | Review robots.txt for new AI crawler user-agents |
| Each deploy | Run post-deployment regression checklist |

## Post-Deployment Regression Checklist

```bash
# 1. Verify sitemap
curl -s -L https://madhudadi.in/sitemap.xml | grep -i "sitemap-portfolio"
# Expected: empty output

# 2. Verify legacy sitemap redirect
curl -I https://madhudadi.in/sitemap-portfolio.xml | grep -i "location\|HTTP/"
# Expected: 308 redirect to /sitemap.xml

# 3. Verify search route protection
curl -s -A "Mozilla/5.0" https://madhudadi.in/search/ | grep -o -i '<meta name="robots"[^>]*>'
# Expected: <meta name="robots" content="noindex, follow"/>

# 4. Verify GEO endpoints
curl -s https://madhudadi.in/llms.txt | grep -i "Certified LLM Security Professional"
# Expected: contains certification reference

# 5. Verify HTTPS redirect
curl -I http://madhudadi.in/ | grep -i "location"
# Expected: 301 to https://madhudadi.in/

# 6. Verify quality gates
pnpm format:check && pnpm lint && pnpm test && pnpm build
```
