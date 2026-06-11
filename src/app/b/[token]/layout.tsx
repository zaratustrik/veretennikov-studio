import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getPortalSlug } from "@/lib/baghovPortal"
import PortalNav from "./PortalNav"
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

  return (
    <div className="bgv-portal">
      <PortalNav token={token} />

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
