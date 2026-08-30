"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { captureAttribution } from "@/lib/attribution"

/**
 * Снимает метки первого касания на любой публичной странице.
 *
 * Стоит в публичном layout, а не только на форме: человек приходит
 * из Telegram на главную и до /razbor добирается внутренними
 * переходами. Если снимать метки на форме, источником окажется
 * собственный сайт.
 *
 * Ничего не рендерит и никуда не ходит: запись живёт в sessionStorage
 * браузера и уходит на сервер только вместе с заявкой, которую человек
 * отправляет сам и с явным согласием. Поэтому баннер согласия здесь
 * не нужен — это не аналитика и не третья сторона.
 */
export default function AttributionCapture() {
  const pathname = usePathname()

  useEffect(() => {
    // Первый вызов запишет метки, последующие ничего не изменят.
    captureAttribution()
  }, [pathname])

  return null
}
