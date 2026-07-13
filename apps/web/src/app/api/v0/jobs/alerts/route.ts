import { dueForLaunchAlert, getDb, launchAlertKey, launchAlertPayload } from "@orrery/core";
import { edges, entities, follows, launches, pushSent, pushSubscriptions } from "@orrery/core/schema";
import { and, eq, gte, inArray, isNotNull, lte } from "drizzle-orm";
import { pushConfigured, sendPush } from "@/lib/push";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/** Same auth contract as the ll2/news jobs (ADR-003). */
function authorized(req: Request): boolean {
  const fallback = process.env.NODE_ENV === "production" ? null : "dev";
  const secret = process.env.JOB_SECRET ?? fallback;
  const cronSecret = process.env.CRON_SECRET ?? secret;
  if (!secret && !cronSecret) return false;
  const auth = req.headers.get("authorization");
  return req.headers.get("x-job-secret") === secret || (cronSecret != null && auth === `Bearer ${cronSecret}`);
}

/**
 * T-15 launch alerts (ALERT-1): for every launch lifting off in the next ~25
 * minutes, push to every subscriber who follows an entity connected to that
 * launch (rocket, agency, pad). The push_sent ledger makes reruns idempotent.
 */
async function handle(req: Request): Promise<Response> {
  if (!authorized(req)) {
    return Response.json({ title: "Unauthorized", status: 401 }, { status: 401 });
  }
  if (!pushConfigured()) {
    return Response.json({ ok: true, connector: "alerts", skipped: "VAPID keys not configured" });
  }

  const now = new Date();
  const db = await getDb();
  const window = await db
    .select({ entity: entities, launch: launches })
    .from(launches)
    .innerJoin(entities, eq(entities.id, launches.entityId))
    .where(
      and(
        isNotNull(launches.net),
        gte(launches.net, new Date(now.getTime() - 10 * 60_000)),
        lte(launches.net, new Date(now.getTime() + 30 * 60_000)),
      ),
    );

  let sent = 0;
  let pruned = 0;
  for (const { entity, launch } of window) {
    const alertable = {
      entityId: entity.id,
      slug: entity.slug,
      name: entity.name,
      status: launch.status,
      net: launch.net,
    };
    if (!dueForLaunchAlert(alertable, now)) continue;

    // Everyone whose follows touch this launch's graph neighborhood.
    const related = await db.select({ dstId: edges.dstId }).from(edges).where(eq(edges.srcId, entity.id));
    const relatedIds = [entity.id, ...related.map((r) => r.dstId)];
    const subs = await db
      .selectDistinctOn([pushSubscriptions.id], {
        id: pushSubscriptions.id,
        endpoint: pushSubscriptions.endpoint,
        p256dh: pushSubscriptions.p256dh,
        auth: pushSubscriptions.auth,
      })
      .from(pushSubscriptions)
      .innerJoin(follows, eq(follows.userId, pushSubscriptions.userId))
      .where(inArray(follows.entityId, relatedIds))
      .orderBy(pushSubscriptions.id);

    const key = launchAlertKey(alertable);
    const payload = launchAlertPayload(alertable, now);
    for (const sub of subs) {
      const claimed = await db
        .insert(pushSent)
        .values({ subscriptionId: sub.id, alertKey: key })
        .onConflictDoNothing()
        .returning({ subscriptionId: pushSent.subscriptionId });
      if (claimed.length === 0) continue; // already alerted by an earlier run
      const ok = await sendPush(sub, payload);
      if (ok) sent += 1;
      else pruned += 1;
    }
  }

  return Response.json({ ok: true, connector: "alerts", launchesInWindow: window.length, sent, pruned });
}

export const GET = handle;
export const POST = handle;
