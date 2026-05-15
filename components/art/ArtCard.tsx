import Link from "next/link";
import { SanityImage } from "../ui/SanityImage";
import type { ArtworkCard as ArtworkCardT } from "../../lib/sanity/types";

export function ArtCard({ artwork }: { artwork: ArtworkCardT }) {
  return (
    <Link
      href={`/art/${artwork.slug.current}`}
      className="group block overflow-hidden bg-[var(--color-surface)]"
    >
      <div className="vignette relative aspect-[4/5] overflow-hidden">
        <SanityImage
          image={artwork.image}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-all duration-[1200ms] ease-out group-hover:scale-[1.04]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--color-bg)]/80 via-transparent to-transparent opacity-90 transition-opacity duration-700 group-hover:opacity-70" />
      </div>
      <div className="p-5">
        <h3 className="mb-1 text-base tracking-[0.18em] transition-colors duration-500 group-hover:text-[var(--color-gold)]">
          {artwork.title}
        </h3>
        {(artwork.year || artwork.medium) && (
          <p className="text-xs italic tracking-wide text-[var(--color-muted)]">
            {[artwork.year, artwork.medium].filter(Boolean).join(" · ")}
          </p>
        )}
      </div>
    </Link>
  );
}
