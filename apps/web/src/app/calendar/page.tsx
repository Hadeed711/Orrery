import Link from "next/link";
import type { Metadata } from "next";
import { fmtDate, fmtMonth, fmtTime, statusTag } from "@/lib/format";
import { DEFAULT_LOC } from "@/lib/location";
import { upcomingEvents, upcomingLaunches } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Sky Calendar" };

interface Item {
  when: Date;
  title: string;
  href: string;
  tag: string;
  tagClass: string;
  meta: string | null;
}

export default async function CalendarPage() {
  const tz = DEFAULT_LOC.tz;
  const [events, launches] = await Promise.all([upcomingEvents(40), upcomingLaunches(20)]);

  const items: Item[] = [
    ...events.map(({ entity, event }) => ({
      when: event.peakAt,
      title: entity.name,
      href: `/event/${entity.slug}`,
      tag: event.eventKind.replace(/_/g, " "),
      tagClass: "brass",
      meta: entity.summary,
    })),
    ...launches.map(({ entity, launch }) => ({
      when: launch.net!,
      title: entity.name,
      href: `/launch/${entity.slug}`,
      tag: `launch · ${launch.status}`,
      tagClass: statusTag(launch.status),
      meta: null,
    })),
  ].sort((a, b) => a.when.getTime() - b.when.getTime());

  const byMonth = new Map<string, Item[]>();
  for (const it of items) {
    const key = fmtMonth(it.when, tz);
    byMonth.set(key, [...(byMonth.get(key) ?? []), it]);
  }

  return (
    <>
      <p className="eyebrow">Unified Sky Calendar</p>
      <h1>Everything above you, in order.</h1>
      <p className="sub">
        Astronomical events are computed from ephemerides; launches sync from Launch Library 2 and
        reschedule themselves. Times shown for {DEFAULT_LOC.label} ({tz}).
      </p>
      <p style={{ marginTop: 14 }}>
        <a className="pill-btn" href="/calendar.ics" style={{ textDecoration: "none" }}>
          ⭳ Subscribe — ICS feed for Google/Apple/Outlook
        </a>
      </p>

      {[...byMonth.entries()].map(([month, monthItems]) => (
        <section key={month}>
          <h2>{month}</h2>
          <div className="card">
            {monthItems.map((it) => (
              <div className="evt" key={it.href + it.when.toISOString()}>
                <span className="date">{fmtDate(it.when, tz)} · {fmtTime(it.when, tz)}</span>
                <div className="body">
                  <span className="title"><Link href={it.href}>{it.title}</Link></span>
                  {it.meta ? <div className="meta">{it.meta}</div> : null}
                </div>
                <span className={`tag ${it.tagClass}`}>{it.tag}</span>
              </div>
            ))}
          </div>
        </section>
      ))}
      {items.length === 0 ? (
        <p className="note">Empty calendar — run <span className="num">npm run seed</span> first.</p>
      ) : null}
    </>
  );
}
