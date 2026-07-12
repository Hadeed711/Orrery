/**
 * Computed calendar events (PRD CAL-1): moon quarters, solar & lunar eclipses,
 * equinoxes/solstices, planetary oppositions, greatest elongations, planet-planet
 * conjunctions, and meteor-shower peaks with moon-interference scoring.
 * Everything is calculated locally — nothing scraped (Master Plan strategy).
 */
// UMD/CJS interop differs across Node ESM, Vite, and Next bundling — normalize both shapes.
import * as AstronomyNS from "astronomy-engine";
const Astronomy =
  ((AstronomyNS as unknown as { default?: typeof AstronomyNS }).default ??
    AstronomyNS) as typeof AstronomyNS;
const {
  AngleBetween,
  AngleFromSun,
  Body,
  GeoVector,
  Illumination,
  NextGlobalSolarEclipse,
  NextLunarEclipse,
  NextMoonQuarter,
  SearchGlobalSolarEclipse,
  SearchLunarEclipse,
  SearchMaxElongation,
  SearchMoonQuarter,
  SearchRelativeLongitude,
  Seasons,
} = Astronomy;

export type ComputedEventKind =
  | "moon_phase"
  | "solar_eclipse"
  | "lunar_eclipse"
  | "equinox_solstice"
  | "opposition"
  | "elongation"
  | "conjunction"
  | "meteor_peak";

export interface ComputedEvent {
  slug: string;
  name: string;
  eventKind: ComputedEventKind;
  peakAt: Date;
  summary: string;
  attrs: Record<string, unknown>;
  /** Object-entity slugs this event involves (graph edges). */
  involves: string[];
  magnitude?: number;
}

export const isoDate = (d: Date): string => d.toISOString().slice(0, 10);
const DAY = 86_400_000;

// ── moon quarters ───────────────────────────────────────────────
const QUARTERS = ["New Moon", "First Quarter", "Full Moon", "Last Quarter"] as const;
const QUARTER_SLUGS = ["new-moon", "first-quarter-moon", "full-moon", "last-quarter-moon"] as const;

export function computeMoonQuarters(from: Date, count = 50): ComputedEvent[] {
  const out: ComputedEvent[] = [];
  let mq = SearchMoonQuarter(from);
  for (let i = 0; i < count; i++) {
    const peakAt = mq.time.date;
    const name = QUARTERS[mq.quarter]!;
    out.push({
      slug: `${isoDate(peakAt)}-${QUARTER_SLUGS[mq.quarter]!}`,
      name,
      eventKind: "moon_phase",
      peakAt,
      summary:
        mq.quarter === 0
          ? "Darkest skies of the lunar month — the best window for deep-sky observing."
          : mq.quarter === 2
            ? "The Moon is fully illuminated all night."
            : `The Moon reaches ${name.toLowerCase()}.`,
      attrs: { quarter: mq.quarter },
      involves: ["moon"],
    });
    mq = NextMoonQuarter(mq);
  }
  return out;
}

// ── eclipses ────────────────────────────────────────────────────
function eclipseTitle(kind: string, which: "solar" | "lunar"): string {
  const k = kind.charAt(0).toUpperCase() + kind.slice(1);
  return `${k} ${which === "solar" ? "Solar" : "Lunar"} Eclipse`;
}

export function computeSolarEclipses(from: Date, until: Date): ComputedEvent[] {
  const out: ComputedEvent[] = [];
  let e = SearchGlobalSolarEclipse(from);
  while (e.peak.date <= until) {
    const kind = String(e.kind).toLowerCase();
    // latitude/longitude/obscuration are only defined for central (annular/total) eclipses.
    const hasCenter = e.latitude !== undefined && e.longitude !== undefined;
    out.push({
      slug: `${isoDate(e.peak.date)}-${kind}-solar-eclipse`,
      name: eclipseTitle(kind, "solar"),
      eventKind: "solar_eclipse",
      peakAt: e.peak.date,
      summary: hasCenter
        ? `Greatest eclipse near ${e.latitude!.toFixed(1)}°, ${e.longitude!.toFixed(1)}°. Check this page for circumstances from your location.`
        : "A partial solar eclipse — the Moon covers part of the Sun for observers in the visibility zone.",
      attrs: {
        kind,
        obscuration:
          e.obscuration !== undefined && Number.isFinite(e.obscuration)
            ? Number(e.obscuration.toFixed(3))
            : null,
        peakLat: hasCenter ? Number(e.latitude!.toFixed(2)) : null,
        peakLon: hasCenter ? Number(e.longitude!.toFixed(2)) : null,
      },
      involves: ["sun", "moon"],
    });
    e = NextGlobalSolarEclipse(e.peak);
  }
  return out;
}

export function computeLunarEclipses(from: Date, until: Date): ComputedEvent[] {
  const out: ComputedEvent[] = [];
  let e = SearchLunarEclipse(from);
  while (e.peak.date <= until) {
    const kind = String(e.kind).toLowerCase();
    if (kind !== "penumbral") {
      out.push({
        slug: `${isoDate(e.peak.date)}-${kind}-lunar-eclipse`,
        name: eclipseTitle(kind, "lunar"),
        eventKind: "lunar_eclipse",
        peakAt: e.peak.date,
        summary: "Visible from the entire night side of Earth, weather permitting.",
        attrs: { kind, obscuration: Number(e.obscuration.toFixed(3)) },
        involves: ["moon"],
      });
    }
    e = NextLunarEclipse(e.peak);
  }
  return out;
}

// ── equinoxes & solstices ───────────────────────────────────────
export function computeSeasons(fromYear: number, toYear: number): ComputedEvent[] {
  const out: ComputedEvent[] = [];
  for (let y = fromYear; y <= toYear; y++) {
    const s = Seasons(y);
    const four: Array<[Date, string, string]> = [
      [s.mar_equinox.date, "march-equinox", "March Equinox"],
      [s.jun_solstice.date, "june-solstice", "June Solstice"],
      [s.sep_equinox.date, "september-equinox", "September Equinox"],
      [s.dec_solstice.date, "december-solstice", "December Solstice"],
    ];
    for (const [when, slug, name] of four) {
      out.push({
        slug: `${isoDate(when)}-${slug}`,
        name,
        eventKind: "equinox_solstice",
        peakAt: when,
        summary:
          slug.includes("equinox")
            ? "Day and night are nearly equal everywhere on Earth."
            : "The Sun reaches its extreme declination — the longest or shortest day, depending on your hemisphere.",
        attrs: {},
        involves: ["sun"],
      });
    }
  }
  return out;
}

// ── oppositions (outer planets; heliocentric relative longitude 0) ──
const OUTER: Array<{ body: AstronomyNS.Body; slug: string; name: string }> = [
  { body: Body.Mars, slug: "mars", name: "Mars" },
  { body: Body.Jupiter, slug: "jupiter", name: "Jupiter" },
  { body: Body.Saturn, slug: "saturn", name: "Saturn" },
  { body: Body.Uranus, slug: "uranus", name: "Uranus" },
  { body: Body.Neptune, slug: "neptune", name: "Neptune" },
];

export function computeOppositions(from: Date, until: Date): ComputedEvent[] {
  const out: ComputedEvent[] = [];
  for (const p of OUTER) {
    let t = SearchRelativeLongitude(p.body, 0, from);
    while (t.date <= until) {
      const mag = Illumination(p.body, t).mag;
      out.push({
        slug: `${isoDate(t.date)}-${p.slug}-at-opposition`,
        name: `${p.name} at Opposition`,
        eventKind: "opposition",
        peakAt: t.date,
        summary: `${p.name} lies opposite the Sun — closest, brightest (mag ${mag.toFixed(1)}), and visible all night.`,
        attrs: { magnitude: Number(mag.toFixed(2)) },
        involves: [p.slug],
        magnitude: Number(mag.toFixed(2)),
      });
      t = SearchRelativeLongitude(p.body, 0, new Date(t.date.getTime() + 30 * DAY));
    }
  }
  return out.sort((a, b) => a.peakAt.getTime() - b.peakAt.getTime());
}

// ── greatest elongations (Mercury, Venus) ───────────────────────
export function computeElongations(from: Date, until: Date): ComputedEvent[] {
  const out: ComputedEvent[] = [];
  for (const p of [
    { body: Body.Mercury, slug: "mercury", name: "Mercury" },
    { body: Body.Venus, slug: "venus", name: "Venus" },
  ]) {
    let e = SearchMaxElongation(p.body, from);
    while (e.time.date <= until) {
      const evening = e.visibility === "evening";
      out.push({
        slug: `${isoDate(e.time.date)}-${p.slug}-greatest-${evening ? "eastern" : "western"}-elongation`,
        name: `${p.name} at Greatest ${evening ? "Eastern" : "Western"} Elongation`,
        eventKind: "elongation",
        peakAt: e.time.date,
        summary: `${p.name} reaches ${e.elongation.toFixed(0)}° from the Sun — best seen ${evening ? "low in the west after sunset" : "low in the east before sunrise"}.`,
        attrs: { elongationDeg: Number(e.elongation.toFixed(1)), visibility: e.visibility },
        involves: [p.slug],
      });
      e = SearchMaxElongation(p.body, new Date(e.time.date.getTime() + 5 * DAY));
    }
  }
  return out.sort((a, b) => a.peakAt.getTime() - b.peakAt.getTime());
}

// ── planet-planet conjunctions (naked-eye pairs, < 2.5° separation) ──
const NAKED: Array<{ body: AstronomyNS.Body; slug: string; name: string }> = [
  { body: Body.Mercury, slug: "mercury", name: "Mercury" },
  { body: Body.Venus, slug: "venus", name: "Venus" },
  { body: Body.Mars, slug: "mars", name: "Mars" },
  { body: Body.Jupiter, slug: "jupiter", name: "Jupiter" },
  { body: Body.Saturn, slug: "saturn", name: "Saturn" },
];

function separation(a: AstronomyNS.Body, b: AstronomyNS.Body, t: Date): number {
  return AngleBetween(GeoVector(a, t, true), GeoVector(b, t, true));
}

export function computeConjunctions(from: Date, until: Date, thresholdDeg = 2.5): ComputedEvent[] {
  const out: ComputedEvent[] = [];
  for (let i = 0; i < NAKED.length; i++) {
    for (let j = i + 1; j < NAKED.length; j++) {
      const A = NAKED[i]!;
      const B = NAKED[j]!;
      // Daily scan for local minima, then hourly refinement around each candidate.
      let prev = separation(A.body, B.body, new Date(from.getTime() - DAY));
      let curr = separation(A.body, B.body, from);
      for (let t = from.getTime() + DAY; t <= until.getTime(); t += DAY) {
        const next = separation(A.body, B.body, new Date(t));
        if (curr <= prev && curr <= next && curr < thresholdDeg + 1.5) {
          let bestT = t - DAY;
          let bestSep = curr;
          for (let h = t - 2 * DAY; h <= t; h += 3_600_000) {
            const s = separation(A.body, B.body, new Date(h));
            if (s < bestSep) {
              bestSep = s;
              bestT = h;
            }
          }
          const when = new Date(bestT);
          const sunSepA = AngleFromSun(A.body, when);
          const sunSepB = AngleFromSun(B.body, when);
          // Skip conjunctions lost in solar glare — nobody can observe them.
          if (bestSep <= thresholdDeg && sunSepA > 12 && sunSepB > 12) {
            out.push({
              slug: `${isoDate(when)}-${A.slug}-${B.slug}-conjunction`,
              name: `${A.name} – ${B.name} Conjunction`,
              eventKind: "conjunction",
              peakAt: when,
              summary: `${A.name} and ${B.name} pass ${bestSep.toFixed(1)}° apart — both fit in binoculars${bestSep < 1 ? ", a striking naked-eye pairing" : ""}.`,
              attrs: { separationDeg: Number(bestSep.toFixed(2)) },
              involves: [A.slug, B.slug],
            });
          }
        }
        prev = curr;
        curr = next;
      }
    }
  }
  return out.sort((a, b) => a.peakAt.getTime() - b.peakAt.getTime());
}

// ── meteor-shower peaks (IMO-style working list, calendar-date approximation) ──
const SHOWERS = [
  { slug: "quadrantids", name: "Quadrantids", month: 1, day: 3, zhr: 110 },
  { slug: "lyrids", name: "Lyrids", month: 4, day: 22, zhr: 18 },
  { slug: "eta-aquariids", name: "Eta Aquariids", month: 5, day: 6, zhr: 50 },
  { slug: "delta-aquariids", name: "Southern Delta Aquariids", month: 7, day: 30, zhr: 25 },
  { slug: "perseids", name: "Perseids", month: 8, day: 12, zhr: 100 },
  { slug: "orionids", name: "Orionids", month: 10, day: 21, zhr: 20 },
  { slug: "leonids", name: "Leonids", month: 11, day: 17, zhr: 15 },
  { slug: "geminids", name: "Geminids", month: 12, day: 14, zhr: 150 },
  { slug: "ursids", name: "Ursids", month: 12, day: 22, zhr: 10 },
] as const;

function moonQuality(illumination: number): string {
  if (illumination < 0.2) return "An excellent year — near-moonless skies at the peak.";
  if (illumination < 0.5) return "A good year — only modest moonlight interference.";
  if (illumination < 0.8) return "A fair year — the Moon washes out fainter meteors.";
  return "A poor year — bright moonlight drowns most meteors.";
}

export function computeMeteorPeaks(fromYear: number, toYear: number): ComputedEvent[] {
  const out: ComputedEvent[] = [];
  for (let y = fromYear; y <= toYear; y++) {
    for (const s of SHOWERS) {
      const peakAt = new Date(Date.UTC(y, s.month - 1, s.day, 4)); // approximate peak night
      const moonIll = Illumination(Body.Moon, peakAt).phase_fraction;
      out.push({
        slug: `${isoDate(peakAt)}-${s.slug}-peak`,
        name: `${s.name} Meteor Shower Peak`,
        eventKind: "meteor_peak",
        peakAt,
        summary: `Up to ~${s.zhr}/hr under ideal dark skies. ${moonQuality(moonIll)}`,
        attrs: {
          zhr: s.zhr,
          moonIllumination: Number(moonIll.toFixed(2)),
          approximatePeak: true,
        },
        involves: ["moon"],
      });
    }
  }
  return out;
}

// ── everything in one call (used by seed) ───────────────────────
export function computeAllEvents(from: Date, until: Date): ComputedEvent[] {
  const fromYear = from.getUTCFullYear();
  const toYear = until.getUTCFullYear();
  return [
    ...computeMoonQuarters(from, 50),
    ...computeSolarEclipses(from, until),
    ...computeLunarEclipses(from, until),
    ...computeSeasons(fromYear, toYear),
    ...computeOppositions(from, until),
    ...computeElongations(from, until),
    ...computeConjunctions(from, until),
    ...computeMeteorPeaks(fromYear, toYear),
  ];
}
