import { defineField, defineType } from "sanity";

export const home = defineType({
  name: "home",
  title: "Home",
  type: "document",
  fields: [
    defineField({
      name: "heroTitle",
      title: "Hero title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "heroSubtitle",
      title: "Hero subtitle",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "featuredArtworks",
      title: "Featured artworks (carousel)",
      type: "array",
      of: [{ type: "reference", to: [{ type: "artwork" }] }],
      validation: (r) => r.min(1).error("Pilih minimal 1 artwork."),
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seoObject",
    }),
  ],
  preview: { prepare: () => ({ title: "Home" }) },
});
