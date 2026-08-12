import type { Metadata } from "next"
import { Golos_Text } from "next/font/google"
import { cookies } from "next/headers"

import { GateNotConfigured, PasswordGate } from "./PasswordGate"
import { isAuthorized, KDL_AUTH_COOKIE } from "./gate"
import "./kit-digital-logistics.css"

// Golos Text — гарнитура бренда ТК КИТ (установлено программным разбором
// tk-kit.ru 12.08.2026). Используется для заголовков, меток и чисел;
// основной текст — Inter из корневого layout.
const golos = Golos_Text({
  variable: "--font-kdl",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  display: "swap",
})

// Закрытый проектный документ: доступ по паролю, вне навигации,
// вне sitemap, вне поисковой выдачи. Префикс /presentation/ уже покрыт
// заголовком X-Robots-Tag (next.config.ts) и Disallow в robots.ts.
export const metadata: Metadata = {
  title: "ТК КИТ — цифровой контур магистральной и автономной логистики",
  description:
    "Закрытый проектный документ для рабочей встречи. Проектная концепция поэтапного развития цифрового контура магистральной логистики.",
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
  twitter: undefined,
}

/**
 * Единственная точка контроля доступа для всего раздела: проверка в layout
 * покрывает основную страницу и все deep dives, включая те, что будут
 * добавлены позже. Незащищённый маршрут внутри раздела создать нельзя.
 */
export default async function KitProposalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const secret = process.env.KIT_PROPOSAL_PASSWORD

  if (!secret) {
    return (
      <div className={`kdl-root ${golos.variable}`}>
        <GateNotConfigured />
      </div>
    )
  }

  const store = await cookies()
  const authed = isAuthorized(store.get(KDL_AUTH_COOKIE)?.value, secret)

  return (
    <div className={`kdl-root ${golos.variable}`}>
      {authed ? children : <PasswordGate />}
    </div>
  )
}
