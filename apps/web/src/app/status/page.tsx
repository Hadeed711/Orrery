import type { Metadata } from "next";
import { fmtDateTime } from "@/lib/format";
import { statusOverview } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Status" };

export default async function StatusPage() {
  const { sources, counts } = await statusOverview();

  return (
    <>
      <p className="eyebrow">Trust · connector freshness (PRD OBS-2)</p>
      <h1>Status</h1>
      <div className="facts" style={{ marginTop: 10 }}>
        <span>Entities <b className="num">{counts.entities}</b></span>
        <span>Launches <b className="num">{counts.launches}</b></span>
        <span>Computed events <b className="num">{counts.events}</b></span>
      </div>

      <div className="card" style={{ marginTop: 22 }}>
        <h3>Sources</h3>
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr><th>Key</th><th>Name</th><th>Tier</th><th>License</th><th>Last success (UTC)</th></tr>
            </thead>
            <tbody>
              {sources.map((s) => (
                <tr key={s.key}>
                  <td className="num">{s.key}</td>
                  <td>{s.name}</td>
                  <td className="num">{s.tier}</td>
                  <td>{s.license ?? "—"}</td>
                  <td className="num">{s.lastSuccessAt ? fmtDateTime(s.lastSuccessAt, "UTC") : "never"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
