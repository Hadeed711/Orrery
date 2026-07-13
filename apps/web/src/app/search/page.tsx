import type { Metadata } from "next";
import Link from "next/link";
import { NewsList } from "@/components/NewsList";
import { kindToPath, searchArticles, searchEntities } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Search",
  description: "Search every object, mission, telescope, rocket, event, and news story in the Orrery graph.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const [hits, news] = query
    ? await Promise.all([searchEntities(query), searchArticles(query)])
    : [[], []];

  return (
    <>
      <p className="eyebrow">Search</p>
      <h1>Search the graph</h1>
      <form action="/search" method="get" role="search" style={{ marginTop: 18 }}>
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Try: Europa, JWST, M31, Falcon 9, meteor shower…"
          aria-label="Search query"
          autoFocus
          style={{
            width: "100%", maxWidth: 560, padding: "10px 14px", font: "inherit",
            background: "var(--panel)", color: "var(--ink)",
            border: "1px solid var(--line)", borderRadius: 10,
          }}
        />
      </form>

      {query ? (
        <div className="grid gm">
          <div className="card">
            <h3>{hits.length ? `Pages (${hits.length})` : "No pages found"}</h3>
            {hits.map((h) => (
              <div className="evt" key={`${h.kind}${h.slug}`}>
                <span className="date">{h.kind}</span>
                <div className="body">
                  <div className="title">
                    <Link href={`/${kindToPath(h.kind)}/${h.slug}`}>{h.name}</Link>
                  </div>
                  {h.summary ? <div className="meta">{h.summary}</div> : null}
                </div>
              </div>
            ))}
          </div>
          <div className="card">
            <h3>{news.length ? "In the news" : "No matching news"}</h3>
            <NewsList items={news} />
          </div>
        </div>
      ) : (
        <p className="note">
          Postgres full-text search over {""}
          <Link href="/objects">objects</Link>, <Link href="/missions">missions</Link>,{" "}
          <Link href="/telescopes">telescopes</Link>, <Link href="/rockets">rockets</Link>, events,
          launches, and news — with alias support (M31, HST, Webb…).
        </p>
      )}
    </>
  );
}
