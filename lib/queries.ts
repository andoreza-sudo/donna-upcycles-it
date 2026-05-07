import { client, productFields, journalPostFields } from "./sanity";

export async function getProducts(category?: string) {
  const filter = category ? `&& category == "${category}"` : "";
  return client.fetch(
    `*[_type == "product" ${filter}] | order(publishedAt desc) { ${productFields} }`
  );
}

export async function getProduct(slug: string) {
  return client.fetch(
    `*[_type == "product" && slug.current == $slug][0] { ${productFields} }`,
    { slug }
  );
}

export async function getFeaturedProducts() {
  return client.fetch(
    `*[_type == "product" && featured == true] | order(publishedAt desc)[0...4] { ${productFields} }`
  );
}

export async function getRelatedProducts(category: string, excludeId: string) {
  return client.fetch(
    `*[_type == "product" && category == $category && _id != $excludeId] | order(publishedAt desc)[0...4] { ${productFields} }`,
    { category, excludeId }
  );
}

export async function getJournalPosts(tag?: string) {
  const filter = tag ? `&& tag == "${tag}"` : "";
  return client.fetch(
    `*[_type == "journalPost" ${filter}] | order(publishedAt desc) { ${journalPostFields} }`
  );
}

export async function getJournalPost(slug: string) {
  return client.fetch(
    `*[_type == "journalPost" && slug.current == $slug][0] { ${journalPostFields} }`,
    { slug }
  );
}

export async function getFeaturedJournalPost() {
  return client.fetch(
    `*[_type == "journalPost" && featured == true] | order(publishedAt desc)[0] { ${journalPostFields} }`
  );
}

export async function getLatestJournalPosts(count = 3) {
  return client.fetch(
    `*[_type == "journalPost"] | order(publishedAt desc)[0...${count}] { ${journalPostFields} }`
  );
}

export async function getSiteSettings() {
  return client.fetch(
    `*[_type == "siteSettings"][0] {
      aboutTitle, aboutBody,
      "donnaPhoto": donnaPhoto{asset, alt},
      contactEmail, instagramUrl,
      homepageHeroHeadline, homepageJournalBannerEnabled
    }`
  );
}
