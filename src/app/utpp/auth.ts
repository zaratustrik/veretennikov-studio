"use server"

import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"

import {
  accessCode,
  checkRateLimit,
  clearRateLimit,
  expectedCookieValue,
  isCorrectCode,
  UTPP_PAGE_BASE_PATH,
  UTPP_PAGE_COOKIE,
  UTPP_PAGE_COOKIE_MAX_AGE,
} from "@/lib/utpp/gate"

export type AccessState = { error: string | null }

/** Ключ лимита попыток: первый IP из X-Forwarded-For (за nginx). Не сохраняется. */
async function rateLimitKey(): Promise<string> {
  const h = await headers()
  const fwd = h.get("x-forwarded-for")
  if (fwd) return fwd.split(",")[0]!.trim()
  return h.get("x-real-ip") ?? "unknown"
}

/**
 * Вход по общему коду доступа.
 *
 * Cookie здесь, в отличие от превью мастер-класса, живёт неделю: это документ,
 * который читают в несколько заходов и возвращаются к нему, а не показ с
 * экрана в чужой переговорной.
 */
export async function accessAction(
  _prev: AccessState,
  formData: FormData,
): Promise<AccessState> {
  const secret = accessCode()
  if (!secret) {
    return { error: "Доступ не настроен. Напишите нам — пришлём код." }
  }

  const key = await rateLimitKey()
  const limit = checkRateLimit(key)
  if (!limit.allowed) {
    return { error: `Слишком много попыток. Повторите через ${limit.retryInMin} мин.` }
  }

  const attempt = formData.get("code")
  if (typeof attempt !== "string" || attempt.length === 0) {
    return { error: "Введите код доступа." }
  }

  if (!isCorrectCode(attempt.trim(), secret)) {
    return { error: "Неверный код. Попробуйте ещё раз." }
  }

  clearRateLimit(key)

  const store = await cookies()
  store.set(UTPP_PAGE_COOKIE, expectedCookieValue(secret), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: UTPP_PAGE_BASE_PATH,
    maxAge: UTPP_PAGE_COOKIE_MAX_AGE,
  })

  redirect(UTPP_PAGE_BASE_PATH)
}
