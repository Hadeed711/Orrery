import type { MetadataRoute } from "next";

/** Installable PWA manifest (Phase 6 PWA-1). */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Orrery — everything space",
    short_name: "Orrery",
    description:
      "Sky calendar, launch tracking, and tonight's sky for your location — one graph of everything space.",
    start_url: "/",
    display: "standalone",
    background_color: "#070a12",
    theme_color: "#070a12",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
