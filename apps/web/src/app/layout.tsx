import type { Metadata } from "next";
import Link from "next/link";
import { Analytics } from "@/components/Analytics";
import { LocationPicker } from "@/components/LocationPicker";
import { PwaRegister } from "@/components/PwaRegister";
import { SiteNav } from "@/components/SiteNav";
import { sessionUser } from "@/lib/auth";
import { unreadCount } from "@/lib/community";
import { effectiveLoc } from "@/lib/location";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL ?? "http://localhost:3000"),
  title: { default: "Orrery — everything space", template: "%s · Orrery" },
  description:
    "Every object, every mission, every telescope, every event — one graph of everything space. Sky calendar, launch tracking, and tonight's sky for your location.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [loc, user] = await Promise.all([effectiveLoc(), sessionUser()]);
  const unread = user ? await unreadCount(user.id) : 0;

  return (
    <html lang="en">
      <body>
        {/* Animated starfield — pure CSS layers, respects prefers-reduced-motion. */}
        <div className="starfield" aria-hidden="true">
          <div className="stars s1" />
          <div className="stars s2" />
          <div className="stars s3" />
        </div>
        <PwaRegister />
        <Analytics />
        <div className="shell">
          <header className="site">
            <Link href="/" className="wordmark" aria-label="Orrery home">
              <span className="orb" aria-hidden="true" />
              orrery
            </Link>
            <SiteNav signedIn={Boolean(user)} unread={unread} />
            <span className="header-spacer" />
            {user ? (
              <Link className="pill-btn" href="/account" title={user.email}>
                {user.name || "Account"}
              </Link>
            ) : (
              <Link className="pill-btn primary" href="/signin">
                Sign in
              </Link>
            )}
            <LocationPicker currentLabel={loc.label} />
          </header>
          <main>{children}</main>
          <footer className="site">
            <div className="foot-cols">
              <div>
                <p className="foot-title">Orrery</p>
                <p>Everything space, one graph.</p>
              </div>
              <div>
                <p className="foot-title">Sky</p>
                <Link href="/">Tonight</Link>
                <Link href="/calendar">Calendar</Link>
                <Link href="/apod">Picture of the Day</Link>
              </div>
              <div>
                <p className="foot-title">Knowledge</p>
                <Link href="/objects">Objects</Link>
                <Link href="/missions">Missions</Link>
                <Link href="/telescopes">Telescopes</Link>
                <Link href="/rockets">Rockets</Link>
              </div>
              <div>
                <p className="foot-title">Directories</p>
                <Link href="/companies">Companies &amp; agencies</Link>
                <Link href="/apps">Apps &amp; sites</Link>
                <Link href="/launches">Launches</Link>
                <Link href="/news">News</Link>
              </div>
              <div>
                <p className="foot-title">People</p>
                <Link href="/community">Community</Link>
                <Link href="/mission-builder">Mission Builder</Link>
                <Link href="/status">Status</Link>
              </div>
            </div>
            <p className="foot-note">
              Sky data computed locally (astronomy-engine) · Launches &amp; news: The Space Devs ·
              Imagery: NASA
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
