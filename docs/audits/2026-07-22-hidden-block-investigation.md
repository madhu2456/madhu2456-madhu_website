# Investigation: “hidden AI instruction block” on `/case-studies/`

**Date:** 2026-07-22  
**Scope:** Portfolio main site (`madhudadi.in`), especially `/case-studies/`.  
**Not closed:** re-fetch after deploy of human-facing label rewrites.

## Claim

Automated extraction of `https://madhudadi.in/case-studies/` flagged an obfuscated, instruction-style block near the bottom of the page (after the Udemy Enroller card links). Content was redacted by the auditor’s tooling.

## What we checked (same day)

### Template / codebase

- Grep of `src/` for classic injection phrases (`ignore previous`, `system prompt`, cloaked “for AI crawlers” HTML, etc.).
- Only **legitimate** `sr-only` usage found sitewide on this page path family: skip-to-content link; gallery heading on leaf pages.
- No shared partial on `/case-studies/` injects a “What AI systems should know…” block (that copy lived only on `/profile/`, and was **visible**, not hidden).

### Live HTML (external host, 2026-07-22)

- Fetched `/case-studies/` with browser UA and bot UAs: `GPTBot`, `ClaudeBot`, `Claude-SearchBot`, `OAI-SearchBot`, `PerplexityBot`, `Googlebot`.
- All returned **HTTP 200**, body size **identical** (~326 398 bytes).
- **Main text content (`<main>…</main>` plain text) was identical across all UAs.**
- Full-document MD5 differed only in a **single Cloudflare email-protection hash** (`/cdn-cgi/l/email-protection#…`) — not an instruction payload.
- Visible content after the last case-study card: hire CTA (“Need a hands-on AI engineer?”) → footer. No `display:none` / `sr-only` instruction block found there.
- HTML comments and `aria-hidden` nodes on the page did not contain instruction-style prose.

## Working hypothesis (not final closure)

1. **Leading:** classifiers treat instruction-phrased or AI-addressed GEO copy (and dense AI/RAG case-study prose + large Next.js RSC payloads) as injection-like — even when the text is **visible** and human-intended.
2. **Weaker:** edge-injected, UA-conditional content — **not supported** by this host’s UA-parity test (main text identical).

## Remediation shipped with this note (human ≡ machine copy)

| Change | Purpose |
|--------|---------|
| `/profile/` section retitled to **“Positioning in one paragraph”**; body rewritten as third-person declarative facts; removed “GEO Block for AI Crawlers” comment and “What AI systems should know…” H2 | Remove AI-addressed phrasing that trips detectors |
| Homepage eyebrow **“Direct Answer”** → **“In brief”** | Audit §3.2 machine-facing scaffold |
| Service / case-study / credentials / India lander **“Quick Answer”** labels → **“In brief …”** | Same principle; summary body text kept |

Principle: **identical content for humans and machines; semantics via schema and plain declarative HTML, not AI-addressed prose.**

## Documentation status (amended — do not claim “none found” as closure)

> Hidden block not found in templates or browser-rendered HTML on 2026-07-22; automated extraction still flagged a redacted block at the bottom of `/case-studies/` on the same date; leading hypothesis: classifier reaction to instruction-phrased GEO copy and/or dense AI case-study prose + RSC payload; pending closure via post-deploy re-fetch. UA-parity on this host: main body identical across bot and browser UAs (only CF email hash differed).

## How to close

1. Deploy the label/copy rewrite.
2. Auditor re-fetches `/case-studies/` with the same extraction pipeline.
3. If the flag **disappears** → confirm hypothesis (a); close with that evidence.
4. If the flag **persists** → share a redacted offset or structural fingerprint (tag/class/length); re-open deeper forensic (third-party scripts, CF Snippets, CMS fields).

## Intentionally out of scope

- Re-enabling FAQPage/HowTo/speakable as CTR levers (2026 Search Central policy).
- Changing robots training opt-out (`GPTBot` / `Google-Extended` Disallow) without a product decision.
