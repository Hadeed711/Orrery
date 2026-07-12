/**
 * Computed calendar events (PRD CAL-1 subset for the walking skeleton):
 * moon quarters + solar & lunar eclipses. Meteor showers, conjunctions,
 * oppositions and per-location circumstances arrive in Phase 4.
 */
// Default-import + destructure: astronomy-engine is CJS and Node's ESM named-export
// detection misses part of its API surface.
import * as AstronomyNS from "astronomy-engine";
// UMD/CJS interop differs across Node ESM, Vite, and Next bundling — normalize both shapes.
const Astronomy =
  ((AstronomyNS as unknown as { default?: typeof AstronomyNS }).default ??
    AstronomyNS) as typeof AstronomyNS;
const {
  NextGlobalSolarEclipse,
  NextLunarEclipse,
  NextMoonQuarter,
  SearchGlobalSolarEclipse,
  SearchLunarEclipse,
  SearchMoonQuarter,
} = Astronomy;

export interface ComputedEvent {
  slug: string;
  name: string;
  eventKind: "moon_phase" | "solar_eclipse" | "lunar_eclipse";
  peakAt: Date;
  summary: string;
  attrs: Record<string, unknown>;
}

const QUARTERS = ["New Moon", "First Quarter", "Full Moon", "Last Quarter"] as const;
const QUARTER_SLUGS = ["new-moon", "first-quarter-moon", "full-moon", "last-quarter-moon"] as const;

export const isoDate = (d: Date): string => d.toISOString().slice(0, 10);

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
    });
    mq = NextMoonQuarter(mq);
  }
  return out;
}

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
        ? `Greatest eclipse near ${e.latitude!.toFixed(1)}°, ${e.longitude!.toFixed(1)}°. Per-city circumstances arrive with the Phase 4 calendar.`
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
      });
    }
    e = NextLunarEclipse(e.peak);
  }
  return out;
}
