import Link from "next/link";

export function Footer() {
  return (
    <footer className="flex justify-between items-center flex-wrap gap-4 px-14 py-10 border-t-2 border-[#1a1a1a] mt-auto">
      <div style={{ fontFamily: "var(--font-hand)", fontSize: 22 }}>
        made with love in portland ✿ © donna 2026
      </div>
      <div className="flex gap-[18px] text-sm">
        <Link href="https://instagram.com" target="_blank" rel="noopener" className="text-fg hover:text-denim no-underline">instagram</Link>
        <Link href="/contact" className="text-fg hover:text-denim no-underline">contact</Link>
        <a className="text-fg hover:text-denim no-underline cursor-pointer">shipping</a>
        <a className="text-fg hover:text-denim no-underline cursor-pointer">returns</a>
      </div>
    </footer>
  );
}
