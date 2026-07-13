/** Browser-side auth client — same-origin, so no baseURL needed. */
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();
