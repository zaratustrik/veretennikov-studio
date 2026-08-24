"use client"

import { Stage } from "../primitives"
import { rag } from "../content.ru"

/**
 * ПОРУЧИТЬ → память организации.
 *
 * Метафора собрана кодом, а не картинкой: массив документов, из которого
 * перед ответом вынимаются три релевантных фрагмента. Смысл — не «ИИ знает
 * всё», а «система находит нужное до того, как отвечать».
 *
 * Термин RAG появляется только на третьем beat'е — когда механизм уже
 * показан и объяснён человеческими словами.
 */

const COLS = 36
const ROWS = 7
const CELL_W = 26
const CELL_H = 20
const GRID_TOP = 62

/** Фиксированные позиции извлекаемых фрагментов — не случайные, чтобы
 *  картинка была одинаковой на каждом показе. */
const PICKED: Array<[number, number]> = [
  [7, 2],
  [19, 4],
  [28, 1],
]

export default function Rag({
  index,
  total,
  collapsed,
}: {
  index: number
  total: number
  collapsed: boolean
}) {
  const beats = rag.steps.length

  return (
    <Stage
      id={rag.id}
      tone="sheet"
      label={rag.sceneLabel}
      index={index}
      total={total}
      beats={beats}
      collapsed={collapsed}
    >
      {(beat) => {
        const b = collapsed ? beats - 1 : beat
        return (
          <div className="utpp-rag">
            <header className="utpp-rag-head">
              <p className="utpp-eyebrow">{rag.eyebrow}</p>
              <h2 className="utpp-h2 utpp-h2--wide">{rag.title}</h2>
            </header>

            <ArchiveBand extracted={b >= 2} />

            <ol className="utpp-rag-pipe">
              {rag.steps.map((s, i) => (
                <li
                  key={s.n}
                  className="utpp-fade"
                  data-state={i > b ? "future" : i < b ? "past" : "now"}
                  data-done={i <= b}
                >
                  <span className="utpp-num">{s.n}</span>
                  <b>{s.name}</b>
                  <span className="utpp-rag-short">{s.short}</span>
                </li>
              ))}
            </ol>

            <div className="utpp-rag-bottom">
              <div className="utpp-rag-term" data-on={b >= 2}>
                <p className="utpp-note">{rag.termLabel}</p>
                <p className="utpp-rag-term-word">{rag.term}</p>
                <p className="utpp-small">{rag.termFull}</p>
              </div>

              <div className="utpp-rag-apply" data-on={b >= 4}>
                <p className="utpp-note">{rag.applyTitle}</p>
                <ul>
                  {rag.apply.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
                <p className="utpp-rag-inst">{rag.institutional}</p>
              </div>

              <p className="utpp-rag-caution" data-on={b >= 4}>
                {rag.caution}
              </p>
            </div>

            <p className="utpp-lead utpp-rag-lead" data-on={b < 2}>
              {rag.lead}
            </p>
          </div>
        )
      }}
    </Stage>
  )
}

/**
 * Массив документов организации. Из всего архива подсвечиваются и
 * поднимаются в рабочую полосу ровно три фрагмента — столько, сколько
 * система реально передаёт модели вместе с вопросом.
 */
function ArchiveBand({ extracted }: { extracted: boolean }) {
  const marks: React.ReactElement[] = []

  for (let r = 0; r < ROWS; r += 1) {
    for (let c = 0; c < COLS; c += 1) {
      const picked = PICKED.some(([pc, pr]) => pc === c && pr === r)
      const x = c * CELL_W
      const y = GRID_TOP + r * CELL_H
      // Извлечённые фрагменты уходят в верхнюю полосу и становятся бордовыми
      const ty = picked && extracted ? 36 - y : 0
      const tx = picked && extracted ? 300 + PICKED.findIndex(([pc, pr]) => pc === c && pr === r) * 120 - x : 0
      marks.push(
        <rect
          key={`${c}-${r}`}
          x={x}
          y={y}
          width={16}
          height={3}
          className={picked ? "utpp-arch-mark utpp-arch-mark--picked" : "utpp-arch-mark"}
          style={picked ? { transform: `translate(${tx}px, ${ty}px)` } : undefined}
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
      <line
        x1={280}
        y1={46}
        x2={660}
        y2={46}
        className="utpp-arch-lane"
        data-on={extracted}
      />
      {marks}
    </svg>
  )
}
