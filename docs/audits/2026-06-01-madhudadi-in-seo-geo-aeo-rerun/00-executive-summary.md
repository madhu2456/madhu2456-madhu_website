# madhudadi.in SEO / AEO / GEO Rerun - Executive Summary

Date: 2026-06-01  
Audit type: Fresh rerun after implementation  
Primary goal: ranking growth plus AI/LLM visibility  
Targets: live `https://madhudadi.in/` and local repo state

## Summary

The local repo now reflects the key cleanup work from the previous audit: active source/content has no `sitemap-portfolio` references, no `Batchelor` typo, no `DataIku` casing issue, no `Highlighted projects: 2` string, and no broad "AI consulting company" / "top AI consulting firms" keywords in active app/content files.

Production has not fully caught up. The live root sitemap still returns a sitemap index that points to `https://madhudadi.in/sitemap-portfolio.xml`, and `sitemap-portfolio.xml` still returns `200 OK`. This is the primary remaining blocker because search engines consume production, not local source.

## Current top priorities

| Priority | Area | Status | Recommendation |
| --- | --- | --- | --- |
| P0 | Sitemap | Live still stale | Find the deployment/proxy route serving `/sitemap.xml`, deploy the local direct URL-set sitemap, and purge CDN/cache. |
| P0 | Legacy sitemap | Live `sitemap-portfolio.xml` returns `200 OK` | Redirect it to `/sitemap.xml`, return a valid non-recursive URL set, or remove the route if safe. |
| P1 | Deployment drift | Local clean, production stale | Verify the latest app build is actually deployed to the host answering `madhudadi.in`. |
| P1 | GEO endpoint verification | Live `llms.txt`, `ai-profile.json`, and `/search/` fetches failed during rerun after repeated retries | Recheck from a stable network or logged deployment environment after sitemap fix. |
| P2 | Structured data scope | Local graph remains rich and broad | Keep Person as primary entity; review whether `SoftwareApplication` should describe the AI assistant rather than the whole personal site. |

## What improved locally

- Root sitemap implementation emits direct URL entries for the homepage, case-study index, and all case-study slugs.
- Root robots implementation preserves consolidated blog protections, AI crawler rules, and blog sitemap index references.
- Search page metadata uses `noindex, follow`.
- Site keywords are now more personal-entity aligned.
- Education typo is fixed to `Bachelor of Technology`.
- Prior broad agency/company keywords are absent from active app/content files.
- Local source/content probes are clean for the previous audit's major content issues.

## What remains unresolved live

- `/sitemap.xml` still references `/sitemap-portfolio.xml`.
- `/sitemap-portfolio.xml` still returns `200 OK`.
- Live GEO/search endpoint checks were intermittently unreachable from this environment during the rerun, so their current production content cannot be marked fully verified.

## Validation snapshot

Local validation run during this rerun:

- `git status --short` before report creation: clean.
- `rg` stale-content/source probes: clean for active `Data`, `src`, `public`, `package.json`, and `next.config.ts`.
- `biome check`: passed.
- `vitest run`: passed, 4 files / 19 tests.
- `next build --webpack`: passed.

Live validation run during this rerun:

- `/` returned `200 OK`.
- `www.madhudadi.in` returned `301` to `https://madhudadi.in/`.
- `/robots.txt` returned consolidated blog + portfolio robots rules.
- `/sitemap.xml` returned stale sitemap index referencing `/sitemap-portfolio.xml`.
- `/sitemap-portfolio.xml` returned `200 OK`.
- `/llms.txt`, `/ai-profile.json`, and `/search/` fetches failed from this environment after retries.

## External data not available

This rerun did not inspect Google Search Console, Bing Webmaster Tools, GA4, Cloudflare cache rules, deployment provider route configuration, server logs, CrUX, or private AI visibility tools.

