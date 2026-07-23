import type { Answers, AnswerValue, Question, VisibleWhen } from "@/types/karandash-brief";
import { allQuestions } from "./questions";

export const OTHER_LABEL = "Другое";

/** Значение single как строка (с учётом «Другое»). */
export function singleValue(a: AnswerValue | undefined): string | null {
  if (!a || a.kind !== "single") return null;
  if (a.value === OTHER_LABEL) return a.other?.trim() ? `${OTHER_LABEL}: ${a.other.trim()}` : null;
  return a.value || null;
}

/** «Сырое» значение single без раскрытия other — для сравнения в условиях. */
export function singleRaw(a: AnswerValue | undefined): string | null {
  if (!a || a.kind !== "single") return null;
  return a.value || null;
}

/** Значение multi как массив строк (с учётом «Другое»). */
export function multiValues(a: AnswerValue | undefined): string[] {
  if (!a || a.kind !== "multi") return [];
  const out = a.values.filter((v) => v !== OTHER_LABEL);
  if (a.values.includes(OTHER_LABEL) && a.other?.trim()) {
    out.push(`${OTHER_LABEL}: ${a.other.trim()}`);
  }
  return out;
}

/** Проверка, отвечен ли вопрос (для % заполнения и валидации). */
export function isAnswered(q: Question, a: AnswerValue | undefined): boolean {
  if (!a) return false;
  switch (a.kind) {
    case "text":
      return a.text.trim().length > 0;
    case "single":
      return singleValue(a) !== null;
    case "multi":
      return multiValues(a).length > 0;
    case "contacts":
      return Boolean(a.phone?.trim() || a.email?.trim() || a.telegram?.trim());
    case "numberPair":
      return Boolean(a.a?.trim() || a.b?.trim());
    default:
      return false;
  }
}

/** Проверка условия видимости зависимого вопроса. */
export function matchesCondition(cond: VisibleWhen, answers: Answers): boolean {
  const dep = answers[cond.questionId];
  const single = singleRaw(dep);
  const multi = dep?.kind === "multi" ? dep.values : [];

  if (cond.equalsOneOf) {
    if (!single || !cond.equalsOneOf.includes(single)) return false;
  }
  if (cond.notOneOf) {
    // условие выполнено только когда есть ответ и он не в списке
    if (!single || cond.notOneOf.includes(single)) return false;
  }
  if (cond.includesOneOf) {
    if (!cond.includesOneOf.some((v) => multi.includes(v))) return false;
  }
  return true;
}

export function isVisible(q: Question, answers: Answers): boolean {
  if (!q.visibleWhen) return true;
  return matchesCondition(q.visibleWhen, answers);
}

/** Видимые вопросы среди всех (для корректного % заполнения). */
export function visibleQuestions(answers: Answers): Question[] {
  return allQuestions.filter((q) => isVisible(q, answers));
}

/** Процент заполнения по видимым вопросам. */
export function completionPercent(answers: Answers): number {
  const visible = visibleQuestions(answers);
  if (visible.length === 0) return 0;
  const answered = visible.filter((q) => isAnswered(q, answers[q.id])).length;
  return Math.round((answered / visible.length) * 100);
}

/** Человекочитаемое представление ответа: строка, массив строк или null. */
export function answerToDisplay(q: Question, a: AnswerValue | undefined): string | string[] | null {
  if (!a) return null;
  switch (a.kind) {
    case "text":
      return a.text.trim() || null;
    case "single":
      return singleValue(a);
    case "multi": {
      const vals = multiValues(a);
      return vals.length ? vals : null;
    }
    case "contacts": {
      const parts: string[] = [];
      if (a.phone?.trim()) parts.push(`Телефон: ${a.phone.trim()}`);
      if (a.email?.trim()) parts.push(`Email: ${a.email.trim()}`);
      if (a.telegram?.trim()) parts.push(`Telegram: ${a.telegram.trim()}`);
      return parts.length ? parts : null;
    }
    case "numberPair": {
      if (q.type !== "numberPair") return null;
      const suffix = q.suffix ? ` ${q.suffix}` : "";
      const parts: string[] = [];
      if (a.a?.trim()) parts.push(`${q.aLabel}: ${a.a.trim()}${suffix}`);
      if (a.b?.trim()) parts.push(`${q.bLabel}: ${a.b.trim()}${suffix}`);
      return parts.length ? parts.join(" / ") : null;
    }
    default:
      return null;
  }
}
