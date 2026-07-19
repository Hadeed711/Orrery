import { getDb } from "@orrery/core";
import { userFollows } from "@orrery/core/schema";
import { and, eq } from "drizzle-orm";
import { getAuth } from "@/lib/auth";
import { profileByUsername } from "@/lib/community";

export const dynamic = "force-dynamic";

/** Follow/unfollow a person: { username, follow: boolean }. Auth required. */
export async function POST(req: Request): Promise<Response> {
  const auth = await getAuth();
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) {
    return Response.json({ title: "Unauthorized", status: 401 }, { status: 401 });
  }
  let json: { username?: unknown; follow?: unknown };
  try {
    json = await req.json();
  } catch {
    return Response.json({ title: "Bad request", status: 400 }, { status: 400 });
  }
  if (typeof json.username !== "string" || typeof json.follow !== "boolean") {
    return Response.json({ title: "Bad request", status: 400 }, { status: 400 });
  }
  const target = await profileByUsername(json.username);
  if (!target) return Response.json({ title: "No such person", status: 404 }, { status: 404 });
  if (target.profile.userId === session.user.id) {
    return Response.json({ title: "You can't follow yourself.", status: 400 }, { status: 400 });
  }
  const db = await getDb();
  if (json.follow) {
    await db
      .insert(userFollows)
      .values({ followerId: session.user.id, followingId: target.profile.userId })
      .onConflictDoNothing();
  } else {
    await db
      .delete(userFollows)
      .where(
        and(
          eq(userFollows.followerId, session.user.id),
          eq(userFollows.followingId, target.profile.userId),
        ),
      );
  }
  return Response.json({ ok: true, following: json.follow });
}
