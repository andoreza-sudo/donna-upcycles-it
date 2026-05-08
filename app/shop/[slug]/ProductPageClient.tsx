"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ArrowIcon } from "@/components/ButterflyIcon";
import { getRelatedProducts } from "@/lib/queries";

const THUMB_IMAGES = [
  "https://picsum.photos/seed/pdetail-front/800/1000",
  "https://picsum.photos/seed/pdetail-back/800/1000",
  "https://picsum.photos/seed/pdetail-detail/800/1000",
  "https://picsum.photos/seed/pdetail-model/800/1000",
];

const RELATED_IMAGES = [
  "https://picsum.photos/seed/rel1/600/750",
  "https://picsum.photos/seed/rel2/600/750",
  "https://picsum.photos/seed/rel3/600/750",
  "https://picsum.photos/seed/rel4/600/750",
];

type Product = {
  _id: string;
  title?: string;
  slug?: { current?: string };
  number?: string;
  price?: number;
  category?: string;
  size?: string;
  sizingNote?: string;
  photos?: Array<{ asset?: { _ref?: string }; alt?: string }>;
  description?: string;
  sourcedFrom?: string;
  fabric?: string;
  care?: string;
  status?: string;
  featured?: boolean;
};

export function ProductPageClient({ initialProduct, slug }: { initialProduct: Product | null; slug: string }) {
  const [related, setRelated] = useState<Product[]>([]);
  const [thumb, setThumb] = useState(0);
  const [adding, setAdding] = useState(false);

  const product = initialProduct;

  useEffect(() => {
    if (product?._id && product?.category) {
      getRelatedProducts(product.category, product._id).then(setRelated);
    }
  }, [product?._id, product?.category]);

  if (!product) {
    return (
      <div style={{ background: "#fffaf0", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: "var(--font-hand)", fontSize: 28, color: "#5a5236" }}>product not found ✿</div>
      </div>
    );
  }

  async function handleBuy() {
    setAdding(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      alert("Something went wrong. Please try again.");
    }
    setAdding(false);
  }

  const isSold = product.status === "sold" || product.status === "reserved";

  return (
    <div style={{ background: "#fffaf0", color: "#1a1a1a", fontFamily: "var(--font-sans)", minHeight: "100vh" }}>
      <Nav />

      {/* BREADCRUMB */}
      <div className="px-4 md:px-14 py-4 md:py-5 flex gap-2 text-xs tracking-[1.5px] uppercase" style={{ color: "#5a5236" }}>
        <Link href="/shop" style={{ color: "#5a5236", textDecoration: "none" }}>Shop</Link>
        <span>/</span>
        <span>{product.category}</span>
        <span>/</span>
        <span style={{ color: "#3b5b85" }}>{product.title}</span>
      </div>

      {/* MAIN GRID */}
      <div className="layout-product-detail px-4 md:px-14 pb-10 md:pb-14">

        {/* GALLERY */}
        <div className="layout-gallery">
          <div className="layout-gallery-thumbs flex-col gap-3">
            {[0, 1, 2, 3].map((i) => (
              <button
                key={i}
                onClick={() => setThumb(i)}
                aria-label={`Show ${["front", "back", "detail", "model"][i]} view`}
                aria-pressed={thumb === i}
                style={{
                  width: 100, borderRadius: 12, overflow: "hidden",
                  border: `2px solid ${thumb === i ? "#3b5b85" : "#1a1a1a"}`,
                  cursor: "pointer", position: "relative", background: "none", padding: 0,
                  boxShadow: thumb === i ? `0 0 0 3px #7a9bc1` : "none",
                }}
              >
                <img src={THUMB_IMAGES[i]} alt={`view ${i + 1}`} style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", display: "block" }} />
                <div style={{ position: "absolute", bottom: 4, left: 4, right: 4, fontFamily: "var(--font-hand)", fontSize: 12, background: "rgba(255,250,240,.9)", textAlign: "center", borderRadius: 4, padding: "0 4px" }}>
                  {["front", "back", "detail", "model"][i]}
                </div>
              </button>
            ))}
          </div>
          <div className="layout-gallery-main" style={{ borderRadius: 24, overflow: "hidden", border: "2px solid #1a1a1a", position: "relative", transform: "rotate(-0.5deg)" }}>
            <img src={THUMB_IMAGES[thumb]} alt={product.title} style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover", display: "block" }} />
            <div style={{ position: "absolute", top: 16, right: 16, width: 76, height: 76, borderRadius: "50%", background: "#ee7c5a", color: "#fffaf0", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-hand)", fontSize: 22, lineHeight: 1.05, textAlign: "center", transform: "rotate(12deg)", border: "2px solid #1a1a1a", zIndex: 2 }}>
              just<br />in!
            </div>
            <div style={{ position: "absolute", bottom: 16, left: 16, background: "#fffaf0", color: "#1a1a1a", padding: "6px 12px", borderRadius: 9999, fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", border: "1.5px solid #1a1a1a", fontWeight: 600 }}>
              1 of 1 ✿
            </div>
          </div>
        </div>

        {/* INFO */}
        <div className="flex flex-col gap-4 md:gap-[18px]">
          <div style={{ fontFamily: "var(--font-hand)", fontSize: 22, color: "#ee7c5a" }}>{product.number}</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(2rem, 6vw, 3.5rem)", lineHeight: 0.96, letterSpacing: "-0.02em", margin: 0 }}>
            {product.title}
          </h1>
          <div className="flex items-baseline gap-3 mt-1">
            <span style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem, 4vw, 2.25rem)" }}>${product.price}</span>
            <span style={{ background: "#7a9bc1", color: "#1a1a1a", padding: "4px 12px", borderRadius: 9999, fontSize: 12, letterSpacing: 1.2, textTransform: "uppercase", fontWeight: 600 }}>One of one</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, borderTop: "1.5px dashed #c9b890", borderBottom: "1.5px dashed #c9b890", padding: "16px 0", fontSize: 13 }}>
            {product.sourcedFrom && (
              <div className="flex flex-col gap-1">
                <span style={{ fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: "#5a5236" }}>Sourced</span>
                <span style={{ color: "#2a2418" }}>{product.sourcedFrom}</span>
              </div>
            )}
            {product.sizingNote && (
              <div className="flex flex-col gap-1">
                <span style={{ fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: "#5a5236" }}>Sizing</span>
                <span style={{ color: "#2a2418" }}>{product.sizingNote}</span>
              </div>
            )}
            {product.fabric && (
              <div className="flex flex-col gap-1">
                <span style={{ fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: "#5a5236" }}>Fabric</span>
                <span style={{ color: "#2a2418" }}>{product.fabric}</span>
              </div>
            )}
            {product.care && (
              <div className="flex flex-col gap-1">
                <span style={{ fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: "#5a5236" }}>Care</span>
                <span style={{ color: "#2a2418" }}>{product.care}</span>
              </div>
            )}
          </div>

          {product.description && (
            <p style={{ fontSize: 16, lineHeight: 1.6, color: "#2a2418" }}>{product.description}</p>
          )}

          {product.size && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "14px 18px", border: "1.5px dashed #c9b890", borderRadius: 14, marginTop: 4 }}>
              <div className="flex items-center gap-3">
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#3b5b85", color: "#fffaf0", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 500, border: "2px solid #1a1a1a" }}>
                  {product.size}
                </div>
                <div>
                  <div style={{ fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: "#5a5236" }}>Size</div>
                  <div style={{ fontSize: 14, color: "#1a1a1a" }}>{product.sizingNote || product.size}</div>
                </div>
              </div>
              <span style={{ fontFamily: "var(--font-hand)", fontSize: 16, color: "#5a5236" }}>one of one ✿</span>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleBuy}
              disabled={isSold || adding}
              style={{
                flex: 1, background: isSold ? "#c9b890" : "#1a1a1a", color: "#fffaf0", border: "none",
                padding: "18px 20px", borderRadius: 9999, fontSize: 15, fontWeight: 500,
                cursor: isSold ? "not-allowed" : "pointer", fontFamily: "inherit",
                display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
                opacity: isSold ? 0.7 : 1,
              }}
            >
              {isSold ? "Sold ✿" : adding ? "Redirecting…" : <>{`Add to Cart · $${product.price}`} <ArrowIcon color="#fffaf0" size={24} /></>}
            </button>
            <button
              aria-label="Add to wishlist"
              style={{ width: 52, background: "transparent", color: "#1a1a1a", border: "2px solid #1a1a1a", borderRadius: 9999, cursor: "pointer", fontSize: 18 }}
            >
              <span aria-hidden="true">♡</span>
            </button>
          </div>

          <div className="layout-info-boxes mt-1">
            {[["Shipping", "Free over $80 · 2-3 days"], ["Returns", "14 days · easy swap"], ["Made by", "Donna · Portland, OR"]].map(([k, v]) => (
              <div key={k} className="flex flex-col gap-1 p-3 rounded-[12px]" style={{ border: "1.5px solid #c9b890", fontSize: 12 }}>
                <span style={{ fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: "#5a5236" }}>{k}</span>
                <span style={{ color: "#1a1a1a", fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>

          <div style={{ background: "#3b5b85", color: "#fffaf0", borderRadius: 18, padding: "20px 24px", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 16, border: "2px solid #1a1a1a", marginTop: 4 }}>
            <div>
              <div style={{ fontFamily: "var(--font-hand)", fontSize: 24, marginBottom: 2, color: "#fffaf0" }}>not quite right?</div>
              <p style={{ fontSize: 14, lineHeight: 1.4, opacity: 0.9, margin: 0 }}>Different size, longer hem, your dad&apos;s old jeans? Donna takes custom orders.</p>
            </div>
            <Link href="/contact" style={{ background: "#fffaf0", color: "#1a1a1a", padding: "10px 18px", borderRadius: 9999, fontSize: 13, fontWeight: 500, border: "1.5px solid #1a1a1a", textDecoration: "none", flexShrink: 0 }}>
              Request custom →
            </Link>
          </div>
        </div>
      </div>

      {/* RELATED */}
      {related.length > 0 && (
        <section className="px-4 md:px-14 pb-16">
          <div className="flex justify-between items-baseline mb-6">
            <div>
              <div style={{ fontFamily: "var(--font-hand)", fontSize: 22, color: "#ee7c5a" }}>more in the shop ✿</div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem, 4vw, 2.25rem)", letterSpacing: -0.6, margin: 0 }}>You might also like</h3>
            </div>
            <Link href="/shop" style={{ fontFamily: "var(--font-hand)", fontSize: 20, color: "#3b5b85", textDecoration: "underline", textDecorationStyle: "wavy" }}>see all →</Link>
          </div>
          <div className="layout-related-4">
            {related.map((r: Product, i: number) => (
              <Link key={r._id} href={`/shop/${r.slug?.current}`} className="no-underline" style={{ cursor: "pointer", color: "inherit" }}>
                <div style={{ borderRadius: 16, overflow: "hidden", border: "2px solid #1a1a1a", marginBottom: 12, position: "relative" }}>
                  <img src={RELATED_IMAGES[i % 4]} alt={r.title} style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover", display: "block" }} />
                  {r.status === "sold" && (
                    <div style={{ position: "absolute", inset: 0, background: "rgba(255,250,240,.6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ background: "#1a1a1a", color: "#fffaf0", padding: "8px 18px", fontFamily: "var(--font-hand)", fontSize: 24, transform: "rotate(-8deg)", border: "2px solid #fffaf0", outline: "2px solid #1a1a1a" }}>sold ✿</div>
                    </div>
                  )}
                </div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 17, lineHeight: 1.2, marginBottom: 4 }}>{r.title}</div>
                <div className="flex justify-between items-center text-sm">
                  <span style={{ color: "#6a5a40" }}>{r.category}</span>
                  <span style={{ background: "#1a1a1a", color: "#fffaf0", padding: "3px 10px", borderRadius: 9999, fontSize: 12, fontWeight: 500 }}>${r.price}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
