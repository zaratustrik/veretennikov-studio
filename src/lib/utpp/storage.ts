/**
 * Черновик ответов — только в браузере отвечающего.
 *
 * На сервер до нажатия «Подтвердить и отправить» не уходит ничего. Потеря
 * черновика — неудобство на несколько минут; преждевременная запись
 * неподтверждённых формулировок в базу — совсем другого рода проблема.
 *
 * Каждый доступ обёрнут в try/catch: приватное окно, отключённые site data
 * и режимы предпросмотра могут бросать исключение прямо на чтении.
 */

import type { Answers, Draft } from "@/types/utpp"
import { QUESTION_SET_VERSION } from "@/types/utpp"

const KEY = "utpp-page-draft-v1"

export function loadDraft(): Draft | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw) as Draft
    if (!parsed || typeof parsed !== "object") return null
    if (!parsed.answers || typeof parsed.answers !== "object") return null

    // Набор вопросов сменился — черновик больше не соответствует форме.
    if (parsed.questionSetVersion !== QUESTION_SET_VERSION) return null

    return parsed
  } catch {
    return null
  }
}

export function saveDraft(answers: Answers, respondentName?: string): void {
  if (typeof window === "undefined") return
  const draft: Draft = {
    questionSetVersion: QUESTION_SET_VERSION,
    updatedAt: new Date().toISOString(),
    answers,
    respondentName,
  }
  try {
    window.localStorage.setItem(KEY, JSON.stringify(draft))
  } catch {
    /* Хранилище недоступно — страница продолжает работать без черновика. */
  }
}

export function clearDraft(): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.removeItem(KEY)
  } catch {
    /* noop */
  }
}
