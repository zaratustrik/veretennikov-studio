/**
 * Серверная пересборка ответов.
 *
 * Клиентской структуре не доверяем: значения сверяются с конфигурацией
 * вопросов, неизвестные id отбрасываются, варианты вне списка отбрасываются,
 * тексты обрезаются по длине. В базу уходит только то, что могло быть выбрано
 * на странице.
 */

import type { Answer, Answers } from "@/types/utpp"
import { OTHER_OPTION, questionById } from "./questions"

/** Максимальный размер тела запроса. */
export const MAX_PAYLOAD_BYTES = 64 * 1024

const MAX_TEXT = 600
const MAX_NAME = 120

/**
 * Убирает управляющие символы, схлопывает пробелы, обрезает по длине.
 * Фильтр по кодам, а не регулярным выражением: без экранирования его
 * заметно проще читать и невозможно испортить при правке.
 */
function clean(value: unknown, limit: number): string | undefined {
  if (typeof value !== "string") return undefined

  let stripped = ""
  for (const ch of value) {
    const code = ch.codePointAt(0) ?? 0
    stripped += code < 0x20 || code === 0x7f ? " " : ch
  }

  const trimmed = stripped.replace(/\s+/g, " ").trim()
  if (!trimmed) return undefined
  return trimmed.slice(0, limit)
}

export function sanitizeName(value: unknown): string | undefined {
  return clean(value, MAX_NAME)
}

/**
 * Пересобирает ответы по конфигурации вопросов.
 * Возвращает только непустые ответы на известные вопросы.
 */
export function sanitizeAnswers(raw: unknown): Answers {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {}

  const input = raw as Record<string, unknown>
  const out: Answers = {}

  for (const [id, value] of Object.entries(input)) {
    const question = questionById(id)
    if (!question) continue
    if (!value || typeof value !== "object" || Array.isArray(value)) continue

    const source = value as Record<string, unknown>
    const answer: Answer = {}

    if (question.type === "single") {
      const choice = clean(source.choice, MAX_TEXT)
      if (choice && question.options.includes(choice)) answer.choice = choice
    }

    if (question.type === "multi") {
      const list = Array.isArray(source.choices) ? source.choices : []
      const allowed = new Set(question.options)
      if (question.allowOther) allowed.add(OTHER_OPTION)

      const choices: string[] = []
      for (const item of list) {
        const choice = clean(item, MAX_TEXT)
        if (!choice || !allowed.has(choice)) continue
        if (choices.includes(choice)) continue
        choices.push(choice)
      }

      const limit = question.maxSelections ?? choices.length
      if (choices.length > 0) answer.choices = choices.slice(0, limit)

      if (question.allowOther && answer.choices?.includes(OTHER_OPTION)) {
        const other = clean(source.other, MAX_TEXT)
        if (other) answer.other = other
      }
    }

    if (question.type === "text") {
      const text = clean(source.text, MAX_TEXT)
      if (text) answer.text = text
    }

    if (question.type !== "text" && question.comment) {
      const comment = clean(source.comment, MAX_TEXT)
      if (comment) answer.comment = comment
    }

    if (Object.keys(answer).length > 0) out[id] = answer
  }

  return out
}

/**
 * Есть ли в ответе что-нибудь содержательное.
 *
 * Комментарий засчитывается наравне с выбором: человек может не найти
 * подходящего варианта и ответить только словами. Иначе такой ответ
 * показывался бы в сводке как пропущенный, но всё равно уходил в базу —
 * расхождение между тем, что видно, и тем, что сохранено.
 */
export function isAnswered(answer: Answer | undefined): boolean {
  if (!answer) return false
  if (answer.choice) return true
  if (answer.choices && answer.choices.length > 0) return true
  if (answer.text) return true
  if (answer.comment) return true
  return false
}

/** Сколько вопросов реально отвечено. */
export function answeredCount(answers: Answers): number {
  return Object.values(answers).filter(isAnswered).length
}
