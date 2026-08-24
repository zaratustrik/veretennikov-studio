"use client"

import Image from "next/image"
import { Head, In, Slide, stateOf } from "../primitives"
import { agentFormula, apiMcp, caseDoctor, pUnderstand } from "../content.ru"

type P = { index: number; total: number; active: boolean; beat: number }

/* ════════════════════════════════════════════════════════════
   18 — Формула агента

   Семь узлов пристыковываются к ступице по одному. Единственное
   место деки, где выполняется mechanical → digital transition:
   связи сначала прорисованы как механические тяги с шарнирами,
   затем перетекают в линии передачи данных. Приём объясняет
   мысль сцены — агент это сборка, а не магия.
   ════════════════════════════════════════════════════════════ */

// Радиус подобран так, чтобы хорда между соседними модулями (2R·sin(π/7))
// была заметно больше ширины модуля: при семи узлах они иначе наезжают.
const CX = 300
const CY = 255
const R = 220
const MOD_W = 170
const MOD_H = 48
const HUB = 54

function polar(r: number, deg: number): [number, number] {
  const a = (deg * Math.PI) / 180
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)]
}

export function AgentFormula({ index, total, active, beat }: P) {
  const parts = agentFormula.parts
  const step = 360 / parts.length
  const done = beat >= parts.length

  return (
    <Slide
      id={agentFormula.id}
      tone="ink"
      label={agentFormula.label}
      index={index}
      total={total}
      active={active}
    >
      <div className="utpp-agent">
        <div className="utpp-agent-text">
          <Head eyebrow={agentFormula.eyebrow} title={agentFormula.title} />

          <ol className="utpp-agent-legend">
            {parts.map((p, i) => (
              <li key={p.key} className="utpp-fade" data-state={stateOf(i, beat)}>
                <span className="utpp-num">{String(i + 1).padStart(2, "0")}</span>
                <b>{p.name}</b>
                <span>{p.what}</span>
              </li>
            ))}
          </ol>

          <p className="utpp-beat utpp-agent-formula" data-on={done}>
            {agentFormula.formula}
          </p>
          <p className="utpp-beat utpp-key utpp-agent-key" data-on={done}>
            {agentFormula.key}
          </p>
          <p className="utpp-beat utpp-warn" data-on={done}>
            {agentFormula.warn}
          </p>
        </div>

        <div className="utpp-agent-figwrap">
          <svg
            viewBox="0 6 600 476"
            className="utpp-mech"
            data-done={done}
            role="img"
            aria-label="Узел агента: модель, память, база знаний, инструкция, инструменты, полномочия и триггер, соединённые в один механизм"
          >
            {parts.map((p, i) => {
              const deg = -90 + i * step
              const [hx, hy] = polar(HUB, deg)
              const [mx, my] = polar(R - MOD_H / 2 - 4, deg)
              const [jx, jy] = polar((HUB + R - MOD_H / 2) / 2, deg)
              const on = beat >= i
              return (
                <g key={`link-${p.key}`} className="utpp-mech-link" data-on={on}>
                  <line x1={hx} y1={hy} x2={mx} y2={my} className="utpp-mech-rod" />
                  <circle cx={jx} cy={jy} r={5} className="utpp-mech-joint" />
                  <line x1={hx} y1={hy} x2={mx} y2={my} className="utpp-mech-path" />
                </g>
              )
            })}

            <circle cx={CX} cy={CY} r={HUB - 4} className="utpp-mech-hub" />
            <text x={CX} y={CY + 4} className="utpp-mech-hub-label">
              АГЕНТ
            </text>

            {parts.map((p, i) => {
              const deg = -90 + i * step
              const [x, y] = polar(R, deg)
              const on = beat >= i
              return (
                <g key={p.key} className="utpp-mech-mod" data-on={on}>
                  <rect
                    x={x - MOD_W / 2}
                    y={y - MOD_H / 2}
                    width={MOD_W}
                    height={MOD_H}
                    className="utpp-mech-box"
                  />
                  <text x={x} y={y - 2} className="utpp-mech-name">
                    {p.name}
                  </text>
                  <text x={x} y={y + 13} className="utpp-mech-short">
                    {p.what}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>
      </div>
    </Slide>
  )
}

/* ════════════════════════════════════════════════════════════
   19 — API и MCP человеческим языком
   ════════════════════════════════════════════════════════════ */

export function ApiMcp({ index, total, active, beat }: P) {
  return (
    <Slide
      id={apiMcp.id}
      tone="sheet"
      label={apiMcp.label}
      index={index}
      total={total}
      active={active}
    >
      <Head eyebrow={apiMcp.eyebrow} title={apiMcp.title} wide />

      <div className="utpp-terms">
        {apiMcp.items.map((it, i) => (
          <div key={it.term} className="utpp-beat utpp-terms-col" data-on={beat >= i}>
            <p className="utpp-terms-word">{it.term}</p>
            <p className="utpp-terms-plain">{it.plain}</p>
            <p className="utpp-terms-detail">{it.detail}</p>
            <p className="utpp-terms-metaphor">{it.metaphor}</p>
          </div>
        ))}
      </div>

      <p className="utpp-beat utpp-key utpp-terms-key" data-on={beat >= 1}>
        {apiMcp.key}
      </p>
    </Slide>
  )
}

/* ════════════════════════════════════════════════════════════
   20 — Кейс: агент готовит публикации врача

   Реальный проект. Слева — те же узлы, что мы только что собрали,
   но заполненные содержанием конкретной практики. В центре —
   семь шагов работы. Справа — результат: сторис, подготовленные
   агентом и утверждённые врачом перед выходом.

   Шестой шаг — остановка. Именно она отличает агента от
   автоматического постинга.
   ════════════════════════════════════════════════════════════ */

export function CaseDoctor({ index, total, active, beat }: P) {
  const steps = caseDoctor.steps
  const stepBeat = beat - 2
  const showTask = beat >= 1
  const showResult = beat >= steps.length

  return (
    <Slide
      id={caseDoctor.id}
      tone="ivory"
      label={caseDoctor.label}
      index={index}
      total={total}
      active={active}
    >
      <div className="utpp-case">
        <header className="utpp-case-head">
          <In>
            <p className="utpp-eyebrow">{caseDoctor.eyebrow}</p>
          </In>
          <In d={1}>
            <h2 className="utpp-h2 utpp-h2--wide">{caseDoctor.title}</h2>
          </In>
          <In d={2}>
            <p className="utpp-case-who">{caseDoctor.who}</p>
          </In>
        </header>

        <div className="utpp-case-body">
          <div className="utpp-case-setup">
            {caseDoctor.setup.map((g, i) => (
              <In key={g.key} d={i + 3} className="utpp-case-setup-g">
                <p className="utpp-note">{g.name}</p>
                <ul>
                  {g.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </In>
            ))}
          </div>

          <div className="utpp-case-flow">
            <div className="utpp-beat utpp-case-task" data-on={showTask}>
              <p className="utpp-note">{caseDoctor.taskLabel}</p>
              <blockquote>{caseDoctor.task}</blockquote>
            </div>

            <ol className="utpp-case-steps">
              {steps.map((s, i) => (
                <li
                  key={s.n}
                  className="utpp-fade"
                  data-state={stateOf(i, stepBeat)}
                  data-stop={s.n === "06" || undefined}
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

          <div className="utpp-beat utpp-case-result" data-on={showResult}>
            <p className="utpp-note">{caseDoctor.resultLabel}</p>
            <div className="utpp-case-stories">
              {caseDoctor.stories.map((s) => (
                <Image
                  key={s.src}
                  src={s.src}
                  alt={s.alt}
                  width={720}
                  height={1279}
                  sizes="(max-width: 860px) 30vw, 12vw"
                />
              ))}
            </div>
            <p className="utpp-small">{caseDoctor.resultNote}</p>
          </div>
        </div>

        <footer className="utpp-beat utpp-case-foot" data-on={showResult}>
          <p className="utpp-note utpp-case-boundary">{caseDoctor.boundary}</p>
          <p className="utpp-key">{caseDoctor.key}</p>
        </footer>
      </div>
    </Slide>
  )
}

/* ════════════════════════════════════════════════════════════
   21 — 4П: Понять

   Появляется ровно там, где зритель сам задаёт вопрос:
   «хорошо, а что мне отдать?». Не отдел — операцию.
   ════════════════════════════════════════════════════════════ */

export function PUnderstand({ index, total, active, beat }: P) {
  return (
    <Slide
      id={pUnderstand.id}
      tone="sheet"
      label={pUnderstand.label}
      index={index}
      total={total}
      active={active}
    >
      <Head eyebrow={pUnderstand.eyebrow} title={pUnderstand.title} lead={pUnderstand.lead} wide />

      <div className="utpp-understand">
        <ul className="utpp-beat utpp-pairs" data-on={beat >= 0}>
          {pUnderstand.pairs.map((p) => (
            <li key={p.right}>
              <p className="utpp-pairs-wrong">
                <span>не</span>
                {p.wrong}
              </p>
              <p className="utpp-pairs-right">
                <span>а</span>
                {p.right}
              </p>
            </li>
          ))}
        </ul>

        <div className="utpp-beat utpp-understand-crit" data-on={beat >= 1}>
          <p className="utpp-note">{pUnderstand.criteriaLead}</p>
          <ul className="utpp-list">
            {pUnderstand.criteria.map((c) => (
              <li key={c.n}>
                <span className="utpp-list-n">{c.n}</span>
                <div>
                  <b>{c.name}</b>
                  <span>{c.short}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="utpp-beat utpp-key utpp-understand-key" data-on={beat >= 2}>
        {pUnderstand.key}
      </p>
    </Slide>
  )
}
