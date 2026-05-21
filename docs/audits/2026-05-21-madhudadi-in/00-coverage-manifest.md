# Coverage Manifest

Audit date: 2026-05-21  
Site: https://madhudadi.in  
Codebase: `F:\Codes\Projects\madhu_portfolio`  
Skill: `world-class-web-audit`

## Repository State

Initial command: `git status --short --branch`

Result:

- Branch: `main...origin/main`
- Unrelated tracked or untracked worktree changes at audit start: none reported
- Git warning: unable to access `C:\Users\madhu\.config\git\ignore` because of permission denial
- Audit artifacts created after the initial status check under this directory

## Commands And Tools Used

- Source inspection: `rg --files`, `rg -n`, `Get-Content`, `Get-ChildItem`
- Runtime checks: `curl.exe -I -L -s`, `curl.exe -L -s`, `curl.exe -w`
- Runtime captures: temporary files under `C:\tmp\audit-*.html` and `C:\tmp\audit-*.headers`
- HTML/schema parsing: `node_repl` local file parsing
- Attempted validation:
  - `pnpm lint` failed because `pnpm` is not on PATH
  - `node_modules\.bin\biome.CMD check` failed because `@biomejs/cli-win32-x64/biome.exe` is missing
  - `node_modules\.bin\next.CMD build --webpack` failed because `@swc/helpers/_/_interop_require_default` is missing
- External documentation checked:
  - OpenAI crawler docs: https://developers.openai.com/api/docs/bots
  - Google crawler docs: https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers

## Files Inspected

Primary source files:

- `package.json`
- `next.config.ts`
- `Data/portfolio-content.json`
- `src/proxy.ts`
- `src/app/(portfolio)/layout.tsx`
- `src/app/(portfolio)/page.tsx`
- `src/app/(portfolio)/case-studies/page.tsx`
- `src/app/(portfolio)/case-studies/[slug]/page.tsx`
- `src/app/(portfolio)/search/page.tsx`
- `src/app/sitemap.ts`
- `src/app/robots.ts`
- `src/app/llms.txt/route.ts`
- `src/app/ai-profile.json/route.ts`
- `src/app/api/chat/route.ts`
- `src/app/api/cms/content/route.ts`
- `src/app/api/cms/upload/route.ts`
- `src/app/api/cms/import-live/route.ts`
- `src/app/actions/submit-contact-form.ts`
- `src/lib/portfolio-data.ts`
- `src/lib/jsonld.ts`
- `src/lib/discovery-keywords.ts`
- `src/lib/image-source.ts`
- `src/lib/agentic-rag.ts`
- `src/components/SeoStructuredData.tsx`
- `src/components/PortfolioContent.tsx`
- `src/components/DeferredGTM.tsx`
- `src/components/FloatingDock*.tsx`
- `src/components/ClientChrome.tsx`
- `src/components/SidebarToggle.tsx`
- `src/components/app-sidebar.tsx`
- `src/components/chat/*`
- `src/components/sections/*`

## Source Routes Discovered

| Source route | Route type | Data source | Expected indexability |
|---|---:|---|---|
| `/` | App route page | `getPortfolioData()` | Index |
| `/case-studies/` | App route page | `getPortfolioData()` | Index |
| `/case-studies/[slug]/` | Static params from projects | `getPortfolioData()` | Index for valid project slugs |
| `/search` | App route page | `getPortfolioData()` + query param | Empty page index, query pages noindex |
| `/cms` | App route page | CMS APIs | Protected by Basic Auth |
| `/llms.txt` | Route handler | `getPortfolioData()` | Index |
| `/ai-profile.json` | Route handler | `getPortfolioData()` | Index |
| `/robots.txt` | Metadata route | Static function | Crawl control |
| `/sitemap.xml` | Metadata route | `getPortfolioData()` | Crawl discovery |
| `/opengraph-image` | Image route | portfolio data/assets | Asset |
| `/api/chat` | Route handler | OpenAI + portfolio data | Public API, not indexable |
| `/api/cms/content` | Route handler | portfolio JSON file | Protected API |
| `/api/cms/upload` | Route handler | `public/uploads/cms` | Protected API |
| `/api/cms/import-live` | Route handler | live endpoints | Protected API |

## Live URLs Tested

| URL | Status | Notes |
|---|---:|---|
| `https://madhudadi.in/` | 200 | Portfolio home |
| `https://www.madhudadi.in/` | 301 -> 200 | Redirects to apex |
| `https://madhudadi.in/case-studies` | 200 | No redirect to slash canonical |
| `https://madhudadi.in/case-studies/` | 200 | Canonical collection URL |
| `https://madhudadi.in/case-studies/technical-blog/` | 200 | Sitemap case study |
| `https://madhudadi.in/case-studies/udemy-enroller-fastapi` | 200 | No redirect to slash canonical |
| `https://madhudadi.in/case-studies/udemy-enroller-fastapi/` | 200 | Canonical case study |
| `https://madhudadi.in/search` | 200 | Canonical renders as `/search/` |
| `https://madhudadi.in/search/` | 200 | Same content |
| `https://madhudadi.in/search?q=rag` | 200 | `noindex, follow`, canonical `/search/` |
| `https://madhudadi.in/robots.txt` | 200 | Live consolidated blog + portfolio file |
| `https://madhudadi.in/sitemap.xml` | 200 | Live sitemap index |
| `https://madhudadi.in/sitemap-portfolio.xml` | 200 | Live portfolio child sitemap |
| `https://madhudadi.in/llms.txt` | 200 | Portfolio LLM feed |
| `https://madhudadi.in/llms-full.txt` | 404 | Allowed in live robots, missing at root |
| `https://madhudadi.in/ai-profile.json` | 200 | Portfolio AI profile |
| `https://madhudadi.in/blog` | 200 | Blog home |
| `https://madhudadi.in/blog/sitemap.xml` | 200 | Blog sitemap |
| `https://madhudadi.in/blog/llms.txt` | 200 | Blog LLM feed |
| `https://madhudadi.in/blog/llms-full.txt` | 200 | Blog full LLM feed |
| `https://madhudadi.in/blog/ai-profile.json` | 200 | Blog AI profile |
| `https://madhudadi.in/cms` | 401 | Basic Auth active |
| `https://madhudadi.in/api/cms/content` | 401 | Basic Auth active |
| `https://madhudadi.in/api/chat` | 405 | GET rejected |
| `https://madhudadi.in/not-a-real-audit-url` | 404 | Hard 404 |

## Evidence Limits

- Search Console, CrUX, analytics, RUM, CDN logs, origin logs, WAF logs, and production deployment config were unavailable.
- Browser rendering, screenshots, console logs, and keyboard navigation could not be completed because no browser automation tool was available and Playwright was not installed.
- Lighthouse/PageSpeed was not run.
- Local build, lint, and test validation were blocked by missing package-manager/toolchain dependencies.
- Security dependency audit was not run because package manager execution is unavailable in this environment.
- Any Core Web Vitals verdict requires CrUX, RUM, or Search Console validation.

