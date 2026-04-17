@AGENTS.md

# Portfolio Codebase — Architecture & Development Guide

## Overview

**madhudadi.in** — Personal portfolio for Madhu Dadi, a software engineer specialising in AI/ML engineering and full-stack development.

- **Framework**: Next.js 16 (App Router), React 19, TypeScript 5.9
- **Styling**: Tailwind CSS v4 (CSS-native config, OKLch variables), Geist fonts
- **Animation**: `motion` v12 (NOT `framer-motion`) — all imports from `"motion/react"`
- **Icons**: `@tabler/icons-react` v3.40
- **Linting**: Biome (not ESLint/Prettier)
- **Deployment**: DigitalOcean Droplet, production URL `https://madhudadi.in`

---

## Data Architecture

**Single source of truth**: `src/lib/portfolio-data.ts`

All portfolio content lives in local JSON/data files. There is **no CMS dependency** — Sanity has been completely removed. The CMS editor (`src/app/(portfolio)/cms/`) and import utilities (`src/lib/cms-live-import.ts`) are internal tools for editing portfolio content and remain in the codebase but are not public-facing.

```
src/lib/
├── portfolio-data.ts      ← Core data loader; exports getPortfolioData()
├── jsonld.ts              ← JSON-LD schema builders (SEO structured data)
├── agentic-rag.ts         ← RAG chatbot logic (OpenAI Responses API + local data)
├── cms-live-import.ts     ← Admin import utility (not public)
├── cms-revalidate.ts      ← ISR revalidation helpers
└── utils.ts               ← cn() (clsx + tailwind-merge)
```

`getPortfolioData()` returns a typed object with:
- `profile` — name, bio, location, availability, social links, stats
- `siteSettings` — title, description, keywords, GTM ID
- `sortedExperiences`, `sortedProjects`, `sortedServices`, `sortedCertifications`, `sortedEducation`, `sortedSkills`
- `featuredProjects` — subset of projects with `featured: true`
- `portfolioLastUpdatedAt` — ISO timestamp for sitemap/cache headers

---

## Route Structure

```
src/app/
├── (portfolio)/            ← Route group (shares layout.tsx)
│   ├── layout.tsx          ← Root metadata, theme, sidebar, fonts
│   ├── page.tsx            ← Home (renders PortfolioContent)
│   ├── loading.tsx         ← Skeleton loading state
│   ├── not-found.tsx       ← 404 page
│   ├── opengraph-image.tsx ← Dynamic OG image (1200×630, uses ImageResponse)
│   ├── case-studies/
│   │   ├── page.tsx        ← Case studies index
│   │   └── [slug]/page.tsx ← Individual case study
│   └── cms/page.tsx        ← Admin CMS editor (protected by CMS_AUTH_*)
├── api/
│   ├── chat/route.ts       ← POST /api/chat — Agentic RAG (requires OPENAI_API_KEY)
│   └── cms/
│       ├── content/route.ts   ← GET/POST portfolio data
│       ├── upload/route.ts    ← Image upload handler
│       └── import-live/route.ts ← Import from madhudadi.in live data
├── actions/
│   └── submit-contact-form.ts ← Server action, sends email via Resend
├── manifest.ts             ← PWA manifest
├── robots.ts               ← robots.txt (AI crawlers explicitly allowed)
├── sitemap.ts              ← Dynamic XML sitemap with ISR (revalidate=3600)
├── llms.txt/route.ts       ← Machine-readable LLM profile (GEO)
└── ai-profile.json/route.ts ← Structured JSON profile for AI systems (GEO)
```

---

## Chat / Agentic RAG System

The AI chat sidebar is powered by a custom RAG system (no external chat widget dependency):

```
src/components/chat/
├── Chat.tsx               ← Main chat container (typewriter, scroll, input)
├── chat-message.tsx       ← MessageBubble component (markdown, copy, suggestions)
├── chat-ui.tsx            ← MarkdownText, TypingDots, CopyButton, ChatInitSkeleton
├── chat-types.ts          ← ChatMessage, ChatRole types (no external deps)
├── ChatSidebarSection.tsx ← Loads chat inside sidebar
├── ChatWrapper.tsx        ← Lazy wrapper
├── chat-profile.ts        ← ChatProfile type (subset of portfolio Profile)
└── profile-facts.ts       ← Fact database for RAG context

src/lib/agentic-rag.ts     ← Full RAG pipeline (topic guard, chunk retrieval, OpenAI)
src/prompts/               ← Prompt templates for topic moderation & guardrails
```

**RAG flow** (`POST /api/chat`):
1. Message passes topic guardrail (allowed: portfolio-related questions only)
2. `retrieveRelevantChunks()` scores knowledge chunks against query tokens
3. If no chunks found but query matches profile intent, fallback to profile+contact chunks
4. OpenAI `gpt-4.1-mini` (Responses API) generates reply with injected context
5. Response includes `suggestedPrompts[]` for follow-up chips

**Required env var**: `OPENAI_API_KEY`

---

## SEO / AEO / GEO Strategy

### Technical SEO
- **Metadata**: Dynamic via `generateMetadata()` in `layout.tsx` — title, description, OG, Twitter, canonical, keywords, robots
- **Sitemap**: `/sitemap.xml` — ISR revalidated hourly, includes case studies + blog cross-links
- **Robots**: `/robots.txt` — comprehensive AI bot allowlist (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, +15 others)
- **OG Image**: `/opengraph-image` — dynamic `ImageResponse` (1200×630) with profile name and headline
- **PWA**: `/manifest.webmanifest` — installable app with icons and theme colour

### Structured Data (JSON-LD)
All schemas live in `src/lib/jsonld.ts` and are rendered by `src/components/SeoStructuredData.tsx` as a unified `@graph` document:

| Schema | Purpose |
|---|---|
| `Person` | Core identity node with `@id`, social links, `knowsAbout`, `alumniOf`, `nationality` |
| `Occupation` | Job title, skills, location |
| `WebSite` | Site identity with `SearchAction` (SiteLinksSearchBox) and blog `hasPart` |
| `ProfilePage` | Portfolio page with `speakable` CSS selectors |
| `FAQPage` | 7 Q&A pairs for answer-engine (AEO) extraction |
| `ItemList<SoftwareApplication>` | Projects |
| `ItemList<Service>` | Service offerings with pricing |
| `ItemList<OrganizationRole>` | Work experience |
| `ItemList<EducationalOccupationalCredential>` | Certifications |
| `BreadcrumbList` | Navigation path |

### GEO (Generative Engine Optimisation)
- **`/llms.txt`**: Machine-readable Markdown profile (case studies, services, experience, evidence links)
- **`/ai-profile.json`**: Structured JSON (Person schema + full skills, projects, certifications, education arrays)
- Both include `Link` headers cross-referencing each other and the blog RSS feed
- `Access-Control-Allow-Origin: *` on `ai-profile.json` for programmatic access

---

## Sidebar & Layout

The portfolio uses a shadcn/ui `Sidebar` on the right side for the AI chat:

```
SidebarProvider (defaultOpen=false)
├── SidebarInset — main content
│   └── PortfolioContent — all portfolio sections
├── AppSidebar (side="right") — Chat
└── FloatingDock — nav links (dynamic import)
```

`SidebarToggle.tsx` — floating FAB button, visible only when sidebar is closed.
The chat header has its own close button (`IconX` via `toggleSidebar()`).

---

## Contact Form

`src/app/actions/submit-contact-form.ts` — Server action using Resend HTTPS API.

**Required env vars**:
```
RESEND_API_KEY=re_xxx          # from resend.com
CONTACT_FORM_TO=madhu.kumar245@gmail.com
CONTACT_FORM_FROM=noreply@madhudadi.in  # optional; requires domain verified on Resend
```

Falls back to console-only logging if env vars not set — form still returns `{ success: true }`.

---

## Environment Variables

```bash
NEXT_PUBLIC_SITE_URL=https://madhudadi.in      # canonical domain
OPENAI_API_KEY=sk-proj-...                     # chat RAG
RESEND_API_KEY=re_...                          # contact form email
CONTACT_FORM_TO=madhu.kumar245@gmail.com
CONTACT_FORM_FROM=noreply@madhudadi.in         # optional
CMS_AUTH_USERNAME=...                          # CMS editor login
CMS_AUTH_PASSWORD=...                          # CMS editor login
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=...       # optional, Search Console
NEXT_PUBLIC_BING_SITE_VERIFICATION=...         # optional, Bing Webmaster
```

GTM container is hardcoded as `GTM-PBB2W9VG` in `layout.tsx` and loaded via `DeferredGTM`.

---

## Key Component Patterns

### Lazy Loading
Heavy components use `dynamic()` with no SSR:
- `FloatingDock` (navigation)
- `background-ripple-effect-lazy.tsx`
- `comet-card-lazy.tsx`

### Theme
`next-themes` with `attribute="class"`, `defaultTheme="system"`. Dark mode styles use Tailwind `dark:` variants.

### Animations
Always `import { motion, AnimatePresence } from "motion/react"` — NOT from `"framer-motion"`.

---

## Companion Blog

The blog platform lives at `F:\Codes\Claude\madhudadi.in\blog_platform` and is served at `madhudadi.in/blog`. It is a separate Next.js app (basePath: `/blog`) with a FastAPI backend.

Cross-links between portfolio and blog:
- Portfolio `sitemap.ts` includes blog routes
- Portfolio `llms.txt` references blog RSS feed
- Portfolio `ai-profile.json` includes `blog.url` and `blog.rss` in `meta`
- Portfolio `layout.tsx` `<head>` has RSS autodiscovery link
- Blog `layout.tsx` `@graph` uses `isPartOf: { "@id": portfolio/#website }` linking
- Blog `layout.tsx` `<head>` links to portfolio's `ai-profile.json`

---

## Common Commands

```bash
pnpm dev          # development server on :3000
pnpm build        # production build (checks types)
pnpm start        # production server
pnpm lint         # Biome lint + format check
```
