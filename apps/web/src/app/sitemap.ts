import type { MetadataRoute } from "next";
import { getDb } from "@orrery/core";
import { entities } from "@orrery/core/schema";
import { isNull } from "drizzle-orm";
import { kindToPath } from "@/lib/queries";

export const dynamic = "force-dynamic";

/** Every graph entity is a page; the sitemap is a DB query, not a hand list (IA §3). */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.SITE_URL ?? "http://localhost:3000";
  const db = await getDb();
  const rows = await db
    .select({ kind: entities.kind, slug: entities.slug, updatedAt: entities.updatedAt })
    .from(entities)
    .where(isNull(entities.deletedAt));

  const statics: MetadataRoute.Sitemap = [
    "", "/calendar", "/launches", "/news", "/objects", "/missions", "/telescopes", "/rockets", "/search",
    "/companies", "/apps", "/apod", "/mission-builder", "/community",
  ].map((p) => ({ url: `${base}${p || "/"}`, changeFrequency: "daily" as const, priority: p === "" ? 1 : 0.8 }));

  const entityUrls: MetadataRoute.Sitemap = rows.map((r) => ({
    url: `${base}/${kindToPath(r.kind)}/${r.slug}`,
    lastModified: r.updatedAt,
    changeFrequency: r.kind === "launch" || r.kind === "event" ? ("daily" as const) : ("weekly" as const),
    priority: r.kind === "object" || r.kind === "mission" || r.kind === "telescope" ? 0.7 : 0.5,
  }));

  return [...statics, ...entityUrls];
}
