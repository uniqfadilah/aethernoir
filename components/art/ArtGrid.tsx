import { ArtCard } from "./ArtCard";
import type { ArtworkCard } from "../../lib/sanity/types";

export function ArtGrid({ artworks }: { artworks: ArtworkCard[] }) {
  if (artworks.length === 0) {
    return (
      <p className="py-24 text-center text-[var(--color-muted)]">
        Belum ada karya yang dipublikasikan.
      </p>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {artworks.map((a) => (
        <ArtCard key={a._id} artwork={a} />
      ))}
    </div>
  );
}
