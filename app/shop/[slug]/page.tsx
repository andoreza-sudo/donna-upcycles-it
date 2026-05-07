"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ArrowIcon } from "@/components/ButterflyIcon";
import { getProduct, getRelatedProducts } from "@/lib/queries";

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

function ProductPageClient({ slug }: { slug: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [thumb, setThumb] = useState(0);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    getProduct(slug).then((p: Product) => {
      setProduct(p);
      if (p?._id && p?.category) {
        getRelatedProducts(p.category, p._id).then(setRelated);
      }
    });
  }, [slug]);

  if (!product) {
    return (
      <div style={{ background: "#fffaf0", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: "var(--font-hand)", fontSize: 28, color: "#5a5236" }}>loading... ✿</div>
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
      if (data.url) {
        window.location.href = data.url;
      }
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
      <div className="px-14 py-5 flex gap-2 text-xs tracking-[1.5px] uppercase" style={{ color: "#5a5236" }}>
        <Link href="/shop" style={{ color: "#5a5236", textDecoration: "none" }}>Shop</Link>
        <span>/</span>
        <span>{product.category}</span>
        <span>/</span>
        <span style={{ color: "#3b5b85" }}>{product.title}</span>
      </div>

      {/* MAIN GRID */}
      <div className="px-14 pb-14" style={{ display: "grid", gridTemplateColumns: "1.15fr 1fr", gap: 56 }}>
        {/* GALLERY */}
        <div style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: 18 }}>
          <div className="flex flex-col gap-3">
            {[0, 1, 2, 3].map((i) => (
              <button
                key={i}
                onClick={() => setThumb(i)}
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
          <div style={{ borderRadius: 24, overflow: "hidden", border: "2px solid #1a1a1a", position: "relative", transform: "rotate(-0.5deg)" }}>
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
        <div className="flex flex-col gap-[18px]">
          <div style={{ fontFamily: "var(--font-hand)", fontSize: 22, color: "#ee7c5a" }}>{product.number}</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 56, lineHeight: 0.96, letterSpacing: -1.2, margin: 0 }}>
            {product.title}
          </h1>
          <div className="flex items-baseline gap-3 mt-1">
            <span style={{ fontFamily: "var(--font-display)", fontSize: 36 }}>${product.price}</span>
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
              <span style={{ fontFamily: "var(--font-hand)", fontSize: 18, color: "#5a5236" }}>one of one — fits as is ✿</span>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleBuy}
              disabled={isSold || adding}
              style={{
                flex: 1, background: isSold ? "#c9b890" : "#1a1a1a", color: "#fffaf0", border: "none",
                padding: "18px 28px", borderRadius: 9999, fontSize: 15, fontWeight: 500,
                cursor: isSold ? "not-allowed" : "pointer", fontFamily: "inherit",
                display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10,
                opacity: isSold ? 0.7 : 1,
              }}
            >
              {isSold ? "Sold ✿" : adding ? "Redirecting…" : <>{`Add to Cart · $${product.price}`} <ArrowIcon color="#fffaf0" size={28} /></>}
            </button>
            <button style={{ width: 56, background: "transparent", color: "#1a1a1a", border: "2px solid #1a1a1a", borderRadius: 9999, cursor: "pointer", fontSize: 18 }}>♡</button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 4 }}>
            {[["Shipping", "Free over $80 · 2-3 days"], ["Returns", "14 days · easy swap"], ["Made by", "Donna · Portland, OR"]].map(([k, v]) => (
              <div key={k} className="flex flex-col gap-1 p-3 rounded-[12px]" style={{ border: "1.5px solid #c9b890", fontSize: 12 }}>
                <span style={{ fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: "#5a5236" }}>{k}</span>
                <span style={{ color: "#1a1a1a", fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>

          <div style={{ background: "#3b5b85", color: "#fffaf0", borderRadius: 18, padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, border: "2px solid #1a1a1a", marginTop: 4 }}>
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
        <section className="px-14 pb-16">
          <div className="flex justify-between items-baseline mb-6">
            <div>
              <div style={{ fontFamily: "var(--font-hand)", fontSize: 22, color: "#ee7c5a" }}>more in the shop ✿</div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 36, letterSpacing: -0.6, margin: 0 }}>You might also like</h3>
            </div>
            <Link href="/shop" style={{ fontFamily: "var(--font-hand)", fontSize: 22, color: "#3b5b85", textDecoration: "underline", textDecorationStyle: "wavy" }}>see all pieces →</Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
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

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => setSlug(p.slug));
  }, [params]);

  if (!slug) return null;
  return <ProductPageClient slug={slug} />;
}
