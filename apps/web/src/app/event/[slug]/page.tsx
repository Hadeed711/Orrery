import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { localSolarEclipse } from "@orrery/core";
import { fmtDateTime, fmtTime } from "@/lib/format";
import { effectiveLoc } from "@/lib/location";
import { eventBySlug, kindToPath } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await eventBySlug(slug);
  if (!data) return {};
  return {
    title: data.entity.name,
    description: data.entity.summary ?? undefined,
    alternates: { canonical: `/event/${slug}` },
    openGraph: { title: data.entity.name, description: data.entity.summary ?? undefined },
  };
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await eventBySlug(slug);
  if (!data) notFound();
  const { entity, event, related } = data;
  const loc = await effectiveLoc();
  const tz = loc.tz;
  const attrs = Object.entries(entity.attrs).filter(([, v]) => v != null);
  const local =
    event.eventKind === "solar_eclipse" ? localSolarEclipse(event.peakAt, loc.lat, loc.lon) : null;

  // schema.org Event — the SEO payload for calendar pages (IA §3).
  const eventLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: entity.name,
    description: entity.summary ?? undefined,
    startDate: event.peakAt.toISOString(),
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: { "@type": "VirtualLocation", url: `/event/${slug}` },
    organizer: { "@type": "Organization", name: "Orrery", url: "/" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventLd) }} />
      <p className="crumb">
        <Link href="/calendar">Calendar</Link> › {entity.name}
      </p>
      <p className="eyebrow">{event.eventKind.replace(/_/g, " ")}</p>
      <h1>{entity.name}</h1>
      <div className="facts">
        <span className="num">Peak <b>{fmtDateTime(event.peakAt, tz)}</b> ({tz})</span>
        <span className="num">UTC <b>{event.peakAt.toISOString().replace("T", " ").slice(0, 16)}</b></span>
        <span className="tag brass">computed by {event.computedBy}</span>
      </div>
      {entity.summary ? <p className="sub" style={{ marginTop: 14 }}>{entity.summary}</p> : null}

      <div className="grid g2">
        {local ? (
          <div className="card">
            <h3>From {loc.label}</h3>
            {local.visible ? (
              <>
                <p style={{ marginBottom: 10 }}>
                  <b>
                    {local.kind === "total"
                      ? "TOTAL eclipse visible!"
                      : local.kind === "annular"
                        ? "Annular ('ring of fire') eclipse visible"
                        : `Partial eclipse — ${Math.min(99, Math.round((local.obscuration ?? 0) * 100))}% of the Sun covered`}
                  </b>
                </p>
                <table>
                  <tbody className="num">
                    <tr><td>Begins</td><td>{fmtTime(local.partialBeginUtc, tz)}</td></tr>
                    {local.totalityBeginUtc ? (
                      <tr><td>Totality</td><td>{fmtTime(local.totalityBeginUtc, tz)} → {fmtTime(local.totalityEndUtc, tz)}</td></tr>
                    ) : null}
                    <tr><td>Maximum</td><td>{fmtTime(local.peakUtc, tz)} · Sun alt {local.sunAltitudeAtPeak}°</td></tr>
                    <tr><td>Ends</td><td>{fmtTime(local.partialEndUtc, tz)}</td></tr>
                  </tbody>
                </table>
                <p className="note">Computed for your exact location — change it in the header. Never look at the Sun without certified eclipse glasses.</p>
              </>
            ) : (
              <p style={{ color: "var(--dim)" }}>
                Not visible from your location
                {local.reason === "sun-below-horizon" ? " — the Sun is below your horizon during the eclipse." : "."}
                {" "}Pick another city in the header to check elsewhere.
              </p>
            )}
          </div>
        ) : null}
        {attrs.length > 0 ? (
          <div className="card">
            <h3>Details</h3>
            <table>
              <tbody className="num">
                {attrs.map(([k, v]) => (
                  <tr key={k}>
                    <td style={{ fontFamily: "inherit" }}>{k.replace(/([A-Z])/g, " $1").toLowerCase()}</td>
                    <td>{String(v)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
        {related.length > 0 ? (
          <div className="card">
            <h3>Involves</h3>
            <div className="chips">
              {related.map((r) => (
                <Link className="chip" key={r.slug} href={`/${kindToPath(r.kind)}/${r.slug}`}>
                  {r.name}
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>
      {!local ? (
        <p className="note">
          Per-location visibility for this event type arrives as Phase 4 completes.
        </p>
      ) : null}
    </>
  );
}
