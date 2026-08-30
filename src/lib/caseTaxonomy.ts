/**
 * Таксономия портфолио.
 *
 * Категория считается на слое представления, а не хранится в базе: менять
 * раскладку витрины не должно означать миграцию и потерю истории. Порядок
 * категорий здесь же — это и есть порядок разделов на /cases.
 *
 * Почему не по полю `type`: в базе тип отражает производственный процесс
 * (VIDEO / DEV / GAME), а B2B-покупателю нужна отраслевая и продуктовая
 * рамка. «Белоярская АЭС» и «имиджевый ролик фитнес-клуба» — оба VIDEO,
 * но для директора завода это совершенно разные доказательства.
 */

export type CaseCategory =
  | "ai"
  | "industry"
  | "platform"
  | "visual"
  | "film"
  | "lab"

export interface CategoryMeta {
  key: CaseCategory
  label: string
  /** Короткое пояснение под заголовком раздела. */
  note: string
}

/** Порядок разделов на витрине. Лаборатория всегда последняя. */
export const CATEGORY_ORDER: CategoryMeta[] = [
  {
    key: "ai",
    label: "ИИ и автоматизация",
    note: "Системы, которые встраиваются в рабочий процесс",
  },
  {
    key: "industry",
    label: "Промышленность",
    note: "Производство, оборудование, инфраструктура",
  },
  {
    key: "platform",
    label: "Платформы и разработка",
    note: "Отраслевые цифровые сервисы под задачу заказчика",
  },
  {
    key: "visual",
    label: "3D и визуализация",
    note: "То, что нельзя снять камерой",
  },
  {
    key: "film",
    label: "Фильмы и видео",
    note: "Корпоративные, имиджевые и событийные проекты",
  },
  {
    key: "lab",
    label: "Лаборатория",
    note: "Собственные эксперименты студии. Инженерная культура, а не коммерческие работы",
  },
]

export const CATEGORY_LABEL: Record<CaseCategory, string> = Object.fromEntries(
  CATEGORY_ORDER.map((c) => [c.key, c.label])
) as Record<CaseCategory, string>

/**
 * Явные назначения. Всё, что не перечислено, попадает в `film` для VIDEO,
 * в `platform` для DEV и в `lab` для GAME — см. categoryOf().
 */
const EXPLICIT: Record<string, CaseCategory> = {
  // ИИ и автоматизация
  "industrial-cooperation": "ai",

  // Платформы и разработка
  "medical-education-platform": "platform",
  "road-analytics-platform": "platform",
  "medical-training-platform": "platform",

  // Промышленность
  "belojarskaya-aes": "industry",
  "6YA7dyiF3th9v3tRTcKu77": "industry", // Промэлектроника
  "8wjNKW31ftL3rGpAq2xCYu": "industry", // Технэкс
  "kESPfvNod3wgWQYPMAecCX": "industry", // Биосмарт
  "wTWpUo7DmVKGGZT1gnCAvA": "industry", // СГМ Исеть
  "65QNajSjDbGV14xw9aksJn": "industry", // Аверс СК — телеинспекция
  "vPwmgv3cKAaBKibL2Vd4cA": "industry", // Аверс СК — промывка
  "iUdS3ib21tVK1wG4WGnZRz": "industry", // Аверс СК — сварка
  "p4UjDqq1LBeKCEMEbZJhDy": "industry", // Аверс СК — котлован
  "tJrus5A4PHamXiyT1mmwEa": "industry", // Фотек
  "3vGy2hUZmGGsmeLVYp6GUU": "industry", // Fores
  "8r45SdwNJrDMKBM8MDtCLo": "industry", // НИПИгормаш
  "wNHzmzZ3VZa83zB6pjm8Yi": "industry", // Сервис Инжиниринг
  "j14XaeR1BKJog7oSD9Rwg7": "industry", // Сервис Инжиниринг — промо
  "pdVG48P5PMc5h6TCtctZoA": "industry", // Автодор, трасса Р242
  "auiMfnBmqXV7PX6mTR8c8Y": "industry", // Система управления транспортом
  "g14K6oxoENBwsHhJbVw28w": "industry", // Деловые Линии
  "rE3y9GBS1zKQD1iiQPva22": "industry", // Развязка у ТРЦ «Калина»

  // 3D и визуализация
  "9vn3wPsEmvYiF3VibYT6ha": "visual", // Парогенератор ПГм-15 — 3D техпроцесса
  tarket: "visual", // 3D-визуализация производственного процесса
  rostelekom: "visual", // 3D и motion design

  // Лаборатория
  life: "lab",
  particles: "lab",
}

export function categoryOf(c: { slug: string; type: string }): CaseCategory {
  const explicit = EXPLICIT[c.slug]
  if (explicit) return explicit
  if (c.type === "GAME") return "lab"
  if (c.type === "DEV") return "platform"
  if (c.type === "AI" || c.type === "SYNTHESIS") return "ai"
  return "film"
}

/** Ранг для сортировки — соответствует CATEGORY_ORDER. */
export function categoryRank(cat: CaseCategory): number {
  const i = CATEGORY_ORDER.findIndex((c) => c.key === cat)
  return i === -1 ? CATEGORY_ORDER.length : i
}
