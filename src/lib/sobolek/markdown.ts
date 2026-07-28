import type { SbAnswers, SbQuestion } from "./questions";
import { sections } from "./questions";

function answerLines(q: SbQuestion, answers: SbAnswers): string[] {
  const raw = answers[q.id];
  const other = answers[`${q.id}__other`];
  const lines: string[] = [];

  if (q.type === "multi") {
    const values = Array.isArray(raw) ? raw : [];
    for (const v of values) lines.push(`- ${v}`);
    if (typeof other === "string" && other) lines.push(`- Другое: ${other}`);
  } else if (typeof raw === "string" && raw) {
    lines.push(raw);
    if (q.type === "single" && typeof other === "string" && other) {
      lines.push(`Уточнение: ${other}`);
    }
  }
  return lines;
}

/** Собирает markdown-отчёт по заполненной анкете (только отвеченные вопросы). */
export function buildMarkdown(answers: SbAnswers, filledAtIso: string): string {
  const parts: string[] = [
    "# Анкета — маскот «Соболёк»",
    "",
    `Движение «Урал: за медицину здорового долголетия»`,
    `Дата заполнения: ${filledAtIso}`,
  ];

  for (const section of sections) {
    const body: string[] = [];
    for (const q of section.questions) {
      const lines = answerLines(q, answers);
      if (lines.length === 0) continue;
      body.push(`### ${q.label}`, "", ...lines, "");
    }
    if (body.length > 0) {
      parts.push("", `## ${section.title}`, "", ...body);
    }
  }

  return parts.join("\n").trim() + "\n";
}

/** Короткое резюме для сообщения в Telegram (без свободного текста). */
export function buildSummary(answers: SbAnswers): string {
  const count = (id: string) => {
    const v = answers[id];
    return Array.isArray(v) ? v.length : 0;
  };
  const single = (id: string) => {
    const v = answers[id];
    return typeof v === "string" && v ? v : "—";
  };
  return [
    "● Новая анкета — маскот «Соболёк»",
    "",
    `Площадок использования: ${count("usage_where")}`,
    `Материалов первого этапа: ${count("materials_first")}`,
    `Ключевых действий: ${count("actions_key")}`,
    `Комплектов одежды: ${count("clothing_sets")}`,
    `Реалтайм-модель: ${single("tech_realtime")}`,
    `Редактируемые исходники: ${single("tech_sources")}`,
    `Брендбук: ${single("org_brandbook")}`,
    "",
    "Полные ответы — в файле во вложении.",
  ].join("\n");
}

export function briefFileBase(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `sobolek-anketa-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`;
}
