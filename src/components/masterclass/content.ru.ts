/**
 * Контент мастер-класса «ИИ в работе».
 * Источник: AI_Masterclass_4P_Universal_v2 (PPTX/PDF). Номера страниц — sourcePages.
 * Тексты не выдумываются; допускается только сжатие для web-чтения.
 */

export type FourPStep = "understand" | "delegate" | "check" | "rebuild";

export type MasterclassChapter = {
  id: string;
  step?: FourPStep;
  eyebrow?: string;
  title: string;
  lead?: string;
  body?: string[];
  items?: Array<{ title: string; text: string; accent?: FourPStep }>;
  sourcePages: number[];
};

export const stepColors: Record<FourPStep, string> = {
  understand: "var(--accent-understand)",
  delegate: "var(--accent-delegate)",
  check: "var(--accent-check)",
  rebuild: "var(--accent-rebuild)",
};

export const hero = {
  badge: "Корпоративный мастер-класс",
  title: "ИИ в работе",
  words: [
    { text: "Понять", step: "understand" as FourPStep },
    { text: "Поручить", step: "delegate" as FourPStep },
    { text: "Проверить", step: "check" as FourPStep },
    { text: "Перестроить", step: "rebuild" as FourPStep },
  ],
  lead: "Практический мастер-класс: от умного чата — к повторяемым рабочим процессам и агентам.",
  author: "Веретенников Анатолий",
  sourcePages: [1, 25],
};

export const programVsAi: MasterclassChapter = {
  id: "program-vs-ai",
  step: "understand",
  eyebrow: "Шаг 1 · Понять",
  title: "ИИ — не обычная программа",
  lead:
    "Ответ не достаётся из базы готовых решений — он создаётся заново. Отсюда и сила, и ошибки.",
  items: [
    {
      title: "Обычная программа",
      text: "Правила заранее написаны человеком. Одинаковый вход — одинаковый результат. Ошибка — это сбой, его чинят.",
    },
    {
      title: "Нейросеть",
      text: "Модель обучена на огромном числе примеров. Знания хранятся в весах — числовых связях. Может ошибаться — уверенно и красиво.",
    },
    {
      title: "Новый запрос",
      text: "Проходит через обученные связи: получается вероятностный, а не гарантированный результат.",
    },
    {
      title: "Вывод",
      text: "Убедительно ≠ правильно. Гибкость и ошибки — две стороны одной природы, и этим можно управлять.",
    },
  ],
  sourcePages: [4],
};

export const fourP: MasterclassChapter = {
  id: "four-p",
  eyebrow: "Авторская методика мастер-класса",
  title: "Методика 4П",
  lead: "Четыре шага, которые превращают ИИ из развлечения в рабочий инструмент.",
  items: [
    {
      title: "Понять",
      accent: "understand",
      text: "Как работает инструмент и где его пределы? Модель, контекст, генерация, природа ошибок.",
    },
    {
      title: "Поручить",
      accent: "delegate",
      text: "Как передать задачу, чтобы получить результат? Контекст, материалы, формат, критерии качества.",
    },
    {
      title: "Проверить",
      accent: "check",
      text: "Почему этому результату можно доверять? Факты, логика, риски — до применения.",
    },
    {
      title: "Перестроить",
      accent: "rebuild",
      text: "Как сделать успех повторяемым процессом? От разовых запросов — к сценариям и агентам.",
    },
  ],
  sourcePages: [7],
};

/** Главы для навигации (в slice — первые четыре точки истории). */
export const chapters = [
  { id: "hero", label: "Начало" },
  { id: "program-vs-ai", label: "Понять" },
  { id: "four-p", label: "Методика 4П" },
] as const;
