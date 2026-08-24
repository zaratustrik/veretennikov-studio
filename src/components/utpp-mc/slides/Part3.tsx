"use client"

import { useState } from "react"
import { Head, In, Slide } from "../primitives"
import { useLocalDraft } from "../useDeck"
import { memoryThree, pDelegate, whatIsChat } from "../content.ru"

type P = { index: number; total: number; active: boolean; beat: number }

/* ════════════════════════════════════════════════════════════
   10 — Из чего состоит AI-чат

   Четыре узла собираются в формулу на глазах. Смысл слайда —
   снять представление, что «чат = модель»: большая часть того,
   что радует пользователя, живёт вокруг модели, а не в ней.
   ════════════════════════════════════════════════════════════ */

export function WhatIsChat({ index, total, active, beat }: P) {
  return (
    <Slide
      id={whatIsChat.id}
      tone="ivory"
      label={whatIsChat.label}
      index={index}
      total={total}
      active={active}
    >
      <Head eyebrow={whatIsChat.eyebrow} title={whatIsChat.title} wide />

      <div className="utpp-chat">
        {whatIsChat.parts.map((p, i) => (
          <div key={p.key} className="utpp-chat-part">
            <div className="utpp-beat utpp-chat-box" data-on={beat >= i}>
              <b>{p.name}</b>
              <span>{p.what}</span>
            </div>
            {i < whatIsChat.parts.length - 1 ? (
              <span className="utpp-beat utpp-chat-plus" data-on={beat >= i + 1} aria-hidden="true">
                +
              </span>
            ) : null}
          </div>
        ))}
      </div>

      <div className="utpp-beat utpp-chat-foot" data-on={beat >= whatIsChat.parts.length - 1}>
        <p className="utpp-chat-formula">{whatIsChat.formula}</p>
        <p className="utpp-key">{whatIsChat.key}</p>
      </div>
    </Slide>
  )
}

/* ════════════════════════════════════════════════════════════
   11 — Что именно помнит помощник

   Три вещи, которые в разговорах постоянно склеивают в одну.
   Третий пункт — не свойство, а опровержение: модель не
   переучивается на вас. Он оформлен иначе именно поэтому.
   ════════════════════════════════════════════════════════════ */

export function MemoryThree({ index, total, active, beat }: P) {
  return (
    <Slide
      id={memoryThree.id}
      tone="sheet"
      label={memoryThree.label}
      index={index}
      total={total}
      active={active}
    >
      <Head eyebrow={memoryThree.eyebrow} title={memoryThree.title} wide />

      <div className="utpp-mem">
        {memoryThree.items.map((it, i) => (
          <div
            key={it.n}
            className="utpp-beat utpp-mem-col"
            data-on={beat >= i}
            data-tone={it.tone}
          >
            <p className="utpp-mem-n">{it.n}</p>
            <p className="utpp-mem-name">{it.name}</p>
            <p className="utpp-mem-what">{it.what}</p>
            <p className="utpp-mem-detail">{it.detail}</p>
          </div>
        ))}
      </div>

      <p className="utpp-beat utpp-key utpp-mem-key" data-on={beat >= 2}>
        {memoryThree.key}
      </p>
    </Slide>
  )
}

/* ════════════════════════════════════════════════════════════
   12 — 4П: Поручить

   Живой конструктор. Смысл — снять миф о «секретном промпте»:
   на экране собирается обычное поручение, которое руководитель
   и так формулирует устно. Всё живёт в localStorage.
   ════════════════════════════════════════════════════════════ */

export function PDelegate({ index, total, active }: P) {
  const [draft, set, clear] = useLocalDraft("utpp-mc2-brief")
  const [copied, setCopied] = useState(false)

  const filled = pDelegate.slots.filter((s) => (draft[s.id] ?? "").trim().length > 0)
  const assembled = pDelegate.slots
    .map((s) => {
      const v = (draft[s.id] ?? "").trim()
      return v ? `${s.name}: ${v}` : null
    })
    .filter(Boolean)
    .join("\n")

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
    <Slide
      id={pDelegate.id}
      tone="ivory"
      label={pDelegate.label}
      index={index}
      total={total}
      active={active}
      scroll
    >
      <Head eyebrow={pDelegate.eyebrow} title={pDelegate.title} lead={pDelegate.lead} wide />

      <div className="utpp-brief">
        <ol className="utpp-brief-slots">
          {pDelegate.slots.map((s, i) => {
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
              {pDelegate.builderTitle} · {filled.length}/{pDelegate.slots.length}
            </p>
            <span className="utpp-bar" aria-hidden="true">
              <i style={{ transform: `scaleX(${filled.length / pDelegate.slots.length})` }} />
            </span>
          </header>

          <div className="utpp-brief-text" aria-live="polite">
            {assembled ? assembled : <em>{pDelegate.builderEmpty}</em>}
          </div>

          <div className="utpp-actions">
            <button type="button" onClick={() => pDelegate.slots.forEach((s) => set(s.id, s.demo))}>
              Показать пример
            </button>
            <button type="button" onClick={clear}>
              Очистить
            </button>
            <button type="button" onClick={copy} disabled={!assembled}>
              {copied ? "Скопировано" : "Скопировать"}
            </button>
          </div>

          <p className="utpp-small">{pDelegate.privacy}</p>
        </aside>
      </div>

      <In d={4}>
        <p className="utpp-key utpp-brief-key">{pDelegate.key}</p>
      </In>
    </Slide>
  )
}
