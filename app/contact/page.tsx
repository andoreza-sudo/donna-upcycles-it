"use client";

import { useState } from "react";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

type TopicKey = "custom" | "question" | "sizing" | "other";

const TOPICS: [TopicKey, string][] = [
  ["custom", "Custom order"],
  ["question", "Question about a piece"],
  ["sizing", "Sizing help"],
  ["other", "Something else"],
];

export default function ContactPage() {
  const [topic, setTopic] = useState<TopicKey>("custom");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, name, email, message }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        alert("Something went wrong. Please try again or email directly.");
      }
    } catch {
      alert("Something went wrong. Please try again.");
    }
    setSending(false);
  }

  if (submitted) {
    return (
      <div style={{ background: "#fffaf0", color: "#1a1a1a", fontFamily: "var(--font-sans)", minHeight: "100vh" }}>
        <Nav />
        <div className="flex flex-col items-center justify-center py-24 px-4 md:px-14 text-center">
          <div style={{ fontFamily: "var(--font-hand)", fontSize: 32, color: "#ee7c5a", marginBottom: 16 }}>message sent ✿</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem, 10vw, 4.5rem)", lineHeight: 0.95, letterSpacing: -2, margin: "0 0 24px" }}>Donna will be in touch!</h1>
          <p style={{ fontSize: 18, lineHeight: 1.6, maxWidth: 480, marginBottom: 32, color: "#3a3528" }}>
            She replies to every message herself, usually within a day or two. Custom orders take 3–4 weeks from agreed brief to your door.
          </p>
          <Link href="/shop" style={{ background: "#1a1a1a", color: "#fffaf0", padding: "16px 32px", borderRadius: 9999, fontSize: 15, textDecoration: "none", display: "inline-block" }}>
            Back to the shop →
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ background: "#fffaf0", color: "#1a1a1a", fontFamily: "var(--font-sans)", minHeight: "100vh" }}>
      <Nav />

      <div className="layout-contact">
        {/* LEFT — info */}
        <div className="px-4 md:px-14 py-12 md:py-[72px] flex flex-col gap-6" style={{ borderRight: "1px solid #1a1a1a" }}>
          <div style={{ fontFamily: "var(--font-hand)", fontSize: 26, color: "#ee7c5a" }}>say hello ✿</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem, 9vw, 5rem)", lineHeight: 0.94, letterSpacing: -2, margin: 0 }}>Custom job?<br />Quick question?</h1>
          <p style={{ fontSize: 16, lineHeight: 1.6, maxWidth: 480 }}>
            Donna replies to every email herself, usually within a day or two. Custom orders take 3–4 weeks from agreed brief to your door.
          </p>
          <div className="flex flex-col gap-3 mt-2">
            {[
              ["01", "Send your idea", "Sketches, references, a rough size — anything helps."],
              ["02", "We'll agree a price + timeline", "50% deposit to start, balance when it ships."],
              ["03", "Yours, signed in the seam", "One-of-one, made for you, with photos along the way."],
            ].map(([n, t, d]) => (
              <div key={n} className="flex gap-3 items-start">
                <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 28, color: "#ee7c5a", lineHeight: 1, minWidth: 30 }}>{n}</div>
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 18, marginBottom: 2 }}>{t}</div>
                  <div style={{ fontSize: 14, color: "#5a5236", lineHeight: 1.5 }}>{d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — form */}
        <form className="px-4 md:px-14 py-12 md:py-[72px] flex flex-col gap-[18px]" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1.5">
            <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#4a4530" }}>What&apos;s this about?</div>
            <div className="flex gap-2 flex-wrap">
              {TOPICS.map(([k, l]) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setTopic(k)}
                  style={{
                    padding: "10px 18px",
                    border: "1.5px solid #1a1a1a",
                    background: topic === k ? "#3b5b85" : "transparent",
                    color: topic === k ? "#fffaf0" : "#1a1a1a",
                    borderRadius: 9999,
                    fontSize: 13, cursor: "pointer", fontFamily: "inherit",
                  }}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {[["Your name", "Imogen Hart", name, setName, "text"], ["Email", "hello@…", email, setEmail, "email"]].map(([label, ph, val, setter, type]) => (
              <div key={label as string} className="flex-1 flex flex-col gap-1.5">
                <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#4a4530" }}>{label as string}</div>
                <input
                  type={type as string}
                  value={val as string}
                  onChange={(e) => (setter as (v: string) => void)(e.target.value)}
                  placeholder={ph as string}
                  required
                  style={{ padding: "14px 16px", border: "1.5px solid #1a1a1a", background: "transparent", fontSize: 15, fontFamily: "inherit", color: "#1a1a1a", outline: "none", borderRadius: 12 }}
                />
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-1.5">
            <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#4a4530" }}>Tell Donna everything</div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hi Donna! I've got my granddad's old Wranglers (32W) and would love them turned into a tote…"
              required
              style={{ padding: "14px 16px", border: "1.5px solid #1a1a1a", background: "transparent", fontSize: 15, fontFamily: "inherit", minHeight: 140, resize: "vertical", color: "#1a1a1a", outline: "none", borderRadius: 12 }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#4a4530" }}>Photo references (optional)</div>
            <div style={{ border: "1.5px dashed #1a1a1a", padding: 24, textAlign: "center", fontSize: 13, color: "#5a5236", borderRadius: 12, cursor: "pointer" }}>
              Drop photos here or click to browse · jpg, png up to 10MB
            </div>
          </div>

          <button
            type="submit"
            disabled={sending}
            style={{
              marginTop: 12, background: "#1a1a1a", color: "#fffaf0", border: "none",
              padding: "16px 28px", borderRadius: 9999,
              fontSize: 15, cursor: sending ? "wait" : "pointer", fontFamily: "inherit",
              alignSelf: "flex-start", fontWeight: 500, opacity: sending ? 0.7 : 1,
            }}
          >
            {sending ? "Sending…" : "Send to Donna →"}
          </button>

          <div style={{ fontSize: 12, color: "#5a5236" }}>
            Goes straight to <span style={{ color: "#1a1a1a" }}>donnaupcyclesit@gmail.com</span>. No marketing list, ever.
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}
