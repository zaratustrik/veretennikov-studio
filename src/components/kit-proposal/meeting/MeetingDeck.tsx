"use client"

import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"

import questionsJson from "@/data/kit-proposal/meeting-questions.json"

import { SLIDES } from "./slides"

type Questions = {
  groups: { title: string; note: string; key?: boolean; items: string[] }[]
  big: string
}

const Q = questionsJson as unknown as Questions
const BASE = "/presentation/kit-digital-logistics"

/**
 * Режим показа на большом экране: один экран — одна мысль.
 * Управление с клавиатуры рассчитано на презентационный пульт, который
 * обычно эмулирует стрелки и PageUp/PageDown.
 *
 * Полноэкранный режим — усиление, а не условие работы: при отказе API
 * или запрете со стороны браузера режим продолжает работать в окне.
 */
export function MeetingDeck() {
  const [i, setI] = useState(0)
  const [sheet, setSheet] = useState(false)
  const [fs, setFs] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  const last = SLIDES.length - 1
  const go = useCallback((n: number) => setI((v) => Math.min(last, Math.max(0, n))), [last])

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) await rootRef.current?.requestFullscreen?.()
      else await document.exitFullscreen?.()
    } catch {
      // Браузер может отклонить запрос — режим остаётся рабочим в окне.
    }
  }, [])

  useEffect(() => {
    const onFs = () => setFs(Boolean(document.fullscreenElement))
    document.addEventListener("fullscreenchange", onFs)
    return () => document.removeEventListener("fullscreenchange", onFs)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Не перехватываем ввод, если фокус в поле или нажат модификатор.
      const t = e.target as HTMLElement | null
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return
      if (e.metaKey || e.ctrlKey || e.altKey) return

      switch (e.key) {
        case "ArrowRight":
        case "PageDown":
        case " ":
          e.preventDefault()
          if (sheet) setSheet(false)
          else go(i + 1)
          break
        case "ArrowLeft":
        case "PageUp":
          e.preventDefault()
          if (sheet) setSheet(false)
          else go(i - 1)
          break
        case "Home":
          e.preventDefault()
          go(0)
          break
        case "End":
          e.preventDefault()
          go(last)
          break
        case "Escape":
          if (sheet) {
            e.preventDefault()
            setSheet(false)
          }
          break
        case "q":
        case "Q":
        case "й":
        case "Й":
          e.preventDefault()
          setSheet((v) => !v)
          break
        case "f":
        case "F":
        case "а":
        case "А":
          e.preventDefault()
          void toggleFullscreen()
          break
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [i, last, go, sheet, toggleFullscreen])

  const slide = SLIDES[i]!

  return (
    <div className="kdm" ref={rootRef}>
      {/* Документ должен иметь заголовок независимо от активного экрана:
          в DOM живёт только текущий слайд. */}
      <h1 className="kdm-sr">
        ТК КИТ — цифровой контур магистральной логистики. Режим показа, экран {i + 1} из{" "}
        {SLIDES.length}: {slide.nav}
      </h1>
      <div className="kdm-top">
        <span className="kdm-brand">
          ТК КИТ <span>· режим показа</span>
        </span>

        <span className="kdm-top-right">
          <span className="kdm-counter">
            {String(i + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
          </span>
          <button
            type="button"
            className="kdm-btn"
            onClick={() => setSheet((v) => !v)}
            aria-pressed={sheet}
          >
            Вопросы
          </button>
          <button type="button" className="kdm-btn" onClick={() => void toggleFullscreen()}>
            {fs ? "Свернуть" : "Во весь экран"}
          </button>
          <Link className="kdm-link" href={BASE}>
            Полный документ →
          </Link>
        </span>
      </div>

      <div className="kdm-stage">
        <div className="kdm-slide" key={slide.id}>
          {slide.render()}
        </div>
      </div>

      {i === 0 && !sheet ? (
        <div className="kdm-hint">
          <span>
            <b className="kdm-key">←</b> <b className="kdm-key">→</b> экраны
          </span>
          <span>
            <b className="kdm-key">Q</b> вопросы
          </span>
          <span>
            <b className="kdm-key">F</b> во весь экран
          </span>
        </div>
      ) : null}

      <div className="kdm-dots" role="tablist" aria-label="Переход к экрану">
        {SLIDES.map((s, n) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            className="kdm-dot"
            aria-current={n === i}
            aria-label={`${n + 1}. ${s.nav}`}
            title={`${n + 1}. ${s.nav}`}
            onClick={() => {
              setSheet(false)
              go(n)
            }}
          />
        ))}
      </div>

      <div className="kdm-nav">
        <button
          type="button"
          className="kdm-arrow"
          onClick={() => go(i - 1)}
          disabled={i === 0}
          aria-label="Предыдущий экран"
        >
          ←
        </button>
        <button
          type="button"
          className="kdm-arrow"
          onClick={() => go(i + 1)}
          disabled={i === last}
          aria-label="Следующий экран"
        >
          →
        </button>
      </div>

      <div className="kdm-progress" style={{ width: `${((i + 1) / SLIDES.length) * 100}%` }} />

      {sheet ? (
        <div className="kdm-sheet" role="dialog" aria-label="Вопросы для встречи">
          <div className="kdm-inner">
            <div style={{ display: "flex", gap: 18, alignItems: "baseline", flexWrap: "wrap" }}>
              <p className="kdm-eyebrow">Вопросы для встречи</p>
              <button type="button" className="kdm-btn" onClick={() => setSheet(false)}>
                Закрыть · Esc
              </button>
            </div>

            <div className="kdm-qgrid">
              {Q.groups.map((g) => (
                <div key={g.title}>
                  <h3
                    style={{
                      fontSize: "clamp(17px,1.4vw,26px)",
                      fontWeight: 500,
                      color: "#fff",
                      marginBottom: 6,
                    }}
                  >
                    {g.title}
                  </h3>
                  <p className="kdm-small" style={{ marginBottom: 16 }}>
                    {g.note}
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "clamp(8px,1vh,13px)" }}>
                    {g.items.map((q, n) => (
                      <p className="kdm-q" key={q} data-key={g.key ? "true" : undefined}>
                        <b>{String(n + 1).padStart(2, "0")}</b>
                        <span>{q}</span>
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: "clamp(22px,3vh,44px)",
                paddingLeft: "clamp(16px,2vw,28px)",
                borderLeft: "3px solid var(--kdm-accent)",
              }}
            >
              <p className="kdm-eyebrow" style={{ marginBottom: 10 }}>
                Главный вопрос
              </p>
              <p className="kdm-statement" style={{ maxWidth: "34ch" }}>
                {Q.big}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
