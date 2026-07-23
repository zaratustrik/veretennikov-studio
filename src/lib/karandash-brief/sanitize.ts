import type { Answers, AnswerValue } from "@/types/karandash-brief";
import { allQuestions, findQuestion } from "./questions";

const MAX_FIELD_LEN = 4000;
const MAX_ARRAY_ITEMS = 60;

/** Максимальный размер входного JSON (после стрингификации), байт. */
export const MAX_PAYLOAD_BYTES = 200_000;

/** Управляющий ли это символ (C0/C1/DEL), кроме табуляции, \n и \r. */
function isControlCode(code: number): boolean {
  if (code === 9 || code === 10 || code === 13) return false; // \t \n \r
  if (code <= 31) return true; // C0
  if (code >= 127 && code <= 159) return true; // DEL + C1
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

/** Приводит произвольный вход к валидному AnswerValue по типу вопроса. */
function coerce(id: string, raw: unknown): AnswerValue | undefined {
  const q = findQuestion(id);
  if (!q || raw === null || typeof raw !== "object") return undefined;
  const obj = raw as Record<string, unknown>;

  switch (q.type) {
    case "text":
    case "textarea": {
      const text = cleanString(obj.text);
      return text ? { kind: "text", text } : undefined;
    }
    case "single": {
      const value = cleanString(obj.value);
      const other = cleanString(obj.other);
      if (!value) return undefined;
      return { kind: "single", value, ...(other ? { other } : {}) };
    }
    case "multi": {
      const values = Array.isArray(obj.values)
        ? obj.values.map(cleanString).filter(Boolean).slice(0, MAX_ARRAY_ITEMS)
        : [];
      const other = cleanString(obj.other);
      if (values.length === 0) return undefined;
      return { kind: "multi", values, ...(other ? { other } : {}) };
    }
    case "contacts": {
      const phone = cleanString(obj.phone);
      const email = cleanString(obj.email);
      const telegram = cleanString(obj.telegram);
      if (!phone && !email && !telegram) return undefined;
      return {
        kind: "contacts",
        ...(phone ? { phone } : {}),
        ...(email ? { email } : {}),
        ...(telegram ? { telegram } : {})
      };
    }
    case "numberPair": {
      const a = cleanString(obj.a);
      const b = cleanString(obj.b);
      if (!a && !b) return undefined;
      return { kind: "numberPair", ...(a ? { a } : {}), ...(b ? { b } : {}) };
    }
    default:
      return undefined;
  }
}

/** Строит чистый объект ответов только из известных схеме вопросов. */
export function sanitizeAnswers(raw: unknown): Answers {
  const out: Answers = {};
  if (!raw || typeof raw !== "object") return out;
  const obj = raw as Record<string, unknown>;
  for (const q of allQuestions) {
    const value = coerce(q.id, obj[q.id]);
    if (value) out[q.id] = value;
  }
  return out;
}
