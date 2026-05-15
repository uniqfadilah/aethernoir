import { defineField, defineType } from "sanity";

export const seoObject = defineType({
  name: "seoObject",
  title: "SEO",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "metaTitle",
      title: "Meta title (override)",
      type: "string",
      description: "Override default page title. Keep under 60 characters.",
      validation: (r) => r.max(70),
    }),
    defineField({
      name: "metaDescription",
      title: "Meta description (override)",
      type: "text",
      rows: 3,
      description: "Override default description. 150–160 characters ideal.",
      validation: (r) => r.max(200),
    }),
    defineField({
      name: "ogImage",
      title: "Open Graph image (override)",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "keywords",
      title: "Keywords",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "noIndex",
      title: "Hide from search engines",
      type: "boolean",
      initialValue: false,
    }),
  ],
});
