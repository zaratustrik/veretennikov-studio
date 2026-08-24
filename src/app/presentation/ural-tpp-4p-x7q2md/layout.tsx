import type { Metadata } from "next"
import { cookies } from "next/headers"

import { PasswordGate } from "./PasswordGate"
import { isAuthorized, UTPP_AUTH_COOKIE } from "./gate"
import "./utpp.css"

// Рендерим на каждый запрос, а не собираем статически. Две причины:
// ① включение парольного входа должно срабатывать сразу после перезапуска
//    процесса, без пересборки приложения;
// ② закрытый материал не должен оседать в кэшах как статика.
export const dynamic = "force-dynamic"

// Превью: вне навигации, вне sitemap, вне поисковой выдачи.
// Префикс /presentation/ уже покрыт заголовком X-Robots-Tag (next.config.ts)
// и Disallow в robots.ts — метатег здесь третий рубеж.
export const metadata: Metadata = {
  title: "ИИ в работе руководителя — мастер-класс 4П",
  description:
    "Закрытая рабочая версия мастер-класса для Уральской ТПП: от личного чата к контуру организации.",
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
 * Единственная точка контроля доступа для всего раздела.
 *
 * Режим доступа определяется наличием переменной окружения UTPP_MC_PASSWORD:
 *
 *  • переменная НЕ задана — материал открывается по прямой ссылке.
 *    Индексация закрыта на четырёх уровнях (заголовок X-Robots-Tag, метатег,
 *    robots.txt, отсутствие в sitemap), ссылки в навигации сайта нет.
 *
 *  • переменная задана — включается парольный вход с httpOnly-cookie.
 *    Включение и отключение не требуют правки кода и пересборки: достаточно
 *    добавить или удалить строку в .env.production и выполнить
 *    `pm2 reload studio --update-env`.
 */
export default async function UtppMasterclassLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const secret = process.env.UTPP_MC_PASSWORD

  if (!secret) {
    return <div className="utpp-root">{children}</div>
  }

  const store = await cookies()
  const authed = isAuthorized(store.get(UTPP_AUTH_COOKIE)?.value, secret)

  return <div className="utpp-root">{authed ? children : <PasswordGate />}</div>
}
