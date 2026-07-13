/**
 * Weekly digest composer (Phase 6 DIGEST-1) — pure functions so the email
 * body is golden-testable without a database or network.
 */

export interface DigestLaunch {
  name: string;
  slug: string;
  net: Date | null;
  status: string;
}

export interface DigestEvent {
  name: string;
  slug: string;
  peakAt: Date;
}

export interface DigestArticle {
  title: string;
  url: string;
  sourceName: string;
}

export interface DigestInput {
  userName: string;
  weekKey: string;
  siteUrl: string;
  launches: DigestLaunch[];
  events: DigestEvent[];
  articles: DigestArticle[];
}

/** ISO-8601 week key, e.g. 2026-07-14 → "2026-W29". Used as the send-once ledger key. */
export function isoWeekKey(d: Date): string {
  const date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  // ISO weeks are anchored on Thursday.
  const day = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((date.getTime() - yearStart.getTime()) / 86400_000 + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function fmtUtc(d: Date): string {
  return d.toISOString().slice(0, 16).replace("T", " ") + " UTC";
}

/** Returns null when there is nothing worth sending (no spam weeks). */
export function composeDigest(input: DigestInput): { subject: string; html: string } | null {
  const { launches, events, articles } = input;
  if (launches.length === 0 && events.length === 0 && articles.length === 0) return null;

  const bits: string[] = [];
  if (launches.length > 0) bits.push(`${launches.length} launch${launches.length === 1 ? "" : "es"}`);
  if (events.length > 0) bits.push(`${events.length} sky event${events.length === 1 ? "" : "s"}`);
  const subject = `Your week in space${bits.length > 0 ? `: ${bits.join(", ")}` : ""} (${input.weekKey})`;

  const section = (title: string, rows: string[]): string =>
    rows.length === 0
      ? ""
      : `<h3 style="margin:22px 0 8px;font-size:15px;color:#d9a854">${esc(title)}</h3><ul style="margin:0;padding-left:18px">${rows.join("")}</ul>`;

  const li = (html: string): string => `<li style="margin:6px 0;line-height:1.5">${html}</li>`;
  const a = (href: string, text: string): string =>
    `<a href="${esc(href)}" style="color:#8ab4f8;text-decoration:none">${esc(text)}</a>`;

  const html = `<div style="font-family:system-ui,Segoe UI,sans-serif;max-width:560px;margin:0 auto;padding:24px;background:#070a12;color:#e8e6e1;border-radius:12px">
<p style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#d9a854;margin:0">orrery · weekly digest</p>
<h2 style="margin:8px 0 4px">Hi ${esc(input.userName)} — your week ahead in space</h2>
${section(
    "Launches connected to what you follow",
    launches.map((l) =>
      li(`${a(`${input.siteUrl}/launch/${l.slug}`, l.name)} — ${l.net ? fmtUtc(l.net) : "time TBD"} · ${esc(l.status)}`),
    ),
  )}
${section(
    "Sky events for your follows",
    events.map((e) => li(`${a(`${input.siteUrl}/event/${e.slug}`, e.name)} — peak ${fmtUtc(e.peakAt)}`)),
  )}
${section(
    "News about what you follow",
    articles.map((n) => li(`${a(n.url, n.title)} <span style="color:#8a8f98">· ${esc(n.sourceName)}</span>`)),
  )}
<p style="margin-top:26px;font-size:12px;color:#8a8f98">You get this because you follow things on ${a(input.siteUrl, "Orrery")}. Unfollow everything in ${a(`${input.siteUrl}/account`, "your account")} to stop.</p>
</div>`;

  return { subject, html };
}
