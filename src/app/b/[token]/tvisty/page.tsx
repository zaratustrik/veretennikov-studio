import { notFound } from "next/navigation"
import Link from "next/link"
import { loadPortalData } from "@/lib/baghovPortal"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function TwistsPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const data = await loadPortalData()
  if (!data) notFound()
  const base = `/b/${token}`
  const t = data.twists

  return (
    <main className="mx-auto max-w-[1160px] px-5 pb-10 pt-12">
      <p className="bgv-kicker">Карта закладок и пэйоффов</p>
      <h1 className="bgv-display mt-3 text-[clamp(1.8rem,4vw,2.6rem)] font-bold">
        Твисты
      </h1>
      <p className="mt-3 max-w-[720px] text-[0.95rem] leading-relaxed text-[var(--mal-text-3)]">
        Правило проекта: твист не вводит новое правило — он переворачивает смысл
        уже показанного. Каждый большой твист имеет минимум три закладки в трёх
        разных сериях, хотя бы одна спрятана в шутке.
      </p>

      {/* big twists */}
      <section className="mt-10 space-y-4">
        {t.big.map((b) => (
          <article key={b.title} className="bgv-card p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="bgv-display text-[1.15rem] font-bold text-[var(--mal-text)]">
                {b.title}
              </h2>
              <span className="bgv-chip bgv-chip--gold flex-none">
                Раскрытие: {b.reveal}
              </span>
            </div>
            <p className="bgv-field-label mt-4">Закладки</p>
            <ul className="mt-2 grid gap-x-6 gap-y-1.5 md:grid-cols-2">
              {b.plants.map((p) => (
                <li key={p} className="flex gap-2.5 text-[0.87rem] leading-relaxed text-[var(--mal-text-2)]">
                  <span className="text-[#3ecf8e]" aria-hidden>
                    ✓
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      {/* joke → rule */}
      <section className="mt-12">
        <h2 className="bgv-kicker mb-4">Кажется шуткой — оказывается правилом мира</h2>
        <div className="bgv-card overflow-x-auto p-2">
          <table className="bgv-table">
            <thead>
              <tr>
                <th>Шутка</th>
                <th>Правило</th>
              </tr>
            </thead>
            <tbody>
              {t.joke_rules.map((j) => (
                <tr key={j.joke}>
                  <td className="bgv-quote">{j.joke}</td>
                  <td>{j.rule}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* props */}
      <section className="mt-12">
        <h2 className="bgv-kicker mb-4">Реквизит → ключ</h2>
        <div className="bgv-card overflow-x-auto p-2">
          <table className="bgv-table">
            <thead>
              <tr>
                <th>Предмет</th>
                <th>Появляется как</th>
                <th>Становится</th>
              </tr>
            </thead>
            <tbody>
              {t.props.map((p) => (
                <tr key={p.prop}>
                  <td className="font-semibold text-[var(--mal-text)]">{p.prop}</td>
                  <td>{p.from}</td>
                  <td>{p.to}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* phrases */}
      <section className="mt-12">
        <h2 className="bgv-kicker mb-4">Фраза звучит бытово — раскрывается мистически</h2>
        <div className="bgv-card overflow-x-auto p-2">
          <table className="bgv-table">
            <thead>
              <tr>
                <th>Фраза</th>
                <th>Бытовой слой</th>
                <th>Мистический слой</th>
              </tr>
            </thead>
            <tbody>
              {t.phrases.map((p) => (
                <tr key={p.phrase}>
                  <td className="bgv-quote">{p.phrase}</td>
                  <td>{p.everyday}</td>
                  <td>{p.mystic}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <p className="mt-10 text-[0.85rem] text-[var(--mal-text-3)]">
        Полная карта с системой кадров Киры и чек-листом честности —{" "}
        <Link href={`${base}/dokumenty/tvisty`} className="text-[#3ecf8e] underline underline-offset-2">
          документ 07 «Карта твистов»
        </Link>
        .
      </p>
    </main>
  )
}
