"use client"

import { useState } from "react"

import type { JourneyStep } from "@/types/kit-proposal"

/**
 * «Один рейс как цифровой объект»: лента шагов, раскрытие восьми атрибутов.
 * Жёлтым подсвечено то, что сегодня, вероятно, существует только в решении
 * диспетчера — это гипотеза, а не утверждение о системах КИТ.
 */
export function JourneyStrip({ steps }: { steps: JourneyStep[] }) {
  const [activeId, setActiveId] = useState(steps[4]?.id ?? steps[0]!.id)
  const active = steps.find((s) => s.id === activeId) ?? steps[0]!
  const gaps = active.attrs.filter((a) => a.gap).length

  return (
    <div>
      <div className="kdl-journey" role="tablist" aria-label="Шаги рейса">
        {steps.map((s) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={s.id === activeId}
            className="kdl-journey-step"
            data-active={s.id === activeId}
            onClick={() => setActiveId(s.id)}
          >
            <div className="kdl-journey-n">{s.n}</div>
            <div className="kdl-journey-t">{s.title}</div>
            <div className="kdl-journey-e">{s.executor}</div>
          </button>
        ))}
      </div>

      <div className="kdl-journey-panel">
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            alignItems: "baseline",
            justifyContent: "space-between",
          }}
        >
          <h3 className="kdl-h3">
            {active.n} · {active.title}
          </h3>
          <span className="kdl-small">
            {gaps > 0
              ? `${gaps} из 8 атрибутов, вероятно, не хранятся как данные`
              : "Все восемь атрибутов существуют в системах"}
          </span>
        </div>

        <div className="kdl-attrs">
          {active.attrs.map((a) => (
            <div key={a.key} className="kdl-attr" data-gap={a.gap}>
              <div className="kdl-attr-k">{a.label}</div>
              <div className="kdl-attr-v">{a.value}</div>
              {a.gap ? (
                <span className="kdl-attr-gap">Гипотеза: не фиксируется</span>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
