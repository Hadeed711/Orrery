# ORRERY — Program Phases & Delivery Plan

> **How this file works.** This is the working agreement between you (product owner) and the AI development team.
> We execute one phase at a time. At the end of every phase there is a **GATE**: work stops, you review the
> deliverables, and you explicitly say **"continue"** (or ask for revisions) before the next phase begins.
> Status values: `⬜ Not started` · `🟨 In progress` · `✅ Done — awaiting gate approval` · `🟩 Approved`

---

## Status Board

| # | Phase | Type | Status |
|---|-------|------|--------|
| 1 | Blueprint & Gap Analysis | Documentation | 🟩 Approved (2026-07-12) |
| 2 | Product Definition & Design | Documentation + Prototype | 🟩 Approved (2026-07-12) |
| 3 | Walking Skeleton | Code | 🟩 Done & committed (2026-07-12, `405b632`) |
| 4 | MVP Build A — Sky Calendar & Launch Center | Code | 🟩 Substantially complete (2026-07-13) — full events engine, local eclipse circumstances, location picker, ICS, countdowns, night mode. Neon DB live. Remaining: month grid, sky strip, light theme |
| 5 | MVP Build B — Knowledge Pages & News Engine | Code | 🟩 Done (2026-07-13) — ~300-entity catalog (Messier 110, missions, telescopes, rockets), news engine w/ entity tagging, FTS search, sitemap/JSON-LD |
| 6 | Beta Launch Readiness | Code + Ops | 🟩 Approved (2026-07-19, owner feedback kicked off Phase 7) — auth, follows + personal feed, T-15 launch push alerts, weekly digest, PWA, rate limiting, health/uptime/backup ops. Deploy + keys pending from owner |
| 7 | Community, Directories, NASA media & UI v2 | Code | ✅ Done — awaiting gate approval (2026-07-20) — community (profiles/posts/people-follows/DMs), favorites rework, deep factsheets + NASA galleries, APOD, companies & apps directories, Mission Builder, NASA-style dark UI + mobile nav |
| 8+ | Post-MVP Tracks (chosen by results) | Code | ⬜ Not started |

---

## Phase 1 — Blueprint & Gap Analysis  ✅

**Goal.** Turn the original architecture sketch ([orrery-architecture.md](orrery-architecture.md)) into a complete,
senior-team-grade master plan: everything the space ecosystem already offers, everything the v1 document missed,
an honest viability assessment, and a full list of external requirements (APIs, accounts, keys).

**Deliverables**
- `PHASES.md` — this file.
- `ORRERY-MASTER-PLAN.md` — the upgraded v2 blueprint. Supersedes v1 as the master document
  (v1 stays as the deep-dive systems appendix; nothing from it is thrown away).
- `REQUIREMENTS.md` — every account, API key, service, and decision needed, mapped to the phase where it's needed.

**Exit criteria.** You have read the master plan, agree (or have corrected) the MVP wedge choice, and say "continue".

**Needed from you.** Nothing except review. No API keys are required in this phase.

---

## Phase 2 — Product Definition & Design

**Goal.** Define exactly what we build first, precisely enough that coding is mechanical.

**Deliverables**
- PRD (product requirements doc) for each MVP-wedge module: Sky Calendar, Launch Center, Tonight's Sky,
  Entity Pages (objects / missions / telescopes), News Feed.
- Information architecture: full sitemap + URL scheme (SEO-driven from day one).
- Core data model: entity/relationship schema (the "graph" as Postgres tables), with an ERD.
- Draft API surface (internal now, public later).
- Visual direction + clickable HTML prototype of the 5 key screens (delivered as a private artifact you can open in a browser).
- Tech-stack decision records (framework, DB, hosting, libraries — with reasoning, so future-us knows why).
- Name check: quick search on "Orrery" collisions (apps, trademarks, domains) with alternatives if needed.

**Exit criteria.** You approve the PRDs, the prototype look, and the stack.

**Delivered (2026-07-12):** [docs/PRD-MVP.md](docs/PRD-MVP.md) · [docs/INFORMATION-ARCHITECTURE.md](docs/INFORMATION-ARCHITECTURE.md) · [docs/DATA-MODEL.md](docs/DATA-MODEL.md) · [docs/API-SURFACE.md](docs/API-SURFACE.md) · [docs/TECH-STACK.md](docs/TECH-STACK.md) · [docs/NAME-CHECK.md](docs/NAME-CHECK.md) · clickable prototype (artifact link in chat).

**Needed from you.** Feedback on prototype; confirm product name and primary language(s); confirm hosting budget ($0 free-tier start vs ~$20–40/mo).

**Estimated effort.** 2–3 working sessions.

---

## Phase 3 — Walking Skeleton

**Goal.** Thinnest possible end-to-end slice of the real system, deployed. Proves the architecture; everything after is filling in.

**Deliverables**
- Git repo + monorepo scaffold (Next.js + TypeScript app, background-jobs worker, shared schema package).
- Postgres schema v1 (entities, relationships, events, launches, sources) with migrations.
- Connector #1: Launch Library 2 sync (upcoming launches → DB, idempotent, scheduled).
- Connector #2: Ephemeris engine (astronomy-engine lib: planet positions, rise/set, moon phase — computed locally, no API needed).
- One real page per type rendering live data: a launch page, an event page, one object page (e.g., Saturn).
- CI (lint, typecheck, tests) + deploy pipeline to a preview URL.

**Exit criteria.** You can open a URL and see tomorrow's real launches and tonight's real sky data.

**Delivered (2026-07-12, commit `405b632`).** Runs locally with zero accounts: `npm install && npm run db:migrate && npm run seed && npm run sync:ll2 && npm run dev` → http://localhost:3000. Embedded PGlite DB (swap to Neon via `DATABASE_URL`); 30 real launches synced; 61 computed events; golden tests pin the 2026-08-12 and 2027-08-02 eclipses; CI workflow ready for GitHub. Verified end-to-end (all pages + API + error paths). GitHub/Vercel/Neon accounts still pending from owner for public preview deploy.

**Needed from you.** GitHub account (repo), choice of host (Vercel free tier recommended), free Neon/Supabase Postgres OR local-only for now. Command permissions for `npm`/`node`/`git` (I'll request the specific ones then).

**Estimated effort.** 2–4 working sessions.

---

## Phase 4 — MVP Build A: Sky Calendar & Launch Center

**Goal.** The daily-habit product. This is the wedge that earns users.

**Deliverables**
- Computed astronomical events: moon phases, eclipses, meteor showers (peak + ZHR), planet conjunctions/oppositions,
  supermoons, visibility windows — computed from ephemerides, location-aware.
- Launch Center: list + detail + live countdown + status changes (scrub/hold), historical results.
- "Tonight's Sky" page: what's visible right now from the user's location (geolocation + manual).
- ICS calendar export + per-user subscribable calendar feed URL.
- Location handling (geolocate, search city, remember choice), timezone correctness (the hard part).
- First-pass design system: dark-first UI + red "night vision" mode.

**Exit criteria.** The calendar is genuinely useful to you personally for a week.

**Increment 1 delivered (2026-07-12, commit `dd10304`):** subscribable `/calendar.ics` feed (self-updating on launch slips), live T− countdowns, red night-vision mode with no-flash persistence.

**Increment 2 delivered (2026-07-13):** full computed-events engine — meteor-shower peaks with **moon-interference scoring**, planetary oppositions (with magnitude), Mercury/Venus greatest elongations, equinoxes/solstices, planet-planet conjunctions (observability-filtered, solar-glare excluded); **per-location solar-eclipse circumstances** on event pages (contact times, obscuration, Sun altitude — golden-tested against Madrid/Reykjavik/Lahore for 2026-08-12); cookie-based **location picker** (26 cities + GPS) localizing every page. 165 events + 30 launches live in **Neon Postgres** (production DB). 21 tests green.

**Remaining for Phase 4 (minor):** month-grid view, sky-strip visualization, light theme, gazetteer city search (places table), meteor-shower radiant/best-window per location.

**Needed from you.** Test it from your real location; feedback.

**Estimated effort.** 3–5 working sessions.

---

## Phase 5 — MVP Build B: Knowledge Pages & News Engine

**Goal.** The reference layer + the content flywheel. This is where SEO growth starts.

**Deliverables**
- Seeded catalog: planets, major moons, Messier 110, bright NGC objects, ~200 famous missions, ~50 telescopes/observatories,
  launch vehicles — each with a permanent entity page linked into the graph tables.
- News ingestion: ~50 quality RSS sources → dedupe → tag with graph entities → topic pages ("all news about JWST").
- Site search (Postgres full-text first).
- SEO plumbing: schema.org structured data (Event, NewsArticle, Product later), sitemaps, OpenGraph images.

**Exit criteria.** Entity pages + news feed live on the preview site; Google Search Console connected and indexing.

**Delivered (2026-07-13).**
- **Seeded catalog (~300 entities):** all major moons + dwarf planets + notable small bodies; the **complete Messier 110** + 16 bright NGC showpieces (each with magnitude/constellation/distance claims); ~75 famous missions (Voyager → Artemis, edges to agencies and target worlds); 35 telescopes/observatories (JWST → Rubin → LIGO); 21 launch vehicles (slugs aligned with LL2 so connector data merges, not duplicates); 16 agencies/operators. Browse pages: `/objects`, `/missions`, `/telescopes`, `/rockets`.
- **News engine:** `articles` + `article_entities` + `entity_aliases` tables; SNAPI connector (keyless, aggregates the ~50 quality outlets — per-outlet rows in the sources registry) with URL canonicalization, normalized-title dedupe, and the deterministic **alias-dict@v0 tagger** (word-boundary, case-sensitive acronyms, title-vs-excerpt salience). `/news` feed, entity-page "In the news" module, homepage teaser, `/api/v0/jobs/news` + Vercel cron at :15/:45.
- **Search v0:** Postgres FTS (GIN, `websearch_to_tsquery`) over entities + articles with kind boosting and alias fallback (`M31`, `Webb`, `HST`) at `/search`.
- **SEO plumbing:** DB-driven `sitemap.xml`, `robots.txt`, schema.org Event + BreadcrumbList JSON-LD, per-page metadata/canonicals/OpenGraph, `SITE_URL`-aware metadataBase.
- 34 tests green (tagger, dedupe, catalog integrity + all prior golden tests). Direct per-outlet RSS ingestion deliberately deferred — the schema already stores per-outlet sources, so it's additive.

**Needed from you.** Deploy to Vercel (repo import still pending from Phase 4 — add `SITE_URL` env var too), then connect Google Search Console. Domain (~$10/yr) when ready to go public. NASA API key not needed yet (planned for APOD/media enrichment later).

**Estimated effort.** 3–5 working sessions.

---

## Phase 6 — Beta Launch Readiness

**Goal.** Real users can sign up, follow things, and get alerts. Production-hardened.

**Deliverables**
- Auth (email + Google OAuth), user profiles.
- Follow any entity → personalized feed + weekly email digest.
- Alerts: web push for launches/events (e.g., "ISS pass in 10 min" comes in a later track — start with launch/event alerts).
- PWA (installable, basic offline for calendar/tonight pages).
- Analytics (privacy-friendly), error monitoring, uptime check, backups, rate limiting.
- Production deploy on the real domain + soft-launch checklist (share to 2–3 communities).

**Exit criteria.** Strangers are using it. We watch metrics for 2–4 weeks and pick Phase 7 tracks from data.

**Delivered (2026-07-14).**
- **Auth (better-auth + Drizzle):** email+password works with zero keys; Google OAuth activates automatically when `GOOGLE_CLIENT_ID/SECRET` exist. `/signin`, `/account` (profile, follows, notifications, sign-out, delete-account with cascade), session menu in the header. CSRF origin checks + better-auth's built-in auth rate limiter.
- **Follows + personal feed:** ☆ Follow on every entity page → `/feed` (upcoming launches/events connected to follows through graph edges + news mentioning follows). Tables: `follows`, better-auth `user/session/account/verification`.
- **Launch push alerts:** self-generated VAPID keys (free, no account), `/api/v0/push` subscribe/unsubscribe, service-worker push + click handling, `/api/v0/jobs/alerts` sends T-15 alerts to followers of anything connected to the launch; `push_sent` ledger = exactly-once; dead subscriptions auto-pruned (410).
- **Weekly digest:** `/api/v0/jobs/digest` (Mondays via GH Actions) — week-ahead launches/events + news per user via Resend REST (no SDK); skips cleanly without `RESEND_API_KEY`; `digest_sent` ledger = once per ISO week; empty weeks send nothing.
- **PWA:** manifest + generated icons (incl. maskable), service worker (network-first pages w/ offline fallback, cache-first static assets, never caches API/auth/personal pages), installable.
- **Hardening:** middleware rate limiting (30/min auth, 120/min API per IP), security headers (nosniff, frame-deny, HSTS, referrer/permissions policy), `/api/health` DB probe.
- **Ops (all free):** GitHub Actions as the real scheduler — sync every 30 min, alerts+uptime every 15 min (health-check failure emails the owner via workflow failure), digest Mondays, weekly `pg_dump` backup to 90-day artifacts. `vercel.json` crons reduced to Hobby-legal daily backstops. PostHog analytics env-gated (`NEXT_PUBLIC_POSTHOG_KEY`), incl. client error capture.
- 41 tests green (7 new: alert windows/dedupe keys, ISO week keys, digest composer + HTML escaping). Verified end-to-end: sign-up → session → follow Saturn → personalized feed → push subscribe → jobs → rate limiter 429s → account deletion cascade.
- `.env.example` documents every variable; everything degrades gracefully when a key is absent.

**Remaining for the owner (see REQUIREMENTS.md Phase 6):** Vercel repo import + env vars, GitHub secrets (`JOB_SECRET`, `DATABASE_URL`) + variable (`SITE_URL`), then optional keys: Google OAuth, Resend, PostHog, domain.

**Needed from you.** Email-sending account (Resend free tier), domain DNS access, decision on soft-launch venues.

**Estimated effort.** 3–4 working sessions.

---

## Phase 7 — Community, Directories, NASA media & UI v2  ✅ (awaiting gate)

**Goal (owner-directed at the Phase 6 gate).** Make Orrery feel like a place, not a database:
people connect and post; objects carry every fact; the UI reads NASA-grade, not AI-template.

**Delivered (2026-07-20).**
- **Community.** `profiles` (username + display name + bio + location + website + emoji avatar —
  auto-provisioned on first touch, editable in the `/account` profile builder), `posts` (+likes),
  `user_follows` (people), `dm_messages` (direct messages, read receipts, unread badges in the nav).
  Pages: `/community` (feed + composer), `/u/<username>` (public profile: posts, favorites,
  follower counts, Follow/Message), `/messages` (+ per-person threads, 6-s polling). All routes
  session-authenticated (better-auth), input-validated (length caps, control-char stripping,
  username regex + reserved list), rate-limited per endpoint in middleware, plain-text stored and
  React-escaped on render. Migration `0003` is purely additive.
- **Follow → Favorite rework.** People are *followed*; sky objects are *favorited* (★). The old
  `follows` table and `/api/v0/follows` endpoint are untouched — favorites still power the feed,
  T-15 alerts and the digest. `/feed` now also shows posts from people you follow.
- **Rich object pages.** Hand-curated deep factsheets (physical data, orbit, atmosphere,
  exploration history, "did you know") for ~20 major bodies (Sun → Pluto, ocean moons), rendered
  as sectioned cards on `/object/*`; all structured `attrs` surfaced; NASA archive image gallery
  (keyless NASA Image & Video Library, cached 24 h) on every entity page.
- **NASA APIs.** `NASA_API_KEY` wired: `/apod` (Astronomy Picture of the Day, hourly cache) +
  gallery search proxy `/api/v0/nasa/images` (rate-limited, CDN-cached).
- **Directories.** `/companies` — ~65 space agencies & companies across every spacefaring nation
  (NASA→SUPARCO, SpaceX→Gilmour) with type/country filters + search; `/apps` — ~50 hand-picked
  space apps & websites in 9 categories. Static editorial data, SEO-crawlable.
- **Mission Builder (signature feature).** `/mission-builder`: name a satellite → deterministic
  generated mission patch (SVG, downloadable), pick destination/instruments/power → real-physics
  readout (transfer Δv, rocket-equation wet mass, launch-vehicle match, RTG warnings past 3 AU) +
  "your name in the NASA archive" image search. Design persists in localStorage.
- **UI v2.** NASA-inspired dark-only theme (deep-space blues, NASA-red accents, serif display),
  animated CSS starfield + subtle motion (reduced-motion aware), squared quiet tags, sticky
  blurred header, Explore dropdown + hamburger mobile nav, footer sitemap, unread-DM badge.
  Night-vision/dark-mode toggle removed (site is dark by design). New pages in sitemap; private
  pages (feed/account/messages) robots-disallowed.

**Needed from you.** Try it: sign up two accounts, post, follow, DM; build a satellite; review the
new theme on your phone. Then say "continue" (Phase 8 tracks) or ask for revisions.

---

## Phase 8+ — Post-MVP Tracks (data decides the order)

Each is a self-contained track with its own mini-phase-plan when we get there:

- **T1. Gear catalog + affiliate commerce** (first revenue; needs affiliate program approvals).
- **T2. Satellite pass alerts** (ISS/Starlink per-location push — strong retention feature).
- **T3. Community uploads + plate solving** (UGC; needs moderation plan; the cold-start problem lives here).
- **T4. Public API + MCP server** (developers + AI assistants as distribution).
- **T5. Space weather & aurora alerts.**
- **T6. AI Copilot "Ask Orrery"** (RAG over our own graph; needs Anthropic API key).
- **T7. Mobile app** (React Native/Expo; needs Apple $99/yr + Google $25 accounts).
- **T8. Learn / education content.**
- **T9. B2B industry intelligence.**

---

## Working Rules

1. **One phase at a time.** No phase starts without your explicit "continue" at the gate.
2. **Nothing is throwaway.** Every phase builds on the same data model (the graph), per the master plan.
3. **Scope changes are welcome at gates** — mid-phase only for blockers.
4. **Docs stay current.** If reality diverges from a doc, the doc gets updated in the same phase.
5. **You own all accounts/keys.** I will tell you exactly what to create and where to paste it (see `REQUIREMENTS.md`); secrets go in `.env` files that are never committed.
