"use client"

import { useState } from "react"

import type { Stage } from "@/types/kit-proposal"

function Block({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null
  return (
    <div className="kdl-stage-block">
      <h4>{title}</h4>
      <ul className="kdl-list kdl-list--dense">
        {items.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
    </div>
  )
}

/**
 * Карточка этапа с единой структурой. Последний блок — что остаётся
 * полезным, если следующий этап не запускается: этап должен быть
 * останавливаемым без потери вложенного.
 */
export function StageCard({
  stage,
  defaultOpen,
  compact,
}: {
  stage: Stage
  defaultOpen?: boolean
  /**
   * На основной странице этап отвечает на четыре вопроса покупателя:
   * что делаем, что получает КИТ, как поймём что получилось, что остаётся,
   * если дальше не идём. Ресурсы, интеграции и тестирование — в разделе
   * реализации: там их будут читать те, кто исполняет.
   */
  compact?: boolean
}) {
  const [open, setOpen] = useState(Boolean(defaultOpen))
  const bodyId = `stage-body-${stage.id}`

  return (
    <article className="kdl-stage">
      {/* Заголовок уровня секции для корректной иерархии: сам заголовок этапа
          живёт внутри кнопки как текст, поэтому дублируем его скрыто. */}
      <h3 className="kdl-sr-only">
        {stage.n} — {stage.title}
      </h3>
      <button
        type="button"
        className="kdl-stage-head"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={bodyId}
      >
        <span className="kdl-stage-n">{stage.n}</span>
        <span style={{ flex: 1 }}>
          <span className="kdl-stage-title">{stage.title}</span>
          <span className="kdl-stage-lead" style={{ display: "block" }}>
            {stage.lead}
          </span>
          <span className="kdl-stage-flags">
            <span className="kdl-flag" data-on={stage.needsAV}>
              {stage.needsAV ? "Нужна автономная техника" : "Без беспилотников"}
            </span>
            <span className="kdl-flag" data-on={stage.needsHub}>
              {stage.needsHub ? "Нужен объект" : "На действующем терминале"}
            </span>
          </span>
        </span>
        <span className="kdl-stage-chev" aria-hidden="true">
          {open ? "−" : "+"}
        </span>
      </button>

      {open ? (
        <div className="kdl-stage-body" id={bodyId}>
          <div className="kdl-stage-block">
            <h4>Задача</h4>
            <p style={{ fontSize: 14.5 }}>{stage.task}</p>
          </div>
          <Block title="Что делаем" items={stage.build} />
          <Block title="Что получает КИТ" items={stage.kitGets} />
          <Block title="Как поймём, что получилось" items={stage.acceptance} />

          {compact ? null : (
            <>
              <Block title="Что требуется от КИТ" items={stage.kitProvides} />
              <Block title="ИТ-ресурсы" items={stage.itResources} />
              <Block title="Физические ресурсы" items={stage.physResources} />
              <Block title="Данные" items={stage.data} />
              <Block title="Интеграции" items={stage.integrations} />
              <Block title="Тестирование" items={stage.testing} />
              <Block title="Показатели" items={stage.kpi} />
              <Block title="Риски" items={stage.risks} />
            </>
          )}

          <div className="kdl-stage-standalone">
            <h4>Что остаётся, если следующий этап не запускается</h4>
            <p>{stage.standalone}</p>
          </div>
        </div>
      ) : null}
    </article>
  )
}
