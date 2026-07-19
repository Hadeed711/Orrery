import { nasaImagePageUrl, nasaImageSearch } from "@/lib/nasa";

/**
 * Server component: real NASA imagery for an entity, from the keyless
 * NASA Image & Video Library, cached for a day. Renders nothing on failure.
 */
export async function EntityGallery({ query, title }: { query: string; title?: string }) {
  const images = await nasaImageSearch(query, 8);
  if (images.length === 0) return null;
  return (
    <div className="card gallery-card">
      <h3>{title ?? "From the NASA archive"}</h3>
      <div className="gallery">
        {images.map((img) => (
          <a
            key={img.nasaId}
            href={nasaImagePageUrl(img.nasaId)}
            target="_blank"
            rel="noopener noreferrer"
            className="gallery-item"
            title={img.title}
          >
            {/* External NASA CDN images — plain img with lazy loading. */}
            <img src={img.thumb} alt={img.title} loading="lazy" />
            <span className="gallery-caption">{img.title}</span>
          </a>
        ))}
      </div>
      <p className="note">NASA Image &amp; Video Library — opens full resolution on images.nasa.gov.</p>
    </div>
  );
}
