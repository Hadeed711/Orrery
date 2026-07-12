/**
 * "Tonight's sky" computed locally with astronomy-engine (ADR-005).
 * Accuracy target ±1 min vs JPL Horizons for rise/set (PRD TIME-1); golden tests in /test.
 */
// Default-import + destructure: astronomy-engine is CJS and Node's ESM named-export
// detection misses part of its API surface.
import * as AstronomyNS from "astronomy-engine";
import type { Body as AstroBody, Observer as AstroObserver } from "astronomy-engine";
// UMD/CJS interop differs across Node ESM, Vite, and Next bundling — normalize both shapes.
const Astronomy =
  ((AstronomyNS as unknown as { default?: typeof AstronomyNS }).default ??
    AstronomyNS) as typeof AstronomyNS;
const { Body, Equator, Horizon, Illumination, MoonPhase, Observer, SearchAltitude, SearchRiseSet } =
  Astronomy;

export interface BodyTonight {
  slug: string;
  name: string;
  riseUtc: string | null;
  setUtc: string | null;
  altitudeNow: number;
  azimuthNow: number;
  direction: string;
  magnitude: number | null;
  upNow: boolean;
}

export interface SkyTonight {
  atUtc: string;
  observer: { lat: number; lon: number };
  sun: {
    setUtc: string | null;
    riseUtc: string | null;
    darkStartUtc: string | null;
    darkEndUtc: string | null;
  };
  moon: {
    phaseName: string;
    phaseAngle: number;
    illumination: number;
    riseUtc: string | null;
    setUtc: string | null;
  };
  planets: BodyTonight[];
}

const PLANETS: Array<{ body: AstroBody; slug: string; name: string }> = [
  { body: Body.Mercury, slug: "mercury", name: "Mercury" },
  { body: Body.Venus, slug: "venus", name: "Venus" },
  { body: Body.Mars, slug: "mars", name: "Mars" },
  { body: Body.Jupiter, slug: "jupiter", name: "Jupiter" },
  { body: Body.Saturn, slug: "saturn", name: "Saturn" },
  { body: Body.Uranus, slug: "uranus", name: "Uranus" },
  { body: Body.Neptune, slug: "neptune", name: "Neptune" },
];

const WINDS = [
  "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
  "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW",
] as const;

export function compassDirection(azimuthDeg: number): string {
  const idx = Math.round((((azimuthDeg % 360) + 360) % 360) / 22.5) % 16;
  return WINDS[idx]!;
}

export function moonPhaseName(angleDeg: number): string {
  const a = ((angleDeg % 360) + 360) % 360;
  if (a < 22.5 || a >= 337.5) return "New Moon";
  if (a < 67.5) return "Waxing Crescent";
  if (a < 112.5) return "First Quarter";
  if (a < 157.5) return "Waxing Gibbous";
  if (a < 202.5) return "Full Moon";
  if (a < 247.5) return "Waning Gibbous";
  if (a < 292.5) return "Last Quarter";
  return "Waning Crescent";
}

const iso = (d: Date | null | undefined): string | null => (d ? d.toISOString() : null);

function riseSet(body: AstroBody, obs: AstroObserver, from: Date) {
  const rise = SearchRiseSet(body, obs, +1, from, 1.2);
  const set = SearchRiseSet(body, obs, -1, from, 1.2);
  return { riseUtc: iso(rise?.date), setUtc: iso(set?.date) };
}

function altAzNow(body: AstroBody, obs: AstroObserver, at: Date) {
  const eq = Equator(body, at, obs, true, true);
  const hor = Horizon(at, obs, eq.ra, eq.dec, "normal");
  return { altitude: hor.altitude, azimuth: hor.azimuth };
}

export function skyTonight(lat: number, lon: number, at: Date = new Date()): SkyTonight {
  const obs = new Observer(lat, lon, 0);

  const sunSet = SearchRiseSet(Body.Sun, obs, -1, at, 1.2);
  const sunRise = SearchRiseSet(Body.Sun, obs, +1, sunSet?.date ?? at, 1.2);
  // Astronomical darkness = Sun 18° below the horizon.
  const darkStart = SearchAltitude(Body.Sun, obs, -1, at, 1.2, -18);
  const darkEnd = SearchAltitude(Body.Sun, obs, +1, darkStart?.date ?? at, 1.2, -18);

  const moonIllum = Illumination(Body.Moon, at);
  const moonAngle = MoonPhase(at);

  const planets: BodyTonight[] = PLANETS.map(({ body, slug, name }) => {
    const { riseUtc, setUtc } = riseSet(body, obs, at);
    const { altitude, azimuth } = altAzNow(body, obs, at);
    let magnitude: number | null = null;
    try {
      magnitude = Number(Illumination(body, at).mag.toFixed(1));
    } catch {
      magnitude = null; // astronomy-engine has no magnitude model for some bodies/geometries
    }
    return {
      slug,
      name,
      riseUtc,
      setUtc,
      altitudeNow: Number(altitude.toFixed(1)),
      azimuthNow: Number(azimuth.toFixed(1)),
      direction: compassDirection(azimuth),
      magnitude,
      upNow: altitude > 0,
    };
  });

  const moonRS = riseSet(Body.Moon, obs, at);

  return {
    atUtc: at.toISOString(),
    observer: { lat, lon },
    sun: {
      setUtc: iso(sunSet?.date),
      riseUtc: iso(sunRise?.date),
      darkStartUtc: iso(darkStart?.date),
      darkEndUtc: iso(darkEnd?.date),
    },
    moon: {
      phaseName: moonPhaseName(moonAngle),
      phaseAngle: Number(moonAngle.toFixed(1)),
      illumination: Number(moonIllum.phase_fraction.toFixed(3)),
      riseUtc: moonRS.riseUtc,
      setUtc: moonRS.setUtc,
    },
    planets,
  };
}
