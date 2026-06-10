import { notFound } from "next/navigation"
import Link from "next/link"
import { loadPortalData, getScreenplaySlug } from "@/lib/baghovPortal"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function ProducerPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const data = await loadPortalData()
  if (!data?.producer) notFound()
  const p = data.producer
  const base = `/b/${token}`
  const screenplay = getScreenplaySlug()

  return (
    <main className="mx-auto max-w-[980px] px-5 pb-10 pt-12">
      <p className="bgv-kicker">Для продюсера · маршрут на 5 минут</p>
      <h1 className="bgv-display mt-3 text-[clamp(1.8rem,4vw,2.6rem)] font-bold">
        Проект за пять минут
      </h1>

      {/* hook + logline */}
      <div className="bgv-card mt-7 p-6">
        <p className="bgv-quote text-[clamp(1.15rem,2.4vw,1.5rem)] leading-snug text-[var(--mal-text)]">
          «{p.hook}»
        </p>
        <hr className="bgv-hr my-4" />
        <p className="text-[1rem] leading-[1.75] text-[var(--mal-text-2)]">{p.logline}</p>
        <p className="mt-3 text-[0.92rem] text-[#ecd9a8]">{data.hero.tone_rule}</p>
      </div>

      {/* route */}
      <section className="mt-8">
        <p className="bgv-kicker mb-4">Маршрут: три остановки</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {p.route.map((r) => (
            <Link key={r.href} href={`${base}/${r.href}`} className="bgv-card block p-4">
              <span className="block font-semibold text-[var(--mal-text)]">{r.label}</span>
              <span className="mt-1 block text-[0.83rem] leading-snug text-[var(--mal-text-3)]">
                {r.note}
              </span>
            </Link>
          ))}
        </div>
        {screenplay ? (
          <p className="mt-3 text-[0.83rem] text-[var(--mal-text-3)]">
            Бонус-остановка:{" "}
            <a href={`/p/${screenplay}`} target="_blank" rel="noreferrer" className="text-[#3ecf8e] underline underline-offset-2">
              полный сценарий полнометражной версии
            </a>{" "}
            — доказательство, что мир выдерживает 97 страниц.
          </p>
        ) : null}
      </section>

      {/* reasons */}
      <section className="mt-10 grid gap-4 md:grid-cols-2">
        <div className="bgv-card p-6">
          <p className="bgv-kicker mb-3">Три причины смотреть</p>
          <ol className="space-y-3">
            {p.reasons_viewer.map((r, i) => (
              <li key={i} className="flex gap-3 text-[0.92rem] leading-relaxed text-[var(--mal-text-2)]">
                <span className="bgv-num !h-6 !min-w-6 flex-none text-[0.7rem]">{i + 1}</span>
                {r}
              </li>
            ))}
          </ol>
        </div>
        <div className="bgv-card bgv-card--gold p-6">
          <p className="bgv-kicker mb-3 text-[#ecd9a8]">Три аргумента каналу</p>
          <ol className="space-y-3">
            {p.reasons_channel.map((r, i) => (
              <li key={i} className="flex gap-3 text-[0.92rem] leading-relaxed text-[var(--mal-text-2)]">
                <span className="bgv-num bgv-num--gold !h-6 !min-w-6 flex-none text-[0.7rem]">{i + 1}</span>
                {r}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* budget */}
      <section className="bgv-warnsign mt-8 p-6">
        <p className="bgv-field-label text-[#ecd9a8]">Бюджетная формула</p>
        <p className="bgv-quote mt-2 text-[1.05rem] leading-relaxed">«{p.budget_formula}»</p>
      </section>

      {/* comedy proof */}
      <section className="mt-10">
        <p className="bgv-kicker mb-4">Комедия — доказательством: семь реплик</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {p.best_lines.map((l) => (
            <div key={l} className="bgv-card p-4">
              <p className="bgv-quote text-[0.95rem] leading-relaxed">{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* first question */}
      <section className="mt-10">
        <p className="bgv-kicker mb-4">Первый вопрос — готовый ответ</p>
        <div className="bgv-card p-6">
          <p className="font-semibold text-[var(--mal-text)]">— {p.first_question}</p>
          <p className="mt-3 leading-[1.75] text-[var(--mal-text-2)]">— {p.first_answer}</p>
        </div>
      </section>

      {/* one-pager */}
      <section className="mt-10 flex flex-wrap items-center gap-4">
        <Link
          href={`${base}/prodyuser/one-pager`}
          className="inline-block rounded-[10px] bg-[var(--mal-green)] px-6 py-3 font-semibold text-[#08130d] transition-transform hover:-translate-y-0.5"
        >
          One-pager для пересылки →
        </Link>
        <span className="text-[0.83rem] text-[var(--mal-text-3)]">
          Светлая печатная версия: Ctrl+P → PDF → одно письмо.
        </span>
      </section>
    </main>
  )
}
