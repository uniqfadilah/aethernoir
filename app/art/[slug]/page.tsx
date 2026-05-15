import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getArtworkBySlug,
  getArtworkSlugs,
  getRelatedArtworks,
  getSiteSettings,
} from "../../../lib/sanity/queries";
import { SanityImage } from "../../../components/ui/SanityImage";
import { PortableTextBody } from "../../../components/ui/PortableText";
import { RelatedArt } from "../../../components/art/RelatedArt";
import { buildMetadata } from "../../../lib/seo/metadata";
import { JsonLd } from "../../../components/seo/JsonLd";
import { artworkJsonLd } from "../../../lib/seo/jsonld";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const slugs = await getArtworkSlugs().catch(() => []);
  return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const [artwork, settings] = await Promise.all([
    getArtworkBySlug(slug).catch(() => null),
    getSiteSettings().catch(() => null),
  ]);
  if (!artwork) {
    return { title: "Not found" };
  }
  return buildMetadata({
    title: artwork.title,
    description:
      [artwork.year, artwork.medium].filter(Boolean).join(" · ") ||
      `Dark art illustration: ${artwork.title}.`,
    path: `/art/${artwork.slug.current}`,
    image: artwork.image,
    fallbackImage: settings?.defaultOgImage,
    seo: artwork.seo,
    type: "article",
  });
}

export default async function ArtDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const [artwork, settings] = await Promise.all([
    getArtworkBySlug(slug).catch(() => null),
    getSiteSettings().catch(() => null),
  ]);

  if (!artwork) notFound();

  const tagSlugs = (artwork.tags ?? []).map((t) => t.slug.current);
  const related = await getRelatedArtworks(slug, tagSlugs).catch(() => []);

  return (
    <article className="mx-auto max-w-5xl px-6 py-16">
      <JsonLd data={artworkJsonLd(artwork, settings)} />

      <Link
        href="/art"
        className="mb-10 inline-block text-xs tracking-[0.3em] uppercase text-[var(--color-muted)] transition hover:text-[var(--color-gold)]"
      >
        ← Back to gallery
      </Link>

      <div className="vignette mb-12 overflow-hidden bg-[var(--color-surface)]">
        <SanityImage
          image={artwork.image}
          width={1600}
          sizes="(max-width: 1024px) 100vw, 1024px"
          priority
          className="h-auto w-full"
        />
      </div>

      <header className="mb-10 text-center">
        <h1 className="mb-4 text-4xl tracking-[0.2em] md:text-5xl">
          {artwork.title}
        </h1>
        {(artwork.year || artwork.medium) && (
          <p className="text-sm italic tracking-wide text-[var(--color-muted)]">
            {[artwork.year, artwork.medium].filter(Boolean).join(" · ")}
          </p>
        )}
        {artwork.tags && artwork.tags.length > 0 && (
          <ul className="mt-5 flex flex-wrap items-center justify-center gap-2">
            {artwork.tags.map((t) => (
              <li key={t._id}>
                <Link
                  href={`/art?tag=${t.slug.current}`}
                  className="border border-[var(--color-surface-2)] px-3 py-1 text-[0.65rem] tracking-[0.3em] uppercase text-[var(--color-muted)] transition hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]"
                >
                  {t.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </header>

      <div className="mx-auto max-w-2xl text-lg leading-relaxed">
        <PortableTextBody value={artwork.caption} />
      </div>

      <RelatedArt artworks={related} />
    </article>
  );
}
