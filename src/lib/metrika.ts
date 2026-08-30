"use client"

/**
 * Тонкая обёртка над Яндекс.Метрикой.
 *
 * Счётчик грузится ТОЛЬКО после явного согласия (см. CookieConsent), поэтому
 * здесь ничего не инициализируется и ничего не хранится: если согласия нет —
 * `ym` не существует, и вызов молча ничего не делает. Никакого собственного
 * трекинга, идентификаторов и fingerprinting.
 *
 * ID счётчика кладёт в `window.__ymId` сам загрузчик — так серверная
 * переменная YANDEX_METRIKA_ID не утекает в клиентский бандл.
 */

type YmFn = (id: number, event: string, target?: string, params?: unknown) => void

interface YmWindow extends Window {
  ym?: YmFn
  __ymId?: number
}

/** Отправить достижение цели. Безопасно вызывать всегда. */
export function goal(name: string, params?: Record<string, unknown>): void {
  if (typeof window === "undefined") return
  const w = window as YmWindow
  const id = w.__ymId
  if (typeof w.ym !== "function" || !id) return
  try {
    w.ym(id, "reachGoal", name, params)
  } catch {
    /* аналитика никогда не должна ломать интерфейс */
  }
}

/** Обработчик для onClick — короче, чем стрелка на месте. */
export const trackClick =
  (name: string, params?: Record<string, unknown>) =>
  () =>
    goal(name, params)
