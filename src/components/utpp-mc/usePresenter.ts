"use client"

import { useCallback, useEffect, useState } from "react"
import { scenes, sceneOrder } from "./content.ru"

export type PresenterState = {
  presenting: boolean
  notesOpen: boolean
  black: boolean
  sceneIdx: number
  sceneId: string
  enter: () => void
  exit: () => void
  toggleNotes: () => void
  toggleFullscreen: () => void
  go: (idx: number) => void
  next: () => void
  prev: () => void
  resetScene: () => void
}

/** Абсолютный top элемента сцены. */
function topOf(id: string): number | null {
  const el = document.getElementById(id)
  if (!el) return null
  return el.getBoundingClientRect().top + window.scrollY
}

/**
 * Точки остановки показа: начало каждой сцены плюс каждый смысловой beat
 * внутри staged-сцены. Именно отсюда берётся требование пакета —
 * Space сперва раскрывает следующий beat и лишь после последнего
 * переводит на следующую сцену.
 */
function stopPoints(collapsed: boolean): number[] {
  const vh = window.innerHeight
  const stops: number[] = []
  scenes.forEach((s) => {
    const top = topOf(s.id)
    if (top === null) return
    const beats = !collapsed && s.beats && s.beats > 1 ? s.beats : 1
    for (let k = 0; k < beats; k += 1) stops.push(top + k * vh)
  })
  return stops.sort((a, b) => a - b)
}

function sceneTops(): Array<{ id: string; top: number }> {
  return sceneOrder
    .map((id) => {
      const top = topOf(id)
      return top === null ? null : { id, top }
    })
    .filter((x): x is { id: string; top: number } => x !== null)
    .sort((a, b) => a.top - b.top)
}

export function usePresenter(reducedMotion: boolean, collapsed: boolean): PresenterState {
  const [presenting, setPresenting] = useState(false)
  const [notesOpen, setNotesOpen] = useState(false)
  const [black, setBlack] = useState(false)
  const [sceneIdx, setSceneIdx] = useState(0)

  // Именно "instant", а не "auto": в globals.css у html стоит
  // scroll-behavior: smooth, и "auto" отдал бы управление CSS —
  // то есть пользователь с prefers-reduced-motion всё равно получил бы
  // плавную прокрутку.
  const behavior: ScrollBehavior = reducedMotion ? "instant" : "smooth"

  // Вход по URL и deep-link по хэшу
  useEffect(() => {
    const t = window.setTimeout(() => {
      const params = new URLSearchParams(window.location.search)
      if (params.get("presenter") === "1" || params.get("present") === "1") {
        setPresenting(true)
      }
      if (params.get("notes") === "1") setNotesOpen(true)
      const hash = decodeURIComponent(window.location.hash.slice(1))
      if (hash && sceneOrder.includes(hash)) {
        // Deep-link должен встать на сцену мгновенно, без прокрутки через всю деку.
        document.getElementById(hash)?.scrollIntoView({ behavior: "instant" })
      }
    }, 0)
    return () => window.clearTimeout(t)
  }, [])

  // Текущая сцена по прокрутке
  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const tops = sceneTops()
        const y = window.scrollY + window.innerHeight * 0.4
        let idx = 0
        tops.forEach((t, i) => {
          if (t.top <= y) idx = i
        })
        setSceneIdx((old) => (old === idx ? old : idx))
      })
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  // Хэш текущей сцены в режиме ведущего — чтобы можно было вернуться
  useEffect(() => {
    if (!presenting) return
    const id = sceneOrder[sceneIdx]
    if (id) history.replaceState(null, "", `#${id}`)
  }, [presenting, sceneIdx])

  const go = useCallback(
    (idx: number) => {
      const clamped = Math.max(0, Math.min(sceneOrder.length - 1, idx))
      const el = document.getElementById(sceneOrder[clamped]!)
      if (!el) return
      window.scrollTo({ top: topOf(sceneOrder[clamped]!) ?? 0, behavior })
    },
    [behavior],
  )

  const next = useCallback(() => {
    const stops = stopPoints(collapsed)
    const y = window.scrollY
    const target = stops.find((s) => s > y + 12)
    window.scrollTo({
      top: target ?? document.documentElement.scrollHeight,
      behavior,
    })
  }, [behavior, collapsed])

  const prev = useCallback(() => {
    const stops = stopPoints(collapsed)
    const y = window.scrollY
    const before = stops.filter((s) => s < y - 12)
    window.scrollTo({ top: before.length ? before[before.length - 1]! : 0, behavior })
  }, [behavior, collapsed])

  /** R — вернуть текущую сцену в исходное состояние (beat 0). */
  const resetScene = useCallback(() => {
    const id = sceneOrder[sceneIdx]
    if (!id) return
    window.scrollTo({ top: topOf(id) ?? 0, behavior })
  }, [sceneIdx, behavior])

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      void document.exitFullscreen()
    } else {
      void document.documentElement.requestFullscreen().catch(() => undefined)
    }
  }, [])

  const enter = useCallback(() => {
    setPresenting(true)
    const url = new URL(window.location.href)
    url.searchParams.set("presenter", "1")
    history.replaceState(null, "", url.toString())
  }, [])

  const exit = useCallback(() => {
    setPresenting(false)
    setNotesOpen(false)
    setBlack(false)
    const url = new URL(window.location.href)
    url.searchParams.delete("presenter")
    history.replaceState(null, "", url.toString())
  }, [])

  // Клавиатура. Вне режима ведущего перехватываем только P —
  // чтобы не ломать обычное чтение страницы стрелками и пробелом.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (t && (t.tagName === "TEXTAREA" || t.tagName === "INPUT" || t.isContentEditable)) {
        return
      }
      const k = e.key

      // P / З — переключение режима ведущего, работает всегда
      if (k === "p" || k === "P" || k === "з" || k === "З") {
        e.preventDefault()
        if (presenting) exit()
        else enter()
        return
      }

      if (!presenting) return

      switch (k) {
        case " ":
        case "PageDown":
        case "ArrowDown":
        case "ArrowRight":
          e.preventDefault()
          next()
          break
        case "PageUp":
        case "ArrowUp":
        case "ArrowLeft":
          e.preventDefault()
          prev()
          break
        case "Home":
          e.preventDefault()
          go(0)
          break
        case "End":
          e.preventDefault()
          go(sceneOrder.length - 1)
          break
        case "r":
        case "R":
        case "к":
        case "К":
          e.preventDefault()
          resetScene()
          break
        case "b":
        case "B":
        case "и":
        case "И":
          e.preventDefault()
          setBlack((v) => !v)
          break
        case "n":
        case "N":
        case "т":
        case "Т":
          setNotesOpen((v) => !v)
          break
        case "f":
        case "F":
        case "а":
        case "А":
          toggleFullscreen()
          break
        case "Escape":
          if (black) setBlack(false)
          else if (notesOpen) setNotesOpen(false)
          else exit()
          break
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [presenting, black, notesOpen, next, prev, go, resetScene, toggleFullscreen, enter, exit])

  return {
    presenting,
    notesOpen,
    black,
    sceneIdx,
    sceneId: sceneOrder[sceneIdx] ?? sceneOrder[0]!,
    enter,
    exit,
    toggleNotes: () => setNotesOpen((v) => !v),
    toggleFullscreen,
    go,
    next,
    prev,
    resetScene,
  }
}
