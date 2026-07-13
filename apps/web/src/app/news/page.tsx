import type { Metadata } from "next";
import { NewsList } from "@/components/NewsList";
import { latestNews } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Space news",
  description:
    "Today's space news from ~50 quality outlets, deduplicated and tagged with the missions, telescopes, and worlds each story is about.",
};

export default async function NewsPage() {
  const items = await latestNews(40);
  return (
    <>
      <p className="eyebrow">News</p>
      <h1>Space news</h1>
      <p className="sub">
        Headlines from across the space press, deduplicated and tagged with the graph — click a chip
        to see everything about that mission, telescope, or world.
      </p>
      <div className="card" style={{ marginTop: 22 }}>
        <NewsList items={items} showExcerpt />
      </div>
      <p className="note">
        Headlines link to the original outlet. Aggregated via Spaceflight News API (The Space Devs).
      </p>
    </>
  );
}
