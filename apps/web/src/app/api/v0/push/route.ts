import { getDb } from "@orrery/core";
import { pushSubscriptions } from "@orrery/core/schema";
import { and, eq } from "drizzle-orm";
import { getAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

async function currentUserId(req: Request): Promise<string | null> {
  const auth = await getAuth();
  const session = await auth.api.getSession({ headers: req.headers });
  return session?.user?.id ?? null;
}

/** Register (or refresh) this browser's push subscription for the signed-in user. */
export async function POST(req: Request): Promise<Response> {
  const userId = await currentUserId(req);
  if (!userId) return Response.json({ title: "Unauthorized", status: 401 }, { status: 401 });

  let body: {
    endpoint?: string;
    keys?: { p256dh?: string; auth?: string };
    prefs?: { launches?: boolean; events?: boolean };
  };
  try {
    body = await req.json();
  } catch {
    return Response.json({ title: "Bad request", status: 400 }, { status: 400 });
  }
  const { endpoint, keys } = body;
  if (!endpoint || !keys?.p256dh || !keys?.auth) {
    return Response.json({ title: "Bad request", status: 400 }, { status: 400 });
  }

  const db = await getDb();
  await db
    .insert(pushSubscriptions)
    .values({
      userId,
      endpoint,
      p256dh: keys.p256dh,
      auth: keys.auth,
      prefs: body.prefs ?? { launches: true },
    })
    .onConflictDoUpdate({
      target: pushSubscriptions.endpoint,
      set: {
        userId,
        p256dh: keys.p256dh,
        auth: keys.auth,
        prefs: body.prefs ?? { launches: true },
        lastSeenAt: new Date(),
      },
    });
  return Response.json({ ok: true });
}

/** Remove this browser's subscription: { endpoint }. */
export async function DELETE(req: Request): Promise<Response> {
  const userId = await currentUserId(req);
  if (!userId) return Response.json({ title: "Unauthorized", status: 401 }, { status: 401 });
  let body: { endpoint?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ title: "Bad request", status: 400 }, { status: 400 });
  }
  if (!body.endpoint) return Response.json({ title: "Bad request", status: 400 }, { status: 400 });
  const db = await getDb();
  await db
    .delete(pushSubscriptions)
    .where(and(eq(pushSubscriptions.userId, userId), eq(pushSubscriptions.endpoint, body.endpoint)));
  return Response.json({ ok: true });
}
