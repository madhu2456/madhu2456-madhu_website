# Portfolio Codebase - Architecture and Development Guide

## Overview

`madhudadi.in` is a personal portfolio for Madhu Dadi focused on AI/ML engineering, analytics, and full-stack product development.

- Framework: Next.js 16 (App Router)
- Runtime: React 19 + TypeScript 5.9
- Styling: Tailwind CSS v4 + OKLch CSS variables
- Animations: `motion` (imports from `motion/react`)
- Icons: `@tabler/icons-react`
- Linting/formatting: Biome

## Core architecture

### 1. Data source

Single source of truth is `src/lib/portfolio-data.ts`, backed by `Data/portfolio-content.json`.

Main data buckets:
- `profile`
- `siteSettings`
- `skills`
- `experiences`
- `education`
- `projects`
- `services`
- `certifications`

`getPortfolioData()` returns sorted and derived collections (e.g. `featuredProjects`, `sortedServices`, `portfolioLastUpdatedAt`).

### 2. Route map

```text
src/app/
  (portfolio)/
    layout.tsx
    page.tsx
    loading.tsx
    not-found.tsx
    opengraph-image.tsx
    case-studies/
      page.tsx
      [slug]/page.tsx
    cms/page.tsx
    search/page.tsx
  api/
    chat/route.ts
    cms/
      content/route.ts
      upload/route.ts
      import-live/route.ts
  actions/
    submit-contact-form.ts
  llms.txt/route.ts
  ai-profile.json/route.ts
  sitemap.ts
  robots.ts
  manifest.ts
```

### 3. CMS protection

`src/proxy.ts` enforces Basic Auth for:
- `/cms/:path*`
- `/api/cms/:path*`

Required env vars:
- `CMS_AUTH_USERNAME`
- `CMS_AUTH_PASSWORD`

### 4. Chat (agentic RAG)

Primary files:
- `src/app/api/chat/route.ts`
- `src/lib/agentic-rag.ts`
- `src/components/chat/*`

Flow:
1. Topic guardrail checks portfolio relevance.
2. Context chunks are retrieved from local portfolio knowledge.
3. Prompted response is generated with OpenAI.
4. API returns answer + suggested follow-up prompts.

Required env var:
- `OPENAI_API_KEY`

## SEO / GEO / AEO

### Technical SEO

- Dynamic metadata in `src/app/(portfolio)/layout.tsx`
- Robots in `src/app/robots.ts`
- Sitemap in `src/app/sitemap.ts`
- OG image in `src/app/(portfolio)/opengraph-image.tsx`

### Structured data

- Builders: `src/lib/jsonld.ts`
- Renderer: `src/components/SeoStructuredData.tsx`
- Output: unified `@graph` JSON-LD script

### Keyword strategy

`src/lib/discovery-keywords.ts` builds a deduped discovery keyword set from:
- configured site keywords
- profile headline/location
- skills
- services
- projects

Used in metadata and machine-readable endpoints to keep SEO/GEO terms synchronized.

### GEO endpoints

- `/llms.txt` (`src/app/llms.txt/route.ts`)
- `/ai-profile.json` (`src/app/ai-profile.json/route.ts`)

Both endpoints include cache headers and cross-linking metadata.

## Image pipeline

### Uploading

- Route: `POST /api/cms/upload`
- File: `src/app/api/cms/upload/route.ts`
- Supported MIME:
  - `image/jpeg`
  - `image/png`
  - `image/webp`
  - `image/avif`
  - `image/gif`
  - `image/svg+xml`

Saved under `public/uploads/cms/`.

### Rendering safety

`src/lib/image-source.ts`:
- normalizes image paths (handles missing leading slash and whitespace)
- marks SVG/external/data sources as `unoptimized` for `next/image` safety

Used in project and case-study image surfaces.

## Key UI composition

Layout uses a right-side sidebar chat model:

```text
SidebarProvider
  SidebarInset -> PortfolioContent
  AppSidebar (chat)
  FloatingDock
```

Heavy components are dynamically loaded where beneficial.

## Contact flow

`src/app/actions/submit-contact-form.ts` sends messages through Resend.

Environment variables:
- `RESEND_API_KEY`
- `CONTACT_FORM_TO`
- `CONTACT_FORM_FROM` (optional)

## Environment variables

```bash
NEXT_PUBLIC_SITE_URL=https://madhudadi.in
OPENAI_API_KEY=...

CMS_AUTH_USERNAME=...
CMS_AUTH_PASSWORD=...

RESEND_API_KEY=...
CONTACT_FORM_TO=...
CONTACT_FORM_FROM=...

NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=...
NEXT_PUBLIC_BING_SITE_VERIFICATION=...
NEXT_PUBLIC_YANDEX_SITE_VERIFICATION=...
```

## Commands

```bash
pnpm dev
pnpm lint
pnpm build
pnpm start
pnpm format
```

## Conventions for contributors and agents

1. Use `motion/react` for animation imports; do not use `framer-motion`.
2. Keep all portfolio content data-driven via `getPortfolioData()`.
3. Do not add hardcoded portfolio facts in UI sections.
4. Extend JSON-LD through `src/lib/jsonld.ts` and render through `SeoStructuredData.tsx`.
5. Preserve machine-readable endpoint consistency (`llms.txt`, `ai-profile.json`, sitemap, robots).
6. Validate edits with:
   - `pnpm lint`
   - `pnpm build`
