/**
 * Deep factsheets for major solar-system bodies (Phase 7 "rich object info").
 * Values are standard published figures (NASA planetary fact sheets / IAU),
 * editorial tier — displayed alongside, not instead of, the graph's claims.
 * Keyed by entity slug; objects without a sheet render exactly as before.
 */

export type FactSection = { title: string; rows: Array<[string, string]> };
export type Factsheet = {
  tagline: string;
  sections: FactSection[];
  funFacts: string[];
};

const F: Record<string, Factsheet> = {
  sun: {
    tagline: "The star at the center of everything we know",
    sections: [
      { title: "Physical characteristics", rows: [
        ["Mean radius", "696,340 km (109 × Earth)"],
        ["Mass", "1.989 × 10³⁰ kg — 99.86% of the Solar System"],
        ["Surface temperature", "~5,505 °C (photosphere)"],
        ["Core temperature", "~15.7 million °C"],
        ["Rotation", "~25 days at equator, ~34 days at poles"],
        ["Composition", "~73% hydrogen, ~25% helium"],
        ["Spectral class", "G2V yellow dwarf"],
      ]},
      { title: "Energy & activity", rows: [
        ["Luminosity", "3.828 × 10²⁶ W"],
        ["Energy source", "Proton–proton fusion: ~600 Mt hydrogen → helium per second"],
        ["Solar cycle", "~11 years between activity maxima"],
        ["Solar wind", "~400–800 km/s stream of charged particles"],
        ["Age", "~4.6 billion years (roughly halfway through its life)"],
      ]},
      { title: "Exploration", rows: [
        ["Closest approach", "Parker Solar Probe — inside 6.2 million km, >690,000 km/h"],
        ["Key observatories", "SOHO, SDO, Solar Orbiter, Parker Solar Probe"],
        ["First X-ray images", "Skylab, 1973"],
      ]},
    ],
    funFacts: [
      "Light from the Sun's core takes ~100,000 years to random-walk to the surface — then just 8 minutes 20 seconds to reach Earth.",
      "About 1.3 million Earths would fit inside the Sun.",
      "The Sun orbits the Milky Way's center every ~230 million years — one 'galactic year'.",
    ],
  },
  mercury: {
    tagline: "The scorched, shrinking innermost world",
    sections: [
      { title: "Physical characteristics", rows: [
        ["Mean radius", "2,439.7 km (0.38 × Earth)"],
        ["Mass", "3.301 × 10²³ kg"],
        ["Surface gravity", "3.7 m/s²"],
        ["Day length (solar)", "176 Earth days — two Mercury years"],
        ["Rotation period", "58.6 Earth days (3:2 spin–orbit resonance)"],
        ["Surface temperature", "−173 °C night to +427 °C day"],
      ]},
      { title: "Orbit", rows: [
        ["Distance from Sun", "57.9 million km (0.39 AU)"],
        ["Orbital period", "88 Earth days"],
        ["Eccentricity", "0.206 — the most elliptical planetary orbit"],
        ["Orbital speed", "47.4 km/s — fastest planet"],
      ]},
      { title: "Exploration", rows: [
        ["First flyby", "Mariner 10, 1974"],
        ["First orbiter", "MESSENGER, 2011–2015"],
        ["Current", "ESA/JAXA BepiColombo (orbit insertion 2026)"],
      ]},
    ],
    funFacts: [
      "Mercury has water ice in permanently shadowed polar craters despite being the closest planet to the Sun.",
      "The planet is shrinking: as its huge iron core cools, the surface has contracted ~7 km in radius, wrinkling into cliff-like 'lobate scarps'.",
      "Despite being closest to the Sun, Venus is hotter than Mercury — Mercury has almost no atmosphere to trap heat.",
    ],
  },
  venus: {
    tagline: "Earth's evil twin under a runaway greenhouse",
    sections: [
      { title: "Physical characteristics", rows: [
        ["Mean radius", "6,051.8 km (0.95 × Earth)"],
        ["Mass", "4.867 × 10²⁴ kg (0.815 × Earth)"],
        ["Surface gravity", "8.87 m/s²"],
        ["Rotation", "243 Earth days, retrograde — its day outlasts its year"],
        ["Surface temperature", "~464 °C — hottest planetary surface"],
        ["Surface pressure", "92 bar — like 900 m underwater on Earth"],
      ]},
      { title: "Atmosphere", rows: [
        ["Composition", "96.5% CO₂, 3.5% N₂, sulfuric-acid clouds"],
        ["Cloud deck", "45–70 km altitude; 'super-rotates' around the planet in 4 days"],
        ["Greenhouse effect", "The strongest known — +500 °C over airless equilibrium"],
      ]},
      { title: "Orbit", rows: [
        ["Distance from Sun", "108.2 million km (0.72 AU)"],
        ["Orbital period", "224.7 Earth days"],
        ["Brightness", "Up to magnitude −4.9 — brightest natural object after Sun and Moon"],
      ]},
      { title: "Exploration", rows: [
        ["First successful flyby", "Mariner 2, 1962"],
        ["First surface images", "Soviet Venera 9, 1975 (survived 53 min)"],
        ["Radar mapping", "Magellan, 1990–94"],
        ["Upcoming", "NASA VERITAS & DAVINCI, ESA EnVision"],
      ]},
    ],
    funFacts: [
      "A Venus day (243 Earth days) is longer than a Venus year (225 Earth days).",
      "Venus rotates backwards — the Sun rises in the west.",
      "Its surface is young (~300–700 My), hinting at planet-wide volcanic resurfacing.",
    ],
  },
  earth: {
    tagline: "The only world known to host life",
    sections: [
      { title: "Physical characteristics", rows: [
        ["Mean radius", "6,371 km"],
        ["Mass", "5.972 × 10²⁴ kg"],
        ["Surface gravity", "9.81 m/s²"],
        ["Day length", "23 h 56 m 4 s (sidereal)"],
        ["Axial tilt", "23.44° — the reason for seasons"],
        ["Surface", "71% ocean; mean depth 3.7 km"],
      ]},
      { title: "Atmosphere", rows: [
        ["Composition", "78% N₂, 21% O₂, 0.9% Ar, ~0.04% CO₂"],
        ["Pressure", "1013 hPa at sea level"],
        ["Magnetic field", "Generated by the liquid-iron outer core; shields the atmosphere from solar wind"],
      ]},
      { title: "Orbit", rows: [
        ["Distance from Sun", "149.6 million km (1 AU by definition)"],
        ["Orbital period", "365.256 days"],
        ["Orbital speed", "29.78 km/s"],
      ]},
    ],
    funFacts: [
      "Earth is the densest planet in the Solar System (5.51 g/cm³).",
      "The day is lengthening ~1.8 ms per century as the Moon steals rotational energy.",
      "Earth is the only planet not named after a Greco-Roman deity.",
    ],
  },
  moon: {
    tagline: "Earth's constant companion and humanity's first step outward",
    sections: [
      { title: "Physical characteristics", rows: [
        ["Mean radius", "1,737.4 km (0.27 × Earth)"],
        ["Mass", "7.342 × 10²² kg (1.2% of Earth)"],
        ["Surface gravity", "1.62 m/s² (1/6 g)"],
        ["Day length", "29.5 Earth days (synodic)"],
        ["Surface temperature", "−173 °C night to +127 °C day"],
        ["Distance from Earth", "384,400 km average (356k–407k)"],
      ]},
      { title: "Origin & geology", rows: [
        ["Origin", "Giant-impact hypothesis: debris from a Mars-sized body ('Theia') hitting proto-Earth"],
        ["Age", "~4.51 billion years"],
        ["Maria", "Dark basaltic plains covering 16% of the surface, mostly nearside"],
        ["Tidal locking", "Same face always toward Earth; libration reveals 59% over time"],
      ]},
      { title: "Exploration", rows: [
        ["First spacecraft", "Luna 2 impact, 1959"],
        ["First humans", "Apollo 11 — Armstrong & Aldrin, 20 July 1969"],
        ["Total moonwalkers", "12 (Apollo 11–17, 1969–72)"],
        ["Current era", "Artemis program, CLPS landers, Chang'e sample returns"],
      ]},
    ],
    funFacts: [
      "The Moon is drifting away from Earth at 3.8 cm per year — measured by laser to Apollo-era retroreflectors.",
      "The Sun and Moon appear the same size from Earth by pure coincidence — enabling total solar eclipses.",
      "Moonquakes happen — some magnitude ~5 — as the interior slowly cools and Earth's tides flex it.",
    ],
  },
  mars: {
    tagline: "The red planet — next stop for humans",
    sections: [
      { title: "Physical characteristics", rows: [
        ["Mean radius", "3,389.5 km (0.53 × Earth)"],
        ["Mass", "6.417 × 10²³ kg (0.107 × Earth)"],
        ["Surface gravity", "3.72 m/s² (0.38 g)"],
        ["Day length", "24 h 37 m — the 'sol'"],
        ["Axial tilt", "25.2° — Earth-like seasons, twice as long"],
        ["Surface temperature", "−140 °C to +30 °C (mean −63 °C)"],
      ]},
      { title: "Atmosphere & surface", rows: [
        ["Composition", "95% CO₂, 2.8% N₂, 2% Ar"],
        ["Pressure", "~6 hPa — 0.6% of Earth's"],
        ["Highest mountain", "Olympus Mons — 21.9 km, largest volcano known"],
        ["Grand canyon", "Valles Marineris — 4,000 km long, 7 km deep"],
        ["Water", "Polar ice caps, subsurface ice, ancient riverbeds and deltas"],
      ]},
      { title: "Orbit & moons", rows: [
        ["Distance from Sun", "227.9 million km (1.52 AU)"],
        ["Orbital period", "687 Earth days"],
        ["Moons", "Phobos & Deimos — captured-asteroid-sized, discovered 1877"],
      ]},
      { title: "Exploration", rows: [
        ["First flyby", "Mariner 4, 1965"],
        ["First rover", "Sojourner, 1997"],
        ["Active surface missions", "Curiosity, Perseverance + Ingenuity legacy"],
        ["Sample return", "Perseverance is caching samples for a future return mission"],
      ]},
    ],
    funFacts: [
      "Sunsets on Mars are blue — fine dust scatters red light and lets blue through near the Sun.",
      "Phobos orbits so low it crosses the sky twice a day and will disintegrate into a ring in ~50 million years.",
      "Mars once had rivers, lakes and possibly a northern ocean — Perseverance is exploring an ancient river delta.",
    ],
  },
  jupiter: {
    tagline: "King of the planets, a failed star's shadow",
    sections: [
      { title: "Physical characteristics", rows: [
        ["Mean radius", "69,911 km (11 × Earth)"],
        ["Mass", "1.898 × 10²⁷ kg — 2.5 × all other planets combined"],
        ["Gravity (cloud tops)", "24.8 m/s²"],
        ["Day length", "9 h 56 m — fastest-spinning planet"],
        ["Composition", "~90% hydrogen, ~10% helium — a gas giant with no surface"],
        ["Magnetic field", "20,000 × Earth's — the largest structure in the Solar System"],
      ]},
      { title: "Atmosphere", rows: [
        ["Great Red Spot", "A storm wider than Earth, raging ≥190 years"],
        ["Winds", "Up to 620 km/h in the banded jets"],
        ["Clouds", "Ammonia ice over ammonium hydrosulfide over water"],
      ]},
      { title: "Orbit & moons", rows: [
        ["Distance from Sun", "778.5 million km (5.2 AU)"],
        ["Orbital period", "11.86 Earth years"],
        ["Known moons", "95+, led by the four Galilean moons (discovered 1610)"],
        ["Rings", "Yes — faint dust rings found by Voyager 1"],
      ]},
      { title: "Exploration", rows: [
        ["First flyby", "Pioneer 10, 1973"],
        ["First orbiter", "Galileo, 1995–2003 (+ atmospheric probe)"],
        ["Current", "Juno (polar orbit); Europa Clipper & ESA JUICE en route"],
      ]},
    ],
    funFacts: [
      "Jupiter's magnetosphere would look bigger than the full Moon if it glowed visibly.",
      "It acts as the Solar System's vacuum cleaner, deflecting or capturing comets — Shoemaker–Levy 9 hit it in 1994.",
      "Ganymede, its largest moon, is bigger than the planet Mercury.",
    ],
  },
  saturn: {
    tagline: "The jewel of the Solar System",
    sections: [
      { title: "Physical characteristics", rows: [
        ["Mean radius", "58,232 km (9.4 × Earth)"],
        ["Mass", "5.683 × 10²⁶ kg (95 × Earth)"],
        ["Density", "0.687 g/cm³ — less than water"],
        ["Day length", "10 h 33 m"],
        ["Winds", "Up to 1,800 km/h at the equator"],
        ["North pole", "A bizarre persistent hexagonal jet stream, ~30,000 km wide"],
      ]},
      { title: "The rings", rows: [
        ["Extent", "~282,000 km across, yet locally only ~10 m to 1 km thick"],
        ["Composition", "~95% water ice, from dust grains to house-sized chunks"],
        ["Age", "Possibly young — maybe only 10–100 million years"],
        ["Discovery", "Galileo saw 'handles' in 1610; Huygens identified a ring in 1655"],
      ]},
      { title: "Orbit & moons", rows: [
        ["Distance from Sun", "1.43 billion km (9.5 AU)"],
        ["Orbital period", "29.4 Earth years"],
        ["Known moons", "146+ — most of any planet; Titan and geyser-moon Enceladus star among them"],
      ]},
      { title: "Exploration", rows: [
        ["Flybys", "Pioneer 11 (1979), Voyagers 1–2 (1980–81)"],
        ["Orbiter", "Cassini, 2004–2017 — ended in a deliberate atmospheric plunge"],
        ["Landing", "ESA's Huygens probe landed on Titan, 2005 — farthest landing ever"],
        ["Next", "Dragonfly rotorcraft to Titan (2030s)"],
      ]},
    ],
    funFacts: [
      "Saturn would float in a big enough bathtub — it's the least dense planet.",
      "Its rings vanish edge-on from Earth every ~15 years.",
      "Enceladus vents salty ocean water into space that becomes part of Saturn's E ring.",
    ],
  },
  uranus: {
    tagline: "The sideways ice giant",
    sections: [
      { title: "Physical characteristics", rows: [
        ["Mean radius", "25,362 km (4 × Earth)"],
        ["Mass", "8.681 × 10²⁵ kg (14.5 × Earth)"],
        ["Axial tilt", "97.8° — it orbits rolling on its side"],
        ["Day length", "17 h 14 m (retrograde)"],
        ["Coldest atmosphere", "−224 °C minimum — colder than more-distant Neptune"],
        ["Color", "Pale cyan from methane absorbing red light"],
      ]},
      { title: "Orbit & moons", rows: [
        ["Distance from Sun", "2.87 billion km (19.2 AU)"],
        ["Orbital period", "84 Earth years"],
        ["Seasons", "Each pole gets 42 years of daylight, then 42 of night"],
        ["Known moons", "28, named for Shakespeare & Pope characters"],
        ["Rings", "13 narrow, dark rings — found from Earth in 1977"],
      ]},
      { title: "Exploration", rows: [
        ["Discovery", "William Herschel, 1781 — first telescope-discovered planet"],
        ["Only visit", "Voyager 2 flyby, January 1986"],
        ["Next", "A flagship Uranus orbiter is US planetary science's top decadal priority"],
      ]},
    ],
    funFacts: [
      "Uranus likely got knocked sideways by an Earth-sized impact early in its history.",
      "Herschel wanted to name it 'Georgium Sidus' after King George III.",
      "Inside, water, methane and ammonia may form a superionic 'hot ice' mantle — and possibly diamond rain.",
    ],
  },
  neptune: {
    tagline: "The windy blue frontier planet",
    sections: [
      { title: "Physical characteristics", rows: [
        ["Mean radius", "24,622 km (3.9 × Earth)"],
        ["Mass", "1.024 × 10²⁶ kg (17 × Earth)"],
        ["Day length", "16 h 6 m"],
        ["Winds", "Up to 2,100 km/h — fastest in the Solar System"],
        ["Temperature", "−214 °C cloud tops, yet radiates 2.6 × the heat it receives"],
      ]},
      { title: "Orbit & moons", rows: [
        ["Distance from Sun", "4.5 billion km (30.1 AU)"],
        ["Orbital period", "164.8 Earth years — one orbit since discovery (2011)"],
        ["Known moons", "16; Triton dominates"],
        ["Triton", "Orbits backwards — a captured Kuiper Belt world with nitrogen geysers"],
      ]},
      { title: "Exploration", rows: [
        ["Discovery", "1846, predicted mathematically from Uranus's orbit by Le Verrier"],
        ["Only visit", "Voyager 2 flyby, August 1989"],
      ]},
    ],
    funFacts: [
      "Neptune was found with pen and paper first — its gravity was tugging Uranus off course.",
      "The 'Great Dark Spot' Voyager saw had vanished when Hubble looked five years later.",
      "Sunlight there is ~900 × dimmer than on Earth — noon looks like deep twilight.",
    ],
  },
  pluto: {
    tagline: "The beloved dwarf planet at the edge",
    sections: [
      { title: "Physical characteristics", rows: [
        ["Mean radius", "1,188.3 km (smaller than the Moon)"],
        ["Mass", "1.303 × 10²² kg (0.2% of Earth)"],
        ["Surface gravity", "0.62 m/s²"],
        ["Day length", "6.4 Earth days (retrograde)"],
        ["Surface", "Nitrogen-ice plains, water-ice mountains up to 3.5 km, red tholin snow"],
        ["Temperature", "~−229 °C"],
      ]},
      { title: "Orbit & moons", rows: [
        ["Distance from Sun", "29.7–49.3 AU — crosses inside Neptune's orbit"],
        ["Orbital period", "248 Earth years"],
        ["Moons", "5; Charon is so large they orbit a point between them"],
        ["Status", "Reclassified 'dwarf planet' by the IAU, 2006"],
      ]},
      { title: "Exploration", rows: [
        ["Discovery", "Clyde Tombaugh, 1930, Lowell Observatory"],
        ["Only visit", "New Horizons flyby, 14 July 2015"],
        ["Named by", "11-year-old Venetia Burney of Oxford"],
      ]},
    ],
    funFacts: [
      "Pluto's heart-shaped Sputnik Planitia is a 1,000-km nitrogen-ice glacier that may hide a subsurface ocean.",
      "A gram of Clyde Tombaugh's ashes flew past Pluto aboard New Horizons.",
      "Pluto hasn't completed one orbit since its discovery — that happens in 2178.",
    ],
  },
  io: {
    tagline: "The Solar System's volcano world",
    sections: [
      { title: "Physical characteristics", rows: [
        ["Mean radius", "1,821.6 km"],
        ["Volcanoes", "~400 active — plumes reach 500 km high"],
        ["Cause", "Tidal kneading between Jupiter, Europa and Ganymede"],
        ["Surface", "Sulfur yellows, reds and blacks; no impact craters survive"],
      ]},
      { title: "Orbit", rows: [
        ["Orbital period", "1.77 days, in 1:2:4 resonance with Europa & Ganymede"],
        ["Radiation", "Sits inside Jupiter's harshest radiation belt"],
      ]},
    ],
    funFacts: [
      "Io repaves itself so fast its surface is geologically brand-new.",
      "Its volcano Loki alone outshines all of Earth's volcanoes combined in heat output.",
    ],
  },
  europa: {
    tagline: "An ocean world wrapped in ice",
    sections: [
      { title: "Physical characteristics", rows: [
        ["Mean radius", "1,560.8 km — slightly smaller than the Moon"],
        ["Ice shell", "15–25 km thick over a 60–150 km deep ocean"],
        ["Ocean", "Likely holds 2 × the water in all Earth's oceans"],
        ["Surface age", "~60 million years — young, cracked, nearly craterless"],
      ]},
      { title: "Exploration", rows: [
        ["Evidence for ocean", "Galileo magnetometer, 1990s; Hubble plume hints"],
        ["Current", "NASA Europa Clipper (arriving 2030) & ESA JUICE"],
      ]},
    ],
    funFacts: [
      "Europa's ocean has probably existed for 4 billion years — plenty of time for chemistry, maybe biology.",
      "Its cracked 'chaos terrain' may be where ocean water reaches the surface.",
    ],
  },
  ganymede: {
    tagline: "The largest moon in the Solar System",
    sections: [
      { title: "Physical characteristics", rows: [
        ["Mean radius", "2,634.1 km — larger than Mercury"],
        ["Magnetic field", "The only moon that generates its own"],
        ["Ocean", "A salty subsurface ocean sandwiched between ice layers"],
      ]},
      { title: "Exploration", rows: [
        ["Discovery", "Galileo Galilei, 1610"],
        ["Next", "ESA's JUICE will orbit Ganymede in the 2030s — first orbit of another planet's moon"],
      ]},
    ],
    funFacts: [
      "If Ganymede orbited the Sun instead of Jupiter, it would be called a planet.",
      "Its auroras wobble less than expected — the giveaway of a hidden ocean.",
    ],
  },
  titan: {
    tagline: "The moon with rivers, rain and seas — of methane",
    sections: [
      { title: "Physical characteristics", rows: [
        ["Mean radius", "2,574.7 km — second-largest moon"],
        ["Atmosphere", "1.45 bar at the surface, mostly N₂ — thicker than Earth's"],
        ["Weather", "Methane rain, rivers, and polar seas (Kraken Mare ≈ Caspian Sea)"],
        ["Temperature", "−179 °C"],
      ]},
      { title: "Exploration", rows: [
        ["Landing", "ESA Huygens probe, 2005 — pictures of rounded 'ice pebbles'"],
        ["Next", "NASA Dragonfly — a nuclear-powered rotorcraft, arriving mid-2030s"],
      ]},
    ],
    funFacts: [
      "With low gravity and thick air, a human on Titan could fly by flapping strapped-on wings.",
      "Beneath the hydrocarbon landscape hides a water ocean — two habitable-zone chemistries on one moon.",
    ],
  },
  enceladus: {
    tagline: "The tiny moon feeding a ring with its ocean",
    sections: [
      { title: "Physical characteristics", rows: [
        ["Mean radius", "252.1 km"],
        ["Albedo", "~0.99 — the most reflective body known"],
        ["Geysers", "100+ jets at the south-polar 'tiger stripes'"],
      ]},
      { title: "Ocean & habitability", rows: [
        ["Ocean", "Global, salty, beneath ~20 km of ice"],
        ["Chemistry", "Cassini tasted H₂, silica, organics and phosphates in the plume — food for life as we know it"],
      ]},
    ],
    funFacts: [
      "Cassini flew straight through the plumes and sampled an alien ocean without landing.",
      "Enceladus's spray creates Saturn's entire E ring.",
    ],
  },
  triton: {
    tagline: "Neptune's captured, doomed ice moon",
    sections: [
      { title: "Physical characteristics", rows: [
        ["Mean radius", "1,353.4 km"],
        ["Orbit", "Retrograde — the only large moon orbiting backwards"],
        ["Surface", "Nitrogen ice with active dark geysers (seen by Voyager 2)"],
        ["Temperature", "−235 °C — among the coldest measured surfaces"],
      ]},
    ],
    funFacts: [
      "Triton is almost certainly a captured Kuiper Belt object — a sibling of Pluto in orbit around Neptune.",
      "Tidal decay will one day tear it apart into a spectacular ring system.",
    ],
  },
  ceres: {
    tagline: "The dwarf planet of the asteroid belt",
    sections: [
      { title: "Physical characteristics", rows: [
        ["Mean radius", "469.7 km — largest object in the asteroid belt"],
        ["Mass", "~1/3 of the entire belt's mass"],
        ["Bright spots", "Sodium-carbonate salt deposits in Occator crater — residue of subsurface brine"],
      ]},
      { title: "Exploration", rows: [
        ["Discovery", "Giuseppe Piazzi, 1801 — first asteroid ever found"],
        ["Orbiter", "NASA Dawn, 2015–2018 — first spacecraft to orbit two worlds"],
      ]},
    ],
    funFacts: [
      "Ceres was counted as a planet for ~50 years before being reclassified — twice.",
      "It may still have briny liquid underground, making it the nearest ocean-world candidate.",
    ],
  },
  phobos: {
    tagline: "Mars's doomed inner moon",
    sections: [
      { title: "Physical characteristics", rows: [
        ["Dimensions", "27 × 22 × 18 km"],
        ["Orbit", "6,000 km above Mars — closer than any other moon to its planet"],
        ["Fate", "Spiraling in 1.8 m/century; breakup into a ring in ~50 My"],
      ]},
    ],
    funFacts: [
      "From Mars, Phobos rises in the west and sets in the east — twice a day.",
      "JAXA's MMX mission plans to bring a sample of Phobos back to Earth.",
    ],
  },
  deimos: {
    tagline: "Mars's tiny outer moon",
    sections: [
      { title: "Physical characteristics", rows: [
        ["Dimensions", "15 × 12.2 × 11 km"],
        ["Orbital period", "30.3 hours"],
        ["Appearance from Mars", "A bright star that takes 2.7 days to cross the sky"],
      ]},
    ],
    funFacts: [
      "Deimos is so small its escape velocity is ~5.6 m/s — you could nearly jump off it.",
    ],
  },
};

export function factsheetFor(slug: string): Factsheet | null {
  return F[slug] ?? null;
}
