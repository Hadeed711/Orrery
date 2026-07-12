# Orrery MVP — Product Requirements (Phase 2 deliverable)

> Covers the five wedge modules from [ORRERY-MASTER-PLAN.md](../ORRERY-MASTER-PLAN.md) §7:
> **Sky Calendar · Launch Center · Tonight's Sky · Entity Pages · News Feed**, plus the shared
> requirements every module inherits. Phase-6 items (accounts, follows, alerts, digest) are marked `[P6]`.
> Requirement IDs are stable — code, tests, and commits reference them.

---

## 0. Shared Requirements (all modules)

### 0.1 Location (`LOC`)
- **LOC-1** Every visitor has an *effective location*: (lat, lon, timezone, place label). Resolution order: user-picked place → browser geolocation (only on explicit tap, never on load) → IP-derived city → default (Greenwich, with a visible "Set location" nudge).
- **LOC-2** Location picker: search any city (offline gazetteer of ~25k cities: name, country, lat/lon, tz), remembered in `localStorage` (no account needed).
- **LOC-3** Precision policy: we store city-level coordinates by default; exact GPS is used transiently for computation and kept only client-side. (Master Plan §6 privacy row.)
- **LOC-4** Every time shown to a user is in the *effective location's* timezone, labeled (e.g. "21:47 PKT"). Internal storage/APIs are UTC only.

### 0.2 Time & correctness (`TIME`)
- **TIME-1** All event computations from `astronomy-engine`; accuracy target ±1 minute for rise/set/phase times vs JPL Horizons; CI golden tests per [Master Plan §8.6].
- **TIME-2** DST transitions, half-hour and 45-min offsets (Karachi, Kathmandu, Chatham) covered by test matrix.
- **TIME-3** Any time more than ±5 s uncertain is displayed without seconds. No fake precision.

### 0.3 Design system (`DS`)
- **DS-1** Dark theme is the default and primary art direction; a light theme ships too (system-follow).
- **DS-2** **Red night-vision mode**: one tap in the header, pure-red-on-black palette, persists per device, applies to every page. No white flashes during navigation (view transitions respect it).
- **DS-3** Responsive 320 px → 4K; touch-first hit targets (≥44 px); the calendar and tonight pages must be excellent on phones (field use).
- **DS-4** WCAG 2.1 AA contrast in all three themes; full keyboard navigation; skip links; `prefers-reduced-motion` respected.

### 0.4 Performance (`PERF`)
- **PERF-1** Entity/event/launch pages are static or ISR — TTFB from CDN cache; Core Web Vitals "good" on mid-range Android over 4G.
- **PERF-2** JS budget for content pages ≤ 120 kB gzipped; the interactive sky components lazy-load.
- **PERF-3** Launch-day surge posture: list/detail pages must be servable entirely from cache with countdowns computed client-side from a static `net` timestamp.

### 0.5 SEO (`SEO`)
- **SEO-1** URL scheme per [INFORMATION-ARCHITECTURE.md](INFORMATION-ARCHITECTURE.md); URLs never change once published (redirects if ever needed).
- **SEO-2** schema.org JSON-LD per template (Event, NewsArticle, BreadcrumbList, FAQPage where genuine).
- **SEO-3** Auto-generated OG/social image per entity/event (name, date, key visual).
- **SEO-4** Thin-content guardrail: entity pages render `noindex` until data-completeness score ≥ threshold (defined per kind in DATA-MODEL).
- **SEO-5** Sharded sitemaps by template + lastmod; robots.txt; canonical tags; `llms.txt`.

### 0.6 Observability & analytics (`OBS`)
- **OBS-1** Named product events from day 1: `location_set`, `event_saved_ics`, `calendar_subscribed`, `launch_alert_optin [P6]`, `follow_entity [P6]`, `night_mode_on`, `search_performed`, `outbound_stream_click`.
- **OBS-2** Error tracking with release tagging; connector freshness dashboard (per-source `last_success_at` visible on an internal `/status` page).

---

## 1. Module PRD — Unified Sky Calendar (D1)

**Goal.** The single trustworthy answer to "what's happening in the sky / in space, when, and can I see it from here." The daily-habit anchor.
**Primary personas.** P1 sky-curious, P6 spaceflight enthusiast; P4 observers benefit immediately.

### User stories
- As a casual, I search "meteor shower August" and land on a page telling me the exact peak time *for my city*, whether it's worth it (moon!), and one tap adds it to my phone calendar.
- As an enthusiast, I subscribe once (ICS URL) and every launch and eclipse appears in Google Calendar and stays up to date when launches slip.
- As an observer, I filter to only occultations and conjunctions brighter than mag 2.

### Functional requirements
- **CAL-1** Event types at MVP: moon phases (new/first-quarter/full/last-quarter), solar & lunar eclipses (with per-location circumstances: partial %, contact times, path proximity), meteor-shower activity windows + peaks (with moon-interference score), planetary conjunctions/appulses (≤ 2.5° pairs involving naked-eye planets/Moon), oppositions & greatest elongations, supermoon/perigee-syzygy, equinoxes/solstices, plus **launches** (from Launch Center data) and **mission milestones** (curated).
- **CAL-2** Horizon: computed events published from 2000 (archive) through 2035 (forward); launches as announced.
- **CAL-3** Views: month grid (desktop), agenda list (default on mobile), and a filter bar (type chips, "visible from my location" toggle, magnitude threshold).
- **CAL-4** Every event has a permanent detail page (URL scheme: IA doc) with: what/when (local + UTC), visibility map or yes/no for effective location, how-to-watch guidance, related graph entities (bodies involved, missions), and next/previous occurrence links.
- **CAL-5** "Visible from my location" is computed (altitude of relevant body at event time, sun altitude, daylight check) — never hand-tagged.
- **CAL-6** One-tap **ICS download** per event; **subscribable ICS feed** (tokenless global feed at MVP; per-user filtered feeds `[P6]`).
- **CAL-7** Countdown chips on upcoming headline events (client-side, from static timestamps).
- **CAL-8** `[P6]` Alert rules: push/email X minutes/hours before event, weather-conditional option.

### Non-functional
- **CAL-NF-1** Event computation runs as a build/连 batch job writing to `events` table (DATA-MODEL); pages are static.
- **CAL-NF-2** An event correction (e.g., recomputed timing) must propagate to page + ICS feed within 1 hour.

### Out of scope (MVP)
Star-party/club submissions (D2), conferences, tides, ISS passes (T2 track), astrology anything.

### Acceptance criteria
- The 2026-08-12 total solar eclipse page shows correct local circumstances for Reykjavík, Madrid, and (correctly) "not visible" for Lahore — validated against NASA/Espenak tables.
- Perseids 2026 page shows peak night, hourly-rate expectation, moon phase that night, and best viewing window for the effective location.
- Subscribing to the ICS feed in Google Calendar shows the next 12 months of headline events within 5 minutes.

**Success metrics.** ICS subscriptions; event-page organic entrances; save-to-calendar rate; % sessions with location set.

---

## 2. Module PRD — Launch Center (B4-lite)

**Goal.** Every orbital launch worldwide: upcoming with live-ish status, past with results — linked into vehicles, pads, agencies, missions.
**Primary personas.** P6; P1 during Starship/Artemis spikes.

### Functional requirements
- **LNCH-1** Sync upcoming + recent launches from Launch Library 2 (poll: 30 min baseline; 5 min inside T-24h; 60 s inside T-1h for the active launch — within free-tier budget via conditional requests & caching; supporter tier if needed).
- **LNCH-2** Launch list page: chronological cards — mission name, vehicle, provider, pad, NET time (local + countdown), status pill (Go / TBD / Hold / Success / Failure), webcast link when live.
- **LNCH-3** Launch detail page: mission description, payloads, vehicle block/booster info where known, pad + map, weather-odds field when available, embedded official webcast (YouTube embed only — Master Plan §8.4), post-launch outcome, and **graph links**: vehicle page (its full flight history), pad page, agency/company page, related news.
- **LNCH-4** Slip handling: NET changes update the page, the countdown, the calendar entry, and the ICS feed; a visible "history of changes" list on the detail page (trust feature).
- **LNCH-5** Vehicle & pad entity pages aggregate launches automatically (success streaks, flight counts) — computed from the graph, not hand-written.
- **LNCH-6** Past launches browsable/filterable (provider, vehicle, year, outcome) back to 2000 via LL2 backfill; deeper history is an editorial/import task later.
- **LNCH-7** `[P6]` Launch alerts: push at T-24h/T-1h/T-10m + scrub notifications, per followed provider or per launch.

### Acceptance criteria
- Next 10 real launches visible with correct local times; a deliberately simulated NET slip updates list, detail, and ICS within one sync cycle.
- Falcon 9 vehicle page shows aggregated, correct flight statistics derived only from stored launches.

**Success metrics.** Return-visit rate around launch days; countdown-page concurrent peaks; alert opt-ins `[P6]`.

---

## 3. Module PRD — Tonight's Sky (B1-lite)

**Goal.** "I'm outside / about to be — what can I see right now, from here?" The zero-knowledge entry point that converts P1 into repeat users.

### Functional requirements
- **TNGT-1** `/sky/tonight` (and `/sky/tonight/{city}` for SEO): tonight's timeline for the effective location — sunset/sunrise, civil/astronomical darkness window, moonrise/set + phase + illumination %, planets visible (with rise/set, direction, altitude "now", magnitude), tonight's highlights (from Calendar), and 2–3 "easy wins" (Moon features, brightest planet, one seasonal showpiece like Orion Nebula in winter).
- **TNGT-2** A simple **sky strip** (not a full planetarium at MVP): horizon compass showing where planets/Moon currently sit (azimuth/altitude), rendered client-side from astronomy-engine; updates live.
- **TNGT-3** Each object listed links to its Entity Page with a "tonight from your location" module (shared component).
- **TNGT-4** Degrades gracefully with no location: shows global events + prompts for location; never blank.
- **TNGT-5** Works offline once visited (PWA cache + on-device ephemeris) — field-usable with red mode.
- **TNGT-6** Full interactive planetarium view is **out of scope** for MVP (post-MVP; Stellarium-Web-class is a project of its own). The strip must not pretend to be one.

### Acceptance criteria
- For Lahore tonight, moon/planet rise-set times match Horizons within ±1 min; direction labels correct.
- Airplane-mode revisit renders fully with current computed positions.

**Success metrics.** D7 return rate on this page; location-set conversion; tonight→entity click-through.

---

## 4. Module PRD — Entity Pages (A1/A2/A3-seeded)

**Goal.** Permanent, data-rich reference pages — the visible face of the graph and the SEO surface. MVP is **editorially seeded, read-only** (no UGC, no wiki edits yet).

### Seed catalog (MVP)
- **Objects:** Sun, 8 planets, Pluto + notable dwarfs, ~30 major moons, Messier 1–110, ~40 famous NGC/IC showpieces, ~20 named stars, current bright comets (curated).
- **Missions:** ~200 (all crewed programs' flagships, all active probes/rovers/observatories, historic landmarks).
- **Telescopes/observatories:** ~50 (JWST, Hubble, Chandra, Gaia, Euclid, Rubin, VLT, Keck, ALMA, FAST, Arecibo†…).
- **Vehicles/pads/agencies/companies:** auto-created from LL2 sync + editorial polish on the top ~40.
- Everything enters via the graph schema (`entities`/`edges`/`claims`) with sources — no freehand pages.

### Functional requirements
- **ENT-1** Object page: hero facts panel (kind-specific: distance, size, magnitude range, type), **live "tonight from your location"** module (visibility now, rise/set, where to look, needed equipment class), imagery (licensed, attributed), discovery/history section, related entities (moons/parent/missions-that-visited via edges), latest tagged news, next related calendar events ("Saturn's next opposition").
- **ENT-2** Mission page: status, timeline of milestones, agency/vehicle/launch links, instruments, media, tagged news; live counters where cheap (Voyager distance via stored state + dead-reckoning formula).
- **ENT-3** Telescope/observatory page: specs, instruments, status, how-to-access-public-data links, notable images, tagged news.
- **ENT-4** Every fact displayed carries an inspectable source (hover/tap "ⓘ" → source + retrieved date) — provenance is user-visible from day 1 (trust moat).
- **ENT-5** Related-entity traversal is graph-driven (edges), never hand-curated lists.
- **ENT-6** Completeness scoring gates indexing (SEO-4) and shows an internal "needs work" queue.
- **ENT-7** `[P6]` Follow button on every entity (feeds digest/alerts).

### Acceptance criteria
- Saturn page: correct live visibility for effective location; ≥ 12 sourced facts; auto-listed moons via edges; Cassini appears under missions; next opposition date present; JSON-LD validates.
- Changing one claim in DB (e.g., moon count) updates the page on next revalidation without code changes.

**Success metrics.** Organic entrances per indexed page; tonight-module engagement; internal-link click-through (graph value proof).

---

## 5. Module PRD — News Feed (C1-lite)

**Goal.** One clean, entity-tagged stream of credible space news — the freshness layer that makes the reference layer alive. MVP: aggregation + tagging + topic pages; ML clustering/summaries come later.

### Functional requirements
- **NEWS-1** Ingest ~50 curated sources at MVP (agency newsrooms, company blogs, the quality outlets from Master Plan §5.10, arXiv astro-ph new listings) via RSS/Atom + Spaceflight News API; per-source poll interval; store title, link, excerpt, image ref (hotlink policy per §9.2), published time, source credibility tier.
- **NEWS-2** Exact + near-duplicate suppression (URL canonicalization + title similarity at MVP).
- **NEWS-3** **Entity tagging v0**: dictionary/alias matcher against graph entities (aliases table incl. "the red planet" → Mars-class entries), with salience score; ambiguous matches → review queue (internal page).
- **NEWS-4** Surfaces: `/news` firehose with source filters; **per-entity news tabs** ("all JWST news" = edge query — the graph payoff); topic hubs for the ~10 hottest ongoing stories (Artemis, Starship, JWST, Mars fleet…), curated at MVP.
- **NEWS-5** Outbound-first ethics: headline + excerpt + prominent source attribution linking out; we are a router, not a re-publisher.
- **NEWS-6** `[P6]` Follow-driven personalized feed + daily-brief email assembly (C4 uses this pipeline).
- **NEWS-7** Later flags (not MVP): ML story clustering, 3-level AI summaries, trending ranking, credibility scoring beyond the static tier.

### Acceptance criteria
- A JWST press release appears in `/news` and on the JWST entity page within one poll cycle, tagged automatically.
- No duplicate story cards when 5 outlets cover the same release (canonical grouping by shared external link is acceptable at MVP).

**Success metrics.** News CTR to entities (graph engagement), source diversity per session, return frequency.

---

## 6. Cross-module MVP definition of done
1. All CAL/LNCH/TNGT/ENT/NEWS acceptance criteria pass, including golden-data validations.
2. Lighthouse ≥ 90 (performance/SEO/accessibility) on the five template types, mobile emulation.
3. Night mode audit: zero non-red pixels above 5% brightness on the three field pages (tonight, calendar, event detail).
4. `/status` freshness page green across all connectors for 7 consecutive days.
5. The owner uses the product for his own real observing/launch-watching for one week and files ≥ 10 issues — and they're triaged.
