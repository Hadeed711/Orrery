import { syncNews } from "@orrery/connectors";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/** Same auth contract as the ll2 job (ADR-003): cron Bearer or x-job-secret. */
function authorized(req: Request): boolean {
  const fallback = process.env.NODE_ENV === "production" ? null : "dev";
  const secret = process.env.JOB_SECRET ?? fallback;
  const cronSecret = process.env.CRON_SECRET ?? secret;
  if (!secret && !cronSecret) return false;
  const auth = req.headers.get("authorization");
  return req.headers.get("x-job-secret") === secret || (cronSecret != null && auth === `Bearer ${cronSecret}`);
}

async function handle(req: Request): Promise<Response> {
  if (!authorized(req)) {
    return Response.json({ title: "Unauthorized", status: 401 }, { status: 401 });
  }
  try {
    const result = await syncNews();
    return Response.json({ ok: true, connector: "news", ...result });
  } catch (err) {
    return Response.json({ ok: false, connector: "news", error: String(err) }, { status: 502 });
  }
}

export const GET = handle;
export const POST = handle;
