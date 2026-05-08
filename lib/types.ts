/**
 * Shared types for content fetched from Sanity. Keep in sync with the
 * GROQ projections in `lib/sanity.ts` (productFields, journalPostFields).
 */

export type SanityImageRef = {
  asset?: { _ref?: string };
  alt?: string;
};

export type ProductStatus = "available" | "sold" | "reserved";

export type Product = {
  _id: string;
  title?: string;
  slug?: { current?: string };
  number?: string;
  price?: number;
  category?: string;
  size?: string;
  sizingNote?: string;
  photos?: SanityImageRef[];
  description?: string;
  sourcedFrom?: string;
  fabric?: string;
  care?: string;
  status?: ProductStatus;
  featured?: boolean;
  publishedAt?: string;
};

export type JournalPostTag =
  | "Sewing tips"
  | "New product"
  | "Behind the scenes"
  | "Customer stories";

export type JournalPost = {
  _id: string;
  title?: string;
  slug?: { current?: string };
  tag?: JournalPostTag | string;
  coverPhoto?: SanityImageRef;
  excerpt?: string;
  // PortableText body — keep loose; consumers cast where they need to.
  body?: unknown;
  readTime?: number;
  publishedAt?: string;
  featured?: boolean;
};

export type SiteSettings = {
  aboutTitle?: string;
  aboutBody?: string;
  donnaPhoto?: SanityImageRef;
  contactEmail?: string;
  instagramUrl?: string;
  homepageHeroHeadline?: string;
  homepageJournalBannerEnabled?: boolean;
};
