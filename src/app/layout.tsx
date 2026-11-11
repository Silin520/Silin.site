import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "@fontsource-variable/inter";
import "@fontsource-variable/space-grotesk";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "@fontsource/silkscreen/400.css";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ParticleBackground } from "@/components/visual/ParticleBackground";

export const metadata: Metadata = {
  title: { default: "SILIN SPACE — Digital Phantom", template: "%s — SILIN SPACE" },
  description: "SILIN SPACE — a personal digital art space: journal, works, visual archive and guestbook.",
};

export const viewport: Viewport = {
  themeColor: "#05060B",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-neon-cyan focus:px-4 focus:py-2 focus:text-void"
        >
          Skip to content
        </a>
        <ParticleBackground />
        <div className="grain-layer" aria-hidden="true" />
        <div className="scan-layer" aria-hidden="true" />
        <div className="relative z-10 flex min-h-svh flex-col">
          <Navbar />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
