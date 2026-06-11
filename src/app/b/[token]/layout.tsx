import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import { getPortalSlug } from "@/lib/baghovPortal"
import "./portal.css"

/**
 * Hidden series-development portal «Малахитовая карта».
 * Path = /b/<token> where <token> must equal env BAGHOV_PORTAL_SLUG.
 * noindex, not in sitemap, excluded from robots and Metrika. 404 otherwise.
 */

export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata: Metadata = {
  title: "Малахитовая карта · закрытый доступ",
  robots: { index: false, follow: false, noarchive: true, nosnippet: true },
}

const NAV = [
  { href: "", label: "Карта" },
  { href: "/prodyuser", label: "Для продюсера" },
  { href: "/sezon", label: "Сезон" },
  { href: "/serii", label: "Серии" },
  { href: "/geroi", label: "Герои" },
  { href: "/mir", label: "Мир" },
  { href: "/tvisty", label: "Твисты" },
  { href: "/graf", label: "Граф" },
  { href: "/dokumenty", label: "Документы" },
]

export default async function PortalLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const expected = getPortalSlug()
  if (!expected || token !== expected) notFound()

  const base = `/b/${token}`

  return (
    <div className="bgv-portal">
      <nav className="bgv-nav">
        <div className="mx-auto flex max-w-[1160px] items-center gap-1 overflow-x-auto px-4 py-2">
          <Link
            href={base}
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
          {NAV.map((item) => (
            <Link key={item.href} href={`${base}${item.href}`}>
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      {children}

      <footer className="mt-20 border-t border-[var(--mal-rule)]">
        <div className="mx-auto max-w-[1160px] px-5 py-10">
          <div className="bgv-warnsign flex flex-wrap items-center gap-x-6 gap-y-2 px-5 py-4 text-[0.85rem] text-[var(--mal-text-2)]">
            <span className="font-semibold text-[#ecd9a8]">
              ⚠ Хозяйку не буди.
            </span>
            <span>Это не слоган — это местная техника безопасности.</span>
            <span className="text-[var(--mal-text-3)]">
              Закрытая страница: доступ только по прямой ссылке, не
              индексируется, в аналитику не пишется. Трогать по согласованию.
            </span>
          </div>
          <p className="mt-5 text-[0.78rem] leading-relaxed text-[var(--mal-text-3)]">
            «Не буди Хозяйку: Малахитовый район» · рабочие материалы разработки
            сериала · авторы идеи: Эдуард Мецгер, Анатолий Веретенников ·
            продюсер: Сергей Геннадьевич Ершов · по мотивам сказов П. П. Бажова ·
            Сысерть, Урал.
          </p>
        </div>
      </footer>
    </div>
  )
}
