/**
 * Famous missions — the reference-layer backbone (PRD ENT). Curated for
 * page-worthiness and news-tagging value. Space telescopes live in
 * observatories.ts (kind=telescope); this file is probes, rovers, landers,
 * crewed programs, and stations (kind=mission).
 */
import type { CatalogEntry, CatalogRel } from "./types";

interface M {
  slug: string;
  name: string;
  cls: string; // probe | orbiter | rover | lander | flyby | sample-return | crewed | space-station | impactor | helicopter
  agency: string; // agency/company slug
  launched: number | string;
  status: "active" | "complete" | "lost" | "planned" | "en-route";
  targets?: string[]; // object slugs
  summary: string;
  aliases?: string[];
  noNameAlias?: boolean;
  successorOf?: string;
}

const M_LIST: M[] = [
  // ── Interstellar & outer system ──
  { slug: "voyager-1", name: "Voyager 1", cls: "probe", agency: "nasa", launched: 1977, status: "active", targets: ["jupiter", "saturn"], summary: "The farthest human-made object — beyond 165 AU and still calling home from interstellar space after almost 50 years." },
  { slug: "voyager-2", name: "Voyager 2", cls: "probe", agency: "nasa", launched: 1977, status: "active", targets: ["jupiter", "saturn", "uranus", "neptune"], summary: "The only spacecraft to visit all four giant planets, now exploring interstellar space." },
  { slug: "pioneer-10", name: "Pioneer 10", cls: "probe", agency: "nasa", launched: 1972, status: "complete", targets: ["jupiter"], summary: "The first spacecraft to cross the asteroid belt and fly past Jupiter, carrying the famous plaque." },
  { slug: "pioneer-11", name: "Pioneer 11", cls: "probe", agency: "nasa", launched: 1973, status: "complete", targets: ["jupiter", "saturn"], summary: "First spacecraft to fly past Saturn, blazing the trail for the Voyagers." },
  { slug: "new-horizons", name: "New Horizons", cls: "probe", agency: "nasa", launched: 2006, status: "active", targets: ["pluto"], summary: "Revealed Pluto as a living world in 2015, then flew past Kuiper-belt object Arrokoth — still exploring the belt." },
  { slug: "cassini", name: "Cassini–Huygens", cls: "orbiter", agency: "nasa", launched: 1997, status: "complete", targets: ["saturn", "titan", "enceladus"], summary: "Thirteen years orbiting Saturn: landed Huygens on Titan, found Enceladus's plumes, and ended in the 2017 Grand Finale plunge.", aliases: ["Cassini", "Huygens"] },
  { slug: "galileo", name: "Galileo", cls: "orbiter", agency: "nasa", launched: 1989, status: "complete", targets: ["jupiter", "europa", "io"], summary: "The first Jupiter orbiter — discovered evidence for Europa's subsurface ocean.", noNameAlias: true, aliases: ["Galileo spacecraft", "Galileo probe", "Galileo orbiter"] },
  { slug: "juno", name: "Juno", cls: "orbiter", agency: "nasa", launched: 2011, status: "active", targets: ["jupiter", "io"], summary: "Polar-orbiting Jupiter explorer mapping the giant planet's interior, aurorae, and moons.", noNameAlias: true, aliases: ["Juno spacecraft", "Juno mission", "Juno orbiter"] },
  { slug: "europa-clipper", name: "Europa Clipper", cls: "orbiter", agency: "nasa", launched: 2024, status: "en-route", targets: ["europa", "jupiter"], summary: "NASA's flagship ocean-worlds mission, arriving at Jupiter in 2030 to survey Europa's habitability across ~50 flybys.", aliases: ["Clipper"] },
  { slug: "juice", name: "JUICE", cls: "orbiter", agency: "esa", launched: 2023, status: "en-route", targets: ["jupiter", "ganymede", "europa", "callisto"], summary: "ESA's Jupiter Icy Moons Explorer, arriving 2031 — the first spacecraft that will orbit a moon other than our own (Ganymede).", aliases: ["Jupiter Icy Moons Explorer"] },
  { slug: "dragonfly", name: "Dragonfly", cls: "helicopter", agency: "nasa", launched: "2028 (planned)", status: "planned", targets: ["titan"], summary: "A nuclear-powered rotorcraft that will hop across Titan's organic dunes in the mid-2030s.", noNameAlias: true, aliases: ["Dragonfly mission", "Dragonfly rotorcraft", "Titan Dragonfly"] },

  // ── Mars ──
  { slug: "mariner-4", name: "Mariner 4", cls: "flyby", agency: "nasa", launched: 1964, status: "complete", targets: ["mars"], summary: "Returned the first close-up pictures of another planet, revealing a cratered Mars in 1965." },
  { slug: "mariner-9", name: "Mariner 9", cls: "orbiter", agency: "nasa", launched: 1971, status: "complete", targets: ["mars"], summary: "The first spacecraft to orbit another planet, mapping Mars's volcanoes and Valles Marineris." },
  { slug: "viking-1", name: "Viking 1", cls: "lander", agency: "nasa", launched: 1975, status: "complete", targets: ["mars"], summary: "The first fully successful Mars landing (1976), operating on Chryse Planitia for six years." },
  { slug: "viking-2", name: "Viking 2", cls: "lander", agency: "nasa", launched: 1975, status: "complete", targets: ["mars"], summary: "Twin of Viking 1, which landed on Utopia Planitia and searched Martian soil for life." },
  { slug: "mars-pathfinder", name: "Mars Pathfinder", cls: "lander", agency: "nasa", launched: 1996, status: "complete", targets: ["mars"], summary: "The 1997 airbag landing that delivered Sojourner, the first rover on Mars.", aliases: ["Pathfinder", "Sojourner"] },
  { slug: "spirit", name: "Spirit", cls: "rover", agency: "nasa", launched: 2003, status: "complete", targets: ["mars"], summary: "Mars Exploration Rover A — drove 7.7 km through Gusev crater from 2004 until 2010.", noNameAlias: true, aliases: ["Spirit rover", "MER-A"] },
  { slug: "opportunity", name: "Opportunity", cls: "rover", agency: "nasa", launched: 2003, status: "complete", targets: ["mars"], summary: "The marathon rover: 45 km and 14 years across Meridiani Planum, silenced by the 2018 dust storm.", noNameAlias: true, aliases: ["Opportunity rover", "MER-B", "Oppy"] },
  { slug: "curiosity", name: "Curiosity", cls: "rover", agency: "nasa", launched: 2011, status: "active", targets: ["mars"], summary: "The car-sized Mars Science Laboratory, climbing Mount Sharp in Gale crater since 2012.", noNameAlias: true, aliases: ["Curiosity rover", "Mars Science Laboratory", "MSL"] },
  { slug: "perseverance", name: "Perseverance", cls: "rover", agency: "nasa", launched: 2020, status: "active", targets: ["mars"], summary: "Caching samples in Jezero crater for eventual return to Earth — and it brought a helicopter.", aliases: ["Perseverance rover", "Mars 2020"] },
  { slug: "ingenuity", name: "Ingenuity", cls: "helicopter", agency: "nasa", launched: 2020, status: "complete", targets: ["mars"], summary: "The first aircraft to fly on another planet — 72 flights on Mars before a rotor failure in 2024.", aliases: ["Ingenuity helicopter", "Mars helicopter"] },
  { slug: "insight", name: "InSight", cls: "lander", agency: "nasa", launched: 2018, status: "complete", targets: ["mars"], summary: "Listened to marsquakes for four years, mapping the red planet's interior for the first time." },
  { slug: "mars-odyssey", name: "Mars Odyssey", cls: "orbiter", agency: "nasa", launched: 2001, status: "active", targets: ["mars"], summary: "The longest-serving spacecraft at another planet — orbiting and relaying from Mars since 2001.", aliases: ["2001 Mars Odyssey", "Odyssey orbiter"] },
  { slug: "mro", name: "Mars Reconnaissance Orbiter", cls: "orbiter", agency: "nasa", launched: 2005, status: "active", targets: ["mars"], summary: "Its HiRISE camera resolves Mars from orbit at ~30 cm per pixel — the planet's sharpest eyes.", aliases: ["MRO", "HiRISE"] },
  { slug: "maven", name: "MAVEN", cls: "orbiter", agency: "nasa", launched: 2013, status: "active", targets: ["mars"], summary: "Studies how the solar wind stripped away the Martian atmosphere." },
  { slug: "mars-express", name: "Mars Express", cls: "orbiter", agency: "esa", launched: 2003, status: "active", targets: ["mars"], summary: "ESA's first planetary mission, still imaging Mars and sounding its buried ice after two decades." },
  { slug: "exomars-tgo", name: "ExoMars Trace Gas Orbiter", cls: "orbiter", agency: "esa", launched: 2016, status: "active", targets: ["mars"], summary: "Hunts methane and other trace gases in the Martian atmosphere and relays for surface missions.", aliases: ["ExoMars", "Trace Gas Orbiter", "TGO"] },
  { slug: "tianwen-1", name: "Tianwen-1", cls: "orbiter", agency: "cnsa", launched: 2020, status: "active", targets: ["mars"], summary: "China's first Mars mission — orbiter, lander, and the Zhurong rover, all on the first try.", aliases: ["Zhurong"] },
  { slug: "emirates-mars-mission", name: "Emirates Mars Mission", cls: "orbiter", agency: "mbrsc", launched: 2020, status: "active", targets: ["mars"], summary: "The Arab world's first interplanetary mission — the Hope orbiter studies Mars's weather across full daily and seasonal cycles.", aliases: ["Hope probe", "Hope orbiter", "Al Amal"] },
  { slug: "mangalyaan", name: "Mars Orbiter Mission", cls: "orbiter", agency: "isro", launched: 2013, status: "complete", targets: ["mars"], summary: "India's first interplanetary mission, which reached Mars orbit on its maiden attempt for ~$74 million.", aliases: ["Mangalyaan", "MOM"] },
  { slug: "phoenix", name: "Phoenix", cls: "lander", agency: "nasa", launched: 2007, status: "complete", targets: ["mars"], summary: "Dug into the Martian arctic in 2008 and touched water ice centimeters below the soil.", noNameAlias: true, aliases: ["Phoenix lander", "Phoenix Mars lander"] },
  { slug: "mars-sample-return", name: "Mars Sample Return", cls: "sample-return", agency: "nasa", launched: "2030s (planned)", status: "planned", targets: ["mars"], summary: "The campaign to bring Perseverance's cached samples to Earth — under redesign after cost overruns.", aliases: ["MSR"] },

  // ── Venus & Mercury ──
  { slug: "mariner-2", name: "Mariner 2", cls: "flyby", agency: "nasa", launched: 1962, status: "complete", targets: ["venus"], summary: "The first successful planetary flyby — confirmed Venus's furnace-hot surface in 1962." },
  { slug: "magellan", name: "Magellan", cls: "orbiter", agency: "nasa", launched: 1989, status: "complete", targets: ["venus"], summary: "Radar-mapped 98% of Venus through its clouds in the early 1990s.", noNameAlias: true, aliases: ["Magellan spacecraft", "Magellan probe"] },
  { slug: "venus-express", name: "Venus Express", cls: "orbiter", agency: "esa", launched: 2005, status: "complete", targets: ["venus"], summary: "ESA's eight-year study of Venus's super-rotating atmosphere." },
  { slug: "akatsuki", name: "Akatsuki", cls: "orbiter", agency: "jaxa", launched: 2010, status: "complete", targets: ["venus"], summary: "JAXA's Venus climate orbiter — missed orbit in 2010, then pulled off a daring second attempt in 2015." },
  { slug: "mariner-10", name: "Mariner 10", cls: "flyby", agency: "nasa", launched: 1973, status: "complete", targets: ["mercury", "venus"], summary: "First spacecraft to see Mercury, using the first gravity-assist trajectory." },
  { slug: "messenger", name: "MESSENGER", cls: "orbiter", agency: "nasa", launched: 2004, status: "complete", targets: ["mercury"], summary: "The first Mercury orbiter — mapped the whole planet and found water ice in polar shadows." },
  { slug: "bepicolombo", name: "BepiColombo", cls: "orbiter", agency: "esa", launched: 2018, status: "en-route", targets: ["mercury"], summary: "Joint ESA–JAXA twin orbiters arriving at Mercury in 2026 after nine flybys.", aliases: ["Bepi"] },

  // ── Sun ──
  { slug: "parker-solar-probe", name: "Parker Solar Probe", cls: "probe", agency: "nasa", launched: 2018, status: "active", targets: ["sun"], summary: "The fastest human-made object — flying through the Sun's corona, closest pass just 6.1 million km in December 2024.", aliases: ["Parker probe", "PSP"] },
  { slug: "solar-orbiter", name: "Solar Orbiter", cls: "orbiter", agency: "esa", launched: 2020, status: "active", targets: ["sun"], summary: "Images the Sun from inside Mercury's orbit and is climbing toward the first good views of the solar poles." },
  { slug: "ulysses", name: "Ulysses", cls: "probe", agency: "esa", launched: 1990, status: "complete", targets: ["sun", "jupiter"], summary: "Flew over the Sun's poles via a Jupiter gravity assist — the first out-of-ecliptic solar mission.", noNameAlias: true, aliases: ["Ulysses spacecraft", "Ulysses probe"] },
  { slug: "aditya-l1", name: "Aditya-L1", cls: "observatory-mission", agency: "isro", launched: 2023, status: "active", targets: ["sun"], summary: "India's first solar observatory, watching the corona from the Sun–Earth L1 point.", aliases: ["Aditya"] },

  // ── Small bodies ──
  { slug: "rosetta", name: "Rosetta", cls: "orbiter", agency: "esa", launched: 2004, status: "complete", summary: "Escorted comet 67P for two years and landed Philae — the first soft landing on a comet.", noNameAlias: true, aliases: ["Rosetta spacecraft", "Rosetta mission", "Philae"] },
  { slug: "dawn", name: "Dawn", cls: "orbiter", agency: "nasa", launched: 2007, status: "complete", targets: ["vesta", "ceres"], summary: "The only spacecraft to orbit two different worlds — Vesta, then dwarf planet Ceres — thanks to ion propulsion.", noNameAlias: true, aliases: ["Dawn spacecraft", "Dawn mission"] },
  { slug: "near-shoemaker", name: "NEAR Shoemaker", cls: "orbiter", agency: "nasa", launched: 1996, status: "complete", summary: "First to orbit — and then, improvising, land on — an asteroid (Eros, 2001).", aliases: ["NEAR"] },
  { slug: "hayabusa", name: "Hayabusa", cls: "sample-return", agency: "jaxa", launched: 2003, status: "complete", summary: "Limped home heroically in 2010 with the first asteroid sample ever returned (Itokawa)." },
  { slug: "hayabusa2", name: "Hayabusa2", cls: "sample-return", agency: "jaxa", launched: 2014, status: "active", summary: "Shot a crater into asteroid Ryugu, returned pristine samples in 2020, and flew onward to a new target.", aliases: ["Hayabusa 2"] },
  { slug: "osiris-rex", name: "OSIRIS-REx", cls: "sample-return", agency: "nasa", launched: 2016, status: "active", targets: ["bennu"], summary: "Returned 121 g of asteroid Bennu in 2023 — now, as OSIRIS-APEX, heading to Apophis for its 2029 Earth flyby.", aliases: ["OSIRIS-APEX"] },
  { slug: "dart", name: "DART", cls: "impactor", agency: "nasa", launched: 2021, status: "complete", summary: "Humanity's first planetary-defense test — deliberately crashed into Dimorphos in 2022 and measurably changed its orbit.", aliases: ["Double Asteroid Redirection Test"] },
  { slug: "hera", name: "Hera", cls: "orbiter", agency: "esa", launched: 2024, status: "en-route", summary: "ESA's follow-up detective, arriving 2026 to survey the crater DART left on Dimorphos.", noNameAlias: true, aliases: ["Hera mission", "Hera spacecraft", "Hera probe"] },
  { slug: "lucy", name: "Lucy", cls: "probe", agency: "nasa", launched: 2021, status: "active", targets: ["jupiter"], summary: "Touring a record eight asteroids, including Jupiter's never-visited Trojans, through 2033.", noNameAlias: true, aliases: ["Lucy spacecraft", "Lucy mission", "Lucy probe"] },
  { slug: "psyche", name: "Psyche", cls: "orbiter", agency: "nasa", launched: 2023, status: "en-route", summary: "En route to the metal asteroid Psyche — likely the exposed core of a proto-planet — arriving 2029.", noNameAlias: true, aliases: ["Psyche spacecraft", "Psyche mission", "asteroid Psyche"] },
  { slug: "deep-impact", name: "Deep Impact", cls: "impactor", agency: "nasa", launched: 2005, status: "complete", summary: "Fired an impactor into comet Tempel 1 on July 4, 2005 to read its interior.", noNameAlias: true, aliases: ["Deep Impact mission", "Deep Impact spacecraft"] },
  { slug: "stardust", name: "Stardust", cls: "sample-return", agency: "nasa", launched: 1999, status: "complete", summary: "Caught comet Wild 2 dust in aerogel and parachuted it home in 2006 — the first comet sample return.", noNameAlias: true, aliases: ["Stardust mission", "Stardust spacecraft"] },

  // ── Moon ──
  { slug: "luna-2", name: "Luna 2", cls: "impactor", agency: "roscosmos", launched: 1959, status: "complete", targets: ["moon"], summary: "The first human-made object to reach another world, striking the Moon in September 1959." },
  { slug: "luna-9", name: "Luna 9", cls: "lander", agency: "roscosmos", launched: 1966, status: "complete", targets: ["moon"], summary: "The first soft landing on the Moon — and the first pictures from another world's surface." },
  { slug: "surveyor-1", name: "Surveyor 1", cls: "lander", agency: "nasa", launched: 1966, status: "complete", targets: ["moon"], summary: "America's first lunar soft-lander, proving the surface could bear a spacecraft — and an astronaut." },
  { slug: "apollo-8", name: "Apollo 8", cls: "crewed", agency: "nasa", launched: 1968, status: "complete", targets: ["moon"], summary: "The first humans to leave Earth orbit — and the crew that photographed Earthrise." },
  { slug: "apollo-11", name: "Apollo 11", cls: "crewed", agency: "nasa", launched: 1969, status: "complete", targets: ["moon"], summary: "Armstrong and Aldrin's first steps on the Moon, July 20, 1969 — the defining achievement of spaceflight." },
  { slug: "apollo-13", name: "Apollo 13", cls: "crewed", agency: "nasa", launched: 1970, status: "complete", targets: ["moon"], summary: "The 'successful failure': an oxygen-tank explosion turned a Moon landing into history's most dramatic rescue." },
  { slug: "apollo-17", name: "Apollo 17", cls: "crewed", agency: "nasa", launched: 1972, status: "complete", targets: ["moon"], summary: "The last crewed Moon landing — three days in Taurus–Littrow with the first scientist on the Moon." },
  { slug: "lro", name: "Lunar Reconnaissance Orbiter", cls: "orbiter", agency: "nasa", launched: 2009, status: "active", targets: ["moon"], summary: "Mapping the Moon at half-meter resolution since 2009 — the base map for every modern landing.", aliases: ["LRO"] },
  { slug: "chandrayaan-3", name: "Chandrayaan-3", cls: "lander", agency: "isro", launched: 2023, status: "complete", targets: ["moon"], summary: "Made India the first nation to land near the lunar south pole (August 2023).", aliases: ["Vikram lander", "Pragyan rover"] },
  { slug: "change-4", name: "Chang'e 4", cls: "lander", agency: "cnsa", launched: 2018, status: "active", targets: ["moon"], summary: "The first landing on the Moon's far side, with the long-lived Yutu-2 rover.", aliases: ["Change 4", "Yutu-2"] },
  { slug: "change-5", name: "Chang'e 5", cls: "sample-return", agency: "cnsa", launched: 2020, status: "complete", targets: ["moon"], summary: "Returned the first new lunar samples since 1976 — young volcanic basalts from Oceanus Procellarum.", aliases: ["Change 5"] },
  { slug: "change-6", name: "Chang'e 6", cls: "sample-return", agency: "cnsa", launched: 2024, status: "complete", targets: ["moon"], summary: "The first samples ever returned from the Moon's far side (June 2024).", aliases: ["Change 6"] },
  { slug: "slim", name: "SLIM", cls: "lander", agency: "jaxa", launched: 2023, status: "complete", targets: ["moon"], summary: "Japan's 'Moon sniper' — a 100-m-precision landing in January 2024, surviving several lunar nights upside-down." },
  { slug: "artemis-1", name: "Artemis I", cls: "crewed", agency: "nasa", launched: 2022, status: "complete", targets: ["moon"], summary: "The uncrewed shakedown of SLS and Orion around the Moon — the opening flight of the Artemis program.", aliases: ["Artemis 1"] },
  { slug: "artemis-2", name: "Artemis II", cls: "crewed", agency: "nasa", launched: "2026 (planned)", status: "planned", targets: ["moon"], summary: "The first crewed flight around the Moon since 1972 — four astronauts on a free-return trajectory.", aliases: ["Artemis 2"] },
  { slug: "artemis-3", name: "Artemis III", cls: "crewed", agency: "nasa", launched: "2027+ (planned)", status: "planned", targets: ["moon"], summary: "The planned return of astronauts to the lunar surface, landing near the south pole on a Starship HLS.", aliases: ["Artemis 3"] },
  { slug: "gateway", name: "Gateway", cls: "space-station", agency: "nasa", launched: "2027+ (planned)", status: "planned", targets: ["moon"], summary: "A small international station in lunar orbit — the staging post for Artemis expeditions.", noNameAlias: true, aliases: ["Lunar Gateway", "Gateway station"] },

  // ── Stations & crewed LEO ──
  { slug: "iss", name: "International Space Station", cls: "space-station", agency: "nasa", launched: 1998, status: "active", summary: "Humanity's laboratory in orbit — continuously crewed since November 2000, deorbit planned around 2030.", aliases: ["ISS", "the space station"] },
  { slug: "mir", name: "Mir", cls: "space-station", agency: "roscosmos", launched: 1986, status: "complete", summary: "The Soviet/Russian station that pioneered long-duration spaceflight across 15 years.", noNameAlias: true, aliases: ["Mir station", "space station Mir"] },
  { slug: "skylab", name: "Skylab", cls: "space-station", agency: "nasa", launched: 1973, status: "complete", summary: "America's first space station, built from a Saturn V third stage." },
  { slug: "tiangong", name: "Tiangong", cls: "space-station", agency: "cnsa", launched: 2021, status: "active", summary: "China's three-module orbital station, permanently crewed since 2022.", aliases: ["Chinese space station", "CSS"] },
  { slug: "sputnik-1", name: "Sputnik 1", cls: "satellite", agency: "roscosmos", launched: 1957, status: "complete", summary: "The beep heard round the world — the first artificial satellite, October 4, 1957.", aliases: ["Sputnik"] },
  { slug: "vostok-1", name: "Vostok 1", cls: "crewed", agency: "roscosmos", launched: 1961, status: "complete", summary: "Yuri Gagarin's single orbit on April 12, 1961 — the first human in space.", aliases: ["Vostok"] },

  // ── Exoplanets & astrophysics missions (non-telescope) ──
  { slug: "kepler", name: "Kepler", cls: "observatory-mission", agency: "nasa", launched: 2009, status: "complete", summary: "Stared at 150,000 stars and found over 2,600 exoplanets — proof that planets outnumber stars.", noNameAlias: true, aliases: ["Kepler space telescope", "Kepler mission", "Kepler telescope"] },
  { slug: "tess", name: "TESS", cls: "observatory-mission", agency: "nasa", launched: 2018, status: "active", summary: "The all-sky exoplanet hunter, finding new worlds around the nearest, brightest stars.", aliases: ["Transiting Exoplanet Survey Satellite"] },
  { slug: "gaia", name: "Gaia", cls: "observatory-mission", agency: "esa", launched: 2013, status: "complete", summary: "Measured positions and motions of nearly two billion stars — the definitive map of the Milky Way. Observations ended in 2025.", noNameAlias: true, aliases: ["Gaia mission", "Gaia space telescope", "Gaia spacecraft"] },
  { slug: "soho", name: "SOHO", cls: "observatory-mission", agency: "esa", launched: 1995, status: "active", targets: ["sun"], summary: "Thirty years of nonstop solar watching from L1 — and the greatest comet-discoverer in history (5,000+)." },
  { slug: "sdo", name: "Solar Dynamics Observatory", cls: "observatory-mission", agency: "nasa", launched: 2010, status: "active", targets: ["sun"], summary: "Films the Sun in ultra-HD every few seconds — the source of most modern solar imagery.", aliases: ["SDO"] },
];

function toEntry(m: M): CatalogEntry {
  const edges: CatalogEntry["edges"] = [["operated_by", "agency", m.agency]];
  for (const t of m.targets ?? []) edges.push(["targets", "object", t]);
  if (m.successorOf) edges.push(["successor_of", "mission", m.successorOf]);
  return {
    kind: "mission",
    slug: m.slug,
    name: m.name,
    cls: m.cls,
    summary: m.summary,
    attrs: { status: m.status, launched: m.launched },
    facts: { launched: m.launched, status: m.status },
    aliases: m.aliases,
    noNameAlias: m.noNameAlias,
    edges,
  };
}

export const MISSIONS: CatalogEntry[] = M_LIST.map(toEntry);
