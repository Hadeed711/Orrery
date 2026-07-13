import { composeDigest, getDb, isoWeekKey } from "@orrery/core";
import {
  articleEntities,
  articles,
  digestSent,
  edges,
  entities,
  eventsAstro,
  follows,
  launches,
  sources,
  user,
} from "@orrery/core/schema";
import { and, asc, desc, eq, gte, inArray, isNotNull, lte } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

/** Same auth contract as the other jobs (ADR-003). */
function authorized(req: Request): boolean {
  const fallback = process.env.NODE_ENV === "production" ? null : "dev";
  const secret = process.env.JOB_SECRET ?? fallback;
  const cronSecret = process.env.CRON_SECRET ?? secret;
  if (!secret && !cronSecret) return false;
  const auth = req.headers.get("authorization");
  return req.headers.get("x-job-secret") === secret || (cronSecret != null && auth === `Bearer ${cronSecret}`);
}

async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM ?? "Orrery <onboarding@resend.dev>",
      to,
      subject,
      html,
    }),
  });
  return res.ok;
}

/**
 * Weekly digest (DIGEST-1): once per ISO week per user with follows, email the
 * week ahead (launches + sky events connected to follows) and recent news.
 * Skips cleanly without RESEND_API_KEY; digest_sent ledger makes reruns idempotent.
 */
async function handle(req: Request): Promise<Response> {
  if (!authorized(req)) {
    return Response.json({ title: "Unauthorized", status: 401 }, { status: 401 });
  }
  if (!process.env.RESEND_API_KEY) {
    return Response.json({ ok: true, connector: "digest", skipped: "RESEND_API_KEY not configured" });
  }

  const db = await getDb();
  const now = new Date();
  const weekKey = isoWeekKey(now);
  const weekAhead = new Date(now.getTime() + 7 * 86400_000);
  const weekBack = new Date(now.getTime() - 7 * 86400_000);
  const siteUrl = process.env.SITE_URL ?? "http://localhost:3000";

  const followers = await db
    .selectDistinctOn([user.id], { id: user.id, name: user.name, email: user.email })
    .from(user)
    .innerJoin(follows, eq(follows.userId, user.id))
    .orderBy(user.id);

  let sent = 0;
  let skipped = 0;
  for (const u of followers) {
    const already = await db
      .insert(digestSent)
      .values({ userId: u.id, weekKey })
      .onConflictDoNothing()
      .returning({ userId: digestSent.userId });
    if (already.length === 0) {
      skipped += 1;
      continue;
    }

    const followedIds = (
      await db.select({ entityId: follows.entityId }).from(follows).where(eq(follows.userId, u.id))
    ).map((f) => f.entityId);

    const [nextLaunches, nextEvents, news] = await Promise.all([
      db
        .selectDistinctOn([launches.net, entities.id], {
          name: entities.name,
          slug: entities.slug,
          net: launches.net,
          status: launches.status,
        })
        .from(edges)
        .innerJoin(launches, eq(launches.entityId, edges.srcId))
        .innerJoin(entities, eq(entities.id, launches.entityId))
        .where(and(inArray(edges.dstId, followedIds), isNotNull(launches.net), gte(launches.net, now), lte(launches.net, weekAhead)))
        .orderBy(asc(launches.net), asc(entities.id))
        .limit(8),
      db
        .selectDistinctOn([eventsAstro.peakAt, entities.id], {
          name: entities.name,
          slug: entities.slug,
          peakAt: eventsAstro.peakAt,
        })
        .from(edges)
        .innerJoin(eventsAstro, eq(eventsAstro.entityId, edges.srcId))
        .innerJoin(entities, eq(entities.id, eventsAstro.entityId))
        .where(and(inArray(edges.dstId, followedIds), gte(eventsAstro.peakAt, now), lte(eventsAstro.peakAt, weekAhead)))
        .orderBy(asc(eventsAstro.peakAt), asc(entities.id))
        .limit(8),
      db
        .selectDistinctOn([articles.publishedAt, articles.id], {
          title: articles.title,
          url: articles.url,
          sourceName: sources.name,
        })
        .from(articleEntities)
        .innerJoin(articles, eq(articles.id, articleEntities.articleId))
        .innerJoin(sources, eq(sources.id, articles.sourceId))
        .where(and(inArray(articleEntities.entityId, followedIds), gte(articles.publishedAt, weekBack)))
        .orderBy(desc(articles.publishedAt), desc(articles.id))
        .limit(6),
    ]);

    const digest = composeDigest({
      userName: u.name || (u.email.split("@")[0] ?? u.email),
      weekKey,
      siteUrl,
      launches: nextLaunches,
      events: nextEvents,
      articles: news,
    });
    if (!digest) {
      // Nothing to say this week — release the ledger row so next run can retry
      // once content exists? No: an empty week is still "handled" for this week.
      skipped += 1;
      continue;
    }
    if (await sendEmail(u.email, digest.subject, digest.html)) sent += 1;
  }

  return Response.json({ ok: true, connector: "digest", weekKey, users: followers.length, sent, skipped });
}

export const GET = handle;
export const POST = handle;
