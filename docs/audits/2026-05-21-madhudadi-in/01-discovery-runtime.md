# Phase A - Discovery And Runtime Mapping

## Architecture Map

- Framework: Next.js 16 App Router with React 19 and TypeScript.
- Data model: `getPortfolioData()` in `src/lib/portfolio-data.ts`, backed by `Data/portfolio-content.json`.
- Metadata model: root portfolio metadata in `src/app/(portfolio)/layout.tsx`; search and case study metadata in route-level pages.
- Structured data model: home graph from `src/components/SeoStructuredData.tsx` and `src/lib/jsonld.ts`; case study schema is route-local.
- Crawl model in source: `src/app/sitemap.ts` and `src/app/robots.ts`.
- Crawl model in live runtime: consolidated root `robots.txt` and root sitemap output.
- Rendering model observed: prerendered portfolio pages with `x-nextjs-prerender: 1`, `x-nextjs-cache: HIT` on sampled portfolio pages.
- CMS protection: `src/proxy.ts` protects `/cms/:path*` and `/api/cms/:path*`.

## Source And Runtime Drift

The live root sitemap is not the direct output shape of `src/app/sitemap.ts`.

- Source `src/app/sitemap.ts` returns a `MetadataRoute.Sitemap` URL set with `/`, `/case-studies/`, `/search`, and project case studies.
- Live `https://madhudadi.in/sitemap.xml` should be the canonical portfolio sitemap entry point for this repository.
- Blog sitemap composition should be handled by `robots.txt` or a source-controlled sitemap-index route, not by a separate portfolio child sitemap.

This may be intentional deployment composition, but it is not reproducible from the current source alone.

## Route/Crawl/Index Reconciliation

| URL / Route | Source Route | In Sitemap | Internally Linked | Live Status | Redirect | Canonical | Robots | Indexable | Issue | Recommended Action |
|---|---|---:|---:|---:|---|---|---|---:|---|---|
| `/` | `src/app/(portfolio)/page.tsx` | Yes | Yes | 200 | None | `https://madhudadi.in/` | `index, follow` | Yes | None | Keep |
| `/case-studies/` | `case-studies/page.tsx` | Yes | Mixed | 200 | None | `https://madhudadi.in/case-studies/` | `index, follow` | Yes | `CRAWL-001` | Link consistently with trailing slash or redirect non-slash |
| `/case-studies` | Same route | No | Yes | 200 | None | `https://madhudadi.in/case-studies/` | `index, follow` | Duplicate crawlable | `CRAWL-001` | 308 redirect to `/case-studies/` |
| `/case-studies/technical-blog/` | `[slug]/page.tsx` | Yes | Yes | 200 | None | Expected slash URL | `index, follow` | Yes | None | Keep |
| `/case-studies/udemy-enroller-fastapi/` | `[slug]/page.tsx` | Yes | Yes | 200 | None | `https://madhudadi.in/case-studies/udemy-enroller-fastapi/` | `index, follow` | Yes | `SCHEMA-001` | Fix schema author ID |
| `/case-studies/udemy-enroller-fastapi` | Same route | No | Not primary | 200 | None | `https://madhudadi.in/case-studies/udemy-enroller-fastapi/` | `index, follow` | Duplicate crawlable | `CRAWL-001` | 308 redirect to slash URL |
| `/search` | `search/page.tsx` | Yes as non-slash | Yes | 200 | None | `https://madhudadi.in/search/` | `index, follow` | Yes | `CRAWL-001` | Change sitemap to canonical slash or canonical to non-slash |
| `/search/` | Same route | No | No | 200 | None | `https://madhudadi.in/search/` | `index, follow` | Yes | `CRAWL-001` | Canonicalize URL variant |
| `/search?q=rag` | Same route | No | Yes from `/search` | 200 | None | `https://madhudadi.in/search/` | `noindex, follow` | No | None | Keep noindex query behavior |
| `/llms.txt` | `llms.txt/route.ts` | Discovery-linked | Head link | 200 | None | Not applicable | `x-robots-tag: index, follow` | Yes | `GEO-001` | Sync content freshness with blog |
| `/llms-full.txt` | Not found | Robots allow | No | 404 | None | Not applicable | Not applicable | No | `GEO-002` | Remove root allow hint or implement endpoint |
| `/ai-profile.json` | `ai-profile.json/route.ts` | Discovery-linked | Head link | 200 | None | `meta.canonical` root | `x-robots-tag: index, follow` | Yes | `GEO-001` | Sync with blog entity/content |
| `/blog` | External blog app | Blog sitemap | Yes | 200 | None | `https://madhudadi.in/blog` | `index, follow` | Yes | Reference | Keep parity target |
| `/blog/llms.txt` | External blog app | Discovery-linked | Blog | 200 | None | Not applicable | `x-robots-tag: index, follow` | Yes | Reference | Use as parity source |
| `/blog/llms-full.txt` | External blog app | Robots allow | Blog | 200 | None | Not applicable | `x-robots-tag: index, follow` | Yes | Reference | Keep |
| `/blog/ai-profile.json` | External blog app | Discovery-linked | Blog | 200 | None | Blog canonical | Not observed as noindex | Yes | Reference | Use as parity source |
| `/cms` | `cms/page.tsx` + proxy | No | No public nav | 401 | None | Not applicable | Not applicable | No | None | Keep protected |
| `/api/cms/content` | API route + proxy | No | No | 401 | None | Not applicable | Not applicable | No | None | Keep protected |
| `/api/chat` | API route | No | Client fetch | 405 on GET | None | Not applicable | Not applicable | No | `SEC-004` | Add rate limiting for POST |
| Unknown URL | Global 404 | No | No | 404 | None | Not applicable | Not applicable | No | None | Keep |

## Phase A Findings

### OPS-001 - Live crawl artifacts are not reproducible from source

Confidence: Verified  
Severity: Medium

Evidence:

- Source `src/app/sitemap.ts:8` exports a URL-set metadata route.
- Runtime `https://madhudadi.in/sitemap.xml` should be reproducible from source and should not depend on an undocumented portfolio child sitemap.

Impact: deployment parity and crawler control can regress if this repository is deployed without the external sitemap/robots composition.

### CRAWL-001 - Non-canonical URL variants return 200 instead of redirecting

Confidence: Verified  
Severity: Medium

Evidence:

- Source `next.config.ts:31` sets `trailingSlash: true`.
- Source `next.config.ts:33` sets `skipTrailingSlashRedirect: true`.
- Runtime `/case-studies` and `/case-studies/` both return 200.
- Runtime `/case-studies/udemy-enroller-fastapi` and slash variant both return 200.
- Source links include `href="/case-studies"` in `src/app/(portfolio)/case-studies/[slug]/page.tsx:242`, `:258`, and `src/components/sections/QuickAnswersSection.tsx:70`.
- `src/app/sitemap.ts:30` lists `${siteUrl}search`, while runtime canonical is `https://madhudadi.in/search/`.

Impact: duplicate crawlable URLs, mixed internal signals, and avoidable canonical consolidation work for crawlers.

### GEO-002 - Root robots allows a missing root LLM endpoint

Confidence: Verified  
Severity: Low

Evidence:

- Live `robots.txt` allows `/llms-full.txt` for AI crawlers.
- Runtime `https://madhudadi.in/llms-full.txt` returns 404.
- Runtime `https://madhudadi.in/blog/llms-full.txt` returns 200.

Impact: AI crawler discovery gets a broken root-level hint, while the blog-level full LLM file exists.
