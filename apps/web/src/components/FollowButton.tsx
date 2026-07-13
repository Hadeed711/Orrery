"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * Follow/unfollow toggle (Phase 6 FOLLOW-1).
 * `signedIn=false` renders a link-out to /signin instead of a dead button.
 */
export function FollowButton({
  entityId,
  initialFollowing,
  signedIn,
}: {
  entityId: string;
  initialFollowing: boolean;
  signedIn: boolean;
}) {
  const router = useRouter();
  const [following, setFollowing] = useState(initialFollowing);
  const [busy, setBusy] = useState(false);

  if (!signedIn) {
    return (
      <button type="button" className="pill-btn" onClick={() => router.push("/signin")}>
        ☆ Follow
      </button>
    );
  }

  async function toggle() {
    setBusy(true);
    const next = !following;
    const res = await fetch("/api/v0/follows", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ entityId, follow: next }),
    });
    setBusy(false);
    if (res.ok) {
      setFollowing(next);
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      className={`pill-btn${following ? " active" : ""}`}
      onClick={toggle}
      disabled={busy}
      aria-pressed={following}
    >
      {following ? "★ Following" : "☆ Follow"}
    </button>
  );
}
