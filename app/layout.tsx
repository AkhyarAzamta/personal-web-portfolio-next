import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Font untuk teks (tetap pakai next/font)
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Akhyar Azamta | Mainframe",
  description: "Portfolio of Akhyar Azamta – Systems Architect & Protocol Breaker",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
  generator: "Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`
        ${geistSans.variable}
        ${geistMono.variable}
        ${inter.variable}
        ${spaceGrotesk.variable}
        ${jetbrainsMono.variable}
        dark
        h-full
        antialiased
      `}
      style={{ backgroundColor: "#0a0a0a" }}
    >
      <body className="min-h-dvh relative overflow-x-hidden antialiased">
        <div className="fixed inset-0 w-full h-full grid-overlay z-[-1] pointer-events-none" />
        <div className="scanline" />
        <div className="overflow-x-hidden w-full max-w-[100vw]">
          {children}
        </div>
      </body>
    </html>
  );
}