import type { Metadata } from "next";
import { Manrope } from "next/font/google";

// Manrope для заголовков (как в MVP «Карандаш»); Inter для текста наследуется
// из корневого layout как --font-sans. Переменная скоупится на обёртку .kb-root.
const manrope = Manrope({
  variable: "--font-manrope-kb",
  subsets: ["latin", "cyrillic"],
  display: "swap"
});

// Служебная страница: не индексируется и не попадает в публичное меню/sitemap.
export const metadata: Metadata = {
  title: "Бриф по новому сайту — Карандаш",
  description: "Рабочий инструмент для подготовки технического задания сайта «Карандаш».",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false }
  }
};

export default function KarandashBriefLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`kb-root font-sans ${manrope.variable}`}>
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex h-16 max-w-3xl items-center gap-3 px-5 sm:px-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/karandash-logo.png" alt="Карандаш" className="h-8 w-auto object-contain" />
          <span className="text-sm font-medium text-muted">Бриф по новому сайту</span>
        </div>
      </header>
      {children}
    </div>
  );
}
