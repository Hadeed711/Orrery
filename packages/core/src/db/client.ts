/**
 * Dual-driver DB client (ADR-004 + boring-start, Master Plan section 8.1):
 *  - DATABASE_URL set   -> real Postgres (Neon or any) via node-postgres
 *  - DATABASE_URL unset -> embedded PGlite in ./.data/pglite (zero-install dev)
 * Lazy singleton so `next build` never opens a database.
 */
import fs from "node:fs";
import path from "node:path";
import { drizzle as drizzleNodePg, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { drizzle as drizzlePglite } from "drizzle-orm/pglite";
import * as schema from "./schema";

export type Db = NodePgDatabase<typeof schema>;

let dbPromise: Promise<Db> | null = null;

export function pgliteDir(): string {
  const dir =
    process.env.ORRERY_PGLITE_DIR && process.env.ORRERY_PGLITE_DIR.length > 0
      ? process.env.ORRERY_PGLITE_DIR
      : path.join(process.cwd(), ".data", "pglite");
  fs.mkdirSync(dir, { recursive: true }); // PGlite does not create parent dirs itself
  return dir;
}

async function connect(): Promise<Db> {
  const url = process.env.DATABASE_URL;
  if (url) {
    const { Pool } = await import("pg");
    const pool = new Pool({ connectionString: url, max: 5 });
    return drizzleNodePg(pool, { schema });
  }
  const { PGlite } = await import("@electric-sql/pglite");
  const lite = new PGlite(pgliteDir());
  // PGlite's drizzle instance is API-compatible with the node-postgres one for our usage.
  return drizzlePglite(lite, { schema }) as unknown as Db;
}

export function getDb(): Promise<Db> {
  dbPromise ??= connect();
  return dbPromise;
}

export { schema };
