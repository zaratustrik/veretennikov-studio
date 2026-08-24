"use client"

import { Stage } from "../primitives"
import { coldOpen } from "../content.ru"

/**
 * АКТ 0. Утро руководителя.
 *
 * Четыре beat'а наращивают поток входящих — почта, мессенджеры, документы,
 * внешний контур. Это не хаотичный fly-in: каждый слой встаёт на своё место
 * и остаётся. Счётчик слева считает не сообщения, а требования к вниманию.
 *
 * На пятом beat'е весь поток уходит в тень и остаётся один вопрос.
 * Именно ради этого перехода сцена сделана staged, а не обычной.
 */
export default function ColdOpen({
  index,
  total,
  collapsed,
}: {
  index: number
  total: number
  collapsed: boolean
}) {
  const groups = coldOpen.beats
  const beats = groups.length + 1
  const questionBeat = groups.length

  return (
    <Stage
      id={coldOpen.id}
      tone="ink"
      label={coldOpen.sceneLabel}
      index={index}
      total={total}
      beats={beats}
      collapsed={collapsed}
    >
      {(beat) => {
        const shown = collapsed ? groups.length : Math.min(beat + 1, groups.length)
        const asking = collapsed ? false : beat >= questionBeat
        const count = groups
          .slice(0, shown)
          .reduce((n, g) => n + g.items.length, 0)

        return (
          <div className="utpp-cold" data-asking={asking} data-flow={collapsed || undefined}>
            <div className="utpp-cold-left">
              <p className="utpp-eyebrow utpp-eyebrow--muted">{coldOpen.eyebrow}</p>
              <p className="utpp-cold-time">{coldOpen.time}</p>
              <p className="utpp-cold-count">
                <span>{count}</span>
                требуют вашего внимания
              </p>
            </div>

            <div className="utpp-cold-right" aria-hidden={asking || undefined}>
              {groups.map((g, gi) => (
                <div
                  key={g.caption}
                  className="utpp-cold-group"
                  data-on={gi < shown}
                  style={{ transitionDelay: `${gi === shown - 1 ? 0 : 0}s` }}
                >
                  <p className="utpp-cold-caption">{g.caption}</p>
                  <ul>
                    {g.items.map((it, ii) => (
                      <li key={it.subject} style={{ transitionDelay: `${ii * 0.07}s` }}>
                        <b>{it.from}</b>
                        <span>{it.subject}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <p className="utpp-cold-question" data-on={asking || collapsed}>
              {coldOpen.question}
            </p>
          </div>
        )
      }}
    </Stage>
  )
}
