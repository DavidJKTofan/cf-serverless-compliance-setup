# Compliance-aware Serverless Setup

An interactive walkthrough learning guide on building compliance-aware serverless architectures using the Cloudflare Developer Platform.

Built with [Cloudflare Workers](https://developers.cloudflare.com/workers/) and [Static Assets](https://developers.cloudflare.com/workers/static-assets/).

## What It Covers

The guide walks through several steps covering compliance and regulatory requirements mapped to Cloudflare's serverless infrastructure:

| Step | Topic | Description |
|------|-------|-------------|
| 0 | **Overview** | Industry expectations from NIS2, PCI DSS, CRA, and CISA — what regulations demand |
| 1 | **Developer Platform** | Region: Earth architecture, platform primitives (Compute, Storage, AI, Media, Network) |
| 2 | **Business Continuity** | Anycast resilience, D1 Time Travel, Workflows & Queues, error handling patterns |
| 3 | **Data Security** | Encryption at rest (AES-256 for R2/D1/DO, SSE-C, client-side), encryption in transit (TLS, PQC, body buffering), access & secrets (RBAC, Secrets Store, mTLS), and privacy (Privacy Proxy, Privacy Gateway) |
| 4 | **Jurisdictional Restrictions** | EU and FedRAMP jurisdiction controls, creation-time-only enforcement |
| 5 | **Data Localization Suite** | Geo Key Manager, Regional Services, Customer Metadata Boundary |
| 6 | **Summary** | Recap of all pillars, certifications, SE talking points, key resources |
| 7 | **Knowledge Check** | Optional 5-question interactive quiz |

## Architecture

```
public/
├── index.html           # Thin shell: nav bar, menu, empty <main>
├── app.js               # Step loader, navigation, interactions
├── styles.css           # Full CSS design system
└── steps/
    ├── step-0.html      # Each step is a standalone HTML partial
    ├── step-1.html
    ├── step-2.html
    ├── step-3.html
    ├── step-4.html
    ├── step-5.html
    ├── step-6.html
    └── step-7.html      # Optional quiz (Knowledge Check)

src/
└── index.ts             # Worker entry — ASSETS binding + /api/* routes
```

- **Modular HTML partials**: Each step is a separate file (`public/steps/step-N.html`) loaded dynamically by `app.js` at runtime. This makes content easy to edit, debug, and extend.
- **Single-page application shell**: `index.html` contains the fixed header, slide-out menu, and empty `<main>` container. Steps are fetched via `fetch()` and injected as DOM sections.
- **Worker + Static Assets**: The Worker serves static files via the `ASSETS` binding and handles `/api/*` routes for metadata (health check, step listing).
- **Session persistence**: Current step and visited steps are saved to `sessionStorage` so progress survives page reloads.

## Getting Started

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/DavidJKTofan/cf-serverless-compliance-setup)

```sh
npm install
npm run dev       # Local development at http://localhost:8787
npm run deploy    # Deploy to Cloudflare
```

## Design

- **Cloudflare branding**: Orange `#f6821f`, dark `#1a1a2e`, clean typography
- **Fixed header + footer**: Top navigation bar and bottom Back/Next buttons stay anchored — only content scrolls
- **Responsive**: Breakpoints at 860px, 600px, and 480px
- **Interactive elements**: Accordions, tabs, jurisdiction selector, code blocks with copy, and a scored quiz
- **Keyboard navigation**: Arrow keys to move between steps, Escape to close the menu

* * * *

## Disclaimer

This project is for **educational and demonstration purposes only**. The information presented may be outdated, incomplete, or inaccurate. The authors assume no responsibility for any errors, omissions, or consequences arising from the use of this material. Always refer to the [official Cloudflare documentation](https://developers.cloudflare.com/) for the most current and authoritative information.
