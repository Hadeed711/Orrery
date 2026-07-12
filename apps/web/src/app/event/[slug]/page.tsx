import Link from "next/link";
import { notFound } from "next/navigation";
import { fmtDateTime } from "@/lib/format";
import { DEFAULT_LOC } from "@/lib/location";
import { eventBySlug, kindToPath } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await eventBySlug(slug);
  if (!data) notFound();
  const { entity, event, related } = data;
  const tz = DEFAULT_LOC.tz;
  const attrs = Object.entries(entity.attrs).filter(([, v]) => v != null);

  return (
    <>
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
      <p className="note">
        Per-location circumstances (visibility, contact times, obscuration for your city) arrive with the Phase 4 calendar.
      </p>
    </>
  );
}
