"use client"

import { useState } from "react"
import { Reveal, Scene } from "../primitives"
import { useLocalDraft } from "../hooks"
import { myScenario } from "../content.ru"

/**
 * АКТ VI. Карточка первого сценария — единственное, что участник
 * уносит с собой в работающем виде. Девять вопросов, ответы остаются
 * в браузере, кнопка копирует готовое техзадание в буфер.
 */
export default function MyScenario({ index, total }: { index: number; total: number }) {
  const [draft, set, clear] = useLocalDraft("utpp-mc-scenario")
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
    <Scene
      id={myScenario.id}
      tone="sheet"
      label={myScenario.sceneLabel}
      index={index}
      total={total}
    >
      <div className="utpp-scen-head">
        <div>
          <Reveal>
            <p className="utpp-eyebrow">{myScenario.eyebrow}</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="utpp-h2">{myScenario.title}</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="utpp-lead">{myScenario.lead}</p>
          </Reveal>
        </div>

        <div className="utpp-scen-meta">
          <p className="utpp-note">
            заполнено {filled.length}/{myScenario.fields.length}
          </p>
          <span className="utpp-brief-bar" aria-hidden="true">
            <i style={{ transform: `scaleX(${filled.length / myScenario.fields.length})` }} />
          </span>
          <div className="utpp-brief-actions">
            <button type="button" onClick={clear}>
              {myScenario.clearLabel}
            </button>
            <button type="button" onClick={copy} disabled={filled.length === 0}>
              {copied ? myScenario.copiedLabel : myScenario.copyLabel}
            </button>
          </div>
          <p className="utpp-small utpp-brief-privacy">{myScenario.privacy}</p>
        </div>
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
    </Scene>
  )
}
