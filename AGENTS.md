# Cloudflare Workers

STOP. Your knowledge of Cloudflare Workers APIs and limits may be outdated. Always retrieve current documentation before any Workers, KV, R2, D1, Durable Objects, Queues, Vectorize, AI, or Agents SDK task.

## Docs

- https://developers.cloudflare.com/workers/
- MCP: `https://docs.mcp.cloudflare.com/mcp`

For all limits and quotas, retrieve from the product's `/platform/limits/` page. eg. `/workers/platform/limits`

## Commands

| Command | Purpose |
|---------|---------|
| `npx wrangler dev` | Local development |
| `npx wrangler deploy` | Deploy to Cloudflare |
| `npx wrangler types` | Generate TypeScript types |

Run `wrangler types` after changing bindings in wrangler.jsonc.

## Node.js Compatibility

https://developers.cloudflare.com/workers/runtime-apis/nodejs/

## Errors

- **Error 1102** (CPU/Memory exceeded): Retrieve limits from `/workers/platform/limits/`
- **All errors**: https://developers.cloudflare.com/workers/observability/errors/

## Product Docs

Retrieve API references and limits from:
`/kv/` · `/r2/` · `/d1/` · `/durable-objects/` · `/queues/` · `/vectorize/` · `/workers-ai/` · `/agents/`

---

# Project: Compliance-aware Serverless Setup

Interactive walkthrough learning guide for Cloudflare Solutions Engineers on building compliance-aware serverless architectures.

## Architecture

- **Cloudflare Workers** with **Static Assets** (`ASSETS` binding)
- **Modular HTML**: Each step is a separate partial in `public/steps/step-N.html`, loaded dynamically by `public/app.js`
- **Single-page shell**: `public/index.html` contains the fixed nav bar, slide-out menu, and an empty `<main>` that `app.js` populates
- **Worker entry**: `src/index.ts` serves static assets and exposes `/api/*` routes
- **Config**: `wrangler.jsonc` (JSONC format) with `not_found_handling: "single-page-application"`

## Steps (8 total, indices 0-7)

| Step | File | Title |
|------|------|-------|
| 0 | `public/steps/step-0.html` | Overview |
| 1 | `public/steps/step-1.html` | Cloudflare Developer Platform |
| 2 | `public/steps/step-2.html` | Business Continuity (Resiliency) |
| 3 | `public/steps/step-3.html` | Data Security |
| 4 | `public/steps/step-4.html` | Jurisdictional Restrictions |
| 5 | `public/steps/step-5.html` | Data Localization Suite |
| 6 | `public/steps/step-6.html` | Summary |
| 7 | `public/steps/step-7.html` | Knowledge Check (optional quiz) |

`TOTAL_STEPS` in `app.js` is `8` (indices 0-7). `MAIN_STEPS` is `7` (0-6 = main walkthrough). Progress label shows "X / 6" and caps at step 6. Step 7 is an optional quiz accessed via a CTA button on the Summary page.

## Key Files

| File | Purpose |
|------|---------|
| `public/index.html` | Thin shell: nav bar, menu panel, empty `<main id="stepsContainer">`, loads `app.js` |
| `public/app.js` | Step loader, navigation, accordion, tabs, jurisdiction selector, copy, quiz, keyboard nav, session persistence |
| `public/styles.css` | Full CSS design system — Cloudflare branding (#f6821f orange, #1a1a2e dark) |
| `src/index.ts` | Worker entry — serves static assets via `ASSETS` binding, handles `/api/*` |
| `wrangler.jsonc` | Workers config (JSONC), static assets, observability |
| `worker-configuration.d.ts` | Generated types (`Env` interface with `ASSETS: Fetcher`) |

## Design Conventions

- **Minimalistic, clean, professional** — Cloudflare-like branding
- **Palette**: Orange `#f6821f`, dark `#1a1a2e`, light grays
- **Target viewport**: MacBook Pro (~1440x900) but do NOT squeeze content
- **Fixed header** (top nav bar) and **fixed footer** (Back/Next navigation) — only content scrolls between them
- **Responsive**: Breakpoints at 860px, 600px, 480px
- **All external links** must use `target="_blank" rel="noopener"`
- **Documentation links** should be integrated inline within content (not in separate link sections)
- **No floating navigation dots** — replaced by the slide-out menu (top-right hamburger)

## Content Guidelines

- Step 0 overview cards describe **industry expectations** (what regulations demand), not Cloudflare capabilities
- Key compliance facts: AES-256 encryption (R2/D1/DO), jurisdictions (EU/FedRAMP) set at creation time only, DLS = GKM + Regional Services + CMB
- Step 1 "Region: Earth" section has an "as of March 2026" timestamp label

## Testing

- Do NOT auto-test with chrome-devtools unless explicitly asked
- `npm run dev` starts local wrangler dev server
- `npm test` runs Vitest tests
