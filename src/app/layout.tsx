import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const display = Source_Serif_4({
  variable: "--font-display",
  subsets: ["latin", "cyrillic"],
  axes: ["opsz"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Veretennikov Studio",
    template: "%s — Veretennikov Studio",
  },
  description:
    "AI-автоматизация и корпоративный видеопродакшн. Системы и истории в одном брифе.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#F9F7F2",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${inter.variable} ${mono.variable} ${display.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
