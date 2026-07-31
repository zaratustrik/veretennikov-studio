import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";

import "./invest-climate.css";

// IBM Plex Sans — заголовки/акценты аналитической страницы (строгий гротеск,
// табличные цифры, полная кириллица). Текст — Inter из корневого layout.
const plexSans = IBM_Plex_Sans({
  variable: "--font-ic",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Закрытая аналитическая страница: доступна по прямой ссылке и паролю,
// не участвует в меню, sitemap и поисковой выдаче.
export const metadata: Metadata = {
  title: "Инвестиционный климат Свердловской области",
  description:
    "Доказательный аудит дорожной карты Национального рейтинга и предложения по новой редакции. Закрытый аналитический материал для обсуждения.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    noarchive: true,
    nosnippet: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
  alternates: { canonical: null },
  openGraph: undefined,
};

export default function InvestClimateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={`ic-root ${plexSans.variable}`}>{children}</div>;
}
