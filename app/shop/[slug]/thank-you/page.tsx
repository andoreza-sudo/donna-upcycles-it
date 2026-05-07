import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export default function ThankYouPage() {
  return (
    <div style={{ background: "#fffaf0", color: "#1a1a1a", fontFamily: "var(--font-sans)", minHeight: "100vh" }}>
      <Nav />
      <section className="flex flex-col items-center justify-center py-32 px-14 text-center">
        <div style={{ fontFamily: "var(--font-hand)", fontSize: 32, color: "#ee7c5a", marginBottom: 16 }}>
          order placed ✿
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 72, lineHeight: 0.95, letterSpacing: -2, margin: "0 0 24px" }}>
          thank you so much!
        </h1>
        <p style={{ fontSize: 18, lineHeight: 1.6, maxWidth: 520, marginBottom: 32, color: "#3a3528" }}>
          Donna will get your piece packed up and shipped within 2–3 days. You&apos;ll get an email confirmation shortly. Questions? Just reply to that email.
        </p>
        <div style={{ background: "#3b5b85", color: "#fffaf0", borderRadius: 24, padding: "32px 40px", maxWidth: 480, width: "100%", textAlign: "left", border: "2px solid #1a1a1a", marginBottom: 40 }}>
          <div style={{ fontFamily: "var(--font-hand)", fontSize: 24, marginBottom: 8 }}>what happens next?</div>
          <ol style={{ paddingLeft: 20, fontSize: 15, lineHeight: 1.7, opacity: 0.9 }}>
            <li>Donna gets notified immediately (she&apos;ll do a little happy dance)</li>
            <li>Your piece gets carefully packaged — usually in 1–2 days</li>
            <li>You get a shipping notification with tracking</li>
            <li>It arrives! Wear it forever.</li>
          </ol>
        </div>
        <Link href="/shop" style={{ background: "#1a1a1a", color: "#fffaf0", padding: "16px 32px", borderRadius: 9999, fontSize: 15, textDecoration: "none", display: "inline-block" }}>
          Keep shopping →
        </Link>
      </section>
      <Footer />
    </div>
  );
}
