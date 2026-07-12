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
npm run seed                 # idempotent: objects + computed events
npm run sync:ll2             # real launches from Launch Library 2 (needs internet, ~15 req/hr free)
```

## Launch
```powershell
npm run dev   # in background; serves http://localhost:3000 (ready in ~30-60 s first time)
```
Poll `http://localhost:3000/api/v0/sky/tonight` until 200 (it needs no DB but compiles the core chain).

## Surfaces to drive
- `/` `/calendar` `/launches` `/status` — DB-backed pages
- `/event/2026-08-12-total-solar-eclipse` — golden computed event
- `/object/saturn` — entity template incl. live "Tonight from" module (rise/set computed per request)
- `/launch/<slug from /launches HTML>` — graph links + NET history
- `GET /api/v0/sky/tonight?lat=&lon=` — computed JSON
- `POST /api/v0/jobs/ll2` with header `x-job-secret: dev` — in-process connector run

## Gotchas learned the hard way
- **Don't run seed/sync CLIs while the dev server is up** — PGlite is single-process; stop the server, run pipeline, restart (or use the jobs API route, which runs in the server process).
- React SSR splits JSX text nodes with `<!-- -->` — match content on partial strings, not full sentences.
- astronomy-engine is UMD/CJS: import as namespace with `.default ??` fallback (see packages/core/src/ephemeris/sky.ts). Named ESM imports break under tsx.
- Relative imports in packages/ are **extensionless** (no `.js` suffix) — Next's webpack can't resolve `.js`-suffixed TS imports.
- PowerShell 5.1 `Set-Content` mangles UTF-8 without BOM — don't bulk-edit source with it; use per-file tools.
