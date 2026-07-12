/**
 * Per-location eclipse circumstances (PRD CAL-4/CAL-5): given the global peak of a
 * solar eclipse and an observer, compute what THAT observer actually sees — computed,
 * never hand-tagged.
 */
import * as AstronomyNS from "astronomy-engine";
const Astronomy =
  ((AstronomyNS as unknown as { default?: typeof AstronomyNS }).default ??
    AstronomyNS) as typeof AstronomyNS;
const { Observer, SearchLocalSolarEclipse } = Astronomy;

export interface LocalEclipseCircumstances {
  visible: boolean;
  reason?: "no-eclipse-here" | "sun-below-horizon";
  kind?: string; // partial | annular | total (as seen locally)
  obscuration?: number; // 0..1 fraction of Sun's disk covered at local maximum
  partialBeginUtc?: string;
  peakUtc?: string;
  partialEndUtc?: string;
  totalityBeginUtc?: string;
  totalityEndUtc?: string;
  sunAltitudeAtPeak?: number;
}

const DAY = 86_400_000;
const iso = (d: Date | undefined): string | undefined => d?.toISOString();

export function localSolarEclipse(
  globalPeakUtc: Date,
  lat: number,
  lon: number,
): LocalEclipseCircumstances {
  const obs = new Observer(lat, lon, 0);
  const e = SearchLocalSolarEclipse(new Date(globalPeakUtc.getTime() - 3 * DAY), obs);

  // The search returns the NEXT local eclipse; if it isn't this one, this eclipse skips this place.
  if (Math.abs(e.peak.time.date.getTime() - globalPeakUtc.getTime()) > 2 * DAY) {
    return { visible: false, reason: "no-eclipse-here" };
  }
  if (e.peak.altitude <= 0) {
    return { visible: false, reason: "sun-below-horizon" };
  }
  return {
    visible: true,
    kind: String(e.kind).toLowerCase(),
    obscuration: Number(e.obscuration.toFixed(3)),
    partialBeginUtc: iso(e.partial_begin.time.date),
    peakUtc: iso(e.peak.time.date),
    partialEndUtc: iso(e.partial_end.time.date),
    totalityBeginUtc: iso(e.total_begin?.time.date),
    totalityEndUtc: iso(e.total_end?.time.date),
    sunAltitudeAtPeak: Number(e.peak.altitude.toFixed(1)),
  };
}
