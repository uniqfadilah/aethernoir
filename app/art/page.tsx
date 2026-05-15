import type { Metadata } from "next";
import Link from "next/link";
import {
  getAllArtworksWithTags,
  getAllTags,
  getSiteSettings,
} from "../../lib/sanity/queries";
import { ArtGrid } from "../../components/art/ArtGrid";
import { buildMetadata } from "../../lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings().catch(() => null);
  return buildMetadata({
    title: "Art",
    description: "Galeri lengkap karya dark art Aethernoir.",
    path: "/art",
    fallbackImage: settings?.defaultOgImage,
  });
}

type SearchParams = Promise<{ tag?: string }>;

export default async function ArtPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { tag } = await searchParams;
  const [artworks, tags] = await Promise.all([
    getAllArtworksWithTags().catch(() => []),
    getAllTags().catch(() => []),
  ]);

  const filtered = tag
    ? artworks.filter((a) =>
        a.tags?.some((t) => t.slug.current === tag),
      )
    : artworks;

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
      <header className="mb-8 text-center sm:mb-12">
        <p className="mb-2 text-[0.65rem] tracking-[0.35em] uppercase text-[var(--color-gold)] sm:mb-3 sm:text-xs sm:tracking-[0.4em]">
          Galeri
        </p>
        <h1 className="text-3xl tracking-[0.15em] sm:text-4xl sm:tracking-[0.2em] md:text-5xl">
          Art
        </h1>
      </header>

      {tags.length > 0 && (
        <nav className="mb-8 flex flex-wrap items-center justify-center gap-2 sm:mb-12 sm:gap-3">
          <Link
            href="/art"
            className={`border px-3 py-1.5 text-[0.65rem] tracking-[0.2em] uppercase transition sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.25em] ${
              !tag
                ? "border-[var(--color-gold)] text-[var(--color-gold)]"
                : "border-[var(--color-surface-2)] text-[var(--color-muted)] hover:text-[var(--color-gold)]"
            }`}
          >
            All
          </Link>
          {tags.map((t) => {
            const active = tag === t.slug.current;
            return (
              <Link
                key={t._id}
                href={`/art?tag=${t.slug.current}`}
                className={`border px-3 py-1.5 text-[0.65rem] tracking-[0.2em] uppercase transition sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.25em] ${
                  active
                    ? "border-[var(--color-gold)] text-[var(--color-gold)]"
                    : "border-[var(--color-surface-2)] text-[var(--color-muted)] hover:text-[var(--color-gold)]"
                }`}
              >
                {t.name}
              </Link>
            );
          })}
        </nav>
      )}

      <ArtGrid artworks={filtered} />
    </div>
  );
}
