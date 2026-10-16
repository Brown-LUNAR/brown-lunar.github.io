import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";

import { ThemeProvider } from "@/context/themeContext";
import { basePath } from "@/lib/basePath";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: "LUNAR Lab",
  description: "LUNAR Lab website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const themeScript = `
    (function() {
      try {
        const theme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', theme);
      } catch (e) {}
    })();
  `;

  const footerBgCss = `
    :root { --footer-bg: url(${basePath}/astronaut-light-mode.png); }
    [data-theme="dark"] { --footer-bg: url(${basePath}/astronaut-dark-mode.png); }
  `;

  return (
    <html lang="en" className={geistSans.variable} suppressHydrationWarning>
      <head>
        {/* Next links icon.svg from the file convention; this is the fallback for
            browsers without SVG favicon support, which would otherwise request
            /favicon.ico at the domain root and miss the basePath. */}
        <link rel="icon" href={`${basePath}/favicon.ico`} sizes="48x48" />
        <style dangerouslySetInnerHTML={{ __html: footerBgCss }} />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
