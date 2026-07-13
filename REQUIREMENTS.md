# ORRERY — External Requirements (Accounts, Keys, Services, Decisions)

> Everything the owner must create, buy, decide, or hand over — mapped to the phase where it is first needed.
> **Rule:** all secrets go into `.env` files (never committed). I will tell you the exact variable name to paste each key into.
> **Right now (Phase 1–2): you need to provide NOTHING.** Review docs and make the Phase-2 decisions below.

---

## Decisions needed at the Phase 2 gate (no money, just answers)

| # | Decision | Options / notes |
|---|---|---|
| D1 | Product name | Keep "Orrery" (pending collision check I'll run in Phase 2) or pick alternates |
| D2 | Primary language | English recommended first; tell me if Urdu/others should be architected in sooner |
| D3 | Budget ceiling | $0/mo (free tiers, preview URL) vs ~$15–40/mo (real domain + paid DB later) |
| D4 | Your time budget | Hours/week you can review gates & test builds |
| D5 | Public or stealth | Deploy publicly from Phase 4, or keep preview-only until Phase 6 |

---

## Phase 3 — Walking Skeleton

| Item | Purpose | Cost | Where | Env var |
|---|---|---|---|---|
| **GitHub account + empty repo** | Source control, CI | Free | github.com | — |
| **Node.js LTS installed** (v20+) | Build/run locally on your PC | Free | nodejs.org (I can check/install via winget) | — |
| **Vercel account** (recommended) | Hosting + preview URLs | Free tier | vercel.com (sign in with GitHub) | — |
| **Neon account** (or Supabase) | Serverless Postgres | Free tier | neon.tech | `DATABASE_URL` |
| Command permissions | Let me run `npm`, `node`, `git` without prompts | Free | I'll request the specific allow-rules in chat at Phase 3 start | — |

No API keys needed: Launch Library 2, JPL Horizons, CelesTrak, NOAA SWPC all work keyless (rate-limited; we cache).

## Phase 4 — Calendar & Launch Center

| Item | Purpose | Cost | Where | Env var |
|---|---|---|---|---|
| Nothing new | Events are **computed locally** (astronomy-engine); launches from LL2 keyless | — | — | — |
| *(Optional)* The Space Devs supporter tier | Higher LL2 rate limits | ~$5/mo (optional) | thespacedevs.com | `LL2_API_KEY` |

## Phase 5 — Knowledge Pages & News

| Item | Purpose | Cost | Where | Env var |
|---|---|---|---|---|
| News ingestion | **Delivered keyless** via Spaceflight News API (SNAPI) — no account needed | Free | — | `SNAPI_BASE` (optional override) |
| Site origin | Sitemap/canonical/OG URLs on the deployed site | Free | Vercel project env | `SITE_URL` |
| **Domain name** | Public identity + SEO begins | ~$10–15/yr | Cloudflare Registrar / Namecheap | — |
| **Google Search Console** | Indexing + SEO monitoring | Free | search.google.com/search-console (needs domain) | — |
| *(Deferred)* NASA API key | APOD images, NeoWs, Mars photos — now planned for the media-enrichment pass | Free (instant email signup) | api.nasa.gov | `NASA_API_KEY` |
| *(Optional)* ADS API token | Paper links on object pages | Free | ui.adsabs.harvard.edu | `ADS_TOKEN` |

## Phase 6 — Beta Launch

| Item | Purpose | Cost | Where | Env var |
|---|---|---|---|---|
| **Resend account** (or Postmark) | Digest & auth emails | Free tier (≈3k/mo) | resend.com (needs domain DNS records) | `RESEND_API_KEY` |
| **Google OAuth credentials** | "Sign in with Google" | Free | console.cloud.google.com | `GOOGLE_CLIENT_ID/SECRET` |
| Web-push VAPID keys | Browser push alerts | Free (I generate them) | generated locally | `VAPID_*` |
| **Sentry account** | Error monitoring | Free tier | sentry.io | `SENTRY_DSN` |
| **PostHog** (or Plausible) | Privacy-friendly analytics | Free tier | posthog.com | `POSTHOG_KEY` |
| **Cloudflare account** | DNS, CDN, R2 storage later | Free | cloudflare.com | — |

## Phase 7+ tracks (only when we start each track)

| Track | Item | Cost | Notes |
|---|---|---|---|
| T1 Gear/affiliate | Amazon Associates + AvantLink/ShareASale (High Point, Agena…) | Free to apply | **Approval needs a live site with traffic — apply after Phase 6** |
| T2 Satellite passes | Space-Track account | Free | ToS: display/derive OK, no raw redistribution (we use CelesTrak for anything re-served) |
| T3 Community/UGC | astrometry.net API key; Cloudflare R2 bucket | Free / ~$0–5/mo | Plate solving + image storage |
| T3 Community/UGC | DMCA agent registration (US) | ~$6 one-time | Legal hygiene before hosting user media |
| T4 API/MCP | Stripe account | Free (2.9%+30¢/txn) | Needs business identity details |
| T5 Space weather | Nothing (NOAA is free) | — | Open-Meteo **paid tier** required once site is commercial (~€29/mo) |
| T6 AI Copilot | **Anthropic API key** | Pay-as-you-go (~$5 to start) | console.anthropic.com → `ANTHROPIC_API_KEY` |
| T7 Mobile apps | Apple Developer ($99/yr) + Google Play ($25 once) | Paid | Only when mobile track is green-lit |
| T7 Mobile | Expo account (EAS builds) | Free tier | expo.dev |
| Any | Mapbox key (or stay on MapLibre+OSM free) | Free tier | Only if map quality demands it |

---

## What you never need to provide
- Ephemerides/eclipse/meteor data — **we compute it ourselves** (that's the strategy).
- Star catalogs (Gaia/Hipparcos), MPC orbits, NASA/ESA/ESO imagery — public with attribution (license fields are built into the schema).
- Any scraping of competitor databases — deliberately avoided (see Master Plan §9.2).

## Standing security rules
1. Keys live in `.env.local` / host secrets manager; `.gitignore`d from commit #1.
2. Each key gets the least scope available; rotate anything ever pasted into chat.
3. Paid tiers are opt-in at gates only — nothing in Phases 3–6 requires spending beyond an optional domain (~$12/yr).
