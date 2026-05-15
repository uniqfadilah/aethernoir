import type { Artwork, SiteSettings } from "../sanity/types";
import { urlForImage } from "../sanity/client";
import { absoluteUrl } from "./metadata";
import type { PortableTextBlock } from "@portabletext/react";

export function websiteJsonLd(settings: SiteSettings | null) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: settings?.siteTitle ?? "Aethernoir",
    description: settings?.siteDescription,
    url: absoluteUrl("/"),
  };
}

export function personJsonLd(settings: SiteSettings | null) {
  if (!settings) return null;
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: settings.artistName ?? settings.siteTitle,
    url: absoluteUrl("/about"),
    sameAs: settings.socialLinks?.map((s) => s.url).filter(Boolean) ?? [],
  };
}

function portableTextToPlainText(blocks?: PortableTextBlock[]): string {
  if (!blocks) return "";
  return blocks
    .map((b) =>
      "children" in b && Array.isArray(b.children)
        ? b.children
            .map((c) => ("text" in c && typeof c.text === "string" ? c.text : ""))
            .join("")
        : "",
    )
    .filter(Boolean)
    .join(" ")
    .trim();
}

export function artworkJsonLd(
  artwork: Artwork,
  settings: SiteSettings | null,
) {
  return {
    "@context": "https://schema.org",
    "@type": "VisualArtwork",
    name: artwork.title,
    image: urlForImage(artwork.image).width(1600).url(),
    url: absoluteUrl(`/art/${artwork.slug.current}`),
    artMedium: artwork.medium,
    dateCreated: artwork.year ? String(artwork.year) : undefined,
    description: portableTextToPlainText(artwork.caption),
    creator: settings
      ? {
          "@type": "Person",
          name: settings.artistName ?? settings.siteTitle,
        }
      : undefined,
  };
}
