<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This repository uses newer Next.js behavior and patterns. Before implementing framework-level changes, consult docs under `node_modules/next/dist/docs/`.
<!-- END:nextjs-agent-rules -->

# Agent Quick Rules

For full architecture and flow details, read `AGENTS.md` first.

## Imports and libraries

- Animations: `import { motion, AnimatePresence } from "motion/react"` (never from `framer-motion`)
- Icons: `@tabler/icons-react`
- Class merge utility: `import { cn } from "@/lib/utils"`

## Data and content

- All portfolio content is sourced from `getPortfolioData()` in `src/lib/portfolio-data.ts`
- Persisted editable data lives in `Data/portfolio-content.json`
- Do not hardcode portfolio text in section components when data fields already exist

## SEO / GEO / AEO

- Add/modify schema builders in `src/lib/jsonld.ts`
- Unified schema script is rendered by `src/components/SeoStructuredData.tsx`
- Metadata is controlled from `src/app/(portfolio)/layout.tsx`
- Keep discovery endpoints consistent:
  - `src/app/llms.txt/route.ts`
  - `src/app/ai-profile.json/route.ts`
  - `src/app/sitemap.ts`
  - `src/app/robots.ts`
- Keyword strategy helper: `src/lib/discovery-keywords.ts`

## CMS and security

- CMS surfaces are protected by Basic Auth in `src/proxy.ts`
- Upload route: `src/app/api/cms/upload/route.ts`
- Supported image uploads include JPG, PNG, WEBP, AVIF, GIF, and SVG
- Image normalization/safe rendering helper: `src/lib/image-source.ts`

## Styling and theme

- Tailwind CSS v4 (`@import "tailwindcss"`)
- Color system uses OKLch CSS vars in global styles
- Theme is managed with `next-themes` class strategy

## Validation

Run these before finalizing code changes:

```bash
pnpm lint
pnpm build
```
