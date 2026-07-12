# Orrery — Tech Stack Decision Records (Phase 2 deliverable)

> Format: decision · why · alternatives rejected · revisit-when. Optimized for one owner + AI dev team,
> $0-tier operations, and a clean growth path to Master Plan v1-Part-3 scale. "Boring wins" (§8.1).

| ADR | Decision | Why | Rejected | Revisit when |
|---|---|---|---|---|
| **001 Language** | TypeScript everywhere (app, workers, shared schema) | One language across UI/server/connectors; zod-typed graph payloads; best AI-assisted-dev ergonomics | Python backend split (two runtimes to operate); Rust (velocity) | Heavy numeric batch work → Python/Rust sidecar |
| **002 Framework** | Next.js 15 App Router | ISR/SSG/edge caching are literally our SEO+spike architecture (§8.3, PERF-1/3); RSC keeps JS budget down; one deploy | Astro (superb static, weaker app/api story for P6+), SvelteKit (ecosystem), Remix (ISR story) | Framework churn only at a major-version forced migration |
| **003 Jobs/connectors** | Vercel Cron → route handlers `/api/v0/jobs/*` with idempotency keys + per-source locks in Postgres; pg-boss on a worker VM when cadence/volume outgrows it | Zero extra infra at MVP; connectors already idempotent by design (v1 §3.2) | Kafka/Redis queues now (§8.1 table); GitHub Actions cron (opaque, slow cold data) | Sub-minute cadence needs (T-1h launch polling may move to a tiny always-on worker) |
| **004 Database** | Postgres on **Neon** free tier + **Drizzle ORM** | Serverless PG with branching (per-PR preview DBs); Drizzle = SQL-first migrations matching DATA-MODEL.md; pgvector/PostGIS available later | Supabase (bundles auth/storage we'd rather choose independently; fine fallback), Prisma (heavier runtime, less SQL control), MongoDB (the graph is relational) | Sustained load → dedicated PG (same SQL, no code change) |
| **005 Ephemeris** | `astronomy-engine` (MIT) shared client+server; `satellite.js` (SGP4) at T2; server falls back to JPL Horizons API for spacecraft/small bodies; golden tests gate all of it (§8.6) | ±1 arcmin, ~100 kB, runs offline on-device (TNGT-5) — the compute-don't-scrape strategy embodied | WASM SPICE now (heavy), calling Horizons per request (latency, courtesy limits) | Sub-arcmin needs (occultation timing, B7) → SPICE sidecar |
| **006 UI** | Tailwind CSS v4 + owned shadcn-style components + CSS-variable theme tokens (dark / light / **red-night** as first-class themes) | DS-1/2 red mode must be a token swap, not an afterthought; owned components = no dependency treadmill | MUI/Mantine (theming fights night mode), CSS-in-JS runtimes (perf) | — |
| **007 Search** | Postgres FTS (tsvector + trigram) | One database; MVP corpus is small; DATA-MODEL indexes already defined | Meilisearch/Typesense now (another service to run) | Facets/typo-tolerance UX pain or >250k docs → Meilisearch |
| **008 Maps** | MapLibre GL + OSM raster/vector tiles + our GeoJSON (eclipse paths, pads) | Free, no key, ODbL-compliant | Mapbox (key + billing), Leaflet (fine, but GL handles paths/3D better) | Traffic → tile-hosting decision (Protomaps self-host) |
| **009 Hosting** | Vercel (app) + Neon (DB) + Cloudflare (DNS, later R2) — all free tiers | $0 to Phase 6 (§8.8); preview URLs per PR for gate reviews; painless ISR | Single VPS (cheap but ops burden now), Railway/Fly (fine; fewer free ISR/CDN wins) | Vercel bill > ~$50/mo → move workers/render to VPS behind Cloudflare, keep architecture |
| **010 Auth `[P6]`** | Auth.js v5 (email magic link + Google OIDC), session in PG | Boring, self-owned, no per-MAU pricing | Clerk/Auth0 (per-MAU cost), Supabase Auth (couples us to Supabase) | Enterprise/SSO needs (H1) |
| **011 Testing** | Vitest (unit + golden ephemeris fixtures vs Horizons CSVs committed to repo) · Playwright smoke on the 10 templates · zod runtime validation at every connector boundary | §8.6 correctness posture; golden files make regressions loud | Jest (slower), no-tests-move-fast (correctness is the brand) | — |
| **012 Repo** | pnpm workspaces monorepo: `apps/web` · `packages/core` (ephemeris, schema, zod types) · `packages/connectors` · `docs/` | Shared types between web/workers; single CI; matches §8.1 modular monolith | Polyrepo (overhead), Turborepo/Nx now (add when build times hurt) | Build times or team growth |
| **013 Analytics/errors `[P6]`** | PostHog (product events, OBS-1) + Sentry (errors) free tiers | Named-event plan already in PRD; both self-hostable later (privacy posture) | GA4 (privacy + quality), self-hosted-now (ops) | Cookie/consent review at EU traffic scale |
| **014 Email `[P6]`** | Resend + React Email templates | Free tier fits beta; templates in-repo | Postmark (great, smaller free tier), SES (deliverability babysitting) | Volume pricing at H1 |
| **015 i18n** | next-intl scaffolded now, EN-only shipped (IA §5) | Retrofitting string extraction is the #1 i18n regret; costs ~nothing now | Full localization now (premature) | D2 decision + traction data pick language #2 |

## Deviations discovered during Phase 3 (docs stay current — Working Rule 4)

- **ADR-012 amended:** npm workspaces instead of pnpm — zero extra tooling on the owner's machine; swap to pnpm only when install/build times hurt.
- **Convention:** relative imports inside `packages/` are **extensionless** (`./schema`, not `./schema.js`) — Next's webpack cannot resolve `.js`-suffixed imports back to TS sources; `moduleResolution: bundler` everywhere makes this consistent across tsx, Vitest, and Next.
- **Gotcha (ADR-005):** astronomy-engine is UMD/CJS; import via namespace + `.default ??` fallback (see `packages/core/src/ephemeris/sky.ts`) — plain named ESM imports fail at runtime under Node/tsx.
- **Local dev DB:** embedded PGlite (`.data/pglite`) when `DATABASE_URL` is unset — single-process only; never run CLI pipeline scripts while the dev server is running (use `POST /api/v0/jobs/*` instead).

**Explicitly deferred (decided-not-now, per Master Plan §8.1):** Kubernetes, Kafka, Neo4j/AGE, OpenSearch, ClickHouse, Redis, GraphQL federation, microservices, mobile app toolchain, self-hosted ML. Each has a named trigger in §8.1's table; adopting one early requires a gate decision.
