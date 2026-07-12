# ORRERY — Master Plan v2
### "Every object, every mission, every telescope, every event — one graph of everything space."

| | |
|---|---|
| **Version** | 2.0 — Full upgrade of [orrery-architecture.md](orrery-architecture.md) (v1) |
| **Status** | Phase 1 deliverable — awaiting owner review (see [PHASES.md](PHASES.md)) |
| **Date** | 2026-07-12 |
| **Supersedes** | v1 as the master document. v1 remains valid as the **deep systems architecture appendix** (its Part 3 topology is the scale-state target and is not repeated here). |
| **Companion docs** | [PHASES.md](PHASES.md) — delivery plan · [REQUIREMENTS.md](REQUIREMENTS.md) — accounts, keys, decisions |

**What v2 adds that v1 was missing:**
personas · the complete competitive/reference landscape (apps, sites, tools, data, media — "everything that exists") · ~14 new product modules · cross-cutting requirements (night mode, offline, i18n, accessibility, authenticity) · a "boring-start" architecture mapping so the platform is buildable before it is fundable · SEO/growth architecture · licensing landmines · go-to-market · an honest viability assessment ("what scope is actually usable") · KPIs · risk register · revised build order · full external-requirements list.

---

## 1. Executive Summary

**The idea.** Orrery is not a space content site. It is a **Space Knowledge Graph** — one canonical, machine-readable database of every entity in the space domain (objects, missions, spacecraft, telescopes, rockets, people, companies, events, images, papers, products) and every relationship between them — with every user-facing feature (calendar, news, sky view, gear guides, community, AI assistant) built as a *view over that graph*. Anyone can aggregate news; nobody has the linked graph. That remains the correct core thesis, and v2 keeps it.

**What the research shows.** The space/astronomy ecosystem is enormous but **radically fragmented**: launch tracking, sky maps, pass predictions, observing weather, gear reviews, astrophoto community, calendars, and news are each served by separate single-purpose products — many run by one person (Heavens-Above, In-The-Sky.org, CelesTrak), several recently dead (CalSky 2020; Orion & Meade retail collapse 2024), and none linked to each other. There is no "Google Maps of space." That fragmentation is the opportunity — and also the warning: no one has consolidated it partly because consumer astronomy alone monetizes modestly. The money is in commerce, B2B data, and education layered on top of a consumer audience — exactly as v1's revenue architecture says.

**The verdict on usable scope** (full analysis in §11): the complete v1 vision is a **venture-scale, 3–5 year, $30M+, 60–120 person build** — not directly buildable by a small team. But inside it sits a **genuinely usable, near-zero-cost wedge** — the Unified Sky Calendar + Launch Center + Tonight's Sky + seeded knowledge pages + entity-tagged news — that one owner plus an AI dev team can ship in months, that real people will use daily, and that is architected so *nothing is thrown away* if the venture path opens. Build the wedge on the graph schema from day one; buy the venture infrastructure never-earlier-than-needed.

**Timing.** The window is unusually good: a total solar eclipse crosses Greenland/Iceland/Spain on **2026-08-12** (next month) and the century's longest totality crosses North Africa/Middle East on **2027-08-02**; Starship test flights and Artemis II generate recurring global attention spikes; the ZWO Seestar-class smart telescopes ($350–550) are pulling a huge wave of first-time observers into the hobby with no unified home; Vera Rubin Observatory has begun flooding astronomy with new transients; and AI assistants need exactly the kind of grounded, machine-readable space data Orrery would own.

---

## 2. The Core Idea, Sharpened

### 2.1 One graph, three loops

The graph thesis from v1 stands. v2 sharpens *why users come back* into three engagement loops, each mapping to graph views:

| Loop | Cadence | Product surface | Persona pull |
|---|---|---|---|
| **Follow the sky** | Daily | Calendar, Tonight's Sky, alerts, daily brief | Everyone |
| **Practice the hobby** | Weekly | Session planner, conditions, gear, community, challenges | Observers & astrophotographers |
| **Follow the industry** | Daily/weekly | Launches, missions, news, intelligence | Enthusiasts & professionals |

### 2.2 The moat stack (in the order it is earned)

1. **Computed-first data** — Orrery calculates its ephemerides and event calendar from first principles (correctness + zero licensing exposure). Available from day 1.
2. **The graph** — entity linking makes every piece of content permanently reusable. A schema from day 1; a database product later.
3. **SEO surface area** — millions of legitimate, data-rich entity/event pages nobody else can generate. Compounds from month 3.
4. **Community & UGC** — plate-solved photos, observation logs, reviews wired into the graph. Earned in year 1–2; hardest, most defensible.
5. **Commerce & B2B data** — the gear compatibility DB and the API. Monetization depth, year 1+.

### 2.3 What v1 got right (affirmed, unchanged)

- Graph-first, not content-first. ✔
- Compute the astronomical calendar; don't scrape it. ✔
- Connector framework with per-source freshness SLOs as the operational heart. ✔
- Entity resolution as the single most important ML investment. ✔
- Read-heavy, edge-cacheable design for 50–100× spike days. ✔
- Phased build on one graph; nothing throwaway. ✔
- Diversified revenue: consumer + commerce + API/B2B + education. ✔

v1's Part 3 (services topology, ingestion, pipelines, infra, team shape) remains the **scale-state blueprint**. §8 of this document maps it down to a buildable starting point.

---

## 3. Users & Personas (new in v2)

v1 designed systems; it never named users. Eight personas, in rough order of audience size:

| # | Persona | Trigger | Today they use | What Orrery gives them |
|---|---|---|---|---|
| P1 | **Sky-curious casual** | "Eclipse next month?" "What's that bright star?" | Google, TimeandDate, news sites | One trustworthy answer + calendar + reminded at the right moment |
| P2 | **First-telescope buyer** (incl. gift buyers) | "$400, which telescope? Amazon is a minefield" | Reddit r/telescopes, YouTube reviews, scattered blogs | Structured gear DB, honest guides, "what will I actually see" simulation |
| P3 | **Smart-telescope newcomer** (Seestar/Dwarf wave) | Just unboxed; "what do I point it at tonight?" | Vendor app, Facebook groups | Tonight's targets for *their* device, auto-import + plate-solve + share |
| P4 | **Visual observer** | Weekend sessions, star parties, lists | SkySafari, Telescopius, club forums | Planner + conditions + challenges (Messier marathon, Lunar 100) + logbook |
| P5 | **Astrophotographer** | Conditions-obsessed, gear-heavy | Astrospheric, AstroBin, N.I.N.A., Cloudy Nights | Unified conditions + planning + gallery with attribution + gear compatibility |
| P6 | **Spaceflight enthusiast** | Launches, Starship, ISS, missions | Space Launch Now, NASASpaceflight, r/spacex, X | One launch center: countdowns, streams, history, alerts, mission trackers |
| P7 | **Educator / student / parent** | Classroom unit, science fair, curious kid | NASA sites, YouTube, textbooks | Curriculum-aligned explainers, kid mode, class activity packs |
| P8 | **Professional** (analyst, journalist, founder, researcher) | Needs structured, sourced industry data fast | Seradata/BryceTech ($$$), Gunter's, spreadsheets | Mid-priced intelligence + clean API over the whole graph |

**MVP wedge targets P1, P6, then P2** — the personas served with computed/public data and no community cold-start. P3–P5 arrive with the hobby layer; P7–P8 with monetization depth.

---

## 4. Market Context & Timing (new in v2)

- **Fragmentation + key-person risk everywhere.** Heavens-Above, In-The-Sky.org, CelesTrak, Clear Sky Chart, Gunter's Space Page — pillars of the ecosystem — are essentially one-person operations, aging, and acquisition/succession-fragile. CalSky's 2020 shutdown left a still-unfilled hole for computed local event detail.
- **Retail shock.** Orion Telescopes & Binoculars and Meade collapsed in 2024, removing a major US retailer and brand pair; the beginner-buyer journey is more confusing than ever. A trusted, structured buying layer has an open lane.
- **The smart-telescope wave.** Sub-$550 devices (ZWO Seestar S50/S30, Dwarf 3) and premium ones (Unistellar, Vaonis, Celestron Origin) are the fastest-growing segment and onboard tens of thousands of newcomers per year who need targets, weather, community, and upgrades — currently scattered across vendor apps and Facebook groups.
- **Event supercycle.** 2026-08-12 total eclipse (Iceland/Spain), 2027-08-02 "eclipse of the century" (Luxor duration ~6m20s), recurring Starship/Artemis spikes, aurora activity near solar-max tail, Rubin Observatory transient alerts starting to surface newsworthy objects continuously.
- **AI-era distribution shift.** Answer engines are eating generic content SEO. Structured, computed, citable data (exactly what Orrery is) is what AI assistants need to license/ground on — a threat to content sites, an asset for a data graph. Strategy in §10.5.
- **Monetization reality check.** Global amateur-astronomy gear is a low-single-digit-billion-$ market; consumer astronomy subs alone are a lifestyle-business ceiling. Space *industry* data/analytics, education licensing, commerce, and event tourism are where the valuation depth is — confirming v1 Part 5.

---

## 5. Competitive & Reference Landscape (the big v1 gap)

Everything popular/normal in the space, category by category: who leads, what to learn, what gap Orrery exploits. (Full index with one-liners in **Appendix A**.)

### 5.1 Planetarium & sky-map apps
**Leaders:** Stellarium (desktop/web/mobile; open source), SkySafari 7, Star Walk 2 / Sky Tonight, Sky Guide, SkyView, Night Sky, Celestia, SpaceEngine, NASA's Eyes, Solar System Scope.
**Lessons:** AR "point at sky" onboarding is table stakes on mobile; Stellarium's data quality is the reference bar.
**Gap:** all are isolated simulators — no news, no gear context, no community, no "why tonight matters." Orrery's sky view is a *graph view*, where every object tapped links to everything known about it.

### 5.2 Launch trackers & spaceflight apps
**Leaders:** Space Launch Now, Next Spaceflight, RocketLaunch.Live, Supercluster, Spaceflight Now schedule; The Space Devs' **Launch Library 2** is the data layer beneath most of them.
**Gap:** mostly thin LL2 wrappers; none link launches → vehicle history → pad → payloads → mission pages → "visible from your location?" Orrery does, because it's a graph.

### 5.3 Satellite tracking & passes
**Leaders:** Heavens-Above, N2YO, ISS Detector, NASA Spot the Station, Look4Sat, "See a Satellite Tonight"; data: CelesTrak, Space-Track; sim: FlightClub.io.
**Gap:** dated UX; alerts not weather-aware; no "walk outside now" push combined with sky conditions. (Licensing note §9: use CelesTrak, respect Space-Track ToS.)

### 5.4 Sky calendars & almanacs
**Leaders:** TimeandDate astronomy section, In-The-Sky.org, TheSkyLive, EarthSky Tonight, S&T Sky at a Glance, NASA eclipse pages (Espenak), GreatAmericanEclipse, Xavier Jubier's maps; **CalSky (dead 2020)**.
**Gap:** none combine computed events + human events (launches, star parties) + user location + weather + alerts + ICS. **This is the wedge.** TimeandDate is generic and shallow on astronomy; In-The-Sky is one person deep but 2005-era UX.

### 5.5 Observing conditions & astro-weather
**Leaders:** Clear Sky Chart (N. America, legendary, ASCII-era), Astrospheric (best-in-class NA), Clear Outside, meteoblue seeing, 7Timer!, Good To Stargaze, Windy.
**Gap:** nothing global, modern, and integrated with target planning ("clouds clear at 1am — your target list shifts to these"). New module **B5**.

### 5.6 Light pollution & dark sites
**Leaders:** LightPollutionMap.info, Dark Site Finder, DarkSky International certified places.
**Gap:** static maps; no community reviews, safety/access info, live conditions, or "best spot within 50 km tonight" (v1 D2 already envisioned this — landscape confirms nobody does it).

### 5.7 Session planning & field tools
**Leaders:** Telescopius (target planning + FOV framing), astronomy.tools (calculators), SkyTools, AstroPlanner, SkySafari lists, PhotoPills (sun/moon/MW planning for photographers).
**Gap:** planning divorced from *your gear database*, *live conditions*, and *what others captured with identical setups*. New module **B6**.

### 5.8 Astrophotography community & software
**Community:** AstroBin (the hub, subscription), r/astrophotography, Cloudy Nights forums, Stargazers Lounge, Instagram/X.
**Software (integration targets, not competitors):** N.I.N.A., PixInsight, Siril, DeepSkyStacker, GraXpert, SharpCap, FireCapture, AutoStakkert!, PHD2, ASIAIR, StellarMate/INDI.
**Gap:** AstroBin is expert-niche with dated growth; nobody auto-links photos into a knowledge graph (v1's plate-solve signature feature ✔) or addresses the exploding **AI-fake astrophoto authenticity problem** (v2 answer: C2PA + capture-metadata verification, §6 cross-cutting).

### 5.9 Gear retail, reviews & used market
**Retail:** High Point Scientific, Agena Astro, B&H, First Light Optics (UK), Teleskop-Express (DE), Bintel (AU), Amazon. **Used:** Cloudy Nights Classifieds, Astromart, UK Astronomy Buy & Sell, eBay, Facebook Marketplace.
**Reviews:** TelescopicWatch, Love the Night Sky, AstroBackyard, Nebula Photos, Ed Ting, Cuiv the Lazy Geek, S&T/BBC Sky at Night tests, r/telescopes wiki.
**Gap:** no structured cross-retailer spec/compatibility/price database — the **"PCPartPicker of telescopes"** does not exist; no trusted global used marketplace with escrow (v1 F2 ✔). This is the commerce engine and it is wide open.

### 5.10 News & media
**News:** Space.com, Universe Today, SpaceNews, Payload, Ars Technica (Berger), NASASpaceflight.com, Spaceflight Now, EarthSky, Sky & Telescope, Astronomy Magazine, BBC Sky at Night, Phys.org, The Planetary Society, APOD.
**Podcasts/YouTube:** Planetary Radio, Astronomy Cast, Off-Nominal; Everyday Astronaut, Scott Manley, Marcus House, NSF live, Fraser Cain, Dr. Becky, PBS Space Time, Astrum, Anton Petrov.
**Gap:** aggregation exists (Google News, Reddit, SNAPI apps), but nobody does entity-linked stories + 3-level summaries + follow-anything feeds (v1 C1–C2 ✔). Media outlets are also potential *API customers*.

### 5.11 Encyclopedic & structured reference
**Leaders:** Wikipedia/Wikidata, Gunter's Space Page, Jonathan McDowell's GCAT/JSR, NASA NSSDCA, ESA eoPortal, spacefacts.de, Encyclopedia Astronautica (stale).
**Gap:** none are simultaneously complete, current, structured, and machine-readable; Wikidata's space coverage is uneven. "Wikidata for space with an editorial spine" (v1 §3.3 ✔) has no incumbent.

### 5.12 Citizen science, clubs & education
**Citizen science:** Zooniverse (Galaxy Zoo, Planet Hunters), Backyard Worlds, AAVSO, IOTA occultations, GLOBE at Night, NASA Exoplanet Watch, Unistellar's network, Aurorasaurus, Radio JOVE.
**Clubs/edu:** NASA/ASP Night Sky Network, Astronomical League observing programs, library telescope programs, planetariums; Khan Academy, OpenStax Astronomy (free textbook), Coursera/edX, Crash Course Astronomy, Brilliant.
**Gap:** no unified discovery layer, no credit trail into a graph identity, no structured "zero → capable observer" pathway tied to your actual sky and gear (v1 E3/E4 ✔).

### 5.13 Remote telescopes & astro-tourism
**Remote:** iTelescope, Slooh, Telescope Live, Las Cumbres (education), MicroObservatory (free), plus hosting farms.
**Tourism:** TravelQuest-style eclipse tours, aurora operators, dark-sky lodges, GetYourGuide/Viator stargazing experiences.
**Gap:** both fragmented, no aggregator/marketplace; eclipse 2026/2027 gives tourism a concrete revenue spike window (v1 E5/D3 ✔).

### 5.14 B2B intelligence, jobs & data
**Intel:** BryceTech, Seradata (Slingshot), Quilty Space, Novaspace/Euroconsult, Payload Research, NewSpace Index (free), Jonathan's Space Report.
**Jobs:** SpaceTalent, SpaceCrew, Space Individuals, LinkedIn.
**Gap:** a mid-market tier between free blogs and $10k+ subscriptions is empty; jobs boards are not tied to a company/mission graph. New module **F4**.

### 5.15 AI assistants
ChatGPT/Claude/Gemini/Perplexity answer space questions generically — and hallucinate ephemerides, visibility times, and gear compatibility. **Gap:** a copilot that routes math to a real sky engine and cites graph entities (v1 F3 ✔). v2 adds: expose the graph *to* AI assistants via an **MCP server** — being the source AIs cite is distribution, not just defense (§10.5).

### 5.16 Summary: the consolidation thesis
Every category above is (a) served by a fragmented, aging, or single-purpose tool, (b) unlinked to its neighbors, and (c) individually too small to attract a serious platform builder. The value is in the **union**, which only works if everything shares one graph — v1's core bet, confirmed by the landscape.

---

## 6. Complete Product Scope v2

v1's six domains and twenty modules **all carry forward unchanged** (summarized one line each for self-containment). Modules marked **[NEW]** are v2 additions discovered in the landscape analysis.

### Domain A — Knowledge & Catalogs
- **A1. Celestial Object Catalog** [v1] — every star (Gaia, tiered), planet, moon, exoplanet, small body, DSO, with permanent pages: physical data, live ephemeris, imagery, papers, observations, news.
- **A2. Missions Database** [v1] — every mission ever, structured; live trackers (Voyager distance, rover maps, ISS orbit).
- **A3. Telescope Encyclopedia** [v1] — space telescopes, ground observatories, and the **consumer gear catalog** (specs, prices, compatibility rules, reviews, "what can I see with this" simulation) — the commerce engine.
- **A4. Launch Vehicles & Propulsion Registry** [v1] — every rocket, engine, pad; flight history and reliability stats.
- **A5. People & Organizations** [v1] — astronauts with flight logs, scientists, agencies, companies — Crunchbase of space.
- **A6. History & Archive** [v1] — timeline from Galileo, digitized documents, Apollo journals, "on this day."
- **A7. Human Spaceflight Live** [NEW] — who is in space right now, station trackers (ISS, Tiangong, commercial), EVA & docking schedule, crew pages tied to A5. Cheap to build, high viral value.
- **A8. Planetary Defense Watch** [NEW] — NEO close approaches (JPL CNEOS/Sentry + ESA), risk-list explainers, "how big / how close / how worried" plain-language framing. Recurring news spikes.
- **A9. Space Media Library** [NEW] — cataloged & graph-linked documentaries, films, series, podcasts, YouTube channels, books (Turn Left at Orion → textbooks), games/sims (KSP, SpaceEngine, Universe Sandbox…), planetarium shows. Watch/read/play guides per interest; affiliate-ready.

### Domain B — Live Sky & Operations
- **B1. Live Solar System & Sky Engine** [v1] — 3D orrery on JPL-class ephemerides with time-machine scrubbing.
- **B2. Satellite Tracking** [v1] — TLE/GP-based live tracking + location pass predictions with push alerts.
- **B3. Space Weather** [v1] — solar activity, flare/CME alerts, Kp, aurora forecasts by geography.
- **B4. Launch Operations Center** [v1] — every launch with countdown, weather odds, streams, milestone-indexed replays.
- **B5. Observing Conditions Engine** [NEW] — hyperlocal cloud/seeing/transparency/darkness scoring, hour-by-hour "go/no-go tonight," weather-conditional alerting ("only wake me if it clears"). Astrospheric-class, but global and integrated. Daily-habit feature for P4/P5; premium tier anchor.
- **B6. Session Planner & Framing** [NEW] — "plan tonight": target lists filtered by your location, gear (from A3 profile), moon phase, conditions; FOV/framing simulator (Telescopius-class); observing lists & challenges; session log that feeds E1. The bridge between reference layer and hobby layer.
- **B7. Specialty Observing Hubs** [NEW] — Solar (activity imagery, safe-viewing guidance, eclipse tooling), Lunar (phase, libration, Lunar 100, terminator explorer), Variable stars (AAVSO integration), Occultations (IOTA events by location), Meteor observing (shower radiant maps, counting protocol). Deep-hobby retention + partnership surface.

### Domain C — News & Intelligence
- **C1. Aggregated News Engine** [v1] — 1,000+ sources, dedupe, story clustering, entity linking, 3-level AI summaries.
- **C2. Personalized Feed & Digest** [v1] — follow any graph entity; daily/weekly digests.
- **C3. Industry Intelligence (B2B)** [v1] — launch-market analytics, contracts, policy tracking, constellation dashboards.
- **C4. The Daily Brief** [NEW] — a standalone-brand daily newsletter + auto-generated 5-minute audio briefing ("Morning Brew of space"). Started week one at near-zero cost; owns the audience independent of Google/app stores; sponsorship revenue early. The single cheapest growth asset available.

### Domain D — Events, Calendar & Physical World
- **D1. Unified Space Calendar** [v1] — computed astronomical events + launches + milestones + conferences + star parties + shows; ICS sync; smart location/weather-aware alerts. **The wedge product.**
- **D2. Local & Nearby** [v1] — geospatial discovery: events, clubs, observatories, planetariums, dark-sky sites; "best spot tonight."
- **D3. Eclipse & Astro-Tourism Vertical** [v1] — planning products, path maps, viewing marketplaces, travel packages. **v2 urgency: 2026-08-12 and 2027-08-02.**
- **D4. Launch Viewing Travel Guides** [NEW] — where to physically watch launches (Cape Canaveral spots, Starbase, Vandenberg, Wallops, Kourou…), closures, timing, etiquette, local logistics; merges into D3 commerce. High search volume, zero incumbents doing it well.

### Domain E — Community, Learning & Contribution
- **E1. Community & UGC** [v1] — uploads with EXIF/FITS extraction and **plate-solving auto-identification**, layered moderation, attribution, licensing, reputation.
- **E2. Clubs & Social Graph** [v1] — clubs, topic rooms, mentorship, gear-twin matchmaking, challenges & badges.
- **E3. Learn** [v1] — structured courses "first telescope → astrophysics," school licensing, multilingual, kids mode.
- **E4. Citizen Science Hub** [v1] — real research participation with credit in the graph.
- **E5. Remote Telescope Network** [v1] — book time on partner observatories (ASCOM/INDI), get your own images, revenue share.
- **E6. Gear Integration Layer** [NEW] — first-class support for the equipment ecosystem: import sessions/images from N.I.N.A., ASIAIR, Seestar/Dwarf/Unistellar apps; one-tap plate-solve + share; ASCOM Alpaca/INDI bridges (feeds E5 too). **Smart-telescope companion mode is the #1 newcomer acquisition feature** (P3).
- **E7. Creator & Club Program** [NEW] — embeddable widgets (launch countdowns, "what can this scope see," tonight-at-a-glance) for YouTubers, clubs, planetariums, and media; free club micro-sites; revenue share for creator-driven affiliate sales. Turns the ecosystem's existing audiences into distribution.

### Domain F — Data, Commerce & Platform
- **F1. Open Data Hub & Public API** [v1] — clean, versioned APIs over the graph; free hobby tier, paid tiers. The API is a product.
- **F2. Marketplace** [v1] — affiliate + direct commerce on gear; verified used marketplace with escrow.
- **F3. AI Copilot — "Ask Orrery"** [v1] — retrieval-grounded assistant; ephemeris questions routed to the sky engine, never hallucinated.
- **F4. Jobs & Talent Board** [NEW] — space-industry jobs tied to the company graph (company page → open roles); paid postings + featured employers. Proven niche-board economics; B2B beachhead.
- **F5. Developer & AI Platform** [NEW] — extends F1: SDKs (JS/Python), webhooks, embeds; **an MCP server exposing graph + ephemeris tools to AI assistants**; `llms.txt` and structured citations; content/data licensing to AI providers as a revenue line. Being the canonical machine-readable source *is* the AI-era distribution strategy.
- **F6. Physical Products** [NEW] — print almanac ("Orrery Yearbook"), star charts, calendars, merch. Small, brand-building, seasonal.

### Cross-cutting product requirements (new in v2 — several are astronomy-specific table stakes)

| Requirement | Why it's non-negotiable |
|---|---|
| **Red "night vision" mode** | Observers' dark adaptation; every serious astro app has it. Ship in MVP design system. |
| **Offline field mode** | Dark sites have no signal. Calendar, planner, charts must cache; ephemeris computed on-device (client library). PWA first, native later. |
| **Location privacy** | Precise location is sensitive personal data (GDPR). Coarse by default, explicit opt-in for precision, on-device where possible. |
| **Internationalization** | EN at launch; architecture i18n-ready day 1 (URLs, strings, units, RTL-capable); ES → HI/UR → ZH/JA/DE/FR per traction. Underserved non-EN astronomy audiences are a moat. |
| **Accessibility** | WCAG 2.1 AA; plus astronomy-specific: data sonification for blind users (NASA precedent), transcripts for streams. |
| **Authenticity (C2PA)** | AI-fake astrophotos are eroding trust community-wide. Content credentials + capture-metadata verification + clear AI-content labeling = differentiator for E1. |
| **Gamification** | Streaks (daily sky check-in), badges (observing challenges), levels — proven retention mechanics absent from all incumbents. |
| **Kids / classroom mode** | COPPA-compliant reading level + safe surfaces; unlocks P7 and school licensing. |

**Explicitly out of scope (decided, not forgotten):** operational conjunction/debris analytics for satellite operators (LeoLabs/COMSPOC territory: capital- and liability-heavy), spacecraft hardware/flight software, professional observatory scheduling, launch brokering, astrology (only as an SEO-disambiguation content page), Earth-observation imagery analytics (revisit as a B2B vertical later).

---

## 7. Prioritization — the MVP Wedge

**Wedge = D1 Calendar + B4-lite Launch Center + "Tonight's Sky" (B1-lite) + seeded A1/A2/A3 entity pages + C1-lite tagged news + ICS/alerts + C4 daily brief.**

Why exactly this slice:
1. **Zero licensing risk, zero data cost** — computed events + public-domain/attribution-friendly sources only.
2. **No cold start** — useful with zero users and zero UGC on day one.
3. **Daily habit** — calendar + alerts + brief create return visits; everything else attaches to that habit.
4. **Maximum SEO surface per engineering hour** — every event, launch, and object is a page that answers real queries years into the future ("perseids 2027 peak time karachi").
5. **Direct commerce path** — gear guides (P2) bolt onto the same entity pages next.
6. **Graph-native from day 1** — all wedge data lands in the entity/edge schema, so every later module inherits it.

**Deliberately NOT in the MVP** (v1 over-eagerness, deferred): accounts-required features beyond follows/alerts, UGC pipeline, marketplace/escrow, remote telescopes, LMS, B2B intel, AI copilot, mobile apps, 1.8B-star rendering (start with bright-star catalog ~120k stars: Hipparcos/Tycho subset).

---

## 8. Architecture v2 — Addendum to v1 Part 3

v1 Part 3 (topology, connectors, pipelines, K8s/3-region infra) stands as the **scale state**. This section adds what v1 lacked: how to start, the client engine, growth plumbing, correctness, and cost.

### 8.1 The boring-start mapping ("same schema, humbler metal")

Rule: **keep v1's logical service boundaries as code modules; collapse the physical infrastructure into a modular monolith until pain, not ambition, splits it.** The graph is a schema, not a database purchase.

| v1 scale component | MVP stand-in (Phase 3–6) | Split when |
|---|---|---|
| Kubernetes, 3 regions | One Next.js app + one worker process (Vercel/Railway/VPS) | Sustained load or team > ~6 engineers |
| Kafka event bus | Postgres job queue (pg-boss) + cron schedules | Connector count/volume makes queue-in-DB hot |
| Neo4j / graph store | `entities` + `edges` (+ `claims` provenance) tables in Postgres, recursive CTEs | Multi-hop traversal latency actually hurts copilot |
| OpenSearch | Postgres full-text (tsvector) → Meilisearch/Typesense | Facets/typo-tolerance needs exceed FTS |
| Vector DB | pgvector extension | Embedding count ≫ 10M or QPS demands |
| ClickHouse analytics | Postgres + PostHog (hosted or self-host) | Event volume makes Postgres groan |
| Redis | In-process + HTTP cache; Upstash when needed | Session/counter volume |
| S3 + CloudFront | Cloudflare R2 (zero egress) + Cloudflare CDN | Never, possibly |
| GraphQL federation gateway | Plain typed REST (tRPC/OpenAPI) in-app | Public API GA (F1) may still be REST |
| Airflow-style orchestration | Cron + idempotent connectors + freshness table | Connector count > ~25 |

**Non-negotiables even at MVP** (cheap now, brutal to retrofit): the entity/edge/claims schema with source+timestamp provenance on every fact; idempotent connectors with a per-source freshness dashboard; UTC-everywhere with explicit timezone conversion at the edge; URL scheme designed once (SEO permanence); soft-delete + audit on editorial edits.

### 8.2 Client sky engine (v1 said "WebGL handles rendering"; here is the actual plan)
- **Ephemeris on-device:** `astronomy-engine` (MIT, ±1 arcmin, tiny) for planets/sun/moon/rise-set in the browser & PWA offline; server-side SPICE/Horizons for spacecraft, small bodies, and high-precision needs. Same API shape so the client falls back to server transparently.
- **Star rendering:** tiered catalogs — bright subset (~9k naked-eye) → Hipparcos/Tycho2 (~2.5M) tiles → Gaia tiles later; HEALPix/HiPS tiling (CDS standard) for both catalogs and survey imagery overlays (DSS/PanSTARRS), which also gives Aladin-Lite interoperability.
- **Satellites:** satellite.js (SGP4) client-side from cached GP data; passes precomputed server-side for alert fanout.
- **Renderer:** WebGL2 now, WebGPU when Safari coverage allows; Canvas fallback for low-end. Native AR (ARKit/ARCore sensor fusion) deferred to the mobile track.

### 8.3 SEO & distribution architecture (the growth engine v1 never specified)
- Permanent, human-readable URL scheme: `/object/saturn`, `/mission/jwst`, `/launch/2026-…-starship-flight-N`, `/event/2027-08-02-total-solar-eclipse`, `/sky/tonight/lahore`, `/gear/zwo-seestar-s50`.
- schema.org structured data everywhere: `Event` (launches, eclipses, showers), `NewsArticle`, `Product`+`Review` (gear), `Dataset` (API), `FAQPage`, `BreadcrumbList`; OG image auto-generation per entity.
- Sitemap sharding by type + freshness; ISR/edge caching (pages regenerate on data change, not on request).
- **Thin-content guardrail:** publish an entity page only above a data-completeness threshold; noindex below it. Programmatic SEO dies by thin pages.
- City-localized event pages for the top ~2,000 cities (visibility, times, weather links) — the CalSky-shaped hole.
- Google Discover/News eligibility for the news layer; `llms.txt`; MCP server (F5) so AI assistants query live data and cite Orrery.

### 8.4 Video & streams — rights posture (v1 silent, legally important)
Embed official streams (YouTube embeds are licensed by the platform); never restream or re-host third-party webcasts; milestone-indexing stores *timestamps + links*, not copies; NASA content is public domain (logo/endorsement rules still apply); company webcast clips only with permission or clear fair-use review. Archive ambitions (v1 B4) proceed via partnerships, not scraping.

### 8.5 Editorial & CMS
Editorial facts live *in the graph* (claims with sources), not in a parallel CMS; long-form content (guides, explainers) in MDX/git first, headless CMS only when non-technical editors join. Wiki-style community proposals (v1 §3.3) arrive with accounts + reputation (post-MVP), with a published citation/verifiability policy modeled on Wikipedia's, plus vandalism defense (rate limits, trusted-tier review).

### 8.6 Correctness & testing (astronomy users are unforgiving; v1 had no test strategy)
- **Golden tests:** positions/rise-set/phases validated against JPL Horizons vectors; eclipse circumstances against canonical NASA/Espenak data; conjunction/opposition timings against published almanacs. Run in CI.
- **Timezone/DST matrix tests** (the #1 real-world bug class in calendar products), including half-hour offsets (e.g., Asia/Karachi is UTC+5 — but test Kathmandu +5:45, Chatham +12:45).
- SGP4 staleness policy: pass predictions annotated with TLE age; suppress predictions beyond drift tolerance.
- Data QA dashboards: per-connector freshness (v1 ✔), null/dupe/orphan-edge monitors, entity-resolution spot-check queue.

### 8.7 Security, abuse & resilience
WAF + CDN in front (launch days attract both traffic and attacks); rate limiting on all endpoints from day 1; scoped API keys with metering when F1 ships; secrets in env/manager, never in repo; nightly DB backups + point-in-time recovery, restore drill each phase; status page. UGC-era additions (AV scan, CSAM hash-matching, DMCA agent registration) documented now, built with E1.

### 8.8 Cost model (order-of-magnitude, monthly)
- **MVP (Phases 3–6):** $0–50 — free tiers of Vercel/Neon/R2/Resend/PostHog + domain. Media is links, not hosting.
- **Traction (10k–100k MAU, pre-UGC):** $100–500 — paid DB tier, email volume, weather API commercial tier.
- **UGC era:** storage+egress becomes the dominant line exactly as v1 §3.10 warns — R2 (zero egress) + aggressive derivatives from day one of E1.
- **Venture scale:** v1 §3.10–3.11 applies (3-region, ~55–60 engineers, media-dominated COGS).

---

## 9. Data Sources & Licensing (master table + landmines)

### 9.1 Primary sources (MVP-relevant rows first)

| Source | Provides | Access | Key? | License / terms notes |
|---|---|---|---|---|
| Own computation (astronomy-engine / Skyfield / SPICE) | Events, ephemerides, rise/set | Local code | No | **Ours. Clean. The strategic advantage.** |
| Launch Library 2 (The Space Devs) | Launches, agencies, pads, vehicles | REST API | No (free ~15 req/hr; supporter tier higher) | Attribution appreciated; cache aggressively; consider sponsoring — they are the community's data backbone |
| Spaceflight News API (The Space Devs) | News metadata | REST | No | Good MVP news bootstrap alongside RSS |
| NASA APIs (api.nasa.gov: APOD, NeoWs, DONKI, Mars photos) | Imagery, NEOs, space weather events | REST | **Free key** | NASA content public domain; insignia/endorsement rules apply |
| JPL Horizons / SSD & CNEOS APIs | High-precision ephemerides, close approaches, Sentry | REST | No | Public; courtesy rate limits |
| CelesTrak | Satellite GP/TLE data | Files/API | No | Kelso's terms are permissive; attribute |
| Space-Track | Authoritative catalog | API | **Free account** | **ToS restricts bulk redistribution — display/derive OK, re-serving raw catalog is not. Use CelesTrak for anything redistributed.** |
| NOAA SWPC | Solar wind, Kp, alerts | JSON feeds | No | US Gov public domain |
| Open-Meteo | Weather + cloud cover (astro-relevant fields) | REST | No (free non-commercial) | **Commercial use requires paid tier — budget when monetizing** |
| Minor Planet Center | Asteroids/comets orbits | Files/API | No | Check current redistribution terms at build time |
| Gaia (ESA) / SIMBAD / VizieR (CDS) | Star catalogs, cross-IDs | TAP/files | No | Free with citation ("ESA/Gaia/DPAC"; CDS acknowledgment) |
| NASA Exoplanet Archive | Exoplanets | TAP | No | Free, cite |
| arXiv astro-ph + ADS | Papers, citations | API | ADS: **free token** | Metadata fine; respect rate limits; don't re-host PDFs |
| ESA/Hubble, ESA/Webb, ESO imagery | Press images | Web | No | **CC BY 4.0 — attribution required, keep license metadata per image (v1 ✔)** |
| Astrometry.net | Plate solving | Self-host or nova API | **Free key** (hosted) | Self-host index files for volume (E1 era) |
| AAVSO / IOTA | Variable stars, occultations | API/files | Varies | Partnership etiquette: ask, credit, give back (B7 era) |
| Light pollution (VIIRS / World Atlas 2015) | Darkness layers | Files | No | World Atlas has specific reuse terms — verify before shipping D2 |
| OpenStreetMap + MapLibre | Base maps | Tiles/lib | No | ODbL attribution |

### 9.2 Landmines (each has bitten a real product)

1. **Space-Track redistribution** — never re-serve their raw catalog; CelesTrak or SGP4-derived *products* only.
2. **Open-Meteo commercial clause** — the moment revenue exists, move to their paid tier or Meteoblue/Met-office contracts (B5 pricing must absorb this).
3. **ESA/ESO CC BY** — attribution pipeline must be structural (per-asset license fields — v1 §3.9 ✔), not editorial diligence.
4. **Press/rights-managed images** in news cards — thumbnail + link out; never re-host arbitrary article imagery.
5. **Webcast re-hosting** — embeds only (§8.4).
6. **EU database sui-generis right** — computing our own events is clean; bulk-copying a curated database (e.g., another site's event list, gear specs table) is not. Gear specs: source from manufacturers + first-party measurement + community submission, not scraping competitors.
7. **Apple App Store** — 15–30% on digital subs when the mobile track ships; design pricing/web-purchase flow accordingly.
8. **COPPA/GDPR** — kids mode needs verifiable-consent design; location is personal data (§6 cross-cutting).
9. **"Orrery" trademark/name collisions** — generic English word (helps), but existing apps/marks must be searched before public launch (Phase 2 task).
10. **Affiliate ToS** — Amazon Associates has strict price-display staleness and disclosure rules; disclosure banners are FTC-required.
11. **ITAR/EAR** — irrelevant while aggregating public sources; becomes a review item only if B2B intel ever touches controlled technical data. Note filed, no action.

---

## 10. Go-to-Market & Growth (new in v2)

### 10.1 Programmatic SEO (primary engine)
Event pages published *years ahead* (every eclipse, shower peak, conjunction, opposition through 2035+, per major city), launch pages within minutes of announcement, entity pages above completeness thresholds. Search demand is evergreen, spiky, and intent-rich — and the incumbents ranking today (TimeandDate, In-The-Sky, Space.com listicles) are beatable on depth, freshness, and locality.

### 10.2 Spike surfing (secondary engine)
A playbook per predictable spike: **T-30d** publish/refresh the hub page; **T-7d** brief + press/creator outreach; **T-1d→0** live coverage + alert pushes; **T+1d** replay/results content. Applies to: every Starship/Artemis flight, 2026-08-12 eclipse, 2027-08-02 eclipse, major meteor showers, bright comets (unpredictable — keep a template ready), aurora storms (Kp-triggered content within the hour), NEO scares (A8).

### 10.3 Owned audience from week one
C4 daily brief (newsletter + audio). Every page footer converts. Newsletter subscribers are immune to Google volatility and are the beta pool for every later module. Sponsorship revenue (space brands, gear retailers) is realistic at ~5–10k subs.

### 10.4 Ecosystem distribution
E7 embeds for creators/clubs (countdowns, tonight widgets, scope simulators) with backlinks; honest seeding in r/space, r/telescopes, r/spacex, Cloudy Nights (as a contributing member, not a spammer — these communities excommunicate marketers); club partnerships via Night Sky Network; planetarium/museum widget placements.

### 10.5 AI-era strategy (offense, not defense)
Answer engines will increasingly intercept "when is the eclipse" queries. Response: (a) be the **source** — MCP server + clean API + llms.txt + citable structured pages, so assistants ground on and link to Orrery; (b) **license** the graph to AI providers (F5 revenue); (c) own what AI can't intermediate — alerts, calendar subscriptions, community, commerce.

### 10.6 App-store & platform later
PWA until retention proves the mobile investment; then React Native/Expo app with the offline field kit + AR (ASO around "sky tonight," "launch tracker," "eclipse 2027" keywords). Watch complications, TV ambient mode, and voice surfaces are cheap add-ons after the API exists.

---

## 11. Viability & Reality Check — "What scope is actually usable?" (the owner's direct question)

### 11.1 Three honest horizons

| | **H0 — The Wedge** | **H1 — The Platform Seed** | **H2 — The v1 Vision** |
|---|---|---|---|
| Team | You + AI dev team (this engagement) | ~5–8 people, pre-seed/seed ($1–3M) | 60–120 people, $30M+ cumulative |
| Time | 3–6 months part-time | 18 months | 3–5 years |
| Scope | D1+B4-lite+Tonight+seeded pages+news+alerts+C4 (Phases 3–6) | + accounts depth, gear DB & affiliate, community+plate-solve, conditions engine, mobile, public API | All 20+ modules incl. marketplace escrow, remote network, LMS, B2B intel, copilot GA, 3-region infra |
| Running cost | $0–50/mo | $2–10k/mo + salaries | v1 §3.10–3.11 economics |
| Realistic outcome | A genuinely useful daily tool; 10k–100k monthly visits within ~a year *if* SEO/spike playbooks are executed; first affiliate + newsletter revenue; proof for H1 | Category-leading consolidator of the fragmented tools; $10k–100k MRR range plausible across sub+affiliate+API | The "billion-dollar architecture" framing — requires venture funding, hiring, and multi-year execution |

**The key structural fact:** H0 is not a demo of H2 — it is the first ring of it. Same schema, same URLs, same graph. v1's "nothing built in Phase 1 is thrown away" holds across horizons.

### 11.2 What makes this idea genuinely usable (strengths)
- Real, recurring, measurable user needs (eclipse dates, launch times, "what's that in the sky," "which telescope") with proven incumbents earning traffic on worse products.
- Computed-first data = no licensing hostage, no content treadmill, near-zero COGS at MVP.
- Fragmented competition with no platform incumbent and visible key-person decay.
- Multiple independent revenue lines that attach to the same graph.
- Timing tailwinds (§4) that don't require betting on any single one.

### 11.3 What would kill it (ranked)
1. **Building all of it at once.** The v1 document's greatest risk is its own completeness. Antidote: the phase gates in PHASES.md.
2. **UGC/community cold start.** Communities don't move for features. Antidote: tools-first sequencing — be indispensable *before* asking for contributions; import/integration (E6) before creation (E1).
3. **Correctness failure in public.** One wrong eclipse time ends trust. Antidote: §8.6 golden tests.
4. **Licensing misstep** (§9.2) — cheap to avoid now, expensive later.
5. **Google/AI distribution shift** — antidote: §10.3 owned audience + §10.5.
6. **Solo-operator burnout** — antidote: boring stack, phase gates, ruthless deferral list (§7).

### 11.4 Bottom line
**Usable? Yes — at H0, unambiguously, and quickly.** The wedge is a real product with real daily users available to a solo owner at hobby cost. **A company? Yes — at H1, if H0 shows retention and organic growth.** **The full v1 blueprint? A venture bet** that this document now de-risks by giving it a stairway instead of a cliff.

---

## 12. KPIs per Horizon

| Horizon | North star | Supporting metrics |
|---|---|---|
| H0 launch (Phase 6) | Weekly active users | ICS subscriptions, alert opt-ins, newsletter subs, D7 return rate, indexed pages, organic clicks/wk |
| H0 proof (~month 6–12) | Organic growth rate | 10k+ MAU, 1k+ newsletter, 25%+ D7 on alert users, first $ (affiliate/sponsorship) |
| H1 | MRR + MAU | Sub conversion 1–3%, affiliate rev/visitor, API keys issued, UGC uploads/wk, plate-solve success rate |
| H2 | ARR mix across 5+ lines | v1 Part 5 portfolio; B2B/API share of revenue as the valuation driver |

---

## 13. Risk Register

| # | Risk | P | I | Mitigation |
|---|---|---|---|---|
| R1 | Scope sprawl / never shipping | High | High | Phase gates; §7 deferral list is contractual |
| R2 | Astronomical correctness bug goes public | Med | High | Golden tests vs Horizons/Espenak in CI (§8.6); publish a corrections policy |
| R3 | Timezone/DST bugs in calendar | High | Med | UTC core, tz matrix tests, per-city QA on top 50 cities |
| R4 | LL2 dependency (rate limits, outage, terms change) | Med | Med | Aggressive caching; supporter tier; fallback parsers for agency sources; good citizenship |
| R5 | Licensing violation (TLE redistribution, imagery, weather commercial use) | Med | High | §9 table is a release checklist; per-asset license fields |
| R6 | SEO algorithm volatility / AI answer interception | Med | High | Owned audience (C4), MCP/API-as-source (§10.5), alerts & tools that AI can't substitute |
| R7 | UGC cold start (later phases) | High | Med | Tools-before-community sequencing; E6 imports; seed with partner clubs |
| R8 | Moderation/legal exposure with UGC | Med | High | Staged rollout, ML pre-filter + human review (v1 §3.6), DMCA agent, C2PA |
| R9 | Media storage/egress cost blowout | Med | Med | R2 zero-egress, derivative caps, tiered storage from E1 day one (v1 §3.10 ✔) |
| R10 | Name/trademark collision | Low | Med | Phase 2 search before public launch; domain fallbacks |
| R11 | Solo bus-factor | High | Med | Docs-as-source-of-truth, boring stack, everything reproducible from repo |
| R12 | Competitor copies the wedge | Low | Low | Wedge is executable by others but the graph+community compounding isn't; speed + depth |

---

## 14. Revenue Architecture v2

v1's seven lines all stand. v2 adds four and — critically — sequences them:

| Stage | Lines switched on |
|---|---|
| H0 (months 3–9) | Gear **affiliate** links on guides/entity pages · **newsletter sponsorship** (C4) · donations/early-supporter tier |
| H0→H1 | **Consumer Pro sub** ($3–6/mo: conditions engine, advanced/weather-aware alerts, planner, ad-free, offline packs) · **jobs board** postings [NEW] |
| H1 | **Public API tiers** (F1) · **MCP/AI data licensing** [NEW] (F5) · marketplace listings fees (F2-lite, pre-escrow) |
| H1→H2 | Education licensing (E3) · B2B intelligence (C3) · astro-tourism commerce (D3, timed to 2027-08-02) · remote-telescope revenue share (E5) · used-market **escrow** fees (F2) · sponsorships/brand (ethically separated, v1 ✔) · print/merch [NEW] (F6) |

Unit-economics reality (planning assumptions, verify in market): astro-gear affiliate 3–8% on high AOV ($300–3,000); consumer sub conversion 1–3% of MAU; niche job boards $100–300/posting; API self-serve $29–299/mo tiers; B2B intel $3–15k/yr mid-market gap (§5.14).

---

## 15. Build Order v2 (supersedes v1 Part 4; execution detail in PHASES.md)

- **Phase 1–2 (docs/design)** → this document, PRDs, prototype, schema. *(v1 had no doc phase; teams that skip it re-litigate scope forever.)*
- **Phase 3–6 (H0 wedge)** → walking skeleton → calendar+launch center → knowledge pages+news → beta with follows/alerts/brief. Maps to v1 "Phase 1: the spine," minus editorial staffing, plus SEO/newsletter engines v1 lacked.
- **Phase 7+ tracks (H0→H1)** → chosen by live metrics, not by plan: T1 gear+affiliate · T2 satellite passes · T3 community+plate-solve · T4 API+MCP · T5 space weather · T6 copilot · T7 mobile · T8 learn · T9 B2B. Corresponds to v1 Phases 2–3 with data-driven ordering.
- **H2 (venture)** → v1 Part 3/Part 4 as written, including team shape §3.11.

---

## 16. What the owner must provide

Nothing yet. From Phase 3 onward, accounts and keys are needed exactly as itemized in **[REQUIREMENTS.md](REQUIREMENTS.md)** (all free-tier to start: GitHub, Vercel, Neon/Supabase, NASA key, domain, Resend; later: affiliate approvals, Stripe, Anthropic key, app-store accounts). Decisions needed at the Phase 2 gate: product name confirmation, primary language(s), hosting budget ($0 vs ~$20–40/mo), and your weekly time budget.

---

---

# Appendix A — Full Reference Index ("everything that exists")

*The ecosystem catalog: competitors, inspirations, integration targets, data sources, and materials. One line each. ~160 entries.*

### A.1 Planetarium / sky-map / simulation
Stellarium (OSS desktop+web+mobile; the reference) · SkySafari 7 (mobile pro standard) · Star Walk 2 / Sky Tonight (Vito; mass-market) · Sky Guide (iOS, design benchmark) · SkyView · Night Sky (iOS) · Sky Map (Android OSS) · Cartes du Ciel (desktop charting) · KStars (OSS + INDI control) · Celestia (OSS 3D universe) · SpaceEngine (paid universe sim) · Universe Sandbox (physics sandbox) · NASA's Eyes (missions/solar system/asteroids/exoplanets visualizer) · Solar System Scope · WorldWide Telescope (AAS, research-grade sky browser) · OpenSpace (planetarium-grade OSS) · Digistar/Sky-Skan (dome systems) · Stellarium Web (browser)

### A.2 Launch tracking & spaceflight
Space Launch Now (app, LL2's own) · Next Spaceflight · RocketLaunch.Live · Supercluster (launch tracker + astronaut DB + editorial; design benchmark) · Spaceflight Now launch schedule · T-Minus/launch-alarm apps · NASA app / NASA+ · SpaceX site/X · Rocket Lab, ULA, Arianespace webcast pages · Flightradar24 (UX inspiration for live tracking) · FlightClub.io (trajectory sim) · booster-recovery/fleet trackers (community Starship/booster spreadsheets & sites)

### A.3 Satellite tracking
Heavens-Above (the classic; one-person) · N2YO (live tracking) · ISS Detector (app) · NASA Spot the Station (app) · Look4Sat (OSS Android) · GoISSWatch · "See a Satellite Tonight" (James Darpinian; zero-friction UX benchmark) · Stuff in Space / satellitemap.space (Starlink) · CelesTrak (T.S. Kelso; GP data + educational pages) · Space-Track (18th SDS; authoritative, ToS-bound) · SatNOGS (open ground-station network) · How Many People Are In Space Right Now (single-serving inspiration for A7) · DSN Now (deep-space network live)

### A.4 Calendars, almanacs & event reference
TimeandDate astronomy (mass-market incumbent) · In-The-Sky.org (Dominic Ford; deepest computed events) · TheSkyLive (solar-system dashboards) · EarthSky Tonight · S&T "This Week's Sky at a Glance" · NASA Eclipse site (Espenak/GSFC canonical) · GreatAmericanEclipse (commercial eclipse maps) · Xavier Jubier interactive eclipse maps · Time and Date eclipse pages · MoonGiant / MoonCalc / sunrise-sunset APIs · aerith.net (Seiichi Yoshida's comets) · CalSky (†2020 — the vacuum Orrery fills) · Astropixels (Espenak data tables)

### A.5 Observing conditions & astro-weather
Clear Sky Chart (Attilla Danko; NA institution) · Astrospheric (best NA product; API exists) · Clear Outside (FLO; global-ish) · meteoblue seeing · 7Timer! (free, global, crude) · Good To Stargaze · Windy (UX benchmark) · Open-Meteo (data source) · NOAA/ECMWF models (upstream)

### A.6 Space weather & aurora
NOAA SWPC (canonical) · SpaceWeatherLive (+app) · SpaceWeather.com (Tony Phillips) · SolarHam · My Aurora Forecast & similar apps · Glendale aurora app (community favorite) · AuroraWatch UK · Aurorasaurus (citizen reports) · GOES/SDO imagery feeds (visual gold, public domain)

### A.7 Light pollution & dark sites
LightPollutionMap.info · Dark Site Finder · DarkSky International (IDA) certified places · World Atlas 2015 (Falchi dataset) · VIIRS nighttime lights · Bortle scale references · Clear Outside's site DB

### A.8 Planning, calculators & field tools
Telescopius (target planning + FOV + community; closest single analog to B6) · astronomy.tools (FOV/mag calculators everyone embeds) · SkyTools 4 (deep desktop planning) · AstroPlanner · Observation Manager apps · PhotoPills (sun/moon/MW planning; monetization benchmark $11 one-time) · PlanIt Pro · Sun Surveyor · Polar-alignment & collimation apps · Astronomical League observing program checklists

### A.9 Astrophotography community & galleries
AstroBin (the community; subscription model) · r/astrophotography (~4M) · Cloudy Nights forums + classifieds (US institution) · Stargazers Lounge (UK) · IceInSpace (AU) · Flickr astro groups · Instagram/X astro scene · APOD (daily institution since 1995; submission pipeline) · Astronomy Magazine/S&T reader galleries

### A.10 Capture & processing software (integration targets)
N.I.N.A. (OSS capture suite) · ASIAIR (ZWO closed ecosystem) · StellarMate / Astroberry (INDI) · SharpCap · FireCapture · PHD2 (guiding) · PixInsight (processing standard) · Siril (OSS) · DeepSkyStacker · Sequator · Astro Pixel Processor · GraXpert (OSS gradient/denoise) · AutoStakkert! + Registax (planetary) · Topaz/BlurXTerminator-class AI tools (authenticity debate driver) · astrometry.net (plate solving; OSS + hosted API)

### A.11 Smart & remote telescopes
ZWO Seestar S50/S30 (the wave-maker) · Dwarflab Dwarf 3 · Unistellar eVscope/Odyssey · Vaonis Stellina/Vespera · Celestron Origin · iTelescope (remote network) · Slooh (edu-flavored live scopes) · Telescope Live · Las Cumbres Observatory (education) · MicroObservatory (free edu) · ChileScope / SkyGems / remote hosting farms (DeepSkyWest etc.)

### A.12 Gear brands, retail & used market
Brands: Celestron · Sky-Watcher · ZWO · Askar · William Optics · Explore Scientific · Takahashi · Astro-Physics · PlaneWave · QHYCCD · Player One · Baader · Tele Vue · iOptron · Losmandy · (†Orion, †Meade — 2024 collapse).
Retail: High Point Scientific · Agena Astro · B&H/Adorama · First Light Optics (UK) · Teleskop-Express (DE) · 365Astronomy · Bintel (AU) · Ontario Telescope / All-Star (CA) · Amazon.
Used: Cloudy Nights Classifieds · Astromart · UK Astronomy Buy & Sell · eBay/FB Marketplace.
Reviews: TelescopicWatch · Love the Night Sky · scopereviews.com (Ed Ting) · AstroBackyard · Nebula Photos · Cuiv the Lazy Geek · Astrobiscuit · S&T/BBC Sky at Night test reports · r/telescopes wiki

### A.13 News, magazines & media
Space.com · Universe Today · SpaceNews (industry of record) · Payload (newsletter-first benchmark for C4) · Ars Technica (Eric Berger) · NASASpaceflight.com (news+forum+streams) · Spaceflight Now · The Planetary Society (+Planetary Radio) · Sky & Telescope (AAS-owned) · Astronomy Magazine · BBC Sky at Night · EarthSky · Phys.org / ScienceAlert · Quanta astrophysics · CNBC/Reuters space desks · SpacePolicyOnline · NASA Watch · Jonathan's Space Report.
YouTube: Everyday Astronaut · Scott Manley · Marcus House · NSF · Fraser Cain · Dr. Becky · PBS Space Time · Astrum · Anton Petrov · SmarterEveryDay (occasional) · Veritasium (occasional).
Podcasts: Planetary Radio · Astronomy Cast · Off-Nominal/MECO · StarTalk.
Materials: OpenStax Astronomy (free textbook) · "Turn Left at Orion" · "NightWatch" · "The Backyard Astronomer's Guide" · Cosmos/For All Mankind-class shows · KSP/Outer Wilds/Elite-class games (A9 catalog fodder)

### A.14 Data & research infrastructure
JPL Horizons + NAIF SPICE · JPL CNEOS/Sentry (NEOs) · Minor Planet Center · Gaia archive (ESA) · SIMBAD/VizieR/Aladin/ESASky (CDS ecosystem; HiPS standard) · NASA Exoplanet Archive · MAST/IRSA/HEASARC (mission archives) · SDSS SkyServer · NED · ADS (literature graph) · arXiv astro-ph · Launch Library 2 + Spaceflight News API (The Space Devs) · CelesTrak GP · NOAA SWPC feeds · USGS Astrogeology (planetary maps) · Meteoritical Bulletin DB (meteorites) · GCAT (McDowell) · NewSpace Index (Erik Kulu's free industry DBs) · Zooniverse platform · AAVSO International Database · IOTA occultation predictions · Skyfield/Astropy/astronomy-engine/satellite.js (the OSS calculation stack)

### A.15 B2B intelligence & careers
BryceTech · Seradata SpaceTrak (Slingshot) · Quilty Space · Novaspace (Euroconsult) · Payload Research · Space Capital reports · Jane's · Aviation Week Intelligence · LeoLabs/COMSPOC/ExoAnalytic (SSA — explicitly out of scope) · SpaceTalent · SpaceCrew · Space Individuals · SpaceCareers.uk

### A.16 Adjacent & inspiration products (pattern sources)
PCPartPicker (compatibility engine → A3) · Wirecutter (guide format → gear guides) · Crunchbase (→ A5) · Wikipedia/Wikidata (→ graph governance) · Morning Brew (→ C4) · Strava (→ challenges/segments for observing) · AllTrails (→ dark-site discovery UX) · Flightradar24 (→ live ops UX) · Zillow (→ programmatic local SEO) · Duolingo (→ streaks/learning) · Discord/Discourse (→ community infrastructure choices) · CamelCamelCamel (→ gear price-history alerts)

---

*End of Master Plan v2. Next document: [REQUIREMENTS.md](REQUIREMENTS.md). Execution gates: [PHASES.md](PHASES.md).*
