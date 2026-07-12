# Orrery — API Surface v0 (Phase 2 deliverable)

> Internal JSON API consumed by our own pages/components first; shaped so the public API (F1) is a
> versioned, documented subset later — not a rewrite. Conventions before endpoints.

## 1. Conventions
- Base: `/api/v0/…` (internal). Public launch will freeze `/api/v1` from the stable subset.
- **GET-only at MVP** (no user writes until P6). All responses `application/json; charset=utf-8`.
- Times: ISO-8601 UTC (`2026-08-12T17:46:00Z`). The client localizes (LOC-4).
- Coordinates: `lat`/`lon` decimal degrees WGS84; `tz` optional IANA hint.
- Pagination: `?cursor=` opaque + `next_cursor` in body; `limit` ≤ 100.
- Errors: RFC-9457 problem+json (`{type,title,status,detail}`); no stack traces ever.
- Caching is the design: every endpoint declares `Cache-Control` + `s-maxage` + SWR; countdown math is client-side so pages stay cacheable (PERF-3).
- Zod schemas are the single source of types (shared package) → OpenAPI generated from them (public API doc later).

## 2. Endpoints (MVP)

### Sky & events
| Endpoint | Params | Returns | Cache |
|---|---|---|---|
| `GET /api/v0/sky/tonight` | `lat, lon[, tz][, date]` | sun/moon times, darkness window, moon phase+illum, planets[] {rise,set,transit,alt,az,mag,constellation}, highlights[] (event refs), easy_wins[] | `s-maxage=300`, keyed to 0.1° grid |
| `GET /api/v0/sky/positions` | `lat, lon, t, bodies` | instantaneous alt/az/mag per body (powers the live strip when client lib unavailable) | 60 s |
| `GET /api/v0/events` | `from, to[, kinds][, lat,lon][, visible_only][, min_mag]` | event cards[] {slug,kind,peak_at,title,visibility_summary} | 1 h |
| `GET /api/v0/events/{slug}` | `[lat,lon]` | full event + local circumstances + involved entities + occurrence chain | 1 h |
| `GET /api/v0/events/{slug}/circumstances` | `lat, lon` | per-location numbers (eclipse contacts/obscuration %, shower radiant alt…) | 1 h, grid-keyed |

### Launches
| Endpoint | Params | Returns | Cache |
|---|---|---|---|
| `GET /api/v0/launches` | `[range=upcoming|past][, provider][, vehicle][, year][, cursor]` | launch cards[] {slug,name,net,status,vehicle,pad,provider,image} | 60 s upcoming / 1 d past |
| `GET /api/v0/launches/{slug}` | — | full launch + net_history + graph links + webcast | 60 s (10 s inside T-1h) |

### Graph / entities
| Endpoint | Params | Returns | Cache |
|---|---|---|---|
| `GET /api/v0/entities/{kind}/{slug}` | `[include=edges,media,news,events]` | entity bundle (DATA-MODEL §6.1 shape) | 1 h |
| `GET /api/v0/entities/{kind}` | `[facet filters][, cursor]` | hub listings | 1 h |
| `GET /api/v0/graph/neighbors` | `id, rels[], depth≤2` | edge neighborhood (powers related-content rails; later the copilot) | 1 h |

### News & search
| Endpoint | Params | Returns | Cache |
|---|---|---|---|
| `GET /api/v0/news` | `[entity][, topic][, source][, cursor]` | article cards[] (outbound URLs, source attribution) | 5 min |
| `GET /api/v0/search` | `q[, kinds]` | grouped hits: entities[], events[], launches[], articles[] | 5 min |
| `GET /api/v0/geo/places` | `q` \| `lat,lon` | gazetteer matches / nearest place (LOC-2) | 1 d |

### Feeds & meta
| Endpoint | Returns |
|---|---|
| `GET /calendar.ics` | Global ICS feed (headline events + launches); `X-WR-CALNAME: Orrery` — CAL-6. Per-user token feeds `[P6]`: `/ics/{token}.ics` |
| `GET /api/v0/status` | Connector freshness (public trust page data — OBS-2) |
| `GET /og/{kind}/{slug}.png` | Generated social image (SEO-3) |
| `POST /api/v0/jobs/{connector}` | **Internal only** — cron target, bearer-secret header, idempotent (ADR-003) |

## 3. Public-API graduation criteria (F1, later)
An endpoint moves into public `/api/v1` when: schema stable ≥ 2 months · documented · rate-limit + API-key metering wired · license of underlying data permits redistribution (Master Plan §9 — e.g., positions we compute: yes; raw Space-Track passthrough: never). The MCP server (F5) wraps the same v1 handlers as tools: `get_sky_tonight`, `search_entities`, `get_events`, `get_launches`, `get_entity`.
