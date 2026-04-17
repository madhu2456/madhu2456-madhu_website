<\!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<\!-- END:nextjs-agent-rules -->

## Critical Rules for AI Agents

### Imports
- Motion animations: `import { motion, AnimatePresence } from "motion/react"` — NEVER `"framer-motion"`
- Icons: `@tabler/icons-react` — e.g. `import { IconSend2 } from "@tabler/icons-react"`
- Utilities: `import { cn } from "@/lib/utils"` for className merging

### Data
- All portfolio content comes from `getPortfolioData()` in `src/lib/portfolio-data.ts`
- Do NOT create hardcoded content — always read from portfolio data
- Sanity is completely removed. There are no Sanity schemas, clients, or GROQ queries.

### SEO
- JSON-LD schemas live in `src/lib/jsonld.ts` — add new schema builders there
- `SeoStructuredData.tsx` renders the unified `@graph` — update it when adding new schemas
- `layout.tsx` generates dynamic metadata — update there for page-level meta tags

### Styling
- Tailwind CSS v4 — uses `@import "tailwindcss"` not `@tailwind` directives
- Colour tokens are CSS OKLch variables — avoid hardcoded hex values
- Dark mode via `dark:` Tailwind variants; theme set by `next-themes` class strategy

### Testing
- Run `pnpm build` to verify TypeScript compilation before committing
- Biome is the linter — run `pnpm lint` to check
