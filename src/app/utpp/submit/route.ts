import { NextResponse } from "next/server"

import { prisma } from "@/lib/db"
import { CONTENT_VERSION } from "@/lib/utpp/content"
import {
  accessCode,
  checkSubmitLimit,
  isAuthorized,
  UTPP_PAGE_COOKIE,
} from "@/lib/utpp/gate"
import { questions } from "@/lib/utpp/questions"
import {
  answeredCount,
  MAX_PAYLOAD_BYTES,
  sanitizeAnswers,
  sanitizeName,
} from "@/lib/utpp/sanitize"
import { notifyUtppResponse } from "@/lib/utpp/telegram"
import { QUESTION_SET_VERSION } from "@/types/utpp"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/**
 * Приём ответов с закрытой страницы.
 *
 * Маршрут лежит внутри /utpp сознательно: cookie доступа ограничена путём
 * раздела, и до /api/... она бы не дошла. Расширять её скоуп на весь сайт
 * ради одного обработчика — ослабить защиту раздела.
 *
 * Layout к route handlers не применяется, поэтому доступ проверяется здесь
 * отдельно, а не наследуется от страницы.
 */

/** Ключ лимита. Используется в памяти процесса и не сохраняется. */
function clientKey(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for")
  if (fwd) return fwd.split(",")[0]!.trim()
  return request.headers.get("x-real-ip") ?? "unknown"
}

function readCookie(request: Request, name: string): string | undefined {
  return request.headers
    .get("cookie")
    ?.split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${name}=`))
    ?.slice(name.length + 1)
}

export async function POST(request: Request) {
  // 1. Лимит отправок
  const limit = checkSubmitLimit(clientKey(request))
  if (!limit.allowed) {
    return NextResponse.json(
      {
        ok: false,
        error: `Слишком много отправок подряд. Повторите через ${limit.retryInMin} мин.`,
      },
      { status: 429, headers: { "Retry-After": String(limit.retryInMin * 60) } },
    )
  }

  // 2. Доступ — если код настроен
  const secret = accessCode()
  if (secret && !isAuthorized(readCookie(request, UTPP_PAGE_COOKIE), secret)) {
    return NextResponse.json(
      { ok: false, error: "Доступ истёк. Обновите страницу и введите код заново." },
      { status: 401 },
    )
  }

  // 3. Размер
  const declared = Number(request.headers.get("content-length") ?? "0")
  if (declared > MAX_PAYLOAD_BYTES) {
    return NextResponse.json({ ok: false, error: "Слишком большой запрос" }, { status: 413 })
  }

  const raw = await request.text()
  if (raw.length > MAX_PAYLOAD_BYTES) {
    return NextResponse.json({ ok: false, error: "Слишком большой запрос" }, { status: 413 })
  }

  let body: unknown
  try {
    body = JSON.parse(raw)
  } catch {
    return NextResponse.json({ ok: false, error: "Некорректные данные" }, { status: 400 })
  }

  const payload = (body ?? {}) as Record<string, unknown>

  // 4. Honeypot — боты заполняют и скрытые поля
  if (typeof payload.website === "string" && payload.website.trim().length > 0) {
    return NextResponse.json({ ok: true })
  }

  // 5. Серверная пересборка: клиентской структуре не доверяем
  // Проверяем именно содержательность, а не число ключей: иначе ответ,
  // который в сводке показан как пропущенный, всё равно попал бы в базу.
  const answers = sanitizeAnswers(payload.answers)
  const filled = answeredCount(answers)
  if (filled === 0) {
    return NextResponse.json(
      { ok: false, error: "Пока нет ни одного ответа." },
      { status: 400 },
    )
  }

  const respondentName = sanitizeName(payload.respondentName)

  // 6. Запись. IP, User-Agent и поведение не сохраняются.
  try {
    await prisma.utppProjectResponse.create({
      data: {
        respondentName: respondentName ?? null,
        answers,
        answeredCount: filled,
        contentVersion: CONTENT_VERSION,
        questionSetVersion: QUESTION_SET_VERSION,
      },
    })
  } catch (error) {
    // В лог — только техническая причина, без содержания ответов.
    console.error(
      "[utpp] не удалось сохранить ответы:",
      error instanceof Error ? error.message : "неизвестная ошибка",
    )
    return NextResponse.json(
      { ok: false, error: "Не удалось сохранить ответы. Попробуйте ещё раз." },
      { status: 500 },
    )
  }

  // 7. Уведомление — только факт, без содержания и без имени.
  //    Ответ уже сохранён, поэтому недоступность Telegram не должна
  //    ни ломать отправку, ни возвращать человеку ошибку.
  const forwardedHost = request.headers.get("x-forwarded-host")
  const host = forwardedHost ?? request.headers.get("host") ?? "veretennikov.info"
  const protocol = host.startsWith("localhost") ? "http" : "https"

  await notifyUtppResponse({
    answeredCount: filled,
    total: questions.length,
    questionSetVersion: QUESTION_SET_VERSION,
    baseUrl: `${protocol}://${host}`,
  })

  return NextResponse.json({ ok: true })
}
