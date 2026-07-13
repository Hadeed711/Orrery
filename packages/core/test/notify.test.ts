import { describe, expect, it } from "vitest";
import { dueForLaunchAlert, launchAlertKey, launchAlertPayload } from "../src/notify/alerts";
import { composeDigest, isoWeekKey } from "../src/notify/digest";

const NOW = new Date("2026-07-14T12:00:00Z");

const launch = (overrides: Partial<Parameters<typeof dueForLaunchAlert>[0]> = {}) => ({
  entityId: "0198c0de-0000-7000-8000-000000000001",
  slug: "falcon-9-starlink-g12-34",
  name: "Falcon 9 · Starlink G12-34",
  status: "go",
  net: new Date("2026-07-14T12:20:00Z"),
  ...overrides,
});

describe("launch alert selection (ALERT-1)", () => {
  it("fires inside the T-25→T+5 window for GO launches", () => {
    expect(dueForLaunchAlert(launch(), NOW)).toBe(true);
    expect(dueForLaunchAlert(launch({ net: new Date("2026-07-14T11:56:00Z") }), NOW)).toBe(true);
  });

  it("stays quiet outside the window", () => {
    expect(dueForLaunchAlert(launch({ net: new Date("2026-07-14T12:26:00Z") }), NOW)).toBe(false);
    expect(dueForLaunchAlert(launch({ net: new Date("2026-07-14T11:54:00Z") }), NOW)).toBe(false);
    expect(dueForLaunchAlert(launch({ net: null }), NOW)).toBe(false);
  });

  it("ignores holds, scrubs and completed launches", () => {
    for (const status of ["hold", "tbd", "success", "failure", "partial"]) {
      expect(dueForLaunchAlert(launch({ status }), NOW)).toBe(false);
    }
    expect(dueForLaunchAlert(launch({ status: "tbc" }), NOW)).toBe(true);
  });

  it("builds a stable dedupe key and a T-minus payload", () => {
    const l = launch();
    expect(launchAlertKey(l)).toBe(`launch:${l.entityId}:t15`);
    const p = launchAlertPayload(l, NOW);
    expect(p.title).toContain("~20 min");
    expect(p.body).toContain("GO");
    expect(p.url).toBe("/launch/falcon-9-starlink-g12-34");
  });
});

describe("ISO week key (DIGEST-1)", () => {
  it("matches known ISO-8601 boundaries", () => {
    expect(isoWeekKey(new Date("2026-07-14T00:00:00Z"))).toBe("2026-W29");
    // 2026-01-01 is a Thursday → week 1; 2027-01-01 is a Friday → belongs to 2026-W53.
    expect(isoWeekKey(new Date("2026-01-01T00:00:00Z"))).toBe("2026-W01");
    expect(isoWeekKey(new Date("2027-01-01T00:00:00Z"))).toBe("2026-W53");
    expect(isoWeekKey(new Date("2026-12-28T00:00:00Z"))).toBe("2026-W53");
  });
});

describe("weekly digest composer (DIGEST-1)", () => {
  const base = {
    userName: "Hadeed",
    weekKey: "2026-W29",
    siteUrl: "https://orrery.example",
  };

  it("returns null when there is nothing to say (no spam weeks)", () => {
    expect(composeDigest({ ...base, launches: [], events: [], articles: [] })).toBeNull();
  });

  it("composes subject counts and linked sections", () => {
    const digest = composeDigest({
      ...base,
      launches: [
        { name: "Falcon 9 · Starlink", slug: "falcon-9-starlink", net: new Date("2026-07-15T04:30:00Z"), status: "go" },
      ],
      events: [{ name: "Full Moon", slug: "2026-07-18-full-moon", peakAt: new Date("2026-07-18T21:00:00Z") }],
      articles: [{ title: "JWST spots <thing>", url: "https://news.example/a", sourceName: "SpaceNews" }],
    });
    expect(digest).not.toBeNull();
    expect(digest!.subject).toBe("Your week in space: 1 launch, 1 sky event (2026-W29)");
    expect(digest!.html).toContain("https://orrery.example/launch/falcon-9-starlink");
    expect(digest!.html).toContain("https://orrery.example/event/2026-07-18-full-moon");
    expect(digest!.html).toContain("2026-07-15 04:30 UTC");
    // HTML in article titles must be escaped, not injected.
    expect(digest!.html).toContain("JWST spots &lt;thing&gt;");
    expect(digest!.html).not.toContain("spots <thing>");
  });
});
