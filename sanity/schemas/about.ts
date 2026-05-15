import { defineField, defineType } from "sanity";

export const about = defineType({
  name: "about",
  title: "About",
  type: "document",
  fields: [
    defineField({
      name: "body",
      title: "Introduction",
      type: "portableText",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "portrait",
      title: "Portrait (optional)",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seoObject",
    }),
  ],
  preview: { prepare: () => ({ title: "About" }) },
});
