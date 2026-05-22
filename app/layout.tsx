import type { Metadata } from "next";
import Script from "next/script";

import Providers from "@/app/providers";
import "./globals.css";

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {"try{var t=localStorage.getItem('theme');if(t==='dark'){document.documentElement.classList.add('dark')}}catch(e){}"}
        </Script>
        {process.env.NODE_ENV !== "production" ? (
          <Script id="disable-next-dev-indicator" strategy="beforeInteractive">
            {"try{fetch('/__nextjs_disable_dev_indicator').catch(function(){});}catch(e){}"}
          </Script>
        ) : null}
      </head>
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased [font-family:var(--font-body)]">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
