import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ButterflyIcon } from "@/components/ButterflyIcon";
import { getSiteSettings } from "@/lib/queries";

export default async function AboutPage() {
  const settings = await getSiteSettings().catch(() => null);

  return (
    <div style={{ background: "#fffaf0", color: "#1a1a1a", fontFamily: "var(--font-sans)", minHeight: "100vh" }}>
      <Nav donnaPhoto={settings?.donnaPhoto} />

      {/* HEADER */}
      <section className="px-14 py-16 relative" style={{ borderBottom: "1px solid #1a1a1a", display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 56, alignItems: "end" }}>
        <div>
          <div style={{ fontFamily: "var(--font-hand)", fontSize: 26, color: "#ee7c5a", marginBottom: 8 }}>✿ the story so far</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 100, lineHeight: 0.92, letterSpacing: -3, margin: 0 }}>
            Hi, I&apos;m <span style={{ fontStyle: "italic", color: "#3b5b85" }}>Donna</span>.
          </h1>
        </div>
        <p style={{ fontSize: 18, lineHeight: 1.6, color: "#3a3528", paddingBottom: 12 }}>
          I rescue old denim from thrift stores and back rooms across Portland, and stitch it into one-of-a-kind jackets, jeans, and totes — from my kitchen.
        </p>
        <div className="absolute top-6 right-14 flex gap-2">
          <span style={{ transform: "rotate(-12deg)", display: "inline-block" }}><ButterflyIcon color="#3b5b85" accent="#ee7c5a" size={32} /></span>
          <span style={{ transform: "rotate(8deg) translateY(6px)", display: "inline-block" }}><ButterflyIcon color="#ee7c5a" accent="#3b5b85" size={26} /></span>
        </div>
      </section>

      {/* MAIN STORY */}
      <section className="px-14 py-16" style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 64, alignItems: "center" }}>
        <div style={{ transform: "rotate(-2deg)" }}>
          <div style={{ background: "#fff", padding: 16, paddingBottom: 48, border: "2px solid #1a1a1a", boxShadow: "8px 8px 0 rgba(0,0,0,.08)" }}>
            <img src="https://picsum.photos/seed/donna-about-main/600/600" alt="Donna at her sewing machine" style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", display: "block" }} />
            <div style={{ position: "absolute", bottom: 14, left: 0, right: 0, textAlign: "center", fontFamily: "var(--font-hand)", fontSize: 22, color: "#1a1a1a" }}>the kitchen-table studio, portland ✿</div>
          </div>
        </div>
        <div>
          <h2 style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 56, lineHeight: 0.95, letterSpacing: -1, margin: "0 0 24px" }}>
            {settings?.aboutTitle || "I just couldn't throw them out."}
          </h2>
          {settings?.aboutBody ? (
            <p style={{ fontSize: 17, lineHeight: 1.7, color: "#3a3528", marginBottom: 18 }}>{settings.aboutBody}</p>
          ) : (
            <>
              <p style={{ fontSize: 17, lineHeight: 1.7, color: "#3a3528", marginBottom: 18 }}>
                It started with one pair of jeans I loved too much to bin. A 1993 Levi&apos;s 501, perfectly faded, with a tear at the knee that felt like it had a story. Instead of chucking them, I took them apart — seam by seam — and patched together something new.
              </p>
              <p style={{ fontSize: 17, lineHeight: 1.7, color: "#3a3528", marginBottom: 18 }}>
                Now there&apos;s a stack of forty pairs in the spare room and an industrial sewing machine where the dining table used to be. I source from thrift stores, estate sales, and the occasional skip. Every piece is washed twice, mended where needed, then reworked into something you can actually wear.
              </p>
              <p style={{ fontSize: 17, lineHeight: 1.7, color: "#3a3528", marginBottom: 28 }}>
                Every piece in the shop is signed in the inner seam and numbered in the drop. No two are the same. That&apos;s the whole point.
              </p>
            </>
          )}
          <Link href="/shop" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#1a1a1a", color: "#fffaf0", padding: "14px 26px", borderRadius: 9999, fontSize: 15, textDecoration: "none" }}>
            Shop the current drop →
          </Link>
        </div>
      </section>

      {/* VALUES STRIP */}
      <section className="mx-14 mb-14 rounded-[32px] px-12 py-10 border-2 border-[#1a1a1a]" style={{ background: "#fdf3df" }}>
        <div style={{ fontFamily: "var(--font-hand)", fontSize: 26, color: "#ee7c5a", marginBottom: 8 }}>how it works ✿</div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 44, letterSpacing: -1, margin: "0 0 32px" }}>Every piece, start to finish</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
          {[
            ["01", "Source", "Portland thrift stores, estate sales, and the occasional skip. Only quality denim worth saving."],
            ["02", "Wash & Inspect", "Everything washed twice, checked seam by seam. If it&apos;s not up to it, it becomes a tote strap."],
            ["03", "Rework", "Hand-cut, machine-sewn, hand-embroidered. 4–8 hours per piece depending on complexity."],
            ["04", "Sign & Number", "Signed in the inner seam, numbered in the drop. Yours forever."],
          ].map(([n, title, desc]) => (
            <div key={n} className="flex flex-col gap-3">
              <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 48, color: "#ee7c5a", lineHeight: 1 }}>{n}</div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 24, margin: 0, letterSpacing: -0.4 }}>{title}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: "#5a5236", margin: 0 }} dangerouslySetInnerHTML={{ __html: desc as string }} />
            </div>
          ))}
        </div>
      </section>

      {/* CUSTOM CTA */}
      <section className="mx-14 mb-16 rounded-[32px] px-12 py-10 border-2 border-[#1a1a1a] relative" style={{ background: "#3b5b85", color: "#fffaf0" }}>
        <div style={{ position: "absolute", top: -16, left: 40, background: "#fffaf0", color: "#1a1a1a", padding: "6px 14px", borderRadius: 9999, border: "2px solid #1a1a1a", fontFamily: "var(--font-hand)", fontSize: 20 }}>custom orders ✿</div>
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 48, alignItems: "center" }}>
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 56, lineHeight: 0.95, letterSpacing: -1, margin: "0 0 18px" }}>Got your granddad&apos;s old jeans?</h2>
            <p style={{ fontSize: 17, lineHeight: 1.5, marginBottom: 24, opacity: 0.9 }}>Donna takes custom orders year-round. Send your denim, your idea, and a rough size — she&apos;ll come back with a price and a timeline. 50% deposit, balance when it ships.</p>
            <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#fffaf0", color: "#1a1a1a", padding: "14px 26px", borderRadius: 9999, fontSize: 15, textDecoration: "none", fontWeight: 500 }}>
              Request a custom order →
            </Link>
          </div>
          <div style={{ transform: "rotate(2deg)" }}>
            <div style={{ background: "#fffaf0", padding: 14, paddingBottom: 38, border: "2px solid #1a1a1a" }}>
              <img src="https://picsum.photos/seed/custom-order/400/400" alt="custom work" style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", display: "block" }} />
              <div style={{ textAlign: "center", marginTop: 8, fontFamily: "var(--font-hand)", fontSize: 20, color: "#1a1a1a" }}>rachel&apos;s granddad&apos;s wranglers ✿</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
