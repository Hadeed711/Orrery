/**
 * NASA open APIs (Phase 7). Server-side only; results cached via Next's
 * fetch cache so we stay far inside rate limits. Everything degrades to
 * null/[] on failure — pages render fine without NASA data.
 *  - APOD needs NASA_API_KEY (falls back to DEMO_KEY's tiny quota).
 *  - The NASA Image & Video Library (images-api.nasa.gov) is keyless.
 */

const APOD_URL = "https://api.nasa.gov/planetary/apod";
const IMAGES_URL = "https://images-api.nasa.gov/search";

export type Apod = {
  date: string;
  title: string;
  explanation: string;
  url: string;
  hdurl?: string;
  media_type: "image" | "video" | string;
  copyright?: string;
};

export async function fetchApod(): Promise<Apod | null> {
  const key = process.env.NASA_API_KEY ?? "DEMO_KEY";
  try {
    const res = await fetch(`${APOD_URL}?api_key=${encodeURIComponent(key)}&thumbs=true`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as Apod;
    if (!data?.title || !data?.url) return null;
    return data;
  } catch {
    return null;
  }
}

export type NasaImage = {
  title: string;
  nasaId: string;
  thumb: string;
  description: string | null;
  dateCreated: string | null;
  center: string | null;
};

/** Search the NASA Image & Video Library (keyless, CORS-free via our server). */
export async function nasaImageSearch(q: string, limit = 8): Promise<NasaImage[]> {
  const query = q.trim().slice(0, 80);
  if (!query) return [];
  try {
    const url = `${IMAGES_URL}?q=${encodeURIComponent(query)}&media_type=image&page_size=${Math.min(limit, 24)}`;
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) return [];
    const data = (await res.json()) as {
      collection?: { items?: Array<{ data?: Array<Record<string, unknown>>; links?: Array<{ href?: string; rel?: string }> }> };
    };
    const items = data.collection?.items ?? [];
    const out: NasaImage[] = [];
    for (const item of items) {
      const d = item.data?.[0];
      const href = item.links?.find((l) => l.rel === "preview")?.href ?? item.links?.[0]?.href;
      if (!d || typeof d.title !== "string" || typeof d.nasa_id !== "string" || typeof href !== "string") continue;
      out.push({
        title: d.title,
        nasaId: d.nasa_id,
        thumb: href,
        description: typeof d.description === "string" ? d.description.slice(0, 300) : null,
        dateCreated: typeof d.date_created === "string" ? d.date_created.slice(0, 10) : null,
        center: typeof d.center === "string" ? d.center : null,
      });
      if (out.length >= limit) break;
    }
    return out;
  } catch {
    return [];
  }
}

/** Link into the library's own viewer for full-res + metadata. */
export function nasaImagePageUrl(nasaId: string): string {
  return `https://images.nasa.gov/details/${encodeURIComponent(nasaId)}`;
}
