import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Logits.App",
  description: "A modern, terminal-inspired AI chat interface with persistent history and multiple AI models",
  keywords: ["AI", "chat", "terminal", "OpenRouter", "artificial intelligence", "conversation"],
  authors: [{ name: "Logits.App" }],
  creator: "Logits.App",
  publisher: "Logits.App",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  manifest: "/manifest.json",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#181818" },
  ],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://logits.app",
    title: "Logits.App - AI Chat Interface",
    description: "A modern, terminal-inspired AI chat interface with persistent history and multiple AI models",
    siteName: "Logits.App",
  },
  twitter: {
    card: "summary_large_image",
    title: "Logits.App - AI Chat Interface",
    description: "A modern, terminal-inspired AI chat interface with persistent history and multiple AI models",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}


