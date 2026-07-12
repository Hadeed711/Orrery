import { upcomingEvents, upcomingLaunches } from "@/lib/queries";

export const dynamic = "force-dynamic";

/**
 * Global ICS feed (PRD CAL-6): subscribe once in Google/Apple/Outlook; launches
 * reschedule themselves on every sync. Per-user filtered token feeds arrive in Phase 6.
 */
const icsDate = (d: Date): string => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

const esc = (s: string): string =>
  s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");

/** RFC 5545 line folding at 74 octets (approximated at chars; ASCII-safe for our content). */
function fold(line: string): string {
  if (line.length <= 74) return line;
  const parts: string[] = [];
  let rest = line;
  while (rest.length > 74) {
    parts.push(rest.slice(0, 74));
    rest = " " + rest.slice(74);
  }
  parts.push(rest);
  return parts.join("\r\n");
}

function vevent(uid: string, start: Date, summary: string, description: string, path: string, host: string): string[] {
  return [
    "BEGIN:VEVENT",
    fold(`UID:${uid}@orrery`),
    `DTSTAMP:${icsDate(new Date())}`,
    `DTSTART:${icsDate(start)}`,
    fold(`SUMMARY:${esc(summary)}`),
    fold(`DESCRIPTION:${esc(description)}`),
    fold(`URL:${host}${path}`),
    "END:VEVENT",
  ];
}

export async function GET(req: Request) {
  const host = new URL(req.url).origin;
  const [events, launches] = await Promise.all([upcomingEvents(100), upcomingLaunches(30)]);

  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Orrery//Sky Calendar v0//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Orrery Sky Calendar",
    "X-WR-CALDESC:Computed astronomical events and launches from Orrery",
  ];

  for (const { entity, event } of events) {
    lines.push(
      ...vevent(entity.slug, event.peakAt, entity.name, entity.summary ?? entity.name, `/event/${entity.slug}`, host),
    );
  }
  for (const { entity, launch } of launches) {
    if (!launch.net) continue;
    lines.push(
      ...vevent(entity.slug, launch.net, `Launch: ${entity.name}`, `Status: ${launch.status}. Times update automatically when the launch slips.`, `/launch/${entity.slug}`, host),
    );
  }

  lines.push("END:VCALENDAR");
  return new Response(lines.join("\r\n") + "\r\n", {
    headers: {
      "content-type": "text/calendar; charset=utf-8",
      "content-disposition": 'inline; filename="orrery.ics"',
      "cache-control": "public, s-maxage=900, stale-while-revalidate=3600",
    },
  });
}
