"use client"

import { useState } from "react"
import { Reveal, Scene } from "../primitives"
import { autonomy } from "../content.ru"

/**
 * ПРОВЕРИТЬ. Не светофор, а шкала: от «человек решает всё» к «система
 * действует сама». Зритель выбирает операцию — указатель встаёт в нужное
 * положение и объясняет, почему именно там.
 *
 * Сознательно нет «запрещённой красной зоны»: вопрос не в разрешении,
 * а в цене ошибки. На заседании это работает как рабочая рамка,
 * а не как чужой регламент.
 */

const LEVEL_POS: Record<string, number> = {
  prepare: 16.667,
  draft: 50,
  auto: 83.333,
}

export default function Autonomy({ index, total }: { index: number; total: number }) {
  const [picked, setPicked] = useState<number | null>(null)
  const current = picked === null ? null : autonomy.cases[picked]!
  const level = current
    ? autonomy.levels.find((l) => l.key === current.level)!
    : null
  const pos = current ? LEVEL_POS[current.level]! : 50

  return (
    <Scene
      id={autonomy.id}
      tone="ivory"
      label={autonomy.sceneLabel}
      index={index}
      total={total}
    >
      <Reveal>
        <p className="utpp-eyebrow">{autonomy.eyebrow}</p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="utpp-h2 utpp-h2--wide">{autonomy.title}</h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="utpp-lead">{autonomy.lead}</p>
      </Reveal>

      <div className="utpp-auto">
        <ul className="utpp-auto-cases">
          {autonomy.cases.map((c, i) => (
            <li key={c.text}>
              <button
                type="button"
                data-active={picked === i}
                aria-pressed={picked === i}
                onClick={() => setPicked(picked === i ? null : i)}
              >
                {c.text}
              </button>
            </li>
          ))}
        </ul>

        <div className="utpp-auto-gauge">
          <div className="utpp-auto-axis">
            <span>больше человека</span>
            <span>больше автономии</span>
          </div>

          <div className="utpp-auto-track" data-armed={current !== null}>
            <i className="utpp-auto-marker" style={{ left: `${pos}%` }} aria-hidden="true" />
            {autonomy.levels.map((l) => (
              <span
                key={l.key}
                className="utpp-auto-zone"
                data-on={current?.level === l.key}
              />
            ))}
          </div>

          <ol className="utpp-auto-levels">
            {autonomy.levels.map((l) => (
              <li key={l.key} data-on={current?.level === l.key}>
                <b>{l.name}</b>
              </li>
            ))}
          </ol>

          <div className="utpp-auto-detail" aria-live="polite">
            {level ? (
              <>
                <p className="utpp-auto-role">{level.role}</p>
                <p className="utpp-small">{level.when}</p>
              </>
            ) : (
              <p className="utpp-auto-prompt">{autonomy.prompt}</p>
            )}
          </div>

          <p className="utpp-small utpp-auto-disc">{autonomy.disclaimer}</p>
        </div>
      </div>
    </Scene>
  )
}
