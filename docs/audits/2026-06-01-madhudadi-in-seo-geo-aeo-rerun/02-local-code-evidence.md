# Local Code Evidence - Rerun

Date checked: 2026-06-01  
Workspace: `F:\Codes\Projects\madhu_portfolio`

## Working tree

Before this rerun report was created:

```powershell
git status --short
```

Output: clean.

## Stale issue probes

Command:

```powershell
rg -n "Batchelor|DataIku|Highlighted projects: 2|AI consulting company|top AI consulting firms|AI consulting company in India|sitemap-portfolio" Data src public package.json next.config.ts
```

Output: no active matches.

Interpretation:

- The prior content/entity issues are fixed locally in active app/content files.
- Historical audit docs may still mention these terms as evidence, but active source/content does not.

## Local sitemap route

Local `src/app/sitemap.xml/route.ts` now returns a direct URL set:

- `https://madhudadi.in/`
- `https://madhudadi.in/case-studies/`
- `https://madhudadi.in/case-studies/adticks/`
- `https://madhudadi.in/case-studies/technical-blog/`
- `https://madhudadi.in/case-studies/udemy-enroller-fastapi/`

There is no local active reference to `sitemap-portfolio`.

Interpretation:

- Local source fixes the production sitemap issue.
- Production is stale or controlled by another layer.

## Local robots route

Local `src/app/robots.ts` now preserves consolidated blog and portfolio controls:

- Standard disallows for portfolio and blog private areas.
- Bing/Yahoo crawl delay group.
- AI crawler allow group with safe disallows.
- Sitemaps:
  - `${siteUrl}sitemap.xml`
  - `${siteUrl}blog/sitemap.xml`
  - `${siteUrl}blog/api/v1/sitemap-index.xml`

Interpretation:

- The previous local/prod robots drift has been resolved locally.
- Current production robots is broadly aligned with the local intent.

## Local metadata and content

Local `Data/portfolio-content.json` now has:

- Site title: `Madhu Dadi | AI & Analytics Engineer · LLM, RAG, GA4`
- Site description: `Madhu Dadi is an AI and analytics engineer with 9+ years building LLM applications, RAG pipelines, AI agents, and marketing analytics that move the numbers.`
- Entity-aligned keywords such as:
  - `AI consultant in India`
  - `AI and analytics engineer`
  - `LLM application developer`
  - `RAG consultant`
  - `marketing analytics consultant`
  - `FastAPI Next.js AI developer`
- Education degree fixed to `Bachelor of Technology`.

Interpretation:

- Local content now better supports a personal expert entity rather than generic agency/company classification.

## Local search metadata

Local `src/app/(portfolio)/search/page.tsx` sets:

```ts
robots: {
  index: false,
  follow: true,
}
```

Interpretation:

- Local search route is correctly kept out of the index while allowing link following.
- Live verification is still needed after deployment/network stabilization.

## Local structured data

Local `src/components/SeoStructuredData.tsx` emits a unified JSON-LD graph containing:

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

Interpretation:

- Structured data is centralized and data-driven.
- Person remains the primary entity, but `SoftwareApplication` scope should still be reviewed to avoid over-describing the personal site.

## Local validation

Commands run during the rerun:

```powershell
.\node_modules\.bin\biome.cmd check --max-diagnostics=200
.\node_modules\.bin\vitest.cmd run
node .\node_modules\next\dist\bin\next build --webpack
```

Results:

- Biome: passed, 81 files.
- Vitest: passed, 4 files / 19 tests.
- Next build: passed, 19 generated pages.

