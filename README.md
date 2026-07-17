# Madhu Dadi Portfolio (`madhudadi.in`)

* **Built by**: Madhu Dadi
* **Canonical profile**: https://madhudadi.in/profile/
* **Case study**: https://madhudadi.in/
* **Service relevance**: Full-Stack AI Product Development & Next.js Frontend

---

Production portfolio built with Next.js 16, React 19, TypeScript, and Tailwind CSS v4, focused on:

- High-quality portfolio UX and case studies
- SEO + AEO + GEO discoverability
- AI chat powered by agentic RAG
- Local CMS editing without external CMS dependencies

## Live site

- `https://madhudadi.in`

## Tech stack

- Next.js 16 (App Router)
- React 19
- TypeScript 5.9
- Tailwind CSS v4
- Biome (lint/format)
- `motion` (animations; Framer Motion successor)
- `@tabler/icons-react` (icons)
- Radix UI (`@radix-ui/react-dialog` for sheet/dialog patterns)
- Zod + React Hook Form (CMS/contact validation)
- Vitest + Playwright (unit / e2e)

**Not used:** `react-markdown`, `remark`, or `rehype`. The portfolio chat renders a **limited** subset only (bold, bare `https` links, list lines, and `[n]` claim citations) via `src/components/chat/chat-ui.tsx` — not a full Markdown pipeline.

## Key features

1. Portfolio sections (hero, about, experience, projects, services, education, certifications, contact)
2. Dedicated case studies (`/case-studies` and `/case-studies/[slug]`)
3. Site search route (`/search?q=...`) used by schema `SearchAction`
4. AI chat sidebar (`/api/chat`) with topic guardrails, lexical RAG retrieval, claim markers `[n]`, and allowlisted source chips
5. Machine-readable discovery endpoints:
   - `/llms.txt`
   - `/ai-profile.json`
   - `/sitemap.xml`
   - `/robots.txt`
   - `/humans.txt`
6. Local CMS editor (`/cms`) for portfolio content updates

## Project structure

```text
src/
  app/
    (portfolio)/
      page.tsx
      layout.tsx
      case-studies/
      cms/
      search/
    api/
      chat/route.ts
      cms/
        content/route.ts
        upload/route.ts
        import-live/route.ts
    ai-profile.json/route.ts
    llms.txt/route.ts
    sitemap.ts
    robots.ts
  components/
    sections/
    chat/
    cms/
  lib/
    portfolio-data.ts
    agentic-rag.ts      # live system prompt + retrieval SoT (no src/prompts/)
    rate-limit.ts
    jsonld.ts
    discovery-keywords.ts
    image-source.ts
    cms-live-import.ts
    gtm.ts
Data/
  portfolio-content.json
```

### Chat / RAG notes

- **System prompt SoT:** inline in `src/lib/agentic-rag.ts` (there is no wired `src/prompts/` directory).
- **Retrieval:** lexical keyword scoring over CMS chunks (not embeddings / vector DB).
- **Citations:** model and fallback answers use `[n]` markers; UI links them to allowlisted portfolio URLs. Client never receives full chunk bodies.
- **Streaming:** the UI typewriter is a **reply animation** after the full JSON response arrives — not token streaming from the provider.

## Data model and content source

- Canonical portfolio data is loaded through `getPortfolioData()` in `src/lib/portfolio-data.ts`.
- Editable content is persisted in `Data/portfolio-content.json`.
- No Sanity/GROQ/CMS backend is required.

## SEO / GEO / AEO implementation

- Dynamic metadata in `src/app/(portfolio)/layout.tsx`
- Unified JSON-LD graph via `src/components/SeoStructuredData.tsx` + `src/lib/jsonld.ts`
- Discovery keyword expansion in `src/lib/discovery-keywords.ts`
- AI-readable endpoints:
  - `src/app/llms.txt/route.ts`
  - `src/app/ai-profile.json/route.ts`
- Production robots.txt: canonical file is `madhudadi.in/blog_platform/nginx/robots.txt` (nginx alias → `/opt/madhudadi-blog/nginx/robots.txt`); portfolio `config/robots.production.txt` mirrors it for local dev via `src/app/robots.txt/route.ts`. **Always update both** (nginx = live; mirror = local/CI). Pre-deploy checklist: `docs/seo-source-of-truth.md` (PROC-01 dual-path rule).
- Production `/sitemap.xml` is typically a **sitemap index** (nginx/edge); portfolio URL list is `/sitemap-portfolio.xml` from this app. Do not confuse index `lastmod` with page freshness — see `docs/seo-source-of-truth.md` (SEO-INDEX-01).

## Security

- Content Security Policy (CSP) is enforced via Next.js Middleware (`middleware.ts`).
- Uses a per-request UUID-based nonce for Next.js framework scripts, theme bootstrapping, Google Tag Manager, and JSON-LD scripts.
- Static security headers (X-Frame-Options, HSTS, etc.) are applied in `next.config.ts`.

## Image handling

- CMS uploads: `POST /api/cms/upload`
- Supported upload MIME types:
  - `image/jpeg`, `image/png`, `image/webp`, `image/avif`, `image/gif`, `image/svg+xml`
- Stored under `public/uploads/cms/`
- `src/lib/image-source.ts` normalizes image paths and avoids optimizer issues for SVG/external/data URLs.

## CMS authentication

- CMS routes are protected by Basic Auth in `src/proxy.ts`
- Protected matchers:
  - `/cms/:path*`
  - `/api/cms/:path*`

Required environment variables:

```bash
CMS_AUTH_USERNAME=...
CMS_AUTH_PASSWORD=...
```

## Environment variables

```bash
NEXT_PUBLIC_SITE_URL=https://madhudadi.in

OPENAI_API_KEY=sk-...
# Optional: OPENAI_CHAT_MODEL=gpt-4o-mini

# Chat rate limit (default 10 req / 60s per IP). For multi-instance deploys, set:
# UPSTASH_REDIS_REST_URL=https://xxxx.upstash.io
# UPSTASH_REDIS_REST_TOKEN=...
# Optional overrides: CHAT_RATE_LIMIT_MAX, CHAT_RATE_LIMIT_WINDOW_SEC

RESEND_API_KEY=re_...
CONTACT_FORM_TO=madhu.kumar245@gmail.com
CONTACT_FORM_FROM=noreply@madhudadi.in

CMS_AUTH_USERNAME=...
CMS_AUTH_PASSWORD=...

INDEXNOW_SECRET=...

# Optional telemetry and security-reporting controls.
# These do not need to be enabled for local development.
CSP_REPORT_ONLY=false
CSP_REPORT_URI=/api/csp-report/
CSP_REPORT_LOG=false
WEB_VITALS_LOG=false

NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=...
NEXT_PUBLIC_BING_SITE_VERIFICATION=...
NEXT_PUBLIC_YANDEX_SITE_VERIFICATION=...
```

## Scripts

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm format
```

## Requirements

- **Node.js** 24.x (see `.node-version`; CI and production use Node 24)
- **pnpm** 10.x (see `packageManager` in `package.json`)

## Content data (CMS)

Portfolio content lives in `Data/portfolio-content.json` (edited via `/cms`).

If `pageContent` is absent from that file, the app merges **built-in defaults** from
`src/lib/cms-v2-defaults.ts` (home SEO, FAQs, CTAs, etc.) at load time via
`src/lib/portfolio-data.ts`. Edits to FAQ/home page fields in CMS only persist when
`pageContent` is saved into the JSON file—confirm save behavior before relying on
CMS-only FAQ changes in production.

## Development

1. Install dependencies:

```bash
pnpm install
```

2. Run dev server:

```bash
pnpm dev
```

3. Visit:

- `http://localhost:3000`
- `http://localhost:3000/cms` (requires CMS auth)

## Deployment note (important)

`Data/portfolio-content.json` is frequently edited via CMS. If deploy scripts run `git pull` on a server with local CMS edits, pulls can fail due to merge protection.

Recommended server-safe flow:

```bash
git stash push -- Data/portfolio-content.json
git pull origin main
git stash pop
```

Or commit local content changes before pulling.

## Companion documentation

- `AGENTS.md` — full architecture and engineering guide
- `CLAUDE.md` — agent operating rules and repo conventions
