/**
 * Solar-system catalog beyond the Phase-3 planets: major moons, dwarf planets,
 * notable small bodies. Radii/distances are standard published values (editorial tier).
 */
import type { CatalogEntry } from "./types";

const moon = (
  slug: string,
  name: string,
  parent: string,
  radiusKm: number,
  summary: string,
  extra?: Partial<CatalogEntry>,
): CatalogEntry => ({
  kind: "object",
  slug,
  name,
  cls: "moon",
  summary,
  facts: { radius_km: radiusKm },
  edges: [["moon_of", "object", parent]],
  ...extra,
});

export const SOLAR_SYSTEM: CatalogEntry[] = [
  // ── Mars ──
  moon("phobos", "Phobos", "mars", 11.3, "The larger of Mars's two tiny moons, orbiting so low it crosses the sky twice a Martian day — and is slowly spiralling in."),
  moon("deimos", "Deimos", "mars", 6.2, "Mars's smaller, outer moon — a lumpy, dusty body just 12 km across."),

  // ── Jupiter (Galilean) ──
  moon("io", "Io", "jupiter", 1_821.6, "The most volcanically active world in the Solar System, squeezed by Jupiter's tides into constant eruption.", { noNameAlias: true, aliases: ["Io moon", "Jupiter's moon Io"] }),
  moon("europa", "Europa", "jupiter", 1_560.8, "An ice-crusted ocean world — one of the most promising places to look for life beyond Earth.", { noNameAlias: true, aliases: ["Europa moon", "Jupiter's moon Europa"] }),
  moon("ganymede", "Ganymede", "jupiter", 2_634.1, "The largest moon in the Solar System — bigger than Mercury, with its own magnetic field."),
  moon("callisto", "Callisto", "jupiter", 2_410.3, "Jupiter's outermost Galilean moon, its ancient surface the most heavily cratered known."),

  // ── Saturn (Titan seeded in Phase 3) ──
  moon("mimas", "Mimas", "saturn", 198.2, "Saturn's 'Death Star' moon, dominated by the giant crater Herschel — and hiding a young subsurface ocean."),
  moon("enceladus", "Enceladus", "saturn", 252.1, "A small icy moon venting salty ocean spray from its south pole — a top astrobiology target."),
  moon("tethys", "Tethys", "saturn", 531.1, "A mid-sized icy moon of Saturn scarred by the vast Odysseus crater and Ithaca Chasma canyon."),
  moon("dione", "Dione", "saturn", 561.4, "Saturn's fourth-largest moon, laced with bright 'wispy terrain' ice cliffs."),
  moon("rhea", "Rhea", "saturn", 763.8, "Saturn's second-largest moon, a heavily cratered ball of ice and rock."),
  moon("iapetus", "Iapetus", "saturn", 734.5, "Saturn's two-toned moon — one hemisphere coal-dark, the other bright ice — with a mysterious equatorial ridge."),

  // ── Uranus ──
  moon("miranda", "Miranda", "uranus", 235.8, "Uranus's patchwork moon, with cliffs 20 km tall — evidence of a violent geological past."),
  moon("ariel", "Ariel", "uranus", 578.9, "The brightest of Uranus's moons, its surface crossed by young rift valleys."),
  moon("umbriel", "Umbriel", "uranus", 584.7, "The darkest of Uranus's large moons, ringed by the strange bright crater floor Wunda."),
  moon("titania", "Titania", "uranus", 788.4, "The largest moon of Uranus, a cratered ice world nearly 1,600 km across."),
  moon("oberon", "Oberon", "uranus", 761.4, "Uranus's outermost major moon, ancient and heavily cratered."),

  // ── Neptune / Pluto ──
  moon("triton", "Triton", "neptune", 1_353.4, "Neptune's captured Kuiper-belt moon, orbiting backwards and venting nitrogen geysers at −235 °C."),
  moon("charon", "Charon", "pluto", 606, "Pluto's companion — half its size, making the pair a true binary world."),

  // ── Dwarf planets & small bodies ──
  {
    kind: "object", slug: "pluto", name: "Pluto", cls: "dwarf-planet",
    summary: "The best-loved dwarf planet — a geologically alive ice world with nitrogen glaciers, revealed by New Horizons in 2015.",
    facts: { radius_km: 1_188.3, year_length_years: 248 },
    edges: [["orbits", "object", "sun"]],
    externalIds: { horizons: "999" },
  },
  {
    kind: "object", slug: "ceres", name: "Ceres", cls: "dwarf-planet",
    summary: "The largest body in the asteroid belt and the only dwarf planet in the inner Solar System, with bright salt deposits in Occator crater.",
    facts: { radius_km: 469.7 },
    edges: [["orbits", "object", "sun"]],
    noNameAlias: true, aliases: ["dwarf planet Ceres"],
  },
  {
    kind: "object", slug: "eris", name: "Eris", cls: "dwarf-planet",
    summary: "The most massive known dwarf planet — its 2005 discovery forced the definition that reclassified Pluto.",
    facts: { radius_km: 1_163 },
    edges: [["orbits", "object", "sun"]],
    noNameAlias: true, aliases: ["dwarf planet Eris"],
  },
  {
    kind: "object", slug: "haumea", name: "Haumea", cls: "dwarf-planet",
    summary: "A rugby-ball-shaped dwarf planet spinning every four hours, with its own ring and two moons.",
    facts: { radius_km: 780 },
    edges: [["orbits", "object", "sun"]],
  },
  {
    kind: "object", slug: "makemake", name: "Makemake", cls: "dwarf-planet",
    summary: "A bright, reddish Kuiper-belt dwarf planet about two-thirds the size of Pluto.",
    facts: { radius_km: 715 },
    edges: [["orbits", "object", "sun"]],
  },
  {
    kind: "object", slug: "vesta", name: "Vesta", cls: "asteroid",
    summary: "The brightest asteroid in Earth's sky and the second most massive, mapped up close by the Dawn spacecraft.",
    facts: { radius_km: 262.7 },
    edges: [["orbits", "object", "sun"]],
    noNameAlias: true, aliases: ["asteroid Vesta", "4 Vesta"],
  },
  {
    kind: "object", slug: "bennu", name: "Bennu", cls: "asteroid",
    summary: "A carbon-rich near-Earth asteroid sampled by OSIRIS-REx — pristine material from the Solar System's birth.",
    facts: { radius_km: 0.245 },
    edges: [["orbits", "object", "sun"]],
    aliases: ["asteroid Bennu", "101955 Bennu"],
  },
  {
    kind: "object", slug: "halley", name: "Halley's Comet", cls: "comet",
    summary: "The most famous comet of all, returning every 76 years — next perihelion 2061. It began its inbound journey in December 2023.",
    aliases: ["Halley", "Comet Halley", "1P/Halley"],
    edges: [["orbits", "object", "sun"]],
  },
];
