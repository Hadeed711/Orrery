"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export function SignOutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      className="pill-btn"
      onClick={async () => {
        await authClient.signOut();
        router.push("/");
        router.refresh();
      }}
    >
      Sign out
    </button>
  );
}

export function DeleteAccountButton() {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  if (!confirming) {
    return (
      <button type="button" className="pill-btn danger" onClick={() => setConfirming(true)}>
        Delete account…
      </button>
    );
  }
  return (
    <span className="chips">
      <button
        type="button"
        className="pill-btn danger"
        onClick={async () => {
          const res = await authClient.deleteUser();
          if (res.error) {
            setError(res.error.message ?? "Could not delete account.");
            return;
          }
          router.push("/");
          router.refresh();
        }}
      >
        Yes, permanently delete
      </button>
      <button type="button" className="pill-btn" onClick={() => setConfirming(false)}>
        Cancel
      </button>
      {error ? <span className="form-error">{error}</span> : null}
    </span>
  );
}
