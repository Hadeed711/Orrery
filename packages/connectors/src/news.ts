/**
 * Connector #3 — space news via Spaceflight News API v4 (SNAPI, The Space Devs).
 * Keyless and free; aggregates the ~50 quality outlets (NASA, ESA, SpaceNews,
 * NASASpaceflight, Ars Technica, …) so we get the PRD's source coverage with
 * one dependable JSON feed. Direct per-outlet RSS can join later without
 * schema changes — every article already carries its real outlet as a source.
 *
 * Pipeline per PRD NEWS-1..3: fetch → canonicalize → dedupe (url unique +
 * normalized-title key) → tag with graph entities via the alias dictionary.
 * Idempotent like every connector.
 */
import { z } from "zod";
import {
  compileDict,
  dedupeKey,
  getDb,
  slugify,
  tagArticle,
  touchSource,
  upsertSource,
  TAGGER_VERSION,
} from "@orrery/core";
import { articles, articleEntities, entityAliases } from "@orrery/core/schema";
import { eq, inArray } from "drizzle-orm";

const SNAPI_BASE = process.env.SNAPI_BASE ?? "https://api.spaceflightnewsapi.net/v4";

const SnapiArticle = z.object({
  id: z.number(),
  title: z.string(),
  url: z.string(),
  image_url: z.string().nullish(),
  news_site: z.string(),
  summary: z.string().nullish(),
  published_at: z.string(),
});
const SnapiPage = z.object({ results: z.array(SnapiArticle) });

/** Strip tracking params so the unique-url constraint actually dedupes. */
export function canonicalUrl(raw: string): string {
  try {
    const u = new URL(raw);
    u.hash = "";
    for (const k of [...u.searchParams.keys()]) {
      if (/^(utm_|fbclid|gclid|mc_cid|mc_eid|ref$)/.test(k)) u.searchParams.delete(k);
    }
    return u.toString();
  } catch {
    return raw;
  }
}

export async function syncNews(limit = 100): Promise<{ fetched: number; inserted: number; tagged: number }> {
  const res = await fetch(`${SNAPI_BASE}/articles/?limit=${limit}&ordering=-published_at`, {
    headers: { accept: "application/json" },
  });
  if (!res.ok) throw new Error(`SNAPI ${res.status} ${res.statusText}`);
  const page = SnapiPage.parse(await res.json());

  const db = await getDb();
  await upsertSource(db, {
    key: "snapi",
    name: "Spaceflight News API — The Space Devs",
    homepage: "https://spaceflightnewsapi.net",
    tier: 2,
    license: "free-api",
    pollSecs: 1800,
  });

  // Alias dictionary → compiled matchers, once per run.
  const dictRows = await db
    .select({ entityId: entityAliases.entityId, alias: entityAliases.alias })
    .from(entityAliases);
  const dict = compileDict(dictRows);

  // Existing urls/dedupe keys in one query each — the batch is small (≤100).
  const urls = page.results.map((a) => canonicalUrl(a.url));
  const existing = urls.length
    ? await db.select({ url: articles.url }).from(articles).where(inArray(articles.url, urls))
    : [];
  const seenUrls = new Set(existing.map((r) => r.url));

  const outletIds = new Map<string, string>();
  let inserted = 0;
  let tagged = 0;

  for (const a of page.results) {
    const url = canonicalUrl(a.url);
    if (seenUrls.has(url)) continue;

    // Each outlet is a real row in the sources registry (tier 3, via aggregator).
    let sourceId = outletIds.get(a.news_site);
    if (!sourceId) {
      sourceId = await upsertSource(db, {
        key: `news-${slugify(a.news_site)}`,
        name: a.news_site,
        tier: 3,
        license: "linked-headline",
      });
      outletIds.set(a.news_site, sourceId);
    }

    const key = dedupeKey(a.title);
    const dupe = await db
      .select({ id: articles.id })
      .from(articles)
      .where(eq(articles.dedupeKey, key))
      .limit(1);
    if (dupe[0]) continue; // same story from another outlet/url (NEWS-2)

    const excerpt = a.summary?.trim().slice(0, 500) || null;
    const [row] = await db
      .insert(articles)
      .values({
        sourceId,
        url,
        title: a.title.trim(),
        excerpt,
        imageUrl: a.image_url ?? null,
        publishedAt: new Date(a.published_at),
        dedupeKey: key,
      })
      .onConflictDoNothing({ target: articles.url })
      .returning({ id: articles.id });
    if (!row) continue;
    inserted++;
    seenUrls.add(url);

    const tags = tagArticle(a.title, excerpt, dict);
    if (tags.length) {
      await db
        .insert(articleEntities)
        .values(
          tags.map((t) => ({
            articleId: row.id,
            entityId: t.entityId,
            salience: t.salience,
            matchedBy: TAGGER_VERSION,
          })),
        )
        .onConflictDoNothing();
      tagged += tags.length;
    }
  }

  await touchSource(db, "snapi");
  return { fetched: page.results.length, inserted, tagged };
}
