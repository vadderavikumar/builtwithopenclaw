import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/json-ld";
import { buildMetadata, getBaseUrl } from "@/lib/metadata";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseMetadata = buildMetadata({
  title: "BuiltWithOpenClaw - Curated Directory of OpenClaw Products",
  description:
    "A curated directory of products built with OpenClaw. Discover SaaS, tools, plugins, skills, and extensions. Find the best OpenClaw-powered applications.",
  path: "/",
  keywords: [
    "OpenClaw",
    "OpenClaw directory",
    "OpenClaw products",
    "OpenClaw SaaS",
    "OpenClaw plugins",
    "OpenClaw skills",
    "AI assistant directory",
    "built with OpenClaw",
  ],
});

export const metadata: Metadata = {
  ...baseMetadata,
  title: {
    default: "BuiltWithOpenClaw - Curated Directory of OpenClaw Products",
    template: "%s | BuiltWithOpenClaw",
  },
  metadataBase: new URL(getBaseUrl()),
  icons: {
    icon: [
      { url: "/openclaw-logo.png", type: "image/png" },
    ],
    shortcut: ["/openclaw-logo.png"],
    apple: [
      { url: "/openclaw-logo.png", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        <ThemeProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
        {process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN && (
          <Script
            defer
            data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
            src="https://plausible.io/js/script.js"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
