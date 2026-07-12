/**
 * Loads the repo-root .env for CLI scripts and the web app (Next only auto-loads
 * the app dir's .env in a monorepo). Never overrides variables already set —
 * so Vercel/CI dashboard env always wins. Safe when no .env exists.
 */
import path from "node:path";

for (const candidate of [
  path.join(process.cwd(), ".env"),
  path.join(process.cwd(), "..", "..", ".env"), // apps/web → repo root
]) {
  try {
    process.loadEnvFile(candidate);
    break;
  } catch {
    // file not found — keep trying / fall through silently
  }
}

export {};
