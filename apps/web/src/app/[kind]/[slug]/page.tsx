import Link from "next/link";
import { notFound } from "next/navigation";
import { skyTonight } from "@orrery/core";
import { fmtDateTime, fmtTime } from "@/lib/format";
import { effectiveLoc } from "@/lib/location";
import { entityByKindSlug, kindToPath } from "@/lib/queries";

export const dynamic = "force-dynamic";

/** IA §1: one template serves /object /rocket /pad /agency /mission /telescope (T6). */
const PATH_TO_KIND = {
  object: "object",
  rocket: "vehicle",
  pad: "pad",
  agency: "agency",
  mission: "mission",
  telescope: "telescope",
} as const;

const PLANET_SLUGS = new Set(["mercury", "venus", "mars", "jupiter", "saturn", "uranus", "neptune"]);

export default async function EntityPage({
  params,
}: {
  params: Promise<{ kind: string; slug: string }>;
}) {
  const { kind: pathKind, slug } = await params;
  const kind = PATH_TO_KIND[pathKind as keyof typeof PATH_TO_KIND];
  if (!kind) notFound();

  const data = await entityByKindSlug(kind, slug);
  if (!data) notFound();
  const { entity, facts, edgesOut, edgesIn } = data;

  const loc = await effectiveLoc();
  const sky = PLANET_SLUGS.has(slug) || slug === "moon" || slug === "sun" ? skyTonight(loc.lat, loc.lon) : null;
  const planetNow = sky?.planets.find((p) => p.slug === slug) ?? null;

  const cls = typeof entity.attrs.class === "string" ? entity.attrs.class : kind;

  return (
    <>
      <p className="crumb">
        <Link href="/">Orrery</Link> › {pathKind}s › {entity.name}
      </p>
      <p className="eyebrow">{cls.replace(/-/g, " ")}</p>
      <h1>{entity.name}</h1>
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
      </div>
    </>
  );
}
