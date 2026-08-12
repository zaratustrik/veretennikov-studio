// Серверный модуль доступа к закрытому proposal ТК КИТ.
// Импорт node:crypto гарантирует, что модуль (и пароль) никогда не попадёт
// в клиентский бандл. Используется только из server components и server actions.
import { createHash, timingSafeEqual } from "node:crypto"

/** Имя cookie доступа. */
export const KDL_AUTH_COOKIE = "kdl_auth"

/** Базовый путь раздела: скоуп cookie и цель редиректов. */
export const KDL_BASE_PATH = "/presentation/kit-digital-logistics"

/** SHA-256 от строки (Buffer, 32 байта). Только на сервере. */
export function sha256(value: string): Buffer {
  return createHash("sha256").update(value, "utf8").digest()
}

/** Значение cookie: SHA-256 hex от пароля из env. */
export function expectedCookieValue(secret: string): string {
  return sha256(secret).toString("hex")
}

/**
 * Проверка cookie: постоянное по времени сравнение hex-значения
 * с SHA-256 от пароля из env. Любое повреждённое значение → отказ.
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

/**
 * Простейший in-memory rate limit по ключу (IP).
 * Живёт в памяти процесса pm2 и обнуляется при перезапуске — для страницы,
 * которую открывают единицы людей, этого достаточно; распределённый лимит
 * здесь не оправдан. Ограничение зафиксировано в WEB_PROPOSAL_TECH_PLAN.md.
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
