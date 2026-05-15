import type { Metadata } from "next";
import Link from "next/link";
import { getAbout, getSiteSettings } from "../../lib/sanity/queries";
import { PortableTextBody } from "../../components/ui/PortableText";
import { SanityImage } from "../../components/ui/SanityImage";
import { buildMetadata } from "../../lib/seo/metadata";
import { JsonLd } from "../../components/seo/JsonLd";
import { personJsonLd } from "../../lib/seo/jsonld";

export async function generateMetadata(): Promise<Metadata> {
  const [about, settings] = await Promise.all([
    getAbout().catch(() => null),
    getSiteSettings().catch(() => null),
  ]);
  return buildMetadata({
    title: "About",
    description: settings?.siteDescription ?? "About the artist.",
    path: "/about",
    image: about?.portrait,
    fallbackImage: settings?.defaultOgImage,
    seo: about?.seo,
  });
}

export default async function AboutPage() {
  const [about, settings] = await Promise.all([
    getAbout().catch(() => null),
    getSiteSettings().catch(() => null),
  ]);

  if (!about) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 sm:py-32">
        <h1 className="mb-6 text-3xl tracking-[0.18em] sm:text-4xl sm:tracking-[0.2em]">
          About
        </h1>
        <p className="text-[var(--color-muted)]">
          Tulis perkenalan di{" "}
          <Link href="/studio" className="text-[var(--color-gold)] underline">
            Sanity Studio
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
      <JsonLd data={personJsonLd(settings)} />
      <header className="mb-10 text-center sm:mb-16">
        <p className="mb-2 text-[0.65rem] tracking-[0.35em] uppercase text-[var(--color-gold)] sm:mb-3 sm:text-xs sm:tracking-[0.4em]">
          Perkenalan
        </p>
        <h1 className="text-3xl tracking-[0.15em] sm:text-4xl sm:tracking-[0.2em] md:text-5xl">
          About
        </h1>
      </header>

      {about.portrait?.asset && (
        <div className="vignette mx-auto mb-10 max-w-md overflow-hidden rounded-sm sm:mb-16">
          <SanityImage
            image={about.portrait}
            width={600}
            sizes="(max-width: 768px) 100vw, 600px"
            className="h-auto w-full"
          />
        </div>
      )}

      <div className="mx-auto max-w-2xl text-base leading-relaxed sm:text-lg">
        <PortableTextBody value={about.body} />
      </div>
    </article>
  );
}
