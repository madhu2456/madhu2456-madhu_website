# A1 — Project Documentation Summary

## Scope
- `README.md`
- `docs/slug_transition_plan.md`
- `.env.example`
- `.env.local` (variable names only; secret values are redacted)
- `package.json` (metadata/scripts only)

Date summarized: 2026-07-05

---

## 1. Project purpose and live site

- **Name:** Madhu Dadi Portfolio (`madhu_website` v0.1.0)
- **Live URL:** https://madhudadi.in
- **Canonical profile page:** https://madhudadi.in/profile/
- **Case-study home:** https://madhudadi.in/
- Stated positioning: Full-Stack AI Product Development & Next.js Frontend
- Focus areas: portfolio UX, case studies, SEO + AEO + GEO, agentic RAG chat, local CMS editing

## 2. Declared tech stack and versions

| Layer | Tech | Version from README/package |
|---|---|---|
| Framework | Next.js (App Router) | 16.2.9 (package.json) |
| UI library | React | 19.2.4 |
| Language | TypeScript | 5.9.3 |
| Styling | Tailwind CSS | ^4.2.2 |
| Lint/format | Biome | ^2.2.0 |
| Animation | `motion` | ^12.38.0 |
| Icons | `@tabler/icons-react` / `lucide-react` | ^3.40.0 / ^1.16.0 |
| E2E testing | Playwright | ^1.61.0 |
| Unit testing | Vitest | ^4.1.9 |
| Build tooling | Vite (dev dependency) | 8.1.0 |
| Forms | `react-hook-form` + `@hookform/resolvers` | ^7.74.0 / ^5.2.2 |
| Validation | `zod` | ^4.4.1 |
| Performance telemetry | `web-vitals` | ^5.3.0 |

Browser support (from `package.json`):
- `> 0.5%`, `last 2 versions`, `not dead`, `safari >= 15.4`

## 3. Declared project structure

```text
src/
  app/
    (portfolio)/         # page.tsx, layout.tsx, case-studies, cms, search
    api/                 # chat, cms/content|upload|import-live
    ai-profile.json/route.ts
    llms.txt/route.ts
    sitemap.ts
    robots.ts
  components/sections/   # page sections
  components/chat/
  components/cms/
  lib/                   # portfolio-data, jsonld, agentic-rag, discovery-keywords, image-source, cms-live-import
Data/
  portfolio-content.json
```

## 4. Setup instructions from README

1. `pnpm install`
2. `pnpm dev` -> visit `http://localhost:3000`
3. CMS at `http://localhost:3000/cms` (requires Basic Auth)

## 5. Available scripts (from `package.json`)

| Script | Command |
|---|---|
| `dev` | `next dev` |
| `build` | `next build` |
| `start` | `next start` |
| `lint` | `biome check` |
| `format` | `biome format --write` |
| `format:check` | `biome format .` |
| `test` | `vitest run` |
| `test:e2e` | `playwright test` |
| `typecheck` | `tsc --noEmit` |

## 6. Environment variables

### 6.1 `.env.example`

Variables documented for local/production use:

- `NEXT_PUBLIC_SITE_URL` — canonical site URL
- `NEXT_PUBLIC_GTM_ID` — Google Tag Manager container ID
- `OPENAI_API_KEY` — RAG chat assistant
- `CMS_AUTH_USERNAME` — CMS Basic Auth user
- `CMS_AUTH_PASSWORD` — CMS Basic Auth password
- `RESEND_API_KEY` — contact form email delivery
- `CONTACT_FORM_TO` — recipient address
- `CONTACT_FORM_FROM` — sender address
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` — optional Search Console verification
- `NEXT_PUBLIC_BING_SITE_VERIFICATION` — optional Bing WMT verification
- `NEXT_PUBLIC_YANDEX_SITE_VERIFICATION` — optional Yandex verification

### 6.2 `.env.local` (redacted)

The file is present. I summarize **variable names only** because the values appear to be live secrets:

- `OPENAI_API_KEY` — present; value looks like a live OpenAI project key.
- `NEXT_PUBLIC_SITE_URL` — present.
- `CMS_AUTH_USERNAME` — present (plaintext credential).
- `CMS_AUTH_PASSWORD` — present (plaintext credential).
- `RESEND_API_KEY` — present; value looks like a live Resend API key.
- `CONTACT_FORM_TO` — present (email address).

**Notable:** `.env.local` does **not** contain all variables listed in `.env.example` (e.g., no `NEXT_PUBLIC_GTM_ID`, verification codes, `CONTACT_FORM_FROM`, `INDEXNOW_SECRET`, CSP/reporting toggles). These gaps may or may not cause runtime issues depending on how the code guards them.

## 7. Declared SEO / GEO / AEO implementation

README enumerates:
- Dynamic metadata in `src/app/(portfolio)/layout.tsx`
- Unified JSON-LD graph via `src/components/SeoStructuredData.tsx` + `src/lib/jsonld.ts`
- Discovery keyword expansion in `src/lib/discovery-keywords.ts`
- AI-readable endpoints:
  - `/llms.txt` (`src/app/llms.txt/route.ts`)
  - `/ai-profile.json` (`src/app/ai-profile.json/route.ts`)
- AI-crawler-aware robots policy in `src/app/robots.ts`
- `/sitemap.xml`, `/robots.txt`, `/humans.txt`
- `/search?q=...` route referenced by `SearchAction` schema

## 8. Declared security approach

- CSP enforced via "Next.js Middleware (`middleware.ts`)" per README.
- Per-request nonce for Next.js framework scripts, theme bootstrapping, GTM, JSON-LD scripts.
- Static security headers (`X-Frame-Options`, HSTS, etc.) in `next.config.ts`.
- CMS routes (`/cms/:path*`, `/api/cms/:path*`) protected by Basic Auth in `src/proxy.ts` per README.

**Note:** `AGENTS.md` states Next.js 16 uses `proxy.ts` with a named `proxy` export and that `middleware.ts` is deprecated, yet the repository contains both files and the README still references `middleware.ts`. This is a documentation/codeparity point to verify in later audit phases.

## 9. Image handling

- Upload endpoint: `POST /api/cms/upload`
- Supported MIME types: `image/jpeg`, `image/png`, `image/webp`, `image/avif`, `image/gif`, `image/svg+xml`
- Stored under `public/uploads/cms/`
- `src/lib/image-source.ts` normalizes paths and avoids optimizer issues for SVG/external/data URLs.

## 10. Deployment caveat

`Data/portfolio-content.json` is edited via the CMS and must be preserved across deploys. README recommends stashing before `git pull`, or committing local content changes, to avoid merge conflicts.

## 11. Companion documentation

README references:
- `AGENTS.md` — full architecture and engineering guide
- `CLAUDE.md` — agent operating rules and repo conventions

Observed in repository root:
- `README.md` ✅
- `docs/slug_transition_plan.md` ✅
- Top-level `AGENTS.md` ❌ (a framework `AGENTS.md` exists under `.agents/`, not project-level)
- Top-level `CLAUDE.md` ❌ (not present in root)

## 12. Known limitations / TODOs surfaced from project docs

- `.env.local` contains plaintext/live credentials; should not be committed (verified not in `.gitignore`? file is present in repo and has restrictive permissions, but still tracked risk).
- Deployment flow around `portfolio-content.json` is manual/fragile.
- Slug transition plan (`udemy-enroller-fastapi` → `browser-task-automation-fastapi`) is a migration checklist; current code status not yet verified.
- Missing companion documents (`AGENTS.md`, `CLAUDE.md`) may leave cross-session agent conventions undocumented.

---

**File generated for:** Task A1 of forensic audit `forensic-audit-20260705`  
**Saved to:** `docs/plan/forensic-audit-20260705/logs/A1_project_docs_summary.md`
