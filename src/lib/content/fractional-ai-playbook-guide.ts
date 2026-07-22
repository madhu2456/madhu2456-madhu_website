/**
 * Pillar: Fractional AI pricing, scope, 90-day playbook (content strategy).
 * No invented rate floors. No HowTo/FAQPage growth schema.
 */

export const FRACTIONAL_AI_PLAYBOOK_GUIDE = {
  slug: "fractional-ai-playbook",
  path: "/guides/fractional-ai-playbook/",
  title: "Fractional AI consultant: pricing, scope, and a 90-day playbook",
  seoTitle: "Fractional AI: Pricing, Scope & 90 Days | Madhu Dadi",
  seoDescription:
    "Fractional AI consulting: how retainers work, scope boundaries, and a realistic 90-day playbook. Dual full-time+consult notes.",
  publishedAt: "2026-07-22",
  updatedAt: "2026-07-22",
  directAnswer:
    "A fractional AI consultant is a senior practitioner on a part-time retainer who sets AI direction, designs RAG or LLM systems, and unblocks shipping—without a full-time hire. Pricing is scoped after discovery (no public rate card); a useful 90-day window usually produces a roadmap plus one production-shaped vertical slice with evals and handover.",
  sections: [
    {
      id: "what-fractional",
      h2: "What fractional AI consulting is",
      paragraphs: [
        "Fractional means fixed, agreed capacity—hours or outcomes per month—not unlimited access to a “virtual CTO.” You get senior judgment, architecture, and implementation support proportional to the block you buy.",
        "It differs from a full-time hire (employment, daily ownership) and from a large agency (layers of account management). You work with one engineer-consultant who has shipped production AI systems.",
      ],
    },
    {
      id: "vs-options",
      h2: "Fractional vs agency vs full-time hire",
      table: {
        caption: "When each model fits",
        headers: ["Model", "Best when", "Watch-outs"],
        rows: [
          [
            "Full-time AI engineer",
            "AI is a standing product surface needing daily ownership",
            "Hiring time and fixed cost before problem clarity",
          ],
          [
            "Agency package",
            "You need multiple roles and managed delivery",
            "Higher overhead; less direct access to implementers",
          ],
          [
            "Fractional consultant",
            "You need senior design + a pilot with handover",
            "Capacity is capped; not a substitute for product owners",
          ],
        ],
      },
      paragraphs: [
        "Many teams use fractional work to de-risk the first hire: ship a slice, document the stack, then staff ongoing ownership internally.",
      ],
    },
    {
      id: "pricing",
      h2: "How pricing works (without a public rate card)",
      paragraphs: [
        "There is no published floor or package price on this site. After a free discovery call, quotes reflect: problem risk, data access, integrations, whether the engagement is advisory-only or build, and calendar constraints from dual full-time + select consulting.",
        "Cost drivers you control: a single vertical use case, ready data access, and a named owner on your side. Cost drivers you cannot wish away: production write-actions, compliance reviews, and multi-system integrations.",
      ],
      bullets: [
        "Discovery is free and used to decide fit—not a free build",
        "Retainers are capped blocks with written deliverables",
        "Projects are fixed-outcome after scope is locked",
        "No open-ended “call anytime” CTO seat by default",
      ],
    },
    {
      id: "scope",
      h2: "Scope boundaries",
      paragraphs: [
        "In scope examples: AI roadmap prioritization, RAG/LLM architecture, evals and logging design, code reviews, a thin production slice, vendor selection notes, handover docs.",
        "Out of scope unless explicitly contracted: unlimited Slack support, full product management, 24/7 ops, or “automate the company” without kill criteria.",
      ],
    },
    {
      id: "ninety-days",
      h2: "A realistic 90-day playbook",
      paragraphs: [
        "Exact weeks shift with access and risk. This pattern is a planning template, not a promise of multi-product transformation in a quarter.",
      ],
      table: {
        caption: "Illustrative 90-day phases",
        headers: ["Phase", "Focus", "Exit criteria"],
        rows: [
          [
            "Days 1–30",
            "Discovery, use-case ranking, architecture sketch, data readiness",
            "Written roadmap + pilot brief with success metrics",
          ],
          [
            "Days 31–60",
            "Build thin vertical slice (e.g. RAG or structured LLM workflow)",
            "Working path in a non-prod or limited prod environment + basic evals",
          ],
          [
            "Days 61–90",
            "Harden logging, docs, ownership transfer, next-hire notes",
            "Runbook your team can operate; decision to stop, extend, or hire",
          ],
        ],
      },
    },
    {
      id: "roi",
      h2: "How to measure ROI",
      paragraphs: [
        "Pick one or two metrics before build: time-to-safe-deploy, support deflection, latency/cost per request, or a revenue experiment. Review them at checkpoints. Demo delight is not ROI.",
      ],
    },
    {
      id: "dual-role",
      h2: "Dual full-time + consulting (how availability works)",
      paragraphs: [
        "I keep a full-time role and take select consulting that respects employer IP and conflict policies. That means clear scheduling, written async progress, and no claim of unlimited bandwidth.",
        "Based in Visakhapatnam, India; remote-first for US, EU, and India teams. Commercial entry points: fractional AI consultant and AI consultant for startups landers.",
      ],
    },
  ],
  relatedLinks: [
    {
      href: "/fractional-ai-consultant/",
      label: "Fractional AI consultant lander",
    },
    {
      href: "/ai-consultant-for-startups/",
      label: "AI consultant for startups",
    },
    {
      href: "/ai-automation-consultant/",
      label: "AI automation consultant",
    },
    {
      href: "/services/ai-llm-application-development/",
      label: "LLM application development service",
    },
    {
      href: "/services/rag-consultant-india/",
      label: "RAG consultant service",
    },
    {
      href: "/case-studies/technical-blog/",
      label: "Case study: production RAG on the technical blog",
    },
    { href: "/contact/#intent=ai-llm", label: "Contact / discovery" },
  ],
} as const;
