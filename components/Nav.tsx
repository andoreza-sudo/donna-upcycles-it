"use client";

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

  return (
    <nav
      className="flex items-center justify-between px-14 py-[26px] border-b border-dashed border-[#c9b890]"
      style={{ borderBottomStyle: "dashed" }}
    >
      {/* WORDMARK */}
      <div className="flex items-center gap-[14px]">
        <div
          className="relative flex-shrink-0 rounded-full overflow-hidden border-2 border-fg"
          style={{ width: 64, height: 64 }}
        >
          <ProductImage
            photo={donnaPhoto}
            alt="Donna"
            aspect="1 / 1"
            placeholderTone="denim"
            placeholderLabel=""
          />
        </div>
        <Link href="/" className="flex flex-col" style={{ fontFamily: "var(--font-hand)", fontSize: 36, lineHeight: 1, color: "#3b5b85", textDecoration: "none" }}>
          <span>Donna</span>
          <span style={{ marginTop: -8, marginLeft: 30, fontSize: 22, color: "#ee7c5a", whiteSpace: "nowrap" }}>upcycles it.</span>
        </Link>
        <div className="inline-flex items-center gap-2 ml-[14px]">
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

      {/* LINKS */}
      <div className="flex gap-7 text-sm tracking-[0.3px]">
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

      {/* CART PILL */}
      <div
        className="flex items-center gap-2 border border-[#1a1a1a] rounded-full px-4 py-2 text-sm tracking-[0.4px]"
        style={{ borderWidth: "1.5px" }}
      >
        Bag · 0
      </div>
    </nav>
  );
}
