// Общие типы интерактивного брифа «Карандаш».
// Конфигурация вопросов типизирована; никакого необоснованного any.

export const BRIEF_SCHEMA_VERSION = "1.0.0";

/** Условие показа зависимого вопроса. Ссылается на ответ другого вопроса. */
export type VisibleWhen = {
  /** id вопроса, от которого зависит видимость */
  questionId: string;
  /** показать, если значение single равно одному из перечисленных */
  equalsOneOf?: string[];
  /** показать, если значение single НЕ равно ни одному из перечисленных */
  notOneOf?: string[];
  /** показать, если multi содержит хотя бы одно из перечисленных */
  includesOneOf?: string[];
};

type BaseQuestion = {
  id: string;
  label: string;
  /** пояснение под вопросом */
  help?: string;
  required?: boolean;
  visibleWhen?: VisibleWhen;
};

export type TextQuestion = BaseQuestion & {
  type: "text" | "textarea";
  placeholder?: string;
};

export type SingleQuestion = BaseQuestion & {
  type: "single";
  options: string[];
  /** добавить вариант «Другое» с полем уточнения */
  allowOther?: boolean;
};

export type MultiQuestion = BaseQuestion & {
  type: "multi";
  options: string[];
  allowOther?: boolean;
  /** максимум выбранных вариантов (например, «не более 7») */
  maxSelections?: number;
};

export type ContactsQuestion = BaseQuestion & {
  type: "contacts";
};

export type NumberPairQuestion = BaseQuestion & {
  type: "numberPair";
  aLabel: string;
  bLabel: string;
  suffix?: string;
};

export type Question =
  | TextQuestion
  | SingleQuestion
  | MultiQuestion
  | ContactsQuestion
  | NumberPairQuestion;

export type Stage = {
  id: string;
  /** порядковый заголовок раздела */
  title: string;
  /** короткое пояснение к разделу */
  intro?: string;
  /** акцентная плашка перед разделом (например, «ключевой архитектурный блок») */
  note?: string;
  questions: Question[];
};

// --- Значения ответов (дискриминированное объединение по kind) ---

export type TextAnswer = { kind: "text"; text: string };
export type SingleAnswer = { kind: "single"; value: string; other?: string };
export type MultiAnswer = { kind: "multi"; values: string[]; other?: string };
export type ContactsAnswer = {
  kind: "contacts";
  phone?: string;
  email?: string;
  telegram?: string;
};
export type NumberPairAnswer = { kind: "numberPair"; a?: string; b?: string };

export type AnswerValue =
  | TextAnswer
  | SingleAnswer
  | MultiAnswer
  | ContactsAnswer
  | NumberPairAnswer;

export type Answers = Record<string, AnswerValue | undefined>;

/** Тип ответа по типу вопроса — для типобезопасного рендера полей. */
export type AnswerForType<T extends Question["type"]> = T extends "text" | "textarea"
  ? TextAnswer
  : T extends "single"
    ? SingleAnswer
    : T extends "multi"
      ? MultiAnswer
      : T extends "contacts"
        ? ContactsAnswer
        : T extends "numberPair"
          ? NumberPairAnswer
          : never;

/** Черновик, сохраняемый в localStorage. */
export type BriefDraft = {
  schemaVersion: string;
  updatedAt: string;
  answers: Answers;
  /** id последнего открытого этапа (для «продолжить») */
  lastStageId?: string;
};

/** Полезная нагрузка, отправляемая на сервер. */
export type BriefSubmission = {
  schemaVersion: string;
  answers: Answers;
  /** honeypot — должно быть пустым */
  website?: string;
  meta: {
    filledAt: string;
    completion: number;
    userAgent?: string;
  };
};

/** Экспортируемый JSON. */
export type BriefExportJson = {
  schemaVersion: string;
  exportedAt: string;
  completion: number;
  summary: Record<string, string>;
  answers: Array<{
    stageId: string;
    stageTitle: string;
    questionId: string;
    label: string;
    value: string | string[] | null;
  }>;
};
