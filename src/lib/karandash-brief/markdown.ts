import type { Answers } from "@/types/karandash-brief";
import { stages, visionQuestions } from "./questions";
import { answerToDisplay, completionPercent } from "./values";
import { buildSummary } from "./summary";

const NOT_SET = "Не указано";

function fmt(value: string | string[] | null): string {
  if (value === null) return NOT_SET;
  if (Array.isArray(value)) {
    return "\n" + value.map((v) => `- ${v}`).join("\n");
  }
  // сохраняем переносы строк из textarea
  return value.includes("\n") ? "\n" + value : value;
}

/** Формирует человекочитаемый Markdown брифа (не дамп объекта). */
export function buildMarkdown(answers: Answers, filledAtIso: string): string {
  const date = new Date(filledAtIso);
  const dateStr = formatDate(date);
  const completion = completionPercent(answers);
  const summary = buildSummary(answers);

  const respondent = answerToDisplay(
    { id: "respondent_name", type: "text", label: "" },
    answers["respondent_name"]
  );
  const role = answerToDisplay(
    { id: "respondent_role", type: "single", label: "", options: [] },
    answers["respondent_role"]
  );
  const contacts = answerToDisplay(
    { id: "respondent_contacts", type: "contacts", label: "" },
    answers["respondent_contacts"]
  );

  const lines: string[] = [];
  lines.push("# Бриф по новому сайту компании «Карандаш»");
  lines.push("");
  lines.push(`- Дата заполнения: ${dateStr}`);
  lines.push(`- ФИО: ${asText(respondent)}`);
  lines.push(`- Роль: ${asText(role)}`);
  lines.push(`- Контакты: ${asText(contacts)}`);
  lines.push(`- Процент заполнения: ${completion}%`);
  lines.push("");
  lines.push("## Краткое резюме");
  lines.push("");
  for (const [key, value] of Object.entries(summary)) {
    lines.push(`- ${key}: ${value}`);
  }
  lines.push("");

  // Видение сайта
  lines.push("## Видение сайта");
  lines.push("");
  for (const q of visionQuestions) {
    lines.push(`### ${q.label}`);
    lines.push(fmt(answerToDisplay(q, answers[q.id])).replace(/^\n/, "") || NOT_SET);
    lines.push("");
  }

  // Этапы
  stages.forEach((stage, index) => {
    lines.push(`## ${index + 1}. ${stage.title}`);
    lines.push("");
    for (const q of stage.questions) {
      lines.push(`### ${q.label}`);
      const value = fmt(answerToDisplay(q, answers[q.id]));
      lines.push(value.startsWith("\n") ? value.slice(1) : value);
      lines.push("");
    }
  });

  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
}

function asText(value: string | string[] | null): string {
  if (value === null) return NOT_SET;
  return Array.isArray(value) ? value.join(", ") : value;
}

function formatDate(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(
    d.getMinutes()
  )}`;
}

/** Имя файла экспорта: karandash-brief-YYYY-MM-DD-HH-mm.md */
export function briefFileBase(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `karandash-brief-${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}-${pad(
    d.getHours()
  )}-${pad(d.getMinutes())}`;
}
