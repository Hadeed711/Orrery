/** Golden tests for the Phase 4 events engine: seasons, oppositions, elongations, showers, conjunctions. */
import { describe, expect, it } from "vitest";
import {
  computeConjunctions,
  computeElongations,
  computeMeteorPeaks,
  computeOppositions,
  computeSeasons,
} from "../src/ephemeris/events";
import { localSolarEclipse } from "../src/ephemeris/local";

describe("seasons (golden)", () => {
  const seasons = computeSeasons(2026, 2026);
  it("finds the 2026 March equinox on Mar 20 and December solstice on Dec 21", () => {
    const slugs = seasons.map((s) => s.slug);
    expect(slugs).toContain("2026-03-20-march-equinox");
    expect(slugs).toContain("2026-12-21-december-solstice");
    expect(seasons).toHaveLength(4);
  });
});

describe("oppositions", () => {
  const opps = computeOppositions(new Date("2026-06-01T00:00:00Z"), new Date("2027-12-31T00:00:00Z"));
  it("finds a Mars opposition in early 2027 (canonically ~Feb 19-20)", () => {
    const mars = opps.filter((o) => o.slug.includes("mars-at-opposition"));
    expect(mars.length).toBe(1);
    expect(mars[0]!.slug.startsWith("2027-02-")).toBe(true);
  });
  it("finds one Saturn opposition per year with negative-to-1 magnitude", () => {
    const saturn = opps.filter((o) => o.slug.includes("saturn-at-opposition"));
    expect(saturn.length).toBeGreaterThanOrEqual(1);
    for (const s of saturn) expect(s.magnitude!).toBeLessThan(1.5);
  });
});

describe("elongations", () => {
  it("Mercury has 5-7 greatest elongations per year, all 17-29 degrees", () => {
    const els = computeElongations(new Date("2026-01-01T00:00:00Z"), new Date("2026-12-31T00:00:00Z"))
      .filter((e) => e.slug.includes("mercury"));
    expect(els.length).toBeGreaterThanOrEqual(5);
    expect(els.length).toBeLessThanOrEqual(7);
    for (const e of els) {
      const deg = e.attrs.elongationDeg as number;
      expect(deg).toBeGreaterThan(17);
      expect(deg).toBeLessThan(29);
    }
  });
});

describe("meteor peaks", () => {
  it("Perseids 2026 peak on a near-new Moon (eclipse was that day)", () => {
    const peaks = computeMeteorPeaks(2026, 2026);
    const perseids = peaks.find((p) => p.slug === "2026-08-12-perseids-peak");
    expect(perseids).toBeDefined();
    expect(perseids!.attrs.moonIllumination as number).toBeLessThan(0.1);
    expect(perseids!.summary).toContain("excellent");
  });
});

describe("conjunctions", () => {
  it("returns only observable pairings under the threshold", () => {
    const conj = computeConjunctions(new Date("2026-01-01T00:00:00Z"), new Date("2027-01-01T00:00:00Z"));
    for (const c of conj) {
      expect(c.attrs.separationDeg as number).toBeLessThanOrEqual(2.5);
      expect(c.involves).toHaveLength(2);
    }
  });
});

describe("local solar eclipse circumstances (golden: 2026-08-12)", () => {
  const globalPeak = new Date("2026-08-12T17:46:00Z"); // within the search window of the true peak

  it("Madrid sees the eclipse (deep partial or total, sun above horizon)", () => {
    const madrid = localSolarEclipse(globalPeak, 40.4168, -3.7038);
    expect(madrid.visible).toBe(true);
    expect(madrid.obscuration!).toBeGreaterThan(0.8);
  });

  it("Reykjavik sees a very deep eclipse", () => {
    const rek = localSolarEclipse(globalPeak, 64.1466, -21.9426);
    expect(rek.visible).toBe(true);
    expect(rek.obscuration!).toBeGreaterThan(0.9);
  });

  it("Lahore sees nothing — the Sun is below the horizon there", () => {
    const lahore = localSolarEclipse(globalPeak, 31.5497, 74.3436);
    expect(lahore.visible).toBe(false);
  });
});
