"use client"

import { useState } from "react"
import { Reveal, Scene } from "../primitives"
import { useLocalDraft } from "../hooks"
import { brief } from "../content.ru"

/**
 * ПОРУЧИТЬ. Живой конструктор постановки задачи.
 *
 * Смысл сцены — снять миф о «секретном промпте»: на экране собирается
 * обычное поручение, которое руководитель и так формулирует устно.
 * Заполненные слоты подсвечиваются бордовым, справа собирается текст.
 *
 * Всё живёт в localStorage: со сцены ничего не уходит на сервер,
 * и об этом сказано прямо на экране.
 */
export default function Brief({ index, total }: { index: number; total: number }) {
  const [draft, set, clear] = useLocalDraft("utpp-mc-brief")
  const [copied, setCopied] = useState(false)

  const filled = brief.slots.filter((s) => (draft[s.id] ?? "").trim().length > 0)

  const assembled = brief.slots
    .map((s) => {
      const v = (draft[s.id] ?? "").trim()
      return v ? `${s.name}: ${v}` : null
    })
    .filter(Boolean)
    .join("\n")

  const showDemo = () => {
    brief.slots.forEach((s) => set(s.id, s.demo))
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(assembled)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      /* буфер недоступен — пользователь скопирует выделением */
    }
  }

  return (
    <Scene id={brief.id} tone="ivory" label={brief.sceneLabel} index={index} total={total}>
      <Reveal>
        <p className="utpp-eyebrow">{brief.eyebrow}</p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="utpp-h2 utpp-h2--wide">{brief.title}</h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="utpp-lead">{brief.lead}</p>
      </Reveal>

      <div className="utpp-brief">
        <ol className="utpp-brief-slots">
          {brief.slots.map((s, i) => {
            const value = draft[s.id] ?? ""
            return (
              <li key={s.id} data-filled={value.trim().length > 0}>
                <label htmlFor={`brief-${s.id}`}>
                  <span className="utpp-num">{String(i + 1).padStart(2, "0")}</span>
                  <b>{s.name}</b>
                  <span className="utpp-brief-hint">{s.hint}</span>
                </label>
                <textarea
                  id={`brief-${s.id}`}
                  rows={2}
                  value={value}
                  placeholder="—"
                  onChange={(e) => set(s.id, e.target.value)}
                />
              </li>
            )
          })}
        </ol>

        <aside className="utpp-brief-out">
          <header>
            <p className="utpp-note">
              {brief.builderTitle} · {filled.length}/{brief.slots.length}
            </p>
            <span className="utpp-brief-bar" aria-hidden="true">
              <i style={{ transform: `scaleX(${filled.length / brief.slots.length})` }} />
            </span>
          </header>

          <div className="utpp-brief-text" aria-live="polite">
            {assembled ? assembled : <em>{brief.builderEmpty}</em>}
          </div>

          <div className="utpp-brief-actions">
            <button type="button" onClick={showDemo}>
              Показать пример
            </button>
            <button type="button" onClick={clear}>
              Очистить
            </button>
            <button type="button" onClick={copy} disabled={!assembled}>
              {copied ? "Скопировано" : "Скопировать"}
            </button>
          </div>

          <p className="utpp-small utpp-brief-privacy">{brief.privacy}</p>
        </aside>
      </div>

      <Reveal delay={0.2}>
        <p className="utpp-key utpp-brief-key">{brief.key}</p>
      </Reveal>
    </Scene>
  )
}
