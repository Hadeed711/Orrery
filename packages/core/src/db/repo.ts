/**
 * Idempotent graph-write helpers (DATA-MODEL section 7, entity-resolution policy v0):
 * connectors resolve via external_ids before creating; seeds resolve via (kind, slug).
 * Every helper is safe to re-run — the whole pipeline must be idempotent (v1 section 3.2).
 */
import { and, eq } from "drizzle-orm";
import type { Db } from "./client";
import { claims, edges, entities, externalIds, launches, eventsAstro, sources } from "./schema";

type EntityKind = (typeof entities.$inferInsert)["kind"];
type EdgeRel = (typeof edges.$inferInsert)["rel"];

export interface EntitySpec {
  kind: EntityKind;
  slug: string;
  name: string;
  summary?: string | null;
  attrs?: Record<string, unknown>;
  completeness?: number;
}

export async function upsertSource(
  db: Db,
  spec: { key: string; name: string; homepage?: string; tier?: number; license?: string; pollSecs?: number },
): Promise<string> {
  const [row] = await db
    .insert(sources)
    .values(spec)
    .onConflictDoUpdate({
      target: sources.key,
      set: { name: spec.name, homepage: spec.homepage, tier: spec.tier, license: spec.license },
    })
    .returning({ id: sources.id });
  return row!.id;
}

export async function touchSource(db: Db, key: string): Promise<void> {
  await db.update(sources).set({ lastSuccessAt: new Date() }).where(eq(sources.key, key));
}

export async function upsertEntityBySlug(db: Db, spec: EntitySpec): Promise<string> {
  const [row] = await db
    .insert(entities)
    .values({ ...spec, attrs: spec.attrs ?? {} })
    .onConflictDoUpdate({
      target: [entities.kind, entities.slug],
      set: {
        name: spec.name,
        summary: spec.summary ?? undefined,
        attrs: spec.attrs ?? undefined,
        completeness: spec.completeness ?? undefined,
        updatedAt: new Date(),
      },
    })
    .returning({ id: entities.id });
  return row!.id;
}

/** Connector path: resolve by (system, value) first so renames upstream never mint duplicates. */
export async function upsertEntityByExternalId(
  db: Db,
  system: string,
  value: string,
  spec: EntitySpec,
): Promise<string> {
  const existing = await db
    .select({ entityId: externalIds.entityId })
    .from(externalIds)
    .where(and(eq(externalIds.system, system), eq(externalIds.value, value)))
    .limit(1);

  if (existing[0]) {
    const id = existing[0].entityId;
    await db
      .update(entities)
      .set({ name: spec.name, summary: spec.summary ?? undefined, attrs: spec.attrs ?? undefined, updatedAt: new Date() })
      .where(eq(entities.id, id));
    return id;
  }

  const id = await upsertEntityBySlug(db, spec);
  await db.insert(externalIds).values({ entityId: id, system, value }).onConflictDoNothing();
  return id;
}

export async function ensureEdge(
  db: Db,
  srcId: string,
  rel: EdgeRel,
  dstId: string,
  attrs: Record<string, unknown> = {},
  sourceId?: string,
): Promise<void> {
  await db.insert(edges).values({ srcId, rel, dstId, attrs, sourceId }).onConflictDoNothing();
}

/** One current claim per (entity, field): update-in-place keeps provenance fresh (coarse MVP policy). */
export async function setClaim(
  db: Db,
  entityId: string,
  field: string,
  value: unknown,
  sourceId?: string,
  confidence = 1,
): Promise<void> {
  const existing = await db
    .select({ id: claims.id })
    .from(claims)
    .where(and(eq(claims.entityId, entityId), eq(claims.field, field)))
    .limit(1);
  if (existing[0]) {
    await db
      .update(claims)
      .set({ value, sourceId, confidence, retrievedAt: new Date() })
      .where(eq(claims.id, existing[0].id));
  } else {
    await db.insert(claims).values({ entityId, field, value, sourceId, confidence });
  }
}

export async function upsertLaunchRow(
  db: Db,
  row: typeof launches.$inferInsert,
): Promise<void> {
  await db
    .insert(launches)
    .values(row)
    .onConflictDoUpdate({
      target: launches.entityId,
      set: {
        status: row.status,
        net: row.net,
        windowStart: row.windowStart,
        windowEnd: row.windowEnd,
        webcastUrl: row.webcastUrl,
        netHistory: row.netHistory,
        raw: row.raw,
        syncedAt: row.syncedAt,
      },
    });
}

export async function upsertEventRow(db: Db, row: typeof eventsAstro.$inferInsert): Promise<void> {
  await db
    .insert(eventsAstro)
    .values(row)
    .onConflictDoUpdate({
      target: eventsAstro.entityId,
      set: {
        peakAt: row.peakAt,
        startsAt: row.startsAt,
        endsAt: row.endsAt,
        magnitude: row.magnitude,
        visibility: row.visibility,
        computedBy: row.computedBy,
        computedAt: row.computedAt,
      },
    });
}
