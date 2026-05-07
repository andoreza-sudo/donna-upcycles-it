import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Donna Upcycles It",
  description: "One-of-a-kind upcycled denim — jackets, jeans, and totes handmade by Donna in Portland, Oregon.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
