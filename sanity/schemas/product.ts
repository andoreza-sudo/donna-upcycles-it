import { defineType, defineField } from "sanity";

export default defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (R) => R.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (R) => R.required() }),
    defineField({ name: "number", title: "Number (e.g. № 14 / spring '26)", type: "string" }),
    defineField({ name: "price", title: "Price (USD)", type: "number", validation: (R) => R.required() }),
    defineField({
      name: "category", title: "Category", type: "string",
      options: { list: ["Jackets", "Jeans", "Totes", "Other"] },
    }),
    defineField({ name: "size", title: "Size", type: "string", validation: (R) => R.required() }),
    defineField({ name: "sizingNote", title: "Sizing Note", type: "string" }),
    defineField({
      name: "photos", title: "Photos", type: "array",
      of: [{ type: "image", options: { hotspot: true }, fields: [{ name: "alt", type: "string", title: "Alt text" }] }],
      validation: (R) => R.required().min(1),
    }),
    defineField({ name: "description", title: "Description", type: "text", validation: (R) => R.required() }),
    defineField({ name: "sourcedFrom", title: "Sourced From", type: "string" }),
    defineField({ name: "fabric", title: "Fabric", type: "string" }),
    defineField({ name: "care", title: "Care Instructions", type: "string" }),
    defineField({
      name: "status", title: "Status", type: "string",
      options: { list: ["available", "sold", "reserved"] },
      initialValue: "available",
    }),
    defineField({ name: "featured", title: "Featured (show in homepage hero)", type: "boolean" }),
    defineField({ name: "publishedAt", title: "Published At", type: "datetime", initialValue: () => new Date().toISOString() }),
  ],
  preview: {
    select: { title: "title", price: "price", status: "status", media: "photos.0" },
    prepare(selection) {
      const { title, price, status } = selection as { title: string; price: number; status: string };
      return { title, subtitle: `$${price} · ${status}` };
    },
  },
});
