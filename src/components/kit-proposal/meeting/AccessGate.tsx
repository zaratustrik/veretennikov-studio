"use client"

import { useCallback, useEffect, useState } from "react"

import { MeetingDeck } from "./MeetingDeck"

/**
 * Экран входа перед режимом показа. Это не механизм защиты и не
 * аутентификация: доступ к разделу и так закрыт от индексации, а здесь
 * нужен спокойный жест перед началом разговора.
 */
const CODE = "67"

type Phase = "locked" | "opening" | "open"

export function MeetingEntry() {
  // Состояние живёт только в памяти вкладки: хранить признак входа негде
  // и незачем — после перезагрузки две цифры набираются быстрее, чем
  // читается любое объяснение, почему экран мигнул.
  const [phase, setPhase] = useState<Phase>("locked")
  const [entry, setEntry] = useState("")
  const [wrong, setWrong] = useState(false)

  const open = useCallback(() => setPhase("opening"), [])

  // Показ подхватывается под уходящим экраном, поэтому переход виден целиком.
  useEffect(() => {
    if (phase !== "opening") return
    const t = window.setTimeout(() => setPhase("open"), 560)
    return () => window.clearTimeout(t)
  }, [phase])

  useEffect(() => {
    if (!wrong) return
    const t = window.setTimeout(() => setWrong(false), 480)
    return () => window.clearTimeout(t)
  }, [wrong])

  const push = useCallback(
    (d: string) => {
      if (phase !== "locked") return
      const next = (entry + d).slice(0, CODE.length)
      setEntry(next)
      if (next.length < CODE.length) return
      if (next === CODE) open()
      else window.setTimeout(() => { setWrong(true); setEntry("") }, 160)
    },
    [entry, phase, open],
  )

  const back = useCallback(() => setEntry((v) => v.slice(0, -1)), [])
  const reset = useCallback(() => setEntry(""), [])

  useEffect(() => {
    if (phase !== "locked") return
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault()
        push(e.key)
      } else if (e.key === "Backspace") {
        e.preventDefault()
        back()
      } else if (e.key === "Escape") {
        e.preventDefault()
        reset()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [phase, push, back, reset])

  return (
    <>
      {phase === "locked" ? null : <MeetingDeck />}

      {phase === "open" ? null : (
        <div className="kdm kdm-gate" data-state={phase}>
          <div className="kdm-gate-in" role="group" aria-label="Ввод кода встречи">
            <p className="kdm-eyebrow">Центр развития и внедрения искусственного интеллекта</p>

            <p className="kdm-gate-h">Код встречи</p>

            <div className="kdm-gate-slots" data-wrong={wrong ? "true" : undefined}>
              {Array.from({ length: CODE.length }, (_, n) => (
                <span key={n} data-filled={entry.length > n ? "true" : undefined}>
                  {entry[n] ?? ""}
                </span>
              ))}
            </div>
            <p className="kdm-sr" aria-live="polite">
              {wrong ? "Код не подошёл" : `Введено цифр: ${entry.length} из ${CODE.length}`}
            </p>

            <div className="kdm-gate-pad">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => (
                <button key={d} type="button" className="kdm-gate-key" onClick={() => push(d)}>
                  {d}
                </button>
              ))}

              <button type="button" className="kdm-gate-key" data-k="aux" onClick={reset}>
                Сброс
              </button>
              <button type="button" className="kdm-gate-key" onClick={() => push("0")}>
                0
              </button>
              <button
                type="button"
                className="kdm-gate-key"
                data-k="aux"
                onClick={back}
                aria-label="Стереть последнюю цифру"
              >
                ←
              </button>
            </div>

            <p className="kdm-gate-hint">Можно вводить с клавиатуры</p>
          </div>
        </div>
      )}
    </>
  )
}
