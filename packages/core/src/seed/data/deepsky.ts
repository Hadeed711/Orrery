/**
 * Deep-sky catalog: the complete Messier 110 + the bright NGC/IC showpieces.
 * Values (type, constellation, V magnitude, distance) are standard published
 * figures, editorial tier — good to ±the usual literature spread.
 */
import type { CatalogEntry } from "./types";

type DsoType =
  | "spiral-galaxy" | "barred-spiral-galaxy" | "elliptical-galaxy" | "lenticular-galaxy"
  | "irregular-galaxy" | "dwarf-elliptical-galaxy" | "globular-cluster" | "open-cluster"
  | "planetary-nebula" | "emission-nebula" | "reflection-nebula" | "supernova-remnant"
  | "star-cloud" | "double-star" | "asterism";

/** [m, ngc/ic, commonName, type, constellation, magV, distanceKly] */
type MRow = [number, string, string | null, DsoType, string, number, number];

const MESSIER: MRow[] = [
  [1, "NGC 1952", "Crab Nebula", "supernova-remnant", "Taurus", 8.4, 6.5],
  [2, "NGC 7089", null, "globular-cluster", "Aquarius", 6.3, 33],
  [3, "NGC 5272", null, "globular-cluster", "Canes Venatici", 6.2, 34],
  [4, "NGC 6121", null, "globular-cluster", "Scorpius", 5.9, 7.2],
  [5, "NGC 5904", null, "globular-cluster", "Serpens", 6.7, 24.5],
  [6, "NGC 6405", "Butterfly Cluster", "open-cluster", "Scorpius", 4.2, 1.6],
  [7, "NGC 6475", "Ptolemy Cluster", "open-cluster", "Scorpius", 3.3, 0.98],
  [8, "NGC 6523", "Lagoon Nebula", "emission-nebula", "Sagittarius", 6.0, 4.1],
  [9, "NGC 6333", null, "globular-cluster", "Ophiuchus", 8.4, 25.8],
  [10, "NGC 6254", null, "globular-cluster", "Ophiuchus", 6.4, 14.3],
  [11, "NGC 6705", "Wild Duck Cluster", "open-cluster", "Scutum", 6.3, 6.2],
  [12, "NGC 6218", null, "globular-cluster", "Ophiuchus", 7.7, 15.7],
  [13, "NGC 6205", "Hercules Cluster", "globular-cluster", "Hercules", 5.8, 22.2],
  [14, "NGC 6402", null, "globular-cluster", "Ophiuchus", 8.3, 30.3],
  [15, "NGC 7078", null, "globular-cluster", "Pegasus", 6.2, 33],
  [16, "NGC 6611", "Eagle Nebula", "emission-nebula", "Serpens", 6.4, 7.0],
  [17, "NGC 6618", "Omega Nebula", "emission-nebula", "Sagittarius", 6.0, 5.5],
  [18, "NGC 6613", null, "open-cluster", "Sagittarius", 7.5, 4.9],
  [19, "NGC 6273", null, "globular-cluster", "Ophiuchus", 7.5, 28.7],
  [20, "NGC 6514", "Trifid Nebula", "emission-nebula", "Sagittarius", 6.3, 5.2],
  [21, "NGC 6531", null, "open-cluster", "Sagittarius", 6.5, 4.25],
  [22, "NGC 6656", "Sagittarius Cluster", "globular-cluster", "Sagittarius", 5.1, 10.6],
  [23, "NGC 6494", null, "open-cluster", "Sagittarius", 6.9, 2.15],
  [24, "IC 4715", "Small Sagittarius Star Cloud", "star-cloud", "Sagittarius", 4.6, 10],
  [25, "IC 4725", null, "open-cluster", "Sagittarius", 4.6, 2.0],
  [26, "NGC 6694", null, "open-cluster", "Scutum", 8.0, 5.0],
  [27, "NGC 6853", "Dumbbell Nebula", "planetary-nebula", "Vulpecula", 7.4, 1.25],
  [28, "NGC 6626", null, "globular-cluster", "Sagittarius", 7.7, 17.9],
  [29, "NGC 6913", null, "open-cluster", "Cygnus", 7.1, 4.0],
  [30, "NGC 7099", null, "globular-cluster", "Capricornus", 7.7, 27.1],
  [31, "NGC 224", "Andromeda Galaxy", "spiral-galaxy", "Andromeda", 3.4, 2540],
  [32, "NGC 221", null, "dwarf-elliptical-galaxy", "Andromeda", 8.1, 2490],
  [33, "NGC 598", "Triangulum Galaxy", "spiral-galaxy", "Triangulum", 5.7, 2730],
  [34, "NGC 1039", null, "open-cluster", "Perseus", 5.5, 1.4],
  [35, "NGC 2168", null, "open-cluster", "Gemini", 5.3, 2.8],
  [36, "NGC 1960", null, "open-cluster", "Auriga", 6.3, 4.1],
  [37, "NGC 2099", null, "open-cluster", "Auriga", 6.2, 4.5],
  [38, "NGC 1912", null, "open-cluster", "Auriga", 7.4, 4.2],
  [39, "NGC 7092", null, "open-cluster", "Cygnus", 5.5, 0.82],
  [40, "Winnecke 4", null, "double-star", "Ursa Major", 9.7, 0.51],
  [41, "NGC 2287", null, "open-cluster", "Canis Major", 4.5, 2.3],
  [42, "NGC 1976", "Orion Nebula", "emission-nebula", "Orion", 4.0, 1.34],
  [43, "NGC 1982", "De Mairan's Nebula", "emission-nebula", "Orion", 9.0, 1.6],
  [44, "NGC 2632", "Beehive Cluster", "open-cluster", "Cancer", 3.7, 0.58],
  [45, "—", "Pleiades", "open-cluster", "Taurus", 1.6, 0.44],
  [46, "NGC 2437", null, "open-cluster", "Puppis", 6.1, 5.4],
  [47, "NGC 2422", null, "open-cluster", "Puppis", 4.2, 1.6],
  [48, "NGC 2548", null, "open-cluster", "Hydra", 5.5, 1.5],
  [49, "NGC 4472", null, "elliptical-galaxy", "Virgo", 8.4, 56000],
  [50, "NGC 2323", null, "open-cluster", "Monoceros", 5.9, 3.2],
  [51, "NGC 5194", "Whirlpool Galaxy", "spiral-galaxy", "Canes Venatici", 8.4, 23000],
  [52, "NGC 7654", null, "open-cluster", "Cassiopeia", 7.3, 4.6],
  [53, "NGC 5024", null, "globular-cluster", "Coma Berenices", 7.6, 58],
  [54, "NGC 6715", null, "globular-cluster", "Sagittarius", 7.6, 87],
  [55, "NGC 6809", null, "globular-cluster", "Sagittarius", 6.3, 17.6],
  [56, "NGC 6779", null, "globular-cluster", "Lyra", 8.3, 32.9],
  [57, "NGC 6720", "Ring Nebula", "planetary-nebula", "Lyra", 8.8, 2.3],
  [58, "NGC 4579", null, "barred-spiral-galaxy", "Virgo", 9.7, 62000],
  [59, "NGC 4621", null, "elliptical-galaxy", "Virgo", 9.6, 60000],
  [60, "NGC 4649", null, "elliptical-galaxy", "Virgo", 8.8, 55000],
  [61, "NGC 4303", null, "spiral-galaxy", "Virgo", 9.7, 52500],
  [62, "NGC 6266", null, "globular-cluster", "Ophiuchus", 6.5, 22.2],
  [63, "NGC 5055", "Sunflower Galaxy", "spiral-galaxy", "Canes Venatici", 8.6, 29300],
  [64, "NGC 4826", "Black Eye Galaxy", "spiral-galaxy", "Coma Berenices", 8.5, 17300],
  [65, "NGC 3623", null, "spiral-galaxy", "Leo", 9.3, 35000],
  [66, "NGC 3627", null, "spiral-galaxy", "Leo", 8.9, 36000],
  [67, "NGC 2682", null, "open-cluster", "Cancer", 6.1, 2.7],
  [68, "NGC 4590", null, "globular-cluster", "Hydra", 7.8, 33.6],
  [69, "NGC 6637", null, "globular-cluster", "Sagittarius", 7.6, 29.7],
  [70, "NGC 6681", null, "globular-cluster", "Sagittarius", 7.9, 29.4],
  [71, "NGC 6838", null, "globular-cluster", "Sagitta", 8.2, 13],
  [72, "NGC 6981", null, "globular-cluster", "Aquarius", 9.3, 54.6],
  [73, "NGC 6994", null, "asterism", "Aquarius", 9.0, 2.5],
  [74, "NGC 628", "Phantom Galaxy", "spiral-galaxy", "Pisces", 9.4, 32000],
  [75, "NGC 6864", null, "globular-cluster", "Sagittarius", 8.5, 67.5],
  [76, "NGC 650", "Little Dumbbell Nebula", "planetary-nebula", "Perseus", 10.1, 3.4],
  [77, "NGC 1068", "Cetus A", "spiral-galaxy", "Cetus", 8.9, 47000],
  [78, "NGC 2068", null, "reflection-nebula", "Orion", 8.3, 1.6],
  [79, "NGC 1904", null, "globular-cluster", "Lepus", 7.7, 42],
  [80, "NGC 6093", null, "globular-cluster", "Scorpius", 7.3, 32.6],
  [81, "NGC 3031", "Bode's Galaxy", "spiral-galaxy", "Ursa Major", 6.9, 11800],
  [82, "NGC 3034", "Cigar Galaxy", "irregular-galaxy", "Ursa Major", 8.4, 11500],
  [83, "NGC 5236", "Southern Pinwheel Galaxy", "barred-spiral-galaxy", "Hydra", 7.5, 15000],
  [84, "NGC 4374", null, "lenticular-galaxy", "Virgo", 9.1, 60000],
  [85, "NGC 4382", null, "lenticular-galaxy", "Coma Berenices", 9.1, 60000],
  [86, "NGC 4406", null, "lenticular-galaxy", "Virgo", 8.9, 52000],
  [87, "NGC 4486", "Virgo A", "elliptical-galaxy", "Virgo", 8.6, 53500],
  [88, "NGC 4501", null, "spiral-galaxy", "Coma Berenices", 9.6, 47000],
  [89, "NGC 4552", null, "elliptical-galaxy", "Virgo", 9.8, 50000],
  [90, "NGC 4569", null, "spiral-galaxy", "Virgo", 9.5, 58700],
  [91, "NGC 4548", null, "barred-spiral-galaxy", "Coma Berenices", 10.2, 63000],
  [92, "NGC 6341", null, "globular-cluster", "Hercules", 6.3, 26.7],
  [93, "NGC 2447", null, "open-cluster", "Puppis", 6.0, 3.6],
  [94, "NGC 4736", null, "spiral-galaxy", "Canes Venatici", 8.2, 16000],
  [95, "NGC 3351", null, "barred-spiral-galaxy", "Leo", 9.7, 32600],
  [96, "NGC 3368", null, "spiral-galaxy", "Leo", 9.2, 31000],
  [97, "NGC 3587", "Owl Nebula", "planetary-nebula", "Ursa Major", 9.9, 2.0],
  [98, "NGC 4192", null, "spiral-galaxy", "Coma Berenices", 10.1, 44400],
  [99, "NGC 4254", null, "spiral-galaxy", "Coma Berenices", 9.9, 50200],
  [100, "NGC 4321", null, "spiral-galaxy", "Coma Berenices", 9.3, 55000],
  [101, "NGC 5457", "Pinwheel Galaxy", "spiral-galaxy", "Ursa Major", 7.9, 20900],
  [102, "NGC 5866", "Spindle Galaxy", "lenticular-galaxy", "Draco", 9.9, 50000],
  [103, "NGC 581", null, "open-cluster", "Cassiopeia", 7.4, 10],
  [104, "NGC 4594", "Sombrero Galaxy", "spiral-galaxy", "Virgo", 8.0, 31100],
  [105, "NGC 3379", null, "elliptical-galaxy", "Leo", 9.3, 32000],
  [106, "NGC 4258", null, "spiral-galaxy", "Canes Venatici", 8.4, 23700],
  [107, "NGC 6171", null, "globular-cluster", "Ophiuchus", 7.9, 20.9],
  [108, "NGC 3556", null, "barred-spiral-galaxy", "Ursa Major", 10.0, 46000],
  [109, "NGC 3992", null, "barred-spiral-galaxy", "Ursa Major", 9.8, 83500],
  [110, "NGC 205", null, "dwarf-elliptical-galaxy", "Andromeda", 8.5, 2690],
];

const TYPE_LABEL: Record<DsoType, string> = {
  "spiral-galaxy": "spiral galaxy",
  "barred-spiral-galaxy": "barred spiral galaxy",
  "elliptical-galaxy": "elliptical galaxy",
  "lenticular-galaxy": "lenticular galaxy",
  "irregular-galaxy": "irregular galaxy",
  "dwarf-elliptical-galaxy": "dwarf elliptical galaxy",
  "globular-cluster": "globular cluster",
  "open-cluster": "open cluster",
  "planetary-nebula": "planetary nebula",
  "emission-nebula": "emission nebula",
  "reflection-nebula": "reflection nebula",
  "supernova-remnant": "supernova remnant",
  "star-cloud": "Milky Way star cloud",
  "double-star": "double star",
  "asterism": "asterism",
};

function fmtDistance(kly: number): string {
  return kly >= 1000
    ? `${(kly / 1000).toLocaleString("en-US", { maximumFractionDigits: 1 })} million light-years`
    : `${kly.toLocaleString("en-US", { maximumFractionDigits: 2 })} thousand light-years`;
}

function messierEntry(row: MRow): CatalogEntry {
  const [m, ngc, common, type, con, mag, distKly] = row;
  const label = TYPE_LABEL[type];
  const article = /^[aeiou]/i.test(label) ? "An" : "A";
  const summary = `${article} ${label} in ${con}, magnitude ${mag}, about ${fmtDistance(distKly)} away — number ${m} in Charles Messier's catalog.`;
  const aliases = [`Messier ${m}`, `M${m}`];
  if (ngc !== "—" && !ngc.startsWith("Winnecke")) aliases.push(ngc);
  const externalIds: Record<string, string> = { messier: String(m) };
  const ngcNum = /^NGC (\d+)$/.exec(ngc);
  if (ngcNum) externalIds.ngc = ngcNum[1]!;
  return {
    kind: "object",
    slug: `m${m}`,
    name: common ?? `Messier ${m}`,
    cls: type,
    summary,
    attrs: { constellation: con, magnitude: mag, distanceKly: distKly, messier: m },
    facts: { magnitude: mag, constellation: con, distance: fmtDistance(distKly) },
    aliases,
    // "Messier N"/"MN" carry the tagging weight for unnamed entries.
    noNameAlias: common === null,
    externalIds,
  };
}

/** [slug, catalogId, name, type, constellation, magV, distanceKly, extra aliases] */
type NRow = [string, string, string, DsoType, string, number, number, string[]?];

const NGC_BRIGHT: NRow[] = [
  ["ngc-104", "NGC 104", "47 Tucanae", "globular-cluster", "Tucana", 4.1, 14.7, ["47 Tuc"]],
  ["ngc-5139", "NGC 5139", "Omega Centauri", "globular-cluster", "Centaurus", 3.9, 15.8],
  ["ngc-869", "NGC 869", "Double Cluster", "open-cluster", "Perseus", 4.3, 7.5, ["NGC 884", "h and Chi Persei"]],
  ["ngc-253", "NGC 253", "Sculptor Galaxy", "spiral-galaxy", "Sculptor", 7.1, 11400, ["Silver Coin Galaxy"]],
  ["ngc-5128", "NGC 5128", "Centaurus A", "lenticular-galaxy", "Centaurus", 6.8, 12000],
  ["ngc-2070", "NGC 2070", "Tarantula Nebula", "emission-nebula", "Dorado", 8.0, 160000, ["30 Doradus"]],
  ["ngc-3372", "NGC 3372", "Carina Nebula", "emission-nebula", "Carina", 1.0, 8.5, ["Eta Carinae Nebula"]],
  ["ngc-7000", "NGC 7000", "North America Nebula", "emission-nebula", "Cygnus", 4.0, 2.6],
  ["ngc-2244", "NGC 2244", "Rosette Nebula", "emission-nebula", "Monoceros", 4.8, 5.2],
  ["ngc-6960", "NGC 6960", "Veil Nebula", "supernova-remnant", "Cygnus", 7.0, 2.4, ["Western Veil", "Cygnus Loop"]],
  ["ngc-7293", "NGC 7293", "Helix Nebula", "planetary-nebula", "Aquarius", 7.6, 0.65],
  ["ngc-6543", "NGC 6543", "Cat's Eye Nebula", "planetary-nebula", "Draco", 8.1, 3.3],
  ["ngc-7662", "NGC 7662", "Blue Snowball Nebula", "planetary-nebula", "Andromeda", 8.6, 5.6],
  ["ngc-4565", "NGC 4565", "Needle Galaxy", "spiral-galaxy", "Coma Berenices", 10.4, 40000],
  ["ngc-891", "NGC 891", "Silver Sliver Galaxy", "spiral-galaxy", "Andromeda", 10.8, 27300],
  ["ngc-457", "NGC 457", "Owl Cluster", "open-cluster", "Cassiopeia", 6.4, 7.9, ["ET Cluster"]],
];

function ngcEntry(row: NRow): CatalogEntry {
  const [slug, catId, name, type, con, mag, distKly, extra] = row;
  const label = TYPE_LABEL[type];
  const article = /^[aeiou]/i.test(label) ? "An" : "A";
  const ngcNum = /^NGC (\d+)$/.exec(catId);
  return {
    kind: "object",
    slug,
    name,
    cls: type,
    summary: `${article} ${label} in ${con}, magnitude ${mag}, about ${fmtDistance(distKly)} away — one of the finest sights beyond the Messier list (${catId}).`,
    attrs: { constellation: con, magnitude: mag, distanceKly: distKly },
    facts: { magnitude: mag, constellation: con, distance: fmtDistance(distKly) },
    aliases: [catId, ...(extra ?? [])],
    externalIds: ngcNum ? { ngc: ngcNum[1]! } : undefined,
  };
}

export const DEEP_SKY: CatalogEntry[] = [
  ...MESSIER.map(messierEntry),
  ...NGC_BRIGHT.map(ngcEntry),
];
