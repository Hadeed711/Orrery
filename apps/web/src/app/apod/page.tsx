import type { Metadata } from "next";
import { fetchApod } from "@/lib/nasa";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Astronomy Picture of the Day",
  description:
    "Today's NASA Astronomy Picture of the Day (APOD) with the professional astronomer's explanation, right inside Orrery.",
  alternates: { canonical: "/apod" },
};

export default async function ApodPage() {
  const apod = await fetchApod();

  return (
    <>
      <p className="eyebrow">nasa · daily</p>
      <h1>Astronomy Picture of the Day</h1>
      <p className="sub">
        Each day NASA features a different image of our universe, explained by a professional
        astronomer. Served here via the official NASA APOD API.
      </p>

      {!apod ? (
        <div className="card">
          <p className="note">
            Couldn&apos;t reach the NASA APOD API right now — try again in a few minutes, or visit{" "}
            <a href="https://apod.nasa.gov/apod/" rel="noopener noreferrer" target="_blank">
              apod.nasa.gov
            </a>{" "}
            directly.
          </p>
        </div>
      ) : (
        <article className="apod">
          <h2>{apod.title}</h2>
          <p className="note">
            {apod.date}
            {apod.copyright ? ` · © ${apod.copyright.trim()}` : " · Public domain (NASA)"}
          </p>
          {apod.media_type === "video" ? (
            <p>
              Today&apos;s APOD is a video —{" "}
              <a href={apod.url} rel="noopener noreferrer" target="_blank">
                watch it here
              </a>
              .
            </p>
          ) : (
            <a href={apod.hdurl ?? apod.url} target="_blank" rel="noopener noreferrer">
              <img className="apod-img" src={apod.url} alt={apod.title} />
            </a>
          )}
          <p className="apod-explanation">{apod.explanation}</p>
        </article>
      )}
    </>
  );
}
