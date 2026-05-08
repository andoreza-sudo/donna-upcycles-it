import { client, productFields, journalPostFields } from "./sanity";

/**
 * All GROQ queries here use parameter binding ($var) instead of string
 * interpolation to prevent GROQ injection via category/tag/slug values
 * that originate from URL parameters.
 */

export async function getProducts(category?: string) {
  if (category) {
    return client.fetch(
      `*[_type == "product" && category == $category] | order(publishedAt desc) { ${productFields} }`,
      { category },
    );
  }
  return client.fetch(
    `*[_type == "product"] | order(publishedAt desc) { ${productFields} }`,
  );
}

export async function getProduct(slug: string) {
  return client.fetch(
    `*[_type == "product" && slug.current == $slug][0] { ${productFields} }`,
    { slug },
  );
}

export async function getFeaturedProducts() {
  return client.fetch(
    `*[_type == "product" && featured == true] | order(publishedAt desc)[0...4] { ${productFields} }`,
  );
}

export async function getRelatedProducts(category: string, excludeId: string) {
  return client.fetch(
    `*[_type == "product" && category == $category && _id != $excludeId] | order(publishedAt desc)[0...4] { ${productFields} }`,
    { category, excludeId },
  );
}

export async function getJournalPosts(tag?: string) {
  if (tag) {
    return client.fetch(
      `*[_type == "journalPost" && tag == $tag] | order(publishedAt desc) { ${journalPostFields} }`,
      { tag },
    );
  }
  return client.fetch(
    `*[_type == "journalPost"] | order(publishedAt desc) { ${journalPostFields} }`,
  );
}

export async function getJournalPost(slug: string) {
  return client.fetch(
    `*[_type == "journalPost" && slug.current == $slug][0] { ${journalPostFields} }`,
    { slug },
  );
}

export async function getFeaturedJournalPost() {
  return client.fetch(
    `*[_type == "journalPost" && featured == true] | order(publishedAt desc)[0] { ${journalPostFields} }`,
  );
}

export async function getLatestJournalPosts(count = 3) {
  // Clamp + coerce to a safe integer so it's safe to inline in the slice.
  const safe = Math.max(1, Math.min(20, Math.floor(count)));
  return client.fetch(
    `*[_type == "journalPost"] | order(publishedAt desc)[0...${safe}] { ${journalPostFields} }`,
  );
}

export async function getSiteSettings() {
  return client.fetch(
    `*[_type == "siteSettings"][0] {
      aboutTitle, aboutBody,
      "donnaPhoto": donnaPhoto{asset, alt},
      contactEmail, instagramUrl,
      homepageHeroHeadline, homepageJournalBannerEnabled
    }`,
  );
}
