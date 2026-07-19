"use client";
import { useMemo, useState } from "react";
import { APP_CATEGORIES, SPACE_APPS, type SpaceApp } from "@/lib/data/spaceApps";

const PLATFORM_LABEL: Record<SpaceApp["platforms"][number], string> = {
  web: "Web",
  ios: "iOS",
  android: "Android",
  windows: "Windows",
  mac: "macOS",
  linux: "Linux",
};

export function AppsDirectory() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<SpaceApp["category"] | "all">("all");

  const groups = useMemo(() => {
    const filtered = SPACE_APPS.filter((a) => {
      if (cat !== "all" && a.category !== cat) return false;
      if (q) {
        const hay = `${a.name} ${a.about}`.toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      return true;
    });
    const byCat = new Map<SpaceApp["category"], SpaceApp[]>();
    for (const a of filtered) {
      const list = byCat.get(a.category) ?? [];
      list.push(a);
      byCat.set(a.category, list);
    }
    return [...byCat.entries()];
  }, [q, cat]);

  const total = groups.reduce((n, [, apps]) => n + apps.length, 0);

  return (
    <>
      <div className="dir-controls">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search apps and sites…"
          aria-label="Search apps"
        />
        <div className="dir-filters" role="group" aria-label="Filter by category">
          <button type="button" className={`pill-btn${cat === "all" ? " active" : ""}`} onClick={() => setCat("all")}>
            All
          </button>
          {(Object.keys(APP_CATEGORIES) as Array<SpaceApp["category"]>).map((c) => (
            <button
              key={c}
              type="button"
              className={`pill-btn${cat === c ? " active" : ""}`}
              onClick={() => setCat(c)}
            >
              {APP_CATEGORIES[c].title}
            </button>
          ))}
        </div>
        <p className="note">{total} pick{total === 1 ? "" : "s"}</p>
      </div>

      {groups.map(([category, apps]) => (
        <section key={category} className="dir-country">
          <h2>{APP_CATEGORIES[category].title}</h2>
          <p className="sub" style={{ marginTop: 0 }}>{APP_CATEGORIES[category].blurb}</p>
          <div className="grid g2">
            {apps.map((a) => (
              <article key={a.name} className="card org-card">
                <header>
                  <h3 className="org-name">
                    <a href={a.url} rel="noopener noreferrer nofollow" target="_blank">
                      {a.name}
                    </a>
                  </h3>
                  <span className="org-type">
                    {a.price === "free" ? "Free" : a.price === "freemium" ? "Free + paid" : "Paid"}
                  </span>
                </header>
                <p className="org-about">{a.about}</p>
                <p className="org-meta">{a.platforms.map((p) => PLATFORM_LABEL[p]).join(" · ")}</p>
              </article>
            ))}
          </div>
        </section>
      ))}
      {total === 0 ? <p className="note">Nothing matches that search.</p> : null}
    </>
  );
}
