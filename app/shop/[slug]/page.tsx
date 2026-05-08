import type { Metadata } from "next";
import { getProduct } from "@/lib/queries";
import { safeJsonLd } from "@/lib/escape";
import { ProductPageClient } from "./ProductPageClient";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug).catch(() => null);
  if (!product) return { title: "Product not found" };

  const title = product.title as string;
  const description =
    (product.description as string | undefined)?.slice(0, 155) ||
    `${title} — a one-of-one upcycled denim piece by Donna in Portland, OR. $${product.price}.`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} · $${product.price} — Donna Upcycles It`,
      description,
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug).catch(() => null);

  /* JSON-LD Product schema */
  const jsonLd = product
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.title,
        description: product.description,
        brand: { "@type": "Brand", name: "Donna Upcycles It" },
        offers: {
          "@type": "Offer",
          price: product.price,
          priceCurrency: "USD",
          availability:
            product.status === "available"
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
          seller: { "@type": "Organization", name: "Donna Upcycles It" },
          itemCondition: "https://schema.org/UsedCondition",
        },
        additionalProperty: [
          product.size && { "@type": "PropertyValue", name: "Size", value: product.size },
          product.category && { "@type": "PropertyValue", name: "Category", value: product.category },
          product.fabric && { "@type": "PropertyValue", name: "Fabric", value: product.fabric },
          product.sourcedFrom && { "@type": "PropertyValue", name: "Sourced from", value: product.sourcedFrom },
        ].filter(Boolean),
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
        />
      )}
      <ProductPageClient initialProduct={product} slug={slug} />
    </>
  );
}
