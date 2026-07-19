import { getDb } from "@orrery/core";
import { entities, posts } from "@orrery/core/schema";
import { and, eq } from "drizzle-orm";
import { getAuth } from "@/lib/auth";
import { cleanBody, ensureProfile, latestPosts } from "@/lib/community";

export const dynamic = "force-dynamic";

/** Public read of the community feed (viewer decorations when signed in). */
export async function GET(req: Request): Promise<Response> {
  const auth = await getAuth();
  const session = await auth.api.getSession({ headers: req.headers });
  const url = new URL(req.url);
  const before = url.searchParams.get("before");
  const beforeDate = before ? new Date(before) : undefined;
  const items = await latestPosts(
    session?.user?.id ?? null,
    40,
    beforeDate && !Number.isNaN(beforeDate.getTime()) ? beforeDate : undefined,
  );
  return Response.json({ items });
}

/** Create a post: { body, entityId? }. Auth required. */
export async function POST(req: Request): Promise<Response> {
  const auth = await getAuth();
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) {
    return Response.json({ title: "Unauthorized", status: 401 }, { status: 401 });
  }
  let json: { body?: unknown; entityId?: unknown };
  try {
    json = await req.json();
  } catch {
    return Response.json({ title: "Bad request", status: 400 }, { status: 400 });
  }
  const body = cleanBody(json.body, 1000);
  if (!body) {
    return Response.json({ title: "Post must be 1–1000 characters.", status: 400 }, { status: 400 });
  }
  const db = await getDb();
  let entityId: string | null = null;
  if (json.entityId !== undefined && json.entityId !== null) {
    if (typeof json.entityId !== "string") {
      return Response.json({ title: "Bad request", status: 400 }, { status: 400 });
    }
    const [target] = await db
      .select({ id: entities.id })
      .from(entities)
      .where(eq(entities.id, json.entityId))
      .limit(1);
    if (!target) return Response.json({ title: "Unknown entity", status: 404 }, { status: 404 });
    entityId = target.id;
  }
  await ensureProfile(session.user.id, session.user.email);
  const [row] = await db
    .insert(posts)
    .values({ userId: session.user.id, body, entityId })
    .returning({ id: posts.id });
  return Response.json({ ok: true, id: row!.id }, { status: 201 });
}

/** Delete own post: /api/v0/posts?id=<uuid>. */
export async function DELETE(req: Request): Promise<Response> {
  const auth = await getAuth();
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) {
    return Response.json({ title: "Unauthorized", status: 401 }, { status: 401 });
  }
  const id = new URL(req.url).searchParams.get("id");
  if (!id || !/^[0-9a-f-]{36}$/i.test(id)) {
    return Response.json({ title: "Bad request", status: 400 }, { status: 400 });
  }
  const db = await getDb();
  const deleted = await db
    .delete(posts)
    .where(and(eq(posts.id, id), eq(posts.userId, session.user.id)))
    .returning({ id: posts.id });
  if (deleted.length === 0) {
    return Response.json({ title: "Not found", status: 404 }, { status: 404 });
  }
  return Response.json({ ok: true });
}
