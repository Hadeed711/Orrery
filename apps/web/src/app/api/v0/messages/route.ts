import { getDb } from "@orrery/core";
import { dmMessages } from "@orrery/core/schema";
import { getAuth } from "@/lib/auth";
import { cleanBody, ensureProfile, inbox, profileByUsername, thread } from "@/lib/community";

export const dynamic = "force-dynamic";

/**
 * GET  /api/v0/messages            → inbox (latest conversation per partner)
 * GET  /api/v0/messages?with=user  → full thread with that person (marks read)
 * Only ever returns conversations the signed-in user participates in.
 */
export async function GET(req: Request): Promise<Response> {
  const auth = await getAuth();
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) {
    return Response.json({ title: "Unauthorized", status: 401 }, { status: 401 });
  }
  const withUser = new URL(req.url).searchParams.get("with");
  if (!withUser) {
    return Response.json({ conversations: await inbox(session.user.id) });
  }
  const partner = await profileByUsername(withUser);
  if (!partner) return Response.json({ title: "No such person", status: 404 }, { status: 404 });
  const messages = await thread(session.user.id, partner.profile.userId);
  return Response.json({
    partner: {
      username: partner.profile.username,
      displayName: partner.profile.displayName,
      avatar: partner.profile.avatar,
    },
    me: session.user.id,
    messages,
  });
}

/** Send a message: { to: username, body }. Auth required. */
export async function POST(req: Request): Promise<Response> {
  const auth = await getAuth();
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) {
    return Response.json({ title: "Unauthorized", status: 401 }, { status: 401 });
  }
  let json: { to?: unknown; body?: unknown };
  try {
    json = await req.json();
  } catch {
    return Response.json({ title: "Bad request", status: 400 }, { status: 400 });
  }
  if (typeof json.to !== "string") {
    return Response.json({ title: "Bad request", status: 400 }, { status: 400 });
  }
  const body = cleanBody(json.body, 2000);
  if (!body) {
    return Response.json({ title: "Message must be 1–2000 characters.", status: 400 }, { status: 400 });
  }
  const partner = await profileByUsername(json.to);
  if (!partner) return Response.json({ title: "No such person", status: 404 }, { status: 404 });
  if (partner.profile.userId === session.user.id) {
    return Response.json({ title: "You can't message yourself.", status: 400 }, { status: 400 });
  }
  await ensureProfile(session.user.id, session.user.email);
  const db = await getDb();
  const [row] = await db
    .insert(dmMessages)
    .values({ senderId: session.user.id, recipientId: partner.profile.userId, body })
    .returning({ id: dmMessages.id, createdAt: dmMessages.createdAt });
  return Response.json({ ok: true, id: row!.id, createdAt: row!.createdAt }, { status: 201 });
}
