import Link from "next/link";
import { entitiesForKinds, kindToPath } from "@/lib/queries";

type Kind = Parameters<typeof entitiesForKinds>[0][number];

function label(cls: string): string {
  const words = cls.replace(/-/g, " ");
  const plural = words.endsWith("y")
    ? `${words.slice(0, -1)}ies`
    : words.endsWith("nebula")
      ? `${words}e`
      : words.endsWith("s")
        ? words
        : `${words}s`;
  return plural.replace(/^./, (c) => c.toUpperCase());
}

/** Catalog browse page: everything of the given kinds, grouped by attrs.class. */
export async function KindIndex({
  kinds,
  eyebrow,
  title,
  intro,
  groupOrder = [],
}: {
  kinds: Kind[];
  eyebrow: string;
  title: string;
  intro: string;
  /** Classes to pin first, in order; the rest follow by group size. */
  groupOrder?: string[];
}) {
  const rows = await entitiesForKinds(kinds);
  const groups = new Map<string, typeof rows>();
  for (const r of rows) {
    const cls = typeof r.attrs.class === "string" ? r.attrs.class : r.kind;
    const list = groups.get(cls) ?? [];
    list.push(r);
    groups.set(cls, list);
  }
  const ordered = [...groups.entries()].sort((a, b) => {
    const ia = groupOrder.indexOf(a[0]);
    const ib = groupOrder.indexOf(b[0]);
    if (ia !== -1 || ib !== -1) return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    return b[1].length - a[1].length;
  });

  return (
    <>
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="sub">{intro}</p>
      {ordered.map(([cls, list]) => (
        <section key={cls}>
          <h2>
            {label(cls)} <span className="note" style={{ display: "inline" }}>({list.length})</span>
          </h2>
          <div className="chips">
            {list.map((e) => (
              <Link
                className="chip"
                key={`${e.kind}${e.slug}`}
                href={`/${kindToPath(e.kind)}/${e.slug}`}
                title={e.summary ?? undefined}
              >
                {e.name}
              </Link>
            ))}
          </div>
        </section>
      ))}
      <p className="note">
        {rows.length} pages, every one a node in the graph — provenance-tracked facts, edges, and a
        live news feed.
      </p>
    </>
  );
}
