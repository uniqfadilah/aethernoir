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
    <div className="mx-auto max-w-7xl px-6 py-24">
      <header className="mb-12 text-center">
        <p className="mb-3 text-xs tracking-[0.4em] uppercase text-[var(--color-gold)]">
          Galeri
        </p>
        <h1 className="text-4xl tracking-[0.2em] md:text-5xl">Art</h1>
      </header>

      {tags.length > 0 && (
        <nav className="mb-12 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/art"
            className={`border px-4 py-2 text-xs tracking-[0.25em] uppercase transition ${
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
                className={`border px-4 py-2 text-xs tracking-[0.25em] uppercase transition ${
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
