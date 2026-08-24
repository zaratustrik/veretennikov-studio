"use client"

import Image from "next/image"
import type { CSSProperties, ReactNode } from "react"
import type { Tone } from "./content.ru"

/** Фоновая фотография слайда: атмосфера и фактура, не носитель смысла. */
export type SlidePhoto = { src: string; position?: string; opacity?: number }

/** Вертикальный срез по правому краю с жёсткой композиционной границей. */
export type SlideCut = { src: string; alt: string; position?: string }

/* ════════════════════════════════════════════════════════════
   Слайд горизонтальной сцены: ровно 100vw × 100dvh.

   Появление содержимого привязано к data-active, а не к скроллу:
   слайд входит справа — и его содержимое собирается. Никаких
   IntersectionObserver: в презентационном режиме их нечему наблюдать.
   ════════════════════════════════════════════════════════════ */

export function Slide({
  id,
  tone,
  label,
  index,
  total,
  active,
  children,
  scroll,
  photo,
  cut,
}: {
  id: string
  tone: Tone
  label: string
  index: number
  total: number
  active: boolean
  children: ReactNode
  /** Разрешить внутреннюю вертикальную прокрутку (длинные интерактивы). */
  scroll?: boolean
  /** Фон во всю площадь: даёт фактуру, читаемость текста не трогает. */
  photo?: SlidePhoto
  /** Срез по правому краю: кадр и текст разделены жёсткой границей,
   *  а не полупрозрачной подложкой поверх фотографии. */
  cut?: SlideCut
}) {
  return (
    <section
      id={id}
      aria-label={label}
      aria-hidden={!active}
      data-tone={tone}
      data-active={active}
      data-cut={cut ? "" : undefined}
      data-photo={photo ? "" : undefined}
      className="utpp-slide"
    >
      {photo ? (
        <div
          className="utpp-photo"
          aria-hidden="true"
          style={{ opacity: photo.opacity ?? 0.28 }}
        >
          <Image
            src={photo.src}
            alt=""
            fill
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: photo.position ?? "center" }}
            priority={index <= 3}
          />
        </div>
      ) : null}

      <span className="utpp-count" aria-hidden="true">
        {String(index).padStart(2, "0")} <i /> {String(total).padStart(2, "0")}
      </span>

      <div className={`utpp-slide-body${scroll ? " utpp-slide-body--scroll" : ""}`}>
        <div className="utpp-inner">{children}</div>
      </div>

      {cut ? (
        <figure className="utpp-cut">
          <Image
            src={cut.src}
            alt={cut.alt}
            fill
            sizes="40vw"
            style={{ objectFit: "cover", objectPosition: cut.position ?? "center" }}
            priority={index <= 3}
          />
        </figure>
      ) : null}
    </section>
  )
}

/**
 * Элемент появления. `d` — порядковый номер в каскаде; задержка
 * ограничена, чтобы зритель не успевал начать читать пустоту.
 */
export function In({
  children,
  d = 0,
  as: Tag = "div",
  className,
  style,
}: {
  children: ReactNode
  d?: number
  as?: "div" | "p" | "li" | "header" | "section" | "figure"
  className?: string
  style?: CSSProperties
}) {
  const Component = Tag as "div"
  return (
    <Component
      className={`utpp-in${className ? ` ${className}` : ""}`}
      style={{ ["--d" as string]: Math.min(d, 8), ...style }}
    >
      {children}
    </Component>
  )
}

/** Состояние узла относительно текущего beat'а — focus choreography. */
export function stateOf(index: number, beat: number): "past" | "now" | "future" {
  if (index > beat) return "future"
  if (index < beat) return "past"
  return "now"
}

/** Крупное утверждение на весь слайд — «тихий» экран между блоками. */
export function Statement({
  id,
  tone,
  label,
  index,
  total,
  active,
  text,
  sub,
  photo,
}: {
  id: string
  tone: Tone
  label: string
  index: number
  total: number
  active: boolean
  text: string
  sub?: string
  photo?: SlidePhoto
}) {
  return (
    <Slide
      id={id}
      tone={tone}
      label={label}
      index={index}
      total={total}
      active={active}
      photo={photo}
    >
      <div className="utpp-statement-block">
        <In>
          <p className="utpp-statement">{text}</p>
        </In>
        {sub ? (
          <In d={1}>
            <p className="utpp-statement-sub">{sub}</p>
          </In>
        ) : null}
      </div>
    </Slide>
  )
}

/** Заголовочная группа слайда: рубрика + заголовок + лид. */
export function Head({
  eyebrow,
  title,
  lead,
  wide,
}: {
  eyebrow?: string
  title: string
  lead?: string
  wide?: boolean
}) {
  return (
    <header className="utpp-head">
      {eyebrow ? (
        <In>
          <p className="utpp-eyebrow">{eyebrow}</p>
        </In>
      ) : null}
      <In d={1}>
        <h2 className={`utpp-h2${wide ? " utpp-h2--wide" : ""}`}>{title}</h2>
      </In>
      {lead ? (
        <In d={2}>
          <p className="utpp-lead">{lead}</p>
        </In>
      ) : null}
    </header>
  )
}
