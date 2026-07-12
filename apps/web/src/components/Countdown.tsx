"use client";

import { useEffect, useState } from "react";

/** Live T− countdown computed client-side from a static timestamp, so pages stay cacheable (PRD PERF-3). */
export function Countdown({ targetIso }: { targetIso: string }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (now === null) return <span className="num">T− …</span>; // SSR/first paint placeholder

  const target = new Date(targetIso).getTime();
  const diff = target - now;
  const sign = diff >= 0 ? "T−" : "T+";
  const abs = Math.abs(diff);
  const d = Math.floor(abs / 86_400_000);
  const h = String(Math.floor((abs % 86_400_000) / 3_600_000)).padStart(2, "0");
  const m = String(Math.floor((abs % 3_600_000) / 60_000)).padStart(2, "0");
  const s = String(Math.floor((abs % 60_000) / 1000)).padStart(2, "0");

  return (
    <span className="num" suppressHydrationWarning>
      {sign} {d}d {h}:{m}:{s}
    </span>
  );
}
