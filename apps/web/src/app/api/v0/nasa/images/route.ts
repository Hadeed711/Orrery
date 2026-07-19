import { nasaImageSearch } from "@/lib/nasa";

/** Cached proxy for the keyless NASA image library — used by Mission Builder. */
export async function GET(req: Request): Promise<Response> {
  const q = new URL(req.url).searchParams.get("q") ?? "";
  if (q.trim().length < 2 || q.length > 80) {
    return Response.json({ items: [] });
  }
  const items = await nasaImageSearch(q, 12);
  return Response.json(
    { items },
    { headers: { "cache-control": "public, s-maxage=86400, stale-while-revalidate=3600" } },
  );
}
