import { skyTonight } from "@orrery/core";
import { DEFAULT_LOC } from "@/lib/location";

export const dynamic = "force-dynamic";

/** GET /api/v0/sky/tonight?lat=&lon= — docs/API-SURFACE.md §2. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const lat = Number(url.searchParams.get("lat") ?? DEFAULT_LOC.lat);
  const lon = Number(url.searchParams.get("lon") ?? DEFAULT_LOC.lon);

  if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) {
    return Response.json(
      { type: "about:blank", title: "Invalid coordinates", status: 400, detail: "lat must be −90..90, lon −180..180" },
      { status: 400 },
    );
  }

  return Response.json(skyTonight(lat, lon), {
    headers: { "cache-control": "public, s-maxage=300, stale-while-revalidate=600" },
  });
}
