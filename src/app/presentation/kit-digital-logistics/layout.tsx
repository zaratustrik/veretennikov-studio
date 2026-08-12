import type { Metadata } from "next"
import { Golos_Text } from "next/font/google"
import { cookies } from "next/headers"

import { PasswordGate } from "./PasswordGate"
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

// Рендерим на каждый запрос, а не собираем статически. Две причины:
// ① включение парольного входа (см. ниже) должно срабатывать сразу после
//    перезапуска процесса, без пересборки приложения;
// ② конфиденциальный документ не должен оседать в кэшах как статика.
export const dynamic = "force-dynamic"

// Закрытый проектный документ: вне навигации, вне sitemap, вне поисковой
// выдачи. Префикс /presentation/ уже покрыт заголовком X-Robots-Tag
// (next.config.ts) и Disallow в robots.ts.
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
 * добавлены позже.
 *
 * Режим доступа определяется наличием переменной окружения
 * KIT_PROPOSAL_PASSWORD:
 *
 *  • переменная НЕ задана — документ открывается по прямой ссылке.
 *    Индексация закрыта на четырёх уровнях (заголовок X-Robots-Tag,
 *    метатег, robots.txt, отсутствие в sitemap), аналитика на разделе
 *    не работает, ссылки в навигации сайта нет.
 *
 *  • переменная задана — включается парольный вход с httpOnly-cookie.
 *    Включение и отключение не требуют правки кода и пересборки:
 *    достаточно добавить или удалить строку в .env.production
 *    и выполнить `pm2 reload studio --update-env`.
 */
export default async function KitProposalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const secret = process.env.KIT_PROPOSAL_PASSWORD

  // Доступ по ссылке: пароль не настроен — открываем документ.
  if (!secret) {
    return <div className={`kdl-root ${golos.variable}`}>{children}</div>
  }

  const store = await cookies()
  const authed = isAuthorized(store.get(KDL_AUTH_COOKIE)?.value, secret)

  return (
    <div className={`kdl-root ${golos.variable}`}>
      {authed ? children : <PasswordGate />}
    </div>
  )
}
