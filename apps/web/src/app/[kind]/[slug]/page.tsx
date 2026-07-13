import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { skyTonight } from "@orrery/core";
import { FollowButton } from "@/components/FollowButton";
import { NewsList } from "@/components/NewsList";
import { sessionUser } from "@/lib/auth";
import { fmtDateTime, fmtTime } from "@/lib/format";
import { effectiveLoc } from "@/lib/location";
import { entityByKindSlug, isFollowing, kindToPath, newsForEntity } from "@/lib/queries";

export const dynamic = "force-dynamic";

/** IA §1: one template serves /object /rocket /pad /agency /mission /telescope (T6). */
const PATH_TO_KIND = {
  object: ["object"],
  rocket: ["vehicle"],
  pad: ["pad"],
  agency: ["agency", "company"],
  mission: ["mission", "spacecraft"],
  telescope: ["telescope", "observatory"],
} as const;

const PLANET_SLUGS = new Set(["mercury", "venus", "mars", "jupiter", "saturn", "uranus", "neptune"]);

async function load(pathKind: string, slug: string) {
  const kinds = PATH_TO_KIND[pathKind as keyof typeof PATH_TO_KIND];
  if (!kinds) return null;
  for (const kind of kinds) {
    const data = await entityByKindSlug(kind, slug);
    if (data) return data;
  }
  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ kind: string; slug: string }>;
}): Promise<Metadata> {
  const { kind: pathKind, slug } = await params;
  const data = await load(pathKind, slug);
  if (!data) return {};
  return {
    title: data.entity.name,
    description: data.entity.summary ?? undefined,
    alternates: { canonical: `/${pathKind}/${slug}` },
    openGraph: { title: data.entity.name, description: data.entity.summary ?? undefined },
  };
}

export default async function EntityPage({
  params,
}: {
  params: Promise<{ kind: string; slug: string }>;
}) {
  const { kind: pathKind, slug } = await params;
  const data = await load(pathKind, slug);
  if (!data) notFound();
  const { entity, facts, edgesOut, edgesIn } = data;
  const news = await newsForEntity(entity.id, 8);
  const user = await sessionUser();
  const following = user ? await isFollowing(user.id, entity.id) : false;

  const loc = await effectiveLoc();
  const sky = PLANET_SLUGS.has(slug) || slug === "moon" || slug === "sun" ? skyTonight(loc.lat, loc.lon) : null;
  const planetNow = sky?.planets.find((p) => p.slug === slug) ?? null;

  const cls = typeof entity.attrs.class === "string" ? entity.attrs.class : entity.kind;

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Orrery", item: "/" },
      { "@type": "ListItem", position: 2, name: entity.name, item: `/${pathKind}/${slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <p className="crumb">
        <Link href="/">Orrery</Link> › {pathKind}s › {entity.name}
      </p>
      <p className="eyebrow">{cls.replace(/-/g, " ")}</p>
      <h1 style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        {entity.name}
        <FollowButton entityId={entity.id} initialFollowing={following} signedIn={Boolean(user)} />
      </h1>
      {entity.summary ? <p className="sub">{entity.summary}</p> : null}

      {facts.length > 0 ? (
        <div className="facts">
          {facts.map((f) => (
            <span
              className="prov"
              key={f.field}
              title={`Source: ${f.sourceName ?? "unknown"} · retrieved ${fmtDateTime(f.retrievedAt, "UTC")} UTC (PRD ENT-4)`}
            >
              {f.field.replace(/_/g, " ")} <b>{String(f.value)}</b>
            </span>
          ))}
        </div>
      ) : null}

      <div className="grid g2">
        {planetNow && sky ? (
          <div className="card">
            <h3>Tonight from {loc.label}</h3>
            <table>
              <tbody className="num">
                <tr><td>Rises</td><td>{fmtTime(planetNow.riseUtc, loc.tz)} · {planetNow.direction}</td></tr>
                <tr><td>Sets</td><td>{fmtTime(planetNow.setUtc, loc.tz)}</td></tr>
                <tr>
                  <td>Right now</td>
                  <td>{planetNow.upNow ? `up · ${planetNow.direction}, alt ${planetNow.altitudeNow.toFixed(0)}°` : "below horizon"}</td>
                </tr>
                <tr><td>Magnitude</td><td>{planetNow.magnitude ?? "—"}</td></tr>
              </tbody>
            </table>
            <p className="note">Live module — recomputed per request (PRD ENT-1).</p>
          </div>
        ) : null}
        {slug === "moon" && sky ? (
          <div className="card">
            <h3>Tonight from {loc.label}</h3>
            <table>
              <tbody className="num">
                <tr><td>Phase</td><td>{sky.moon.phaseName} · {Math.round(sky.moon.illumination * 100)}%</td></tr>
                <tr><td>Rises</td><td>{fmtTime(sky.moon.riseUtc, loc.tz)}</td></tr>
                <tr><td>Sets</td><td>{fmtTime(sky.moon.setUtc, loc.tz)}</td></tr>
              </tbody>
            </table>
          </div>
        ) : null}
        {slug === "sun" && sky ? (
          <div className="card">
            <h3>Today from {loc.label}</h3>
            <table>
              <tbody className="num">
                <tr><td>Sunrise</td><td>{fmtTime(sky.sun.riseUtc, loc.tz)}</td></tr>
                <tr><td>Sunset</td><td>{fmtTime(sky.sun.setUtc, loc.tz)}</td></tr>
                <tr><td>Astronomical dark</td><td>{fmtTime(sky.sun.darkStartUtc, loc.tz)} → {fmtTime(sky.sun.darkEndUtc, loc.tz)}</td></tr>
              </tbody>
            </table>
          </div>
        ) : null}

        {edgesOut.length + edgesIn.length > 0 ? (
          <div className="card">
            <h3>In the graph</h3>
            <div className="chips">
              {edgesOut.map((e) => (
                <Link className="chip" key={`o${e.rel}${e.slug}`} href={`/${kindToPath(e.kind)}/${e.slug}`}>
                  {e.rel.replace(/_/g, " ")} → {e.name}
                </Link>
              ))}
              {edgesIn.map((e) => (
                <Link className="chip" key={`i${e.rel}${e.slug}`} href={`/${kindToPath(e.kind)}/${e.slug}`}>
                  {e.name} → {e.rel.replace(/_/g, " ")}
                </Link>
              ))}
            </div>
            <p className="note">Chips are edges, never hand-written lists (PRD ENT-5).</p>
          </div>
        ) : null}

        {news.length > 0 ? (
          <div className="card">
            <h3>In the news</h3>
            <NewsList items={news} />
            <p className="note">
              Auto-tagged from the news feed via the alias dictionary (PRD NEWS-3).
            </p>
          </div>
        ) : null}
      </div>
    </>
  );
}
