import path from "node:path";
import type { NextConfig } from "next";

const config: NextConfig = {
  // Workspace packages ship TypeScript source; Next transpiles them in-place (ADR-012).
  transpilePackages: ["@orrery/core", "@orrery/connectors"],
  // Native/WASM drivers must stay external to the bundle.
  serverExternalPackages: ["@electric-sql/pglite", "pg"],
  env: {
    // `next dev`/`build` run with cwd = apps/web; the embedded dev DB lives at the repo root.
    ORRERY_PGLITE_DIR: process.env.DATABASE_URL
      ? ""
      : path.resolve(process.cwd(), "..", "..", ".data", "pglite"),
  },
};

export default config;
