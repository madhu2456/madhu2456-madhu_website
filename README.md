# Madhu Dadi Portfolio (`madhudadi.in`)

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
- `motion` (animations)
- `@tabler/icons-react` (icons)

## Key features

1. Portfolio sections (hero, about, experience, projects, services, education, certifications, contact)
2. Dedicated case studies (`/case-studies` and `/case-studies/[slug]`)
3. Site search route (`/search?q=...`) used by schema `SearchAction`
4. AI chat sidebar (`/api/chat`) with topic guardrails and RAG retrieval
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
    agentic-rag.ts
    jsonld.ts
    discovery-keywords.ts
    image-source.ts
    cms-live-import.ts
Data/
  portfolio-content.json
```

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
- AI crawler-aware robots policy in `src/app/robots.ts`

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

RESEND_API_KEY=re_...
CONTACT_FORM_TO=madhu.kumar245@gmail.com
CONTACT_FORM_FROM=noreply@madhudadi.in

CMS_AUTH_USERNAME=...
CMS_AUTH_PASSWORD=...

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
