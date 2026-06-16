"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

/**
 * Portal navigation: inline links on md+, hamburger dropdown on mobile.
 * Scoped to the hidden /b portal — does not touch the main site chrome.
 */

const NAV = [
  { href: "", label: "Карта" },
  { href: "/prodyuser", label: "Для продюсера" },
  { href: "/sezon", label: "Сезон" },
  { href: "/serii", label: "Серии" },
  { href: "/geroi", label: "Герои" },
  { href: "/mir", label: "Мир" },
  { href: "/tvisty", label: "Твисты" },
  { href: "/graf", label: "Контроль сезона" },
  { href: "/dokumenty", label: "Документы" },
]

export default function PortalNav({ token }: { token: string }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const base = `/b/${token}`

  const isActive = (href: string) => {
    const full = `${base}${href}`
    if (href === "") return pathname === base
    return pathname === full || pathname.startsWith(full + "/")
  }

  return (
    <nav className="bgv-nav">
      <div className="mx-auto flex max-w-[1160px] items-center gap-1 px-4 py-2">
        <Link
          href={base}
          onClick={() => setOpen(false)}
          className="mr-2 flex flex-none items-center gap-2 !bg-transparent !px-0"
        >
          <span
            aria-hidden
            className="inline-block h-3.5 w-3.5 rounded-[3px]"
            style={{
              background:
                "conic-gradient(from 200deg, #3ecf8e, #1d7a52, #9be8c4, #1d7a52, #3ecf8e)",
              boxShadow: "0 0 10px rgba(62,207,142,.6)",
            }}
          />
          <span className="bgv-display text-[0.95rem] font-semibold tracking-wide text-[var(--mal-text)]">
            Малахитовая карта
          </span>
        </Link>

        {/* desktop / tablet: inline */}
        <div className="hidden flex-1 items-center gap-1 overflow-x-auto md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={`${base}${item.href}`}
              className={isActive(item.href) ? "bgv-nav--active" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* mobile: hamburger */}
        <button
          type="button"
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="bgv-burger ml-auto md:hidden"
        >
          <span className={"bgv-burger-line " + (open ? "bgv-burger-line--1o" : "")} />
          <span className={"bgv-burger-line " + (open ? "bgv-burger-line--2o" : "")} />
          <span className={"bgv-burger-line " + (open ? "bgv-burger-line--3o" : "")} />
        </button>
      </div>

      {/* mobile dropdown */}
      {open ? (
        <div className="bgv-mobile-menu md:hidden">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={`${base}${item.href}`}
              onClick={() => setOpen(false)}
              className={
                "bgv-mobile-link" + (isActive(item.href) ? " bgv-mobile-link--active" : "")
              }
            >
              {item.label}
            </Link>
          ))}
        </div>
      ) : null}
    </nav>
  )
}
