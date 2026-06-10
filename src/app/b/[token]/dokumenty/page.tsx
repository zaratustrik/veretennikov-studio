import { notFound } from "next/navigation"
import Link from "next/link"
import { loadPortalData } from "@/lib/baghovPortal"

export const dynamic = "force-dynamic"
export const revalidate = 0

const GROUP_ORDER = ["Ядро", "Сезон", "Пилот", "Решения", "Вторая итерация"]

export default async function DocsPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const data = await loadPortalData()
  if (!data) notFound()
  const base = `/b/${token}`

  return (
    <main className="mx-auto max-w-[1160px] px-5 pb-10 pt-12">
      <p className="bgv-kicker">Библиотека разработки</p>
      <h1 className="bgv-display mt-3 text-[clamp(1.8rem,4vw,2.6rem)] font-bold">
        Документы
      </h1>
      <p className="mt-3 max-w-[680px] text-[0.95rem] leading-relaxed text-[var(--mal-text-3)]">
        Полные рабочие документы reboot v02 — первоисточник всего, что показано
        на остальных страницах карты.
      </p>

      {GROUP_ORDER.map((group) => {
        const docs = data.docs.filter((d) => d.group === group)
        if (!docs.length) return null
        return (
          <section key={group} className="mt-10">
            <h2 className="bgv-kicker mb-4">{group}</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {docs.map((d) => (
                <Link
                  key={d.slug}
                  href={`${base}/dokumenty/${d.slug}`}
                  className="bgv-card flex gap-4 p-4"
                >
                  <span className="bgv-num flex-none">{d.num}</span>
                  <span>
                    <span className="block font-semibold leading-snug text-[var(--mal-text)]">
                      {d.title}
                    </span>
                    <span className="mt-1 block text-[0.85rem] leading-snug text-[var(--mal-text-3)]">
                      {d.blurb}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )
      })}
    </main>
  )
}
