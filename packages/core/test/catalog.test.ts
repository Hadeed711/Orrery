import { describe, expect, it } from "vitest";
import { CATALOG } from "../src/seed/catalog";
import { DEEP_SKY } from "../src/seed/data/deepsky";

describe("seeded catalog integrity", () => {
  it("has no duplicate (kind, slug)", () => {
    const seen = new Set<string>();
    for (const e of CATALOG) {
      const key = `${e.kind}:${e.slug}`;
      expect(seen.has(key), `duplicate ${key}`).toBe(false);
      seen.add(key);
    }
  });

  it("contains the complete Messier catalog (M1–M110)", () => {
    const ms = new Set(
      DEEP_SKY.filter((e) => typeof e.attrs?.messier === "number").map((e) => e.attrs!.messier),
    );
    expect(ms.size).toBe(110);
    for (let i = 1; i <= 110; i++) expect(ms.has(i), `missing M${i}`).toBe(true);
  });

  it("resolves every internal edge target (planets come from the base seed)", () => {
    const keys = new Set(CATALOG.map((e) => `${e.kind}:${e.slug}`));
    const baseSeed = ["sun", "mercury", "venus", "earth", "moon", "mars", "jupiter", "saturn", "uranus", "neptune", "titan"];
    for (const s of baseSeed) keys.add(`object:${s}`);
    for (const e of CATALOG) {
      for (const [, kind, slug] of e.edges ?? []) {
        expect(keys.has(`${kind}:${slug}`), `${e.kind}:${e.slug} → unresolved ${kind}:${slug}`).toBe(true);
      }
    }
  });

  it("every entry has a summary and every risky name is excluded from tagging", () => {
    for (const e of CATALOG) {
      expect(e.summary.length, `${e.slug} summary`).toBeGreaterThan(20);
      if (e.noNameAlias) {
        expect((e.aliases ?? []).length, `${e.slug} needs safe aliases if name is untaggable`).toBeGreaterThan(0);
      }
    }
  });

  it("is a real catalog, not a stub (PRD scale targets)", () => {
    const byKind = new Map<string, number>();
    for (const e of CATALOG) byKind.set(e.kind, (byKind.get(e.kind) ?? 0) + 1);
    expect(byKind.get("object")!).toBeGreaterThanOrEqual(150); // 126 deep-sky + moons/dwarfs
    expect(byKind.get("mission")!).toBeGreaterThanOrEqual(70);
    expect((byKind.get("telescope") ?? 0) + (byKind.get("observatory") ?? 0)).toBeGreaterThanOrEqual(30);
    expect(byKind.get("vehicle")!).toBeGreaterThanOrEqual(15);
  });
});
