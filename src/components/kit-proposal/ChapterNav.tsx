"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import type { Chapter } from "@/types/kit-proposal"

/**
 * Sticky-навигация встречи: текущая глава, индикатор прогресса и оглавление.
 * На большом экране человек должен за секунду понимать, где находится.
 */
export function ChapterNav({ chapters }: { chapters: Chapter[] }) {
  const [activeId, setActiveId] = useState(chapters[0]?.id ?? "")
  const [open, setOpen] = useState(false)
  const [progress, setProgress] = useState(0)
  const tocRef = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)

  // Активная глава — последняя, чей верх прошёл линию под навигацией.
  useEffect(() => {
    const onScroll = () => {
      const line = 90
      let current = chapters[0]?.id ?? ""
      for (const c of chapters) {
        const el = document.getElementById(c.id)
        if (el && el.getBoundingClientRect().top <= line) current = c.id
      }
      setActiveId(current)

      const doc = document.documentElement
      const max = doc.scrollHeight - doc.clientHeight
      setProgress(max > 0 ? Math.min(100, (doc.scrollTop / max) * 100) : 0)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [chapters])

  const close = useCallback(() => {
    setOpen(false)
    btnRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, close])

  const active = chapters.find((c) => c.id === activeId)

  return (
    <nav className="kdl-nav" aria-label="Навигация по документу">
      <div className="kdl-nav-inner">
        <span className="kdl-nav-brand">
          ТК КИТ <span>· цифровой контур логистики</span>
        </span>

        <button
          ref={btnRef}
          type="button"
          className="kdl-nav-toc"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="kdl-toc"
        >
          {open ? "Закрыть" : "Содержание"}
        </button>

        {active ? (
          <span className="kdl-nav-current">
            {active.n} · {active.title}
          </span>
        ) : null}
      </div>

      <div className="kdl-nav-progress" style={{ width: `${progress}%` }} />

      {open ? (
        <>
          <button
            type="button"
            className="kdl-toc-scrim"
            aria-label="Закрыть содержание"
            onClick={close}
          />
          <div
            id="kdl-toc"
            className="kdl-toc"
            ref={tocRef}
            role="dialog"
            aria-label="Содержание документа"
          >
            <div className="kdl-toc-inner">
              {chapters.map((c) => (
                <a
                  key={c.id}
                  className="kdl-toc-link"
                  href={`#${c.id}`}
                  data-active={c.id === activeId}
                  onClick={close}
                >
                  <span className="kdl-toc-n">{c.n}</span>
                  <span>{c.title}</span>
                </a>
              ))}
            </div>
          </div>
        </>
      ) : null}
    </nav>
  )
}
