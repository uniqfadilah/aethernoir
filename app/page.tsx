import type { Metadata } from "next";
import Link from "next/link";
import { getHome, getSiteSettings } from "../lib/sanity/queries";
import { Carousel } from "../components/art/Carousel";
import { buildMetadata } from "../lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const [home, settings] = await Promise.all([
    getHome().catch(() => null),
    getSiteSettings().catch(() => null),
  ]);
  return buildMetadata({
    title: home?.heroTitle ?? settings?.siteTitle ?? "Aethernoir",
    description:
      home?.heroSubtitle ??
      settings?.siteDescription ??
      "A dark art portfolio — moody, gothic illustrations and visual works.",
    path: "/",
    fallbackImage: settings?.defaultOgImage,
    seo: home?.seo,
  });
}

export default async function HomePage() {
  const home = await getHome().catch(() => null);

  if (!home) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-32 text-center">
        <h1 className="mb-6 text-4xl tracking-[0.2em]">Aethernoir</h1>
        <p className="text-[var(--color-muted)]">
          Atur konten Home di{" "}
          <Link href="/studio" className="text-[var(--color-gold)] underline">
            Sanity Studio
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <>
      <Carousel artworks={home.featuredArtworks ?? []} />

      <section className="mx-auto max-w-4xl px-6 py-32 text-center">
        <p className="mb-4 text-xs tracking-[0.4em] uppercase text-[var(--color-gold)]">
          Aethernoir
        </p>
        <h1 className="mb-8 text-4xl tracking-[0.2em] md:text-6xl">
          {home.heroTitle}
        </h1>
        {home.heroSubtitle && (
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-[var(--color-muted)]">
            {home.heroSubtitle}
          </p>
        )}
        <div className="mt-12">
          <Link
            href="/art"
            className="inline-block border border-[var(--color-gold)]/40 px-8 py-4 text-xs tracking-[0.3em] uppercase text-[var(--color-ink)] transition-all duration-500 hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]"
          >
            Enter the Gallery
          </Link>
        </div>
      </section>
    </>
  );
}
