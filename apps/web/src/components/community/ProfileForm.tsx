"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const AVATARS = ["🪐", "🚀", "🛰️", "🌌", "🌕", "☄️", "🔭", "👩‍🚀", "👨‍🚀", "🌠", "🌍", "🛸"];

export type ProfileFormData = {
  username: string;
  displayName: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  avatar: string | null;
};

/** The profile builder — public identity for /u/<username> (Phase 7). */
export function ProfileForm({ initial }: { initial: ProfileFormData }) {
  const router = useRouter();
  const [form, setForm] = useState({
    username: initial.username,
    displayName: initial.displayName ?? "",
    bio: initial.bio ?? "",
    location: initial.location ?? "",
    website: initial.website ?? "",
    avatar: initial.avatar ?? AVATARS[0]!,
  });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setMsg(null);
    const res = await fetch("/api/v0/profile", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(form),
    });
    setBusy(false);
    if (res.ok) {
      setMsg({ ok: true, text: "Profile saved." });
      router.refresh();
    } else {
      const data = await res.json().catch(() => null);
      setMsg({ ok: false, text: data?.title ?? "Could not save profile." });
    }
  }

  return (
    <form className="auth-form" onSubmit={submit}>
      <div className="avatar-picker" role="radiogroup" aria-label="Avatar">
        {AVATARS.map((a) => (
          <button
            key={a}
            type="button"
            role="radio"
            aria-checked={form.avatar === a}
            className={`avatar-choice${form.avatar === a ? " selected" : ""}`}
            onClick={() => set("avatar", a)}
          >
            {a}
          </button>
        ))}
      </div>
      <label>
        Username (your page: /u/{form.username || "…"})
        <input
          value={form.username}
          onChange={(e) => set("username", e.target.value.toLowerCase())}
          pattern="[a-z0-9_]{3,20}"
          title="3–20 chars: a–z, 0–9, underscore"
          required
        />
      </label>
      <label>
        Display name
        <input value={form.displayName} onChange={(e) => set("displayName", e.target.value)} maxLength={50} />
      </label>
      <label>
        Bio
        <textarea value={form.bio} onChange={(e) => set("bio", e.target.value)} maxLength={280} rows={3} />
      </label>
      <label>
        Location
        <input value={form.location} onChange={(e) => set("location", e.target.value)} maxLength={60} placeholder="Lahore, Pakistan" />
      </label>
      <label>
        Website
        <input value={form.website} onChange={(e) => set("website", e.target.value)} maxLength={200} placeholder="https://…" />
      </label>
      {msg ? <p className={msg.ok ? "form-ok" : "form-error"}>{msg.text}</p> : null}
      <button type="submit" className="pill-btn primary" disabled={busy}>
        {busy ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}
