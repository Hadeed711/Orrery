"use client";

/**
 * Location picker v0 (PRD LOC-1/LOC-2): curated city list + device GPS, persisted in a
 * cookie so server components localize everything. Full gazetteer search arrives with
 * the places table (Phase 4 completion).
 */
const CITIES: Array<{ label: string; lat: number; lon: number; tz: string }> = [
  { label: "Lahore, PK", lat: 31.5497, lon: 74.3436, tz: "Asia/Karachi" },
  { label: "Karachi, PK", lat: 24.8607, lon: 67.0011, tz: "Asia/Karachi" },
  { label: "Islamabad, PK", lat: 33.6844, lon: 73.0479, tz: "Asia/Karachi" },
  { label: "Dubai, AE", lat: 25.2048, lon: 55.2708, tz: "Asia/Dubai" },
  { label: "Riyadh, SA", lat: 24.7136, lon: 46.6753, tz: "Asia/Riyadh" },
  { label: "Delhi, IN", lat: 28.6139, lon: 77.209, tz: "Asia/Kolkata" },
  { label: "Mumbai, IN", lat: 19.076, lon: 72.8777, tz: "Asia/Kolkata" },
  { label: "London, UK", lat: 51.5074, lon: -0.1278, tz: "Europe/London" },
  { label: "Paris, FR", lat: 48.8566, lon: 2.3522, tz: "Europe/Paris" },
  { label: "Madrid, ES", lat: 40.4168, lon: -3.7038, tz: "Europe/Madrid" },
  { label: "Berlin, DE", lat: 52.52, lon: 13.405, tz: "Europe/Berlin" },
  { label: "Istanbul, TR", lat: 41.0082, lon: 28.9784, tz: "Europe/Istanbul" },
  { label: "Reykjavik, IS", lat: 64.1466, lon: -21.9426, tz: "Atlantic/Reykjavik" },
  { label: "New York, US", lat: 40.7128, lon: -74.006, tz: "America/New_York" },
  { label: "Los Angeles, US", lat: 34.0522, lon: -118.2437, tz: "America/Los_Angeles" },
  { label: "Cape Canaveral, US", lat: 28.3922, lon: -80.6077, tz: "America/New_York" },
  { label: "Mexico City, MX", lat: 19.4326, lon: -99.1332, tz: "America/Mexico_City" },
  { label: "São Paulo, BR", lat: -23.5505, lon: -46.6333, tz: "America/Sao_Paulo" },
  { label: "Lagos, NG", lat: 6.5244, lon: 3.3792, tz: "Africa/Lagos" },
  { label: "Cairo, EG", lat: 30.0444, lon: 31.2357, tz: "Africa/Cairo" },
  { label: "Nairobi, KE", lat: -1.2921, lon: 36.8219, tz: "Africa/Nairobi" },
  { label: "Beijing, CN", lat: 39.9042, lon: 116.4074, tz: "Asia/Shanghai" },
  { label: "Tokyo, JP", lat: 35.6762, lon: 139.6503, tz: "Asia/Tokyo" },
  { label: "Singapore, SG", lat: 1.3521, lon: 103.8198, tz: "Asia/Singapore" },
  { label: "Sydney, AU", lat: -33.8688, lon: 151.2093, tz: "Australia/Sydney" },
  { label: "Auckland, NZ", lat: -36.8509, lon: 174.7645, tz: "Pacific/Auckland" },
];

function saveLoc(loc: { label: string; lat: number; lon: number; tz: string }) {
  const value = encodeURIComponent(JSON.stringify(loc));
  document.cookie = `orrery-loc=${value}; path=/; max-age=31536000; samesite=lax`;
  window.location.reload();
}

export function LocationPicker({ currentLabel }: { currentLabel: string }) {
  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    if (e.target.value === "__gps__") {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          saveLoc({
            label: "My location",
            lat: Number(pos.coords.latitude.toFixed(4)),
            lon: Number(pos.coords.longitude.toFixed(4)),
            tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
          }),
        () => e.target.blur(), // denied — keep current location
      );
      return;
    }
    const city = CITIES.find((c) => c.label === e.target.value);
    if (city) saveLoc(city);
  }

  const known = CITIES.some((c) => c.label === currentLabel);

  return (
    <select
      className="pill-btn"
      aria-label="Observing location"
      value={known ? currentLabel : "__current__"}
      onChange={onChange}
    >
      {!known ? <option value="__current__">◉ {currentLabel}</option> : null}
      <option value="__gps__">◉ Use my GPS</option>
      {CITIES.map((c) => (
        <option key={c.label} value={c.label}>
          {c.label}
        </option>
      ))}
    </select>
  );
}
