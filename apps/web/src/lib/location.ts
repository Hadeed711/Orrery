/** Effective-location resolution (PRD LOC-1): URL params → cookie (picker/GPS) → default. */
import { cookies } from "next/headers";

export interface Loc {
  lat: number;
  lon: number;
  tz: string;
  label: string;
}

export const DEFAULT_LOC: Loc = { lat: 31.5497, lon: 74.3436, tz: "Asia/Karachi", label: "Lahore, PK" };
export const LOC_COOKIE = "orrery-loc";

type SP = Record<string, string | string[] | undefined>;

const valid = (lat: number, lon: number): boolean =>
  Number.isFinite(lat) && Number.isFinite(lon) && Math.abs(lat) <= 90 && Math.abs(lon) <= 180;

export function locFromSearchParams(sp: SP): Loc | null {
  const lat = Number(sp.lat);
  const lon = Number(sp.lon);
  if (!valid(lat, lon)) return null;
  const tz = typeof sp.tz === "string" && sp.tz.includes("/") ? sp.tz : "UTC";
  return { lat, lon, tz, label: `${lat.toFixed(2)}°, ${lon.toFixed(2)}°` };
}

/** Server-side resolver used by every page. Reading cookies keeps pages dynamic (they already are). */
export async function effectiveLoc(sp?: SP): Promise<Loc> {
  if (sp) {
    const fromParams = locFromSearchParams(sp);
    if (fromParams) return fromParams;
  }
  try {
    const jar = await cookies();
    const raw = jar.get(LOC_COOKIE)?.value;
    if (raw) {
      const p = JSON.parse(decodeURIComponent(raw)) as Partial<Loc>;
      if (typeof p.lat === "number" && typeof p.lon === "number" && valid(p.lat, p.lon)) {
        return {
          lat: p.lat,
          lon: p.lon,
          tz: typeof p.tz === "string" && p.tz.includes("/") ? p.tz : "UTC",
          label: typeof p.label === "string" && p.label.length > 0 ? p.label.slice(0, 60) : "Saved location",
        };
      }
    }
  } catch {
    // malformed cookie or non-request context — fall through to default
  }
  return DEFAULT_LOC;
}
