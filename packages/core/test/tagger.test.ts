import { describe, expect, it } from "vitest";
import { compileDict, dedupeKey, tagArticle } from "../src/news/tagger";

const dict = compileDict([
  { entityId: "jwst", alias: "JWST" },
  { entityId: "jwst", alias: "Webb telescope" },
  { entityId: "jwst", alias: "James Webb Space Telescope" },
  { entityId: "dart", alias: "DART" },
  { entityId: "europa", alias: "Europa" },
  { entityId: "m13", alias: "M13" },
  { entityId: "iss", alias: "ISS" },
  { entityId: "falcon9", alias: "Falcon 9" },
]);

describe("alias-dict tagger", () => {
  it("tags title matches with high salience", () => {
    const tags = tagArticle("JWST spots earliest galaxy yet", null, dict);
    expect(tags).toEqual([{ entityId: "jwst", salience: 0.9, matchedAlias: "JWST" }]);
  });

  it("tags excerpt-only matches with lower salience", () => {
    const tags = tagArticle("A big week in astronomy", "New results from the Webb telescope amazed everyone.", dict);
    expect(tags).toEqual([{ entityId: "jwst", salience: 0.5, matchedAlias: "Webb telescope" }]);
  });

  it("acronyms match case-sensitively — 'dart' in prose is not DART", () => {
    expect(tagArticle("Team plays darts after launch", "a dart hit the board", dict)).toEqual([]);
    expect(tagArticle("DART changed an asteroid's orbit", null, dict)).toHaveLength(1);
  });

  it("matches whole words only", () => {
    expect(tagArticle("European market update", null, dict)).toEqual([]); // no Europa
    expect(tagArticle("Europa Clipper passes review", null, dict)).toHaveLength(1);
    expect(tagArticle("M130 spectrometer shipped", null, dict)).toEqual([]); // no M13
  });

  it("multi-word and case-insensitive aliases work", () => {
    const tags = tagArticle("falcon 9 launches again", null, dict);
    expect(tags).toEqual([{ entityId: "falcon9", salience: 0.9, matchedAlias: "Falcon 9" }]);
  });

  it("keeps the best salience per entity", () => {
    const tags = tagArticle("JWST update", "the James Webb Space Telescope keeps delivering", dict);
    expect(tags).toEqual([{ entityId: "jwst", salience: 0.9, matchedAlias: "JWST" }]);
  });
});

describe("dedupeKey", () => {
  it("collapses punctuation/case variants of the same headline", () => {
    expect(dedupeKey("SpaceX launches 23 Starlink satellites!")).toBe(
      dedupeKey("spacex launches 23 starlink satellites"),
    );
  });

  it("distinguishes different headlines", () => {
    expect(dedupeKey("SpaceX launches 23 Starlink satellites")).not.toBe(
      dedupeKey("SpaceX launches 24 Starlink satellites"),
    );
  });
});
