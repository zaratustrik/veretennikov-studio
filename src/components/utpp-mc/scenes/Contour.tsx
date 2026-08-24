"use client"

import { Stage } from "../primitives"
import { contour } from "../content.ru"

/**
 * АКТ V. Корпоративный ИИ-контур.
 *
 * Шесть слоёв показаны сразу целиком — руководитель должен увидеть масштаб
 * системы, — но рассказ идёт по одному. Focus choreography: пройденные слои
 * остаются читаемыми, будущие не конкурируют за внимание.
 *
 * Слева вертикаль контура прорастает вниз по мере разбора: это и есть
 * ответ на вопрос «насколько глубоко это заходит в организацию».
 */
export default function Contour({
  index,
  total,
  collapsed,
}: {
  index: number
  total: number
  collapsed: boolean
}) {
  const beats = contour.layers.length

  return (
    <Stage
      id={contour.id}
      tone="ink"
      label={contour.sceneLabel}
      index={index}
      total={total}
      beats={beats}
      collapsed={collapsed}
    >
      {(beat) => {
        const b = collapsed ? beats - 1 : beat
        const current = contour.layers[b]!

        return (
          <div className="utpp-contour">
            <header className="utpp-contour-head">
              <p className="utpp-eyebrow">{contour.eyebrow}</p>
              <h2 className="utpp-h2 utpp-h2--wide">{contour.title}</h2>
              <p className="utpp-lead utpp-contour-lead">{contour.lead}</p>
            </header>

            <div className="utpp-contour-stack">
              <span
                className="utpp-contour-spine"
                aria-hidden="true"
                style={{ transform: `scaleY(${(b + 1) / beats})` }}
              />

              {contour.layers.map((l, i) => (
                <div
                  key={l.key}
                  className="utpp-contour-layer utpp-fade"
                  data-state={i > b ? "future" : i < b ? "past" : "now"}
                >
                  <p className="utpp-contour-name">
                    <span className="utpp-num">{String(i + 1).padStart(2, "0")}</span>
                    {l.name}
                  </p>
                  <ul>
                    {l.nodes.map((n) => (
                      <li key={n}>{n}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="utpp-contour-note" aria-live="polite">
              <p>{current.note}</p>
            </div>

            <p className="utpp-key utpp-contour-key" data-on={b >= beats - 1}>
              {contour.key}
            </p>
          </div>
        )
      }}
    </Stage>
  )
}
