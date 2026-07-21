# SEO + AEO + GEO execution plan — status

Grounded in the July 21, 2026 Semrush India plan. **Do not re-enable** Google-retired rich-result tactics (FAQPage/HowTo as CTR levers, speakable for AI Overviews) — see audit #3 / Search Central 2026.

## Phase 1 — Technical foundation

| ID | Task | Status |
|----|------|--------|
| 1.1 | HTTPS + www→apex 301 | **Live** |
| 1.2 | Self-referential canonicals | **Live** (per-page `alternates.canonical`) |
| 1.3 | hreflang en-IN, en, x-default | **Shipped** (`siteLanguageAlternates`) |
| 1.4 | Sitemap portfolio + blog index | **Live** (`/sitemap.xml` index) |
| 1.5 | robots + Sitemap lines + AI allow-list | **Live** (nginx robots) |
| 1.6 | Trailing-slash policy | **Live** (portfolio `trailingSlash: true`) |
| 1.7 | CWV hero preload | **Partial** (hero `priority` + fetchPriority) |
| 1.8–1.9 | GSC / Bing verify + submit | **Ops** (owner) |
| 1.10 | a11y pass | **Partial** |

## Phase 2 — Metadata

| Route | Title approach | Status |
|-------|----------------|--------|
| `/` | Madhu Dadi – AI Consultant & Analytics Leader | **Shipped** |
| `/case-studies/` | AI, RAG & Analytics Case Studies | **Shipped** |
| Case study leaves | Adticks / RAG blog / Udemy Enroller titles | **Shipped** |
| India service leaves | RAG / LLM / Marketing Analytics Consultant in India | **Shipped** (seoTitle + generateMetadata) |

## Phase 3 — Structured data

| Item | Status |
|------|--------|
| Person / WebSite / ProfilePage / Breadcrumb / TechArticle path | **Live** |
| FAQPage / HowTo / speakable as growth strategy | **Removed** (2026 docs) |
| Visible FAQ HTML | **Kept** |
| LocalBusiness fake storefront | **Not** (personal brand; GBP kept as service-area DR-06) |

## Phase 4 — AEO

| Item | Status |
|------|--------|
| `/llms.txt`, `/llms-full.txt`, `/ai-profile.json` | **Live** (honest labels) |
| Direct-answer blocks, question FAQs | **Live** on home |
| FAQPage on every service | **Won't do** (retired rich results; use visible Q&A) |
| speakable for AI Overviews | **Won't do** |

## Phase 5 — India GEO

| Item | Status |
|------|--------|
| `/services/rag-consultant-india/` | **Live** |
| `/services/llm-developer-india/` | **301 →** existing LLM service |
| `/services/marketing-analytics-consultant-india/` | **301 →** existing marketing analytics service |
| `/services/ai-consultant-visakhapatnam/` | **301 →** `/ai-consultant-india/` |
| `/ai-consultant-india/` location hub | **Live** |
| GBP / Justdial / Sulekha | **Ops** |

## Phase 6–8 — Content & off-page

Editorial calendar + outreach + Semrush tracking: **owner process**, not this deploy.

## Next code priorities

1. Blog: “What is RAG?” / abstraction-in-python refresh (content repo)
2. Service-page question H2 + TL;DR on thin leaves
3. CWV pass (Lighthouse mobile on 5 URLs)
4. Optional `.md` twins for top 10 URLs
