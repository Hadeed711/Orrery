/**
 * World directory of space agencies & companies (Phase 7) — editorial data,
 * majors down to notable medium/small players, grouped by country/region.
 * Static & tree-shaken: no DB round-trip, renders instantly and is SEO-crawlable.
 */

export type SpaceOrg = {
  name: string;
  country: string; // display country/region
  flag: string; // emoji flag
  type: "agency" | "launch" | "manufacturer" | "satellites" | "station" | "services" | "human-spaceflight";
  founded: number;
  hq: string;
  about: string;
  website: string;
  /** slug of the matching graph entity when we have one (links to /agency/<slug>) */
  entitySlug?: string;
};

export const ORG_TYPES: Record<SpaceOrg["type"], string> = {
  agency: "Government agency",
  launch: "Launch provider",
  manufacturer: "Spacecraft & hardware",
  satellites: "Satellites & Earth observation",
  station: "Space stations & habitats",
  services: "In-space services",
  "human-spaceflight": "Human spaceflight & tourism",
};

export const SPACE_ORGS: SpaceOrg[] = [
  // ── United States ──
  { name: "NASA", country: "United States", flag: "🇺🇸", type: "agency", founded: 1958, hq: "Washington, D.C.", about: "The US civil space agency — Apollo, the Shuttle, Hubble, JWST, Mars rovers, and today's Artemis return to the Moon. The largest space science budget on Earth.", website: "https://www.nasa.gov", entitySlug: "nasa" },
  { name: "SpaceX", country: "United States", flag: "🇺🇸", type: "launch", founded: 2002, hq: "Starbase, Texas", about: "Reusable-rocket pioneer: Falcon 9/Heavy, Dragon crew capsule, the Starlink constellation, and Starship — the largest rocket ever flown. Launches more mass to orbit than the rest of the world combined.", website: "https://www.spacex.com", entitySlug: "spacex" },
  { name: "Blue Origin", country: "United States", flag: "🇺🇸", type: "launch", founded: 2000, hq: "Kent, Washington", about: "Jeff Bezos's rocket company: suborbital New Shepard tourism, the heavy-lift New Glenn, BE-4 engines, and the crewed Blue Moon lunar lander for Artemis.", website: "https://www.blueorigin.com" },
  { name: "United Launch Alliance (ULA)", country: "United States", flag: "🇺🇸", type: "launch", founded: 2006, hq: "Centennial, Colorado", about: "Boeing–Lockheed joint venture with a 100% mission success record across Atlas V and Delta IV; now flying the new Vulcan Centaur.", website: "https://www.ulalaunch.com" },
  { name: "Rocket Lab", country: "United States / New Zealand", flag: "🇺🇸", type: "launch", founded: 2006, hq: "Long Beach, California", about: "Small-launch leader with Electron (launched from New Zealand and Virginia), the reusable medium-lift Neutron in development, and a fast-growing satellite-components business.", website: "https://www.rocketlabusa.com" },
  { name: "Boeing Defense & Space", country: "United States", flag: "🇺🇸", type: "manufacturer", founded: 1916, hq: "Arlington, Virginia", about: "Prime contractor for the ISS and SLS core stage; builds the Starliner crew capsule and a long line of satellites and military spacecraft.", website: "https://www.boeing.com/space" },
  { name: "Lockheed Martin Space", country: "United States", flag: "🇺🇸", type: "manufacturer", founded: 1912, hq: "Littleton, Colorado", about: "Builder of the Orion deep-space crew capsule, Mars landers (InSight, Phoenix), GPS III satellites, and planetary probes like OSIRIS-REx.", website: "https://www.lockheedmartin.com/space" },
  { name: "Northrop Grumman Space", country: "United States", flag: "🇺🇸", type: "manufacturer", founded: 1939, hq: "Dulles, Virginia", about: "Cygnus ISS cargo ships, Antares and solid-rocket boosters, the James Webb Space Telescope bus, and satellite-servicing MEV vehicles.", website: "https://www.northropgrumman.com/space" },
  { name: "Sierra Space", country: "United States", flag: "🇺🇸", type: "station", founded: 2021, hq: "Louisville, Colorado", about: "Developer of the Dream Chaser spaceplane for ISS cargo and the LIFE inflatable habitat for the Orbital Reef commercial station.", website: "https://www.sierraspace.com" },
  { name: "Axiom Space", country: "United States", flag: "🇺🇸", type: "station", founded: 2016, hq: "Houston, Texas", about: "Flies private astronaut missions to the ISS and is building the first commercial space-station modules plus the Artemis moonwalk suits.", website: "https://www.axiomspace.com" },
  { name: "Firefly Aerospace", country: "United States", flag: "🇺🇸", type: "launch", founded: 2017, hq: "Cedar Park, Texas", about: "Alpha small-lift rocket and the Blue Ghost lunar lander — the first fully successful commercial Moon landing (2025).", website: "https://fireflyspace.com" },
  { name: "Intuitive Machines", country: "United States", flag: "🇺🇸", type: "services", founded: 2013, hq: "Houston, Texas", about: "Nova-C lunar landers — Odysseus made the first US Moon landing since 1972 — plus lunar-communications contracts for NASA.", website: "https://www.intuitivemachines.com" },
  { name: "Astrobotic", country: "United States", flag: "🇺🇸", type: "services", founded: 2007, hq: "Pittsburgh, Pennsylvania", about: "Peregrine and Griffin lunar landers and CubeRover delivery services under NASA's CLPS lunar-cargo program.", website: "https://www.astrobotic.com" },
  { name: "Maxar Space Systems", country: "United States", flag: "🇺🇸", type: "satellites", founded: 1957, hq: "Palo Alto, California", about: "Long-running builder of large GEO comsats and the WorldView imaging fleet; supplying the PPE power module for NASA's Gateway.", website: "https://www.maxar.com" },
  { name: "Planet Labs", country: "United States", flag: "🇺🇸", type: "satellites", founded: 2010, hq: "San Francisco, California", about: "Operates ~200 Dove and SkySat cubesats imaging the entire Earth's landmass every day.", website: "https://www.planet.com" },
  { name: "Virgin Galactic", country: "United States", flag: "🇺🇸", type: "human-spaceflight", founded: 2004, hq: "Tustin, California", about: "Suborbital space tourism aboard the air-launched SpaceShipTwo/Delta-class spaceplanes from Spaceport America.", website: "https://www.virgingalactic.com" },
  { name: "Vast", country: "United States", flag: "🇺🇸", type: "station", founded: 2021, hq: "Long Beach, California", about: "Building Haven-1, aiming to be the world's first commercial space station, launching on Falcon 9.", website: "https://www.vastspace.com" },
  { name: "Stoke Space", country: "United States", flag: "🇺🇸", type: "launch", founded: 2019, hq: "Kent, Washington", about: "Developing Nova, a fully-reusable two-stage rocket with a novel regeneratively-cooled second stage.", website: "https://www.stokespace.com" },

  // ── Europe ──
  { name: "European Space Agency (ESA)", country: "Europe (22 states)", flag: "🇪🇺", type: "agency", founded: 1975, hq: "Paris, France", about: "Europe's shared space agency: Ariane rockets, Rosetta's comet landing, Gaia's billion-star map, JUICE to Jupiter, and a third of JWST.", website: "https://www.esa.int", entitySlug: "esa" },
  { name: "Arianespace", country: "France", flag: "🇫🇷", type: "launch", founded: 1980, hq: "Évry, France", about: "The world's first commercial launch company; operates Ariane 6 and Vega-C from Kourou, French Guiana.", website: "https://www.arianespace.com" },
  { name: "CNES", country: "France", flag: "🇫🇷", type: "agency", founded: 1961, hq: "Paris, France", about: "France's space agency — Europe's largest national program, co-parent of Ariane and a partner on missions from Curiosity's ChemCam to SWOT.", website: "https://cnes.fr" },
  { name: "Airbus Defence and Space", country: "France / Germany", flag: "🇪🇺", type: "manufacturer", founded: 2014, hq: "Toulouse, France", about: "Europe's biggest space manufacturer: telecom satellites, Earth-observation fleets, Orion's European Service Module, and half of ArianeGroup.", website: "https://www.airbus.com/en/products-services/space" },
  { name: "Thales Alenia Space", country: "France / Italy", flag: "🇪🇺", type: "manufacturer", founded: 2007, hq: "Cannes, France", about: "Builder of ISS pressurized modules (nearly half the station's habitable volume), Copernicus satellites, and ExoMars hardware.", website: "https://www.thalesaleniaspace.com" },
  { name: "DLR", country: "Germany", flag: "🇩🇪", type: "agency", founded: 1969, hq: "Cologne, Germany", about: "Germany's aerospace center — space robotics, Earth observation, and the lion's share of ESA's science funding.", website: "https://www.dlr.de" },
  { name: "Isar Aerospace", country: "Germany", flag: "🇩🇪", type: "launch", founded: 2018, hq: "Munich, Germany", about: "The best-funded European launch startup; its Spectrum small-lift rocket first flew from Norway's Andøya in 2025.", website: "https://www.isaraerospace.com" },
  { name: "Rocket Factory Augsburg (RFA)", country: "Germany", flag: "🇩🇪", type: "launch", founded: 2018, hq: "Augsburg, Germany", about: "Developing the low-cost RFA One small launcher with staged-combustion engines, flying from SaxaVord, Scotland.", website: "https://www.rfa.space" },
  { name: "OHB SE", country: "Germany", flag: "🇩🇪", type: "manufacturer", founded: 1981, hq: "Bremen, Germany", about: "Family-founded satellite prime behind Galileo navigation spacecraft and SARah radar reconnaissance satellites.", website: "https://www.ohb.de" },
  { name: "Italian Space Agency (ASI)", country: "Italy", flag: "🇮🇹", type: "agency", founded: 1988, hq: "Rome, Italy", about: "Italy's space agency — a top-three ESA contributor, co-builder of Cassini's radar and the ISS's cargo modules.", website: "https://www.asi.it" },
  { name: "Avio", country: "Italy", flag: "🇮🇹", type: "launch", founded: 1908, hq: "Colleferro, Italy", about: "Prime contractor of the Vega and Vega-C light launchers and solid boosters for Ariane.", website: "https://www.avio.com" },
  { name: "UK Space Agency", country: "United Kingdom", flag: "🇬🇧", type: "agency", founded: 2010, hq: "Swindon, England", about: "Coordinates the UK's fast-growing space sector — satellite manufacturing, spaceports in Scotland and Cornwall, and ESA membership.", website: "https://www.gov.uk/ukspaceagency" },
  { name: "Surrey Satellite Technology (SSTL)", country: "United Kingdom", flag: "🇬🇧", type: "satellites", founded: 1985, hq: "Guildford, England", about: "Pioneer of low-cost small satellites; built more than 70 spacecraft including Galileo test beds and lunar-comms pathfinders.", website: "https://www.sstl.co.uk" },
  { name: "Orbex", country: "United Kingdom", flag: "🇬🇧", type: "launch", founded: 2015, hq: "Forres, Scotland", about: "Developing Prime, a bio-propane-fueled micro-launcher, to fly from Sutherland Spaceport in the Scottish Highlands.", website: "https://orbex.space" },
  { name: "PLD Space", country: "Spain", flag: "🇪🇸", type: "launch", founded: 2011, hq: "Elche, Spain", about: "Spain's launch startup: suborbital Miura 1 flew in 2023; orbital Miura 5 launches from French Guiana.", website: "https://www.pldspace.com" },
  { name: "Norwegian Space Agency", country: "Norway", flag: "🇳🇴", type: "agency", founded: 1987, hq: "Oslo, Norway", about: "Operates Andøya Spaceport — continental Europe's first orbital launch site — and polar ground stations vital to Earth observation.", website: "https://www.romsenter.no" },

  // ── Russia & CIS ──
  { name: "Roscosmos", country: "Russia", flag: "🇷🇺", type: "agency", founded: 1992, hq: "Moscow, Russia", about: "Heir to the Soviet program that launched Sputnik and Gagarin; operates Soyuz — the longest-serving crew vehicle in history — and the Russian ISS segment.", website: "https://www.roscosmos.ru", entitySlug: "roscosmos" },
  { name: "RSC Energia", country: "Russia", flag: "🇷🇺", type: "manufacturer", founded: 1946, hq: "Korolyov, Russia", about: "Korolev's original design bureau: built Vostok, Soyuz, Mir, and the ISS's Zvezda module; still makes every Soyuz crew ship.", website: "https://www.energia.ru" },
  { name: "Baikonur Cosmodrome (KazCosmos)", country: "Kazakhstan", flag: "🇰🇿", type: "agency", founded: 1955, hq: "Baikonur, Kazakhstan", about: "The world's first and busiest historic spaceport — launch site of Sputnik and Gagarin, leased and operated with Russia.", website: "https://www.gov.kz" },

  // ── China ──
  { name: "CNSA", country: "China", flag: "🇨🇳", type: "agency", founded: 1993, hq: "Beijing, China", about: "China's national space agency: Chang'e lunar sample returns (including the far side — a world first), Tianwen-1 Mars rover, and the Tiangong station.", website: "https://www.cnsa.gov.cn", entitySlug: "cnsa" },
  { name: "CASC", country: "China", flag: "🇨🇳", type: "manufacturer", founded: 1999, hq: "Beijing, China", about: "The state prime contractor building Long March rockets and most Chinese spacecraft — one of the world's highest-cadence launch organizations.", website: "http://english.spacechina.com" },
  { name: "LandSpace", country: "China", flag: "🇨🇳", type: "launch", founded: 2015, hq: "Beijing, China", about: "Private launcher that flew Zhuque-2 — the first methane-fueled rocket to reach orbit (2023) — ahead of every Western competitor.", website: "https://www.landspace.com" },
  { name: "Galactic Energy", country: "China", flag: "🇨🇳", type: "launch", founded: 2018, hq: "Beijing, China", about: "The most reliable Chinese private launcher: its solid-fueled Ceres-1 has flown a rapid commercial cadence since 2020.", website: "http://www.galactic-energy.cn" },
  { name: "iSpace (Beijing)", country: "China", flag: "🇨🇳", type: "launch", founded: 2016, hq: "Beijing, China", about: "First Chinese private company to reach orbit (Hyperbola-1, 2019); developing the reusable methane Hyperbola-3.", website: "http://www.i-space.com.cn" },

  // ── India ──
  { name: "ISRO", country: "India", flag: "🇮🇳", type: "agency", founded: 1969, hq: "Bengaluru, India", about: "India's space agency — famed for frugal engineering: Mars on the first try (Mangalyaan), Chandrayaan-3's south-pole Moon landing, and the upcoming crewed Gaganyaan.", website: "https://www.isro.gov.in", entitySlug: "isro" },
  { name: "Skyroot Aerospace", country: "India", flag: "🇮🇳", type: "launch", founded: 2018, hq: "Hyderabad, India", about: "Launched Vikram-S in 2022 — India's first private rocket; the orbital Vikram-1 is next.", website: "https://skyroot.in" },
  { name: "Agnikul Cosmos", country: "India", flag: "🇮🇳", type: "launch", founded: 2017, hq: "Chennai, India", about: "Flew the world's first rocket with a fully 3D-printed engine (Agnibaan SOrTeD, 2024) from its own private launchpad.", website: "https://agnikul.in" },
  { name: "Pixxel", country: "India", flag: "🇮🇳", type: "satellites", founded: 2019, hq: "Bengaluru, India", about: "Building a hyperspectral imaging constellation that reads crop health and methane leaks from orbit.", website: "https://www.pixxel.space" },

  // ── Japan ──
  { name: "JAXA", country: "Japan", flag: "🇯🇵", type: "agency", founded: 2003, hq: "Tokyo, Japan", about: "Japan's space agency: Hayabusa asteroid sample returns, the SLIM precision Moon lander, H3 rocket, and key ISS modules (Kibo) and cargo craft.", website: "https://global.jaxa.jp", entitySlug: "jaxa" },
  { name: "Mitsubishi Heavy Industries", country: "Japan", flag: "🇯🇵", type: "launch", founded: 1884, hq: "Tokyo, Japan", about: "Builds and operates Japan's H-IIA/H3 launchers with one of the world's best reliability records.", website: "https://www.mhi.com" },
  { name: "ispace", country: "Japan", flag: "🇯🇵", type: "services", founded: 2010, hq: "Tokyo, Japan", about: "Commercial lunar-lander company (HAKUTO-R) pursuing a cislunar economy with landers and rovers.", website: "https://ispace-inc.com" },
  { name: "Astroscale", country: "Japan", flag: "🇯🇵", type: "services", founded: 2013, hq: "Tokyo, Japan", about: "The orbital-debris-removal pioneer — its ADRAS-J mission inspected a derelict rocket stage up close in 2024.", website: "https://astroscale.com" },
  { name: "Interstellar Technologies", country: "Japan", flag: "🇯🇵", type: "launch", founded: 2013, hq: "Taiki, Hokkaido", about: "Small-rocket startup whose MOMO was the first privately-developed Japanese rocket to reach space.", website: "https://www.istellartech.com" },

  // ── Rest of world ──
  { name: "Canadian Space Agency (CSA)", country: "Canada", flag: "🇨🇦", type: "agency", founded: 1989, hq: "Longueuil, Québec", about: "Home of the Canadarm robotics that built the ISS; contributing Canadarm3 to Gateway and an astronaut to Artemis II.", website: "https://www.asc-csa.gc.ca" },
  { name: "MDA Space", country: "Canada", flag: "🇨🇦", type: "manufacturer", founded: 1969, hq: "Brampton, Ontario", about: "Builder of the Canadarm family and RADARSAT Earth-observation satellites; supplying robotics for the lunar Gateway.", website: "https://mda.space" },
  { name: "UAE Space Agency / MBRSC", country: "United Arab Emirates", flag: "🇦🇪", type: "agency", founded: 2014, hq: "Abu Dhabi / Dubai", about: "Sent the Hope probe to Mars orbit on its first interplanetary attempt (2021) and astronauts to the ISS; an Emirati airlock is joining Gateway.", website: "https://space.gov.ae" },
  { name: "Israel Space Agency", country: "Israel", flag: "🇮🇱", type: "agency", founded: 1983, hq: "Tel Aviv, Israel", about: "One of few nations with independent launch capability (Shavit); backed the SpaceIL Beresheet lunar lander.", website: "https://www.space.gov.il" },
  { name: "KASA", country: "South Korea", flag: "🇰🇷", type: "agency", founded: 2024, hq: "Sacheon, South Korea", about: "Korea's new NASA-style agency; the homegrown Nuri rocket and Danuri lunar orbiter preceded its creation.", website: "https://www.kasa.go.kr" },
  { name: "Innospace", country: "South Korea", flag: "🇰🇷", type: "launch", founded: 2017, hq: "Sejong, South Korea", about: "Korean small-launch startup using hybrid rocket engines; test-flew HANBIT-TLV from Brazil's Alcântara site.", website: "https://innospc.com" },
  { name: "Australian Space Agency", country: "Australia", flag: "🇦🇺", type: "agency", founded: 2018, hq: "Adelaide, Australia", about: "Coordinates Australia's space sector, from lunar-rover contributions to launch sites in the southern hemisphere's ideal geography.", website: "https://www.space.gov.au" },
  { name: "Gilmour Space", country: "Australia", flag: "🇦🇺", type: "launch", founded: 2013, hq: "Gold Coast, Australia", about: "Australia's leading launch startup — its Eris rocket flies hybrid engines from the Bowen Orbital Spaceport.", website: "https://www.gspace.com" },
  { name: "SUPARCO", country: "Pakistan", flag: "🇵🇰", type: "agency", founded: 1961, hq: "Karachi, Pakistan", about: "Pakistan's space agency — among Asia's oldest (founded with Nobel laureate Abdus Salam's push); operates comms and remote-sensing satellites, with lunar cubesat ICUBE-Q flown on Chang'e-6.", website: "https://suparco.gov.pk" },
  { name: "Brazilian Space Agency (AEB)", country: "Brazil", flag: "🇧🇷", type: "agency", founded: 1994, hq: "Brasília, Brazil", about: "Operates the equatorial Alcântara launch center — one of the world's most fuel-efficient launch latitudes — and Amazon-monitoring satellites.", website: "https://www.gov.br/aeb" },
  { name: "Saudi Space Agency", country: "Saudi Arabia", flag: "🇸🇦", type: "agency", founded: 2018, hq: "Riyadh, Saudi Arabia", about: "Rapidly-growing program that flew two astronauts to the ISS in 2023 and invests across the global space economy.", website: "https://ssa.gov.sa" },
  { name: "Turkish Space Agency (TUA)", country: "Türkiye", flag: "🇹🇷", type: "agency", founded: 2018, hq: "Ankara, Türkiye", about: "Türkiye's national program — first astronaut flew in 2024; developing a lunar mission and national launch capability.", website: "https://tua.gov.tr" },
  { name: "SANSA", country: "South Africa", flag: "🇿🇦", type: "agency", founded: 2010, hq: "Pretoria, South Africa", about: "South Africa's space agency; hosts key deep-space ground stations that have supported missions since Apollo.", website: "https://www.sansa.org.za" },
  { name: "Mexican Space Agency (AEM)", country: "Mexico", flag: "🇲🇽", type: "agency", founded: 2010, hq: "Mexico City, Mexico", about: "Coordinates Mexico's satellite programs and space science, with growing cubesat and Earth-observation work.", website: "https://www.gob.mx/aem" },
  { name: "Indonesian Space Agency (BRIN Space)", country: "Indonesia", flag: "🇮🇩", type: "agency", founded: 1963, hq: "Jakarta, Indonesia", about: "One of Asia's oldest programs (as LAPAN); operates Earth-observation satellites across the world's largest archipelago.", website: "https://www.brin.go.id" },
  { name: "Philippine Space Agency (PhilSA)", country: "Philippines", flag: "🇵🇭", type: "agency", founded: 2019, hq: "Quezon City, Philippines", about: "Young agency building cubesat capability and disaster-monitoring Earth observation for the typhoon belt.", website: "https://philsa.gov.ph" },
  { name: "New Zealand Space Agency", country: "New Zealand", flag: "🇳🇿", type: "agency", founded: 2016, hq: "Wellington, New Zealand", about: "Regulates one of the world's busiest small-launch sites — Rocket Lab's Māhia Peninsula — and funds a growing space-science sector.", website: "https://www.space.govt.nz" },
];
