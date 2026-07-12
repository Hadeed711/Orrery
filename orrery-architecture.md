# ORRERY — Platform Architecture & Full Product Scope
### "Every object, every mission, every telescope, every event — one graph of everything space."
*Prepared as a technical architecture blueprint for a global, multinational space-content and space-data company.*

---

# PART 1 — THE CORE ARCHITECTURAL IDEA

Most "space websites" are content sites. Orrery should not be a content site. The single decision that makes this a billion-dollar architecture instead of a blog is this:

**The heart of the platform is a Space Knowledge Graph — a single, canonical, machine-readable database of every entity in the space domain, and every relationship between them.**

Entities: celestial objects, missions, spacecraft, instruments, telescopes (ground, space, and consumer), rockets, engines, launch pads, agencies, companies, astronauts, scientists, papers, images, datasets, events, locations, products.

Relationships: *JWST → carries → NIRCam → observed → Carina Nebula → imaged previously by → Hubble → launched on → STS-31 → flown by → crew...*

Every feature of the product — news, search, calendar, telescope guides, mission pages, community uploads — is a **view over this graph**. News articles are automatically linked to the entities they mention. A user photo of Saturn is linked to Saturn, to the user's telescope model, and to the date's sky conditions. This is the moat: anyone can aggregate news; nobody has the linked graph.

---

# PART 2 — COMPLETE PRODUCT SCOPE ("literally everything space")

Twenty product modules, grouped into six domains. Each module maps to one or more backend services in Part 3.

## Domain A — Knowledge & Catalogs (the reference layer)

**A1. Celestial Object Catalog.** Every star (Gaia, ~1.8B sources, served via tiered detail), planet, moon, exoplanet (NASA Exoplanet Archive sync), asteroid/comet (Minor Planet Center sync), deep-sky object (Messier/NGC/IC), black hole, pulsar, galaxy. Each object gets a permanent page: physical data, live ephemeris (rise/set/position for the user's location), discovery history, all imagery across all instruments, all papers, all community observations, all news mentions.

**A2. Missions Database.** Every space mission ever flown or announced — crewed and robotic, from Sputnik to future concepts. Structured fields: agency/company, objectives, spacecraft bus, instruments carried, launch vehicle, timeline with milestones, current status/telemetry where public, budget, outcomes, full media archive, related papers. Live mission trackers for active missions (e.g., where is Voyager 1 right now — real distance counter; Mars rover traverse maps; ISS orbit).

**A3. Telescope Encyclopedia — three distinct registries:**
- *Space telescopes:* every orbital observatory (JWST, Hubble, Chandra, Gaia, Euclid, Roman, XRISM, historical ones like Kepler/Spitzer/Herschel) with instrument-level detail — mirrors, wavelength coverage, detectors, orbit, observing programs, how to access their public data archives, current observation schedule where published.
- *Ground observatories:* every major professional facility (VLT, Keck, ALMA, ELT, Vera Rubin, FAST, GMRT, SKA...) — location, aperture, instruments, science highlights, visitor/tour info, live webcams where available.
- *Consumer telescope catalog:* a structured gear database of every commercially available telescope, mount, eyepiece, filter, and astro-camera — specs, prices across regions, compatibility rules (this mount carries that OTA; this camera back-focus matches that scope), expert and community reviews, "what can I actually see with this" simulations, buying guides by budget and by target type. This is the commerce engine of the whole platform.

**A4. Launch Vehicles & Propulsion Registry.** Every rocket family and variant, every engine, every launch site and pad worldwide, with performance figures, flight history, success/failure records, and reuse statistics.

**A5. People & Organizations.** Every astronaut/cosmonaut/taikonaut with flight logs; key scientists; all space agencies with budgets and programs; commercial space companies with funding, vehicles, and contracts — effectively a Crunchbase of the space industry.

**A6. History & Archive.** Timeline of spaceflight and astronomy from Galileo forward; digitized historical documents, mission transcripts (Apollo flight journals), anniversary surfacing ("on this day in space").

## Domain B — Live Sky & Operations (the real-time layer)

**B1. Live Solar System & Sky Engine.** Full 3D orrery driven by JPL Horizons-class ephemerides: planets, moons, active spacecraft trajectories, near-Earth asteroids, comets. Time-machine scrubbing — view the sky/system for any date past or future (the "sky on the day you were born," the 2027 eclipse from any city).

**B2. Satellite Tracking.** Live TLE-based tracking of ISS, Starlink trains, Hubble, and 10,000+ objects; pass predictions for the user's exact location with push alerts ("ISS visible over Karachi in 10 minutes, look northwest, magnitude −3.4").

**B3. Space Weather.** Solar activity, flare/CME alerts, Kp index, aurora visibility forecasts by geography, radio-blackout warnings — valuable to photographers, pilots, and ham operators.

**B4. Launch Operations Center.** Every upcoming launch worldwide with countdown, weather odds, embedded streams, milestone-tagged replays, and post-flight results. Historical launch video archive indexed by milestone (liftoff, MECO, landing).

## Domain C — News & Intelligence

**C1. Aggregated News Engine.** 1,000+ sources (agencies, journals, company blogs, credible media, arXiv astro-ph) ingested continuously; ML deduplication, clustering into "stories," trending detection, entity-linking into the knowledge graph, and plain-language AI summaries at three reading levels (kid / enthusiast / expert).

**C2. Personalized Feed & Digest.** Follow any graph entity (a mission, an object, a company, a telescope) and receive its news; daily/weekly email and push digests; deep-archive browsing by decade and topic.

**C3. Industry Intelligence (B2B).** Launch-market analytics, contract tracking, policy and space-law monitoring, constellation deployment dashboards — a paid tier for professionals, investors, and journalists.

## Domain D — Events, Calendar & Physical World

**D1. Unified Space Calendar.** Astronomical events (eclipses, meteor showers, conjunctions, oppositions, occultations — computed, not scraped), launches, mission milestones, conferences, star parties, planetarium shows, space-themed concerts and exhibitions, and educational workshops. One-tap sync to Google/Apple/Outlook via ICS; smart alerts adjusted for the user's location, weather forecast, and light pollution.

**D2. Local & Nearby.** Geospatial discovery of events, clubs, observatories, planetariums, and dark-sky sites near the user; light-pollution map integration; "best observing spot within 50 km tonight" recommendations combining darkness, weather, and accessibility.

**D3. Eclipse & Astro-Tourism Vertical.** Dedicated planning products for major episodic events (total eclipses, great comets, aurora seasons): path maps, viewing-site marketplaces, travel packages with vetted operators, ticketing. High-revenue, spike-driven business line.

## Domain E — Community, Learning & Contribution

**E1. Community & UGC.** Registered users upload astrophotography, observation logs, articles, translations, event listings, and datasets; metadata auto-extracted (EXIF, plate-solving to auto-identify what's in an image and link it to the graph); layered moderation (ML pre-filter → community review → editorial); permanent attribution and user-chosen licensing; reputation system with trusted-contributor fast lanes.

**E2. Clubs & Social Graph.** Local astronomy clubs, topic rooms, mentorship matching, gear-based matchmaking ("other owners of your telescope model near you"), observation challenges (Messier marathon tracker, lunar 100, badge system).

**E3. Learn (Education Platform).** Structured courses from "first telescope" to university-level astrophysics; curriculum-aligned packages licensed to schools (B2B recurring revenue); multilingual from day one; certificates; kids mode (COPPA-compliant).

**E4. Citizen Science Hub.** Real research participation: asteroid hunting in survey images, exoplanet transit classification, sunspot counting — partnered with institutions, contributions credited in the graph and, where applicable, in papers.

**E5. Remote Telescope Network.** Integration layer (ASCOM/INDI protocols) letting users book time on partner-operated remote observatories worldwide and receive their own images — turns lurkers into practicing observers regardless of geography or gear. Revenue share with observatory partners.

## Domain F — Data, Commerce & Platform

**F1. Open Data Hub & Public API.** Clean, normalized, versioned APIs over the entire graph: launches, events, ephemerides, catalogs, news metadata. Free tier for hobbyists and students; paid tiers for apps, media, and industry. The API is a product, not an afterthought.

**F2. Marketplace.** Affiliate and direct commerce on the consumer gear catalog (A3); verified used-equipment marketplace with escrow (telescopes have a huge secondhand market and no trusted global venue).

**F3. AI Copilot — "Ask Orrery."** A retrieval-grounded assistant over the knowledge graph and library: "plan tonight's session for my 8-inch Dobsonian from Karachi," "explain this paper simply," "compare these three telescopes for planetary imaging." Grounded answers with citations into graph entities — differentiated from generic chatbots precisely because of the graph.

---

# PART 3 — SYSTEM ARCHITECTURE

## 3.1 High-level topology

```
 ┌────────────────────────── CLIENTS ──────────────────────────┐
 │  Web (Next.js/SSR+ISR)   iOS/Android (React Native)         │
 │  AR Sky View (native)    Embeddable widgets   Partner apps  │
 └───────────────┬─────────────────────────────────────────────┘
                 │  HTTPS / WebSocket (live trackers)
        ┌────────▼─────────┐
        │  Global Edge/CDN │  static assets, imagery, tiles,
        │  (CloudFront +   │  cached ephemeris + catalog reads
        │   edge compute)  │
        └────────┬─────────┘
        ┌────────▼─────────┐
        │   API GATEWAY    │  authN/Z, rate limiting, quotas
        │  GraphQL federa- │  (public API shares this layer)
        │  tion + REST     │
        └────────┬─────────┘
 ┌───────────────┼───────────────────────────────────────────┐
 │               ▼        CORE SERVICES (Kubernetes)         │
 │  Identity & Accounts      Knowledge Graph Service          │
 │  Catalog Service          Missions Service                 │
 │  Telescope/Gear Service   Ephemeris & Sky Engine           │
 │  Satellite Tracking       Space Weather Service            │
 │  News Ingestion+Ranking   Search (hybrid lexical+vector)   │
 │  Events & Calendar        Geospatial/Nearby                │
 │  Notifications/Fanout     UGC & Media Pipeline             │
 │  Moderation               Community/Social Graph           │
 │  Learn (LMS)              Marketplace & Payments           │
 │  Recommendations          AI Copilot (RAG orchestration)   │
 │  Data/API Platform        Analytics & Experimentation      │
 └───────┬─────────────────────────────┬──────────────────────┘
         │            Kafka event bus  │
 ┌───────▼─────────────────────────────▼──────────────────────┐
 │                        DATA LAYER                           │
 │ PostgreSQL (system of record, per-service schemas)          │
 │ PostGIS (events, clubs, dark-sky sites, observatories)      │
 │ Graph store (knowledge graph; Neo4j or Postgres+AGE)        │
 │ OpenSearch (lexical search, news, logs)                     │
 │ Vector DB (embeddings: papers, articles, images)            │
 │ ClickHouse (analytics, feed telemetry, API metering)        │
 │ Redis (cache, sessions, counters, pass-prediction cache)    │
 │ S3 object storage (media originals + derivatives, datasets) │
 └──────────────────────────────────────────────────────────── ┘
```

## 3.2 The ingestion layer (where the platform is actually won or lost)

A dedicated **Connector Framework** — one pluggable connector per upstream source, each producing normalized entity/event messages onto Kafka:

- **Ephemerides & orbits:** JPL Horizons, NAIF SPICE kernels (planetary/spacecraft trajectories), Minor Planet Center (asteroids/comets), Space-Track & Celestrak (satellite TLEs, refreshed multiple times daily).
- **Catalogs:** Gaia archive (stars), SIMBAD/VizieR (cross-identifications), NASA Exoplanet Archive, NGC/IC compilations.
- **Missions & launches:** Launch Library 2, agency mission APIs and pages, NOTAMs/marine hazard notices (early launch-window signals), company webcasts.
- **Research:** arXiv astro-ph firehose, ADS (Astrophysics Data System) for citations, journal RSS.
- **News:** ~1,000 RSS/HTML sources through a polite crawler with per-source parsers.
- **Space weather:** NOAA SWPC feeds.
- **Imagery:** NASA image library, ESA/Hubble/JWST public archives, with license metadata preserved.

Each connector is independently deployable, monitored for freshness (staleness alerts per source), and idempotent. Downstream, a **Normalization & Entity Resolution service** maps everything onto canonical graph IDs — "Mars," "the red planet," and "499" (Horizons ID) resolve to one node. Entity resolution quality is the single most important ML investment in the company.

## 3.3 The Knowledge Graph service

Canonical store of entities and relationships with versioned edits (every fact carries source, timestamp, and confidence). Serves three access patterns: (1) direct entity-page reads (heavily cached at the edge — an object page changes rarely), (2) traversals for the AI copilot and "related content" modules, (3) bulk export to search indexes and the public API. Human editorial team + community proposals (wiki-style, with review) handle facts no feed provides. Think "Wikidata for space, with an editorial spine."

## 3.4 Ephemeris & Sky Engine

A compute service wrapping SPICE kernels and analytic theories: given (observer location, time, object) → position, magnitude, rise/set, visibility. Two tiers: **precomputed** (nightly batch of common queries — planet positions, bright-object rise/set for ~10,000 city grid points — pushed to edge cache) and **on-demand** (exact user coordinates, spacecraft, small bodies). Event *computation* (eclipses, conjunctions, occultations by location) lives here too — Orrery computes its astronomical calendar from first principles rather than scraping it, which is both a correctness and a licensing advantage. Client-side WebGL/WASM handles rendering; the service supplies state vectors.

## 3.5 News pipeline

Crawl → parse → language-detect → dedupe (MinHash + embedding similarity) → cluster into stories → entity-link against the graph → classify (topic, credibility tier, reading level) → summarize (3 levels) → rank. Trending = engagement velocity × source diversity × entity importance, recomputed every ~90 seconds on ClickHouse aggregates. Personalization: follow-graph first (deterministic, explainable), collaborative filtering second. Every article permanently enriches the graph ("all news about JWST" is a graph edge query, not a search).

## 3.6 UGC & media pipeline

Upload → S3 (pre-signed, resumable) → pipeline: AV scan → EXIF/FITS metadata extraction → **plate solving** (astrometry.net-style engine identifies exactly which sky region and objects a photo contains, auto-linking it into the graph — a signature feature: upload a photo, Orrery tells you what you captured) → derivative generation (thumbnails, web sizes, deep-zoom tiles for large mosaics) → ML pre-moderation → review queue → publish with attribution + license. Moderation is tiered: ML filter, trusted-community reviewers, paid editorial escalation; contributor reputation gates how much review each upload needs, keeping cost sublinear to volume.

## 3.7 Events, geospatial & notifications

Events service (Postgres/PostGIS) unifies computed astronomical events, ingested launches/milestones, partner-submitted events (venues, clubs, festivals — with an organizer portal), and user submissions. Geospatial queries power "near me," dark-sky-site finding, and pass-visibility mapping. **Notification fanout** is its own service: per-user alert rules (entity follows, event types, radius, quiet hours, weather-conditional "only alert me if it'll be clear"), delivered via push/email/SMS, plus per-user ICS calendar feed URLs so events flow into external calendars automatically and update themselves.

## 3.8 Search & AI

Hybrid retrieval: OpenSearch (lexical, filters, facets) + vector search (semantic, cross-lingual) + graph expansion (query mentions an entity → pull its neighborhood). The AI copilot is a RAG orchestrator over these three retrievers with strict grounding — every answer cites graph entities/documents; ephemeris questions are routed to the Sky Engine for computed (never hallucinated) numbers. Same retrieval stack powers the public semantic-search API tier.

## 3.9 Identity, trust & compliance

OIDC-based identity (social + email + passkeys), one account across web/mobile/API. RBAC for editorial/moderation staff; scoped API keys with metering (ClickHouse) and billing hooks. Compliance posture for a multinational: GDPR (EU), COPPA/age-gating for kids mode, per-region data residency options for institutional customers, DMCA/takedown workflow for media, and rigorous license tracking on every image and dataset in the system (agency imagery has varied terms; community content carries user-chosen licenses).

## 3.10 Infrastructure & operations

Kubernetes on a primary cloud, deployed in 3 regions (Americas, Europe, Asia) with active-active reads and single-writer-region Postgres (per-service) plus read replicas; Kafka mirrored cross-region. Infrastructure-as-code (Terraform), GitOps deploys, canary releases. Observability: OpenTelemetry traces, Prometheus/Grafana, per-connector freshness SLOs (e.g., TLEs < 6h stale, launch status < 60s during countdown windows). Launch days and eclipse days produce 50–100× traffic spikes — the architecture is deliberately read-heavy and edge-cacheable so spikes hit CDN, not origin. Cost posture: media storage and egress dominate; aggressive derivative caching and tiered storage (hot/warm/Glacier for archive video) from day one.

## 3.11 Team shape (steady state, ~year 3)

Platform/infra (8), ingestion & graph (10), search/ML/AI (10), product engineering across web+mobile (18), data engineering & API platform (6), trust & safety tooling (4), plus editorial (8), moderation ops (scales with UGC), community, education content, and partnerships. Engineering ~55–60 of a ~120-person company.

---

# PART 4 — BUILD ORDER (so the everything-platform doesn't collapse under its own weight)

**Phase 1 (months 0–9): the spine.** Knowledge graph core + connector framework (launches, ephemerides, TLEs, news top-200 sources) + Sky Calendar with alerts/ICS + live orrery + object/mission/telescope pages (read-only, editorially seeded). One killer daily-habit product: the calendar.

**Phase 2 (months 9–18): participation.** Accounts, follows, personalized feed, UGC pipeline with plate-solving, community clubs, consumer gear catalog with affiliate commerce, public API free tier.

**Phase 3 (months 18–30): monetization depth.** Learn/B2B education, paid API tiers, industry intelligence, marketplace, remote telescope network, astro-tourism vertical, AI copilot GA.

Each phase ships against the same graph — nothing built in Phase 1 is thrown away.

---

# PART 5 — REVENUE ARCHITECTURE

Consumer subscription (pro alerts, copilot, ad-free, remote-telescope credits) · B2B data/API licensing · Education licensing to institutions · Marketplace & affiliate commerce on gear · Astro-tourism ticketing/packages · Industry intelligence subscriptions · Sponsorships/brand partnerships (ethically separated from editorial). Diversified deliberately: consumer space audiences alone won't carry a billion-dollar valuation; the graph, the API, and the education/B2B lines are what can.
