/**
 * Pillar: AI search optimization 2026 — AEO + GEO + AIO (audit B3).
 * TechArticle + visible structure only — no FAQPage growth schema.
 * Grounded in site practice (llms.txt, schema, answer-first) — not invented citation multipliers.
 */
export const AI_SEARCH_OPTIMIZATION_2026_GUIDE = {
  slug: "ai-search-optimization-2026",
  path: "/guides/ai-search-optimization-2026/",
  title: "AI search optimization (AEO + GEO + AIO) — the 2026 playbook",
  seoTitle: "AI Search Optimization 2026 — AEO + GEO | Madhu Dadi",
  seoDescription:
    "Get cited by ChatGPT, Perplexity, Gemini, and Google AI Overviews. 2026 playbook for AEO, GEO, and AIO: structure, schema, llms.txt, and measurement.",
  publishedAt: "2026-07-23",
  updatedAt: "2026-07-23",
  directAnswer:
    "AEO (answer engine optimization) targets direct-answer engines like ChatGPT and Perplexity. GEO (generative engine optimization) targets embedded AI answers inside search engines like Google AI Overviews. AIO (AI-index optimization) is the broader practice of making a site legible to LLM-based crawlers through clear HTML, schema, and machine-readable files. In 2026 you need all three on top of ordinary technical SEO—not instead of it.",
  sections: [
    {
      id: "definitions",
      h2: "AEO vs GEO vs AIO — the definitions that matter",
      paragraphs: [
        "Teams use these acronyms loosely. Separate them by where the answer appears and how the system retrieves sources.",
        "Google’s public guidance still points at helpful, people-first content and core SEO for generative features—not a special “AI markup.” Non-Google engines reward the same clarity plus structured extractable blocks. Write for humans; organize so machines can quote you without inventing context.",
      ],
      table: {
        caption: "Three layers of AI-era discoverability",
        headers: ["Term", "Primary surface", "What you optimize"],
        rows: [
          [
            "AEO",
            "ChatGPT, Perplexity, Claude (with search), assistants",
            "Extractable answers, FAQs, comparisons, citable stats",
          ],
          [
            "GEO",
            "Google AI Overviews / AI Mode, Bing Copilot in SERP",
            "Ranking fundamentals + clear passages engines can quote",
          ],
          [
            "AIO / LLMO",
            "Crawlers and agents reading your site",
            "robots policy, SSR HTML, schema, llms.txt, stable URLs",
          ],
        ],
      },
    },
    {
      id: "crawlers",
      h2: "The 2026 AI crawlers and how to allow them",
      paragraphs: [
        "Decide training vs citation explicitly. Many sites disallow training-only bots (e.g. GPTBot, Google-Extended, ClaudeBot, CCBot) while allowing search/citation user-agents (e.g. OAI-SearchBot, ChatGPT-User, PerplexityBot, Claude-SearchBot). Blocking a citation bot removes you from that product’s live answers.",
        "Always keep classic Googlebot/Bingbot unblocked for organic search. Serve robots.txt and sitemaps over HTTPS with 200 responses. Do not Disallow key commercial URLs by accident.",
      ],
      bullets: [
        "Allow: traditional search + AI search/citation bots you care about",
        "Disallow: training scrapers if that is your IP policy",
        "List sitemaps in robots.txt",
        "Verify with live fetches, not only local files",
      ],
    },
    {
      id: "machine-files",
      h2: "llms.txt, llms-full.txt, and ai-profile.json",
      paragraphs: [
        "llms.txt (llmstxt.org style) is a short Markdown map of important URLs for agents. llms-full.txt expands context. An ai-profile.json (or similar) can hold stable identity facts. None of these replace good HTML pages; they reduce ambiguity for agents that fetch your origin.",
        "Adoption is uneven and unproven as a ranking factor. Treat them as cheap protocol hygiene—like early schema.org—especially for consultant and product sites where entity clarity matters.",
      ],
    },
    {
      id: "sixty-word-pattern",
      h2: "The 60-word definition pattern",
      paragraphs: [
        "Lead important pages with a self-contained answer of roughly 40–80 words under the H1. That block should define the entity or decision, state who it is for, and avoid pronouns that need earlier paragraphs.",
        "Follow with proof (numbers, employers, case links), then depth. AI Overviews and chat engines prefer passages that work alone. Keyword stuffing hurts both readability and citation quality.",
      ],
    },
    {
      id: "schema-stack",
      h2: "Schema stack — what to use (and what not to chase)",
      paragraphs: [
        "Useful today: Person / Organization with sameAs, WebSite + SearchAction when you have site search, WebPage, BreadcrumbList, Service, TechArticle/Article with author and dates.",
        "Do not re-enable retired rich-result bait as a growth strategy. FAQPage and HowTo may still be valid JSON-LD types, but Google has reduced or retired many rich results; visible FAQ HTML is still valuable for humans and extractors. Prefer honest visible structure over spam schema.",
      ],
      table: {
        caption: "Schema priorities for a consulting portfolio",
        headers: ["Type", "Where", "Purpose"],
        rows: [
          ["Person + sameAs", "Home, profile", "Entity disambiguation"],
          ["Service", "Service / lander pages", "Offer clarity"],
          ["TechArticle", "Guides", "Authorship + freshness"],
          ["BreadcrumbList", "Inner pages", "Hierarchy"],
          [
            "WebSite SearchAction",
            "Home (if search exists)",
            "Sitelinks search box",
          ],
        ],
      },
    },
    {
      id: "entity-clarity",
      h2: "Entity clarity: Author, Organization, sameAs",
      paragraphs: [
        "Pick one canonical name string and stick to it across title tags, bylines, schema, and LinkedIn. Link sameAs to real profiles (LinkedIn, GitHub, company pages). Host a single identity proof page (profile/about) that restates services, location, and contact without contradiction.",
        "For local queries, use honest areaServed and remote-first language. Do not invent a street address in a city you do not operate from—Google and users both catch fake NAP.",
      ],
    },
    {
      id: "content-patterns",
      h2: "Content patterns that get extracted",
      paragraphs: [
        "Comparison tables (X vs Y), step lists with exit criteria, original measured outcomes with “how measured” notes, and FAQs written as real questions. Case studies should lead with results, then problem/architecture.",
        "Topic clusters beat orphan posts: service hub → landers → guides → case studies, with reciprocal links. One deep guide per cluster often outperforms ten thin keyword pages.",
      ],
      bullets: [
        "Answer first, then elaborate",
        "One primary intent per URL",
        "Cite sources and show measurement method for stats",
        "Update dates when substance changes",
      ],
    },
    {
      id: "measurement",
      h2: "Measurement: how to see if you are being cited",
      paragraphs: [
        "Google Search Console still has no dedicated “AI Overview clicks” report that replaces core Performance data. Track branded queries, landing pages for commercial intents, and assisted conversions from contact forms.",
        "For ChatGPT/Perplexity citations, run a monthly manual panel of 10–20 queries and log whether you appear. Optional third-party AI visibility tools help at scale. Referral logs from AI domains are incomplete—do not wait for perfect attribution.",
      ],
    },
    {
      id: "anti-patterns",
      h2: "What not to do",
      paragraphs: [
        "Do not write separate “AI bait” pages that no human would read—Google’s spam policies cover scaled unhelpful content. Do not chunk pages into nonsense fragments “for embeddings.” Do not block every AI bot if you want citations. Do not hide pricing or identity behind pure client-side shells if agents and crawlers need the facts.",
      ],
    },
    {
      id: "faq",
      h2: "FAQ",
      paragraphs: [
        "Is AI SEO different from SEO? Foundations are the same: crawlability, usefulness, E-E-A-T. AI SEO adds extractability, entity clarity, and crawler policy.",
        "Will llms.txt rank me? Unproven. It helps agents understand your map; rankings still need content and links.",
        "Should every site enable FAQPage schema? Prefer visible FAQs. Schema policy should follow current Search Central guidance and your risk tolerance—this site keeps FAQ HTML without FAQPage growth schema.",
        "Where do I start on a portfolio? Fix robots/sitemap, one identity page, answer-first service pages, 2–3 citable guides, and case studies with measured outcomes.",
      ],
    },
  ],
  relatedLinks: [
    {
      href: "/guides/rag-vs-fine-tuning-2026/",
      label: "Guide: RAG vs fine-tuning 2026",
    },
    {
      href: "/services/rag-consultant-india/",
      label: "RAG consultant service",
    },
    {
      href: "/case-studies/adticks/",
      label: "Case study: Adticks AI visibility",
    },
    {
      href: "/ai-consultant-india/",
      label: "AI consultant in India hub",
    },
    { href: "/llms.txt", label: "This site’s llms.txt" },
    { href: "/ai-profile.json", label: "This site’s ai-profile.json" },
    { href: "/contact/#intent=rag", label: "Contact / discovery" },
  ],
} as const;
