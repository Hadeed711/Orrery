/**
 * Connector #1 — Launch Library 2 (The Space Devs).
 * Keyless free tier (~15 req/hr): ONE list request per run, cached aggressively upstream of us.
 * Idempotent per v1 §3.2: resolves entities via external_ids, appends NET slips to net_history (PRD LNCH-4).
 * Interim launch slugs are `ll2-<uuid>` per IA §2 (date-slug minting + redirects arrive in Phase 4).
 */
import { z } from "zod";
import {
  ensureEdge,
  getDb,
  slugify,
  touchSource,
  upsertEntityByExternalId,
  upsertLaunchRow,
} from "@orrery/core";
import { launches } from "@orrery/core/schema";
import { eq } from "drizzle-orm";

const LL2_BASE = process.env.LL2_BASE ?? "https://ll.thespacedevs.com/2.2.0";

const Launch = z.object({
  id: z.string(),
  name: z.string(),
  status: z.object({ abbrev: z.string() }).nullish(),
  net: z.string().nullish(),
  window_start: z.string().nullish(),
  window_end: z.string().nullish(),
  image: z.string().nullish(),
  launch_service_provider: z.object({ id: z.number(), name: z.string() }).nullish(),
  rocket: z
    .object({ configuration: z.object({ id: z.number(), name: z.string(), full_name: z.string().nullish() }).nullish() })
    .nullish(),
  pad: z
    .object({
      id: z.number(),
      name: z.string(),
      location: z.object({ name: z.string().nullish() }).nullish(),
    })
    .nullish(),
  mission: z.object({ name: z.string().nullish(), description: z.string().nullish() }).nullish(),
});
const Page = z.object({ results: z.array(Launch) });

const toDate = (s: string | null | undefined): Date | null => (s ? new Date(s) : null);

export async function syncLaunchLibrary(limit = 30): Promise<{ synced: number }> {
  const url = `${LL2_BASE}/launch/upcoming/?limit=${limit}`;
  const headers: Record<string, string> = { accept: "application/json" };
  if (process.env.LL2_API_KEY) headers.authorization = `Token ${process.env.LL2_API_KEY}`;

  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(`LL2 ${res.status} ${res.statusText}${res.status === 429 ? " (rate limited — free tier is ~15 req/hr)" : ""}`);
  }
  const page = Page.parse(await res.json());
  const db = await getDb();
  const now = new Date();

  for (const l of page.results) {
    // ── related entities first (agency, vehicle, pad) ───────────
    let agencyId: string | null = null;
    if (l.launch_service_provider) {
      agencyId = await upsertEntityByExternalId(db, "ll2-agency", String(l.launch_service_provider.id), {
        kind: "agency",
        slug: slugify(l.launch_service_provider.name),
        name: l.launch_service_provider.name,
      });
    }
    let vehicleId: string | null = null;
    const cfg = l.rocket?.configuration;
    if (cfg) {
      vehicleId = await upsertEntityByExternalId(db, "ll2-config", String(cfg.id), {
        kind: "vehicle",
        slug: slugify(cfg.name),
        name: cfg.full_name ?? cfg.name,
      });
    }
    let padId: string | null = null;
    if (l.pad) {
      const locality = l.pad.location?.name?.split(",")[0]?.trim() ?? "";
      padId = await upsertEntityByExternalId(db, "ll2-pad", String(l.pad.id), {
        kind: "pad",
        slug: slugify(`${l.pad.name} ${locality}`),
        name: l.pad.name,
        attrs: { location: l.pad.location?.name ?? null },
      });
    }

    // ── the launch entity + typed row ───────────────────────────
    const launchEntityId = await upsertEntityByExternalId(db, "ll2", l.id, {
      kind: "launch",
      slug: `ll2-${l.id}`,
      name: l.name,
      summary: l.mission?.description?.slice(0, 400) ?? null,
      attrs: { imageUrl: l.image ?? null, missionName: l.mission?.name ?? null },
      completeness: 55,
    });

    const net = toDate(l.net);
    const prev = await db
      .select({ net: launches.net, netHistory: launches.netHistory })
      .from(launches)
      .where(eq(launches.entityId, launchEntityId))
      .limit(1);

    const history = prev[0]?.netHistory ?? [];
    const prevNetIso = prev[0]?.net ? prev[0].net.toISOString() : null;
    const nextNetIso = net ? net.toISOString() : null;
    if (prevNetIso !== nextNetIso || history.length === 0) {
      history.push({ net: nextNetIso, changedAt: now.toISOString() });
    }

    await upsertLaunchRow(db, {
      entityId: launchEntityId,
      ll2Id: l.id,
      status: slugify(l.status?.abbrev ?? "tbd"),
      net,
      windowStart: toDate(l.window_start),
      windowEnd: toDate(l.window_end),
      webcastUrl: null,
      netHistory: history,
      raw: l as unknown as Record<string, unknown>,
      syncedAt: now,
    });

    if (vehicleId) await ensureEdge(db, launchEntityId, "used_vehicle", vehicleId);
    if (padId) await ensureEdge(db, launchEntityId, "launched_from", padId);
    if (agencyId) await ensureEdge(db, launchEntityId, "operated_by", agencyId);
  }

  await touchSource(db, "ll2");
  return { synced: page.results.length };
}
