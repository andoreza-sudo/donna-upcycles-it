import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { getProducts, getSiteSettings } from "@/lib/queries";

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ category?: string }> }): Promise<Metadata> {
  const { category } = await searchParams;
  const title = category ? `${category}` : "Shop";
  const description = category
    ? `Browse one-of-one upcycled denim ${category.toLowerCase()} handmade by Donna in Portland, Oregon.`
    : "Browse all one-of-one upcycled denim pieces — jackets, jeans, and totes handmade by Donna in Portland, Oregon.";
  return { title, description, openGraph: { title: `${title} — Donna Upcycles It`, description } };
}

const PRODUCT_IMAGES = [
  "https://picsum.photos/seed/prod1/600/750",
  "https://picsum.photos/seed/prod2/600/750",
  "https://picsum.photos/seed/prod3/600/750",
  "https://picsum.photos/seed/prod4/600/750",
  "https://picsum.photos/seed/prod5/600/750",
  "https://picsum.photos/seed/prod6/600/750",
  "https://picsum.photos/seed/prod7/600/750",
  "https://picsum.photos/seed/prod8/600/750",
  "https://picsum.photos/seed/prod9/600/750",
  "https://picsum.photos/seed/prod10/600/750",
  "https://picsum.photos/seed/prod11/600/750",
  "https://picsum.photos/seed/prod12/600/750",
];

type Product = {
  _id: string;
  title?: string;
  slug?: { current?: string };
  photos?: Array<{ asset?: { _ref?: string }; alt?: string }>;
  status?: string;
  category?: string;
  price?: number;
};

const CATEGORIES = ["All", "Jeans", "Jackets", "Totes", "Other"];

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const params = await searchParams;
  const category = params.category;

  const [products, settings] = await Promise.all([
    getProducts(category).catch(() => [] as Product[]),
    getSiteSettings().catch(() => null),
  ]);

  const list = products as Product[];

  return (
    <div style={{ background: "#fffaf0", color: "#1a1a1a", fontFamily: "var(--font-sans)", minHeight: "100vh" }}>
      <Nav donnaPhoto={settings?.donnaPhoto} />

      <section className="px-4 md:px-14 pt-10 md:pt-14 pb-8">
        <div className="flex justify-between items-end flex-wrap gap-4 mb-6 md:mb-9">
          <div>
            <div style={{ fontFamily: "var(--font-hand)", fontSize: 26, color: "#ee7c5a" }}>shop the goods</div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.25rem, 8vw, 4rem)", lineHeight: 0.95, letterSpacing: -2, margin: "4px 0 0" }}>
              {category ? category : "Everything"} →
            </h1>
          </div>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((c) => (
              <Link
                key={c}
                href={c === "All" ? "/shop" : `/shop?category=${c}`}
                className="no-underline"
                style={{
                  padding: "10px 18px",
                  borderRadius: 9999,
                  border: "2px solid #1a1a1a",
                  background: (c === "All" && !category) || c === category ? "#3b5b85" : "#fffaf0",
                  color: (c === "All" && !category) || c === category ? "#fffaf0" : "#1a1a1a",
                  fontSize: 13,
                  fontFamily: "inherit",
                  display: "inline-block",
                  transform: (c === "All" && !category) || c === category ? "rotate(-1deg)" : undefined,
                  fontWeight: (c === "All" && !category) || c === category ? 600 : 400,
                }}
              >
                {c}
              </Link>
            ))}
          </div>
        </div>
        <div className="text-sm mb-6" style={{ color: "#5a5236" }}>
          {list.length} piece{list.length !== 1 ? "s" : ""} in stock — each one of a kind ✿
        </div>
      </section>

      <section className="px-4 md:px-14 pb-20">
        {list.length > 0 ? (
          <div className="layout-products-3">
            {list.map((p, i) => (
              <Link key={p._id} href={`/shop/${p.slug?.current}`} className="no-underline" style={{ position: "relative", cursor: "pointer", color: "inherit" }}>
                <div style={{ borderRadius: 18, overflow: "hidden", border: "2px solid #1a1a1a", position: "relative" }}>
                  <img
                    src={PRODUCT_IMAGES[i % PRODUCT_IMAGES.length]}
                    alt={p.title || "product"}
                    style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover", display: "block" }}
                  />
                  {p.status === "sold" && (
                    <div style={{ position: "absolute", inset: 0, background: "rgba(255,250,240,.6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ background: "#1a1a1a", color: "#fffaf0", padding: "10px 24px", fontFamily: "var(--font-hand)", fontSize: 32, transform: "rotate(-8deg)", border: "2px solid #fffaf0", outline: "2px solid #1a1a1a" }}>sold ✿</div>
                    </div>
                  )}
                </div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 19, marginTop: 12, marginBottom: 4, lineHeight: 1.2 }}>{p.title}</div>
                <div className="flex justify-between items-center text-sm">
                  <span style={{ color: "#6a5a40" }}>{p.category}</span>
                  <span style={{ background: "#1a1a1a", color: "#fffaf0", padding: "4px 12px", borderRadius: 9999, fontSize: 13, fontWeight: 500 }}>${p.price}</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-24" style={{ color: "#5a5236" }}>
            <div style={{ fontFamily: "var(--font-hand)", fontSize: 32, marginBottom: 16 }}>nothing here just yet ✿</div>
            <p>Add products via Sanity Studio at <Link href="/studio" className="underline" style={{ color: "#3b5b85" }}>/studio</Link></p>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
