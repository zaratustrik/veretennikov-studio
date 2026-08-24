"use client"

import { Reveal, Scene } from "../primitives"
import { callback } from "../content.ru"

/**
 * АКТ VI. Возвращение к 08:03.
 *
 * Композиция намеренно повторяет холодное открытие: та же вертикаль
 * времени слева, то же место потока справа. Изменилось только одно —
 * вместо двенадцати равноправных входящих семь точек внимания.
 * Приём работает без единого слова объяснения.
 */
export default function Callback({ index, total }: { index: number; total: number }) {
  const totalPoints = callback.points.reduce((n, p) => n + p.n, 0)

  return (
    <Scene
      id={callback.id}
      tone="ink"
      label={callback.sceneLabel}
      index={index}
      total={total}
    >
      <div className="utpp-cold utpp-cold--after">
        <div className="utpp-cold-left">
          <Reveal>
            <p className="utpp-eyebrow utpp-eyebrow--muted">{callback.eyebrow}</p>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="utpp-cold-time">{callback.time}</p>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="utpp-cold-count">
              <span>{totalPoints}</span>
              точек управленческого внимания
            </p>
          </Reveal>
        </div>

        <div className="utpp-cold-right">
          <ul className="utpp-after-points">
            {callback.points.map((p, i) => (
              <Reveal as="li" key={p.label} delay={0.18 + i * 0.08}>
                <b>{p.label}</b>
                <span className="utpp-after-dots" aria-hidden="true">
                  {Array.from({ length: p.n }, (_, k) => (
                    <i key={k} />
                  ))}
                </span>
                <span className="utpp-after-n">{p.n}</span>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={0.5}>
            <p className="utpp-after-folded">{callback.folded}</p>
          </Reveal>

          <Reveal delay={0.56}>
            <p className="utpp-after-lead">{callback.lead}</p>
          </Reveal>
        </div>
      </div>
    </Scene>
  )
}
