# Phase D - Security And Accessibility

## Threat Model

Assets:

- Portfolio identity, services, project evidence, credentials, blog relationship, contact form submissions, CMS content JSON, uploaded CMS media, OpenAI API key, Resend API key.

Trust boundaries:

- Public visitors to static portfolio pages.
- Public visitors to `/api/chat` and contact server action.
- Authenticated CMS users crossing into write APIs under `/api/cms/*`.
- External APIs: OpenAI and Resend.
- Reverse proxy/CDN layer: Cloudflare and possible blog/portfolio routing composition.

Entry points:

- Public pages and machine-readable endpoints.
- `/api/chat`
- contact form server action
- `/cms`
- `/api/cms/content`
- `/api/cms/upload`
- `/api/cms/import-live`

Key sinks:

- JSON-LD scripts generated with `dangerouslySetInnerHTML` from server-controlled data.
- Resend email HTML.
- Public upload directory `public/uploads/cms`.
- OpenAI request path in `src/lib/agentic-rag.ts`.

## Security Findings

### SEC-001 - Portfolio pages lack a Content-Security-Policy while blog pages have one

Confidence: Verified  
Severity: Medium

Evidence:

- Runtime headers for `/`, `/case-studies/`, `/case-studies/udemy-enroller-fastapi/`, and `/search` did not include `content-security-policy`.
- Runtime headers for `/blog` include a CSP with `default-src 'self'`, `object-src 'none'`, `base-uri 'self'`, and `frame-ancestors 'self'`.
- Source `next.config.ts:3-27` defines security headers but no CSP.

Impact:

- XSS defense-in-depth is weaker on portfolio pages than on the blog.
- Any future injection bug in portfolio UI, CMS content, or third-party script path has less browser-level containment.

Fix:

- Add a portfolio CSP compatible with Next inline CSS/scripts and GTM.
- Start with report-only if needed, then enforce.
- Keep blog and portfolio CSP policies aligned where the shared domain allows it.

### SEC-002 - `X-Powered-By: Next.js` is exposed on portfolio responses

Confidence: Verified  
Severity: Low

Evidence:

- Runtime headers for portfolio pages include `x-powered-by: Next.js`.
- `next.config.ts` does not set `poweredByHeader: false`.

Impact:

- Minor information disclosure.

Fix:

- Add `poweredByHeader: false` to `next.config.ts`.

### SEC-003 - Contact email HTML escapes message but not name, email, or subject

Confidence: Verified  
Severity: Medium

Evidence:

- `src/app/actions/submit-contact-form.ts:51-55` escapes only `message`.
- `src/app/actions/submit-contact-form.ts:68`, `:78`, `:85`, and `:110` interpolate `name`, `email`, and `subject` into email HTML.

Attack path:

- Attacker submits HTML-like content in name or subject.
- Email HTML sent to the site owner renders attacker-controlled markup in the email client.

Fix:

- Use one `escapeHtml()` helper for all text fields.
- Use a strict email parser/normalizer for `reply_to`.
- Avoid raw string interpolation in HTML attributes.

### SEC-004 - Public cost/write surfaces lack source-level rate limiting

Confidence: Inferred  
Severity: Medium

Evidence:

- `src/app/api/chat/route.ts` validates JSON and length but has no rate limiting, bot challenge, IP throttle, or abuse budget.
- `src/app/actions/submit-contact-form.ts` has a honeypot but no rate limiting.
- Runtime `/api/chat` rejects GET with 405, but POST protection could not be abuse-tested without production policy access.

Impact:

- OpenAI cost abuse and spam risk.
- Contact form spam can still bypass honeypot.

Fix:

- Add per-IP and per-session rate limits at app or edge.
- Add low-friction bot protection for contact form if spam appears.
- Add monitoring counters for blocked chat/contact attempts.

### SEC-005 - CMS upload allows SVG into a public same-origin upload directory

Confidence: Inferred from verified source  
Severity: Medium

Evidence:

- `src/app/api/cms/upload/route.ts:8-15` allows `image/svg+xml`.
- `src/app/api/cms/upload/route.ts:65-73` writes uploaded bytes to `public/uploads/cms`.
- Runtime `/api/cms/content` and `/cms` return 401, so upload is behind Basic Auth.

Impact:

- If CMS credentials are compromised or a trusted CMS user uploads active SVG, same-origin SVG can create stored XSS or content spoofing risk when opened directly.

Fix:

- Disable SVG upload, sanitize SVG, or serve uploaded SVG with safe headers from a separate asset origin.
- Prefer rasterization for CMS-uploaded SVG.

## Accessibility Findings

### A11Y-001 - Contact form status messages are not announced to assistive tech

Confidence: Verified  
Severity: Low

Evidence:

- `src/components/sections/ContactForm.tsx:48-60` renders success/error status in a normal `div`.
- No `role="status"`, `role="alert"`, or `aria-live` appears in the contact form.
- Static runtime regex checks found `ariaLiveCount: 0` on captured portfolio pages.

Impact:

- Screen reader users may not hear async success or error feedback after submission.

Fix:

- Use `role={status.type === "error" ? "alert" : "status"}`.
- Add `aria-live={status.type === "error" ? "assertive" : "polite"}`.
- Move focus to the status region or submit button after result if appropriate.

### A11Y-002 - Reduced-motion coverage is partial

Confidence: Verified source, browser validation unavailable  
Severity: Low

Evidence:

- Some components check `prefers-reduced-motion`: `AnimatedHeadline`, `background-ripple-effect`.
- Other interactive components use continuous or hover motion without `motion-reduce` guards, including `SidebarToggle.tsx:16-21`, `ProfileImage.tsx:41,50-51`, and multiple `FloatingDockClient.tsx` hover/animation classes.

Impact:

- Users with vestibular sensitivity can still receive bounce, ping, pulse, scale, rotate, and slide animations.

Fix:

- Add global `@media (prefers-reduced-motion: reduce)` overrides.
- Add Tailwind `motion-reduce:` variants to non-essential transitions and animations.
- Disable continuous ping/pulse/bounce for reduced-motion users.

## WCAG Gap Matrix

| WCAG Area | Status | Evidence | Impact | Fix | Validation |
|---|---|---|---|---|---|
| Document language | Pass sampled | Runtime HTML `lang="en"` | Good SR language selection | Keep | Browser/validator |
| Landmarks | Needs browser validation | Regex saw multiple `main` markers in raw Next output, likely includes templates | Potential false positive from streamed HTML | Validate rendered DOM | Browser Accessibility Tree |
| Headings | Pass sampled | 1 H1 on sampled pages | Good structure | Keep | Browser/axe |
| Image alt | Pass sampled | Runtime regex found 0 missing alt attributes | Good image semantics | Keep | Browser/axe |
| Button names | Pass sampled | Runtime regex found 0 unnamed buttons | Good accessible names | Keep | Browser/axe |
| Form labels | Pass source | Contact inputs use labels and `htmlFor` | Good form naming | Keep | Browser/axe |
| Form status announcements | Gap | `A11Y-001` | Async result may be silent | Add live region | Screen reader spot check |
| Reduced motion | Gap | `A11Y-002` | Motion-sensitive users affected | Add global and component guards | OS reduced-motion test |
| Keyboard flow | Unavailable | Browser unavailable | Must validate focus order and menus | Manual keyboard pass | Browser |
| Contrast | Unavailable | No automated contrast run | Must validate dark/light palette | Axe/Lighthouse/manual | Browser |

