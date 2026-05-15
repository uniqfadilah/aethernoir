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
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24">
      <header className="mb-8 text-center sm:mb-12">
        <p className="mb-2 text-[0.65rem] tracking-[0.35em] uppercase text-[var(--color-gold)] sm:mb-3 sm:text-xs sm:tracking-[0.4em]">
          Hubungi
        </p>
        <h1 className="mb-4 text-3xl tracking-[0.15em] sm:mb-6 sm:text-4xl sm:tracking-[0.2em] md:text-5xl">
          Contact
        </h1>
        <p className="text-sm text-[var(--color-muted)] sm:text-base">
          Untuk inquiry komisi, pameran, atau sekadar menyapa.
        </p>
      </header>
      <ContactForm />
    </div>
  );
}
