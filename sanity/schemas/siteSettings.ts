import { defineType, defineField } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({ name: "aboutTitle", title: "About Page Title", type: "string" }),
    defineField({ name: "aboutBody", title: "About Page Body", type: "text" }),
    defineField({
      name: "donnaPhoto", title: "Donna's Profile Photo", type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string", title: "Alt text" }],
    }),
    defineField({ name: "contactEmail", title: "Contact Email", type: "string" }),
    defineField({ name: "instagramUrl", title: "Instagram URL", type: "url" }),
    defineField({ name: "homepageHeroHeadline", title: "Homepage Hero Headline", type: "string" }),
    defineField({ name: "homepageJournalBannerEnabled", title: "Show Journal Banner on Homepage", type: "boolean", initialValue: true }),
  ],
  preview: {
    prepare() {
      return { title: "Site Settings" };
    },
  },
});
