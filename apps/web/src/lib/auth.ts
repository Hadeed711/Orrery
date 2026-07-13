/**
 * better-auth server instance (Phase 6 AUTH-1).
 * Lazy async singleton because getDb() is async (dual PGlite/Postgres driver).
 * - Email + password works with ZERO external keys.
 * - Google OAuth switches on automatically when GOOGLE_CLIENT_ID/SECRET are set.
 * - AUTH_SECRET is required in production (dev falls back like JOB_SECRET does).
 */
import { getDb } from "@orrery/core";
import { account, session, user, verification } from "@orrery/core/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { headers } from "next/headers";

async function build() {
  const db = await getDb();
  const google =
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        }
      : {};
  return betterAuth({
    baseURL: process.env.SITE_URL ?? "http://localhost:3000",
    secret:
      process.env.AUTH_SECRET ??
      (process.env.NODE_ENV === "production" ? undefined : "orrery-dev-secret-not-for-prod"),
    database: drizzleAdapter(db, {
      provider: "pg",
      schema: { user, session, account, verification },
    }),
    emailAndPassword: { enabled: true },
    socialProviders: google,
    user: { deleteUser: { enabled: true } },
    // Cookie cache: skip the session DB round-trip on most page renders.
    session: { cookieCache: { enabled: true, maxAge: 5 * 60 } },
  });
}

export type Auth = Awaited<ReturnType<typeof build>>;

let authPromise: Promise<Auth> | null = null;

export function getAuth(): Promise<Auth> {
  authPromise ??= build();
  return authPromise;
}

export function googleEnabled(): boolean {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}

export type SessionUser = { id: string; name: string; email: string };

/** Current user for server components/routes, or null when signed out. */
export async function sessionUser(): Promise<SessionUser | null> {
  const auth = await getAuth();
  const s = await auth.api.getSession({ headers: await headers() });
  if (!s?.user) return null;
  return { id: s.user.id, name: s.user.name, email: s.user.email };
}
