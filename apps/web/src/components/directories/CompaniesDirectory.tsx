"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ORG_TYPES, SPACE_ORGS, type SpaceOrg } from "@/lib/data/companies";

export function CompaniesDirectory() {
  const [q, setQ] = useState("");
  const [type, setType] = useState<SpaceOrg["type"] | "all">("all");

  const countries = useMemo(() => {
    const filtered = SPACE_ORGS.filter((o) => {
      if (type !== "all" && o.type !== type) return false;
      if (q) {
        const hay = `${o.name} ${o.country} ${o.hq} ${o.about}`.toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      return true;
    });
    const byCountry = new Map<string, SpaceOrg[]>();
    for (const o of filtered) {
      const list = byCountry.get(o.country) ?? [];
      list.push(o);
      byCountry.set(o.country, list);
    }
    return [...byCountry.entries()];
  }, [q, type]);

  const total = countries.reduce((n, [, orgs]) => n + orgs.length, 0);

  return (
    <>
      <div className="dir-controls">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name, country, or focus…"
          aria-label="Search organizations"
        />
        <div className="dir-filters" role="group" aria-label="Filter by type">
          <button
            type="button"
            className={`pill-btn${type === "all" ? " active" : ""}`}
            onClick={() => setType("all")}
          >
            All
          </button>
          {(Object.keys(ORG_TYPES) as Array<SpaceOrg["type"]>).map((t) => (
            <button
              key={t}
              type="button"
              className={`pill-btn${type === t ? " active" : ""}`}
              onClick={() => setType(t)}
            >
              {ORG_TYPES[t]}
            </button>
          ))}
        </div>
        <p className="note">{total} organization{total === 1 ? "" : "s"}</p>
      </div>

      {countries.map(([country, orgs]) => (
        <section key={country} className="dir-country">
          <h2>
            <span aria-hidden="true">{orgs[0]!.flag}</span> {country}
          </h2>
          <div className="grid g2">
            {orgs.map((o) => (
              <article key={o.name} className="card org-card">
                <header>
                  <h3 className="org-name">{o.name}</h3>
                  <span className="org-type">{ORG_TYPES[o.type]}</span>
                </header>
                <p className="org-about">{o.about}</p>
                <p className="org-meta">
                  Founded {o.founded} · {o.hq} ·{" "}
                  <a href={o.website} rel="noopener noreferrer nofollow" target="_blank">
                    website
                  </a>
                  {o.entitySlug ? (
                    <>
                      {" "}· <Link href={`/agency/${o.entitySlug}`}>in the graph →</Link>
                    </>
                  ) : null}
                </p>
              </article>
            ))}
          </div>
        </section>
      ))}
      {total === 0 ? <p className="note">Nothing matches that search.</p> : null}
    </>
  );
}
