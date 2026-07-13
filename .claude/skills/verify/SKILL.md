---
name: verify
description: Build, run, and drive the Orrery web app to verify changes end-to-end (dev server + page/API captures)
---

# Verifying Orrery changes

## Build & data pipeline (run before first launch or after schema changes)
```powershell
npm install --no-audit --no-fund
npx drizzle-kit generate     # only if packages/core/src/db/schema.ts changed
npm run db:migrate           # applies ./drizzle to PGlite (.data/pglite) or $env:DATABASE_URL
npm run seed                 # idempotent: objects + computed events + ~300-entity catalog (slow vs Neon: ~2000 round-trips)
npm run sync:ll2             # real launches from Launch Library 2 (needs internet, ~15 req/hr free)
npm run sync:news            # space news via SNAPI (keyless) — run AFTER seed (tagger needs the alias dictionary)
```

## Launch
```powershell
npm run dev   # in background; serves http://localhost:3000 (ready in ~30-60 s first time)
```
Poll `http://localhost:3000/api/v0/sky/tonight` until 200 (it needs no DB but compiles the core chain).

## Surfaces to drive
- `/` `/calendar` `/launches` `/status` — DB-backed pages
- `/news` — deduped, entity-tagged feed; `/search?q=jwst` — Postgres FTS (needs real Postgres FTS — works on PGlite too)
- `/objects` `/missions` `/telescopes` `/rockets` — catalog browse (grouped by attrs.class)
- `/event/2026-08-12-total-solar-eclipse` — golden computed event (+ schema.org Event JSON-LD)
- `/object/saturn` `/object/m31` `/telescope/jwst` `/mission/voyager-1` — entity template incl. live sky + "In the news" modules
- `/launch/<slug from /launches HTML>` — graph links + NET history
- `/sitemap.xml` `/robots.txt` — SEO (sitemap is a DB query over all entities)
- `GET /api/v0/sky/tonight?lat=&lon=` — computed JSON
- `POST /api/v0/jobs/ll2` or `/api/v0/jobs/news` with header `x-job-secret: dev` — in-process connector runs
- **Phase 6 surfaces:** `/signin` `/account` `/feed` (auth-gated) · `GET /api/health` · `/manifest.webmanifest` `/sw.js` `/icons/icon-192.png` (PWA) · `POST /api/v0/jobs/alerts|digest` (x-job-secret; digest skips w/o RESEND_API_KEY) · `POST/DELETE /api/v0/push` and `POST /api/v0/follows` (session cookie required)
- Auth flow via curl: `curl -c jar.txt -X POST /api/auth/sign-up/email -H "content-type: application/json" -d '{"email":…,"password":…,"name":…}'` then reuse `-b jar.txt`; entity id for follow tests: `npx tsx scripts/print-entity-id.ts object saturn`

## Gotchas learned the hard way
- **Don't run seed/sync CLIs while the dev server is up** — PGlite is single-process; stop the server, run pipeline, restart (or use the jobs API route, which runs in the server process).
- React SSR splits JSX text nodes with `<!-- -->` — match content on partial strings, not full sentences.
- astronomy-engine is UMD/CJS: import as namespace with `.default ??` fallback (see packages/core/src/ephemeris/sky.ts). Named ESM imports break under tsx.
- Relative imports in packages/ are **extensionless** (no `.js` suffix) — Next's webpack can't resolve `.js`-suffixed TS imports.
- PowerShell 5.1 `Set-Content` mangles UTF-8 without BOM — don't bulk-edit source with it; use per-file tools.
- better-auth POSTs (except sign-up/sign-in) require an `Origin: http://localhost:3000` header from curl, else `MISSING_OR_NULL_ORIGIN`.
- The middleware rate limiter (30/min on /api/auth, 120/min on /api) will 429 your own curl loops — wait ~60 s for the window to reset.
- Root `.env` now holds VAPID keys + DATABASE_URL; `NEXT_PUBLIC_*` vars are read server-side and passed as props (root .env is invisible to Next's build-time inlining).
