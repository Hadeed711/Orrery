"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function PostComposer({ signedIn }: { signedIn: boolean }) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!signedIn) {
    return (
      <div className="card composer">
        <p className="note">
          <a href="/signin">Sign in</a> to share what you saw in the sky, ask a question, or talk
          launches with other space people.
        </p>
      </div>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy || body.trim().length === 0) return;
    setBusy(true);
    setError(null);
    const res = await fetch("/api/v0/posts", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ body }),
    });
    setBusy(false);
    if (res.ok) {
      setBody("");
      router.refresh();
    } else {
      const data = await res.json().catch(() => null);
      setError(data?.title ?? "Could not post — try again.");
    }
  }

  return (
    <form className="card composer" onSubmit={submit}>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Seen something up there? Share it with the community…"
        maxLength={1000}
        rows={3}
        aria-label="Write a post"
      />
      <div className="composer-row">
        <span className="note">{body.length}/1000</span>
        {error ? <span className="form-error">{error}</span> : null}
        <button type="submit" className="pill-btn primary" disabled={busy || body.trim().length === 0}>
          {busy ? "Posting…" : "Post"}
        </button>
      </div>
    </form>
  );
}
