import type { PortableTextBlock } from "@portabletext/react";

export type SanityImage = {
  _type: "image";
  asset: { _ref: string; _type: "reference" };
  alt?: string;
  hotspot?: { x: number; y: number };
  crop?: { top: number; bottom: number; left: number; right: number };
};

export type SeoObject = {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: SanityImage;
  keywords?: string[];
  noIndex?: boolean;
};

export type Tag = {
  _id: string;
  name: string;
  slug: { current: string };
};

export type Artwork = {
  _id: string;
  _updatedAt: string;
  title: string;
  slug: { current: string };
  image: SanityImage;
  caption: PortableTextBlock[];
  tags?: Tag[];
  year?: number;
  medium?: string;
  publishedAt: string;
  seo?: SeoObject;
};

export type ArtworkCard = Pick<
  Artwork,
  "_id" | "title" | "slug" | "image" | "year" | "medium"
>;

export type SiteSettings = {
  siteTitle: string;
  siteDescription: string;
  contactEmail: string;
  artistName?: string;
  socialLinks?: { platform: string; url: string }[];
  defaultOgImage: SanityImage;
  seo?: SeoObject;
};

export type HomeDoc = {
  heroTitle: string;
  heroSubtitle?: string;
  featuredArtworks: ArtworkCard[];
  seo?: SeoObject;
};

export type AboutDoc = {
  body: PortableTextBlock[];
  portrait?: SanityImage;
  seo?: SeoObject;
};
