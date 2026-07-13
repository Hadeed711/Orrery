"use client";
import { useEffect, useState } from "react";

function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const raw = atob((base64 + padding).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

type State = "unsupported" | "unconfigured" | "off" | "on" | "denied" | "busy";

/** Launch-alert opt-in: registers this browser with the push API (ALERT-1). */
export function PushToggle({ vapidKey }: { vapidKey: string | null }) {
  const [state, setState] = useState<State>("busy");

  useEffect(() => {
    if (!vapidKey) return setState("unconfigured");
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return setState("unsupported");
    if (Notification.permission === "denied") return setState("denied");
    navigator.serviceWorker.ready
      .then((reg) => reg.pushManager.getSubscription())
      .then((sub) => setState(sub ? "on" : "off"))
      .catch(() => setState("off"));
  }, [vapidKey]);

  async function enable() {
    setState("busy");
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") return setState(permission === "denied" ? "denied" : "off");
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey!) as BufferSource,
      });
      const res = await fetch("/api/v0/push", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...sub.toJSON(), prefs: { launches: true } }),
      });
      setState(res.ok ? "on" : "off");
    } catch {
      setState("off");
    }
  }

  async function disable() {
    setState("busy");
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await fetch("/api/v0/push", {
          method: "DELETE",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        });
        await sub.unsubscribe();
      }
      setState("off");
    } catch {
      setState("on");
    }
  }

  if (state === "unconfigured") return <p className="note">Push alerts aren’t configured on this deployment yet.</p>;
  if (state === "unsupported") return <p className="note">This browser doesn’t support push notifications.</p>;
  if (state === "denied")
    return <p className="note">Notifications are blocked for this site — allow them in browser settings first.</p>;

  return (
    <button
      type="button"
      className={`pill-btn${state === "on" ? " active" : ""}`}
      disabled={state === "busy"}
      onClick={state === "on" ? disable : enable}
    >
      {state === "busy" ? "…" : state === "on" ? "🔔 Launch alerts on — click to turn off" : "🔕 Enable launch alerts"}
    </button>
  );
}
