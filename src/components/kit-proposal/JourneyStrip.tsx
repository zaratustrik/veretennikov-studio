"use client"

import { useState } from "react"

import type { JourneyStep } from "@/types/kit-proposal"

/**
 * «Один рейс как цифровой объект»: лента шагов, раскрытие восьми атрибутов.
 * Отмеченные атрибуты — это перечень того, что нужно уточнить на обследовании,
 * а не утверждение о том, что у компании чего-то нет. Мы не видели внутренних
 * систем и диагноз до встречи не ставим.
 */
export function JourneyStrip({ steps }: { steps: JourneyStep[] }) {
  // По умолчанию открываем магистральное плечо: там есть и то, что заведомо
  // существует, и то, что нужно уточнить. Шаг, где отмечены все восемь
  // атрибутов, первым впечатлением читался бы как диагноз.
  const [activeId, setActiveId] = useState(steps[3]?.id ?? steps[0]!.id)
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
            {gaps > 0 ? (
              <>
                <span className="kdl-chip">?</span> — уточняем на обследовании, где и в
                каком виде это фиксируется сегодня ({gaps} из 8)
              </>
            ) : (
              "По открытым данным этот шаг закрыт"
            )}
          </span>
        </div>

        <div className="kdl-attrs">
          {active.attrs.map((a) => (
            <div key={a.key} className="kdl-attr" data-gap={a.gap}>
              <div className="kdl-attr-k">
                {a.label}
                {a.gap ? (
                  <span
                    className="kdl-chip"
                    title="Уточняем на обследовании, где и в каком виде это фиксируется"
                  >
                    ?
                  </span>
                ) : null}
              </div>
              <div className="kdl-attr-v">{a.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
