import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Source_Serif_4 } from "next/font/google";
import JsonLd from "@/components/JsonLd";
import YandexMetrika from "@/components/YandexMetrika";
import { organizationSchema, websiteSchema, personSchema } from "@/lib/seo";
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

const SITE_URL = "https://www.veretennikov.info";
const SITE_NAME = "Veretennikov Studio";
const SITE_DESCRIPTION =
  "Студия в Екатеринбурге: разработка ПО для бизнес-процессов и корпоративный видеопродакшн. Работаем с госсектором, промышленностью, крупным бизнесом.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: "%s — Veretennikov Studio",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: "Анатолий Веретенников", url: SITE_URL }],
  creator: "Анатолий Веретенников",
  publisher: SITE_NAME,
  keywords: [
    "AI-автоматизация",
    "видеопродакшн",
    "корпоративный фильм",
    "разработка ПО",
    "Екатеринбург",
    "Veretennikov Studio",
    "Анатолий Веретенников",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_SITE_VERIFICATION,
  },
  icons: {
    icon: "/favicon.ico",
  },
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
      <body className="min-h-full flex flex-col">
        <JsonLd data={[organizationSchema, websiteSchema, personSchema]} />
        {children}
        <YandexMetrika />
      </body>
    </html>
  );
}
