"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * Favorite toggle for graph entities (Phase 7 rework of Phase 6 FOLLOW-1).
 * People are followed; objects/missions/rockets are FAVORITED. Favorites
 * still power the personal feed, launch alerts and the weekly digest — the
 * backend endpoint is unchanged (/api/v0/follows).
 */
export function FavoriteButton({
  entityId,
  initialFavorited,
  signedIn,
  compact = false,
}: {
  entityId: string;
  initialFavorited: boolean;
  signedIn: boolean;
  compact?: boolean;
}) {
  const router = useRouter();
  const [favorited, setFavorited] = useState(initialFavorited);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    if (!signedIn) {
      router.push("/signin");
      return;
    }
    setBusy(true);
    const next = !favorited;
    const res = await fetch("/api/v0/follows", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ entityId, follow: next }),
    });
    setBusy(false);
    if (res.ok) {
      setFavorited(next);
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      className={`pill-btn${favorited ? " active" : ""}`}
      onClick={toggle}
      disabled={busy}
      aria-pressed={favorited}
      title={favorited ? "Remove from favorites" : "Add to favorites — powers your feed and alerts"}
    >
      {compact ? (favorited ? "★" : "☆") : favorited ? "★ Favorited" : "☆ Favorite"}
    </button>
  );
}
