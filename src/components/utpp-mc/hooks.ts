"use client"

import { useEffect, useRef, useState, type RefObject } from "react"

/* ════════════════════════════════════════════════════════════
   Профиль качества
   ════════════════════════════════════════════════════════════ */

export type QualityProfile = {
  /** false до первого клиентского рендера — SSR-безопасно */
  ready: boolean
  reducedMotion: boolean
  mobile: boolean
  /**
   * Сводный флаг: staged-сцены схлопываются в одно финальное состояние.
   * Включается и при prefers-reduced-motion, и на узком экране — там
   * sticky-кадр в 100dvh обрезал бы содержимое сверху и снизу.
   */
  collapsed: boolean
}

export function useQualityProfile(): QualityProfile {
  const [p, setP] = useState<QualityProfile>({
    ready: false,
    reducedMotion: false,
    mobile: false,
    collapsed: false,
  })

  useEffect(() => {
    const mqReduced = window.matchMedia("(prefers-reduced-motion: reduce)")
    const mqMobile = window.matchMedia("(max-width: 860px)")

    const compute = () => {
      const reducedMotion = mqReduced.matches
      const mobile = mqMobile.matches
      setP({ ready: true, reducedMotion, mobile, collapsed: reducedMotion || mobile })
    }

    compute()
    mqReduced.addEventListener("change", compute)
    mqMobile.addEventListener("change", compute)
    return () => {
      mqReduced.removeEventListener("change", compute)
      mqMobile.removeEventListener("change", compute)
    }
  }, [])

  return p
}

/* ════════════════════════════════════════════════════════════
   Единый scroll-тикер: один rAF-цикл на всю деку вместо
   отдельного слушателя в каждой сцене.
   ════════════════════════════════════════════════════════════ */

type Sub = () => void
const subs = new Set<Sub>()
let ticking = false
let bound = false

function flush() {
  ticking = false
  subs.forEach((fn) => fn())
}

function onScroll() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(flush)
}

function subscribe(fn: Sub): () => void {
  subs.add(fn)
  if (!bound && typeof window !== "undefined") {
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll, { passive: true })
    bound = true
  }
  fn()
  return () => {
    subs.delete(fn)
  }
}

/* ════════════════════════════════════════════════════════════
   Staged beats

   Внешняя секция растянута на (beats × 100dvh), внутренний слой
   sticky на 100dvh. Индекс beat'а = сколько экранов прокручено
   внутри секции. Движение привязано к прокрутке, а не к таймеру:
   ведущий управляет темпом сам.
   ════════════════════════════════════════════════════════════ */

export function useStage(
  ref: RefObject<HTMLElement | null>,
  beats: number,
  collapsed: boolean,
): number {
  const [scrolled, setScrolled] = useState(0)

  useEffect(() => {
    if (collapsed) return
    return subscribe(() => {
      const el = ref.current
      if (!el) return
      const vh = window.innerHeight
      const progressed = -el.getBoundingClientRect().top
      const idx = Math.max(0, Math.min(beats - 1, Math.floor(progressed / vh + 0.001)))
      setScrolled((b) => (b === idx ? b : idx))
    })
  }, [ref, beats, collapsed])

  // Схлопнутый режим — производное состояние, а не запись в эффекте:
  // при prefers-reduced-motion сцена сразу показывает финальный beat.
  return collapsed ? beats - 1 : scrolled
}

/**
 * Состояние узла относительно текущего beat'а — для focus choreography.
 * Прошедшее приглушается, но остаётся видимым; будущее ещё не конкурирует
 * за внимание; текущее звучит в полную силу.
 */
export function stateOf(index: number, beat: number): "past" | "now" | "future" {
  if (index > beat) return "future"
  if (index < beat) return "past"
  return "now"
}

/* ════════════════════════════════════════════════════════════
   Появление при входе во вьюпорт
   ════════════════════════════════════════════════════════════ */

export function useReveal<T extends HTMLElement>(): [RefObject<T | null>, boolean] {
  const ref = useRef<T>(null)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!("IntersectionObserver" in window)) {
      // Запасной путь для браузеров без IO: показываем всё сразу,
      // но не синхронно внутри эффекта.
      const raf = requestAnimationFrame(() => setSeen(true))
      return () => cancelAnimationFrame(raf)
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true)
          io.disconnect()
        }
      },
      { rootMargin: "0px 0px -18% 0px", threshold: 0.05 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return [ref, seen]
}

/* ════════════════════════════════════════════════════════════
   Черновики в localStorage — для интерактивных сцен.
   Ничего не уходит на сервер: об этом сказано на самих экранах.
   ════════════════════════════════════════════════════════════ */

export function useLocalDraft(
  key: string,
): [Record<string, string>, (id: string, value: string) => void, () => void] {
  const [draft, setDraft] = useState<Record<string, string>>({})

  useEffect(() => {
    let live = true
    // Микрозадача вместо синхронной записи: гидратация успевает завершиться
    // до того, как черновик из localStorage попадёт в состояние.
    queueMicrotask(() => {
      if (!live) return
      try {
        const raw = window.localStorage.getItem(key)
        if (raw) setDraft(JSON.parse(raw) as Record<string, string>)
      } catch {
        /* приватный режим или переполнение — работаем без сохранения */
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

/* ════════════════════════════════════════════════════════════
   Прогресс всей деки — для верхней полосы
   ════════════════════════════════════════════════════════════ */

export function useScrollProgress(el: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    return subscribe(() => {
      const bar = el.current
      if (!bar) return
      const doc = document.documentElement
      const max = doc.scrollHeight - window.innerHeight
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      bar.style.transform = `scaleX(${p})`
    })
  }, [el])
}

export { subscribe as subscribeScroll }
