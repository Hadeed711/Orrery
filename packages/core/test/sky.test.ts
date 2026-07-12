import { describe, expect, it } from "vitest";
import { compassDirection, moonPhaseName, skyTonight } from "../src/ephemeris/sky";

describe("skyTonight (Lahore, 2026-07-12)", () => {
  const sky = skyTonight(31.5497, 74.3436, new Date("2026-07-12T18:00:00Z"));

  it("computes sunset, sunrise, and an astronomical-darkness window", () => {
    expect(sky.sun.setUtc).toBeTruthy();
    expect(sky.sun.riseUtc).toBeTruthy();
    expect(sky.sun.darkStartUtc).toBeTruthy();
  });

  it("returns rise/set and finite magnitude for Saturn", () => {
    const saturn = sky.planets.find((p) => p.slug === "saturn");
    expect(saturn).toBeDefined();
    expect(saturn!.riseUtc ?? saturn!.setUtc).toBeTruthy();
    expect(Number.isFinite(saturn!.magnitude)).toBe(true);
  });

  it("moon illumination is a sane fraction", () => {
    expect(sky.moon.illumination).toBeGreaterThanOrEqual(0);
    expect(sky.moon.illumination).toBeLessThanOrEqual(1);
  });
});

describe("helpers", () => {
  it("maps azimuths to compass winds", () => {
    expect(compassDirection(0)).toBe("N");
    expect(compassDirection(90)).toBe("E");
    expect(compassDirection(112.5)).toBe("ESE");
    expect(compassDirection(359)).toBe("N");
  });
  it("names moon phases", () => {
    expect(moonPhaseName(0)).toBe("New Moon");
    expect(moonPhaseName(180)).toBe("Full Moon");
    expect(moonPhaseName(300)).toBe("Waning Crescent");
  });
});
