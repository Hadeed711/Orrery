import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PostCard, type PostCardData } from "@/components/community/PostCard";
import { NewsList } from "@/components/NewsList";
import { sessionUser } from "@/lib/auth";
import { postsFromFollowedPeople } from "@/lib/community";
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

  const favorites = await followsForUser(user.id);
  const ids = favorites.map((f) => f.id);
  const [news, nextLaunches, nextEvents, peoplePosts, loc] = await Promise.all([
    newsForEntities(ids, 25),
    upcomingLaunchesForEntities(ids, 10),
    upcomingEventsForEntities(ids, 10),
    postsFromFollowedPeople(user.id, 20),
    effectiveLoc(),
  ]);

  const empty = favorites.length === 0 && peoplePosts.length === 0;

  return (
    <>
      <p className="eyebrow">personal</p>
      <h1>Your feed</h1>
      <p className="sub">
        Launches, sky events and news for your {favorites.length} favorite
        {favorites.length === 1 ? "" : "s"}, plus posts from people you follow. Manage favorites in
        your <Link href="/account">account</Link>; find people in the{" "}
        <Link href="/community">community</Link>.
      </p>

      {empty ? (
        <div className="card">
          <p>
            Favorite anything in the graph to build your feed — start with{" "}
            <Link href="/object/saturn">Saturn</Link>, <Link href="/telescope/jwst">JWST</Link> or{" "}
            <Link href="/rocket/falcon-9">Falcon 9</Link> — and follow people in the{" "}
            <Link href="/community">community</Link>.
          </p>
        </div>
      ) : (
        <div className="grid g2">
          {peoplePosts.length > 0 ? (
            <div className="card" style={{ gridColumn: "1 / -1" }}>
              <h3>From people you follow</h3>
              <div className="post-list">
                {peoplePosts.map((p) => (
                  <PostCard
                    key={p.id}
                    signedIn
                    post={{ ...p, createdAt: p.createdAt.toISOString() } as PostCardData}
                  />
                ))}
              </div>
            </div>
          ) : null}

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
            <h3>News about your favorites</h3>
            {news.length > 0 ? (
              <NewsList items={news} />
            ) : (
              <p className="note">No recent articles mention your favorites yet — check back soon.</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
