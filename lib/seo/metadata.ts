import type { Metadata } from "next";
import { env } from "../env";
import type { SanityImage, SeoObject } from "../sanity/types";
import { urlForImage } from "../sanity/client";

export function absoluteUrl(path = "/"): string {
  const base = env.SITE_URL.replace(/\/$/, "");
  return path.startsWith("/") ? `${base}${path}` : `${base}/${path}`;
}

type BuildMetadataInput = {
  title: string;
  description: string;
  path: string;
  image?: SanityImage | null;
  fallbackImage?: SanityImage | null;
  seo?: SeoObject | null;
  type?: "website" | "article";
};

export function buildMetadata({
  title,
  description,
  path,
  image,
  fallbackImage,
  seo,
  type = "website",
}: BuildMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const finalTitle = seo?.metaTitle?.trim() || title;
  const finalDescription = seo?.metaDescription?.trim() || description;
  const ogSource = seo?.ogImage ?? image ?? fallbackImage ?? undefined;
  const ogImageUrl = ogSource
    ? urlForImage(ogSource).width(1200).height(630).fit("crop").url()
    : undefined;
  const noIndex = seo?.noIndex ?? false;

  return {
    title: finalTitle,
    description: finalDescription,
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    keywords: seo?.keywords,
    openGraph: {
      title: finalTitle,
      description: finalDescription,
      url,
      siteName: "Aethernoir",
      type,
      ...(ogImageUrl
        ? {
            images: [
              { url: ogImageUrl, width: 1200, height: 630, alt: finalTitle },
            ],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: finalTitle,
      description: finalDescription,
      ...(ogImageUrl ? { images: [ogImageUrl] } : {}),
    },
  };
}
