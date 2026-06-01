# Local Code Evidence

Date checked: 2026-06-01  
Workspace: `F:\Codes\Projects\madhu_portfolio`

## Current repo state

The working tree is intentionally dirty from prior cleanup and SEO work. The local state contains pending changes that are not yet reflected in production, including:

- Sitemap cleanup.
- Search page noindex.
- JSON-LD consolidation.
- `llms.txt` data-driven improvements.
- Manifest/OG palette updates.
- Unused code/dependency cleanup.

This audit treats those changes as local pending state, not as live production behavior.

## Local metadata implementation

Local metadata is generated in `src/app/(portfolio)/layout.tsx` from `getPortfolioData()`:

- `metadataBase` uses `NEXT_PUBLIC_SITE_URL` or `https://madhudadi.in/`.
- Title and description come from `siteSettings`.
- Description is normalized and capped around 160 characters.
- Keywords are derived from configured keywords, profile headline/location, skills, services, and projects.
- Open Graph uses `type: profile`, the canonical site URL, profile first/last name, and a large image.
- Twitter card is `summary_large_image`.
- Icons are explicitly declared.
- `<link rel="llms">` and `<link rel="ai-profile">` are emitted in the root layout.

Local content values:

- Site title: `Madhu Dadi | AI & Analytics Engineer · LLM, RAG, GA4`
- Site description: `Madhu Dadi is an AI and analytics engineer with 9+ years building LLM applications, RAG pipelines, AI agents, and marketing analytics that move the numbers.`
- Profile headline: `AI Developer & Marketing Analytics Leader`

Interpretation: title and headline are both defensible, but the entity language should be aligned across homepage, metadata, `llms.txt`, and `ai-profile.json`.

## Local sitemap implementation

Local `src/app/sitemap.xml/route.ts` emits a direct URL set:

- `/`
- `/case-studies/`
- `/case-studies/adticks/`
- `/case-studies/technical-blog/`
- `/case-studies/udemy-enroller-fastapi/`

Local source no longer references `sitemap-portfolio.xml`. This is a strong fix for the production recursive sitemap issue.

## Local robots implementation

Local `src/app/robots.ts` emits portfolio-focused rules:

- Allows `/`, `/blog`, `/case-studies/`, `/sitemap.xml`, `/llms.txt`, `/llms-full.txt`, `/ai-profile.json`, `/humans.txt`.
- Disallows `/studio/` and `/api/`.
- Explicitly lists many AI crawler user agents.
- Emits sitemaps for `/sitemap.xml` and `/blog/sitemap.xml`.

Risk: production robots currently includes additional blog protections and `blog/api/v1/sitemap-index.xml`. If local `robots.ts` becomes the root production robots without merging those rules, the blog's crawl controls may regress.

## Local structured data implementation

Local `src/components/SeoStructuredData.tsx` emits a unified `@graph` with:

- Person
- Occupation
- Organization
- WebSite
- SoftwareApplication
- ProfilePage
- Projects list
- Services list
- Work experience
- Certifications
- Breadcrumb
- FAQ
- HowTo hire guide

Strengths:

- Data comes from `getPortfolioData()`.
- Entity graph is centralized.
- Duplicate Organization script was removed in pending local changes.

Risks to review:

- `SoftwareApplication` for the entire portfolio may be over-broad unless it describes the AI assistant or portfolio app specifically.
- Organization vs Person naming should remain clear: Madhu Dadi is the primary entity; any Organization node should represent the personal brand, not imply an agency/company unless intended.

## Local content evidence

Local `Data/portfolio-content.json` contains:

- Strong AI/analytics positioning and three featured projects.
- Project evidence links and pricing/service details.
- Typo: `Batchelor of Technology`.
- Broad keywords: `AI consulting company`, `top AI consulting firms`, `AI consulting company in India`.
- Dataiku casing appears correct locally as `Dataiku`, while production rendered content showed `DataIku` in at least one place.

## Local GEO implementation

Local `llms.txt` is generated from portfolio data and includes:

- Data-derived core stack.
- Data-derived primary services.
- Data-derived top credential.
- Data-derived pricing lines.
- Data-derived project/case-study evidence.
- `Link` response header to `ai-profile.json`, sitemap, case studies, and blog feed.

Local `ai-profile.json` includes:

- Canonical identity.
- SameAs profiles.
- Services, projects, case studies, skills, credentials, and blog metadata.
- Attempts to synchronize blog metadata from `https://madhudadi.in/blog/ai-profile.json`.

Risk: external fetch from the live blog profile during generation can introduce latency or drift if the blog endpoint is unavailable.

## Local validation baseline

Before this audit report, the cleanup pass completed:

- `biome check`: passed.
- `vitest run`: passed.
- `next build --webpack`: passed.
- Local route smoke checks: passed for homepage, case studies, CMS auth, search, chat, sitemap, robots, `llms.txt`, and `ai-profile.json`.

This audit adds documentation only; it does not intentionally change runtime behavior.

