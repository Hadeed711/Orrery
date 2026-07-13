import Link from "next/link";
import { timeAgo } from "@/lib/format";
import { kindToPath, type ArticleTag } from "@/lib/queries";

export interface NewsItem {
  id: string;
  url: string;
  title: string;
  excerpt?: string | null;
  publishedAt: Date | string;
  sourceName: string;
  tags?: ArticleTag[];
}

/** Headline list — links go to the outlet (we aggregate, we don't republish). */
export function NewsList({ items, showExcerpt = false }: { items: NewsItem[]; showExcerpt?: boolean }) {
  if (items.length === 0) {
    return <p className="note">No articles ingested yet — run the news sync job.</p>;
  }
  return (
    <div>
      {items.map((a) => (
        <div className="evt" key={a.id}>
          <span className="date" title={String(a.publishedAt)}>{timeAgo(a.publishedAt)}</span>
          <div className="body">
            <div className="title">
              <a href={a.url} rel="noopener noreferrer" target="_blank">{a.title}</a>
            </div>
            <div className="meta">
              {a.sourceName}
              {showExcerpt && a.excerpt ? <> — {a.excerpt}</> : null}
            </div>
            {a.tags && a.tags.length > 0 ? (
              <div className="chips" style={{ marginTop: 6 }}>
                {a.tags.map((t) => (
                  <Link className="chip" key={`${a.id}${t.kind}${t.slug}`} href={`/${kindToPath(t.kind)}/${t.slug}`}>
                    {t.name}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
