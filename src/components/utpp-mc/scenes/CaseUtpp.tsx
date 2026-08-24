"use client"

import { Stage } from "../primitives"
import { caseUtpp } from "../content.ru"

/**
 * АКТ IV, кейс Палаты. UI-симуляция: детерминированная, без внешнего API.
 *
 * Обращение слева стоит неподвижно всю сцену — это важно: зритель видит,
 * что входные данные не менялись, изменился только путь их обработки.
 * Справа семь шагов разбора появляются по одному.
 */
export default function CaseUtpp({
  index,
  total,
  collapsed,
}: {
  index: number
  total: number
  collapsed: boolean
}) {
  const beats = caseUtpp.steps.length

  return (
    <Stage
      id={caseUtpp.id}
      tone="ivory"
      label={caseUtpp.sceneLabel}
      index={index}
      total={total}
      beats={beats}
      collapsed={collapsed}
    >
      {(beat) => {
        const b = collapsed ? beats - 1 : beat
        const done = b >= beats - 1

        return (
          <div className="utpp-case">
            <header className="utpp-case-head">
              <p className="utpp-eyebrow">{caseUtpp.eyebrow}</p>
              <h2 className="utpp-h2 utpp-h2--wide">{caseUtpp.title}</h2>
            </header>

            <div className="utpp-case-body">
              <aside className="utpp-case-req">
                <p className="utpp-note">Входящее обращение</p>
                <p className="utpp-case-from">{caseUtpp.request.from}</p>
                <blockquote>{caseUtpp.request.text}</blockquote>
                <p className="utpp-small utpp-case-lead">{caseUtpp.lead}</p>
              </aside>

              <ol className="utpp-case-steps">
                {caseUtpp.steps.map((s, i) => (
                  <li
                    key={s.n}
                    className="utpp-fade"
                    data-state={i > b ? "future" : i < b ? "past" : "now"}
                  >
                    <span className="utpp-num">{s.n}</span>
                    <div>
                      <b>{s.name}</b>
                      <span>{s.short}</span>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <footer className="utpp-case-foot" data-on={done}>
              <p className="utpp-case-boundary">{caseUtpp.boundary}</p>
              <p className="utpp-key">{caseUtpp.key}</p>
            </footer>
          </div>
        )
      }}
    </Stage>
  )
}
