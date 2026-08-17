"use client"

import { useEffect, useRef, useState } from "react"

/**
 * Появление блока при входе во вьюпорт. Срабатывает один раз.
 * При prefers-reduced-motion CSS отключает и переход, и смещение.
 */
export function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className,
}: {
  children: React.ReactNode
  delay?: number
  as?: "div" | "section" | "li"
  className?: string
}) {
  const ref = useRef<HTMLElement>(null)
  // Без IntersectionObserver показываем сразу: анимация — украшение,
  // содержимое не должно от неё зависеть.
  const [shown, setShown] = useState(
    () => typeof IntersectionObserver === "undefined",
  )

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === "undefined") return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true)
            io.disconnect()
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.06 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      className={`kdl-reveal${className ? ` ${className}` : ""}`}
      data-shown={shown}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  )
}
