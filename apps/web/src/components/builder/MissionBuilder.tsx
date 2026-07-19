"use client";
import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Mission Builder (Phase 7 signature feature): design a satellite, get a
 * unique generated mission patch (deterministic from the name — like a call
 * sign), an engineering readout, a launch-vehicle match, and real NASA
 * archive images for your mission's name. Pure client math; no accounts needed.
 */

type Destination = {
  id: string;
  name: string;
  emoji: string;
  dvFromLeo: number; // km/s beyond LEO
  travel: string;
  sunDistanceAu: number;
  note: string;
};

const DESTINATIONS: Destination[] = [
  { id: "leo", name: "Low Earth Orbit", emoji: "🌍", dvFromLeo: 0, travel: "minutes after launch", sunDistanceAu: 1, note: "400 km up, one lap every 92 minutes — ISS territory." },
  { id: "sso", name: "Sun-synchronous orbit", emoji: "🛰️", dvFromLeo: 0.3, travel: "under an hour", sunDistanceAu: 1, note: "The Earth-observation highway: same local sun time every pass." },
  { id: "geo", name: "Geostationary orbit", emoji: "📡", dvFromLeo: 3.9, travel: "~1 week (with circularization)", sunDistanceAu: 1, note: "35,786 km up, hovering over one spot forever." },
  { id: "moon", name: "Lunar orbit", emoji: "🌕", dvFromLeo: 4.1, travel: "3–5 days", sunDistanceAu: 1, note: "Where Artemis is headed. Watch for thermal swings." },
  { id: "mars", name: "Mars", emoji: "🔴", dvFromLeo: 4.3, travel: "~7 months (Hohmann window every 26 months)", sunDistanceAu: 1.52, note: "Arrival needs aerobraking or a big burn." },
  { id: "venus", name: "Venus", emoji: "🟡", dvFromLeo: 3.5, travel: "~4 months", sunDistanceAu: 0.72, note: "Cheapest planet to reach — hardest to survive." },
  { id: "asteroid", name: "Near-Earth asteroid", emoji: "☄️", dvFromLeo: 4.0, travel: "6–18 months", sunDistanceAu: 1.1, note: "Sample-return country: OSIRIS-REx and Hayabusa territory." },
  { id: "europa", name: "Jupiter / Europa", emoji: "🧊", dvFromLeo: 6.3, travel: "~6 years (with gravity assists)", sunDistanceAu: 5.2, note: "Radiation vault required. Ocean world payoff." },
  { id: "titan", name: "Saturn / Titan", emoji: "🪐", dvFromLeo: 7.3, travel: "~7 years", sunDistanceAu: 9.5, note: "Thick atmosphere — you could fly a rotorcraft like Dragonfly." },
  { id: "interstellar", name: "Interstellar escape", emoji: "🌌", dvFromLeo: 8.8, travel: "35+ years to the heliopause", sunDistanceAu: 120, note: "Voyager class. Your satellite outlives us all." },
];

type Instrument = { id: string; name: string; massKg: number; powerW: number; blurb: string };

const INSTRUMENTS: Instrument[] = [
  { id: "camera", name: "Imaging camera", massKg: 9, powerW: 14, blurb: "See where you're going" },
  { id: "hyperspectral", name: "Hyperspectral imager", massKg: 16, powerW: 42, blurb: "Read chemistry from orbit" },
  { id: "sar", name: "Radar (SAR)", massKg: 85, powerW: 320, blurb: "Sees through clouds and darkness" },
  { id: "spectrometer", name: "Mass spectrometer", massKg: 12, powerW: 28, blurb: "Taste atmospheres and plumes" },
  { id: "magnetometer", name: "Magnetometer", massKg: 3, powerW: 2, blurb: "Feel hidden oceans and cores" },
  { id: "particles", name: "Particle detector", massKg: 7, powerW: 10, blurb: "Count the solar wind" },
  { id: "telescope", name: "Space telescope", massKg: 120, powerW: 150, blurb: "Look outward, not down" },
  { id: "relay", name: "Comms relay", massKg: 22, powerW: 90, blurb: "Be the internet for other missions" },
];

const POWER = {
  solar: { name: "Solar arrays", emoji: "☀️" },
  rtg: { name: "Nuclear RTG", emoji: "⚛️" },
} as const;

/** FNV-1a — deterministic patch generation from the mission name. */
function hash(str: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

const PATCH_PALETTES: Array<[string, string, string]> = [
  ["#0b3d91", "#fc3d21", "#f5e6c8"], // NASA worm & meatball
  ["#1a1446", "#e0a458", "#9ad1d4"],
  ["#2d0a31", "#f45b69", "#ffd166"],
  ["#062726", "#5fbf77", "#d9a854"],
  ["#151b3d", "#8fb8de", "#fc3d21"],
  ["#301934", "#c77dff", "#ffd60a"],
];

function MissionPatch({ name, dest, seed }: { name: string; dest: Destination; seed: number }) {
  const [bg, accent, trim] = PATCH_PALETTES[seed % PATCH_PALETTES.length]!;
  const stars = useMemo(() => {
    const out: Array<{ x: number; y: number; r: number }> = [];
    let s = seed || 1;
    for (let i = 0; i < 26; i++) {
      s = (Math.imul(s, 1103515245) + 12345) >>> 0;
      const x = 30 + (s % 140);
      const y = 30 + ((s >> 8) % 140);
      const d = Math.hypot(x - 100, y - 100);
      if (d < 82) out.push({ x, y, r: 0.8 + ((s >> 16) % 10) / 9 });
    }
    return out;
  }, [seed]);
  const display = (name.trim() || "UNNAMED").toUpperCase().slice(0, 22);
  const tilt = -25 + (seed % 50);

  return (
    <svg viewBox="0 0 200 200" role="img" aria-label={`Mission patch for ${display}`} className="patch">
      <defs>
        <path id="patch-arc-top" d="M 100 100 m -74 0 a 74 74 0 1 1 148 0" />
        <path id="patch-arc-bottom" d="M 100 100 m -74 0 a 74 74 0 1 0 148 0" />
      </defs>
      <circle cx="100" cy="100" r="98" fill={trim} />
      <circle cx="100" cy="100" r="92" fill={bg} />
      <circle cx="100" cy="100" r="84" fill="none" stroke={trim} strokeWidth="1.2" opacity="0.6" />
      {stars.map((st, i) => (
        <circle key={i} cx={st.x} cy={st.y} r={st.r} fill="#fff" opacity="0.85" />
      ))}
      {/* destination world */}
      <circle cx="100" cy="104" r="26" fill={accent} />
      {dest.id === "titan" || dest.id === "interstellar" ? (
        <ellipse cx="100" cy="104" rx="40" ry="10" fill="none" stroke={trim} strokeWidth="3" transform={`rotate(${tilt} 100 104)`} />
      ) : null}
      {/* satellite orbit + craft */}
      <ellipse cx="100" cy="104" rx="56" ry="30" fill="none" stroke="#ffffff" strokeWidth="1.4" opacity="0.9" transform={`rotate(${tilt} 100 104)`} />
      <g transform={`rotate(${tilt} 100 104) translate(156 104)`}>
        <rect x="-4" y="-3" width="8" height="6" fill="#fff" />
        <rect x="-13" y="-1.6" width="8" height="3.2" fill={trim} />
        <rect x="5" y="-1.6" width="8" height="3.2" fill={trim} />
      </g>
      <text fontSize="13" fontFamily="Georgia, serif" fontWeight="bold" fill={trim} letterSpacing="2">
        <textPath href="#patch-arc-top" startOffset="50%" textAnchor="middle">
          {display}
        </textPath>
      </text>
      <text fontSize="10" fontFamily="Georgia, serif" fill="#ffffff" letterSpacing="3" opacity="0.9">
        <textPath href="#patch-arc-bottom" startOffset="50%" textAnchor="middle">
          {dest.name.toUpperCase()}
        </textPath>
      </text>
    </svg>
  );
}

type NasaImage = { title: string; nasaId: string; thumb: string };

export function MissionBuilder() {
  const [name, setName] = useState("");
  const [destId, setDestId] = useState("moon");
  const [picked, setPicked] = useState<string[]>(["camera", "magnetometer"]);
  const [power, setPower] = useState<keyof typeof POWER>("solar");
  const [images, setImages] = useState<NasaImage[] | null>(null);
  const [searching, setSearching] = useState(false);
  const svgHost = useRef<HTMLDivElement>(null);

  // Restore/persist the design locally — no account needed for the fun part.
  useEffect(() => {
    try {
      const saved = localStorage.getItem("orrery-mission");
      if (saved) {
        const d = JSON.parse(saved);
        if (typeof d.name === "string") setName(d.name);
        if (typeof d.destId === "string" && DESTINATIONS.some((x) => x.id === d.destId)) setDestId(d.destId);
        if (Array.isArray(d.picked)) setPicked(d.picked.filter((p: unknown) => INSTRUMENTS.some((i) => i.id === p)));
        if (d.power === "solar" || d.power === "rtg") setPower(d.power);
      }
    } catch { /* fresh start */ }
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("orrery-mission", JSON.stringify({ name, destId, picked, power }));
    } catch { /* private mode */ }
  }, [name, destId, picked, power]);

  const dest = DESTINATIONS.find((d) => d.id === destId)!;
  const seed = hash(`${name.trim().toLowerCase()}|${destId}`);

  const chosen = INSTRUMENTS.filter((i) => picked.includes(i.id));
  const payloadMass = chosen.reduce((n, i) => n + i.massKg, 0);
  const payloadPower = chosen.reduce((n, i) => n + i.powerW, 0);
  const busMass = Math.max(12, Math.round(payloadMass * 1.6));
  const powerSystemMass = power === "rtg" ? 45 : Math.max(6, Math.round(payloadPower / 25) * 4);
  const propellantFrac = Math.min(0.55, dest.dvFromLeo / 16);
  const dryMass = payloadMass + busMass + powerSystemMass;
  const wetMass = Math.round(dryMass / (1 - propellantFrac));
  const totalDv = 9.4 + dest.dvFromLeo;

  const solarShortfall = power === "solar" && dest.sunDistanceAu > 3;
  const rocket =
    wetMass < 250 ? "Rocket Lab Electron" :
    wetMass < 3000 && dest.dvFromLeo < 4.2 ? "Falcon 9 (rideshare-class)" :
    wetMass < 8000 ? "Falcon 9" :
    wetMass < 16000 ? "Falcon Heavy / New Glenn" :
    "Starship / SLS";

  function toggleInstrument(id: string) {
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : p.length >= 5 ? p : [...p, id]));
  }

  async function findMyName(e: React.FormEvent) {
    e.preventDefault();
    const q = name.trim();
    if (q.length < 2 || searching) return;
    setSearching(true);
    setImages(null);
    try {
      const res = await fetch(`/api/v0/nasa/images?q=${encodeURIComponent(q)}`);
      const data = res.ok ? await res.json() : { items: [] };
      setImages(data.items ?? []);
    } catch {
      setImages([]);
    }
    setSearching(false);
  }

  function downloadPatch() {
    const svg = svgHost.current?.querySelector("svg");
    if (!svg) return;
    const blob = new Blob([new XMLSerializer().serializeToString(svg)], { type: "image/svg+xml" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${(name.trim() || "orrery-mission").replace(/[^a-z0-9-_]+/gi, "-").toLowerCase()}-patch.svg`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <div className="builder">
      <div className="builder-form">
        <div className="card">
          <h3>1 · Name your satellite</h3>
          <input
            className="builder-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Falak-1, Stardust, Umeed…"
            maxLength={22}
            aria-label="Satellite name"
          />
          <p className="note">The patch is generated from your name — every name gets its own design.</p>
        </div>

        <div className="card">
          <h3>2 · Pick a destination</h3>
          <div className="builder-dests">
            {DESTINATIONS.map((d) => (
              <button
                key={d.id}
                type="button"
                className={`dest-btn${d.id === destId ? " selected" : ""}`}
                onClick={() => setDestId(d.id)}
                aria-pressed={d.id === destId}
              >
                <span aria-hidden="true">{d.emoji}</span> {d.name}
              </button>
            ))}
          </div>
          <p className="note">{dest.note}</p>
        </div>

        <div className="card">
          <h3>3 · Load instruments (max 5)</h3>
          <div className="builder-instruments">
            {INSTRUMENTS.map((i) => (
              <label key={i.id} className={`inst${picked.includes(i.id) ? " selected" : ""}`}>
                <input
                  type="checkbox"
                  checked={picked.includes(i.id)}
                  onChange={() => toggleInstrument(i.id)}
                />
                <span>
                  <b>{i.name}</b> — {i.blurb}
                  <small>{i.massKg} kg · {i.powerW} W</small>
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="card">
          <h3>4 · Power</h3>
          <div className="dir-filters">
            {(Object.keys(POWER) as Array<keyof typeof POWER>).map((p) => (
              <button
                key={p}
                type="button"
                className={`pill-btn${power === p ? " active" : ""}`}
                onClick={() => setPower(p)}
              >
                {POWER[p].emoji} {POWER[p].name}
              </button>
            ))}
          </div>
          {solarShortfall ? (
            <p className="form-error" role="alert">
              ⚠ At {dest.sunDistanceAu} AU sunlight is {Math.round(dest.sunDistanceAu ** 2)}× weaker
              than at Earth — real missions out there (Cassini, Voyager, New Horizons) carry an RTG.
            </p>
          ) : null}
        </div>
      </div>

      <div className="builder-result">
        <div className="card patch-card">
          <h3>Your mission patch</h3>
          <div ref={svgHost}>
            <MissionPatch name={name} dest={dest} seed={seed} />
          </div>
          <button type="button" className="pill-btn" onClick={downloadPatch}>
            ⬇ Download patch (SVG)
          </button>
        </div>

        <div className="card">
          <h3>Engineering readout</h3>
          <table>
            <tbody className="num">
              <tr><td>Payload</td><td>{chosen.length} instrument{chosen.length === 1 ? "" : "s"} · {payloadMass} kg · {payloadPower} W</td></tr>
              <tr><td>Bus + structure</td><td>{busMass} kg</td></tr>
              <tr><td>Power system</td><td>{POWER[power].name} · {powerSystemMass} kg</td></tr>
              <tr><td>Wet mass at launch</td><td><b>{wetMass.toLocaleString()} kg</b></td></tr>
              <tr><td>Total Δv from ground</td><td>{totalDv.toFixed(1)} km/s</td></tr>
              <tr><td>Cruise time</td><td>{dest.travel}</td></tr>
              <tr><td>Recommended rocket</td><td><b>{rocket}</b></td></tr>
            </tbody>
          </table>
          <p className="note">
            Simplified real physics: Δv via typical transfer budgets, propellant from the rocket
            equation at Isp ≈ 320 s. Good enough to feel the trade-offs real engineers fight.
          </p>
        </div>

        <div className="card">
          <h3>Your name in the NASA archive</h3>
          <form onSubmit={findMyName} className="dm-compose" style={{ marginTop: 0 }}>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Type a name first…" aria-label="Search name" maxLength={22} />
            <button type="submit" className="pill-btn primary" disabled={searching || name.trim().length < 2}>
              {searching ? "Searching…" : "Search NASA"}
            </button>
          </form>
          {images === null ? (
            <p className="note">Real NASA images matching your mission&apos;s name — try it.</p>
          ) : images.length === 0 ? (
            <p className="note">No NASA images match that name — yours will be the first. 🚀</p>
          ) : (
            <div className="gallery">
              {images.slice(0, 6).map((img) => (
                <a
                  key={img.nasaId}
                  className="gallery-item"
                  href={`https://images.nasa.gov/details/${encodeURIComponent(img.nasaId)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={img.thumb} alt={img.title} loading="lazy" />
                  <span className="gallery-caption">{img.title}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
