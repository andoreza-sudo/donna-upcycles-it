import { defineType, defineField } from "sanity";

export default defineType({
  name: "journalPost",
  title: "Journal Post",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (R) => R.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (R) => R.required() }),
    defineField({
      name: "tag", title: "Tag", type: "string",
      options: { list: ["Sewing tips", "New product", "Behind the scenes", "Customer stories"] },
    }),
    defineField({
      name: "coverPhoto", title: "Cover Photo", type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string", title: "Alt text" }],
      validation: (R) => R.required(),
    }),
    defineField({ name: "excerpt", title: "Excerpt", type: "text", validation: (R) => R.max(200) }),
    defineField({
      name: "body", title: "Body", type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "Quote", value: "blockquote" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
            annotations: [
              { name: "link", type: "object", fields: [{ name: "href", type: "url" }] },
            ],
          },
        },
        {
          type: "image", options: { hotspot: true },
          fields: [
            { name: "alt", type: "string", title: "Alt text" },
            { name: "caption", type: "string", title: "Caption" },
          ],
        },
        {
          name: "productRef", title: "Embedded Product", type: "object",
          fields: [
            { name: "product", type: "reference", to: [{ type: "product" }] },
          ],
        },
      ],
    }),
    defineField({ name: "readTime", title: "Read Time (minutes)", type: "number" }),
    defineField({ name: "publishedAt", title: "Published At", type: "datetime", validation: (R) => R.required() }),
    defineField({ name: "featured", title: "Featured (show as big card on journal)", type: "boolean" }),
  ],
  preview: {
    select: { title: "title", tag: "tag" },
    prepare(selection) {
      const { title, tag } = selection as { title: string; tag: string };
      return { title, subtitle: tag };
    },
  },
});
