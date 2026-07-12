"use client";

import { useEffect, useState } from "react";

/** Red night-vision mode (PRD DS-2): token remap on <html class="night">, persisted per device. */
export function NightToggle() {
  const [night, setNight] = useState(false);

  useEffect(() => {
    setNight(document.documentElement.classList.contains("night"));
  }, []);

  function toggle() {
    const next = !document.documentElement.classList.contains("night");
    document.documentElement.classList.toggle("night", next);
    try {
      localStorage.setItem("orrery-night", next ? "1" : "0");
    } catch {
      // storage unavailable (private mode) — the toggle still works for this page view
    }
    setNight(next);
  }

  return (
    <button type="button" className="pill-btn" aria-pressed={night} onClick={toggle}>
      {night ? "☀ Day mode" : "☾ Night mode"}
    </button>
  );
}
