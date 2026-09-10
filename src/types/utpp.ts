/**
 * Типы закрытой проектной страницы УТПП (/utpp).
 *
 * Сознательно без ролевой модели: страницу открывает один человек по общему
 * коду доступа и видит один и тот же набор вопросов. Если он передаст ссылку
 * коллеге, тот увидит ровно то же самое и сможет отправить свой ответ отдельно.
 */

/**
 * Версия набора вопросов. Поднимать при изменении состава или смысла.
 *
 * 1.1.0 — добавлены уточнения о критериях целевой аудитории (l2–l4)
 *         и о внешних источниках проверки организаций (r4–r6).
 *         Черновики версии 1.0.0 при этом сбрасываются: набор изменился,
 *         и восстанавливать ответы на другую форму нельзя.
 */
export const QUESTION_SET_VERSION = "1.1.0"

/* ── Вопросы ──────────────────────────────────────────────────────── */

type BaseQuestion = {
  id: string
  /** Раздел страницы, в котором стоит вопрос. */
  sectionId: SectionId
  /** Сам вопрос. */
  label: string
  /** Одна строка «зачем нужен ответ». Показывается над вопросом. */
  why: string
}

export type SingleQuestion = BaseQuestion & {
  type: "single"
  options: string[]
  /** Необязательное поле комментария под вариантами. */
  comment?: { label: string; placeholder?: string }
}

export type MultiQuestion = BaseQuestion & {
  type: "multi"
  options: string[]
  /** Максимум выбранных вариантов. */
  maxSelections?: number
  /** Добавить вариант «Другое» с полем уточнения. */
  allowOther?: boolean
  comment?: { label: string; placeholder?: string }
}

export type TextQuestion = BaseQuestion & {
  type: "text"
  placeholder?: string
}

export type Question = SingleQuestion | MultiQuestion | TextQuestion

/* ── Ответы ───────────────────────────────────────────────────────── */

/**
 * Ответ на один вопрос.
 *
 *  single → `choice`
 *  multi  → `choices` (+ `other` для варианта «Другое»)
 *  text   → `text`
 *
 * `comment` относится к вопросам, у которых объявлено поле комментария.
 */
export type Answer = {
  choice?: string
  choices?: string[]
  other?: string
  text?: string
  comment?: string
}

export type Answers = Record<string, Answer>

/** Черновик в localStorage. */
export type Draft = {
  questionSetVersion: string
  updatedAt: string
  answers: Answers
  respondentName?: string
}

/* ── Разделы ленты ────────────────────────────────────────────────── */

export type SectionId =
  | "start"
  | "core"
  | "card"
  | "application"
  | "members"
  | "events"
  | "leads"
  | "dependencies"
  | "resources"
  | "answers"
  | "next"

export type SectionMeta = {
  id: SectionId
  /** Подпись в боковой навигации. */
  nav: string
}

/* ── Контент инициативы ───────────────────────────────────────────── */

/**
 * Дополнительный смысловой слой внутри инициативы.
 *
 * Пока нужен только обращениям: там мало зафиксировать очередь — нужно
 * ответить на вопрос «относится ли организация к целевой аудитории».
 * Поле необязательное, остальные четыре инициативы его не используют.
 */
export type Qualification = {
  title: string
  lead: string
  /** Разведение понятий, которые легко перепутать. */
  distinctions: { term: string; text: string }[]
  /** Допустимые статусы предварительной проверки. «Принят»/«отклонён» здесь нет. */
  statuses: { label: string; note: string }[]
  statusesNote: string
  flow: {
    title: string
    steps: { label: string; note: string }[]
    note: string
  }
}

export type Initiative = {
  id: SectionId
  /** Номер в исходном перечне процессов ОРЧП, переданном 09.09.2026. */
  sourceNumber: number
  title: string
  /** Рабочая ситуация — нейтрально, без оценок. */
  situation: string
  goal: string
  /** Что намереваемся сделать. */
  intent: string
  /** Эффект для Палаты, сотрудников и членов. */
  effect: string
  /** Кому помогает — одной строкой. */
  helps: string
  qualification?: Qualification
  scope: { included: string[]; excluded: string[] }
  image: { src: string; alt: string }
  details: {
    data: string[]
    participation: string[]
    dependencies: string[]
    measure: string[]
    hypotheses: string[]
  }
}
