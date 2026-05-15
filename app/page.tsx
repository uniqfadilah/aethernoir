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
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 sm:py-32">
        <h1 className="mb-6 text-3xl tracking-[0.18em] sm:text-4xl sm:tracking-[0.2em]">
          Aethernoir
        </h1>
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

      <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-24 md:py-32">
        <p className="mb-3 text-[0.65rem] tracking-[0.35em] uppercase text-[var(--color-gold)] sm:mb-4 sm:text-xs sm:tracking-[0.4em]">
          Aethernoir
        </p>
        <h1 className="mb-6 text-3xl tracking-[0.15em] sm:mb-8 sm:text-4xl sm:tracking-[0.2em] md:text-6xl">
          {home.heroTitle}
        </h1>
        {home.heroSubtitle && (
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-[var(--color-muted)] sm:text-lg">
            {home.heroSubtitle}
          </p>
        )}
        <div className="mt-8 sm:mt-12">
          <Link
            href="/art"
            className="inline-block border border-[var(--color-gold)]/40 px-6 py-3 text-[0.65rem] tracking-[0.25em] uppercase text-[var(--color-ink)] transition-all duration-500 hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] sm:px-8 sm:py-4 sm:text-xs sm:tracking-[0.3em]"
          >
            Enter the Gallery
          </Link>
        </div>
      </section>
    </>
  );
}
