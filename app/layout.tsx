import type { Metadata } from "next";
import "./globals.css";
import { safeJsonLd } from "@/lib/escape";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://donnaupcyclesit.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Donna Upcycles It",
    template: "%s — Donna Upcycles It",
  },
  description:
    "One-of-a-kind upcycled denim jackets, jeans, and totes handmade by Donna in Portland, Oregon. Each piece is sourced from thrift stores, reworked by hand, signed, and numbered. No two are ever the same.",
  keywords: [
    "upcycled denim",
    "reworked denim",
    "sustainable fashion",
    "handmade jackets",
    "denim totes",
    "Portland Oregon",
    "one of a kind clothing",
    "thrifted denim",
    "custom denim jacket",
    "slow fashion",
  ],
  authors: [{ name: "Donna" }],
  creator: "Donna Upcycles It",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Donna Upcycles It",
    title: "Donna Upcycles It — One-of-one upcycled denim from Portland, OR",
    description:
      "One-of-a-kind upcycled denim jackets, jeans, and totes handmade by Donna in Portland, Oregon. Each piece signed and numbered.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Donna Upcycles It",
    description: "One-of-a-kind upcycled denim from Portland, OR.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": SITE_URL,
    name: "Donna Upcycles It",
    description:
      "One-of-a-kind upcycled denim jackets, jeans, and totes handmade by Donna in Portland, Oregon.",
    url: SITE_URL,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Portland",
      addressRegion: "OR",
      addressCountry: "US",
    },
    founder: { "@type": "Person", name: "Donna" },
    priceRange: "$$",
    currenciesAccepted: "USD",
    paymentAccepted: "Credit Card",
    category: "Clothing Store",
  };

  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(orgJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
