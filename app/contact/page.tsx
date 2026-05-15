import type { Metadata } from "next";
import { getSiteSettings } from "../../lib/sanity/queries";
import { ContactForm } from "../../components/contact/ContactForm";
import { buildMetadata } from "../../lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings().catch(() => null);
  return buildMetadata({
    title: "Contact",
    description: "Hubungi Aethernoir — diskusi karya, komisi, atau kerja sama.",
    path: "/contact",
    fallbackImage: settings?.defaultOgImage,
  });
}

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-24">
      <header className="mb-12 text-center">
        <p className="mb-3 text-xs tracking-[0.4em] uppercase text-[var(--color-gold)]">
          Hubungi
        </p>
        <h1 className="mb-6 text-4xl tracking-[0.2em] md:text-5xl">Contact</h1>
        <p className="text-[var(--color-muted)]">
          Untuk inquiry komisi, pameran, atau sekadar menyapa.
        </p>
      </header>
      <ContactForm />
    </div>
  );
}
