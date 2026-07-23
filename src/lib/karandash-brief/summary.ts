import type { Answers } from "@/types/karandash-brief";
import { findQuestion } from "./questions";
import { answerToDisplay, isAnswered } from "./values";

function display(answers: Answers, id: string): string {
  const q = findQuestion(id);
  if (!q) return "Не указано";
  const d = answerToDisplay(q, answers[id]);
  if (d === null) return "Не указано";
  return Array.isArray(d) ? d.join(", ") : d;
}

/** Ключевые решения для итогового экрана и шапки экспорта. */
export function buildSummary(answers: Answers): Record<string, string> {
  return {
    "Главная цель сайта": display(answers, "main_goal"),
    "Главное действие пользователя": display(answers, "primary_action"),
    "Модель каталога": display(answers, "catalog_model"),
    "Основной канал заявок": display(answers, "lead_main_channel"),
    "Приоритеты первой версии": display(answers, "mvp_scope"),
    "Желаемая дата запуска": display(answers, "launch_date")
  };
}

/** Важные вопросы, на которые стоит ответить перед отправкой. */
const IMPORTANT_QUESTION_IDS = [
  "respondent_name",
  "respondent_contacts",
  "vision_match",
  "main_goal",
  "primary_action",
  "catalog_model",
  "products_source",
  "show_prices",
  "lead_destinations",
  "mvp_scope",
  "launch_date"
];

export type MissingItem = { id: string; label: string };

export function importantMissing(answers: Answers): MissingItem[] {
  const out: MissingItem[] = [];
  for (const id of IMPORTANT_QUESTION_IDS) {
    const q = findQuestion(id);
    if (!q) continue;
    if (!isAnswered(q, answers[id])) {
      out.push({ id, label: q.label });
    }
  }
  return out;
}
