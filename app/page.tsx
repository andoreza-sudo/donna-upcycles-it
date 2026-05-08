import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ArrowIcon } from "@/components/ButterflyIcon";
import { getProducts, getFeaturedJournalPost, getLatestJournalPosts, getSiteSettings } from "@/lib/queries";

const PRODUCT_IMAGES = [
  "https://picsum.photos/seed/prod1/600/750",
  "https://picsum.photos/seed/prod2/600/750",
  "https://picsum.photos/seed/prod3/600/750",
  "https://picsum.photos/seed/prod4/600/750",
  "https://picsum.photos/seed/prod5/600/750",
  "https://picsum.photos/seed/prod6/600/750",
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

type JournalPost = {
  _id: string;
  title?: string;
  excerpt?: string;
  tag?: string;
  slug?: { current?: string };
  publishedAt?: string;
  featured?: boolean;
};

function JournalBanner({ post, latestPosts }: { post: JournalPost | null; latestPosts: JournalPost[] }) {
  if (!post && latestPosts.length === 0) return null;
  const mainPost = post || latestPosts[0];
  const extras = latestPosts.filter((p) => p._id !== mainPost._id).slice(0, 2);
  return (
    <section className="mx-4 md:mx-14 mt-5 rounded-[24px] border-2 border-[#1a1a1a] overflow-hidden layout-journal-banner">
      <div className="border-r-2 border-[#1a1a1a] relative min-h-[150px] overflow-hidden">
        <img src="https://picsum.photos/seed/journal-hero/400/300" alt="journal post" className="w-full h-full object-cover" />
        <div className="absolute top-3 left-3 bg-[#fffaf0] border border-[#1a1a1a] rounded-full px-3 py-1 text-xs tracking-[1.5px] uppercase">Journal · new</div>
      </div>
      <div className="border-r-2 border-[#1a1a1a] px-6 py-4 flex flex-col gap-1 justify-center">
        <div style={{ fontFamily: "var(--font-hand)", fontSize: 20, color: "#ee7c5a", lineHeight: 1 }}>fresh from the workshop ✿</div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.1rem, 3vw, 1.5rem)", lineHeight: 1.05, letterSpacing: -0.4, margin: "2px 0" }}>{mainPost?.title || "Latest from the journal"}</h2>
        <p className="text-sm" style={{ lineHeight: 1.45, color: "#4a4030", margin: 0 }}>{mainPost?.excerpt || "Tips, stories, and new drops from Donna's kitchen workshop."}</p>
        <Link href={`/journal/${mainPost?.slug?.current || ""}`} style={{ fontFamily: "var(--font-hand)", fontSize: 20, marginTop: 8, textDecoration: "underline", textDecorationStyle: "wavy", color: "#3b5b85" }}>
          read the post →
        </Link>
      </div>
      <div className="px-6 py-4 flex flex-col gap-2 justify-center" style={{ background: "#3b5b85", color: "#fffaf0" }}>
        <div style={{ fontFamily: "var(--font-hand)", fontSize: 18, opacity: 0.9, lineHeight: 1 }}>also in the journal</div>
        {extras.map((p, i) => (
          <div key={p._id} className="flex flex-col gap-0.5" style={{ borderTop: i === 0 ? "none" : "1px solid rgba(241,234,217,.3)", paddingTop: i === 0 ? 0 : 6 }}>
            <div className="text-[10px] tracking-[1.5px] uppercase" style={{ opacity: 0.8 }}>{p.tag} · {p.publishedAt ? new Date(p.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : ""}</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 14, lineHeight: 1.2, color: "#fffaf0" }}>{p.title}</div>
          </div>
        ))}
        <Link href="/journal" style={{ fontFamily: "var(--font-hand)", fontSize: 18, color: "#fffaf0", textDecoration: "underline", textDecorationStyle: "wavy", marginTop: 4 }}>see all posts →</Link>
      </div>
    </section>
  );
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const imgSrc = PRODUCT_IMAGES[index % PRODUCT_IMAGES.length];
  return (
    <Link href={`/shop/${product.slug?.current}`} className="no-underline" style={{ position: "relative", cursor: "pointer", color: "inherit" }}>
      <div style={{ borderRadius: 18, overflow: "hidden", border: "2px solid #1a1a1a", position: "relative" }}>
        <img src={imgSrc} alt={product.title || "product"} style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover", display: "block" }} />
        {product.status === "sold" && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(255,250,240,.6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ background: "#1a1a1a", color: "#fffaf0", padding: "10px 24px", fontFamily: "var(--font-hand)", fontSize: 32, transform: "rotate(-8deg)", border: "2px solid #fffaf0", outline: "2px solid #1a1a1a" }}>sold ✿</div>
          </div>
        )}
      </div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 19, marginTop: 12, marginBottom: 4, lineHeight: 1.2 }}>{product.title}</div>
      <div className="flex justify-between items-center text-sm">
        <span style={{ color: "#6a5a40" }}>{product.category}</span>
        <span style={{ background: "#1a1a1a", color: "#fffaf0", padding: "4px 12px", borderRadius: 9999, fontSize: 13, fontWeight: 500 }}>${product.price}</span>
      </div>
    </Link>
  );
}

export default async function HomePage() {
  const [products, featuredPost, latestPosts, settings] = await Promise.all([
    getProducts().catch(() => [] as Product[]),
    getFeaturedJournalPost().catch(() => null),
    getLatestJournalPosts(3).catch(() => [] as JournalPost[]),
    getSiteSettings().catch(() => null),
  ]);

  return (
    <div className="min-h-screen" style={{ background: "#fffaf0", color: "#1a1a1a", fontFamily: "var(--font-sans)" }}>
      <Nav donnaPhoto={settings?.donnaPhoto} />

      <JournalBanner post={featuredPost as JournalPost | null} latestPosts={latestPosts as JournalPost[]} />

      {/* HERO */}
      <section className="layout-hero px-4 md:px-14 pt-8 pb-14">
        <div>
          <div style={{ fontFamily: "var(--font-hand)", fontSize: "clamp(1rem, 3.5vw, 1.625rem)", color: "#3b5b85", marginBottom: 8 }}>✿ spring drop №04 — fresh today</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(2.5rem, 12vw, 6.875rem)", lineHeight: 0.92, letterSpacing: "-0.03em", margin: "0 0 28px" }}>
            <span style={{ background: "#7a9bc1", color: "#1a1a1a", padding: "0 8px", borderRadius: 4, display: "inline-block", transform: "rotate(-1deg)" }}>worn before</span><br />
            <span style={{ fontStyle: "italic", color: "#7a9bc1" }}>loved again</span>.
          </h1>
          <p style={{ fontSize: "clamp(0.95rem, 2.5vw, 1.125rem)", lineHeight: 1.5, maxWidth: 460, marginBottom: 28 }}>
            Hi! I&apos;m Donna. I rescue old jeans, cut them up, and stitch them into something you&apos;ll keep forever. No two are the same. Have a poke around.
          </p>
          <div className="flex flex-wrap gap-3 items-center">
            <Link href="/shop" className="flex items-center gap-2 no-underline" style={{ background: "#1a1a1a", color: "#fffaf0", padding: "16px 28px", borderRadius: 9999, fontSize: "clamp(0.875rem, 2vw, 1rem)", fontWeight: 500, fontFamily: "inherit" }}>
              Shop {(products as Product[]).length || 30} pieces <ArrowIcon color="#fffaf0" size={28} />
            </Link>
            <Link href="/about" style={{ background: "#fffaf0", color: "#1a1a1a", padding: "16px 24px", borderRadius: 9999, border: "2px solid #1a1a1a", fontSize: "clamp(0.875rem, 2vw, 1rem)", fontFamily: "inherit", textDecoration: "none" }}>
              How it&apos;s made
            </Link>
          </div>
        </div>

        {/* Polaroid stack — desktop only */}
        <div className="hidden md:block" style={{ position: "relative", height: 540 }}>
          <div style={{ position: "absolute", top: 0, left: 40, width: 280, background: "#fff", padding: 12, paddingBottom: 38, border: "2px solid #1a1a1a", transform: "rotate(-6deg)", zIndex: 1, boxShadow: "6px 6px 0 rgba(0,0,0,.08)" }}>
            <img src="https://picsum.photos/seed/polar1/280/350" alt="patchwork jeans" style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover", display: "block" }} />
            <div style={{ position: "absolute", bottom: 8, left: 0, right: 0, textAlign: "center", fontFamily: "var(--font-hand)", fontSize: 18 }}>#07 · my favourite</div>
          </div>
          <div style={{ position: "absolute", top: 80, left: 260, width: 240, background: "#fff", padding: 12, paddingBottom: 38, border: "2px solid #1a1a1a", transform: "rotate(8deg)", zIndex: 2, boxShadow: "6px 6px 0 rgba(0,0,0,.08)" }}>
            <img src="https://picsum.photos/seed/polar2/240/240" alt="daisy jacket" style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", display: "block" }} />
            <div style={{ position: "absolute", bottom: 8, left: 0, right: 0, textAlign: "center", fontFamily: "var(--font-hand)", fontSize: 18 }}>embroidered by hand</div>
          </div>
          <div style={{ position: "absolute", top: 320, left: 80, width: 220, background: "#fff", padding: 12, paddingBottom: 38, border: "2px solid #1a1a1a", transform: "rotate(-3deg)", zIndex: 3, boxShadow: "6px 6px 0 rgba(0,0,0,.08)" }}>
            <img src="https://picsum.photos/seed/polar3/220/220" alt="sashiko tote" style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", display: "block" }} />
            <div style={{ position: "absolute", bottom: 8, left: 0, right: 0, textAlign: "center", fontFamily: "var(--font-hand)", fontSize: 18 }}>sashiko tote — $64</div>
          </div>
          <div style={{ position: "absolute", width: 140, height: 140, borderRadius: "50%", background: "#ee7c5a", color: "#fffaf0", top: 56, right: 64, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 16, fontFamily: "var(--font-hand)", fontSize: 24, lineHeight: 1.05, transform: "rotate(14deg)", border: "2px solid #1a1a1a", zIndex: 3 }}>
            {(products as Product[]).length || 30}<br />pieces<br />just<br />in!
          </div>
        </div>

        {/* Mobile hero image (replaces polaroid stack) */}
        <div className="md:hidden" style={{ position: "relative" }}>
          <div style={{ background: "#fff", padding: 12, paddingBottom: 38, border: "2px solid #1a1a1a", transform: "rotate(-1.5deg)", boxShadow: "6px 6px 0 rgba(0,0,0,.08)" }}>
            <img src="https://picsum.photos/seed/polar1/400/500" alt="patchwork jeans" style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover", display: "block" }} />
            <div style={{ position: "absolute", bottom: 8, left: 0, right: 0, textAlign: "center", fontFamily: "var(--font-hand)", fontSize: 18 }}>#07 · my favourite ✿</div>
          </div>
          <div style={{ position: "absolute", top: 12, right: -8, width: 80, height: 80, borderRadius: "50%", background: "#ee7c5a", color: "#fffaf0", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 8, fontFamily: "var(--font-hand)", fontSize: 16, lineHeight: 1.1, transform: "rotate(14deg)", border: "2px solid #1a1a1a", zIndex: 3 }}>
            just<br />in!
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="px-4 md:px-14 pb-20">
        <div className="flex justify-between items-center flex-wrap gap-4 mb-9">
          <div>
            <div style={{ fontFamily: "var(--font-hand)", fontSize: 26, color: "#ee7c5a" }}>shop the goods</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem, 5vw, 2.75rem)", margin: "4px 0 0", letterSpacing: -1 }}>Everything in stock →</h2>
          </div>
          <div className="flex gap-2 flex-wrap">
            {["All", "Jeans", "Jackets", "Totes"].map((c) => (
              <Link key={c} href={c === "All" ? "/shop" : `/shop?category=${c}`} className="no-underline" style={{ padding: "10px 18px", borderRadius: 9999, border: "2px solid #1a1a1a", background: "#fffaf0", color: "#1a1a1a", fontSize: 13, fontFamily: "inherit", display: "inline-block" }}>
                {c}
              </Link>
            ))}
          </div>
        </div>
        <div className="layout-products-2">
          {((products as Product[]).length > 0 ? (products as Product[]).slice(0, 6) : Array.from({ length: 6 }).map((_, i) => ({ _id: String(i), title: "Coming soon", slug: { current: "#" }, status: "available", category: "Jackets", price: undefined } as Product))).map((p, i) => (
            <ProductCard key={p._id} product={p} index={i} />
          ))}
        </div>
        {(products as Product[]).length > 6 && (
          <div className="text-center mt-12">
            <Link href="/shop" style={{ background: "#1a1a1a", color: "#fffaf0", padding: "16px 32px", borderRadius: 9999, fontSize: 15, fontFamily: "inherit", textDecoration: "none", display: "inline-block" }}>
              See all {(products as Product[]).length} pieces →
            </Link>
          </div>
        )}
      </section>

      {/* STORY STRIP */}
      <section className="layout-story mx-4 md:mx-14 mb-14 rounded-[32px] p-8 md:p-12 border-2 border-[#1a1a1a] relative" style={{ background: "#3b5b85", color: "#fffaf0" }}>
        <div style={{ position: "absolute", top: -16, left: 40, background: "#fffaf0", color: "#1a1a1a", padding: "6px 14px", borderRadius: 9999, border: "2px solid #1a1a1a", fontFamily: "var(--font-hand)", fontSize: 20 }}>about donna ✿</div>
        <div style={{ position: "relative", transform: "rotate(-2deg)" }}>
          <div style={{ background: "#fffaf0", padding: 12, paddingBottom: 34, border: "2px solid #1a1a1a" }}>
            <img src="https://picsum.photos/seed/donna-studio/400/400" alt="Donna at work" style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", display: "block" }} />
            <div style={{ textAlign: "center", marginTop: 8, fontFamily: "var(--font-hand)", fontSize: 20, color: "#1a1a1a" }}>the kitchen, my studio</div>
          </div>
        </div>
        <div>
          <h2 style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "clamp(2rem, 6vw, 3.5rem)", lineHeight: 0.95, letterSpacing: -1, margin: "0 0 18px", color: "#fffaf0" }}>I just couldn&apos;t<br />throw them out.</h2>
          <p style={{ fontSize: 17, lineHeight: 1.5, marginBottom: 12 }}>It started with one pair of jeans I loved too much to bin. Now there&apos;s a stack of forty in the spare room and an industrial sewing machine where the dining table used to be.</p>
          <p style={{ fontSize: 17, lineHeight: 1.5, marginBottom: 12 }}>Every piece in the shop is rescued, washed, and stitched together by me, by hand. Want yours customised? Just ask — I love a custom job.</p>
          <Link href="/about" style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 14, background: "#1a1a1a", color: "#fffaf0", padding: "12px 22px", borderRadius: 9999, fontSize: 14, textDecoration: "none" }}>Read the full story →</Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
