"use client"

import { Reveal, Scene } from "../primitives"
import { fourP } from "../content.ru"

/**
 * АКТ II. Методика как замкнутый цикл, а не как лестница.
 * Кольцо из четырёх дуг прорисовывается по очереди; направление обхода
 * задаёт стрелка. После «Перестроить» дуга возвращается к «Понять» —
 * это и есть главное содержание схемы.
 */

const CX = 210
const CY = 210
const R = 126

function polar(r: number, deg: number): [number, number] {
  const a = (deg * Math.PI) / 180
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)]
}

function arcPath(from: number, to: number, r = R): string {
  const [x1, y1] = polar(r, from)
  const [x2, y2] = polar(r, to)
  const large = to - from > 180 ? 1 : 0
  return `M${x1.toFixed(2)} ${y1.toFixed(2)} A${r} ${r} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`
}

/** Четыре дуги по 84° с зазорами; первая начинается сверху. */
const SEGMENTS = fourP.items.map((item, i) => {
  const from = i * 90 - 87
  const to = i * 90 - 3
  return { item, from, to, mid: (from + to) / 2, len: (R * (to - from) * Math.PI) / 180 }
})

export default function FourP({ index, total }: { index: number; total: number }) {
  return (
    <Scene id={fourP.id} tone="ink" label={fourP.sceneLabel} index={index} total={total}>
      <div className="utpp-fourp">
        <div className="utpp-fourp-text">
          <Reveal>
            <p className="utpp-eyebrow">{fourP.eyebrow}</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="utpp-h2">{fourP.title}</h2>
          </Reveal>

          <ol className="utpp-fourp-list">
            {fourP.items.map((it, i) => (
              <Reveal as="li" key={it.step} delay={0.1 + i * 0.06}>
                <span className="utpp-num">{String(i + 1).padStart(2, "0")}</span>
                <b>{it.title}</b>
                <span className="utpp-fourp-short">{it.short}</span>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={0.3}>
            <p className="utpp-key utpp-fourp-key">{fourP.key}</p>
          </Reveal>
        </div>

        <Reveal delay={0.12} className="utpp-fourp-figwrap">
          <svg
            viewBox="46 46 328 328"
            className="utpp-fourp-svg"
            role="img"
            aria-label="Кольцо из четырёх шагов: Понять, Поручить, Проверить, Перестроить — замкнутый цикл"
          >
            {SEGMENTS.map((s, i) => {
              const [nx, ny] = polar(R + 26, s.mid)
              const [lx, ly] = polar(R - 52, s.mid)
              return (
                <g key={s.item.step}>
                  <path
                    d={arcPath(s.from, s.to)}
                    className="utpp-fourp-arc"
                    style={{
                      strokeDasharray: s.len,
                      strokeDashoffset: 0,
                      animationDelay: `${0.15 + i * 0.22}s`,
                      ["--arc-len" as string]: `${s.len}`,
                    }}
                  />
                  <text x={nx} y={ny + 3} className="utpp-fourp-n">
                    {String(i + 1).padStart(2, "0")}
                  </text>
                  <text x={lx} y={ly + 5} className="utpp-fourp-label">
                    {s.item.title}
                  </text>
                </g>
              )
            })}

            {/* Замыкание цикла: короткая бордовая дуга и стрелка в вершине
                кольца — единственное место схемы, где звучит акцент.
                Именно она означает «после Перестроить снова Понять». */}
            <g className="utpp-fourp-return">
              <path d={arcPath(250, 268, R)} className="utpp-fourp-arc-return" />
              <path
                d={`M${CX - 7} ${CY - R - 8} L${CX + 11} ${CY - R} L${CX - 7} ${CY - R + 8} Z`}
                className="utpp-fourp-head"
              />
            </g>

            <circle cx={CX} cy={CY} r={3} className="utpp-fourp-hub" />
          </svg>
        </Reveal>
      </div>
    </Scene>
  )
}
