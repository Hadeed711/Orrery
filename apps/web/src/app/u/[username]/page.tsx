import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostCard, type PostCardData } from "@/components/community/PostCard";
import { UserFollowButton } from "@/components/community/UserFollowButton";
import { sessionUser } from "@/lib/auth";
import {
  favoritesForUser,
  followCounts,
  isFollowingUser,
  postsByUser,
  profileByUsername,
} from "@/lib/community";
import { kindToPath } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const row = await profileByUsername(username);
  if (!row) return {};
  const name = row.profile.displayName ?? row.profile.username;
  return { title: `${name} (@${row.profile.username})`, description: row.profile.bio ?? undefined };
}

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const row = await profileByUsername(username);
  if (!row) notFound();
  const { profile } = row;

  const viewer = await sessionUser();
  const isMe = viewer?.id === profile.userId;
  const [counts, posts, favorites, following] = await Promise.all([
    followCounts(profile.userId),
    postsByUser(profile.userId, viewer?.id ?? null),
    favoritesForUser(profile.userId),
    viewer && !isMe ? isFollowingUser(viewer.id, profile.userId) : Promise.resolve(false),
  ]);

  return (
    <>
      <p className="crumb">
        <Link href="/community">Community</Link> › @{profile.username}
      </p>
      <header className="profile-head">
        <span className="profile-avatar" aria-hidden="true">{profile.avatar ?? "🪐"}</span>
        <div className="profile-id">
          <h1>{profile.displayName ?? profile.username}</h1>
          <p className="post-meta">@{profile.username}</p>
          {profile.bio ? <p className="sub">{profile.bio}</p> : null}
          <p className="profile-meta">
            {profile.location ? <span>📍 {profile.location}</span> : null}
            {profile.website ? (
              <a href={profile.website} rel="nofollow noopener noreferrer" target="_blank">
                {profile.website.replace(/^https?:\/\//, "")}
              </a>
            ) : null}
            <span>
              Joined{" "}
              {profile.createdAt.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
            </span>
          </p>
          <p className="profile-meta">
            <b>{counts.followers}</b> follower{counts.followers === 1 ? "" : "s"} ·{" "}
            <b>{counts.following}</b> following · <b>{posts.length}</b> post{posts.length === 1 ? "" : "s"}
          </p>
        </div>
        <div className="profile-actions">
          {isMe ? (
            <Link href="/account" className="pill-btn">Edit profile</Link>
          ) : (
            <>
              <UserFollowButton
                username={profile.username}
                initialFollowing={following}
                signedIn={Boolean(viewer)}
              />
              {viewer ? (
                <Link href={`/messages/${profile.username}`} className="pill-btn">
                  Message
                </Link>
              ) : null}
            </>
          )}
        </div>
      </header>

      <div className="community-cols">
        <section className="post-list" aria-label="Posts">
          <h2>Posts</h2>
          {posts.length === 0 ? (
            <p className="note">Nothing posted yet.</p>
          ) : (
            posts.map((p) => (
              <PostCard
                key={p.id}
                signedIn={Boolean(viewer)}
                post={{ ...p, createdAt: p.createdAt.toISOString() } as PostCardData}
              />
            ))
          )}
        </section>
        <aside>
          <div className="card">
            <h3>Favorites ({favorites.length})</h3>
            {favorites.length === 0 ? (
              <p className="note">No favorite objects yet.</p>
            ) : (
              <div className="chips">
                {favorites.map((f) => (
                  <Link key={f.id} className="chip" href={`/${kindToPath(f.kind)}/${f.slug}`}>
                    {f.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}
