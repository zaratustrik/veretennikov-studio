/**
 * Серверный модуль доступа к закрытой проектной странице УТПП.
 *
 * Тот же контракт, что у превью мастер-класса (`presentation/…/gate.ts`):
 * импорт `node:crypto` гарантирует, что модуль и код доступа никогда не попадут
 * в клиентский бандл. Только server components и server actions.
 *
 * Персональных токенов приглашения здесь нет сознательно: ссылка передаётся
 * точечно, набор вопросов один для всех, а каждая отправка сохраняется
 * отдельной записью.
 */
import { createHash, timingSafeEqual } from "node:crypto"

/** Имя cookie доступа. Отдельное от других закрытых разделов сайта. */
export const UTPP_PAGE_COOKIE = "utpp_page_auth"

/** Базовый путь раздела: скоуп cookie и цель редиректов. */
export const UTPP_PAGE_BASE_PATH = "/utpp"

/** Срок действия cookie — рабочая неделя. */
export const UTPP_PAGE_COOKIE_MAX_AGE = 7 * 24 * 60 * 60

/** Код доступа из окружения. Пусто или не задан — гейт выключен. */
export function accessCode(): string | undefined {
  const code = process.env.UTPP_PAGE_ACCESS_CODE
  return code && code.length > 0 ? code : undefined
}

/** SHA-256 от строки. Только на сервере. */
function sha256(value: string): Buffer {
  return createHash("sha256").update(value, "utf8").digest()
}

/** Значение cookie: SHA-256 hex от кода доступа. Сам код в cookie не попадает. */
export function expectedCookieValue(secret: string): string {
  return sha256(secret).toString("hex")
}

/**
 * Проверка cookie: сравнение hex-значения с SHA-256 от кода из окружения,
 * постоянное по времени. Любое повреждённое значение — отказ.
 */
export function isAuthorized(
  cookieValue: string | undefined,
  secret: string | undefined,
): boolean {
  if (!secret || !cookieValue) return false
  if (!/^[0-9a-f]{64}$/.test(cookieValue)) return false
  const provided = Buffer.from(cookieValue, "hex")
  const expected = sha256(secret)
  if (provided.length !== expected.length) return false
  return timingSafeEqual(provided, expected)
}

/** Сравнение введённого кода с кодом из окружения, постоянное по времени. */
export function isCorrectCode(input: string, secret: string | undefined): boolean {
  if (!secret) return false
  const a = Buffer.from(input, "utf8")
  const b = Buffer.from(secret, "utf8")
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

/**
 * Лимит попыток в памяти процесса. Обнуляется при перезапуске pm2.
 * Код доступа короткий и передаётся людям — закрывает перебор именно лимит,
 * а не длина кода.
 */
const WINDOW_MS = 10 * 60 * 1000
const MAX_ATTEMPTS = 7

type Bucket = { count: number; resetAt: number }
const buckets = new Map<string, Bucket>()

export function checkRateLimit(key: string): { allowed: boolean; retryInMin: number } {
  const now = Date.now()
  const bucket = buckets.get(key)

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return { allowed: true, retryInMin: 0 }
  }

  bucket.count += 1
  if (bucket.count > MAX_ATTEMPTS) {
    return { allowed: false, retryInMin: Math.ceil((bucket.resetAt - now) / 60000) }
  }
  return { allowed: true, retryInMin: 0 }
}

/** Сброс счётчика после успешного входа. */
export function clearRateLimit(key: string): void {
  buckets.delete(key)
}

/** Лимит отправок ответов. Отдельное ведро от попыток входа. */
const SUBMIT_WINDOW_MS = 10 * 60 * 1000
const SUBMIT_MAX = 5

export function checkSubmitLimit(key: string): { allowed: boolean; retryInMin: number } {
  const now = Date.now()
  const k = `submit:${key}`
  const bucket = buckets.get(k)

  if (!bucket || now > bucket.resetAt) {
    buckets.set(k, { count: 1, resetAt: now + SUBMIT_WINDOW_MS })
    return { allowed: true, retryInMin: 0 }
  }

  bucket.count += 1
  if (bucket.count > SUBMIT_MAX) {
    return { allowed: false, retryInMin: Math.ceil((bucket.resetAt - now) / 60000) }
  }
  return { allowed: true, retryInMin: 0 }
}
