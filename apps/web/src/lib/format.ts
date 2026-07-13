/** All display times are localized to the effective location's timezone (PRD LOC-4); storage is UTC. */
type DateInput = string | Date | null | undefined;

const toDate = (d: DateInput): Date | null =>
  d == null ? null : typeof d === "string" ? new Date(d) : d;

export function fmtTime(d: DateInput, tz: string): string {
  const date = toDate(d);
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: tz }).format(date);
}

export function fmtDate(d: DateInput, tz: string): string {
  const date = toDate(d);
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: tz }).format(date);
}

export function fmtDateTime(d: DateInput, tz: string): string {
  const date = toDate(d);
  if (!date) return "—";
  return `${fmtDate(date, tz)}, ${fmtTime(date, tz)}`;
}

export function fmtMonth(d: DateInput, tz: string): string {
  const date = toDate(d);
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: tz }).format(date);
}

export function timeAgo(d: DateInput): string {
  const date = toDate(d);
  if (!date) return "—";
  const mins = Math.max(0, Math.round((Date.now() - date.getTime()) / 60_000));
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 14) return `${days}d ago`;
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short" }).format(date);
}

export function statusTag(status: string): "go" | "hold" | "scrub" | "" {
  if (status === "go" || status === "success") return "go";
  if (status === "failure" || status === "partial-failure") return "scrub";
  if (status === "tbd" || status === "tbc" || status === "hold") return "hold";
  return "";
}
