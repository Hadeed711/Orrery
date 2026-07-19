"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export type PostCardData = {
  id: string;
  body: string;
  createdAt: string;
  username: string;
  displayName: string | null;
  avatar: string | null;
  likes: number;
  likedByMe: boolean;
  mine: boolean;
  entityName: string | null;
  entitySlug: string | null;
  entityKind: string | null;
};

export function timeAgo(iso: string): string {
  const s = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export function PostCard({ post, signedIn }: { post: PostCardData; signedIn: boolean }) {
  const router = useRouter();
  const [liked, setLiked] = useState(post.likedByMe);
  const [likes, setLikes] = useState(post.likes);
  const [gone, setGone] = useState(false);
  const [busy, setBusy] = useState(false);

  if (gone) return null;

  async function toggleLike() {
    if (!signedIn) {
      router.push("/signin");
      return;
    }
    const next = !liked;
    setLiked(next);
    setLikes((n) => n + (next ? 1 : -1));
    const res = await fetch("/api/v0/posts/like", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ postId: post.id, like: next }),
    });
    if (!res.ok) {
      setLiked(!next);
      setLikes((n) => n + (next ? -1 : 1));
    }
  }

  async function remove() {
    if (busy) return;
    setBusy(true);
    const res = await fetch(`/api/v0/posts?id=${encodeURIComponent(post.id)}`, { method: "DELETE" });
    setBusy(false);
    if (res.ok) setGone(true);
  }

  return (
    <article className="post">
      <span className="post-avatar" aria-hidden="true">{post.avatar ?? "🪐"}</span>
      <div className="post-main">
        <header className="post-head">
          <Link href={`/u/${post.username}`} className="post-author">
            {post.displayName ?? post.username}
          </Link>
          <span className="post-meta">@{post.username} · {timeAgo(post.createdAt)}</span>
        </header>
        <p className="post-body">{post.body}</p>
        {post.entityName && post.entitySlug ? (
          <Link className="chip" href={`/object/${post.entitySlug}`}>
            {post.entityName}
          </Link>
        ) : null}
        <footer className="post-actions">
          <button type="button" className={`link-btn${liked ? " liked" : ""}`} onClick={toggleLike} aria-pressed={liked}>
            {liked ? "♥" : "♡"} {likes > 0 ? likes : ""}
          </button>
          {post.mine ? (
            <button type="button" className="link-btn danger" onClick={remove} disabled={busy}>
              delete
            </button>
          ) : null}
        </footer>
      </div>
    </article>
  );
}
