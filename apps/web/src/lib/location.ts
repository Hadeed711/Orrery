/** Effective-location resolution, skeleton edition (PRD LOC-1: picker/geolocation arrive in Phase 4). */
export interface Loc {
  lat: number;
  lon: number;
  tz: string;
  label: string;
}

export const DEFAULT_LOC: Loc = { lat: 31.5497, lon: 74.3436, tz: "Asia/Karachi", label: "Lahore, PK" };

type SP = Record<string, string | string[] | undefined>;

export function locFromSearchParams(sp: SP): Loc {
  const lat = Number(sp.lat);
  const lon = Number(sp.lon);
  if (Number.isFinite(lat) && Number.isFinite(lon) && Math.abs(lat) <= 90 && Math.abs(lon) <= 180) {
    const tz = typeof sp.tz === "string" && sp.tz.includes("/") ? sp.tz : "UTC";
    return { lat, lon, tz, label: `${lat.toFixed(2)}°, ${lon.toFixed(2)}°` };
  }
  return DEFAULT_LOC;
}
