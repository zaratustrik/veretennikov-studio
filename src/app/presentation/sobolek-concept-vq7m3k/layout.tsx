import type { Metadata } from "next";
import { Manrope } from "next/font/google";

// Manrope — для заголовков презентации (дружелюбный гротеск, рифмуется
// с округлой пластикой персонажа). Текст — Inter из корневого layout.
const manrope = Manrope({
  variable: "--font-manrope-sb",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

// Закрытая презентационная страница: доступна только по прямой ссылке,
// не участвует в меню, sitemap и поисковой выдаче.
export const metadata: Metadata = {
  title: "Соболёк — фирменный 3D-маскот Движения",
  description:
    "Предлагаемое направление разработки фирменного 3D-маскота для платформы «Урал: за медицину здорового долголетия».",
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

export default function SobolekLayout({ children }: { children: React.ReactNode }) {
  return <div className={`sb-root ${manrope.variable}`}>{children}</div>;
}
