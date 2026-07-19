import { NextResponse, type NextRequest } from "next/server";

/**
 * Basic API rate limiting (Phase 6 OPS-2): fixed-window counters per IP,
 * in-memory (per serverless instance — coarse but free; protects against
 * naive abuse, not distributed attacks). Auth endpoints get a tighter budget
 * on top of better-auth's own built-in limiter.
 */
const WINDOW_MS = 60_000;
// First matching prefix wins — tighter budgets for community write surfaces
// (Phase 7) sit above the generic /api rule.
const LIMITS: Array<{ prefix: string; max: number }> = [
  { prefix: "/api/auth", max: 30 },
  { prefix: "/api/v0/posts", max: 30 },
  { prefix: "/api/v0/messages", max: 60 },
  { prefix: "/api/v0/profile", max: 20 },
  { prefix: "/api/v0/user-follows", max: 30 },
  { prefix: "/api/v0/nasa", max: 30 },
  { prefix: "/api", max: 120 },
];

const buckets = new Map<string, { count: number; resetAt: number }>();

export function middleware(req: NextRequest): NextResponse {
  const path = req.nextUrl.pathname;
  const rule = LIMITS.find((l) => path.startsWith(l.prefix));
  if (!rule) return NextResponse.next();

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "local";
  const key = `${rule.prefix}:${ip}`;
  const now = Date.now();

  let bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    bucket = { count: 0, resetAt: now + WINDOW_MS };
    buckets.set(key, bucket);
    // Opportunistic cleanup so the map can't grow unbounded.
    if (buckets.size > 10_000) {
      for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
    }
  }
  bucket.count += 1;
  if (bucket.count > rule.max) {
    return new NextResponse(
      JSON.stringify({ title: "Too many requests", status: 429 }),
      {
        status: 429,
        headers: {
          "content-type": "application/json",
          "retry-after": String(Math.ceil((bucket.resetAt - now) / 1000)),
        },
      },
    );
  }
  return NextResponse.next();
}

export const config = { matcher: "/api/:path*" };
