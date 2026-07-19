# Orrery

> Every object, every mission, every telescope, every event — one graph of everything space.

A space knowledge-graph platform. Every feature (sky calendar, launch tracking, tonight's sky,
entity pages, news) is a view over one canonical graph of entities and relationships.
On top of the graph: a community (profiles, posts, follows, direct messages — people are
followed, objects are *favorited*), world directories of space agencies/companies and the best
space apps & sites, NASA imagery (APOD + archive galleries on entity pages), and the
Mission Builder — design a satellite, get a generated mission patch and an engineering readout.

**Project documents** (source of truth):
[ORRERY-MASTER-PLAN.md](ORRERY-MASTER-PLAN.md) · [PHASES.md](PHASES.md) · [REQUIREMENTS.md](REQUIREMENTS.md) · [docs/](docs/)

## Quick start (zero accounts needed)

```bash
npm install
npm run db:migrate     # embedded PGlite database in ./.data — no Postgres install
npm run seed           # planets + computed events (moon phases, eclipses to +3 years)
npm run sync:ll2       # real upcoming launches from Launch Library 2
npm run dev            # → http://localhost:3000
```

Set `DATABASE_URL` in `.env` to use real Postgres (Neon) instead — no code changes.

## Layout

| Path | What |
|---|---|
| `apps/web` | Next.js app — pages are views over the graph |
| `packages/core` | Graph schema (Drizzle), DB client, **local ephemeris engine** (astronomy-engine), seed |
| `packages/connectors` | Upstream syncs (Launch Library 2; more per docs/DATA-MODEL.md) |
| `drizzle/` | Generated SQL migrations (committed) |

## Commands

`npm run dev` · `npm test` (golden ephemeris tests incl. the 2026-08-12 eclipse) · `npm run typecheck` ·
`npm run db:generate` (after schema edits) · `npm run db:migrate` · `npm run seed` · `npm run sync:ll2`

## Principles (see master plan §8)

- **Compute, don't scrape** — all astronomical events are calculated from ephemerides locally.
- **The graph is a schema, not a database purchase** — entities/edges/claims in plain Postgres.
- **Idempotent connectors** — every sync is safe to re-run; NET slips are history, not overwrites.
- **UTC in storage, local at the edge** — every displayed time is timezone-labeled.

Data credits: Launch Library 2 by [The Space Devs](https://thespacedevs.com) ·
ephemerides via [astronomy-engine](https://github.com/cosinekitty/astronomy) (MIT).
