import Link from "next/link";
import { notFound } from "next/navigation";
import { Countdown } from "@/components/Countdown";
import { fmtDateTime, statusTag } from "@/lib/format";
import { DEFAULT_LOC } from "@/lib/location";
import { kindToPath, launchBySlug } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function LaunchPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await launchBySlug(slug);
  if (!data) notFound();
  const { entity, launch, related } = data;
  const tz = DEFAULT_LOC.tz;

  return (
    <>
      <p className="crumb">
        <Link href="/launches">Launch Center</Link> › {entity.name}
      </p>
      <p className="eyebrow">Launch</p>
      <h1>{entity.name}</h1>
      <div className="facts">
        <span className="num">NET <b>{fmtDateTime(launch.net, tz)}</b> ({tz})</span>
        <span className="num">UTC <b>{launch.net ? launch.net.toISOString().replace("T", " ").slice(0, 16) : "—"}</b></span>
        <span className={`tag ${statusTag(launch.status)}`}>{launch.status}</span>
        {launch.net ? (
          <span style={{ fontSize: 18 }}>
            <Countdown targetIso={launch.net.toISOString()} />
          </span>
        ) : null}
      </div>

      {entity.summary ? <p className="sub" style={{ marginTop: 14 }}>{entity.summary}</p> : null}

      <div className="grid g2">
        <div className="card">
          <h3>In the graph</h3>
          <div className="chips">
            {related.map((r) => (
              <Link className="chip" key={r.rel + r.slug} href={`/${kindToPath(r.kind)}/${r.slug}`}>
                {r.rel.replace(/_/g, " ")}: {r.name}
              </Link>
            ))}
            {related.length === 0 ? <span className="note">No edges yet.</span> : null}
          </div>
        </div>
        <div className="card">
          <h3>Schedule history (PRD LNCH-4)</h3>
          <table>
            <tbody className="num">
              {launch.netHistory.map((h, i) => (
                <tr key={i}>
                  <td>{fmtDateTime(h.net, tz)}</td>
                  <td style={{ color: "var(--faint)" }}>recorded {fmtDateTime(h.changedAt, tz)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="note">Every NET slip is kept — trust is a feature.</p>
        </div>
      </div>
    </>
  );
}
