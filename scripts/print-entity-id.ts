/** Dev helper: print an entity id by kind+slug (used by verify flows). */
import { sql } from "drizzle-orm";
import { getDb } from "../packages/core/src/db/client";

async function main() {
  const [kind = "object", slug = "saturn"] = process.argv.slice(2);
  const db = await getDb();
  const res = await db.execute(sql`select id from entities where kind = ${kind} and slug = ${slug} limit 1`);
  const rows = (res as unknown as { rows: Array<{ id: string }> }).rows ?? res;
  console.log(rows[0]?.id ?? "");
  process.exit(0);
}
main();
