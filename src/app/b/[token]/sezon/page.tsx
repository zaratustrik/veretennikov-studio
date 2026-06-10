import { notFound } from "next/navigation"
import Link from "next/link"
import { loadPortalData } from "@/lib/baghovPortal"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function SeasonPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const data = await loadPortalData()
  if (!data) notFound()
  const base = `/b/${token}`

  const arcRow = (arc: Record<string, string>, gold: boolean) => (
    <div className={"bgv-card p-6 " + (gold ? "bgv-card--gold" : "")}>
      <p className={"bgv-kicker " + (gold ? "text-[#ecd9a8]" : "text-[#8fe6bd]")}>
        {arc.range}
      </p>
      <h2 className="bgv-h2 mt-2">{arc.title}</h2>
      <dl className="mt-4 space-y-3 text-[0.92rem]">
        {[
          ["Вопрос арки", arc.question],
          ["Двигатель", arc.engine],
          ["Жанр горизонтали", arc.genre],
          ["Комедия", arc.comedy],
        ].map(([k, v]) => (
          <div key={k}>
            <dt className="bgv-field-label">{k}</dt>
            <dd className="mt-0.5 leading-relaxed text-[var(--mal-text-2)]">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  )

  return (
    <main className="mx-auto max-w-[1160px] px-5 pb-10 pt-12">
      <p className="bgv-kicker">Сезон 1 · конструкция</p>
      <h1 className="bgv-display mt-3 text-[clamp(1.8rem,4vw,2.6rem)] font-bold">
        Две арки: <span className="text-[#3ecf8e]">Хозяйка</span> →{" "}
        <span className="text-[#e0b454]">Полоз</span>
      </h1>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {arcRow(data.season.arc1, false)}
        {arcRow(data.season.arc2, true)}
      </div>

      <div className="bgv-card mt-4 p-6">
        <p className="bgv-field-label">Передача эстафеты</p>
        <p className="mt-2 leading-relaxed text-[var(--mal-text-2)]">
          {data.season.handoff}
        </p>
      </div>

      {/* episode strip */}
      <section className="mt-12">
        <p className="bgv-kicker mb-4">Лента сезона</p>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-8 lg:grid-cols-16">
          {data.episodes.map((e) => (
            <Link
              key={e.n}
              href={`${base}/serii#ep-${e.n}`}
              title={`${e.n}. ${e.title}`}
              className="bgv-card flex aspect-square flex-col items-center justify-center gap-1 !rounded-[8px] p-1 text-center"
              style={
                e.arc === 2
                  ? { borderColor: "rgba(224,180,84,.3)" }
                  : undefined
              }
            >
              <span
                className={"bgv-num !h-7 !min-w-7 text-[0.75rem] " + (e.arc === 2 ? "bgv-num--gold" : "")}
              >
                {e.n}
              </span>
              <span className="hidden text-[0.6rem] leading-tight text-[var(--mal-text-3)] lg:block">
                {e.title}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* spine */}
      <section className="mt-12 max-w-[860px]">
        <p className="bgv-kicker mb-6">Хребет сезона: десять опорных точек</p>
        <ol className="relative space-y-6 border-l border-[var(--mal-rule-strong)] pl-7">
          {data.season.spine.map((p) => (
            <li key={`${p.ep}-${p.title}`} className="relative">
              <span
                className={
                  "absolute -left-[37px] top-0.5 " +
                  (p.ep >= 9 ? "bgv-num bgv-num--gold" : "bgv-num") +
                  " !h-6 !min-w-6 text-[0.7rem]"
                }
              >
                {p.ep}
              </span>
              <h3 className="font-semibold text-[var(--mal-text)]">{p.title}</h3>
              <p className="mt-1 text-[0.92rem] leading-relaxed text-[var(--mal-text-2)]">
                {p.text}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <p className="mt-12 text-[0.85rem] text-[var(--mal-text-3)]">
        Полная конструкция с ритмом, страховкой вертикальности и поворотными
        точками всех героев —{" "}
        <Link href={`${base}/dokumenty/sezon`} className="text-[#3ecf8e] underline underline-offset-2">
          документ 05 «Структура сезона»
        </Link>
        .
      </p>
    </main>
  )
}
