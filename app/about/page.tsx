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
      <div className="mx-auto max-w-3xl px-6 py-32 text-center">
        <h1 className="mb-6 text-4xl tracking-[0.2em]">About</h1>
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
    <article className="mx-auto max-w-4xl px-6 py-24">
      <JsonLd data={personJsonLd(settings)} />
      <header className="mb-16 text-center">
        <p className="mb-3 text-xs tracking-[0.4em] uppercase text-[var(--color-gold)]">
          Perkenalan
        </p>
        <h1 className="text-4xl tracking-[0.2em] md:text-5xl">About</h1>
      </header>

      {about.portrait?.asset && (
        <div className="vignette mx-auto mb-16 max-w-md overflow-hidden rounded-sm">
          <SanityImage
            image={about.portrait}
            width={600}
            sizes="(max-width: 768px) 100vw, 600px"
            className="h-auto w-full"
          />
        </div>
      )}

      <div className="mx-auto max-w-2xl text-lg leading-relaxed">
        <PortableTextBody value={about.body} />
      </div>
    </article>
  );
}
