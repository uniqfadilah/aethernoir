import { ArtCard } from "./ArtCard";
import type { ArtworkCard } from "../../lib/sanity/types";

export function RelatedArt({ artworks }: { artworks: ArtworkCard[] }) {
  if (artworks.length === 0) return null;
  return (
    <section className="mt-16 border-t border-[var(--color-surface-2)]/60 pt-10 sm:mt-24 sm:pt-16">
      <header className="mb-8 text-center sm:mb-10">
        <p className="mb-2 text-[0.65rem] tracking-[0.35em] uppercase text-[var(--color-gold)] sm:text-xs sm:tracking-[0.4em]">
          Karya Terkait
        </p>
        <h2 className="text-2xl tracking-[0.14em] sm:text-3xl sm:tracking-[0.18em]">
          More Illustrations
        </h2>
      </header>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {artworks.map((a) => (
          <ArtCard key={a._id} artwork={a} />
        ))}
      </div>
    </section>
  );
}
