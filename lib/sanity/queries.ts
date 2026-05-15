import { groq } from "next-sanity";
import { sanityClient } from "./client";
import type {
  AboutDoc,
  Artwork,
  ArtworkCard,
  HomeDoc,
  SiteSettings,
  Tag,
} from "./types";

const SANITY_TAG = "sanity";

const imageProjection = `image{..., asset->, "alt": alt}`;

const artworkCardProjection = `
  _id,
  title,
  slug,
  ${imageProjection},
  year,
  medium
`;

export const siteSettingsQuery = groq`*[_type == "siteSettings"][0]{
  siteTitle,
  siteDescription,
  contactEmail,
  artistName,
  socialLinks,
  defaultOgImage{..., asset->},
  seo
}`;

export const homeQuery = groq`*[_type == "home"][0]{
  heroTitle,
  heroSubtitle,
  "featuredArtworks": featuredArtworks[]->{
    ${artworkCardProjection}
  },
  seo
}`;

export const aboutQuery = groq`*[_type == "about"][0]{
  body,
  portrait{..., asset->, "alt": alt},
  seo
}`;

export const allArtworksQuery = groq`*[_type == "artwork"] | order(publishedAt desc){
  ${artworkCardProjection}
}`;

export const allArtworksWithTagsQuery = groq`*[_type == "artwork"] | order(publishedAt desc){
  ${artworkCardProjection},
  "tags": tags[]->{_id, name, slug}
}`;

export const artworksByTagQuery = groq`*[_type == "artwork" && $tagSlug in tags[]->slug.current] | order(publishedAt desc){
  ${artworkCardProjection}
}`;

export const allTagsQuery = groq`*[_type == "tag"] | order(name asc){
  _id, name, slug
}`;

export const artworkSlugsQuery = groq`*[_type == "artwork" && defined(slug.current)]{
  "slug": slug.current,
  "_updatedAt": _updatedAt
}`;

export const artworkBySlugQuery = groq`*[_type == "artwork" && slug.current == $slug][0]{
  _id,
  _updatedAt,
  title,
  slug,
  ${imageProjection},
  caption,
  "tags": tags[]->{_id, name, slug},
  year,
  medium,
  publishedAt,
  seo
}`;

export const relatedArtworksQuery = groq`*[
  _type == "artwork"
  && slug.current != $slug
  && count((tags[]->slug.current)[@ in $tagSlugs]) > 0
] | order(publishedAt desc)[0...8]{
  ${artworkCardProjection}
}`;

export const latestArtworksQuery = groq`*[_type == "artwork" && slug.current != $slug] | order(publishedAt desc)[0...6]{
  ${artworkCardProjection}
}`;

const defaultFetchOpts = {
  next: { tags: [SANITY_TAG], revalidate: 3600 as number | false },
};

export async function getSiteSettings(): Promise<SiteSettings | null> {
  return sanityClient.fetch(siteSettingsQuery, {}, defaultFetchOpts);
}

export async function getHome(): Promise<HomeDoc | null> {
  return sanityClient.fetch(homeQuery, {}, defaultFetchOpts);
}

export async function getAbout(): Promise<AboutDoc | null> {
  return sanityClient.fetch(aboutQuery, {}, defaultFetchOpts);
}

export async function getAllArtworks(): Promise<ArtworkCard[]> {
  return sanityClient.fetch(allArtworksQuery, {}, defaultFetchOpts);
}

export async function getAllArtworksWithTags(): Promise<
  (ArtworkCard & { tags?: Tag[] })[]
> {
  return sanityClient.fetch(allArtworksWithTagsQuery, {}, defaultFetchOpts);
}

export async function getArtworksByTag(tagSlug: string): Promise<ArtworkCard[]> {
  return sanityClient.fetch(artworksByTagQuery, { tagSlug }, defaultFetchOpts);
}

export async function getAllTags(): Promise<Tag[]> {
  return sanityClient.fetch(allTagsQuery, {}, defaultFetchOpts);
}

export async function getArtworkSlugs(): Promise<
  { slug: string; _updatedAt: string }[]
> {
  return sanityClient.fetch(artworkSlugsQuery, {}, defaultFetchOpts);
}

export async function getArtworkBySlug(slug: string): Promise<Artwork | null> {
  return sanityClient.fetch(artworkBySlugQuery, { slug }, defaultFetchOpts);
}

export async function getRelatedArtworks(
  slug: string,
  tagSlugs: string[],
): Promise<ArtworkCard[]> {
  if (tagSlugs.length === 0) {
    return sanityClient.fetch(latestArtworksQuery, { slug }, defaultFetchOpts);
  }
  const related = await sanityClient.fetch<ArtworkCard[]>(
    relatedArtworksQuery,
    { slug, tagSlugs },
    defaultFetchOpts,
  );
  if (related.length > 0) return related;
  return sanityClient.fetch(latestArtworksQuery, { slug }, defaultFetchOpts);
}
