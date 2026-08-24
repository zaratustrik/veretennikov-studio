"use client"

import Image from "next/image"
import { useState } from "react"
import { Head, In, Slide } from "../primitives"
import { useLocalDraft } from "../useDeck"
import { finale, fourP, myScenario, photos } from "../content.ru"

type P = { index: number; total: number; active: boolean; beat: number }

/* ════════════════════════════════════════════════════════════
   26 — Методика 4П целиком

   Собирается в самом конце, когда за каждым словом уже стоит
   разобранный механизм. Кольцо замыкается бордовой дугой:
   после «Перестроить» снова «Понять».
   ════════════════════════════════════════════════════════════ */

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

export function FourP({ index, total, active, beat }: P) {
  const segments = fourP.items.map((item, i) => {
    const from = i * 90 - 87
    const to = i * 90 - 3
    return { item, from, to, mid: (from + to) / 2, len: (R * (to - from) * Math.PI) / 180 }
  })

  return (
    <Slide id={fourP.id} tone="ink" label={fourP.label} index={index} total={total} active={active}>
      <div className="utpp-fourp">
        <div className="utpp-fourp-text">
          <Head eyebrow={fourP.eyebrow} title={fourP.title} lead={fourP.lead} />

          <ol className="utpp-fourp-list">
            {fourP.items.map((it, i) => (
              <In as="li" key={it.step} d={i + 3}>
                <span className="utpp-num">{String(i + 1).padStart(2, "0")}</span>
                <b>{it.title}</b>
                <span className="utpp-fourp-q">{it.q}</span>
                <span className="utpp-fourp-short">{it.short}</span>
              </In>
            ))}
          </ol>
        </div>

        <div className="utpp-fourp-figwrap">
          <svg
            viewBox="46 46 328 328"
            className="utpp-fourp-svg"
            data-closed={beat >= 1}
            role="img"
            aria-label="Кольцо из четырёх шагов: Понять, Поручить, Проверить, Перестроить — замкнутый цикл"
          >
            {segments.map((s, i) => {
              const [nx, ny] = polar(R + 26, s.mid)
              const [lx, ly] = polar(R - 52, s.mid)
              return (
                <g key={s.item.step}>
                  <path
                    d={arcPath(s.from, s.to)}
                    className="utpp-fourp-arc"
                    style={{
                      strokeDasharray: s.len,
                      animationDelay: `${0.2 + i * 0.22}s`,
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

            {/* Замыкание цикла — единственное место схемы, где звучит акцент */}
            <g className="utpp-fourp-return">
              <path d={arcPath(250, 268, R)} className="utpp-fourp-arc-return" />
              <path
                d={`M${CX - 7} ${CY - R - 8} L${CX + 11} ${CY - R} L${CX - 7} ${CY - R + 8} Z`}
                className="utpp-fourp-head"
              />
            </g>

            <circle cx={CX} cy={CY} r={3} className="utpp-fourp-hub" />
          </svg>
        </div>
      </div>
    </Slide>
  )
}

/* ════════════════════════════════════════════════════════════
   27 — Карточка первого сценария

   Единственное, что участник уносит с собой в работающем виде.
   Ответы остаются в браузере; кнопка кладёт готовое ТЗ в буфер.
   ════════════════════════════════════════════════════════════ */

export function MyScenario({ index, total, active }: P) {
  const [draft, set, clear] = useLocalDraft("utpp-mc2-scenario")
  const [copied, setCopied] = useState(false)

  const filled = myScenario.fields.filter((f) => (draft[f.id] ?? "").trim().length > 0)

  const copy = async () => {
    const text = myScenario.fields
      .map((f) => `${f.q}\n${(draft[f.id] ?? "").trim() || "—"}`)
      .join("\n\n")
    try {
      await navigator.clipboard.writeText(`Мой первый ИИ-сценарий\n\n${text}`)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      /* буфер недоступен */
    }
  }

  return (
    <Slide
      id={myScenario.id}
      tone="sheet"
      label={myScenario.label}
      index={index}
      total={total}
      active={active}
      scroll
    >
      <div className="utpp-scen-head">
        <div>
          <Head eyebrow={myScenario.eyebrow} title={myScenario.title} lead={myScenario.lead} />
        </div>
        <In d={2} className="utpp-scen-meta">
          <p className="utpp-note">
            заполнено {filled.length}/{myScenario.fields.length}
          </p>
          <span className="utpp-bar" aria-hidden="true">
            <i style={{ transform: `scaleX(${filled.length / myScenario.fields.length})` }} />
          </span>
          <div className="utpp-actions">
            <button type="button" onClick={clear}>
              {myScenario.clearLabel}
            </button>
            <button type="button" onClick={copy} disabled={filled.length === 0}>
              {copied ? myScenario.copiedLabel : myScenario.copyLabel}
            </button>
          </div>
          <p className="utpp-small">{myScenario.privacy}</p>
        </In>
      </div>

      <ol className="utpp-scen">
        {myScenario.fields.map((f, i) => {
          const value = draft[f.id] ?? ""
          return (
            <li key={f.id} data-filled={value.trim().length > 0}>
              <label htmlFor={`scen-${f.id}`}>
                <span className="utpp-num">{String(i + 1).padStart(2, "0")}</span>
                <b>{f.q}</b>
                <span className="utpp-scen-hint">{f.hint}</span>
              </label>
              <textarea
                id={`scen-${f.id}`}
                rows={2}
                value={value}
                placeholder="—"
                onChange={(e) => set(f.id, e.target.value)}
              />
            </li>
          )
        })}
      </ol>
    </Slide>
  )
}

/* ════════════════════════════════════════════════════════════
   28 — Финал

   Никакого «спасибо за внимание». Последним на экране остаётся
   утверждение, ради которого собран весь мастер-класс.
   ════════════════════════════════════════════════════════════ */

export function Finale({ index, total, active }: P) {
  return (
    <Slide
      id={finale.id}
      tone="ivory"
      label={finale.label}
      index={index}
      total={total}
      active={active}
      cut={photos.finaleDesk}
    >
      <div className="utpp-finale">
        <In>
          <p className="utpp-statement utpp-finale-main">{finale.statement}</p>
        </In>
        <In d={3}>
          <p className="utpp-finale-quiet">{finale.quiet}</p>
        </In>
        <In d={5}>
          <footer className="utpp-finale-foot">
            <Image
              src="/utpp/utpp-logo-ink.png"
              alt="Уральская торгово-промышленная палата"
              width={144}
              height={54}
              className="utpp-title-mark"
            />
            <div>
              <p className="utpp-note">{finale.event}</p>
              <p className="utpp-note utpp-title-author">
                {finale.author} · {finale.studio}
              </p>
            </div>
          </footer>
        </In>
      </div>
    </Slide>
  )
}
