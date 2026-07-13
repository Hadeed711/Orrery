import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { DeleteAccountButton, SignOutButton } from "@/components/AccountActions";
import { FollowButton } from "@/components/FollowButton";
import { PushToggle } from "@/components/PushToggle";
import { sessionUser } from "@/lib/auth";
import { followsForUser, kindToPath } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Account", robots: { index: false } };

export default async function AccountPage() {
  const user = await sessionUser();
  if (!user) redirect("/signin");
  const followed = await followsForUser(user.id);
  const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? null;

  return (
    <>
      <p className="eyebrow">account</p>
      <h1>{user.name || user.email}</h1>
      <p className="sub">{user.email}</p>

      <div className="grid g2">
        <div className="card">
          <h3>Following ({followed.length})</h3>
          {followed.length === 0 ? (
            <p className="note">
              Nothing yet — hit ☆ Follow on any <Link href="/objects">object</Link>,{" "}
              <Link href="/missions">mission</Link>, <Link href="/telescopes">telescope</Link> or{" "}
              <Link href="/rockets">rocket</Link>. Follows power your <Link href="/feed">feed</Link>,
              launch alerts, and the weekly digest.
            </p>
          ) : (
            <div className="chips">
              {followed.map((f) => (
                <span key={f.id} className="chip" style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
                  <Link href={`/${kindToPath(f.kind)}/${f.slug}`}>{f.name}</Link>
                  <FollowButton entityId={f.id} initialFollowing signedIn />
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h3>Notifications</h3>
          <PushToggle vapidKey={vapidKey} />
          <p className="note">
            Launch alerts arrive ~15 minutes before liftoff for launches connected to what you
            follow. The weekly digest email covers your week ahead every Monday.
          </p>
        </div>

        <div className="card">
          <h3>Session</h3>
          <div className="chips">
            <SignOutButton />
            <DeleteAccountButton />
          </div>
          <p className="note">Deleting your account removes your follows and push subscriptions permanently.</p>
        </div>
      </div>
    </>
  );
}
