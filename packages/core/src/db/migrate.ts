/** Applies ./drizzle migrations to whichever database the env selects. Run: npm run db:migrate */
import path from "node:path";
import * as schema from "./schema";
import { pgliteDir } from "./client";

const migrationsFolder = path.join(process.cwd(), "drizzle");

async function main() {
  if (process.env.DATABASE_URL) {
    const { Pool } = await import("pg");
    const { drizzle } = await import("drizzle-orm/node-postgres");
    const { migrate } = await import("drizzle-orm/node-postgres/migrator");
    const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 1 });
    await migrate(drizzle(pool, { schema }), { migrationsFolder });
    await pool.end();
    console.log("migrated: postgres (DATABASE_URL)");
  } else {
    const { PGlite } = await import("@electric-sql/pglite");
    const { drizzle } = await import("drizzle-orm/pglite");
    const { migrate } = await import("drizzle-orm/pglite/migrator");
    const lite = new PGlite(pgliteDir());
    await migrate(drizzle(lite, { schema }), { migrationsFolder });
    await lite.close();
    console.log(`migrated: pglite (${pgliteDir()})`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
