"use client"

import { useEffect } from "react"

/**
 * Shared, opt-in motion for the V2.1 public pages.
 *
 * The observer deliberately ignores the rest of the public layout: a route
 * participates only when its own markup has both `.sitev21-page` and
 * `[data-site-reveal]`. This keeps special projects inside the public route
 * group isolated from the redesign.
 */
export default function SiteMotion() {
  useEffect(() => {
    const roots = Array.from(document.querySelectorAll<HTMLElement>(".sitev21-page"))
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>(".sitev21-page [data-site-reveal]"),
    )

    if (roots.length === 0 || elements.length === 0) return

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    roots.forEach((root) => root.setAttribute("data-motion-ready", "true"))

    if (reduceMotion || !("IntersectionObserver" in window)) {
      elements.forEach((element) => element.setAttribute("data-site-visible", "true"))
      return () => roots.forEach((root) => root.removeAttribute("data-motion-ready"))
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const element = entry.target as HTMLElement
          element.setAttribute("data-site-visible", "true")
          observer.unobserve(element)
        })
      },
      { rootMargin: "0px 0px -8%", threshold: 0.08 },
    )

    elements.forEach((element) => observer.observe(element))

    return () => {
      observer.disconnect()
      roots.forEach((root) => root.removeAttribute("data-motion-ready"))
    }
  }, [])

  return null
}
