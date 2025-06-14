import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ModelProvider } from "@/contexts/ModelContext";
import { ApiKeyProvider } from "@/contexts/ApiKeyContext";
import { ThemeWrapper } from "@/components/theme-wrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Logits",
  description: "A terminal-style AI chat interface",
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
        <ThemeProvider>
          <ApiKeyProvider>
            <ModelProvider>
              <ThemeWrapper>
                {children}
              </ThemeWrapper>
            </ModelProvider>
          </ApiKeyProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}


