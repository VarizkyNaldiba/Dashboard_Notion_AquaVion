import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PBL Smt 6 | Notion",
  description: "Notion-like dashboard for PBL Smt 6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[var(--color-notion-bg)] text-[var(--color-notion-text)]">
        {children}
      </body>
    </html>
  );
}
