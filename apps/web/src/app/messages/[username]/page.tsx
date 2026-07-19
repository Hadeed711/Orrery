import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { MessageThread } from "@/components/community/MessageThread";
import { sessionUser } from "@/lib/auth";
import { profileByUsername } from "@/lib/community";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Conversation", robots: { index: false } };

export default async function ThreadPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const user = await sessionUser();
  if (!user) redirect("/signin");
  const partner = await profileByUsername(username);
  if (!partner || partner.profile.userId === user.id) notFound();

  return (
    <>
      <p className="crumb">
        <Link href="/messages">Messages</Link> › @{partner.profile.username}
      </p>
      <header className="profile-head compact">
        <span className="post-avatar" aria-hidden="true">{partner.profile.avatar ?? "🪐"}</span>
        <div>
          <h1 style={{ fontSize: 24 }}>
            <Link href={`/u/${partner.profile.username}`}>
              {partner.profile.displayName ?? partner.profile.username}
            </Link>
          </h1>
          <p className="post-meta">@{partner.profile.username}</p>
        </div>
      </header>
      <MessageThread username={partner.profile.username} />
    </>
  );
}
