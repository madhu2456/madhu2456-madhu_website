# Verification Matrix - Rerun

Date: 2026-06-01

| Surface | Local status | Live status | Evidence | Next action |
| --- | --- | --- | --- | --- |
| Git working tree | Pass before report creation | N/A | `git status --short` clean | None. |
| Stale sitemap source refs | Pass | Fail live | Local `rg` clean; live `/sitemap.xml` references `sitemap-portfolio.xml` | Fix production route/cache. |
| `/sitemap.xml` | Pass | Fail | Local route emits URL set; live emits sitemap index to legacy path | Deploy/purge route. |
| `/sitemap-portfolio.xml` | Pass absent from active source | Fail | Live returns `200 OK` | Redirect/remove/update legacy route. |
| `/robots.txt` | Pass | Pass with sitemap dependency | Local and live preserve blog protections and AI crawler rules | Recheck after sitemap fix. |
| Homepage status | N/A | Pass | Live `/` returns `200 OK` | Continue monitoring. |
| Canonical host | N/A | Pass | `www` redirects to root non-www | None. |
| Search noindex | Pass | Unknown | Local metadata has `noindex, follow`; live fetch failed | Recheck after deploy/network stabilization. |
| `llms.txt` content | Pass by source/build | Unknown | Live fetch failed during rerun | Recheck from stable network. |
| `ai-profile.json` content | Pass by source/build | Unknown | Live fetch failed during rerun | Recheck from stable network. |
| Broad company keywords | Pass | Unknown | Local active probes clean; live GEO fetch failed | Recheck live endpoints/homepage. |
| `Batchelor` typo | Pass | Unknown | Local active probes clean; live endpoint/page fetch failed | Recheck rendered production pages. |
| Featured project count | Pass by local data | Unknown | Local has three featured projects; live page fetch failed | Recheck rendered homepage/FAQ. |
| JSON-LD graph | Pass by source/build | Unknown | Local graph centralized; live HTML fetch failed | Validate rendered live HTML after network/deploy stabilization. |
| Biome | Pass | N/A | `biome check` passed | Keep in release gate. |
| Vitest | Pass | N/A | 4 files / 19 tests passed | Keep in release gate. |
| Next build | Pass | N/A | `next build --webpack` passed | Keep in release gate. |

## Current release-readiness interpretation

Local source is ready from an SEO/AEO/GEO content hygiene perspective. Production is not ready to mark complete because the live sitemap still serves stale legacy behavior.

## Minimum live acceptance before closing the audit

- `/sitemap.xml` has no `sitemap-portfolio` reference.
- `/sitemap-portfolio.xml` no longer returns a recursive/legacy sitemap index.
- `/search/` returns `noindex, follow`.
- `/llms.txt` and `/ai-profile.json` return `200 OK` and do not contain removed terms.
- Rich Results / Schema.org validation passes for the homepage and one case-study page.

