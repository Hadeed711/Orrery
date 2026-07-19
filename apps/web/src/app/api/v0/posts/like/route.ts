import { getDb } from "@orrery/core";
import { postLikes, posts } from "@orrery/core/schema";
import { and, eq } from "drizzle-orm";
import { getAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

/** Toggle a like: { postId, like: boolean }. Auth required. */
export async function POST(req: Request): Promise<Response> {
  const auth = await getAuth();
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) {
    return Response.json({ title: "Unauthorized", status: 401 }, { status: 401 });
  }
  let json: { postId?: unknown; like?: unknown };
  try {
    json = await req.json();
  } catch {
    return Response.json({ title: "Bad request", status: 400 }, { status: 400 });
  }
  if (typeof json.postId !== "string" || typeof json.like !== "boolean") {
    return Response.json({ title: "Bad request", status: 400 }, { status: 400 });
  }
  const db = await getDb();
  if (json.like) {
    const [target] = await db
      .select({ id: posts.id })
      .from(posts)
      .where(eq(posts.id, json.postId))
      .limit(1);
    if (!target) return Response.json({ title: "Not found", status: 404 }, { status: 404 });
    await db
      .insert(postLikes)
      .values({ postId: json.postId, userId: session.user.id })
      .onConflictDoNothing();
  } else {
    await db
      .delete(postLikes)
      .where(and(eq(postLikes.postId, json.postId), eq(postLikes.userId, session.user.id)));
  }
  return Response.json({ ok: true, liked: json.like });
}
