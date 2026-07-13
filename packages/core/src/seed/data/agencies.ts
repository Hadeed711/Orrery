/**
 * Agencies & operators. All seeded as kind=agency (matching what the LL2
 * connector mints for launch providers, so slugs like `spacex` merge rather
 * than duplicate).
 */
import type { CatalogEntry } from "./types";

interface A {
  slug: string;
  name: string;
  cls: "space-agency" | "company" | "intergovernmental" | "research";
  country: string;
  founded: number;
  summary: string;
  aliases?: string[];
}

const A_LIST: A[] = [
  { slug: "nasa", name: "NASA", cls: "space-agency", country: "USA", founded: 1958, summary: "The United States' space agency — from Apollo to Artemis, and operator of the largest science fleet in orbit.", aliases: ["National Aeronautics and Space Administration"] },
  { slug: "esa", name: "ESA", cls: "intergovernmental", country: "Europe (22 member states)", founded: 1975, summary: "The European Space Agency — Ariane, comet landings, Gaia's galaxy map, and JWST's ride to space.", aliases: ["European Space Agency"] },
  { slug: "jaxa", name: "JAXA", cls: "space-agency", country: "Japan", founded: 2003, summary: "Japan's space agency — asteroid sample-return pioneers (Hayabusa) and precision Moon landers.", aliases: ["Japan Aerospace Exploration Agency"] },
  { slug: "isro", name: "ISRO", cls: "space-agency", country: "India", founded: 1969, summary: "India's space agency — Moon's south pole (Chandrayaan-3), Mars on the first try, and famously frugal engineering.", aliases: ["Indian Space Research Organisation"] },
  { slug: "roscosmos", name: "Roscosmos", cls: "space-agency", country: "Russia", founded: 1992, summary: "Russia's space agency, heir to the program that launched Sputnik and Gagarin.", aliases: ["Russian space agency"] },
  { slug: "cnsa", name: "CNSA", cls: "space-agency", country: "China", founded: 1993, summary: "China's space agency — far-side Moon landings, Mars rover Zhurong, and the Tiangong station.", aliases: ["China National Space Administration"] },
  { slug: "casc", name: "CASC", cls: "company", country: "China", founded: 1999, summary: "China's state launch prime — builder of the Long March rocket family.", aliases: ["China Aerospace Science and Technology Corporation"] },
  { slug: "mbrsc", name: "MBRSC", cls: "space-agency", country: "UAE", founded: 2006, summary: "Dubai's Mohammed bin Rashid Space Centre — home of the Hope Mars orbiter and the UAE astronaut corps.", aliases: ["Mohammed bin Rashid Space Centre", "UAE Space Agency"] },
  { slug: "spacex", name: "SpaceX", cls: "company", country: "USA", founded: 2002, summary: "The company that made rockets land — Falcon, Dragon, Starlink, and Starship." },
  { slug: "blue-origin", name: "Blue Origin", cls: "company", country: "USA", founded: 2000, summary: "Jeff Bezos's rocket company — New Shepard, New Glenn, and the Blue Moon lunar lander." },
  { slug: "rocket-lab", name: "Rocket Lab", cls: "company", country: "USA / New Zealand", founded: 2006, summary: "The small-launch leader with Electron, going bigger with Neutron and its own Venus probe." },
  { slug: "ula", name: "United Launch Alliance", cls: "company", country: "USA", founded: 2006, summary: "The Boeing–Lockheed joint venture behind Atlas, Delta, and Vulcan.", aliases: ["ULA"] },
  { slug: "arianespace", name: "Arianespace", cls: "company", country: "France / Europe", founded: 1980, summary: "The world's first commercial launch operator, flying Ariane and Vega from French Guiana." },
  { slug: "eso", name: "European Southern Observatory", cls: "research", country: "Europe / Chile", founded: 1962, summary: "Operator of the VLT, ALMA (with partners), and the coming Extremely Large Telescope.", aliases: ["ESO"] },
  { slug: "nsf", name: "National Science Foundation", cls: "research", country: "USA", founded: 1950, summary: "Funds and operates much of US ground-based astronomy — Rubin, Gemini, VLA, LIGO.", aliases: ["NSF"] },
  { slug: "naoj", name: "NAOJ", cls: "research", country: "Japan", founded: 1988, summary: "The National Astronomical Observatory of Japan — operator of the Subaru Telescope.", aliases: ["National Astronomical Observatory of Japan"] },
];

export const AGENCIES: CatalogEntry[] = A_LIST.map((a) => ({
  kind: "agency",
  slug: a.slug,
  name: a.name,
  cls: a.cls,
  summary: a.summary,
  attrs: { country: a.country, founded: a.founded },
  facts: { country: a.country, founded: a.founded },
  aliases: a.aliases,
}));
