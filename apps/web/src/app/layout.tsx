import type { Metadata } from "next";
import Link from "next/link";
import { NightToggle } from "@/components/NightToggle";
import "./globals.css";

/** Applies persisted night mode before first paint (no white flash — PRD DS-2). */
const nightInit = `try{if(localStorage.getItem('orrery-night')==='1')document.documentElement.classList.add('night')}catch(e){}`;

export const metadata: Metadata = {
  title: { default: "Orrery — everything space", template: "%s · Orrery" },
  description:
    "Every object, every mission, every telescope, every event — one graph of everything space. Sky calendar, launch tracking, and tonight's sky for your location.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <script dangerouslySetInnerHTML={{ __html: nightInit }} />
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
              <Link href="/object/saturn">Objects</Link>
              <Link href="/status">Status</Link>
            </nav>
            <span style={{ flex: 1 }} />
            <NightToggle />
          </header>
          <main>{children}</main>
          <footer className="site">
            <span>Orrery walking skeleton — Phase 3</span>
            <span>Sky data computed locally (astronomy-engine) · Launches: Launch Library 2, The Space Devs</span>
          </footer>
        </div>
      </body>
    </html>
  );
}
