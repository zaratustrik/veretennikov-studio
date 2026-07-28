import type { SbAnswers } from "./questions";
import { allQuestions } from "./questions";

const MAX_FIELD_LEN = 2000;

/** Максимальный размер входного JSON, байт. */
export const MAX_PAYLOAD_BYTES = 100_000;

/** Управляющий ли это символ (C0/C1/DEL), кроме \t \n \r. */
function isControlCode(code: number): boolean {
  if (code === 9 || code === 10 || code === 13) return false;
  if (code <= 31) return true;
  if (code >= 127 && code <= 159) return true;
  return false;
}

function cleanString(input: unknown): string {
  if (typeof input !== "string") return "";
  let out = "";
  for (const ch of input) {
    const code = ch.codePointAt(0) ?? 0;
    if (!isControlCode(code)) out += ch;
  }
  return out.slice(0, MAX_FIELD_LEN).trim();
}

/**
 * Пересобирает ответы строго по схеме анкеты: неизвестные ключи
 * отбрасываются, multi-значения сверяются со списком опций,
 * строки чистятся от управляющих символов и ограничиваются по длине.
 */
export function sanitizeAnswers(raw: unknown): SbAnswers {
  if (raw === null || typeof raw !== "object") return {};
  const input = raw as Record<string, unknown>;
  const out: SbAnswers = {};

  for (const q of allQuestions) {
    const value = input[q.id];

    if (q.type === "multi") {
      if (Array.isArray(value)) {
        const values = value
          .map(cleanString)
          .filter((v) => v && (q.options as readonly string[]).includes(v));
        if (values.length > 0) out[q.id] = [...new Set(values)];
      }
    } else if (q.type === "single") {
      const v = cleanString(value);
      if (v && (q.options as readonly string[]).includes(v)) out[q.id] = v;
    } else {
      const v = cleanString(value);
      if (v) out[q.id] = v;
    }

    // Свободный текст «другое» — только для вопросов, где он предусмотрен
    if ((q.type === "multi" || q.type === "single") && q.other) {
      const otherText = cleanString(input[`${q.id}__other`]);
      if (otherText) out[`${q.id}__other`] = otherText;
    }
  }

  return out;
}
