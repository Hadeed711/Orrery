import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { timeAgo } from "@/components/community/PostCard";
import { sessionUser } from "@/lib/auth";
import { inbox } from "@/lib/community";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Messages", robots: { index: false } };

export default async function MessagesPage() {
  const user = await sessionUser();
  if (!user) redirect("/signin");
  const conversations = await inbox(user.id);

  return (
    <>
      <p className="eyebrow">messages</p>
      <h1>Direct messages</h1>
      <p className="sub">
        Private conversations with people from the <Link href="/community">community</Link>. Open
        anyone&apos;s profile and hit Message to start one.
      </p>

      {conversations.length === 0 ? (
        <p className="note">No conversations yet.</p>
      ) : (
        <div className="inbox">
          {conversations.map((c) => (
            <Link key={c.partnerId} href={`/messages/${c.username}`} className="inbox-row">
              <span className="post-avatar" aria-hidden="true">{c.avatar ?? "🪐"}</span>
              <span className="inbox-main">
                <span className="inbox-name">
                  {c.displayName ?? c.username}
                  <span className="post-meta"> @{c.username} · {timeAgo(c.lastAt.toISOString())}</span>
                </span>
                <span className="inbox-preview">{c.lastBody.slice(0, 90)}</span>
              </span>
              {c.unread > 0 ? <span className="unread-badge">{c.unread}</span> : null}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
