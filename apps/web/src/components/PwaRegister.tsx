"use client";
import { useEffect } from "react";

/** Registers the service worker once per page load (PWA-1). */
export function PwaRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        /* PWA is progressive — a failed registration must never break the page */
      });
    }
  }, []);
  return null;
}
