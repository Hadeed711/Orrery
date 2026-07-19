/**
 * Curated directory of the best space apps & websites (Phase 7) — sky-map
 * apps, satellite trackers, launch trackers, simulators, data archives and
 * communities. Editorial data; static and SEO-crawlable.
 */

export type SpaceApp = {
  name: string;
  category:
    | "sky-maps"
    | "satellite-tracking"
    | "launch-tracking"
    | "planning-weather"
    | "simulators"
    | "data-research"
    | "imaging"
    | "communities"
    | "learning";
  platforms: Array<"web" | "ios" | "android" | "windows" | "mac" | "linux">;
  price: "free" | "freemium" | "paid";
  about: string;
  url: string;
};

export const APP_CATEGORIES: Record<SpaceApp["category"], { title: string; blurb: string }> = {
  "sky-maps": { title: "Sky map & planetarium apps", blurb: "Point your phone at the sky and know what you're looking at." },
  "satellite-tracking": { title: "Satellite & ISS tracking", blurb: "Catch the ISS, Starlink trains, and thousands of satellites overhead." },
  "launch-tracking": { title: "Launch tracking", blurb: "Never miss a liftoff." },
  "planning-weather": { title: "Observing planning & astro-weather", blurb: "Will it be clear tonight, and how dark is your sky?" },
  simulators: { title: "Space simulators", blurb: "Fly the universe from your desk." },
  "data-research": { title: "Data, archives & research tools", blurb: "The professional-grade archives behind the pretty pictures." },
  imaging: { title: "Astrophotography", blurb: "Plan, shoot and share images of the night sky." },
  communities: { title: "Communities & forums", blurb: "Where space people hang out." },
  learning: { title: "Learning & outreach", blurb: "Explanations, courses and daily wonder." },
};

export const SPACE_APPS: SpaceApp[] = [
  // sky maps
  { name: "Stellarium", category: "sky-maps", platforms: ["web", "windows", "mac", "linux", "ios", "android"], price: "freemium", about: "The gold-standard open-source planetarium — photorealistic skies, telescope control, and a free web version at stellarium-web.org.", url: "https://stellarium.org" },
  { name: "SkySafari", category: "sky-maps", platforms: ["ios", "android"], price: "paid", about: "The serious observer's pocket planetarium: 100M+ stars in Pro, telescope control, and encyclopedic object data.", url: "https://skysafariastronomy.com" },
  { name: "Star Walk 2", category: "sky-maps", platforms: ["ios", "android"], price: "freemium", about: "Beautiful AR sky identification for beginners — point and learn, with elegant visuals.", url: "https://starwalk.space" },
  { name: "Sky Guide", category: "sky-maps", platforms: ["ios"], price: "paid", about: "Apple Design Award-winning sky app — hold it up and the sky annotates itself, with time-travel and satellite passes.", url: "https://www.fifthstarlabs.com" },
  { name: "SkyView", category: "sky-maps", platforms: ["ios", "android"], price: "freemium", about: "Simple, popular AR stargazing — great first app for identifying stars, planets and constellations.", url: "https://apps.apple.com/app/skyview/id404990064" },
  { name: "KStars", category: "sky-maps", platforms: ["windows", "mac", "linux"], price: "free", about: "Free desktop planetarium with the Ekos astrophotography suite — the backbone of many imaging rigs.", url: "https://kstars.kde.org" },
  { name: "Cartes du Ciel", category: "sky-maps", platforms: ["windows", "mac", "linux"], price: "free", about: "Veteran free star-charting software beloved for printed finder charts and telescope control.", url: "https://www.ap-i.net/skychart" },

  // satellite tracking
  { name: "Heavens-Above", category: "satellite-tracking", platforms: ["web", "android"], price: "free", about: "The classic satellite-pass predictor — ISS passes, iridium-class flares, and star charts for your exact location.", url: "https://www.heavens-above.com" },
  { name: "ISS Detector", category: "satellite-tracking", platforms: ["ios", "android"], price: "freemium", about: "Alarms before the ISS or Starlink trains cross your sky, with weather integration.", url: "https://www.issdetector.com" },
  { name: "N2YO", category: "satellite-tracking", platforms: ["web"], price: "free", about: "Live tracking of 20,000+ objects with pass predictions and real-time ground tracks.", url: "https://www.n2yo.com" },
  { name: "CelesTrak", category: "satellite-tracking", platforms: ["web"], price: "free", about: "The authoritative source of orbital elements (TLEs) since 1985 — what most other trackers are built on.", url: "https://celestrak.org" },
  { name: "Spot the Station (NASA)", category: "satellite-tracking", platforms: ["web", "ios", "android"], price: "free", about: "NASA's official ISS-spotting service with push alerts for visible passes.", url: "https://spotthestation.nasa.gov" },

  // launch tracking
  { name: "Space Launch Now", category: "launch-tracking", platforms: ["web", "ios", "android"], price: "freemium", about: "Launch schedules, countdowns and notifications, built on the same Launch Library data Orrery syncs.", url: "https://spacelaunchnow.me" },
  { name: "Next Spaceflight", category: "launch-tracking", platforms: ["web", "ios", "android"], price: "free", about: "Fast, dense launch listings with webcast links — a favorite of launch photographers.", url: "https://nextspaceflight.com" },
  { name: "RocketLaunch.Live", category: "launch-tracking", platforms: ["web"], price: "freemium", about: "Clean launch calendar with embeddable countdowns and a public API.", url: "https://www.rocketlaunch.live" },
  { name: "Flightclub.io", category: "launch-tracking", platforms: ["web"], price: "freemium", about: "3D launch-trajectory simulations — watch a Falcon 9's real flight profile before it flies.", url: "https://flightclub.io" },

  // planning & weather
  { name: "Clear Outside", category: "planning-weather", platforms: ["web", "ios", "android"], price: "free", about: "Hour-by-hour cloud forecasts made for astronomers, from the makers of First Light Optics.", url: "https://clearoutside.com" },
  { name: "Astrospheric", category: "planning-weather", platforms: ["web", "ios", "android"], price: "freemium", about: "North America's favorite astronomy forecast — cloud, seeing, transparency and smoke layers.", url: "https://www.astrospheric.com" },
  { name: "Light Pollution Map", category: "planning-weather", platforms: ["web"], price: "free", about: "Interactive world atlas of light pollution — find your nearest dark-sky site.", url: "https://www.lightpollutionmap.info" },
  { name: "Telescopius", category: "planning-weather", platforms: ["web"], price: "freemium", about: "Target-planning powerhouse: what's visible tonight, framing calculators, and imaging target lists.", url: "https://telescopius.com" },
  { name: "PhotoPills", category: "planning-weather", platforms: ["ios", "android"], price: "paid", about: "The planning app for Milky Way, Moon and eclipse photography — AR previews of exactly where things will rise.", url: "https://www.photopills.com" },

  // simulators
  { name: "NASA's Eyes", category: "simulators", platforms: ["web"], price: "free", about: "NASA's own real-time 3D visualization of the Solar System, exoplanets, and every active deep-space mission.", url: "https://eyes.nasa.gov" },
  { name: "SpaceEngine", category: "simulators", platforms: ["windows"], price: "paid", about: "A procedurally-generated universe — fly seamlessly from Earth's surface to galaxies billions of light-years away.", url: "https://spaceengine.org" },
  { name: "Universe Sandbox", category: "simulators", platforms: ["windows", "mac"], price: "paid", about: "Physics-sandbox cosmos: collide planets, rearrange the Solar System, and watch gravity do its thing.", url: "https://universesandbox.com" },
  { name: "Celestia", category: "simulators", platforms: ["windows", "mac", "linux"], price: "free", about: "The classic open-source 3D universe explorer, still actively maintained by its community.", url: "https://celestiaproject.space" },
  { name: "Kerbal Space Program", category: "simulators", platforms: ["windows", "mac", "linux"], price: "paid", about: "The game that taught a generation orbital mechanics — build rockets, fly them, learn why staging matters.", url: "https://www.kerbalspaceprogram.com" },
  { name: "Orbiter 2016", category: "simulators", platforms: ["windows"], price: "free", about: "The hardcore freeware spaceflight simulator — fly a realistic Space Shuttle with real physics.", url: "http://orbit.medphys.ucl.ac.uk" },

  // data & research
  { name: "NASA Open APIs", category: "data-research", platforms: ["web"], price: "free", about: "APOD, Mars rover photos, Earth imagery, asteroid data — the APIs this site's NASA features run on.", url: "https://api.nasa.gov" },
  { name: "JPL Horizons", category: "data-research", platforms: ["web"], price: "free", about: "NASA's precision ephemeris system — exact positions of every planet, moon and spacecraft, any date.", url: "https://ssd.jpl.nasa.gov/horizons" },
  { name: "ESASky", category: "data-research", platforms: ["web"], price: "free", about: "ESA's all-sky multi-mission atlas — pan the entire sky across X-ray to radio survey layers.", url: "https://sky.esa.int" },
  { name: "Aladin Sky Atlas", category: "data-research", platforms: ["web", "windows", "mac", "linux"], price: "free", about: "The professional interactive sky atlas from Strasbourg — overlay any catalog on any survey.", url: "https://aladin.cds.unistra.fr" },
  { name: "SIMBAD", category: "data-research", platforms: ["web"], price: "free", about: "The astronomical reference database — 12M+ objects with identifiers, measurements and every published reference.", url: "https://simbad.cds.unistra.fr" },
  { name: "Exoplanet Archive", category: "data-research", platforms: ["web"], price: "free", about: "NASA's official count and catalog of confirmed exoplanets, updated weekly.", url: "https://exoplanetarchive.ipac.caltech.edu" },
  { name: "WorldWide Telescope", category: "data-research", platforms: ["web"], price: "free", about: "AAS-run virtual telescope stitching the world's survey imagery into one explorable sky.", url: "https://worldwidetelescope.org" },
  { name: "Zooniverse", category: "data-research", platforms: ["web"], price: "free", about: "Do real science: classify galaxies, hunt exoplanets and find asteroids in citizen-science projects.", url: "https://www.zooniverse.org" },

  // imaging
  { name: "AstroBin", category: "imaging", platforms: ["web"], price: "freemium", about: "The astrophotography community's image platform — full acquisition details on every photo.", url: "https://www.astrobin.com" },
  { name: "N.I.N.A.", category: "imaging", platforms: ["windows"], price: "free", about: "Nighttime Imaging 'N' Astronomy — the free imaging-session suite that runs thousands of backyard observatories.", url: "https://nighttime-imaging.eu" },
  { name: "PixInsight", category: "imaging", platforms: ["windows", "mac", "linux"], price: "paid", about: "The professional's astrophoto processing platform — the deep-sky standard.", url: "https://pixinsight.com" },
  { name: "Astrometry.net", category: "imaging", platforms: ["web"], price: "free", about: "Upload any sky photo and it tells you exactly where it is — free plate-solving used across the field.", url: "https://nova.astrometry.net" },

  // communities
  { name: "Cloudy Nights", category: "communities", platforms: ["web"], price: "free", about: "The largest amateur-astronomy forum — equipment reviews and decades of collective wisdom.", url: "https://www.cloudynights.com" },
  { name: "r/space", category: "communities", platforms: ["web"], price: "free", about: "Reddit's 27M-member space community for news and discussion; r/Astronomy and r/spacex for deeper dives.", url: "https://www.reddit.com/r/space" },
  { name: "NASASpaceflight Forum", category: "communities", platforms: ["web"], price: "free", about: "Where launch insiders post — the L2 community famously breaks spaceflight news before the press.", url: "https://forum.nasaspaceflight.com" },
  { name: "Stargazers Lounge", category: "communities", platforms: ["web"], price: "free", about: "The UK's friendliest astronomy forum, great for beginners choosing first telescopes.", url: "https://stargazerslounge.com" },

  // learning
  { name: "NASA App", category: "learning", platforms: ["ios", "android", "web"], price: "free", about: "NASA's official app: live NASA TV, mission updates, and 16,000+ images.", url: "https://www.nasa.gov/nasa-app" },
  { name: "APOD", category: "learning", platforms: ["web"], price: "free", about: "The Astronomy Picture of the Day — running daily since 1995 and mirrored right here on Orrery.", url: "https://apod.nasa.gov/apod" },
  { name: "EarthSky", category: "learning", platforms: ["web"], price: "free", about: "Daily sky-watching guides in plain language — what to look for tonight and why.", url: "https://earthsky.org" },
  { name: "Sky & Telescope", category: "learning", platforms: ["web"], price: "freemium", about: "The venerable magazine's site — authoritative observing guides and sky charts since 1941.", url: "https://skyandtelescope.org" },
  { name: "In-The-Sky.org", category: "learning", platforms: ["web"], price: "free", about: "Encyclopedic astronomical almanac — every conjunction, eclipse and event, computed for your location.", url: "https://in-the-sky.org" },
  { name: "TheSkyLive", category: "learning", platforms: ["web"], price: "free", about: "Live positions and finder charts for planets, comets and asteroids — great for tracking newly-found comets.", url: "https://theskylive.com" },
  { name: "Scott Manley (YouTube)", category: "learning", platforms: ["web"], price: "free", about: "The internet's favorite orbital-mechanics explainer — rocket science made genuinely clear.", url: "https://www.youtube.com/@scottmanley" },
  { name: "Everyday Astronaut", category: "learning", platforms: ["web"], price: "free", about: "Deep-dive launch guides and 'rocket science for everyone' video essays, plus live launch coverage.", url: "https://everydayastronaut.com" },
];
