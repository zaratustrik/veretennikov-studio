/**
 * Атрибуция переходов из соцсетей.
 *
 * Задача одна: когда придёт заявка, суметь ответить на вопрос
 * «откуда пришёл этот человек». Без этого весь медиа-контур
 * не поддаётся измерению, а оптимизировать придётся на просмотры —
 * то есть не на то.
 *
 * Модель — **first touch**. Человек приходит из Telegram на главную,
 * ходит по сайту и заполняет форму на /razbor. Если запоминать
 * последний URL, источником окажется внутренний переход. Поэтому
 * метки снимаются один раз за сессию и потом не переписываются.
 *
 * 152-ФЗ: здесь нет персональных данных. UTM-метки ставим мы сами,
 * referer обрезается до origin и пути — query-строка отбрасывается,
 * потому что именно в ней у сторонних сайтов иногда оказывается
 * лишнее.
 */

const KEY = "vs_attribution_v1"

export interface Attribution {
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmContent?: string
  utmTerm?: string
  /** Страница, на которую человек приземлился первой. */
  landing?: string
  /** Откуда пришёл — только origin и путь. */
  referer?: string
}

/** Значения приходят из внешнего мира — режем длину и мусор. */
function clean(v: string | null, max = 120): string | undefined {
  if (!v) return undefined
  const s = v.trim().slice(0, max)
  return s.length > 0 ? s : undefined
}

/** Referer без query-строки и без фрагмента. */
function safeReferer(raw: string): string | undefined {
  if (!raw) return undefined
  try {
    const u = new URL(raw)
    // Внутренние переходы источником не считаются.
    if (u.host === window.location.host) return undefined
    return clean(`${u.origin}${u.pathname}`, 200)
  } catch {
    return undefined
  }
}

/**
 * Снять метки при первом заходе. Вызывать на публичных страницах.
 * Повторный вызов внутри сессии ничего не переписывает.
 */
export function captureAttribution(): void {
  if (typeof window === "undefined") return
  try {
    if (window.sessionStorage.getItem(KEY)) return

    const q = new URLSearchParams(window.location.search)
    const data: Attribution = {
      utmSource: clean(q.get("utm_source")),
      utmMedium: clean(q.get("utm_medium")),
      utmCampaign: clean(q.get("utm_campaign")),
      utmContent: clean(q.get("utm_content")),
      utmTerm: clean(q.get("utm_term")),
      landing: clean(window.location.pathname, 200),
      referer: safeReferer(document.referrer),
    }

    // Пустую запись не храним, но факт захода фиксируем — иначе
    // при следующем переходе внутренним путём запишется он.
    window.sessionStorage.setItem(KEY, JSON.stringify(data))
  } catch {
    // Приватный режим, отключённое хранилище — не повод ломать страницу.
  }
}

/** Прочитать снятые метки. Возвращает пустой объект, если ничего нет. */
export function readAttribution(): Attribution {
  if (typeof window === "undefined") return {}
  try {
    const raw = window.sessionStorage.getItem(KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as Attribution
    return parsed && typeof parsed === "object" ? parsed : {}
  } catch {
    return {}
  }
}
