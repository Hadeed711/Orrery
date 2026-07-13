"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

/** Email+password sign-in / sign-up with optional Google button (AUTH-1). */
export function AuthForm({ googleEnabled }: { googleEnabled: boolean }) {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    const name = String(form.get("name") ?? "");
    const res =
      mode === "signup"
        ? await authClient.signUp.email({ email, password, name: name || (email.split("@")[0] ?? email) })
        : await authClient.signIn.email({ email, password });
    setBusy(false);
    if (res.error) {
      setError(res.error.message ?? "Something went wrong — try again.");
      return;
    }
    router.push("/feed");
    router.refresh();
  }

  return (
    <div className="card auth-card">
      <div className="chips" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={mode === "signin"}
          className={`pill-btn${mode === "signin" ? " active" : ""}`}
          onClick={() => setMode("signin")}
        >
          Sign in
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "signup"}
          className={`pill-btn${mode === "signup" ? " active" : ""}`}
          onClick={() => setMode("signup")}
        >
          Create account
        </button>
      </div>

      <form onSubmit={submit} className="auth-form">
        {mode === "signup" ? (
          <label>
            Name
            <input name="name" type="text" autoComplete="name" placeholder="Stargazer" />
          </label>
        ) : null}
        <label>
          Email
          <input name="email" type="email" required autoComplete="email" placeholder="you@example.com" />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            placeholder="at least 8 characters"
          />
        </label>
        {error ? <p className="form-error" role="alert">{error}</p> : null}
        <button className="pill-btn primary" type="submit" disabled={busy}>
          {busy ? "…" : mode === "signup" ? "Create account" : "Sign in"}
        </button>
      </form>

      {googleEnabled ? (
        <>
          <p className="note" style={{ textAlign: "center" }}>or</p>
          <button
            type="button"
            className="pill-btn"
            style={{ width: "100%", justifyContent: "center" }}
            onClick={() => authClient.signIn.social({ provider: "google", callbackURL: "/feed" })}
          >
            Continue with Google
          </button>
        </>
      ) : null}
    </div>
  );
}
