import type { Metadata } from "next";
import { Merriweather, Inter } from "next/font/google";

import ThemeToggle from "@/components/ThemeToggle";
import Providers from "@/app/providers";
import "./globals.css";

const headingFont = Merriweather({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "700"],
});

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME ?? "FDBK",
  description: "Anonymous survey platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${headingFont.variable} ${bodyFont.variable}`}>
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased [font-family:var(--font-body)]">
        <Providers>
          <ThemeToggle />
          {children}
        </Providers>
      </body>
    </html>
  );
}
