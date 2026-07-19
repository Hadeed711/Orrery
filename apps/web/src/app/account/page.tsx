import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { DeleteAccountButton, SignOutButton } from "@/components/AccountActions";
import { FavoriteButton } from "@/components/FavoriteButton";
import { ProfileForm } from "@/components/community/ProfileForm";
import { PushToggle } from "@/components/PushToggle";
import { sessionUser } from "@/lib/auth";
import { ensureProfile } from "@/lib/community";
import { followsForUser } from "@/lib/queries";
import { kindToPath } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Account", robots: { index: false } };

export default async function AccountPage() {
  const user = await sessionUser();
  if (!user) redirect("/signin");
  const [favorites, profile] = await Promise.all([
    followsForUser(user.id),
    ensureProfile(user.id, user.email),
  ]);
  const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? null;

  return (
    <>
      <p className="eyebrow">account</p>
      <h1>{profile.displayName ?? user.name ?? user.email}</h1>
      <p className="sub">
        {user.email} · public page: <Link href={`/u/${profile.username}`}>/u/{profile.username}</Link>
      </p>

      <div className="grid g2">
        <div className="card">
          <h3>Your profile</h3>
          <p className="note">
            This is your public identity in the <Link href="/community">community</Link> — what
            people see when you post, follow, or message.
          </p>
          <ProfileForm
            initial={{
              username: profile.username,
              displayName: profile.displayName,
              bio: profile.bio,
              location: profile.location,
              website: profile.website,
              avatar: profile.avatar,
            }}
          />
        </div>

        <div>
          <div className="card">
            <h3>Favorites ({favorites.length})</h3>
            {favorites.length === 0 ? (
              <p className="note">
                Nothing yet — hit ☆ Favorite on any <Link href="/objects">object</Link>,{" "}
                <Link href="/missions">mission</Link>, <Link href="/telescopes">telescope</Link> or{" "}
                <Link href="/rockets">rocket</Link>. Favorites power your <Link href="/feed">feed</Link>,
                launch alerts, and the weekly digest.
              </p>
            ) : (
              <div className="chips">
                {favorites.map((f) => (
                  <span key={f.id} className="chip" style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
                    <Link href={`/${kindToPath(f.kind)}/${f.slug}`}>{f.name}</Link>
                    <FavoriteButton entityId={f.id} initialFavorited signedIn compact />
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="card" style={{ marginTop: 14 }}>
            <h3>Notifications</h3>
            <PushToggle vapidKey={vapidKey} />
            <p className="note">
              Launch alerts arrive ~15 minutes before liftoff for launches connected to your
              favorites. The weekly digest email covers your week ahead every Monday.
            </p>
          </div>

          <div className="card" style={{ marginTop: 14 }}>
            <h3>Session</h3>
            <div className="chips">
              <SignOutButton />
              <DeleteAccountButton />
            </div>
            <p className="note">
              Deleting your account permanently removes your profile, posts, messages, favorites and
              push subscriptions.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
