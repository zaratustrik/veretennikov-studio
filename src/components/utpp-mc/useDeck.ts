"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { slides, slideOrder, TOTAL } from "./content.ru"

/* ════════════════════════════════════════════════════════════
   Профиль качества
   ════════════════════════════════════════════════════════════ */

export type Quality = {
  ready: boolean
  reducedMotion: boolean
  narrow: boolean
  /** Пошаговая сборка выключена: слайд сразу показывает финальное состояние. */
  collapsed: boolean
}

export function useQuality(): Quality {
  const [q, setQ] = useState<Quality>({
    ready: false,
    reducedMotion: false,
    narrow: false,
    collapsed: false,
  })

  useEffect(() => {
    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)")
    const mqNarrow = window.matchMedia("(max-width: 860px)")
    const compute = () => {
      const reducedMotion = mqReduce.matches
      const narrow = mqNarrow.matches
      setQ({ ready: true, reducedMotion, narrow, collapsed: reducedMotion || narrow })
    }
    compute()
    mqReduce.addEventListener("change", compute)
    mqNarrow.addEventListener("change", compute)
    return () => {
      mqReduce.removeEventListener("change", compute)
      mqNarrow.removeEventListener("change", compute)
    }
  }, [])

  return q
}

/* ════════════════════════════════════════════════════════════
   Горизонтальная сцена

   Слайд занимает ровно 100vw × 100dvh. Вертикальной прокрутки
   между слайдами нет: следующий входит справа, предыдущий уходит
   влево. Внутри слайда — beat'ы: → раскрывает следующий смысловой
   шаг и только после последнего переводит на следующий слайд.

   Колесо мыши сознательно не обрабатывается: во время выступления
   случайный скролл не должен перебрасывать докладчика.
   ════════════════════════════════════════════════════════════ */

export type DeckState = {
  slide: number
  beat: number
  /** Сколько beat'ов реально отображается на текущем слайде. */
  beatsHere: number
  /** Мгновенный переход без анимации — для прыжков через несколько слайдов. */
  instant: boolean
  presenting: boolean
  notesOpen: boolean
  black: boolean
  next: () => void
  prev: () => void
  goSlide: (i: number, opts?: { beat?: number }) => void
  resetBeats: () => void
  enterPresenter: () => void
  exitPresenter: () => void
  toggleNotes: () => void
  toggleFullscreen: () => void
}

export function useDeck(collapsed: boolean): DeckState {
  // Позиция хранится одним объектом: переходы считаются функциональным
  // апдейтом, поэтому два быстрых нажатия стрелки подряд не теряются
  // (замыкание на устаревшем beat приводило бы к пропуску шага).
  const [pos, setPos] = useState<{ slide: number; beat: number }>({ slide: 0, beat: 0 })
  const { slide, beat } = pos
  const [instant, setInstant] = useState(true)
  // Зеркало текущего слайда: нужно, чтобы решать про анимацию прыжка,
  // не вызывая побочных эффектов внутри функционального апдейта.
  const slideRef = useRef(0)
  const [presenting, setPresenting] = useState(false)
  const [notesOpen, setNotesOpen] = useState(false)
  const [black, setBlack] = useState(false)

  /** При схлопнутой сборке слайд всегда показывает единственное состояние. */
  const beatsAt = useCallback(
    (i: number) => (collapsed ? 1 : (slides[i]?.beats ?? 1)),
    [collapsed],
  )
  const beatsHere = beatsAt(slide)

  // Первый переход после монтирования — без анимации; дальше с анимацией.
  useEffect(() => {
    const t = window.setTimeout(() => setInstant(false), 60)
    return () => window.clearTimeout(t)
  }, [])

  /* ── Разбор адреса при входе ─────────────────────────────── */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get("presenter") === "1") setPresenting(true)
    if (params.get("notes") === "1") setNotesOpen(true)

    const hash = decodeURIComponent(window.location.hash.slice(1))
    if (hash) {
      const [id, rawBeat] = hash.split(".")
      const idx = slideOrder.indexOf(id ?? "")
      if (idx >= 0) {
        const b = Number(rawBeat)
        setPos({
          slide: idx,
          beat: Number.isFinite(b) ? Math.max(0, Math.min(beatsAt(idx) - 1, b)) : 0,
        })
      }
    }
    // Разбираем один раз при монтировании: дальше адресом управляет сама дека.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    slideRef.current = slide
  }, [slide])

  /* ── Адрес следует за состоянием: deep-link переживает перезагрузку ── */
  useEffect(() => {
    const id = slideOrder[slide]
    if (!id) return
    const suffix = beat > 0 ? `.${beat}` : ""
    history.replaceState(null, "", `#${id}${suffix}`)
  }, [slide, beat])

  /* ── Навигация ───────────────────────────────────────────── */

  const next = useCallback(() => {
    setInstant(false)
    setPos((p) => {
      if (p.beat < beatsAt(p.slide) - 1) return { slide: p.slide, beat: p.beat + 1 }
      if (p.slide < TOTAL - 1) return { slide: p.slide + 1, beat: 0 }
      return p
    })
  }, [beatsAt])

  const prev = useCallback(() => {
    setInstant(false)
    setPos((p) => {
      if (p.beat > 0) return { slide: p.slide, beat: p.beat - 1 }
      if (p.slide > 0) {
        // Назад возвращаемся в полностью раскрытое состояние предыдущего
        // слайда, а не в его начало: рассказ идёт непрерывно.
        return { slide: p.slide - 1, beat: beatsAt(p.slide - 1) - 1 }
      }
      return p
    })
  }, [beatsAt])

  const goSlide = useCallback(
    (i: number, opts?: { beat?: number }) => {
      const target = Math.max(0, Math.min(TOTAL - 1, i))
      // Прыжок через несколько слайдов не анимируем: пролёт мимо
      // промежуточных экранов выглядит как сбой, а не как переход.
      setInstant(Math.abs(target - slideRef.current) > 1)
      setPos({
        slide: target,
        beat: Math.max(0, Math.min(beatsAt(target) - 1, opts?.beat ?? 0)),
      })
    },
    [beatsAt],
  )

  /** R — вернуть текущий слайд в исходное состояние. */
  const resetBeats = useCallback(() => setPos((p) => ({ slide: p.slide, beat: 0 })), [])

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen()
    else void document.documentElement.requestFullscreen().catch(() => undefined)
  }, [])

  const enterPresenter = useCallback(() => {
    setPresenting(true)
    const url = new URL(window.location.href)
    url.searchParams.set("presenter", "1")
    history.replaceState(null, "", url.toString())
  }, [])

  const exitPresenter = useCallback(() => {
    setPresenting(false)
    setNotesOpen(false)
    setBlack(false)
    const url = new URL(window.location.href)
    url.searchParams.delete("presenter")
    history.replaceState(null, "", url.toString())
  }, [])

  /* ── Клавиатура ──────────────────────────────────────────── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (t && (t.tagName === "TEXTAREA" || t.tagName === "INPUT" || t.isContentEditable)) {
        return
      }
      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
        case " ":
        case "PageDown":
          e.preventDefault()
          next()
          break
        case "ArrowLeft":
        case "ArrowUp":
        case "PageUp":
          e.preventDefault()
          prev()
          break
        case "Home":
          e.preventDefault()
          goSlide(0)
          break
        case "End":
          e.preventDefault()
          goSlide(TOTAL - 1)
          break
        case "p":
        case "P":
        case "з":
        case "З":
          e.preventDefault()
          if (presenting) exitPresenter()
          else enterPresenter()
          break
        case "r":
        case "R":
        case "к":
        case "К":
          e.preventDefault()
          resetBeats()
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
          e.preventDefault()
          setNotesOpen((v) => !v)
          break
        case "f":
        case "F":
        case "а":
        case "А":
          e.preventDefault()
          toggleFullscreen()
          break
        case "Escape":
          if (black) setBlack(false)
          else if (notesOpen) setNotesOpen(false)
          else if (presenting) exitPresenter()
          break
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [
    next,
    prev,
    goSlide,
    resetBeats,
    toggleFullscreen,
    presenting,
    notesOpen,
    black,
    enterPresenter,
    exitPresenter,
  ])

  return {
    slide,
    beat: collapsed ? (slides[slide]?.beats ?? 1) - 1 : beat,
    beatsHere,
    instant,
    presenting,
    notesOpen,
    black,
    next,
    prev,
    goSlide,
    resetBeats,
    enterPresenter,
    exitPresenter,
    toggleNotes: () => setNotesOpen((v) => !v),
    toggleFullscreen,
  }
}

/* ════════════════════════════════════════════════════════════
   Горизонтальный свайп на тач-устройствах.
   Вертикальные жесты не перехватываем: внутри слайда может быть
   собственная прокрутка.
   ════════════════════════════════════════════════════════════ */

export function useSwipe(
  ref: React.RefObject<HTMLElement | null>,
  onNext: () => void,
  onPrev: () => void,
): void {
  const start = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const down = (e: PointerEvent) => {
      if (e.pointerType === "mouse") return
      start.current = { x: e.clientX, y: e.clientY }
    }

    const up = (e: PointerEvent) => {
      const s = start.current
      start.current = null
      if (!s) return
      const dx = e.clientX - s.x
      const dy = e.clientY - s.y
      if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.4) return
      if (dx < 0) onNext()
      else onPrev()
    }

    el.addEventListener("pointerdown", down, { passive: true })
    el.addEventListener("pointerup", up, { passive: true })
    el.addEventListener("pointercancel", () => (start.current = null), { passive: true })
    return () => {
      el.removeEventListener("pointerdown", down)
      el.removeEventListener("pointerup", up)
    }
  }, [ref, onNext, onPrev])
}

/* ════════════════════════════════════════════════════════════
   Черновики интерактивных слайдов
   ════════════════════════════════════════════════════════════ */

export function useLocalDraft(
  key: string,
): [Record<string, string>, (id: string, value: string) => void, () => void] {
  const [draft, setDraft] = useState<Record<string, string>>({})

  useEffect(() => {
    let live = true
    queueMicrotask(() => {
      if (!live) return
      try {
        const raw = window.localStorage.getItem(key)
        if (raw) setDraft(JSON.parse(raw) as Record<string, string>)
      } catch {
        /* приватный режим — работаем без сохранения */
      }
    })
    return () => {
      live = false
    }
  }, [key])

  const set = (id: string, value: string) => {
    setDraft((prev) => {
      const next = { ...prev, [id]: value }
      try {
        window.localStorage.setItem(key, JSON.stringify(next))
      } catch {
        /* игнорируем */
      }
      return next
    })
  }

  const clear = () => {
    setDraft({})
    try {
      window.localStorage.removeItem(key)
    } catch {
      /* игнорируем */
    }
  }

  return [draft, set, clear]
}
