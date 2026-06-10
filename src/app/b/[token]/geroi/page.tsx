import { notFound } from "next/navigation"
import Link from "next/link"
import { loadPortalData } from "@/lib/baghovPortal"

export const dynamic = "force-dynamic"
export const revalidate = 0

const MYTHIC = new Set(["hozyayka", "polozov"])

export default async function CharactersPage({
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
      <p className="bgv-kicker">Ансамбль сезона</p>
      <h1 className="bgv-display mt-3 text-[clamp(1.8rem,4vw,2.6rem)] font-bold">
        Герои
      </h1>
      <p className="mt-3 max-w-[680px] text-[0.95rem] leading-relaxed text-[var(--mal-text-3)]">
        У каждого — бытовое «хочет», скрытое «нужно», комедийный механизм и
        точка, где его испытывает Хозяйка (с.1–8) и соблазняет Полоз (с.9–16).
      </p>

      <div className="mt-9 grid gap-4 md:grid-cols-2">
        {data.characters.map((c) => {
          const gold = c.id === "polozov" || c.id === "veresov"
          return (
            <article
              key={c.id}
              className={"bgv-card p-6 " + (gold ? "bgv-card--gold" : "")}
            >
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="bgv-display text-[1.25rem] font-bold text-[var(--mal-text)]">
                  {c.name}
                </h2>
                {MYTHIC.has(c.id) ? (
                  <span className={"bgv-chip flex-none " + (gold ? "bgv-chip--gold" : "")}>
                    бессмертие
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-[0.82rem] text-[var(--mal-text-3)]">{c.tag}</p>

              <dl className="mt-4 space-y-3 text-[0.9rem]">
                <div>
                  <dt className="bgv-field-label">Хочет</dt>
                  <dd className="mt-0.5 leading-relaxed text-[var(--mal-text-2)]">{c.want}</dd>
                </div>
                <div>
                  <dt className="bgv-field-label">Нужно</dt>
                  <dd className="mt-0.5 leading-relaxed text-[var(--mal-text-2)]">{c.need}</dd>
                </div>
                <div>
                  <dt className="bgv-field-label">Комедия</dt>
                  <dd className="mt-0.5 leading-relaxed text-[var(--mal-text-2)]">{c.comedy}</dd>
                </div>
                <div>
                  <dt className="bgv-field-label">Арка сезона</dt>
                  <dd className="mt-0.5 leading-relaxed text-[var(--mal-text-2)]">{c.arc}</dd>
                </div>
              </dl>

              <p className="bgv-quote mt-4 border-t border-[var(--mal-rule)] pt-3 text-[0.92rem]">
                {c.quote}
              </p>
            </article>
          )
        })}
      </div>

      <p className="mt-10 text-[0.85rem] text-[var(--mal-text-3)]">
        Полные арки по сериям и карта отношений —{" "}
        <Link href={`${base}/dokumenty/geroi`} className="text-[#3ecf8e] underline underline-offset-2">
          документ 03 «Арки героев»
        </Link>
        .
      </p>
    </main>
  )
}
