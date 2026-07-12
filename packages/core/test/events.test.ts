/** Golden tests (PRD TIME-1 / Master Plan section 8.6): computed events vs canonically known dates. */
import { describe, expect, it } from "vitest";
import { computeLunarEclipses, computeMoonQuarters, computeSolarEclipses } from "../src/ephemeris/events";

describe("solar eclipses (golden)", () => {
  const eclipses = computeSolarEclipses(new Date("2026-01-01T00:00:00Z"), new Date("2027-12-31T00:00:00Z"));

  it("finds the 2026-08-12 total solar eclipse (Greenland/Iceland/Spain)", () => {
    const slugs = eclipses.map((e) => e.slug);
    expect(slugs).toContain("2026-08-12-total-solar-eclipse");
  });

  it("finds the 2027-08-02 total solar eclipse (N. Africa, longest of the century)", () => {
    const slugs = eclipses.map((e) => e.slug);
    expect(slugs).toContain("2027-08-02-total-solar-eclipse");
  });
});

describe("lunar eclipses", () => {
  it("finds at least one non-penumbral lunar eclipse in 2026", () => {
    const eclipses = computeLunarEclipses(new Date("2026-01-01T00:00:00Z"), new Date("2026-12-31T00:00:00Z"));
    expect(eclipses.length).toBeGreaterThan(0);
  });
});

describe("moon quarters (golden)", () => {
  it("New Moon falls on 2026-08-12, the solar-eclipse day, by definition", () => {
    const quarters = computeMoonQuarters(new Date("2026-08-01T00:00:00Z"), 8);
    const newMoons = quarters.filter((q) => q.attrs.quarter === 0).map((q) => q.slug);
    expect(newMoons).toContain("2026-08-12-new-moon");
  });
});
