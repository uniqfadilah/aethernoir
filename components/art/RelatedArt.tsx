import { ArtCard } from "./ArtCard";
import type { ArtworkCard } from "../../lib/sanity/types";

export function RelatedArt({ artworks }: { artworks: ArtworkCard[] }) {
  if (artworks.length === 0) return null;
  return (
    <section className="mt-24 border-t border-[var(--color-surface-2)]/60 pt-16">
      <header className="mb-10 text-center">
        <p className="mb-2 text-xs tracking-[0.4em] uppercase text-[var(--color-gold)]">
          Karya Terkait
        </p>
        <h2 className="text-3xl tracking-[0.18em]">More Illustrations</h2>
      </header>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {artworks.map((a) => (
          <ArtCard key={a._id} artwork={a} />
        ))}
      </div>
    </section>
  );
}
