# Orrery — Information Architecture & URL Scheme (Phase 2 deliverable)

> URLs are a 20-year commitment (SEO-1). This document fixes the scheme before the first deploy.
> Principles: human-readable · lowercase-kebab · no IDs in canonical URLs where a stable slug exists ·
> UTC dates in URLs · never reuse or repurpose a published URL · English unprefixed now, `/{lang}/` ready later.

---

## 1. Top-level map (MVP surfaces in **bold**, post-MVP in *italics*)

```
orrery.example
├── **/**                            Home = Tonight-first dashboard
├── **/sky/tonight**                 Tonight's Sky (effective location)
│     └── **/sky/tonight/{city}**    SEO city pages (top ~2,000 cities)
├── **/calendar**                    Unified Sky Calendar (agenda + month)
│     ├── **/calendar/{yyyy}**       Year almanac hub
│     ├── **/calendar/{yyyy}/{mm}**  Month listing
│     └── **/event/{slug}**          Event detail (permanent)
├── **/launches**                    Launch Center (upcoming)
│     ├── **/launches/past**         Results archive (filters)
│     └── **/launch/{slug}**         Launch detail (permanent)
├── **/objects**                     Catalog browse (kind hubs below)
│     ├── **/object/{slug}**         e.g. /object/saturn, /object/m31
│     ├── **/objects/planets** · /objects/moons · /objects/messier …
├── **/missions** → **/mission/{slug}**        e.g. /mission/jwst, /mission/cassini
├── **/telescopes** → **/telescope/{slug}**    space + ground observatories
├── **/rockets** → **/rocket/{slug}**          vehicles; **/engine/{slug}** later
├── **/pads** → **/pad/{slug}**                launch sites/pads
├── **/agencies** → **/agency/{slug}**         agencies & companies (A5)
├── **/news**                        Firehose + filters
│     ├── **/news/{topic-slug}**     Curated topic hubs (starship, artemis, jwst…)
│     └── (article pages are OUTBOUND — we never host third-party articles)
├── **/search**                      Site search
├── **/about** · **/sources** · **/corrections** · **/status**   Trust pages
├── */gear* → */gear/{slug}*         T1 track (A3 consumer catalog)
├── */people* → */person/{slug}*     A5 (auto-created minimal at MVP via launches)
├── */community, /learn, /api-docs, /jobs, /brief*   later tracks
└── /api/…                           JSON (see API-SURFACE.md); /api never indexed
```

## 2. Slug rules (collision-proof, forever-stable)

| Type | Pattern | Examples | Notes |
|---|---|---|---|
| Object | catalog-first | `saturn`, `m31`, `ngc-7000`, `titan`, `67p-churyumov-gerasimenko` | Well-known name wins; catalog designation as fallback; aliases 301 → canonical |
| Event (computed) | `{yyyy-mm-dd}-{type}[-{qualifier}]` | `2026-08-12-total-solar-eclipse`, `2026-08-12-perseids-peak`, `2025-01-18-venus-saturn-conjunction` | Date = UTC date of maximum/peak |
| Launch | `{yyyy-mm-dd}-{vehicle}-{mission}` | `2026-11-xx` placeholders **not allowed** — slug minted when NET date confirmed; pre-date slug: `{ll2-uuid}` interim, 301 on mint | Slips do NOT change slugs (slug = first confirmed date; page shows current NET) |
| Mission | common name | `jwst`, `voyager-1`, `apollo-11`, `chandrayaan-3` | |
| Rocket/pad/agency | common name | `falcon-9`, `starship`, `lc-39a`, `spacex`, `nasa`, `suparco` | |
| City | `{city}-{country-code}` on collision | `lahore`, `paris-fr` vs `paris-us` | From gazetteer permalink id |

**Never** encode mutable facts in slugs (status, vehicle block, NET). Redirect table (`redirects` in DB) handles renames; 301 only, never 404 a once-published URL.

## 3. Page template inventory (what we actually build)

| # | Template | Routes served | Rendering | JSON-LD |
|---|---|---|---|---|
| T1 | Tonight dashboard | `/`, `/sky/tonight`, `/sky/tonight/{city}` | Edge ISR shell + client live strip | `WebPage` + `Event` list |
| T2 | Calendar agenda/month | `/calendar*` | ISR + client filters | `ItemList<Event>` |
| T3 | Event detail | `/event/{slug}` | Static/ISR | `Event` (+ `FAQPage` where genuine) |
| T4 | Launch list | `/launches`, `/launches/past` | ISR (60 s) + client countdown | `ItemList<Event>` |
| T5 | Launch detail | `/launch/{slug}` | ISR (60 s; 10 s inside T-1h) | `Event` |
| T6 | Entity page | `/object|mission|telescope|rocket|pad|agency/{slug}` | Static/ISR + client tonight-module | kind-mapped (`Thing`/`Product` later) |
| T7 | Kind hub / browse | `/objects*`, `/missions`, … | ISR | `CollectionPage` |
| T8 | News firehose/topic | `/news*` | ISR (5 min) | `ItemList<NewsArticle>` (outbound) |
| T9 | Search | `/search?q=` | Client + API | noindex |
| T10 | Trust/static | `/about`, `/sources`, `/corrections`, `/status` | Static | `AboutPage` |

Ten templates total — every MVP surface is one of these. New modules must either fit a template or explicitly add one (gate decision).

## 4. Navigation model
- **Header (persistent):** logo → home · Tonight · Calendar · Launches · Objects · News · Search icon · location pill (city name, tap = picker) · night-mode toggle · `[P6]` sign-in.
- **Entity cross-linking:** every mention of a graph entity anywhere is a link (component-enforced: `<EntityChip>`). The graph must be *felt* in navigation.
- **Breadcrumbs** on all T3/T5/T6/T7 (with `BreadcrumbList`).
- **Footer:** trust pages, sources/licenses, ICS subscribe, brief signup `[P6]`, API teaser.

## 5. Internationalization posture (decision D2 pending)
- MVP: English at root (no `/en/`). All strings externalized from commit 1 (`next-intl`); dates/units locale-formatted.
- Later: `/{lang}/…` subpaths (`/ur/`, `/es/`), `hreflang` pairs, translated slugs NOT translated (slugs stay English — one canonical graph).

## 6. Sitemaps & crawl plan
- `/sitemap.xml` index → `sitemap-events.xml`, `-launches`, `-objects`, `-missions`, `-telescopes`, `-rockets`, `-agencies`, `-cities`, `-news-topics` (50k-URL shards, real `lastmod` from row `updated_at`).
- City tonight-pages: publish top 250 cities first; expand by search-demand tiers to ~2,000 (thin-content guardrail SEO-4 applies — a city page must render real localized numbers, which it always does by construction).
- `robots.txt`: allow all except `/api`, `/search`, `/status`; `llms.txt` describes API + citation format (F5 strategy).
