"use client"

import { Head, In, Slide, stateOf } from "../primitives"
import { rag, ragNotTraining, ragUtpp } from "../content.ru"

type P = { index: number; total: number; active: boolean; beat: number }

/* ── Массив документов организации ──────────────────────────
   Из всего архива подсвечиваются и поднимаются в рабочую полосу
   ровно три фрагмента — столько, сколько система реально передаёт
   модели вместе с вопросом. Позиции фиксированы, чтобы картинка
   была одинаковой на каждом показе.
   ──────────────────────────────────────────────────────────── */

const COLS = 40
const ROWS = 6
const CELL_W = 24
const CELL_H = 18
const GRID_TOP = 58
const PICKED: Array<[number, number]> = [
  [8, 1],
  [21, 4],
  [31, 2],
]

function ArchiveBand({ searching, extracted }: { searching: boolean; extracted: boolean }) {
  const marks: React.ReactElement[] = []

  for (let r = 0; r < ROWS; r += 1) {
    for (let c = 0; c < COLS; c += 1) {
      const pick = PICKED.findIndex(([pc, pr]) => pc === c && pr === r)
      const x = c * CELL_W
      const y = GRID_TOP + r * CELL_H
      const lift = pick >= 0 && extracted
      marks.push(
        <rect
          key={`${c}-${r}`}
          x={x}
          y={y}
          width={15}
          height={3}
          className={
            pick >= 0 && (searching || extracted)
              ? "utpp-arch-mark utpp-arch-mark--picked"
              : "utpp-arch-mark"
          }
          style={
            lift
              ? { transform: `translate(${300 + pick * 130 - x}px, ${32 - y}px)` }
              : undefined
          }
        />,
      )
    }
  }

  return (
    <svg
      viewBox={`0 0 ${COLS * CELL_W} ${GRID_TOP + ROWS * CELL_H}`}
      className="utpp-arch"
      role="img"
      aria-label="Массив документов организации, из которого извлекаются три релевантных фрагмента"
    >
      <line x1={290} y1={44} x2={620} y2={44} className="utpp-arch-lane" data-on={extracted} />
      {marks}
    </svg>
  )
}

/* ════════════════════════════════════════════════════════════
   14 — RAG: система находит нужное до того, как отвечать

   Механизм показывается целиком до того, как звучит термин.
   Три бордовых фрагмента, поднявшиеся из массива, — вся суть:
   модели передают не архив, а несколько кусков текста.
   ════════════════════════════════════════════════════════════ */

export function Rag({ index, total, active, beat }: P) {
  return (
    <Slide id={rag.id} tone="sheet" label={rag.label} index={index} total={total} active={active}>
      <Head eyebrow={rag.eyebrow} title={rag.title} wide />

      <ArchiveBand searching={beat >= 1} extracted={beat >= 2} />

      <ol className="utpp-rag-pipe">
        {rag.steps.map((s, i) => (
          <li key={s.n} className="utpp-fade" data-state={stateOf(i, beat)} data-done={i <= beat}>
            <span className="utpp-num">{s.n}</span>
            <b>{s.name}</b>
            <span className="utpp-rag-short">{s.short}</span>
          </li>
        ))}
      </ol>

      <div className="utpp-rag-bottom">
        <p className="utpp-beat utpp-rag-lead" data-on={beat < 2}>
          {rag.lead}
        </p>

        <div className="utpp-beat utpp-rag-term" data-on={beat >= 4}>
          <p className="utpp-note">{rag.termLabel}</p>
          <p className="utpp-rag-term-word">{rag.term}</p>
          <p className="utpp-small">{rag.termFull}</p>
        </div>
      </div>
    </Slide>
  )
}

/* ════════════════════════════════════════════════════════════
   15 — RAG ≠ дообучение

   Самое частое и самое дорогое заблуждение при первом разговоре
   о корпоративном ИИ. Слева — то, что люди себе представляют,
   справа — то, что им на самом деле нужно.
   ════════════════════════════════════════════════════════════ */

export function RagNotTraining({ index, total, active, beat }: P) {
  return (
    <Slide
      id={ragNotTraining.id}
      tone="ivory"
      label={ragNotTraining.label}
      index={index}
      total={total}
      active={active}
    >
      <Head eyebrow={ragNotTraining.eyebrow} title={ragNotTraining.title} wide />

      <div className="utpp-vs">
        <div className="utpp-beat utpp-vs-col" data-on={beat >= 0}>
          <p className="utpp-vs-name">{ragNotTraining.wrong.name}</p>
          <p className="utpp-vs-text">{ragNotTraining.wrong.what}</p>
          <ul>
            {ragNotTraining.wrong.facts.map((f) => (
              <li key={f} data-sign="minus">
                {f}
              </li>
            ))}
          </ul>
        </div>

        <div className="utpp-vs-mid" aria-hidden="true">
          против
        </div>

        <div className="utpp-beat utpp-vs-col" data-accent="true" data-on={beat >= 1}>
          <p className="utpp-vs-name">{ragNotTraining.right.name}</p>
          <p className="utpp-vs-text">{ragNotTraining.right.what}</p>
          <ul>
            {ragNotTraining.right.facts.map((f) => (
              <li key={f} data-sign="plus">
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="utpp-beat utpp-key utpp-vs-key" data-on={beat >= 2}>
        {ragNotTraining.key}
      </p>
    </Slide>
  )
}

/* ════════════════════════════════════════════════════════════
   16 — Что это даёт Палате
   ════════════════════════════════════════════════════════════ */

export function RagUtpp({ index, total, active }: P) {
  return (
    <Slide
      id={ragUtpp.id}
      tone="sheet"
      label={ragUtpp.label}
      index={index}
      total={total}
      active={active}
    >
      <Head eyebrow={ragUtpp.eyebrow} title={ragUtpp.title} wide />

      <div className="utpp-grid utpp-areas">
        {ragUtpp.areas.map((a, i) => (
          <In key={a.name} d={i + 2} className="utpp-grid-item">
            <b>{a.name}</b>
            <span>{a.short}</span>
          </In>
        ))}
      </div>

      <div className="utpp-areas-foot">
        <In d={8}>
          <p className="utpp-key">{ragUtpp.key}</p>
        </In>
        <In d={8}>
          <p className="utpp-warn">{ragUtpp.caution}</p>
        </In>
      </div>
    </Slide>
  )
}
