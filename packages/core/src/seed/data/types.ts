/** Shared shape for hand-curated catalog seed data (Phase 5, PRD ENT). */

export type CatalogKind =
  | "object" | "mission" | "spacecraft" | "telescope" | "observatory"
  | "vehicle" | "agency" | "company";

export type CatalogRel =
  | "orbits" | "moon_of" | "part_of" | "carries" | "operated_by" | "built_by"
  | "used_vehicle" | "successor_of" | "targets" | "involves";

export interface CatalogEntry {
  kind: CatalogKind;
  slug: string;
  name: string;
  summary: string;
  /** attrs.class shown as the page eyebrow (e.g. "moon", "globular-cluster", "rover"). */
  cls?: string;
  attrs?: Record<string, unknown>;
  /** Displayed as provenance-tracked claims on the entity page. */
  facts?: Record<string, string | number>;
  /**
   * News-tagging + search dictionary. The entity name is auto-added unless
   * `noNameAlias` — set it when the bare name is ambiguous in prose
   * ("Spirit", "Hope", "Dawn") and provide safe multi-word aliases instead.
   */
  aliases?: string[];
  noNameAlias?: boolean;
  /** Graph edges to other catalog entries, addressed as [rel, kind, slug]. */
  edges?: [CatalogRel, CatalogKind, string][];
  /** external_ids rows, e.g. { messier: "31", ngc: "224" }. */
  externalIds?: Record<string, string>;
}
