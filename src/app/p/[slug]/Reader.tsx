"use client"

import { Fragment, useEffect, useMemo, useRef, useState } from "react"
import type { ParsedScreenplay, Scene, Token } from "@/lib/fountain"

/**
 * Reader — the whole reading experience. Single client component (kept fat on
 * purpose; this page lives alone outside the rest of the site's design system).
 *
 * Features:
 *  - Title page → act interludes → scenes layout
 *  - Top progress bar (thin malachite)
 *  - Sticky right scene navigator (collapsible)
 *  - Cinema mode toggle (warm dark theme) — persisted to localStorage
 *  - Scroll position auto-saved/restored
 *  - Scene fade-in on viewport entry (IntersectionObserver)
 *  - Estimated runtime header
 *
 * Bazhov-flavoured accent: malachite green (#2E6E54). Cinema mode: amber.
 */

export default function Reader({ data }: { data: ParsedScreenplay }) {
  const [progress, setProgress] = useState(0)
  const [activeSceneId, setActiveSceneId] = useState<number | null>(null)
  const [navOpen, setNavOpen] = useState(true)
  const [cinema, setCinema] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  // Load persisted prefs and scroll position
  useEffect(() => {
    setHydrated(true)
    if (typeof window === "undefined") return
    const wantCinema = localStorage.getItem("baghov-cinema") === "1"
    if (wantCinema) setCinema(true)
    const wantNavClosed = localStorage.getItem("baghov-nav") === "0"
    if (wantNavClosed) setNavOpen(false)

    if (!window.location.hash) {
      const savedY = localStorage.getItem("baghov-scrollY")
      const y = savedY ? parseInt(savedY, 10) : NaN
      if (Number.isFinite(y) && y > 100) {
        // Defer to let the page paint before scrolling.
        requestAnimationFrame(() => {
          window.scrollTo({ top: y, behavior: "auto" })
        })
      }
    }
  }, [])

  // Save prefs
  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem("baghov-cinema", cinema ? "1" : "0")
  }, [cinema, hydrated])

  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem("baghov-nav", navOpen ? "1" : "0")
  }, [navOpen, hydrated])

  // Scroll progress + position save (debounced)
  useEffect(() => {
    let saveTimer: ReturnType<typeof setTimeout> | undefined
    const onScroll = () => {
      const doc = document.documentElement
      const max = doc.scrollHeight - doc.clientHeight
      if (max > 0) {
        setProgress(Math.min(1, Math.max(0, doc.scrollTop / max)))
      }
      if (saveTimer) clearTimeout(saveTimer)
      saveTimer = setTimeout(() => {
        localStorage.setItem("baghov-scrollY", String(window.scrollY))
      }, 400)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (saveTimer) clearTimeout(saveTimer)
    }
  }, [])

  // Track active scene via IntersectionObserver on scene headings
  const sceneObserverRef = useRef<IntersectionObserver | null>(null)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the topmost entry that is intersecting (closest to viewport top)
        const visible = entries
          .filter((e) => e.isIntersecting)
          .map((e) => ({
            id: parseInt((e.target as HTMLElement).dataset.sceneId ?? "0", 10),
            top: e.boundingClientRect.top,
          }))
          .sort((a, b) => a.top - b.top)
        if (visible.length > 0) {
          setActiveSceneId(visible[0].id)
        }
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: 0 },
    )
    sceneObserverRef.current = observer
    document.querySelectorAll("[data-scene-id]").forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [data])

  // Reveal-on-scroll for scene blocks
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            ;(e.target as HTMLElement).classList.add("scene-revealed")
            observer.unobserve(e.target)
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.04 },
    )
    document.querySelectorAll(".scene-block").forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [data])

  const flatScenes = useMemo(() => {
    return data.acts.flatMap((act, ai) =>
      act.scenes.map((sc) => ({ act: act.title, actIndex: ai, scene: sc })),
    )
  }, [data])

  return (
    <div className={`baghov-root ${cinema ? "cinema" : "paper"}`}>
      {/* Top progress bar */}
      <div className="progress-track" aria-hidden>
        <div className="progress-fill" style={{ width: `${progress * 100}%` }} />
      </div>

      {/* Top utility bar */}
      <header className="utility-bar">
        <div className="util-left">
          <span className="util-tag">VERETENNIKOV STUDIO</span>
          <span className="util-dim">·</span>
          <span className="util-dim">DRAFT v02</span>
        </div>
        <div className="util-right">
          <button
            className="util-btn"
            onClick={() => setNavOpen((v) => !v)}
            aria-label="Сцены"
            title="Список сцен"
          >
            {navOpen ? "СЦЕНЫ ←" : "→ СЦЕНЫ"}
          </button>
          <button
            className="util-btn"
            onClick={() => setCinema((v) => !v)}
            aria-label="Кинорежим"
            title={cinema ? "Дневной режим" : "Кинорежим"}
          >
            {cinema ? "ДНЁМ ☼" : "ВЕЧЕРОМ ☾"}
          </button>
        </div>
      </header>

      {/* Side scene navigator */}
      <SceneNavigator
        open={navOpen}
        acts={data.acts}
        activeSceneId={activeSceneId}
        onClose={() => setNavOpen(false)}
      />

      {/* Main reading column */}
      <main className="reader">
        <TitlePage tp={data.titlePage} stats={data} />

        {data.acts.map((act, ai) => (
          <Fragment key={act.title + ai}>
            <ActInterlude title={act.title} index={ai} />
            {act.scenes.map((sc) => (
              <SceneBlock key={sc.id} scene={sc} />
            ))}
          </Fragment>
        ))}

        <EndCard
          authors={data.titlePage["Author"] ?? data.titlePage["Authors"] ?? ""}
        />
      </main>

      {/* Decorative paper noise */}
      <div className="paper-grain" aria-hidden />
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────── */

function TitlePage({
  tp,
  stats,
}: {
  tp: Record<string, string>
  stats: ParsedScreenplay
}) {
  const title = tp["Title"] ?? "Без названия"
  const credit = tp["Credit"] ?? ""
  const author = tp["Author"] ?? tp["Authors"] ?? ""
  const source = tp["Source"] ?? ""
  const draft = tp["Draft date"] ?? tp["Draft"] ?? ""
  const notes = tp["Notes"] ?? ""

  return (
    <section className="title-page" aria-label="Титульный лист">
      <div className="title-ornament" aria-hidden>
        <Ornament />
      </div>

      <h1 className="title-main">
        {title.split(" ").map((word, i) => (
          <span key={i} className="title-word" style={{ animationDelay: `${0.1 + i * 0.12}s` }}>
            {word}{" "}
          </span>
        ))}
      </h1>

      {credit ? <p className="title-credit">{credit}</p> : null}
      {author ? (
        <p className="title-author">
          <span className="title-by">сценарий</span>
          <span className="title-name">{author}</span>
        </p>
      ) : null}

      <div className="title-meta">
        {source ? <p>{source}</p> : null}
        {draft ? <p>Драфт · {draft}</p> : null}
        {notes ? <p className="title-notes">{notes}</p> : null}
      </div>

      <div className="title-stats">
        <Stat label="Сцен" value={stats.sceneCount.toString()} />
        <Stat label="Актов" value={stats.acts.length.toString()} />
        <Stat label="Слов" value={stats.wordCount.toLocaleString("ru-RU")} />
        <Stat
          label="≈ экранного времени"
          value={`${stats.estimatedRuntimeMin} мин`}
        />
      </div>

      <p className="title-confidential">
        КОНФИДЕНЦИАЛЬНО · Только для адресата по ссылке
      </p>
    </section>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="stat">
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  )
}

function Ornament() {
  // Bazhov-flavoured: stylised malachite swirl
  return (
    <svg viewBox="0 0 120 30" width="120" height="30" fill="none" stroke="currentColor" strokeWidth="0.9">
      <path d="M2 15 Q 20 5, 35 15 T 60 15 T 85 15 T 118 15" />
      <circle cx="60" cy="15" r="2.4" fill="currentColor" />
    </svg>
  )
}

/* ─────────────────────────────────────────────────────────────────── */

function ActInterlude({ title, index }: { title: string; index: number }) {
  const roman = ["I", "II", "III", "IV", "V"][index] ?? `${index + 1}`
  return (
    <section className="act-interlude" data-act-index={index} aria-label={title}>
      <p className="act-tag">{title.replace(/АКТ\s*/i, "").trim() ? title : "АКТ"}</p>
      <h2 className="act-numeral">{roman}</h2>
      <div className="act-ornament" aria-hidden>
        <Ornament />
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────── */

function SceneBlock({ scene }: { scene: Scene }) {
  return (
    <section
      className="scene-block"
      data-scene-id={scene.id}
      id={`scene-${scene.id}`}
    >
      <header className="scene-heading">
        <span className="scene-id">{String(scene.id).padStart(2, "0")}</span>
        <span className="scene-text">{scene.heading}</span>
      </header>

      <div className="scene-body">
        {scene.tokens.map((tok, i) => (
          <TokenView key={i} token={tok} />
        ))}
      </div>
    </section>
  )
}

function TokenView({ token }: { token: Token }) {
  switch (token.kind) {
    case "action":
      return (
        <div className="action">
          {token.lines.map((l, i) => (
            <p key={i}>{l}</p>
          ))}
        </div>
      )
    case "character":
      return <p className="character">{token.name}</p>
    case "parenthetical":
      return <p className="parenthetical">({token.text})</p>
    case "dialogue":
      return (
        <div className="dialogue">
          {token.lines.map((l, i) => (
            <p key={i}>{l}</p>
          ))}
        </div>
      )
    default:
      return null
  }
}

/* ─────────────────────────────────────────────────────────────────── */

function SceneNavigator({
  open,
  acts,
  activeSceneId,
  onClose,
}: {
  open: boolean
  acts: ParsedScreenplay["acts"]
  activeSceneId: number | null
  onClose: () => void
}) {
  return (
    <aside className={`nav-panel ${open ? "open" : ""}`} aria-label="Навигатор сцен">
      <div className="nav-head">
        <span className="nav-title">СЦЕНЫ</span>
        <button className="nav-close" onClick={onClose} aria-label="Закрыть">
          ✕
        </button>
      </div>
      <nav className="nav-list">
        {acts.map((act, ai) => (
          <div key={ai} className="nav-act">
            <p className="nav-act-title">{act.title}</p>
            <ul>
              {act.scenes.map((sc) => (
                <li key={sc.id}>
                  <a
                    href={`#scene-${sc.id}`}
                    className={`nav-item ${sc.location === "INT" ? "int" : "ext"} ${
                      activeSceneId === sc.id ? "active" : ""
                    }`}
                    onClick={(e) => {
                      // Smooth scroll instead of hash jump
                      e.preventDefault()
                      const el = document.getElementById(`scene-${sc.id}`)
                      el?.scrollIntoView({ behavior: "smooth", block: "start" })
                      history.replaceState(null, "", `#scene-${sc.id}`)
                    }}
                  >
                    <span className="nav-id">{String(sc.id).padStart(2, "0")}</span>
                    <span className="nav-loc">{sc.location === "INT" ? "INT" : sc.location === "EXT" ? "EXT" : "—"}</span>
                    <span className="nav-text">{shortenHeading(sc.heading)}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  )
}

function shortenHeading(s: string): string {
  // Drop the INT./EXT. prefix and trim to ~38 chars
  const cleaned = s.replace(/^(INT\.|EXT\.|ИНТ\.|НАТ\.)\s*/i, "")
  if (cleaned.length <= 42) return cleaned
  return cleaned.slice(0, 40).trimEnd() + "…"
}

/* ─────────────────────────────────────────────────────────────────── */

function EndCard({ authors }: { authors: string }) {
  return (
    <section className="end-card" aria-label="Конец">
      <div className="end-ornament">
        <Ornament />
      </div>
      <p className="end-fin">КОНЕЦ</p>
      {authors ? <p className="end-authors">{authors}</p> : null}
      <p className="end-meta">© Все права защищены. Не для распространения.</p>
    </section>
  )
}
