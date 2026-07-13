/**
 * Seeds the hand-curated knowledge catalog (Phase 5): entities, claims,
 * aliases, external ids in pass 1; graph edges in pass 2 so forward
 * references resolve. Idempotent like everything else in the pipeline.
 */
import type { Db } from "../db/client";
import { addAliases, ensureEdge, setClaim, upsertEntityBySlug } from "../db/repo";
import { externalIds } from "../db/schema";
import { AGENCIES } from "./data/agencies";
import { DEEP_SKY } from "./data/deepsky";
import { MISSIONS } from "./data/missions";
import { SOLAR_SYSTEM } from "./data/objects";
import { OBSERVATORIES } from "./data/observatories";
import type { CatalogEntry } from "./data/types";
import { VEHICLES } from "./data/vehicles";

/** Order matters only for readability; edges resolve in a second pass. */
export const CATALOG: CatalogEntry[] = [
  ...AGENCIES,
  ...SOLAR_SYSTEM,
  ...DEEP_SKY,
  ...OBSERVATORIES,
  ...VEHICLES,
  ...MISSIONS,
];

/**
 * @param knownIds pre-seeded entity ids keyed `${kind}:${slug}` (the Phase-3
 *   planets), so mission `targets` edges can point at them.
 */
export async function seedCatalog(
  db: Db,
  editorialSourceId: string,
  knownIds: Map<string, string>,
): Promise<{ entities: number; edges: number }> {
  const ids = new Map(knownIds);

  for (const e of CATALOG) {
    const id = await upsertEntityBySlug(db, {
      kind: e.kind,
      slug: e.slug,
      name: e.name,
      summary: e.summary,
      attrs: { ...(e.cls ? { class: e.cls } : {}), ...e.attrs },
      completeness: 55,
    });
    ids.set(`${e.kind}:${e.slug}`, id);

    const aliases = [...(e.noNameAlias ? [] : [e.name]), ...(e.aliases ?? [])];
    await addAliases(db, id, aliases);

    for (const [field, value] of Object.entries(e.facts ?? {})) {
      await setClaim(db, id, field, value, editorialSourceId, 0.9);
    }
    for (const [system, value] of Object.entries(e.externalIds ?? {})) {
      await db.insert(externalIds).values({ entityId: id, system, value }).onConflictDoNothing();
    }
  }

  let edgeCount = 0;
  for (const e of CATALOG) {
    const src = ids.get(`${e.kind}:${e.slug}`)!;
    for (const [rel, kind, slug] of e.edges ?? []) {
      const dst = ids.get(`${kind}:${slug}`);
      if (!dst) {
        console.warn(`catalog: unresolved edge target ${kind}:${slug} (from ${e.kind}:${e.slug})`);
        continue;
      }
      await ensureEdge(db, src, rel, dst, {}, editorialSourceId);
      edgeCount++;
    }
  }

  return { entities: CATALOG.length, edges: edgeCount };
}
