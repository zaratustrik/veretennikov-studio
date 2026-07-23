import type { Answers, Question } from "@/types/karandash-brief";
import { allQuestions } from "./questions";
import { isAnswered, isVisible } from "./values";

export type ValidationError = { id: string; label: string; message: string };

/** Проверка обязательных полей (только ключевые, только видимые). */
export function validateRequired(answers: Answers): ValidationError[] {
  const errors: ValidationError[] = [];
  for (const q of allQuestions) {
    if (!q.required) continue;
    if (!isVisible(q, answers)) continue;
    if (!isAnswered(q, answers[q.id])) {
      errors.push({ id: q.id, label: q.label, message: requiredMessage(q) });
    }
  }
  return errors;
}

function requiredMessage(q: Question): string {
  if (q.type === "contacts") return "Укажите хотя бы один контакт";
  return "Обязательное поле";
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}
