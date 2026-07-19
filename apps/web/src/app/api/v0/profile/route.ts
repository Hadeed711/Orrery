import { getDb } from "@orrery/core";
import { profiles } from "@orrery/core/schema";
import { eq } from "drizzle-orm";
import { getAuth } from "@/lib/auth";
import { ensureProfile, validateProfile } from "@/lib/community";

export const dynamic = "force-dynamic";

/** The signed-in user's own profile (created on first touch). */
export async function GET(req: Request): Promise<Response> {
  const auth = await getAuth();
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) {
    return Response.json({ title: "Unauthorized", status: 401 }, { status: 401 });
  }
  const profile = await ensureProfile(session.user.id, session.user.email);
  return Response.json({ profile });
}

/** Update own profile: { username?, displayName?, bio?, location?, website?, avatar? }. */
export async function PUT(req: Request): Promise<Response> {
  const auth = await getAuth();
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) {
    return Response.json({ title: "Unauthorized", status: 401 }, { status: 401 });
  }
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ title: "Bad request", status: 400 }, { status: 400 });
  }
  const result = validateProfile(body);
  if (!result.ok) {
    return Response.json({ title: result.error, status: 400 }, { status: 400 });
  }
  await ensureProfile(session.user.id, session.user.email);
  const db = await getDb();
  try {
    const [updated] = await db
      .update(profiles)
      .set({ ...result.patch, updatedAt: new Date() })
      .where(eq(profiles.userId, session.user.id))
      .returning();
    return Response.json({ profile: updated });
  } catch (e) {
    // Unique-violation on username is the only expected conflict.
    const msg = e instanceof Error ? e.message : "";
    if (msg.includes("profiles_username_unique") || msg.toLowerCase().includes("duplicate")) {
      return Response.json({ title: "That username is taken.", status: 409 }, { status: 409 });
    }
    throw e;
  }
}
