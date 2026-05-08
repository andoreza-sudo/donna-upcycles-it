import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "24tdn6fv";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = "2024-01-01";

/**
 * Public read-only client. Uses the CDN for fast cached reads. NEVER set
 * a token here — tokens leak via the CDN URL and grant Editor-level
 * access. Use `writeClient` (below) for any authenticated operation.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

/**
 * Authenticated client used only by server-side code paths that need to
 * mutate documents (e.g. marking a product sold from the Stripe webhook).
 * Bypasses the CDN and must never run in the browser.
 */
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
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
