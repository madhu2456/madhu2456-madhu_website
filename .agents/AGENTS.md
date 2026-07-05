<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This repository uses newer Next.js behavior and patterns. Before implementing framework-level changes, consult docs under `node_modules/next/dist/docs/`.
<!-- END:nextjs-agent-rules -->

# Portfolio Codebase - Architecture and Development Guide

## Overview

`madhudadi.in` is a personal portfolio for Madhu Dadi focused on AI/ML engineering, analytics, and full-stack product development.

- Framework: Next.js 16 (App Router)
- Runtime: React 19 + TypeScript 5.9
- Styling: Tailwind CSS v4 + OKLch CSS variables
- Animations: `motion` (imports from `motion/react`)
- Icons: `@tabler/icons-react`
- Linting/formatting: Biome

## Styling and theme

- Tailwind CSS v4 (`@import "tailwindcss"`)
- Color system uses OKLch CSS vars in global styles
- Theme is managed with `next-themes` class strategy
- Class merge utility: `import { cn } from "@/lib/utils"`

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

### 5. Security

- Content Security Policy (CSP) is implemented via Next.js Middleware (`middleware.ts`) in enforcing mode with `report-uri` for violation logging.
- Uses a dynamically generated UUID-based nonce injected via request headers (`x-nonce`).
- Static security headers (X-Frame-Options, HSTS, etc.) are enforced via `next.config.ts`.

## SEO / GEO / AEO

### Technical SEO

- Dynamic metadata in `src/app/(portfolio)/layout.tsx`
- Robots: Managed at the NGINX proxy level (static file), not by Next.js
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
2. Use `@tabler/icons-react` for icons.
3. Use class merge utility: `import { cn } from "@/lib/utils"`.
4. Keep all portfolio content data-driven via `getPortfolioData()`. Persisted editable data lives in `Data/portfolio-content.json`.
5. Do not add hardcoded portfolio facts in UI sections when data fields already exist.
6. Extend JSON-LD through `src/lib/jsonld.ts` and render through `SeoStructuredData.tsx`.
7. Preserve machine-readable endpoint consistency (`llms.txt`, `ai-profile.json`, sitemap, robots).
8. Validate edits with:
   - `pnpm lint`
   - `pnpm build`
9. **MANDATORY REVIEWER PROTOCOL**: Under no circumstances can the Orchestrator merge or request user approval for a merge immediately after the Implementer finishes. The Orchestrator MUST mandatorily spawn a dedicated **Reviewer** subagent to validate the pipeline (`pnpm lint && pnpm build`) after every implementation phase. Skipping the Reviewer is a critical violation of the swarm lifecycle.
