/** Server-side graph queries for pages (DATA-MODEL §6 patterns). */
import { getDb } from "@orrery/core";
import { claims, edges, entities, eventsAstro, launches, sources } from "@orrery/core/schema";
import { and, asc, count, eq, gte, isNotNull } from "drizzle-orm";

export type EntityRow = typeof entities.$inferSelect;

/** IA §1 URL prefixes per entity kind. */
export function kindToPath(kind: string): string {
  const map: Record<string, string> = {
    object: "object", mission: "mission", telescope: "telescope", observatory: "telescope",
    vehicle: "rocket", pad: "pad", agency: "agency", company: "agency",
    launch: "launch", event: "event",
  };
  return map[kind] ?? "entity";
}

export async function upcomingLaunches(limit = 25) {
  const db = await getDb();
  return db
    .select({ entity: entities, launch: launches })
    .from(launches)
    .innerJoin(entities, eq(entities.id, launches.entityId))
    .where(and(isNotNull(launches.net), gte(launches.net, new Date(Date.now() - 12 * 3600_000))))
    .orderBy(asc(launches.net))
    .limit(limit);
}

export async function launchBySlug(slug: string) {
  const db = await getDb();
  const [row] = await db
    .select({ entity: entities, launch: launches })
    .from(entities)
    .innerJoin(launches, eq(launches.entityId, entities.id))
    .where(and(eq(entities.kind, "launch"), eq(entities.slug, slug)))
    .limit(1);
  if (!row) return null;
  const related = await edgesOut(row.entity.id);
  return { ...row, related };
}

export async function upcomingEvents(limit = 30) {
  const db = await getDb();
  return db
    .select({ entity: entities, event: eventsAstro })
    .from(eventsAstro)
    .innerJoin(entities, eq(entities.id, eventsAstro.entityId))
    .where(gte(eventsAstro.peakAt, new Date(Date.now() - 3600_000)))
    .orderBy(asc(eventsAstro.peakAt))
    .limit(limit);
}

export async function eventBySlug(slug: string) {
  const db = await getDb();
  const [row] = await db
    .select({ entity: entities, event: eventsAstro })
    .from(entities)
    .innerJoin(eventsAstro, eq(eventsAstro.entityId, entities.id))
    .where(and(eq(entities.kind, "event"), eq(entities.slug, slug)))
    .limit(1);
  if (!row) return null;
  const related = await edgesOut(row.entity.id);
  return { ...row, related };
}

export async function entityByKindSlug(kind: EntityRow["kind"], slug: string) {
  const db = await getDb();
  const [entity] = await db
    .select()
    .from(entities)
    .where(and(eq(entities.kind, kind), eq(entities.slug, slug)))
    .limit(1);
  if (!entity) return null;

  const facts = await db
    .select({ field: claims.field, value: claims.value, sourceName: sources.name, retrievedAt: claims.retrievedAt })
    .from(claims)
    .leftJoin(sources, eq(sources.id, claims.sourceId))
    .where(eq(claims.entityId, entity.id));

  return { entity, facts, edgesOut: await edgesOut(entity.id), edgesIn: await edgesIn(entity.id) };
}

async function edgesOut(id: string) {
  const db = await getDb();
  return db
    .select({ rel: edges.rel, name: entities.name, slug: entities.slug, kind: entities.kind })
    .from(edges)
    .innerJoin(entities, eq(entities.id, edges.dstId))
    .where(eq(edges.srcId, id));
}

async function edgesIn(id: string) {
  const db = await getDb();
  return db
    .select({ rel: edges.rel, name: entities.name, slug: entities.slug, kind: entities.kind })
    .from(edges)
    .innerJoin(entities, eq(entities.id, edges.srcId))
    .where(eq(edges.dstId, id));
}

export async function statusOverview() {
  const db = await getDb();
  const srcs = await db.select().from(sources).orderBy(asc(sources.tier), asc(sources.key));
  const [ents] = await db.select({ n: count() }).from(entities);
  const [lns] = await db.select({ n: count() }).from(launches);
  const [evs] = await db.select({ n: count() }).from(eventsAstro);
  return { sources: srcs, counts: { entities: ents?.n ?? 0, launches: lns?.n ?? 0, events: evs?.n ?? 0 } };
}
