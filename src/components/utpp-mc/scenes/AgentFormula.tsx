"use client"

import { Reveal, Scene } from "../primitives"
import { agentFormula } from "../content.ru"

/**
 * АКТ III. Формула агента как инженерный узел.
 *
 * Здесь единственный раз в деке выполняется mechanical → digital transition:
 * связи между модулями сначала прорисованы как механические тяги с шарнирами,
 * затем перетекают в тонкие линии передачи данных. Приём объясняет мысль
 * сцены — агент это сборка, а не магия, — и потому оправдан.
 */

const CX = 280
const CY = 230
const R = 168
const MOD_W = 132
const MOD_H = 50

const ANGLES = [-90, -30, 30, 90, 150, 210]

function polar(r: number, deg: number): [number, number] {
  const a = (deg * Math.PI) / 180
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)]
}

export default function AgentFormula({ index, total }: { index: number; total: number }) {
  return (
    <Scene
      id={agentFormula.id}
      tone="ink"
      label={agentFormula.sceneLabel}
      index={index}
      total={total}
    >
      <div className="utpp-agent">
        <div className="utpp-agent-text">
          <Reveal>
            <p className="utpp-eyebrow">{agentFormula.eyebrow}</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="utpp-h2">{agentFormula.title}</h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="utpp-agent-formula">{agentFormula.formula}</p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="utpp-key utpp-agent-key">{agentFormula.key}</p>
          </Reveal>
          <Reveal delay={0.28}>
            <p className="utpp-agent-warn">{agentFormula.warn}</p>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="utpp-agent-figwrap">
          <svg
            viewBox="62 30 434 402"
            className="utpp-mech"
            role="img"
            aria-label="Узел агента: модель, память, инструкция, инструменты, полномочия и триггер, соединённые в один механизм"
          >
            {/* Механические тяги — исчезают, уступая место линиям данных */}
            <g className="utpp-mech-hard">
              {ANGLES.map((deg, i) => {
                const [hx, hy] = polar(52, deg)
                const [mx, my] = polar(R - MOD_H / 2 - 4, deg)
                const [jx, jy] = polar((52 + R - MOD_H / 2) / 2, deg)
                return (
                  <g key={`h-${i}`}>
                    <line x1={hx} y1={hy} x2={mx} y2={my} className="utpp-mech-rod" />
                    <circle cx={jx} cy={jy} r={5.5} className="utpp-mech-joint" />
                  </g>
                )
              })}
            </g>

            {/* Линии передачи данных — проявляются вторыми */}
            <g className="utpp-mech-soft">
              {ANGLES.map((deg, i) => {
                const [hx, hy] = polar(52, deg)
                const [mx, my] = polar(R - MOD_H / 2 - 4, deg)
                return (
                  <line
                    key={`s-${i}`}
                    x1={hx}
                    y1={hy}
                    x2={mx}
                    y2={my}
                    className="utpp-mech-path"
                  />
                )
              })}
            </g>

            {/* Ступица */}
            <circle cx={CX} cy={CY} r={48} className="utpp-mech-hub" />
            <text x={CX} y={CY + 4} className="utpp-mech-hub-label">
              АГЕНТ
            </text>

            {/* Модули */}
            {agentFormula.parts.map((p, i) => {
              const [x, y] = polar(R, ANGLES[i]!)
              return (
                <g key={p.key} className="utpp-mech-mod">
                  <rect
                    x={x - MOD_W / 2}
                    y={y - MOD_H / 2}
                    width={MOD_W}
                    height={MOD_H}
                    className="utpp-mech-box"
                  />
                  <text x={x} y={y - 3} className="utpp-mech-name">
                    {p.name}
                  </text>
                  <text x={x} y={y + 14} className="utpp-mech-short">
                    {p.short}
                  </text>
                </g>
              )
            })}
          </svg>
        </Reveal>
      </div>
    </Scene>
  )
}
