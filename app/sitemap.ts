import type { MetadataRoute } from "next";
import { getProducts, getJournalPosts } from "@/lib/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://donnaupcyclesit.com";

  const [products, posts] = await Promise.all([
    getProducts().catch(() => []),
    getJournalPosts().catch(() => []),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl,                   lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${siteUrl}/shop`,         lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
    { url: `${siteUrl}/journal`,      lastModified: new Date(), changeFrequency: "weekly",  priority: 0.7 },
    { url: `${siteUrl}/about`,        lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/contact`,      lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  const productRoutes: MetadataRoute.Sitemap = (products as { slug?: { current?: string }; publishedAt?: string }[])
    .filter((p) => p.slug?.current)
    .map((p) => ({
      url: `${siteUrl}/shop/${p.slug!.current}`,
      lastModified: p.publishedAt ? new Date(p.publishedAt) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  const postRoutes: MetadataRoute.Sitemap = (posts as { slug?: { current?: string }; publishedAt?: string }[])
    .filter((p) => p.slug?.current)
    .map((p) => ({
      url: `${siteUrl}/journal/${p.slug!.current}`,
      lastModified: p.publishedAt ? new Date(p.publishedAt) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  return [...staticRoutes, ...productRoutes, ...postRoutes];
}
