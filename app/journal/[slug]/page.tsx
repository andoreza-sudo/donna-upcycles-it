import type { Metadata } from "next";
import Link from "next/link";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { getJournalPost, getJournalPosts, getSiteSettings } from "@/lib/queries";
import { safeJsonLd } from "@/lib/escape";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://donnaupcyclesit.com";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getJournalPost(slug).catch(() => null);
  if (!post) return { title: "Post not found" };
  return {
    title: post.title as string,
    description: (post.excerpt as string | undefined) || `A journal post by Donna — ${post.title}`,
    openGraph: {
      title: `${post.title} — Donna Upcycles It Journal`,
      description: post.excerpt as string | undefined,
      type: "article",
      publishedTime: post.publishedAt as string | undefined,
      authors: ["Donna"],
      tags: post.tag ? [post.tag as string] : undefined,
    },
  };
}

const RELATED_IMAGES = [
  "https://picsum.photos/seed/jrel1/800/600",
  "https://picsum.photos/seed/jrel2/800/600",
  "https://picsum.photos/seed/jrel3/800/600",
];

type PortableTextBlock = {
  _type: string;
  _key: string;
  style?: string;
  children?: Array<{ _key: string; _type: string; text: string; marks?: string[] }>;
  asset?: { _ref?: string };
  caption?: string;
  alt?: string;
};

const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p style={{ margin: "0 0 22px", fontSize: "clamp(1rem, 2.5vw, 1.125rem)", lineHeight: 1.7, color: "#2a2418" }}>{children}</p>
    ),
    h2: ({ children }) => (
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem, 5vw, 2.375rem)", letterSpacing: -0.8, lineHeight: 1.05, margin: "48px 0 18px" }}>{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.375rem, 3.5vw, 1.75rem)", letterSpacing: -0.5, lineHeight: 1.1, margin: "36px 0 14px" }}>{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "clamp(1.25rem, 4vw, 2rem)", lineHeight: 1.2, letterSpacing: -0.6, borderLeft: "4px solid #ee7c5a", padding: "8px 0 8px 24px", margin: "32px 0", color: "#3b5b85" }}>{children}</blockquote>
    ),
  },
  types: {
    image: ({ value }: { value: PortableTextBlock }) => (
      <div style={{ margin: "32px 0" }}>
        <div style={{ borderRadius: 18, overflow: "hidden", border: "2px solid #1a1a1a", transform: "rotate(0.6deg)" }}>
          <img src={`https://picsum.photos/seed/inline-img/720/480`} alt={value.alt || ""} style={{ width: "100%", objectFit: "cover", display: "block" }} />
        </div>
        {value.caption && <div style={{ fontFamily: "var(--font-hand)", fontSize: 20, color: "#5a5236", textAlign: "center", marginTop: 10 }}>{value.caption}</div>}
      </div>
    ),
    productRef: ({ value }: { value: { product?: { _ref?: string } } }) => (
      <div style={{ margin: "40px 0", border: "2px solid #1a1a1a", borderRadius: 24, padding: 20, display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center", background: "#fff" }}>
        <div style={{ borderRadius: 14, overflow: "hidden", border: "1.5px solid #1a1a1a", width: 120, flexShrink: 0 }}>
          <img src="https://picsum.photos/seed/inline-product/200/200" alt="mentioned product" style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", display: "block" }} />
        </div>
        <div style={{ flex: 1, minWidth: 140 }}>
          <div style={{ fontFamily: "var(--font-hand)", fontSize: 20, color: "#ee7c5a", marginBottom: 4 }}>mentioned in this post ✿</div>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, margin: "0 0 4px" }}>Shop the piece</h3>
          <div style={{ fontSize: 13, color: "#5a5236" }}>Available in the shop</div>
        </div>
        <Link href="/shop" style={{ background: "#1a1a1a", color: "#fffaf0", border: "none", padding: "12px 22px", borderRadius: 9999, fontSize: 13, textDecoration: "none", flexShrink: 0 }}>Shop →</Link>
      </div>
    ),
  },
};

export default async function JournalPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [post, allPosts, settings] = await Promise.all([
    getJournalPost(slug).catch(() => null),
    getJournalPosts().catch(() => []),
    getSiteSettings().catch(() => null),
  ]);

  const related = (allPosts as { _id: string; title?: string; slug?: { current?: string }; tag?: string; publishedAt?: string }[])
    .filter((p) => p._id !== post?._id)
    .slice(0, 3);

  if (!post) {
    return (
      <div style={{ background: "#fffaf0", minHeight: "100vh" }}>
        <Nav />
        <div className="flex items-center justify-center py-32">
          <div style={{ fontFamily: "var(--font-hand)", fontSize: 28, color: "#5a5236" }}>post not found ✿</div>
        </div>
        <Footer />
      </div>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    author: { "@type": "Person", name: "Donna" },
    publisher: {
      "@type": "Organization",
      name: "Donna Upcycles It",
      url: SITE_URL,
    },
    datePublished: post.publishedAt,
    url: `${SITE_URL}/journal/${post.slug?.current}`,
    keywords: post.tag,
  };

  return (
    <div style={{ background: "#fffaf0", color: "#1a1a1a", fontFamily: "var(--font-sans)", minHeight: "100vh" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
      <Nav donnaPhoto={settings?.donnaPhoto} />

      {/* BREADCRUMB */}
      <div className="px-4 md:px-14 py-4 md:py-5 flex flex-wrap gap-2 text-xs tracking-[1.5px] uppercase border-b border-[#d9cfb6]" style={{ color: "#5a5236" }}>
        <Link href="/journal" style={{ color: "#5a5236", textDecoration: "none" }}>Journal</Link>
        <span>/</span>
        {post.tag && <><span>{post.tag}</span><span>/</span></>}
        <span style={{ color: "#3b5b85" }}>{post.title}</span>
      </div>

      {/* ARTICLE HEAD */}
      <header style={{ maxWidth: 760, margin: "0 auto", padding: "clamp(2rem, 8vw, 4rem) clamp(1rem, 5vw, 3.5rem) 2rem", textAlign: "center" }}>
        <div className="flex flex-wrap justify-center gap-3 mb-5 text-xs tracking-[1.5px] uppercase" style={{ color: "#5a5236" }}>
          {post.tag && <span style={{ background: "#7a9bc1", color: "#1a1a1a", padding: "4px 12px", borderRadius: 9999 }}>{post.tag}</span>}
          {post.publishedAt && <span>{new Date(post.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>}
          {post.readTime && <span>· {post.readTime} min read</span>}
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(2.5rem, 9vw, 4rem)", lineHeight: 1.05, letterSpacing: "-0.03em", margin: "0 0 20px" }}>
          {post.title}
        </h1>
        {post.excerpt && (
          <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "clamp(1.1rem, 3vw, 1.375rem)", lineHeight: 1.4, color: "#3a3528", maxWidth: 600, margin: "0 auto 28px" }}>{post.excerpt}</p>
        )}
        <div className="flex justify-center items-center gap-3 text-sm mb-3" style={{ color: "#5a5236" }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", overflow: "hidden", border: "1.5px solid #1a1a1a" }}>
            <img src="https://picsum.photos/seed/donna-by/80/80" alt="Donna" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <span>by <strong>Donna</strong></span>
          <span>·</span>
          <span className="hidden sm:inline">posted from the kitchen, 9:14am</span>
        </div>
      </header>

      {/* HERO IMAGE */}
      <div style={{ maxWidth: 1100, margin: "0 auto 4rem", padding: "0 clamp(1rem, 5vw, 3.5rem)" }}>
        <div style={{ borderRadius: 24, overflow: "hidden", border: "2px solid #1a1a1a", transform: "rotate(-0.5deg)" }}>
          <img src="https://picsum.photos/seed/journal-hero-post/1100/618" alt={post.title} style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", display: "block" }} />
        </div>
        <div style={{ fontFamily: "var(--font-hand)", fontSize: 20, color: "#5a5236", textAlign: "center", marginTop: 12 }}>the patient — Donna&apos;s workbench ✿</div>
      </div>

      {/* BODY */}
      <article style={{ maxWidth: 720, margin: "0 auto", padding: "0 clamp(1rem, 5vw, 3.5rem) 4rem" }}>
        {post.body ? (
          <PortableText value={post.body} components={portableTextComponents} />
        ) : (
          <p style={{ fontSize: 18, lineHeight: 1.7, color: "#2a2418" }}>
            This post&apos;s content is coming soon. Add it via Sanity Studio.
          </p>
        )}
      </article>

      {/* TAGS + SHARE */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "2rem clamp(1rem, 5vw, 3.5rem) 4rem", borderTop: "1px solid #d9cfb6", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div className="flex gap-2 flex-wrap">
          {[post.tag, "Handmade"].filter(Boolean).map((t) => (
            <span key={t} style={{ background: "transparent", border: "1.5px solid #1a1a1a", padding: "6px 12px", borderRadius: 9999, fontSize: 12, letterSpacing: 1, textTransform: "uppercase" }}>{t}</span>
          ))}
        </div>
        <div className="flex gap-2 items-center text-sm">
          <span>share ✿</span>
          {[
            ["ig", "Share to Instagram"],
            ["pn", "Pin to Pinterest"],
            ["↗", "Copy share link"],
          ].map(([label, aria]) => (
            <button
              key={label}
              aria-label={aria}
              style={{ width: 36, height: 36, borderRadius: "50%", border: "1.5px solid #1a1a1a", background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, cursor: "pointer" }}
            >
              <span aria-hidden="true">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* AUTHOR */}
      <div style={{ maxWidth: 880, margin: "0 auto 3.5rem", padding: "0 clamp(1rem, 5vw, 3.5rem)" }}>
        <div style={{ background: "#fff", border: "2px solid #1a1a1a", borderRadius: 24, padding: "1.5rem", display: "flex", flexWrap: "wrap", gap: 24, alignItems: "center" }}>
          <div style={{ width: 90, height: 90, borderRadius: "50%", overflow: "hidden", border: "2px solid #1a1a1a", flexShrink: 0 }}>
            <img src="https://picsum.photos/seed/donna-author/120/120" alt="Donna" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontFamily: "var(--font-hand)", fontSize: 20, color: "#ee7c5a" }}>about the author ✿</div>
            <h4 style={{ fontFamily: "var(--font-display)", fontSize: 22, margin: "0 0 8px", letterSpacing: -0.4 }}>Donna</h4>
            <p style={{ fontSize: 15, lineHeight: 1.55, color: "#3a3528", margin: 0 }}>
              I rescue old denim from thrift stores and skips, and stitch it into jackets, jeans and totes from a small studio (kitchen) in Portland. Custom orders open year-round.
            </p>
          </div>
        </div>
      </div>

      {/* RELATED */}
      {related.length > 0 && (
        <section className="px-4 md:px-14 pb-16 pt-8 border-t border-[#1a1a1a]">
          <div className="flex justify-between items-baseline mb-6">
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem, 4vw, 2rem)", letterSpacing: -0.6, margin: 0 }}>Keep reading</h3>
            <div style={{ fontFamily: "var(--font-hand)", fontSize: 20, color: "#ee7c5a" }}>more ✿</div>
          </div>
          <div className="layout-related-3">
            {related.map((r, i) => (
              <article key={r._id} className="cursor-pointer">
                <div style={{ borderRadius: 16, overflow: "hidden", border: "2px solid #1a1a1a", marginBottom: 12 }}>
                  <img src={RELATED_IMAGES[i % 3]} alt={r.title} style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block" }} />
                </div>
                <div style={{ fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: "#6a5d44", marginBottom: 4 }}>
                  {r.tag} · {r.publishedAt ? new Date(r.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : ""}
                </div>
                <Link href={`/journal/${r.slug?.current}`} style={{ fontFamily: "var(--font-display)", fontSize: 18, lineHeight: 1.2, margin: 0, color: "#1a1a1a", textDecoration: "none", display: "block" }}>{r.title}</Link>
              </article>
            ))}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
