import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";

// next/font downloads the fonts at build time and serves them from our own domain
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Abricot",
  description: "Gestion de projet collaboratif",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${manrope.variable} ${inter.variable}`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
