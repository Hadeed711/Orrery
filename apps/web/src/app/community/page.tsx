import type { Metadata } from "next";
import Link from "next/link";
import { PostCard, type PostCardData } from "@/components/community/PostCard";
import { PostComposer } from "@/components/community/PostComposer";
import { sessionUser } from "@/lib/auth";
import { communityStats, ensureProfile, latestPosts } from "@/lib/community";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Community",
  description:
    "The Orrery community — space people posting observations, launch talk, and astrophotography notes. Follow people, favorite objects.",
};

export default async function CommunityPage() {
  const user = await sessionUser();
  const me = user ? await ensureProfile(user.id, user.email) : null;
  const [items, stats] = await Promise.all([latestPosts(user?.id ?? null), communityStats()]);

  return (
    <>
      <p className="eyebrow">community</p>
      <h1>Mission control for space people</h1>
      <p className="sub">
        Post what you saw, ask questions, follow other observers. {stats.members} member
        {stats.members === 1 ? "" : "s"} · {stats.posts} post{stats.posts === 1 ? "" : "s"}.
        {me ? (
          <>
            {" "}You are <Link href={`/u/${me.username}`}>@{me.username}</Link> — polish your{" "}
            <Link href="/account">profile</Link>.
          </>
        ) : null}
      </p>

      <div className="community-cols">
        <div>
          <PostComposer signedIn={Boolean(user)} />
          <section className="post-list" aria-label="Latest posts">
            {items.length === 0 ? (
              <p className="note">No posts yet — be the first voice in mission control.</p>
            ) : (
              items.map((p) => (
                <PostCard
                  key={p.id}
                  signedIn={Boolean(user)}
                  post={{ ...p, createdAt: p.createdAt.toISOString() } as PostCardData}
                />
              ))
            )}
          </section>
        </div>
        <aside>
          <div className="card">
            <h3>How it works</h3>
            <p className="note">
              <b>People are followed, objects are favorited.</b> Follow a person to see their posts
              in your <Link href="/feed">feed</Link>; hit ★ Favorite on{" "}
              <Link href="/objects">Saturn, JWST, a rocket</Link> to get its launches, sky events and
              news there too. Open any profile to send a direct <Link href="/messages">message</Link>.
            </p>
          </div>
          <div className="card">
            <h3>House rules</h3>
            <p className="note">
              Be kind, stay on the cosmos. No spam, no harassment. Accounts that break this are removed.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
