/**
 * Editorial seed: solar-system objects into the graph + computed calendar events.
 * Idempotent — safe to run repeatedly. Run: npm run seed
 */
import { getDb } from "../db/client";
import {
  ensureEdge,
  setClaim,
  upsertEntityBySlug,
  upsertEventRow,
  upsertSource,
} from "../db/repo";
import { externalIds } from "../db/schema";
import { computeLunarEclipses, computeMoonQuarters, computeSolarEclipses } from "../ephemeris/events";

interface PlanetSeed {
  slug: string;
  name: string;
  cls: string;
  radiusKm: number;
  horizons: string;
  summary: string;
}

const OBJECTS: PlanetSeed[] = [
  { slug: "sun", name: "Sun", cls: "star", radiusKm: 695_700, horizons: "10", summary: "The star at the center of the Solar System — a G-type main-sequence star holding 99.86% of the system's mass." },
  { slug: "mercury", name: "Mercury", cls: "planet", radiusKm: 2_439.7, horizons: "199", summary: "The smallest planet and nearest to the Sun, whipping around it every 88 days." },
  { slug: "venus", name: "Venus", cls: "planet", radiusKm: 6_051.8, horizons: "299", summary: "Earth's scorching twin, wrapped in crushing carbon-dioxide clouds — often the brightest point in our sky." },
  { slug: "earth", name: "Earth", cls: "planet", radiusKm: 6_371, horizons: "399", summary: "Home. The only world known to host life — and the vantage point for everything in Orrery." },
  { slug: "moon", name: "The Moon", cls: "moon", radiusKm: 1_737.4, horizons: "301", summary: "Earth's constant companion and the first stop beyond our world. Its phases set the rhythm of the observing month." },
  { slug: "mars", name: "Mars", cls: "planet", radiusKm: 3_389.5, horizons: "499", summary: "The red planet — home to a small fleet of rovers and orbiters, and the next destination for human explorers." },
  { slug: "jupiter", name: "Jupiter", cls: "planet", radiusKm: 69_911, horizons: "599", summary: "The giant of the Solar System. Binoculars reveal its four Galilean moons dancing night to night." },
  { slug: "saturn", name: "Saturn", cls: "planet", radiusKm: 58_232, horizons: "699", summary: "The ringed jewel — the sight that turns first-time telescope users into lifelong observers." },
  { slug: "uranus", name: "Uranus", cls: "planet", radiusKm: 25_362, horizons: "799", summary: "An ice giant tipped on its side, orbiting the Sun once every 84 years." },
  { slug: "neptune", name: "Neptune", cls: "planet", radiusKm: 24_622, horizons: "899", summary: "The most distant planet — a deep-blue ice giant found by mathematics before telescopes." },
  { slug: "titan", name: "Titan", cls: "moon", radiusKm: 2_574.7, horizons: "606", summary: "Saturn's planet-sized moon, with a thick orange atmosphere and lakes of liquid methane." },
];

async function main() {
  const db = await getDb();

  // sources registry
  const srcEditorial = await upsertSource(db, {
    key: "editorial", name: "Orrery editorial", tier: 1, license: "orrery",
  });
  const srcEngine = await upsertSource(db, {
    key: "astronomy-engine", name: "astronomy-engine (computed)", homepage: "https://github.com/cosinekitty/astronomy", tier: 1, license: "MIT",
  });
  await upsertSource(db, {
    key: "ll2", name: "Launch Library 2 - The Space Devs", homepage: "https://thespacedevs.com", tier: 1, license: "attribution-appreciated", pollSecs: 1800,
  });
  await upsertSource(db, {
    key: "horizons", name: "JPL Horizons", homepage: "https://ssd.jpl.nasa.gov/horizons/", tier: 1, license: "public",
  });

  // objects + graph edges
  const ids = new Map<string, string>();
  for (const o of OBJECTS) {
    const id = await upsertEntityBySlug(db, {
      kind: "object",
      slug: o.slug,
      name: o.name,
      summary: o.summary,
      attrs: { class: o.cls, radiusKm: o.radiusKm },
      completeness: 60,
    });
    ids.set(o.slug, id);
    await setClaim(db, id, "radius_km", o.radiusKm, srcEditorial);
    await db
      .insert(externalIds)
      .values({ entityId: id, system: "horizons", value: o.horizons })
      .onConflictDoNothing();
  }

  const sun = ids.get("sun")!;
  for (const p of ["mercury", "venus", "earth", "mars", "jupiter", "saturn", "uranus", "neptune"]) {
    await ensureEdge(db, ids.get(p)!, "orbits", sun, {}, srcEditorial);
  }
  await ensureEdge(db, ids.get("moon")!, "moon_of", ids.get("earth")!, {}, srcEditorial);
  await ensureEdge(db, ids.get("titan")!, "moon_of", ids.get("saturn")!, {}, srcEditorial);

  // Saturn gets the richest page (PRD ENT acceptance target).
  const saturn = ids.get("saturn")!;
  await setClaim(db, saturn, "known_moons", "274", srcEditorial, 0.9);
  await setClaim(db, saturn, "ring_span_km", 282_000, srcEditorial);
  await setClaim(db, saturn, "day_length_hours", 10.7, srcEditorial);
  await setClaim(db, saturn, "year_length_years", 29.4, srcEditorial);

  // computed calendar events (skeleton set)
  const now = new Date();
  const from = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
  const until = new Date(Date.UTC(now.getUTCFullYear() + 3, 0, 1));
  const events = [
    ...computeMoonQuarters(now, 50),
    ...computeSolarEclipses(from, until),
    ...computeLunarEclipses(from, until),
  ];
  for (const ev of events) {
    const id = await upsertEntityBySlug(db, {
      kind: "event",
      slug: ev.slug,
      name: ev.name,
      summary: ev.summary,
      attrs: ev.attrs,
      completeness: 50,
    });
    await upsertEventRow(db, {
      entityId: id,
      eventKind: ev.eventKind,
      peakAt: ev.peakAt,
      visibility: {},
      computedBy: "astronomy-engine@2",
      computedAt: new Date(),
    });
    // Eclipses involve the obvious bodies — make the graph say so.
    if (ev.eventKind !== "moon_phase") {
      await ensureEdge(db, id, "involves", ids.get("sun")!, {}, srcEngine);
      await ensureEdge(db, id, "involves", ids.get("moon")!, {}, srcEngine);
    }
  }

  console.log(`seeded: ${OBJECTS.length} objects, ${events.length} computed events`);
}

main().then(() => process.exit(0)).catch((err) => {
  console.error(err);
  process.exit(1);
});
