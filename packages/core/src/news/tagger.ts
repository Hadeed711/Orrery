/**
 * News → graph entity tagging, `alias-dict@v0` (PRD NEWS-3).
 * Deterministic dictionary matching over the entity_aliases table:
 *   - whole-word matches only;
 *   - aliases with no lowercase letters (acronyms like JWST, M13, ISS) match
 *     case-sensitively so "dart" in prose never tags DART;
 *   - a title hit outranks an excerpt-only hit (salience 0.9 vs 0.5).
 */

export interface AliasRow {
  entityId: string;
  alias: string;
}

export interface EntityTag {
  entityId: string;
  salience: number;
  matchedAlias: string;
}

export const TAGGER_VERSION = "alias-dict@v0";

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

interface CompiledAlias {
  entityId: string;
  alias: string;
  re: RegExp;
}

/** Compile the dictionary once per run; reuse across a batch of articles. */
export function compileDict(dict: AliasRow[]): CompiledAlias[] {
  const compiled: CompiledAlias[] = [];
  for (const { entityId, alias } of dict) {
    const a = alias.trim();
    if (a.length < 2) continue;
    const caseSensitive = a === a.toUpperCase() && /[A-Z0-9]/.test(a);
    // \b fails at non-word edges (e.g. "1P/Halley"), so guard both ends manually.
    const re = new RegExp(
      `(?<![\\w-])${escapeRe(a)}(?![\\w-])`,
      caseSensitive ? "" : "i",
    );
    compiled.push({ entityId, alias: a, re });
  }
  return compiled;
}

export function tagArticle(
  title: string,
  excerpt: string | null | undefined,
  dict: CompiledAlias[],
): EntityTag[] {
  const best = new Map<string, EntityTag>();
  for (const { entityId, alias, re } of dict) {
    let salience = 0;
    if (re.test(title)) salience = 0.9;
    else if (excerpt && re.test(excerpt)) salience = 0.5;
    if (salience === 0) continue;
    const prev = best.get(entityId);
    if (!prev || salience > prev.salience) {
      best.set(entityId, { entityId, salience, matchedAlias: alias });
    }
  }
  return [...best.values()];
}

/**
 * Grouping key for near-duplicate stories (PRD NEWS-2): same headline via a
 * different aggregator/URL collapses to one key. FNV-1a over the normalized
 * title — stable, dependency-free, and cheap.
 */
export function dedupeKey(title: string): string {
  const norm = title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  let h = 0x811c9dc5;
  for (let i = 0; i < norm.length; i++) {
    h ^= norm.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return `t${h.toString(36)}`;
}
