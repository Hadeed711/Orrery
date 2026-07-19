"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/**
 * Primary navigation (Phase 7): NASA-style top bar with an Explore dropdown,
 * community links, and a slide-down panel on mobile. Pure CSS + a little
 * state — no nav library.
 */

const EXPLORE: Array<[string, string, string]> = [
  ["/objects", "Objects", "Planets, moons, deep sky"],
  ["/missions", "Missions", "Voyager to Artemis"],
  ["/telescopes", "Telescopes", "JWST, Hubble, observatories"],
  ["/rockets", "Rockets", "Launch vehicles"],
  ["/companies", "Companies & agencies", "The world's space organizations"],
  ["/apps", "Apps & sites", "The best space tools"],
  ["/apod", "Picture of the Day", "NASA APOD, daily"],
  ["/mission-builder", "Mission Builder", "Design your own satellite"],
];

export function SiteNav({
  signedIn,
  unread,
}: {
  signedIn: boolean;
  unread: number;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const detailsRef = useRef<HTMLDetailsElement>(null);

  // Close menus on navigation.
  useEffect(() => {
    setOpen(false);
    if (detailsRef.current) detailsRef.current.open = false;
  }, [pathname]);

  const links = (
    <>
      <Link href="/">Tonight</Link>
      <Link href="/calendar">Calendar</Link>
      <Link href="/launches">Launches</Link>
      <Link href="/news">News</Link>
      <Link href="/community">Community</Link>
      <details className="nav-explore" ref={detailsRef}>
        <summary>Explore ▾</summary>
        <div className="nav-panel">
          {EXPLORE.map(([href, label, sub]) => (
            <Link key={href} href={href} className="nav-panel-item">
              <span>{label}</span>
              <small>{sub}</small>
            </Link>
          ))}
        </div>
      </details>
      <Link href="/search">Search</Link>
      {signedIn ? (
        <>
          <Link href="/feed">Feed</Link>
          <Link href="/messages" className="nav-msgs">
            Messages{unread > 0 ? <span className="unread-badge">{unread > 9 ? "9+" : unread}</span> : null}
          </Link>
        </>
      ) : null}
    </>
  );

  return (
    <>
      <button
        type="button"
        className="nav-burger"
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
      >
        <span aria-hidden="true">{open ? "✕" : "☰"}</span>
      </button>
      <nav aria-label="Primary" className={`site-nav${open ? " open" : ""}`}>
        {links}
      </nav>
    </>
  );
}
