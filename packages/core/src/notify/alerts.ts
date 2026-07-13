/** Launch-alert selection logic (Phase 6 ALERT-1) — pure and golden-testable. */

export interface AlertableLaunch {
  entityId: string;
  slug: string;
  name: string;
  status: string;
  net: Date | null;
}

/** Statuses worth waking someone up for (scrubs/holds excluded — net slips instead). */
const ALERTABLE_STATUSES = new Set(["go", "tbc"]);

/**
 * A launch is due for the T-15 alert when its NET falls inside
 * [now − graceMins, now + leadMins]. The grace window absorbs cron jitter;
 * the pushSent ledger guarantees once-only delivery even when runs overlap.
 */
export function dueForLaunchAlert(
  launch: AlertableLaunch,
  now: Date,
  leadMins = 25,
  graceMins = 5,
): boolean {
  if (!launch.net || !ALERTABLE_STATUSES.has(launch.status)) return false;
  const delta = launch.net.getTime() - now.getTime();
  return delta >= -graceMins * 60_000 && delta <= leadMins * 60_000;
}

export function launchAlertKey(launch: AlertableLaunch): string {
  return `launch:${launch.entityId}:t15`;
}

export function launchAlertPayload(launch: AlertableLaunch, now: Date) {
  const mins = launch.net ? Math.max(0, Math.round((launch.net.getTime() - now.getTime()) / 60_000)) : 0;
  return {
    title: mins > 0 ? `🚀 Launch in ~${mins} min: ${launch.name}` : `🚀 Launching now: ${launch.name}`,
    body: `Status ${launch.status.toUpperCase()}${launch.net ? ` · liftoff ${launch.net.toISOString().slice(11, 16)} UTC` : ""}`,
    url: `/launch/${launch.slug}`,
    tag: launchAlertKey(launch),
  };
}
