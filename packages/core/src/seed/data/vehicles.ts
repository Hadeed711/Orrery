/**
 * Launch vehicles — historic icons + today's fleet. Slugs match what the LL2
 * connector mints via slugify(config.name) so upcoming-launch edges land on
 * these enriched pages instead of duplicates.
 */
import type { CatalogEntry } from "./types";

interface V {
  slug: string;
  name: string;
  operator: string;
  status: "active" | "retired" | "in-development";
  first: number | string;
  summary: string;
  aliases?: string[];
  noNameAlias?: boolean;
}

const V_LIST: V[] = [
  { slug: "saturn-v", name: "Saturn V", operator: "nasa", status: "retired", first: 1967, summary: "The Moon rocket — still the most powerful vehicle ever flown successfully in its era, 13 for 13." },
  { slug: "space-shuttle", name: "Space Shuttle", operator: "nasa", status: "retired", first: 1981, summary: "The winged workhorse: 135 flights over 30 years, building the ISS and servicing Hubble.", aliases: ["STS"] },
  { slug: "sls", name: "Space Launch System", operator: "nasa", status: "active", first: 2022, summary: "NASA's Artemis Moon rocket — the most powerful operational launcher at liftoff.", aliases: ["SLS"] },
  { slug: "falcon-9", name: "Falcon 9", operator: "spacex", status: "active", first: 2010, summary: "The rocket that made boosters reusable — the most-flown orbital launcher in history." },
  { slug: "falcon-heavy", name: "Falcon Heavy", operator: "spacex", status: "active", first: 2018, summary: "Three Falcon cores strapped together — famous for launching a Tesla toward Mars." },
  { slug: "starship", name: "Starship", operator: "spacex", status: "in-development", first: 2023, summary: "SpaceX's fully reusable super-heavy rocket — the largest flying machine ever built, and NASA's Artemis lander.", aliases: ["Super Heavy"] },
  { slug: "soyuz", name: "Soyuz", operator: "roscosmos", status: "active", first: 1966, summary: "The longest-serving rocket family in history — flying crews and cargo since the 1960s.", noNameAlias: true, aliases: ["Soyuz rocket", "Soyuz-2"] },
  { slug: "proton", name: "Proton", operator: "roscosmos", status: "active", first: 1965, summary: "Russia's veteran heavy-lifter, launcher of Mir and ISS modules.", noNameAlias: true, aliases: ["Proton rocket", "Proton-M"] },
  { slug: "atlas-v", name: "Atlas V", operator: "ula", status: "active", first: 2002, summary: "ULA's ultra-reliable workhorse, flying out its final missions.", aliases: ["Atlas 5"] },
  { slug: "vulcan", name: "Vulcan Centaur", operator: "ula", status: "active", first: 2024, summary: "ULA's next-generation launcher, replacing both Atlas V and Delta IV.", noNameAlias: true, aliases: ["Vulcan rocket", "Vulcan Centaur"] },
  { slug: "delta-iv-heavy", name: "Delta IV Heavy", operator: "ula", status: "retired", first: 2004, summary: "The triple-core heavy-lifter for America's biggest national-security payloads, retired 2024." },
  { slug: "ariane-5", name: "Ariane 5", operator: "arianespace", status: "retired", first: 1996, summary: "Europe's heavy-lifter for 27 years — and the rocket trusted to launch JWST.", aliases: ["Ariane 5 ECA"] },
  { slug: "ariane-6", name: "Ariane 6", operator: "arianespace", status: "active", first: 2024, summary: "Europe's new mainstay launcher, restoring independent European access to space.", aliases: ["Ariane 62", "Ariane 64"] },
  { slug: "electron", name: "Electron", operator: "rocket-lab", status: "active", first: 2017, summary: "Rocket Lab's carbon-fiber small-sat launcher — the most-flown small rocket.", noNameAlias: true, aliases: ["Electron rocket"] },
  { slug: "neutron", name: "Neutron", operator: "rocket-lab", status: "in-development", first: "2026 (planned)", summary: "Rocket Lab's reusable medium-lift rocket, built to compete with Falcon 9.", noNameAlias: true, aliases: ["Neutron rocket"] },
  { slug: "new-glenn", name: "New Glenn", operator: "blue-origin", status: "active", first: 2025, summary: "Blue Origin's reusable heavy-lifter, with a seven-meter fairing and a landable first stage." },
  { slug: "new-shepard", name: "New Shepard", operator: "blue-origin", status: "active", first: 2015, summary: "Blue Origin's suborbital hopper carrying research payloads and space tourists past the Kármán line." },
  { slug: "long-march-5", name: "Long March 5", operator: "casc", status: "active", first: 2016, summary: "China's heavy-lifter — launcher of Tianwen-1, Chang'e 5, and the Tiangong modules.", aliases: ["CZ-5", "Changzheng 5"] },
  { slug: "h3", name: "H3", operator: "jaxa", status: "active", first: 2023, summary: "Japan's new flagship launcher, successor to the long-serving H-IIA.", noNameAlias: true, aliases: ["H3 rocket", "H-3 rocket"] },
  { slug: "pslv", name: "PSLV", operator: "isro", status: "active", first: 1993, summary: "India's dependable workhorse — including a record 104 satellites on one flight.", aliases: ["Polar Satellite Launch Vehicle"] },
  { slug: "lvm3", name: "LVM3", operator: "isro", status: "active", first: 2014, summary: "India's heaviest rocket — launcher of Chandrayaan-3 and the future crewed Gaganyaan.", aliases: ["GSLV Mk III", "GSLV Mk-III"] },
];

export const VEHICLES: CatalogEntry[] = V_LIST.map((v) => ({
  kind: "vehicle",
  slug: v.slug,
  name: v.name,
  cls: "launch-vehicle",
  summary: v.summary,
  attrs: { status: v.status, firstFlight: v.first },
  facts: { "first flight": v.first, status: v.status },
  aliases: v.aliases,
  noNameAlias: v.noNameAlias,
  edges: [["operated_by", "agency", v.operator]],
}));
