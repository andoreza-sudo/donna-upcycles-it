import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ArrowIcon, ButterflyIcon } from "@/components/ButterflyIcon";
import { getJournalPosts, getSiteSettings } from "@/lib/queries";

type JournalPost = {
  _id: string;
  title?: string;
  slug?: { current?: string };
  tag?: string;
  excerpt?: string;
  readTime?: number;
  publishedAt?: string;
  featured?: boolean;
};

const POST_IMAGES = [
  "https://picsum.photos/seed/journal1/800/600",
  "https://picsum.photos/seed/journal2/800/600",
  "https://picsum.photos/seed/journal3/800/600",
  "https://picsum.photos/seed/journal4/800/600",
  "https://picsum.photos/seed/journal5/800/600",
  "https://picsum.photos/seed/journal6/800/600",
];

const TAGS = ["All", "Sewing tips", "New product", "Behind the scenes", "Customer stories"];

export default async function JournalPage({ searchParams }: { searchParams: Promise<{ tag?: string }> }) {
  const params = await searchParams;
  const activeTag = params.tag;

  const [posts, settings] = await Promise.all([
    getJournalPosts(activeTag).catch(() => [] as JournalPost[]),
    getSiteSettings().catch(() => null),
  ]);

  const list = posts as JournalPost[];
  const featured = list.find((p) => p.featured) || list[0];
  const rest = list.filter((p) => p._id !== featured?._id);

  return (
    <div style={{ background: "#fffaf0", color: "#1a1a1a", fontFamily: "var(--font-sans)", minHeight: "100vh" }}>
      <Nav donnaPhoto={settings?.donnaPhoto} />

      {/* PAGE HEAD */}
      <section className="px-14 pt-14 pb-8 relative" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 56, alignItems: "end", borderBottom: "1px solid #1a1a1a" }}>
        <div>
          <div style={{ fontFamily: "var(--font-hand)", fontSize: 28, color: "#ee7c5a", marginBottom: 8 }}>✿ from the workshop</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 110, lineHeight: 0.92, letterSpacing: -3, margin: 0 }}>
            The <span style={{ fontStyle: "italic", color: "#3b5b85" }}>Journal</span>
          </h1>
        </div>
        <p style={{ fontSize: 16, lineHeight: 1.55, color: "#3a3528", maxWidth: 380, paddingBottom: 12 }}>
          Sewing tips, behind-the-scenes from the kitchen-table workshop, and a heads-up whenever new pieces drop. Posted whenever Donna&apos;s got a minute spare.
        </p>
        <div className="absolute top-6 right-14 flex gap-1">
          <span style={{ transform: "rotate(-14deg)", display: "inline-block" }}><ButterflyIcon color="#3b5b85" accent="#ee7c5a" size={28} /></span>
          <span style={{ transform: "rotate(8deg) translateY(8px)", display: "inline-block" }}><ButterflyIcon color="#ee7c5a" accent="#3b5b85" size={22} /></span>
        </div>
      </section>

      {/* FILTER BAR */}
      <section className="px-14 py-6 flex justify-between items-center flex-wrap gap-4 border-b border-[#1a1a1a]">
        <div className="flex gap-2 flex-wrap">
          {TAGS.map((t) => (
            <Link
              key={t}
              href={t === "All" ? "/journal" : `/journal?tag=${encodeURIComponent(t)}`}
              className="no-underline"
              style={{
                padding: "10px 18px", borderRadius: 9999,
                border: "1.5px solid #1a1a1a",
                background: (t === "All" && !activeTag) || t === activeTag ? "#3b5b85" : "transparent",
                color: (t === "All" && !activeTag) || t === activeTag ? "#fffaf0" : "#1a1a1a",
                fontSize: 13, fontFamily: "inherit",
              }}
            >
              {t}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2" style={{ fontFamily: "var(--font-hand)", fontSize: 22, color: "#5a5236" }}>
          {list.length} posts · newest first <ArrowIcon color="#5a5236" size={32} />
        </div>
      </section>

      {/* FEATURED */}
      {featured && (
        <section className="px-14 py-14" style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 48, alignItems: "center" }}>
          <div style={{ borderRadius: 24, overflow: "hidden", border: "2px solid #1a1a1a", position: "relative", transform: "rotate(-1deg)" }}>
            <img src={POST_IMAGES[0]} alt={featured.title} style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block" }} />
            <div style={{ position: "absolute", top: 16, left: 16, background: "#ee7c5a", color: "#fffaf0", padding: "6px 14px", borderRadius: 9999, fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", border: "2px solid #1a1a1a", fontWeight: 600 }}>Featured ✿</div>
          </div>
          <div>
            <div className="flex items-center gap-3 text-xs tracking-[1.5px] uppercase mb-4" style={{ color: "#5a5236" }}>
              <span style={{ background: "#7a9bc1", color: "#1a1a1a", padding: "4px 10px", borderRadius: 9999 }}>{featured.tag}</span>
              <span>{featured.publishedAt ? new Date(featured.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""}</span>
              {featured.readTime && <span>· {featured.readTime} min read</span>}
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 56, lineHeight: 1, letterSpacing: -1.4, margin: "0 0 18px" }}>{featured.title}</h2>
            <p style={{ fontSize: 17, lineHeight: 1.55, marginBottom: 24, color: "#3a3528" }}>{featured.excerpt}</p>
            <Link href={`/journal/${featured.slug?.current}`} className="inline-flex items-center gap-2 no-underline" style={{ background: "#1a1a1a", color: "#fffaf0", padding: "16px 26px", borderRadius: 9999, fontSize: 14, fontFamily: "inherit" }}>
              Read the post <ArrowIcon color="#fffaf0" size={32} />
            </Link>
          </div>
        </section>
      )}

      {/* GRID */}
      {rest.length > 0 && (
        <section className="px-14 pb-16 pt-8 border-t border-[#1a1a1a]">
          <div className="flex justify-between items-baseline py-8">
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 36, letterSpacing: -0.6, margin: 0 }}>More from the journal</h3>
            <div style={{ fontFamily: "var(--font-hand)", fontSize: 22, color: "#ee7c5a" }}>{rest.length} more posts ✿</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }}>
            {rest.map((p, i) => (
              <article key={p._id} className="flex flex-col cursor-pointer">
                <div style={{ borderRadius: 18, overflow: "hidden", border: "2px solid #1a1a1a", marginBottom: 16, position: "relative" }}>
                  <img src={POST_IMAGES[(i + 1) % POST_IMAGES.length]} alt={p.title} style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block" }} />
                  <div style={{ position: "absolute", top: 12, left: 12, background: "#fffaf0", color: "#1a1a1a", padding: "4px 10px", borderRadius: 9999, fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", border: "1.5px solid #1a1a1a" }}>{p.tag}</div>
                </div>
                <h4 style={{ fontFamily: "var(--font-display)", fontSize: 22, lineHeight: 1.15, letterSpacing: -0.4, margin: "4px 0 8px" }}>{p.title}</h4>
                <p style={{ fontSize: 14, lineHeight: 1.55, color: "#4a4030", marginBottom: 12 }}>{p.excerpt}</p>
                <div className="flex justify-between items-center text-xs tracking-[1.5px] uppercase mt-auto" style={{ color: "#6a5d44" }}>
                  <span>{p.publishedAt ? new Date(p.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : ""} · {p.readTime} min</span>
                  <Link href={`/journal/${p.slug?.current}`} style={{ color: "#3b5b85", textDecoration: "underline", textDecorationStyle: "wavy" }}>read →</Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {list.length === 0 && (
        <div className="text-center py-24" style={{ color: "#5a5236" }}>
          <div style={{ fontFamily: "var(--font-hand)", fontSize: 32, marginBottom: 16 }}>no posts yet ✿</div>
          <p>Add journal posts via <Link href="/studio" className="underline" style={{ color: "#3b5b85" }}>Sanity Studio</Link></p>
        </div>
      )}

      {/* NEWSLETTER */}
      <section className="mx-14 mb-14 rounded-[32px] px-14 py-12 border-2 border-[#1a1a1a] relative overflow-hidden" style={{ background: "#3b5b85", color: "#fffaf0", display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 40, alignItems: "center" }}>
        <div style={{ position: "absolute", top: -16, left: 40, background: "#fffaf0", color: "#1a1a1a", padding: "6px 14px", borderRadius: 9999, border: "2px solid #1a1a1a", fontFamily: "var(--font-hand)", fontSize: 20 }}>stay in the loop ✿</div>
        <div>
          <h3 style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 44, lineHeight: 1, letterSpacing: -0.8, margin: "0 0 12px", color: "#fffaf0" }}>One email a month.<br />Sometimes two if there&apos;s a drop.</h3>
          <p style={{ fontSize: 16, lineHeight: 1.5, opacity: 0.9, maxWidth: 460 }}>Sewing tips, new pieces, the occasional discount code. No spam, ever — Donna types these herself.</p>
        </div>
        <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            placeholder="your email…"
            className="flex-1 rounded-full text-[15px] px-[18px] py-3 outline-none"
            style={{ border: "2px solid #fffaf0", background: "transparent", color: "#fffaf0", fontFamily: "inherit" }}
          />
          <button type="submit" style={{ background: "#fffaf0", color: "#1a1a1a", border: "2px solid #fffaf0", padding: "14px 22px", borderRadius: 9999, fontSize: 14, cursor: "pointer", fontFamily: "inherit", fontWeight: 500 }}>Subscribe →</button>
        </form>
      </section>

      <Footer />
    </div>
  );
}
