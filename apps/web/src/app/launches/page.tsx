import Link from "next/link";
import type { Metadata } from "next";
import { fmtDateTime, statusTag } from "@/lib/format";
import { effectiveLoc } from "@/lib/location";
import { upcomingLaunches } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Launch Center" };

export default async function LaunchesPage() {
  const [rows, loc] = await Promise.all([upcomingLaunches(30), effectiveLoc()]);
  const tz = loc.tz;

  return (
    <>
      <p className="eyebrow">Launch Center</p>
      <h1>Every launch, worldwide.</h1>
      <p className="sub">
        Synced from Launch Library 2 (The Space Devs). Times localized to {loc.label}.
        Countdowns, webcasts and alerts arrive in Phase 4.
      </p>

      <div className="card" style={{ marginTop: 22 }}>
        {rows.map(({ entity, launch }) => (
          <div className="evt" key={entity.id}>
            <span className="date">{fmtDateTime(launch.net, tz)}</span>
            <div className="body">
              <span className="title"><Link href={`/launch/${entity.slug}`}>{entity.name}</Link></span>
              {typeof entity.attrs.missionName === "string" && entity.attrs.missionName ? (
                <div className="meta">{entity.attrs.missionName}</div>
              ) : null}
            </div>
            <span className={`tag ${statusTag(launch.status)}`}>{launch.status}</span>
          </div>
        ))}
        {rows.length === 0 ? (
          <p className="note">
            No launches synced yet — run <span className="num">npm run sync:ll2</span> (needs internet).
          </p>
        ) : null}
      </div>
    </>
  );
}
