import Link from "next/link"

import type { Confidence } from "@/types/kit-proposal"

const CONFIDENCE_LABEL: Record<Confidence, string> = {
  confirmed: "Подтверждено",
  hypothesis: "Рабочая гипотеза",
  question: "Требует подтверждения КИТ",
  signal: "Сигнал от руководства КИТ",
}

/**
 * Бейдж уверенности. Цвет никогда не единственный носитель смысла —
 * текстовая метка присутствует всегда.
 */
export function ConfidenceBadge({
  level,
  short = false,
}: {
  level: Confidence
  short?: boolean
}) {
  const full = CONFIDENCE_LABEL[level]
  const text = short && level === "question" ? "Вопрос к КИТ" : full
  return (
    <span className="kdl-badge" data-c={level} title={full}>
      {text}
    </span>
  )
}

/** Верхний индекс со ссылкой на запись доказательной базы. */
export function SourceRef({ id }: { id: string }) {
  const n = id.replace(/^SRC-0?/, "")
  return (
    <Link
      className="kdl-src"
      href={`/presentation/kit-digital-logistics/evidence#${id}`}
      aria-label={`Источник ${id}`}
    >
      [{n}]
    </Link>
  )
}

/** Числовой блок: крупное значение, мелкая подпись. */
export function StatGrid({
  items,
}: {
  items: { value: string; label: string }[]
}) {
  return (
    <div className="kdl-stats">
      {items.map((s) => (
        <div key={s.label}>
          <div className="kdl-stat-v">{s.value}</div>
          <div className="kdl-stat-l">{s.label}</div>
        </div>
      ))}
    </div>
  )
}

/** Плашка-акцент для крупного утверждения. Не чаще одного раза на секцию. */
export function Callout({
  children,
  variant,
  wide,
}: {
  children: React.ReactNode
  variant?: "quiet"
  wide?: boolean
}) {
  const cls = [
    "kdl-callout",
    variant === "quiet" ? "kdl-callout--quiet" : "",
    wide ? "kdl-callout--wide" : "",
  ]
    .filter(Boolean)
    .join(" ")
  return <div className={cls}>{children}</div>
}

/** Заголовок секции: эйбрау + h2 + лид. */
export function SectionHead({
  eyebrow,
  title,
  lead,
  id,
}: {
  eyebrow: string
  title: string
  lead?: string
  id?: string
}) {
  return (
    <header>
      <span className="kdl-eyebrow">{eyebrow}</span>
      <h2 className="kdl-h2" id={id}>
        {title}
      </h2>
      {lead ? <p className="kdl-lead">{lead}</p> : null}
    </header>
  )
}

/** Маркированный список в фирменном стиле раздела. */
export function Bullets({
  items,
  dense,
}: {
  items: string[]
  dense?: boolean
}) {
  return (
    <ul className={`kdl-list${dense ? " kdl-list--dense" : ""}`}>
      {items.map((t, i) => (
        <li key={i}>{t}</li>
      ))}
    </ul>
  )
}

/** Ссылка на deep-dive страницу. */
export function DeepDiveLink({
  href,
  title,
  desc,
}: {
  href: string
  title: string
  desc: string
}) {
  return (
    <Link className="kdl-ddlink" href={href}>
      <div className="kdl-ddlink-t">{title}</div>
      <div className="kdl-ddlink-d">{desc}</div>
      <div className="kdl-ddlink-a">Открыть раздел →</div>
    </Link>
  )
}

/** Возврат из deep dive в основной документ, с якорем на секцию. */
export function BackToNarrative({ anchor }: { anchor?: string }) {
  const href = anchor
    ? `/presentation/kit-digital-logistics#${anchor}`
    : "/presentation/kit-digital-logistics"
  return (
    <Link className="kdl-back" href={href}>
      ← К основному документу
    </Link>
  )
}

/** Обёртка схемы: подпись сверху, пояснение снизу. */
export function Figure({
  caption,
  note,
  children,
  scroll,
}: {
  caption: string
  note?: string
  children: React.ReactNode
  scroll?: boolean
}) {
  return (
    <figure className="kdl-fig">
      <figcaption className="kdl-fig-cap">{caption}</figcaption>
      {scroll ? <div className="kdl-svg-scroll">{children}</div> : children}
      {note ? <p className="kdl-fig-note">{note}</p> : null}
    </figure>
  )
}
