import type { Metadata } from "next"

import "./utpp-page.css"

/**
 * Рендерим на каждый запрос, а не собираем статически. Две причины:
 * ① включение и отключение доступа должно срабатывать сразу после
 *    `pm2 reload --update-env`, без пересборки;
 * ② закрытый материал не должен оседать в кэшах как статика.
 */
export const dynamic = "force-dynamic"

/**
 * Вне навигации, вне sitemap, вне поисковой выдачи.
 * Префикс /utpp закрыт заголовком X-Robots-Tag (next.config.ts) —
 * метатег здесь второй рубеж.
 *
 * openGraph и twitter погашены явно: иначе корневой layout подставит
 * общие теги сайта, и превью ссылки в мессенджере покажет карточку студии
 * там, где не должно быть ничего.
 */
export const metadata: Metadata = {
  title: { absolute: "Пять цифровых инициатив УТПП" },
  description: "Закрытый рабочий документ предпроектной проработки.",
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
 * Layout только оформляет раздел. Контроль доступа стоит в page.tsx —
 * см. комментарий там: гейт в layout не мешает Next сериализовать
 * страницу в RSC-payload и отдать её содержание в HTML.
 */
export default function UtppPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="utpp-page-root">
      {/*
        Страховка читаемости. Блоки появления рендерятся на сервере с
        inline `opacity:0` — это нормально, пока анимацию доигрывает клиент.
        Но документ не имеет права зависеть от эффекта: без JavaScript
        содержание должно оставаться видимым.
      */}
      <noscript>
        <style>{`.utpp-page-main [style*="opacity:0"]{opacity:1!important;transform:none!important}`}</style>
      </noscript>
      {children}
    </div>
  )
}
