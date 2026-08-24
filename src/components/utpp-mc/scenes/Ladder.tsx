"use client"

import { Stage } from "../primitives"
import { ladder } from "../content.ru"

/**
 * АКТ I. Semantic morph — центральный motion-мотив деки.
 *
 * Не пять картинок и не пять слайдов: один объект, вокруг которого по
 * очереди нарастают слои. Контур каждого слоя прорисовывается по периметру
 * (stroke-dashoffset) — это единственная анимация, которую стоит делать
 * заметной: она показывает, как элементы связываются.
 *
 * Ни один слой не исчезает. К пятому beat'у на экране вся конструкция
 * целиком — и видно, что «агент» это не другой продукт, а тот же чат
 * с достроенными слоями.
 */

const CX = 265
const CY = 215

/** Слои от ядра наружу; порядок соответствует ladder.stages. */
const RINGS = [
  { w: 110, h: 70 },
  { w: 190, h: 130 },
  { w: 270, h: 190 },
  { w: 350, h: 250 },
  { w: 430, h: 310 },
]

function ringGeom(i: number) {
  const { w, h } = RINGS[i]!
  return { x: CX - w / 2, y: CY - h / 2, w, h, len: 2 * (w + h) }
}

export default function Ladder({
  index,
  total,
  collapsed,
}: {
  index: number
  total: number
  collapsed: boolean
}) {
  const beats = ladder.stages.length

  return (
    <Stage
      id={ladder.id}
      tone="sheet"
      label={ladder.sceneLabel}
      index={index}
      total={total}
      beats={beats}
      collapsed={collapsed}
    >
      {(beat) => {
        const active = collapsed ? beats - 1 : beat
        const stage = ladder.stages[active]!

        return (
          <div className="utpp-ladder">
            <header className="utpp-ladder-head">
              <p className="utpp-eyebrow">{ladder.eyebrow}</p>
              <h2 className="utpp-h2 utpp-h2--wide">{ladder.title}</h2>
            </header>

            {/* Шкала состояний: видно всю дорогу целиком, но горит одно */}
            <ol className="utpp-ladder-scale" aria-label="Пять состояний системы">
              {ladder.stages.map((s, i) => (
                <li
                  key={s.key}
                  data-state={i === active ? "now" : i < active ? "past" : "future"}
                >
                  <span className="utpp-num">{String(i + 1).padStart(2, "0")}</span>
                  <b>{s.name}</b>
                </li>
              ))}
            </ol>

            <div className="utpp-ladder-body">
              <div className="utpp-ladder-text">
                <p className="utpp-ladder-formula">{stage.formula}</p>
                {stage.term ? (
                  <p className="utpp-ladder-term">
                    на рынке это называют <b>{stage.term}</b>
                  </p>
                ) : null}
                <dl className="utpp-ladder-dl">
                  <div>
                    <dt>Что даёт</dt>
                    <dd>{stage.gain}</dd>
                  </div>
                  <div>
                    <dt>Чем платим</dt>
                    <dd>{stage.cost}</dd>
                  </div>
                </dl>
              </div>

              <figure className="utpp-ladder-fig">
                <LadderDiagram active={active} />
                <figcaption className="utpp-note">
                  Один объект. Каждый слой достраивается к предыдущему.
                </figcaption>
              </figure>
            </div>

            <p className="utpp-lead utpp-ladder-lead">{ladder.lead}</p>
          </div>
        )
      }}
    </Stage>
  )
}

function LadderDiagram({ active }: { active: number }) {
  return (
    <svg
      viewBox="0 32 530 352"
      className="utpp-ladder-svg"
      role="img"
      aria-label="Схема: ядро модели, вокруг которого нарастают слои контекста, памяти, инструментов и процесса"
    >
      {/* Ядро */}
      <g data-on={active >= 0}>
        <rect
          {...rectProps(0)}
          className="utpp-ring utpp-ring--core"
          style={dash(0, active >= 0)}
        />
        <text x={CX} y={CY + 4} className="utpp-ring-core-label">
          МОДЕЛЬ
        </text>
      </g>

      {/* Слой 1 — контекст: материалы входят слева */}
      <g className="utpp-ring-g" data-on={active >= 1}>
        <rect {...rectProps(1)} className="utpp-ring" style={dash(1, active >= 1)} />
        {[185, 215, 245].map((y) => (
          <line key={y} x1={146} y1={y} x2={168} y2={y} className="utpp-ring-tick" />
        ))}
        <RingLabel i={1} text="КОНТЕКСТ" />
      </g>

      {/* Слой 2 — память: индекс архива по правому краю */}
      <g className="utpp-ring-g" data-on={active >= 2}>
        <rect {...rectProps(2)} className="utpp-ring" style={dash(2, active >= 2)} />
        {Array.from({ length: 9 }, (_, i) => 152 + i * 16).map((y) => (
          <line key={y} x1={382} y1={y} x2={398} y2={y} className="utpp-ring-tick" />
        ))}
        <RingLabel i={2} text="ПАМЯТЬ" />
      </g>

      {/* Слой 3 — инструменты: разъёмы наружу */}
      <g className="utpp-ring-g" data-on={active >= 3}>
        <rect {...rectProps(3)} className="utpp-ring" style={dash(3, active >= 3)} />
        {[150, 185, 220, 255].map((y) => (
          <g key={y}>
            <line x1={440} y1={y} x2={464} y2={y} className="utpp-ring-tick" />
            <circle cx={467} cy={y} r={3} className="utpp-ring-port" />
          </g>
        ))}
        <RingLabel i={3} text="ИНСТРУМЕНТЫ" />
      </g>

      {/* Слой 4 — процесс: вход, выход, замкнутый контур */}
      <g className="utpp-ring-g" data-on={active >= 4}>
        <rect {...rectProps(4)} className="utpp-ring" style={dash(4, active >= 4)} />
        <line x1={14} y1={CY} x2={44} y2={CY} className="utpp-ring-flow" />
        <path d="M44 215 L36 211 L36 219 Z" className="utpp-ring-head" />
        <line x1={480} y1={CY} x2={512} y2={CY} className="utpp-ring-flow" />
        <path d="M516 215 L508 211 L508 219 Z" className="utpp-ring-head" />
        <RingLabel i={4} text="ПРОЦЕСС" />
      </g>
    </svg>
  )
}

function RingLabel({ i, text }: { i: number; text: string }) {
  const g = ringGeom(i)
  return (
    <text x={g.x + 9} y={g.y - 8} className="utpp-ring-label">
      {text}
    </text>
  )
}

function rectProps(i: number) {
  const g = ringGeom(i)
  return { x: g.x, y: g.y, width: g.w, height: g.h }
}

function dash(i: number, on: boolean): React.CSSProperties {
  const { len } = ringGeom(i)
  return { strokeDasharray: len, strokeDashoffset: on ? 0 : len }
}
