"use client"

/**
 * 152-ФЗ / позиция РКН: cookie-идентификаторы веб-аналитики — персональные
 * данные, аналитический счётчик включается только после явного согласия.
 *
 * Этот компонент — и баннер, и загрузчик Яндекс.Метрики:
 *  - выбор хранится в localStorage (`pd-cookie-choice`: "accepted" | "declined");
 *  - Метрика монтируется ТОЛЬКО при "accepted" (после клика или из сохранённого
 *    выбора при следующих визитах);
 *  - «Отклонить» — счётчик не грузится вовсе, баннер больше не показывается;
 *  - на приватных маршрутах (/p/*, /b/*, /admin*) счётчик не грузится никогда.
 *
 * Технически необходимые cookie сайта согласия не требуют — баннер касается
 * только аналитики.
 */

import { useEffect, useState } from "react"
import Script from "next/script"
import { usePathname } from "next/navigation"

const STORAGE_KEY = "pd-cookie-choice" // "accepted" | "declined"

export default function CookieConsent({ metrikaId }: { metrikaId?: string }) {
  const pathname = usePathname()
  const [choice, setChoice] = useState<"accepted" | "declined" | null>(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved === "accepted" || saved === "declined") setChoice(saved)
    } catch {}
    setHydrated(true)
  }, [])

  function decide(value: "accepted" | "declined") {
    try {
      localStorage.setItem(STORAGE_KEY, value)
    } catch {}
    setChoice(value)
  }

  // Приватные маршруты: ни баннера, ни счётчика
  const isPrivate =
    pathname?.startsWith("/p/") ||
    pathname?.startsWith("/b/") ||
    pathname?.startsWith("/presentation/") ||
    pathname?.startsWith("/admin")

  if (isPrivate) return null

  const showMetrika = Boolean(metrikaId) && choice === "accepted"
  const showBanner = hydrated && choice === null

  return (
    <>
      {showMetrika && (
        <Script
          id="yandex-metrika"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(m,e,t,r,i,k,a){
                m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();
                for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
                k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
              })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js?id=${metrikaId}", "ym");

              ym(${metrikaId}, "init", {
                ssr: true,
                webvisor: true,
                clickmap: true,
                ecommerce: "dataLayer",
                referrer: document.referrer,
                url: location.href,
                accurateTrackBounce: true,
                trackLinks: true
              });
            `,
          }}
        />
      )}

      {showBanner && (
        <div
          role="dialog"
          aria-label="Уведомление об использовании cookie"
          className="fixed bottom-0 left-0 right-0 z-[90] border-t border-[var(--rule)]"
          style={{ background: "var(--paper)" }}
        >
          <div
            className="mx-auto px-5 md:px-8 py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6"
            style={{ maxWidth: "var(--content-max)" }}
          >
            <p className="text-[13px] text-[var(--ink-2)] leading-[1.55] flex-1">
              Мы используем cookie Яндекс.Метрики для обезличенной статистики
              посещений — только с вашего согласия. Подробнее — в{" "}
              <a
                href="/privacy"
                className="text-[var(--cobalt)] underline underline-offset-2"
              >
                Политике обработки персональных данных
              </a>
              .
            </p>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => decide("declined")}
                className="px-5 py-2.5 text-[13px] border border-[var(--ink-4)] text-[var(--ink-2)] rounded-full hover:border-[var(--ink-2)] transition-colors"
              >
                Отклонить
              </button>
              <button
                onClick={() => decide("accepted")}
                className="px-5 py-2.5 text-[13px] bg-[var(--ink)] text-[var(--paper)] rounded-full hover:bg-[var(--cobalt)] transition-colors"
              >
                Принять
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
