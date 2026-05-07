import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "24tdn6fv",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: true,
  token: process.env.SANITY_API_TOKEN,
});

const builder = imageUrlBuilder(client);

export function urlFor(source: { asset?: { _ref?: string } }) {
  return builder.image(source);
}

export const productFields = `
  _id,
  title,
  slug,
  number,
  price,
  category,
  size,
  sizingNote,
  "photos": photos[]{asset, alt},
  description,
  sourcedFrom,
  fabric,
  care,
  status,
  featured,
  publishedAt
`;

export const journalPostFields = `
  _id,
  title,
  slug,
  tag,
  "coverPhoto": coverPhoto{asset, alt},
  excerpt,
  body,
  readTime,
  publishedAt,
  featured
`;
