/** Server-side graph queries for pages (DATA-MODEL §6 patterns). */
import { getDb } from "@orrery/core";
import {
  articleEntities,
  articles,
  claims,
  edges,
  entities,
  eventsAstro,
  follows,
  launches,
  sources,
} from "@orrery/core/schema";
import { and, asc, count, desc, eq, gte, inArray, isNotNull, sql } from "drizzle-orm";

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

// ── news (PRD NEWS) ─────────────────────────────────────────────

const articleCols = {
  id: articles.id,
  url: articles.url,
  title: articles.title,
  excerpt: articles.excerpt,
  imageUrl: articles.imageUrl,
  publishedAt: articles.publishedAt,
  sourceName: sources.name,
};

export async function latestNews(limit = 40) {
  const db = await getDb();
  const rows = await db
    .select(articleCols)
    .from(articles)
    .innerJoin(sources, eq(sources.id, articles.sourceId))
    .orderBy(desc(articles.publishedAt))
    .limit(limit);
  return withArticleTags(rows);
}

/** Topic feed: "all news about JWST" = join through article_entities (DATA-MODEL §6). */
export async function newsForEntity(entityId: string, limit = 10) {
  const db = await getDb();
  return db
    .select(articleCols)
    .from(articleEntities)
    .innerJoin(articles, eq(articles.id, articleEntities.articleId))
    .innerJoin(sources, eq(sources.id, articles.sourceId))
    .where(eq(articleEntities.entityId, entityId))
    .orderBy(desc(articles.publishedAt))
    .limit(limit);
}

export type ArticleTag = { articleId: string; name: string; slug: string; kind: string };

/** Entity chips under each headline — one grouped query for the whole feed. */
async function withArticleTags<T extends { id: string }>(rows: T[]) {
  if (rows.length === 0) return rows.map((a) => ({ ...a, tags: [] as ArticleTag[] }));
  const db = await getDb();
  const tags = await db
    .select({
      articleId: articleEntities.articleId,
      name: entities.name,
      slug: entities.slug,
      kind: entities.kind,
      salience: articleEntities.salience,
    })
    .from(articleEntities)
    .innerJoin(entities, eq(entities.id, articleEntities.entityId))
    .where(inArray(articleEntities.articleId, rows.map((r) => r.id)))
    .orderBy(desc(articleEntities.salience));
  const byArticle = new Map<string, ArticleTag[]>();
  for (const t of tags) {
    const list = byArticle.get(t.articleId) ?? [];
    if (list.length < 4) list.push(t);
    byArticle.set(t.articleId, list);
  }
  return rows.map((a) => ({ ...a, tags: byArticle.get(a.id) ?? [] }));
}

// ── search v0: Postgres FTS with kind boosting (DATA-MODEL §6.5) ──

const KIND_BOOST: Record<string, number> = {
  object: 1.3, mission: 1.2, telescope: 1.2, observatory: 1.1, vehicle: 1.1,
  agency: 1.0, event: 0.9, launch: 0.8, pad: 0.7,
};

export interface SearchHit {
  kind: string;
  slug: string;
  name: string;
  summary: string | null;
  rank: number;
}

export async function searchEntities(q: string, limit = 20): Promise<SearchHit[]> {
  const db = await getDb();
  const doc = sql`to_tsvector('english', ${entities.name} || ' ' || coalesce(${entities.summary}, ''))`;
  const tsq = sql`websearch_to_tsquery('english', ${q})`;
  const rows = await db
    .select({
      kind: entities.kind,
      slug: entities.slug,
      name: entities.name,
      summary: entities.summary,
      rank: sql<number>`ts_rank(${doc}, ${tsq})`,
    })
    .from(entities)
    .where(sql`${doc} @@ ${tsq}`)
    .limit(60);
  // Alias hits (e.g. "M31", "Webb") that FTS over name+summary can miss.
  const aliasRows = await db
    .select({ kind: entities.kind, slug: entities.slug, name: entities.name, summary: entities.summary })
    .from(entities)
    .where(
      sql`${entities.id} in (select entity_id from entity_aliases where lower(alias) = lower(${q}))`,
    )
    .limit(10);
  const seen = new Set(rows.map((r) => `${r.kind}:${r.slug}`));
  const merged: SearchHit[] = [
    ...aliasRows.filter((r) => !seen.has(`${r.kind}:${r.slug}`)).map((r) => ({ ...r, rank: 1 })),
    ...rows,
  ];
  return merged
    .map((r) => ({ ...r, rank: r.rank * (KIND_BOOST[r.kind] ?? 1) }))
    .sort((a, b) => b.rank - a.rank)
    .slice(0, limit);
}

export async function searchArticles(q: string, limit = 10) {
  const db = await getDb();
  const doc = sql`to_tsvector('english', ${articles.title} || ' ' || coalesce(${articles.excerpt}, ''))`;
  const tsq = sql`websearch_to_tsquery('english', ${q})`;
  return db
    .select({ ...articleCols, rank: sql<number>`ts_rank(${doc}, ${tsq})` })
    .from(articles)
    .innerJoin(sources, eq(sources.id, articles.sourceId))
    .where(sql`${doc} @@ ${tsq}`)
    .orderBy(sql`ts_rank(${doc}, ${tsq}) desc`, desc(articles.publishedAt))
    .limit(limit);
}

// ── catalog browse indexes ──────────────────────────────────────

export async function entitiesForKinds(kinds: EntityRow["kind"][]) {
  const db = await getDb();
  return db
    .select({
      kind: entities.kind,
      slug: entities.slug,
      name: entities.name,
      summary: entities.summary,
      attrs: entities.attrs,
    })
    .from(entities)
    .where(inArray(entities.kind, kinds))
    .orderBy(asc(entities.name));
}

// ── follows + personalized feed (Phase 6) ───────────────────────

export async function followsForUser(userId: string) {
  const db = await getDb();
  return db
    .select({ id: entities.id, kind: entities.kind, slug: entities.slug, name: entities.name })
    .from(follows)
    .innerJoin(entities, eq(entities.id, follows.entityId))
    .where(eq(follows.userId, userId))
    .orderBy(asc(entities.name));
}

export async function isFollowing(userId: string, entityId: string): Promise<boolean> {
  const db = await getDb();
  const [row] = await db
    .select({ entityId: follows.entityId })
    .from(follows)
    .where(and(eq(follows.userId, userId), eq(follows.entityId, entityId)))
    .limit(1);
  return Boolean(row);
}

/** Latest news mentioning any followed entity (grouped tags included). */
export async function newsForEntities(entityIds: string[], limit = 30) {
  if (entityIds.length === 0) return [];
  const db = await getDb();
  const rows = await db
    .selectDistinctOn([articles.publishedAt, articles.id], articleCols)
    .from(articleEntities)
    .innerJoin(articles, eq(articles.id, articleEntities.articleId))
    .innerJoin(sources, eq(sources.id, articles.sourceId))
    .where(inArray(articleEntities.entityId, entityIds))
    .orderBy(desc(articles.publishedAt), desc(articles.id))
    .limit(limit);
  return withArticleTags(rows);
}

/**
 * Upcoming launches connected to any followed entity by a graph edge
 * (launch —used_vehicle→ rocket, —operated_by→ agency, —launched_from→ pad).
 */
export async function upcomingLaunchesForEntities(entityIds: string[], limit = 15) {
  if (entityIds.length === 0) return [];
  const db = await getDb();
  return db
    .selectDistinctOn([launches.net, entities.id], { entity: entities, launch: launches })
    .from(edges)
    .innerJoin(launches, eq(launches.entityId, edges.srcId))
    .innerJoin(entities, eq(entities.id, launches.entityId))
    .where(
      and(
        inArray(edges.dstId, entityIds),
        isNotNull(launches.net),
        gte(launches.net, new Date(Date.now() - 3600_000)),
      ),
    )
    .orderBy(asc(launches.net), asc(entities.id))
    .limit(limit);
}

/** Upcoming sky events that involve a followed object (event —involves→ object). */
export async function upcomingEventsForEntities(entityIds: string[], limit = 15) {
  if (entityIds.length === 0) return [];
  const db = await getDb();
  return db
    .selectDistinctOn([eventsAstro.peakAt, entities.id], { entity: entities, event: eventsAstro })
    .from(edges)
    .innerJoin(eventsAstro, eq(eventsAstro.entityId, edges.srcId))
    .innerJoin(entities, eq(entities.id, eventsAstro.entityId))
    .where(and(inArray(edges.dstId, entityIds), gte(eventsAstro.peakAt, new Date(Date.now() - 3600_000))))
    .orderBy(asc(eventsAstro.peakAt), asc(entities.id))
    .limit(limit);
}

export async function statusOverview() {
  const db = await getDb();
  const srcs = await db.select().from(sources).orderBy(asc(sources.tier), asc(sources.key));
  const [ents] = await db.select({ n: count() }).from(entities);
  const [lns] = await db.select({ n: count() }).from(launches);
  const [evs] = await db.select({ n: count() }).from(eventsAstro);
  return { sources: srcs, counts: { entities: ents?.n ?? 0, launches: lns?.n ?? 0, events: evs?.n ?? 0 } };
}
