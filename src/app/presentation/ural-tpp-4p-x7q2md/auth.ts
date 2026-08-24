"use server"

import { timingSafeEqual } from "node:crypto"
import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"

import {
  checkRateLimit,
  clearRateLimit,
  expectedCookieValue,
  sha256,
  UTPP_AUTH_COOKIE,
  UTPP_BASE_PATH,
} from "./gate"

export type LoginState = { error: string | null }

const THIRTY_DAYS_SECONDS = 60 * 60 * 24 * 30

/** Ключ rate limit: первый IP из X-Forwarded-For (за nginx), иначе общий. */
async function rateLimitKey(): Promise<string> {
  const h = await headers()
  const fwd = h.get("x-forwarded-for")
  if (fwd) return fwd.split(",")[0]!.trim()
  return h.get("x-real-ip") ?? "unknown"
}

/**
 * Вход: сравнение пароля с env UTPP_MC_PASSWORD через timingSafeEqual
 * по SHA-256-дайджестам (постоянная длина). При успехе — httpOnly-cookie
 * на 30 дней, скоуп ограничен путём раздела.
 */
export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const secret = process.env.UTPP_MC_PASSWORD
  if (!secret) {
    return { error: "Доступ не настроен: обратитесь к автору материала." }
  }

  const key = await rateLimitKey()
  const limit = checkRateLimit(key)
  if (!limit.allowed) {
    return {
      error: `Слишком много попыток. Повторите через ${limit.retryInMin} мин.`,
    }
  }

  const attempt = formData.get("password")
  if (typeof attempt !== "string" || attempt.length === 0) {
    return { error: "Введите код доступа." }
  }

  const ok = timingSafeEqual(sha256(attempt), sha256(secret))
  if (!ok) {
    return { error: "Неверный код. Попробуйте ещё раз." }
  }

  clearRateLimit(key)

  const store = await cookies()
  store.set(UTPP_AUTH_COOKIE, expectedCookieValue(secret), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: UTPP_BASE_PATH,
    maxAge: THIRTY_DAYS_SECONDS,
  })

  // Возврат на исходный маршрут раздела (deep link не теряется).
  const rawNext = formData.get("next")
  const next =
    typeof rawNext === "string" && rawNext.startsWith(UTPP_BASE_PATH)
      ? rawNext
      : UTPP_BASE_PATH
  redirect(next)
}

/** Выход: удаляет cookie доступа и возвращает на форму входа. */
export async function logoutAction(): Promise<void> {
  const store = await cookies()
  store.delete({ name: UTPP_AUTH_COOKIE, path: UTPP_BASE_PATH })
  redirect(UTPP_BASE_PATH)
}
