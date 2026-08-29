"use client"

import { useEffect, useRef, useState } from "react"

type State = "idle" | "copied" | "failed"

/** Готовый текст запроса + кнопка «Скопировать».
 *  Три пути: системный буфер обмена → старый execCommand → если и он не сработал,
 *  выделяем текст, чтобы человек скопировал вручную. Молча ничего не делать нельзя:
 *  нажатие без видимой реакции читается как поломка. */
export default function CopyBlock({
  text,
  id,
  bare = false,
}: {
  text: string
  id?: string
  /** bare — показать только кнопку: текст уже выведен рядом крупно */
  bare?: boolean
}) {
  const [state, setState] = useState<State>("idle")
  const textRef = useRef<HTMLParagraphElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [])

  function schedule(next: State) {
    setState(next)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setState("idle"), 3200)
  }

  async function copy() {
    let ok = false

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text)
        ok = true
      }
    } catch {
      ok = false
    }

    if (!ok) {
      try {
        const ta = document.createElement("textarea")
        ta.value = text
        ta.setAttribute("readonly", "")
        ta.style.position = "fixed"
        ta.style.top = "-1000px"
        ta.style.opacity = "0"
        document.body.appendChild(ta)
        ta.select()
        ok = document.execCommand("copy")
        document.body.removeChild(ta)
      } catch {
        ok = false
      }
    }

    if (ok) {
      schedule("copied")
      return
    }

    // Последний рубеж: выделяем текст, чтобы его можно было скопировать вручную
    const node = textRef.current
    if (node && window.getSelection) {
      const range = document.createRange()
      range.selectNodeContents(node)
      const sel = window.getSelection()
      sel?.removeAllRanges()
      sel?.addRange(range)
    }
    schedule("failed")
  }

  const label =
    state === "copied"
      ? "Скопировано"
      : state === "failed"
        ? bare
          ? "Скопируйте текст выше"
          : "Выделено — скопируйте вручную"
        : "Скопировать"

  return (
    <div className={bare ? "pm-prompt-bare" : "pm-prompt"}>
      {!bare && (
        <p className="pm-prompt-text" id={id} ref={textRef}>
          {text}
        </p>
      )}
      <button
        type="button"
        className="pm-copy"
        data-state={state}
        onClick={copy}
        aria-describedby={bare ? undefined : id}
      >
        {state === "copied" ? (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="m5 13 4 4L19 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect
              x="9"
              y="9"
              width="11"
              height="11"
              rx="2.5"
              stroke="currentColor"
              strokeWidth="1.8"
            />
            <path
              d="M5.5 15H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        )}
        {label}
      </button>
      <span className="pm-sr" role="status" aria-live="polite">
        {state === "copied"
          ? "Текст скопирован в буфер обмена"
          : state === "failed"
            ? "Скопировать автоматически не получилось — текст выделен"
            : ""}
      </span>
    </div>
  )
}
