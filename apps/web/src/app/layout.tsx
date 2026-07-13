import type { Metadata } from "next";
import Link from "next/link";
import { Analytics } from "@/components/Analytics";
import { LocationPicker } from "@/components/LocationPicker";
import { NightToggle } from "@/components/NightToggle";
import { PwaRegister } from "@/components/PwaRegister";
import { sessionUser } from "@/lib/auth";
import { effectiveLoc } from "@/lib/location";
import "./globals.css";

/** Applies persisted night mode before first paint (no white flash — PRD DS-2). */
const nightInit = `try{if(localStorage.getItem('orrery-night')==='1')document.documentElement.classList.add('night')}catch(e){}`;

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL ?? "http://localhost:3000"),
  title: { default: "Orrery — everything space", template: "%s · Orrery" },
  description:
    "Every object, every mission, every telescope, every event — one graph of everything space. Sky calendar, launch tracking, and tonight's sky for your location.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [loc, user] = await Promise.all([effectiveLoc(), sessionUser()]);
  return (
    <html lang="en">
      <body>
        <script dangerouslySetInnerHTML={{ __html: nightInit }} />
        <PwaRegister />
        <Analytics />
        <div className="shell">
          <header className="site">
            <Link href="/" className="wordmark" aria-label="Orrery home">
              <span className="orb" aria-hidden="true" />
              orrery
            </Link>
            <nav aria-label="Primary">
              <Link href="/">Tonight</Link>
              <Link href="/calendar">Calendar</Link>
              <Link href="/launches">Launches</Link>
              <Link href="/news">News</Link>
              <Link href="/objects">Objects</Link>
              <Link href="/missions">Missions</Link>
              <Link href="/telescopes">Telescopes</Link>
              <Link href="/search">Search</Link>
              {user ? <Link href="/feed">Feed</Link> : null}
            </nav>
            <span style={{ flex: 1 }} />
            {user ? (
              <Link className="pill-btn" href="/account" title={user.email}>
                {user.name || "Account"}
              </Link>
            ) : (
              <Link className="pill-btn" href="/signin">
                Sign in
              </Link>
            )}
            <LocationPicker currentLabel={loc.label} />
            <NightToggle />
          </header>
          <main>{children}</main>
          <footer className="site">
            <span>Orrery — everything space, one graph</span>
            <span>
              Sky data computed locally (astronomy-engine) · Launches &amp; news: The Space Devs ·{" "}
              <Link href="/rockets">Rockets</Link> · <Link href="/status">Status</Link>
            </span>
          </footer>
        </div>
      </body>
    </html>
  );
}
