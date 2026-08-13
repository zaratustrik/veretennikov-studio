/**
 * Типы закрытого digital proposal для ТК КИТ.
 * Контент живёт в src/data/kit-proposal/*.json, визуал — в компонентах.
 */

/** Уровень уверенности в утверждении. Цвет никогда не единственный носитель смысла. */
export type Confidence =
  | "confirmed" // Подтверждено — есть источник
  | "hypothesis" // Рабочая гипотеза — наш вывод
  | "question" // Требует подтверждения КИТ
  | "signal" // STAKEHOLDER_SIGNAL — заявление руководства КИТ

export type Horizon = "A" | "B"

export interface Meta {
  title: string
  subtitle: string
  stamp: string
  author: string
  authorRole: string
  checkedAt: string
  contact: { label: string; value: string; href: string }[]
}

export interface Chapter {
  id: string
  n: string
  title: string
  /** Смысловая группа для оглавления: руководитель не должен держать в голове 14 секций. */
  group: string
}

/** Числовой блок «О компании в цифрах» с сайта КИТ. */
export interface Stat {
  value: string
  label: string
}

/** Элемент карты существующих систем КИТ. */
export interface SystemItem {
  name: string
  kind: string
  note: string
  confidence: Confidence
  source?: string
}

/** Capability block — что может появиться. */
export interface Capability {
  id: string
  n: string
  title: string
  /** Русский смысл рядом с англоязычным названием блока. */
  ru: string
  what: string
  problem: string
  effect: string
  data: string[]
  start: string
  horizon: Horizon
}

/** Полная карточка этапа реализации. */
export interface Stage {
  id: string
  n: string
  title: string
  lead: string
  needsAV: boolean
  needsHub: boolean
  task: string
  build: string[]
  kitGets: string[]
  kitProvides: string[]
  itResources: string[]
  physResources: string[]
  data: string[]
  integrations: string[]
  testing: string[]
  acceptance: string[]
  kpi: string[]
  risks: string[]
  /** Что остаётся полезным, если следующий этап не запускается. Критический пункт. */
  standalone: string
}

export interface Risk {
  risk: string
  mitigation: string
}

export interface Question {
  n: string
  q: string
  ifA: string
  ifB: string
}

/** Технология Horizon B. */
export interface Technology {
  id: string
  title: string
  group: "ready" | "developing" | "horizon"
  what: string
  whereWorks: string
  maturityWorld: string
  maturityRu: string
  forKit: string
  limits: string
  reserve: string
  source?: string
}

/** Драйвер экономического эффекта. */
export interface EffectDriver {
  id: string
  title: string
  direction: "down" | "up"
  formula: string
  needs: string
  baseline: string
  whenMeasurable: string
}

/** Класс инфраструктурного ресурса. */
export interface ResourceClass {
  scale: "pilot" | "corridor" | "scale"
  scaleLabel: string
  items: { name: string; note: string }[]
}

/** Запись доказательной базы. */
export interface Source {
  id: string
  claim: string
  url?: string
  publisher: string
  eventDate: string
  checkedAt: string
  status: string
  confidence: "HIGH" | "MEDIUM" | "LOW"
  note?: string
}

/** Шаг «Один рейс как цифровой объект». */
export interface JourneyStep {
  id: string
  n: string
  title: string
  executor: string
  attrs: { key: string; label: string; value: string; gap: boolean }[]
}
