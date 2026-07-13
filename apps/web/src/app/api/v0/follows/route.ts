import { getDb } from "@orrery/core";
import { entities, follows } from "@orrery/core/schema";
import { and, eq } from "drizzle-orm";
import { getAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

/** Toggle a follow for the signed-in user: { entityId, follow: boolean }. */
export async function POST(req: Request): Promise<Response> {
  const auth = await getAuth();
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) {
    return Response.json({ title: "Unauthorized", status: 401 }, { status: 401 });
  }
  let body: { entityId?: string; follow?: boolean };
  try {
    body = await req.json();
  } catch {
    return Response.json({ title: "Bad request", status: 400 }, { status: 400 });
  }
  const { entityId, follow } = body;
  if (typeof entityId !== "string" || typeof follow !== "boolean") {
    return Response.json({ title: "Bad request", status: 400 }, { status: 400 });
  }

  const db = await getDb();
  if (follow) {
    const [target] = await db.select({ id: entities.id }).from(entities).where(eq(entities.id, entityId)).limit(1);
    if (!target) return Response.json({ title: "Unknown entity", status: 404 }, { status: 404 });
    await db.insert(follows).values({ userId: session.user.id, entityId }).onConflictDoNothing();
  } else {
    await db.delete(follows).where(and(eq(follows.userId, session.user.id), eq(follows.entityId, entityId)));
  }
  return Response.json({ ok: true, following: follow });
}
