"use client";
import { useCallback, useEffect, useRef, useState } from "react";

type Msg = { id: string; senderId: string; body: string; createdAt: string };
type ThreadData = {
  partner: { username: string; displayName: string | null; avatar: string | null };
  me: string;
  messages: Msg[];
};

/** Live DM thread — polls every 6s while visible; sending is optimistic-free (server truth). */
export function MessageThread({ username }: { username: string }) {
  const [data, setData] = useState<ThreadData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const firstLoad = useRef(true);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/v0/messages?with=${encodeURIComponent(username)}`);
      if (!res.ok) {
        setError(res.status === 401 ? "Sign in to read messages." : "Could not load this conversation.");
        return;
      }
      const next = (await res.json()) as ThreadData;
      setError(null);
      setData((prev) => {
        const changed = !prev || prev.messages.length !== next.messages.length;
        if (changed || firstLoad.current) {
          firstLoad.current = false;
          queueMicrotask(() => bottomRef.current?.scrollIntoView({ block: "end" }));
        }
        return next;
      });
    } catch {
      setError("Network error — retrying…");
    }
  }, [username]);

  useEffect(() => {
    load();
    const t = setInterval(() => {
      if (document.visibilityState === "visible") load();
    }, 6000);
    return () => clearInterval(t);
  }, [load]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (busy || body.trim().length === 0) return;
    setBusy(true);
    const res = await fetch("/api/v0/messages", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ to: username, body }),
    });
    setBusy(false);
    if (res.ok) {
      setBody("");
      await load();
    } else {
      const d = await res.json().catch(() => null);
      setError(d?.title ?? "Could not send.");
    }
  }

  if (error && !data) return <p className="form-error">{error}</p>;
  if (!data) return <p className="note">Opening conversation…</p>;

  return (
    <div className="dm-thread">
      <div className="dm-scroll">
        {data.messages.length === 0 ? (
          <p className="note">No messages yet — say hello 👋</p>
        ) : (
          data.messages.map((m) => (
            <div key={m.id} className={`dm-msg${m.senderId === data.me ? " own" : ""}`}>
              <p>{m.body}</p>
              <time>
                {new Date(m.createdAt).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
              </time>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
      {error ? <p className="form-error">{error}</p> : null}
      <form className="dm-compose" onSubmit={send}>
        <input
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={`Message @${username}…`}
          maxLength={2000}
          aria-label="Message"
        />
        <button type="submit" className="pill-btn primary" disabled={busy || body.trim().length === 0}>
          Send
        </button>
      </form>
    </div>
  );
}
