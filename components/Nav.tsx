"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ButterflyIcon } from "./ButterflyIcon";
import { ProductImage } from "./ProductImage";

interface NavProps {
  donnaPhoto?: { asset?: { _ref?: string }; alt?: string };
}

const links = [
  { href: "/shop", label: "Shop" },
  { href: "/contact", label: "Custom Orders" },
  { href: "/about", label: "Our Story" },
  { href: "/journal", label: "Journal" },
];

export function Nav({ donnaPhoto }: NavProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="relative border-b border-dashed border-[#c9b890]" style={{ borderBottomStyle: "dashed" }}>
      {/* ── Main bar ── */}
      <div className="flex items-center justify-between px-4 md:px-14 py-4 md:py-[26px]">

        {/* Wordmark */}
        <div className="flex items-center gap-3 md:gap-[14px]">
          <div
            className="relative flex-shrink-0 rounded-full overflow-hidden border-2 border-[#1a1a1a]"
            style={{ width: 48, height: 48 }}
          >
            <ProductImage
              photo={donnaPhoto}
              alt="Donna"
              aspect="1 / 1"
              placeholderTone="denim"
              placeholderLabel=""
            />
          </div>
          <Link
            href="/"
            className="flex flex-col"
            style={{ fontFamily: "var(--font-hand)", fontSize: "clamp(1.4rem, 4vw, 2.25rem)", lineHeight: 1, color: "#3b5b85", textDecoration: "none" }}
          >
            <span>Donna</span>
            <span style={{ marginTop: -6, marginLeft: "0.55em", fontSize: "0.6em", color: "#ee7c5a", whiteSpace: "nowrap" }}>upcycles it.</span>
          </Link>
          {/* Butterfly cluster — desktop only */}
          <div className="hidden md:inline-flex items-center gap-2 ml-[14px]">
            <span style={{ transform: "rotate(-12deg) translateY(-6px)", display: "inline-block" }}>
              <ButterflyIcon color="#3b5b85" accent="#ee7c5a" size={30} />
            </span>
            <span style={{ transform: "rotate(8deg) translateY(2px)", display: "inline-block" }}>
              <ButterflyIcon color="#ee7c5a" accent="#3b5b85" size={36} />
            </span>
            <span style={{ transform: "rotate(-4deg) translateY(-3px)", display: "inline-block" }}>
              <ButterflyIcon color="#3b5b85" accent="#ee7c5a" size={26} />
            </span>
          </div>
        </div>

        {/* Desktop: nav links */}
        <div className="hidden md:flex gap-7 text-sm tracking-[0.3px]">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="relative pb-1 no-underline"
              style={{
                color: pathname.startsWith(l.href) ? "#3b5b85" : "#1a1a1a",
                borderBottom: pathname.startsWith(l.href) ? "2px solid #3b5b85" : "none",
              } as React.CSSProperties}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Desktop: cart pill */}
        <div className="hidden md:flex items-center gap-2 border border-[#1a1a1a] rounded-full px-4 py-2 text-sm tracking-[0.4px]" style={{ borderWidth: "1.5px" }}>
          Bag · 0
        </div>

        {/* Mobile: cart pill + hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <div className="flex items-center border border-[#1a1a1a] rounded-full px-3 py-1.5 text-sm" style={{ borderWidth: "1.5px" }}>
            Bag · 0
          </div>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-[#1a1a1a] text-lg"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            style={{ background: menuOpen ? "#1a1a1a" : "transparent", color: menuOpen ? "#fffaf0" : "#1a1a1a" }}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* ── Mobile dropdown menu ── */}
      {menuOpen && (
        <div
          className="md:hidden border-t border-dashed border-[#c9b890] px-4 pb-4 flex flex-col"
          style={{ background: "#fffaf0" }}
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="py-4 border-b border-[#e8dfcc] no-underline"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 24,
                color: pathname.startsWith(l.href) ? "#3b5b85" : "#1a1a1a",
              }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setMenuOpen(false)}
            className="mt-4 text-center py-3 rounded-full no-underline text-sm font-medium"
            style={{ background: "#1a1a1a", color: "#fffaf0" }}
          >
            Custom order →
          </Link>
        </div>
      )}
    </nav>
  );
}
