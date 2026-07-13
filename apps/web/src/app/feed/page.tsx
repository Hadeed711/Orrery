import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { NewsList } from "@/components/NewsList";
import { sessionUser } from "@/lib/auth";
import { fmtDateTime } from "@/lib/format";
import { effectiveLoc } from "@/lib/location";
import {
  followsForUser,
  kindToPath,
  newsForEntities,
  upcomingEventsForEntities,
  upcomingLaunchesForEntities,
} from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Your feed", robots: { index: false } };

export default async function FeedPage() {
  const user = await sessionUser();
  if (!user) redirect("/signin");

  const followed = await followsForUser(user.id);
  const ids = followed.map((f) => f.id);
  const [news, nextLaunches, nextEvents, loc] = await Promise.all([
    newsForEntities(ids, 25),
    upcomingLaunchesForEntities(ids, 10),
    upcomingEventsForEntities(ids, 10),
    effectiveLoc(),
  ]);

  return (
    <>
      <p className="eyebrow">personal</p>
      <h1>Your feed</h1>
      <p className="sub">
        Everything connected to the {followed.length} thing{followed.length === 1 ? "" : "s"} you
        follow. Manage follows in your <Link href="/account">account</Link>.
      </p>

      {followed.length === 0 ? (
        <div className="card">
          <p>
            Follow anything in the graph to build your feed — start with{" "}
            <Link href="/object/saturn">Saturn</Link>, <Link href="/telescope/jwst">JWST</Link> or{" "}
            <Link href="/rocket/falcon-9">Falcon 9</Link>.
          </p>
        </div>
      ) : (
        <div className="grid g2">
          {nextLaunches.length > 0 ? (
            <div className="card">
              <h3>Upcoming launches</h3>
              <table>
                <tbody className="num">
                  {nextLaunches.map(({ entity, launch }) => (
                    <tr key={entity.id}>
                      <td>
                        <Link href={`/launch/${entity.slug}`}>{entity.name}</Link>
                      </td>
                      <td>{launch.net ? fmtDateTime(launch.net, loc.tz) : "TBD"}</td>
                      <td>{launch.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}

          {nextEvents.length > 0 ? (
            <div className="card">
              <h3>Upcoming sky events</h3>
              <table>
                <tbody className="num">
                  {nextEvents.map(({ entity, event }) => (
                    <tr key={entity.id}>
                      <td>
                        <Link href={`/event/${entity.slug}`}>{entity.name}</Link>
                      </td>
                      <td>{fmtDateTime(event.peakAt, loc.tz)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}

          <div className="card" style={{ gridColumn: "1 / -1" }}>
            <h3>News about what you follow</h3>
            {news.length > 0 ? (
              <NewsList items={news} />
            ) : (
              <p className="note">No recent articles mention your follows yet — check back soon.</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
