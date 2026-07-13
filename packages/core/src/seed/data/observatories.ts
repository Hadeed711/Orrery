/**
 * Telescopes (space, kind=telescope) and ground observatories (kind=observatory).
 * The Great Observatories, current flagships, and the ground giants people
 * actually read news about.
 */
import type { CatalogEntry } from "./types";

interface T {
  slug: string;
  name: string;
  cls: string; // space-telescope | radio-observatory | optical-observatory | gravitational-wave | neutrino | survey
  agency?: string; // omitted for multi-institution collaborations we don't model yet
  since: number | string;
  status: "active" | "complete" | "planned" | "lost";
  summary: string;
  aliases?: string[];
  noNameAlias?: boolean;
  ground?: boolean;
}

const T_LIST: T[] = [
  // ── Space telescopes ──
  { slug: "jwst", name: "James Webb Space Telescope", cls: "space-telescope", agency: "nasa", since: 2021, status: "active", summary: "The 6.5-meter infrared flagship at L2 — rewriting the story of the first galaxies, exoplanet atmospheres, and star birth.", aliases: ["JWST", "Webb telescope", "Webb"] },
  { slug: "hubble", name: "Hubble Space Telescope", cls: "space-telescope", agency: "nasa", since: 1990, status: "active", summary: "Thirty-five years of discovery — still the sharpest optical eye in orbit and astronomy's most famous instrument.", aliases: ["Hubble", "HST"] },
  { slug: "chandra", name: "Chandra X-ray Observatory", cls: "space-telescope", agency: "nasa", since: 1999, status: "active", summary: "NASA's X-ray Great Observatory, imaging black-hole jets, supernova remnants, and galaxy clusters since 1999.", aliases: ["Chandra"] },
  { slug: "spitzer", name: "Spitzer Space Telescope", cls: "space-telescope", agency: "nasa", since: 2003, status: "complete", summary: "The infrared Great Observatory (2003–2020) that mapped the TRAPPIST-1 planets and dusty stellar nurseries.", aliases: ["Spitzer"] },
  { slug: "xmm-newton", name: "XMM-Newton", cls: "space-telescope", agency: "esa", since: 1999, status: "active", summary: "ESA's long-serving X-ray observatory — the most photon-hungry X-ray telescope ever flown.", aliases: ["XMM"] },
  { slug: "fermi", name: "Fermi Gamma-ray Space Telescope", cls: "space-telescope", agency: "nasa", since: 2008, status: "active", summary: "Surveys the whole gamma-ray sky every three hours, from pulsars to blazar flares.", aliases: ["Fermi", "GLAST"] },
  { slug: "swift", name: "Neil Gehrels Swift Observatory", cls: "space-telescope", agency: "nasa", since: 2004, status: "active", summary: "The gamma-ray-burst first responder, slewing to new explosions within seconds.", noNameAlias: true, aliases: ["Swift telescope", "Swift observatory", "Swift satellite"] },
  { slug: "nustar", name: "NuSTAR", cls: "space-telescope", agency: "nasa", since: 2012, status: "active", summary: "The first focusing high-energy X-ray telescope in orbit — a black-hole census machine." },
  { slug: "ixpe", name: "IXPE", cls: "space-telescope", agency: "nasa", since: 2021, status: "active", summary: "Measures X-ray polarization, adding a new dimension to black-hole and neutron-star astronomy." },
  { slug: "euclid", name: "Euclid", cls: "space-telescope", agency: "esa", since: 2023, status: "active", summary: "Mapping the dark universe — billions of galaxies across a third of the sky to weigh dark matter and dark energy.", noNameAlias: true, aliases: ["Euclid telescope", "Euclid space telescope", "Euclid mission"] },
  { slug: "roman", name: "Nancy Grace Roman Space Telescope", cls: "space-telescope", agency: "nasa", since: "2027 (planned)", status: "planned", summary: "A Hubble-class mirror with a view 100× wider — NASA's next flagship survey telescope.", noNameAlias: true, aliases: ["Roman Space Telescope", "Roman telescope", "WFIRST"] },
  { slug: "planck", name: "Planck", cls: "space-telescope", agency: "esa", since: 2009, status: "complete", summary: "Produced the definitive map of the cosmic microwave background — our baby picture of the universe.", noNameAlias: true, aliases: ["Planck telescope", "Planck satellite", "Planck mission"] },
  { slug: "wmap", name: "WMAP", cls: "space-telescope", agency: "nasa", since: 2001, status: "complete", summary: "Pinned down the universe's age (13.8 billion years) and composition from the microwave background." },
  { slug: "cobe", name: "COBE", cls: "space-telescope", agency: "nasa", since: 1989, status: "complete", summary: "First saw the seeds of cosmic structure in the microwave background — two Nobel Prizes followed." },
  { slug: "neowise", name: "NEOWISE", cls: "space-telescope", agency: "nasa", since: 2009, status: "complete", summary: "The infrared all-sky surveyor turned asteroid hunter (as WISE/NEOWISE, 2009–2024).", aliases: ["WISE"] },
  { slug: "cheops", name: "CHEOPS", cls: "space-telescope", agency: "esa", since: 2019, status: "active", summary: "ESA's exoplanet-characterization telescope, sizing up known worlds with exquisite precision." },
  { slug: "plato", name: "PLATO", cls: "space-telescope", agency: "esa", since: "2026 (planned)", status: "planned", summary: "ESA's next exoplanet flagship — 26 cameras hunting Earth-like planets around Sun-like stars.", noNameAlias: true, aliases: ["PLATO mission", "PLATO telescope"] },

  // ── Ground observatories ──
  { slug: "vlt", name: "Very Large Telescope", cls: "optical-observatory", agency: "eso", since: 1998, status: "active", summary: "ESO's four 8.2-m telescopes on Cerro Paranal, Chile — the workhorse of European astronomy.", aliases: ["VLT", "Paranal"], ground: true },
  { slug: "elt", name: "Extremely Large Telescope", cls: "optical-observatory", agency: "eso", since: "2029 (planned)", status: "planned", summary: "A 39-meter eye under construction in Chile — it will dwarf every optical telescope ever built.", aliases: ["ELT"], ground: true },
  { slug: "keck", name: "W. M. Keck Observatory", cls: "optical-observatory", since: 1993, status: "active", summary: "Twin 10-m telescopes on Maunakea that pioneered segmented mirrors and adaptive optics.", aliases: ["Keck"], ground: true },
  { slug: "subaru", name: "Subaru Telescope", cls: "optical-observatory", agency: "naoj", since: 1999, status: "active", summary: "Japan's 8.2-m telescope on Maunakea, famous for its huge wide-field camera.", noNameAlias: true, aliases: ["Subaru telescope"], ground: true },
  { slug: "gemini", name: "Gemini Observatory", cls: "optical-observatory", agency: "nsf", since: 2000, status: "active", summary: "Twin 8.1-m telescopes covering both hemispheres from Hawaiʻi and Chile.", noNameAlias: true, aliases: ["Gemini North", "Gemini South", "Gemini telescope"], ground: true },
  { slug: "gtc", name: "Gran Telescopio Canarias", cls: "optical-observatory", since: 2009, status: "active", summary: "The world's largest single-aperture optical telescope (10.4 m), on La Palma.", aliases: ["GTC", "GranTeCan"], ground: true },
  { slug: "rubin", name: "Vera C. Rubin Observatory", cls: "survey", agency: "nsf", since: 2025, status: "active", summary: "Films the whole southern sky every few nights with a 3.2-gigapixel camera — the survey that will discover millions of moving objects.", aliases: ["Rubin Observatory", "LSST"], ground: true },
  { slug: "gmt", name: "Giant Magellan Telescope", cls: "optical-observatory", agency: "nsf", since: "2030s (planned)", status: "planned", summary: "Seven 8.4-m mirrors acting as one 25.4-m telescope, rising at Las Campanas, Chile.", aliases: ["GMT"], ground: true },
  { slug: "alma", name: "ALMA", cls: "radio-observatory", agency: "eso", since: 2013, status: "active", summary: "Sixty-six antennas at 5,000 m in the Atacama — the sharpest view of planet-forming disks and the early universe.", aliases: ["Atacama Large Millimeter Array"], ground: true },
  { slug: "vla", name: "Very Large Array", cls: "radio-observatory", agency: "nsf", since: 1980, status: "active", summary: "The iconic Y of 27 radio dishes in New Mexico — from pulsars to Contact.", aliases: ["VLA", "Karl G. Jansky Very Large Array"], ground: true },
  { slug: "fast", name: "FAST", cls: "radio-observatory", since: 2016, status: "active", summary: "China's 500-m dish — the largest filled-aperture radio telescope on Earth, a fast-radio-burst machine.", aliases: ["Five-hundred-meter Aperture Spherical Telescope"], ground: true },
  { slug: "green-bank", name: "Green Bank Telescope", cls: "radio-observatory", agency: "nsf", since: 2000, status: "active", summary: "The largest fully steerable radio telescope, in the heart of the US National Radio Quiet Zone.", aliases: ["GBT"], ground: true },
  { slug: "arecibo", name: "Arecibo Observatory", cls: "radio-observatory", agency: "nsf", since: 1963, status: "complete", summary: "The legendary 305-m dish in Puerto Rico — planetary radar and SETI icon until its 2020 collapse.", aliases: ["Arecibo"], ground: true },
  { slug: "eht", name: "Event Horizon Telescope", cls: "radio-observatory", since: 2017, status: "active", summary: "An Earth-sized virtual telescope that took the first pictures of black holes (M87*, Sgr A*).", aliases: ["EHT"], ground: true },
  { slug: "ligo", name: "LIGO", cls: "gravitational-wave", agency: "nsf", since: 2015, status: "active", summary: "The detectors that first heard spacetime ripple — gravitational waves from merging black holes.", aliases: ["Laser Interferometer Gravitational-Wave Observatory"], ground: true },
  { slug: "icecube", name: "IceCube", cls: "neutrino", agency: "nsf", since: 2010, status: "active", summary: "A cubic kilometer of Antarctic ice wired as a telescope, catching neutrinos from cosmic accelerators.", noNameAlias: true, aliases: ["IceCube Neutrino Observatory", "IceCube observatory"], ground: true },
  { slug: "palomar", name: "Palomar Observatory", cls: "optical-observatory", agency: "nsf", since: 1948, status: "active", summary: "Home of the historic 200-inch Hale Telescope and today's Zwicky Transient Facility.", aliases: ["Palomar", "Hale Telescope", "Zwicky Transient Facility", "ZTF"], ground: true },
  { slug: "ska", name: "Square Kilometre Array", cls: "radio-observatory", since: "2028 (planned)", status: "planned", summary: "The next-generation radio array rising across Australia and South Africa — thousands of dishes and a million antennas.", aliases: ["SKA", "SKA Observatory", "SKAO"], ground: true },
];

function toEntry(t: T): CatalogEntry {
  return {
    kind: t.ground ? "observatory" : "telescope",
    slug: t.slug,
    name: t.name,
    cls: t.cls,
    summary: t.summary,
    attrs: { status: t.status, since: t.since },
    facts: { "first light": t.since, status: t.status },
    aliases: t.aliases,
    noNameAlias: t.noNameAlias,
    edges: t.agency ? [["operated_by", "agency", t.agency]] : undefined,
  };
}

export const OBSERVATORIES: CatalogEntry[] = T_LIST.map(toEntry);
