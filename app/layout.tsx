import type { Metadata } from "next";
import { Cinzel, EB_Garamond } from "next/font/google";
import "./globals.css";
import { env } from "../lib/env";
import { getSiteSettings } from "../lib/sanity/queries";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { JsonLd } from "../components/seo/JsonLd";
import { websiteJsonLd } from "../lib/seo/jsonld";
import { urlForImage } from "../lib/sanity/client";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-display",
  display: "swap",
});

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-body",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings().catch(() => null);
  const title = settings?.siteTitle ?? "Aethernoir";
  const description =
    settings?.siteDescription ??
    "A dark art portfolio — moody, gothic illustrations and visual works.";
  const ogImageUrl = settings?.defaultOgImage
    ? urlForImage(settings.defaultOgImage).width(1200).height(630).fit("crop").url()
    : undefined;

  return {
    metadataBase: new URL(env.SITE_URL),
    title: { default: title, template: `%s — ${title}` },
    description,
    applicationName: title,
    keywords: settings?.seo?.keywords,
    openGraph: {
      title,
      description,
      siteName: title,
      type: "website",
      url: env.SITE_URL,
      ...(ogImageUrl
        ? { images: [{ url: ogImageUrl, width: 1200, height: 630 }] }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImageUrl ? { images: [ogImageUrl] } : {}),
    },
    robots: { index: true, follow: true },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSiteSettings().catch(() => null);
  return (
    <html
      lang="id"
      className={`${cinzel.variable} ${ebGaramond.variable}`}
    >
      <body className="flex min-h-dvh flex-col">
        <JsonLd data={websiteJsonLd(settings)} />
        <Header siteTitle={settings?.siteTitle ?? "Aethernoir"} />
        <main className="flex-1">{children}</main>
        <Footer settings={settings} />
      </body>
    </html>
  );
}
