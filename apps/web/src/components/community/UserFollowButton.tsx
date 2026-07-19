"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

/** Follow a PERSON (entities are favorited, people are followed — Phase 7). */
export function UserFollowButton({
  username,
  initialFollowing,
  signedIn,
}: {
  username: string;
  initialFollowing: boolean;
  signedIn: boolean;
}) {
  const router = useRouter();
  const [following, setFollowing] = useState(initialFollowing);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    if (!signedIn) {
      router.push("/signin");
      return;
    }
    setBusy(true);
    const next = !following;
    const res = await fetch("/api/v0/user-follows", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ username, follow: next }),
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
      className={`pill-btn${following ? " active" : " primary"}`}
      onClick={toggle}
      disabled={busy}
      aria-pressed={following}
    >
      {following ? "Following" : "Follow"}
    </button>
  );
}
