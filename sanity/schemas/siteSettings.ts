import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({
      name: "siteTitle",
      title: "Site title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "siteDescription",
      title: "Site description",
      type: "text",
      rows: 3,
      validation: (r) => r.required().max(200),
    }),
    defineField({
      name: "contactEmail",
      title: "Contact email (recipient)",
      type: "string",
      description: "Email yang menerima pesan dari form Contact.",
      validation: (r) =>
        r
          .required()
          .email()
          .error("Harus berupa email yang valid."),
    }),
    defineField({
      name: "artistName",
      title: "Artist name",
      type: "string",
      description: "Nama artist, dipakai untuk JSON-LD Person.",
    }),
    defineField({
      name: "socialLinks",
      title: "Social links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "platform", title: "Platform", type: "string" },
            { name: "url", title: "URL", type: "url" },
          ],
          preview: { select: { title: "platform", subtitle: "url" } },
        },
      ],
    }),
    defineField({
      name: "defaultOgImage",
      title: "Default OG image",
      type: "image",
      options: { hotspot: true },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "seo",
      title: "Default SEO",
      type: "seoObject",
    }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});
