import { getAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

/** better-auth mounts all its endpoints under /api/auth/* (sign-in, callbacks, session…). */
async function handler(req: Request): Promise<Response> {
  const auth = await getAuth();
  return auth.handler(req);
}

export const GET = handler;
export const POST = handler;
