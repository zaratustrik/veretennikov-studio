"use client"

import { useRef, type ReactNode } from "react"
import { useReveal, useStage } from "./hooks"
import type { Tone } from "./content.ru"

/* ════════════════════════════════════════════════════════════
   Обычная сцена: один экран, одна мысль.
   ════════════════════════════════════════════════════════════ */

export function Scene({
  id,
  tone,
  label,
  index,
  total,
  children,
  center,
}: {
  id: string
  tone: Tone
  label: string
  index: number
  total: number
  children: ReactNode
  center?: boolean
}) {
  return (
    <section
      id={id}
      aria-label={label}
      data-tone={tone}
      className="utpp-scene"
      style={center ? { alignItems: "center", textAlign: "center" } : undefined}
    >
      <SceneCount index={index} total={total} />
      <div className="utpp-inner">{children}</div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════════
   Staged-сцена: несколько смысловых beat'ов на одном экране.

   Высота внешней секции = beats × 100dvh, содержимое sticky.
   Прокрутка раскрывает beat'ы; ведущий делает это пробелом.
   При prefers-reduced-motion секция схлопывается в один экран
   с финальным состоянием — ни один смысл не теряется.
   ════════════════════════════════════════════════════════════ */

export function Stage({
  id,
  tone,
  label,
  index,
  total,
  beats,
  collapsed,
  children,
  showBeats = true,
}: {
  id: string
  tone: Tone
  label: string
  index: number
  total: number
  beats: number
  collapsed: boolean
  children: (beat: number) => ReactNode
  showBeats?: boolean
}) {
  const ref = useRef<HTMLElement>(null)
  const beat = useStage(ref, beats, collapsed)

  return (
    <section
      id={id}
      ref={ref}
      aria-label={label}
      data-tone={tone}
      data-collapsed={collapsed || undefined}
      className="utpp-scene utpp-stage"
      style={collapsed ? undefined : { height: `${beats * 100}dvh` }}
    >
      <div className="utpp-stage-sticky">
        <SceneCount index={index} total={total} />
        {showBeats && !collapsed && beats > 1 ? (
          <div className="utpp-beats" aria-hidden="true">
            {Array.from({ length: beats }, (_, i) => (
              <i key={i} data-on={i <= beat} />
            ))}
          </div>
        ) : null}
        <div className="utpp-inner">{children(beat)}</div>
      </div>
    </section>
  )
}

function SceneCount({ index, total }: { index: number; total: number }) {
  return (
    <span className="utpp-count" aria-hidden="true">
      {String(index).padStart(2, "0")} — {String(total).padStart(2, "0")}
    </span>
  )
}

/* ════════════════════════════════════════════════════════════
   Появление при входе во вьюпорт. Задержка не больше 0.3 с —
   иначе зритель успевает начать читать пустоту.
   ════════════════════════════════════════════════════════════ */

export function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className,
  style,
}: {
  children: ReactNode
  delay?: number
  as?: "div" | "p" | "li" | "section" | "header"
  className?: string
  style?: React.CSSProperties
}) {
  const [ref, seen] = useReveal<HTMLDivElement>()
  const Component = Tag as "div"
  return (
    <Component
      ref={ref}
      className={`utpp-reveal${className ? ` ${className}` : ""}`}
      data-in={seen}
      style={{ transitionDelay: `${Math.min(delay, 0.3)}s`, ...style }}
    >
      {children}
    </Component>
  )
}

/* ════════════════════════════════════════════════════════════
   Служебные мелочи
   ════════════════════════════════════════════════════════════ */

export function Eyebrow({
  children,
  muted,
}: {
  children: ReactNode
  muted?: boolean
}) {
  return (
    <p className={`utpp-eyebrow${muted ? " utpp-eyebrow--muted" : ""}`}>{children}</p>
  )
}

/** Крупное утверждение на весь экран — «тихая» сцена. */
export function Statement({
  id,
  tone,
  label,
  index,
  total,
  text,
  sub,
}: {
  id: string
  tone: Tone
  label: string
  index: number
  total: number
  text: string
  sub?: string
}) {
  return (
    <Scene id={id} tone={tone} label={label} index={index} total={total}>
      <div className="utpp-statement-block">
        <Reveal>
          <p className="utpp-statement">{text}</p>
        </Reveal>
        {sub ? (
          <Reveal delay={0.18}>
            <p className="utpp-lead utpp-statement-sub">{sub}</p>
          </Reveal>
        ) : null}
      </div>
    </Scene>
  )
}
