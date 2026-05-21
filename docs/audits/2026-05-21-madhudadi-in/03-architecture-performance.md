# Phase C - Architecture And Performance

## Architecture Summary

The portfolio is a data-driven Next.js 16 App Router application. The current architecture is mostly sound:

- Portfolio facts flow through `getPortfolioData()`.
- Heavy below-the-fold sections are dynamically imported in `src/components/PortfolioContent.tsx`.
- Chat UI is client-only and delayed until the sidebar has been opened.
- GTM is deferred until user interaction in `src/components/DeferredGTM.tsx`.
- Profile image uses `next/image`, `priority`, `fetchPriority="high"`, and `quality={60}`.
- CMS routes are force-dynamic and protected by `src/proxy.ts`.

## Rendering And Cache Evidence

Runtime headers sampled from portfolio routes:

- `/`, `/case-studies/`, `/case-studies/udemy-enroller-fastapi/`: `x-nextjs-cache: HIT`, `x-nextjs-prerender: 1`, `Cache-Control: s-maxage=31536000`
- `/search`: `Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate`
- `/llms.txt` and `/ai-profile.json`: `Cache-Control` with `stale-while-revalidate`

Source evidence:

- `src/app/sitemap.ts:6` exports `revalidate = 3600`
- `src/app/llms.txt/route.ts:5` exports `revalidate = 3600`
- `src/app/ai-profile.json/route.ts:5` exports `revalidate = 3600`
- CMS APIs use `dynamic = "force-dynamic"` and `runtime = "nodejs"`

## Lab Runtime Timings

Synthetic `curl` timings from this session:

| URL | Status | TTFB | Total | Decoded size |
|---|---:|---:|---:|---:|
| `/` | 200 | 0.335s | 0.685s | 504825 bytes |
| `/case-studies/udemy-enroller-fastapi/` | 200 | 0.360s | 0.547s | 273881 bytes |
| `/search` | 200 | 0.483s | 0.638s | 250537 bytes |
| `/blog` | 200 | 0.204s | 0.326s | 173305 bytes |

Field data unavailable:

- CrUX
- Search Console Core Web Vitals
- RUM
- CDN logs
- Browser trace / Lighthouse

Production Core Web Vitals verdict requires CrUX/RUM/Search Console validation.

## Performance Findings

### PERF-001 - Portfolio HTML payload is heavy relative to the blog

Confidence: Inferred from verified lab/runtime evidence  
Severity: Medium

Evidence:

- Runtime decoded HTML capture for `/`: 504825 bytes.
- Runtime decoded HTML capture for `/blog`: 173305 bytes.
- Source `next.config.ts:37` enables `experimental.inlineCss`.
- Source `src/components/PortfolioContent.tsx` renders the full homepage content with many sections, Suspense boundaries, skeletons, and server-rendered section HTML.

Impact:

- More bytes for crawlers and first navigation.
- More HTML parse work before interactivity.
- Potential TTFB/HTML streaming sensitivity even though sampled TTFB was acceptable.
- May reduce AI extractor signal-to-noise because the raw document contains a large amount of style and UI markup.

Fix:

- Measure with Lighthouse and WebPageTest before changing.
- Compare builds with `experimental.inlineCss` enabled vs disabled.
- Consider moving repeated below-the-fold visual sections to lighter static summaries with expandable detail.
- Keep LCP hero SSR and priority image behavior.
- Preserve schema and core content in initial HTML.

Validation:

- Run Lighthouse mobile/desktop.
- Compare decoded HTML bytes, transfer bytes, TTFB, LCP, INP/TBT, and DOM node count.
- Confirm no regression in metadata or JSON-LD.

### OPS-002 - Local validation toolchain is incomplete

Confidence: Verified  
Severity: Medium

Evidence:

- `pnpm lint` failed because `pnpm` is not recognized.
- `node_modules\.bin\biome.CMD check` failed because `@biomejs/cli-win32-x64/biome.exe` is missing.
- `node_modules\.bin\next.CMD build --webpack` failed because `@swc/helpers/_/_interop_require_default` is missing.

Impact:

- Build, lint, tests, dependency audit, and bundle analysis are not reproducible in the current workspace.
- Audit cannot confirm current source compiles.

Fix:

- Install the package manager used by the project or enable Corepack.
- Reinstall dependencies from `pnpm-lock.yaml`.
- Re-run `pnpm lint`, `pnpm test`, `pnpm build`.

## Rendering Boundary Findings

No confirmed server/client boundary defects were found. Positive observations:

- `ChatSidebarSection` delays `ChatWrapper` until first sidebar open.
- `FloatingDockMount` delays `FloatingDockClient` until interaction.
- `DeferredGTM` delays GTM until first user interaction.
- `PortfolioContent` keeps hero synchronous and defers below-the-fold sections.

Remaining validation need:

- Browser trace is required to verify hydration cost, INP risk, and console errors.

## Performance Roadmap

Quick wins:

- Fix `OPS-002` so local build/lint/test works.
- Run Lighthouse and capture baseline metrics.
- Resolve canonical duplicates before measuring crawl impact.

Medium term:

- Test `inlineCss` on/off.
- Audit homepage DOM size and repeated card markup.
- Move non-critical animation and dock code behind reduced-motion and interaction gates.

Advanced:

- Add bundle analysis after dependency repair.
- Add RUM or web-vitals collection for field LCP/CLS/INP.
- Add route-level synthetic monitoring for `/`, `/case-studies/`, `/blog`, `/llms.txt`, `/ai-profile.json`.

