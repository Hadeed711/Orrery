import Link from "next/link";
import { skyTonight } from "@orrery/core";
import { fmtDate, fmtTime, statusTag } from "@/lib/format";
import { effectiveLoc } from "@/lib/location";
import { upcomingEvents, upcomingLaunches } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function TonightPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const loc = await effectiveLoc(await searchParams);
  const sky = skyTonight(loc.lat, loc.lon);
  const [events, nextLaunches] = await Promise.all([upcomingEvents(5), upcomingLaunches(3)]);
  const tz = loc.tz;
  const moonPct = Math.round(sky.moon.illumination * 100);

  return (
    <>
      <p className="eyebrow">
        Tonight · {fmtDate(new Date(), tz)} · {loc.label}
      </p>
      <h1>The sky over {loc.label.split(",")[0]}, computed for right now.</h1>
      <p className="sub">
        Rise and set times are calculated locally with astronomy-engine — no scraping, no cache staleness.
        Pass <span className="num">?lat=&amp;lon=&amp;tz=</span> to move the observer.
      </p>

      <div className="grid gm">
        <div className="card">
          <h3>Planets tonight</h3>
          <div className="tbl-wrap">
            <table>
              <thead>
                <tr><th>Planet</th><th>Rise</th><th>Set</th><th>Now</th><th>Mag</th></tr>
              </thead>
              <tbody className="num">
                {sky.planets.map((p) => (
                  <tr key={p.slug}>
                    <td><Link href={`/object/${p.slug}`}>{p.name}</Link></td>
                    <td>{fmtTime(p.riseUtc, tz)}</td>
                    <td>{fmtTime(p.setUtc, tz)}</td>
                    <td>
                      {p.upNow ? <span className="updot" /> : null}
                      {p.upNow ? `${p.direction} · alt ${p.altitudeNow.toFixed(0)}°` : "below horizon"}
                    </td>
                    <td>{p.magnitude ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ display: "grid", gap: 14 }}>
          <div className="card">
            <h3>Sun &amp; darkness</h3>
            <table>
              <tbody className="num">
                <tr><td>Sunset</td><td>{fmtTime(sky.sun.setUtc, tz)}</td></tr>
                <tr><td>Astronomical dark</td><td>{fmtTime(sky.sun.darkStartUtc, tz)} → {fmtTime(sky.sun.darkEndUtc, tz)}</td></tr>
                <tr><td>Sunrise</td><td>{fmtTime(sky.sun.riseUtc, tz)}</td></tr>
              </tbody>
            </table>
          </div>
          <div className="card">
            <h3>Moon</h3>
            <b>{sky.moon.phaseName} · {moonPct}%</b>
            <div className="num" style={{ color: "var(--dim)", marginTop: 4 }}>
              rises {fmtTime(sky.moon.riseUtc, tz)} · sets {fmtTime(sky.moon.setUtc, tz)}
            </div>
            <p className="note"><Link href="/object/moon">Moon page →</Link></p>
          </div>
        </div>
      </div>

      <h2>Coming up</h2>
      <div className="card">
        {events.map(({ entity, event }) => (
          <div className="evt" key={entity.id}>
            <span className="date">{fmtDate(event.peakAt, tz)}</span>
            <div className="body">
              <span className="title"><Link href={`/event/${entity.slug}`}>{entity.name}</Link></span>
              {entity.summary ? <div className="meta">{entity.summary}</div> : null}
            </div>
            <span className="tag brass">{event.eventKind.replace(/_/g, " ")}</span>
          </div>
        ))}
        {nextLaunches.map(({ entity, launch }) => (
          <div className="evt" key={entity.id}>
            <span className="date">{fmtDate(launch.net, tz)}</span>
            <div className="body">
              <span className="title"><Link href={`/launch/${entity.slug}`}>{entity.name}</Link></span>
              <div className="meta num">NET {fmtTime(launch.net, tz)} local</div>
            </div>
            <span className={`tag ${statusTag(launch.status)}`}>launch · {launch.status}</span>
          </div>
        ))}
        {events.length + nextLaunches.length === 0 ? (
          <p className="note">No data yet — run <span className="num">npm run seed</span> and <span className="num">npm run sync:ll2</span>.</p>
        ) : null}
      </div>
    </>
  );
}
