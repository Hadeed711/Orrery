import { getDb } from "@orrery/core";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

/** Uptime probe (OPS-3): 200 when app + DB are reachable, 503 otherwise. */
export async function GET(): Promise<Response> {
  try {
    const db = await getDb();
    await db.execute(sql`select 1`);
    return Response.json({ ok: true, db: "up", at: new Date().toISOString() });
  } catch (err) {
    return Response.json(
      { ok: false, db: "down", error: String(err), at: new Date().toISOString() },
      { status: 503 },
    );
  }
}
