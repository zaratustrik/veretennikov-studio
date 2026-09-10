/**
 * Сводка ответов: для раздела проверки на странице, для файла и для админки.
 * Одна функция сборки на все три случая — расхождений между тем, что человек
 * видел перед отправкой, и тем, что читает администратор, быть не должно.
 */

import type { Answers } from "@/types/utpp"
import { questions } from "./questions"
import { isAnswered } from "./sanitize"

export type SummaryItem = {
  id: string
  label: string
  /** Ответ одной строкой; для множественного выбора — через «; ». */
  value: string
  comment?: string
  answered: boolean
}

export function buildSummary(answers: Answers): SummaryItem[] {
  return questions.map((q) => {
    const answer = answers[q.id]
    const answered = isAnswered(answer)

    let value = ""
    let comment = answer?.comment

    if (answer) {
      if (answer.choice) {
        value = answer.choice
      } else if (answer.choices?.length) {
        value = answer.choices
          .map((c) => (c === "Другое" && answer.other ? `Другое: ${answer.other}` : c))
          .join("; ")
      } else if (answer.text) {
        value = answer.text
      } else if (comment) {
        // Выбора нет, есть только комментарий — он и является ответом,
        // дублировать его второй строкой не нужно.
        value = comment
        comment = undefined
      }
    }

    return {
      id: q.id,
      label: q.label,
      value,
      comment,
      answered,
    }
  })
}

export function answeredItems(answers: Answers): SummaryItem[] {
  return buildSummary(answers).filter((i) => i.answered)
}

export function skippedItems(answers: Answers): SummaryItem[] {
  return buildSummary(answers).filter((i) => !i.answered)
}

/** Ответы в виде текста — для файла, который отвечающий может скачать. */
export function buildText(answers: Answers, respondentName?: string): string {
  const lines: string[] = []
  lines.push("Пять цифровых инициатив УТПП — уточнения")
  lines.push("")
  if (respondentName) lines.push(`Кто отвечал: ${respondentName}`)
  lines.push(`Дата: ${new Date().toLocaleDateString("ru-RU")}`)
  lines.push("")

  for (const item of buildSummary(answers)) {
    lines.push(item.label)
    lines.push(item.answered ? `  ${item.value}` : "  — пропущено")
    if (item.comment) lines.push(`  Комментарий: ${item.comment}`)
    lines.push("")
  }

  return lines.join("\n")
}

/** Скачивание сводки файлом. Blob создаётся и освобождается локально. */
export function downloadText(answers: Answers, respondentName?: string): void {
  if (typeof window === "undefined") return
  const blob = new Blob([buildText(answers, respondentName)], {
    type: "text/plain;charset=utf-8",
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "utpp-utochneniya.txt"
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
