# Permanent project rules

- Sanity is authoritative for published product copy and prices; PostgreSQL is authoritative for stock, carts, orders, and analytics.
- Re-fetch current product data and stock after discovery and immediately before checkout.
- Never embed prices, stock, identifiers, analytics, customer data, timestamps, or editor notes.
- Keep all secret-bearing integrations server-only. Validate every mutation with Zod.
- The assistant can act only through allow-listed server tools and cannot confirm checkout without the customer.
- Optional analytics consent gates transcript storage and sentiment processing. Redact before persistence or model use.
- Never infer sensitive traits or make individual decisions using sentiment.
- Analytics-generated content is always a Sanity draft requiring human review.
- Preserve strict TypeScript, keyboard access, clear focus states, and reduced-motion support.
- Run `pnpm validate` before considering a change complete.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
