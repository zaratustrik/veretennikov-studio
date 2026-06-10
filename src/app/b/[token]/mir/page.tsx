import { notFound } from "next/navigation"
import Link from "next/link"
import { loadPortalData } from "@/lib/baghovPortal"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function MythologyPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const data = await loadPortalData()
  if (!data) notFound()
  const base = `/b/${token}`
  const m = data.mythology

  return (
    <main className="mx-auto max-w-[1160px] px-5 pb-10 pt-12">
      <p className="bgv-kicker">Мифология · правила мира</p>
      <h1 className="bgv-display mt-3 text-[clamp(1.8rem,4vw,2.6rem)] font-bold">
        Медь <span className="text-[var(--mal-text-3)]">против</span>{" "}
        <span className="text-[#e0b454]">золота</span>
      </h1>

      <div className="bgv-card mt-7 max-w-[860px] p-6">
        <p className="bgv-quote text-[1.05rem] leading-relaxed">«{m.intro}»</p>
        <hr className="bgv-hr my-4" />
        <p className="text-[0.95rem] leading-relaxed text-[var(--mal-text-2)]">{m.balance}</p>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {m.forces.map((f) => {
          const gold = f.name.includes("Полоз")
          return (
            <section key={f.name} className={"bgv-card p-6 " + (gold ? "bgv-card--gold" : "")}>
              <h2 className="bgv-h2">{f.name}</h2>
              <p className="mt-3 text-[0.92rem] leading-relaxed text-[var(--mal-text-2)]">
                {f.essence}
              </p>
              <p className="bgv-field-label mt-5">Играбельные правила</p>
              <ul className="mt-2 space-y-2">
                {f.rules.map((r) => (
                  <li key={r} className="flex gap-2.5 text-[0.88rem] leading-relaxed text-[var(--mal-text-2)]">
                    <span className={gold ? "text-[#e0b454]" : "text-[#3ecf8e]"} aria-hidden>
                      ◆
                    </span>
                    {r}
                  </li>
                ))}
              </ul>
            </section>
          )
        })}
      </div>

      <section className="bgv-warnsign mt-8 max-w-[860px] p-6">
        <p className="bgv-field-label text-[#ecd9a8]">
          Производственные лимиты — конституция сезона
        </p>
        <ul className="mt-3 space-y-2">
          {m.limits.map((l) => (
            <li key={l} className="flex gap-2.5 text-[0.88rem] leading-relaxed text-[var(--mal-text-2)]">
              <span className="text-[#ecd9a8]" aria-hidden>
                ⚠
              </span>
              {l}
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-10 text-[0.85rem] text-[var(--mal-text-3)]">
        Полные правила с обоснованием и ответами на вопросы продюсера —{" "}
        <Link href={`${base}/dokumenty/mir`} className="text-[#3ecf8e] underline underline-offset-2">
          документ 02 «Правила мифологии»
        </Link>
        .
      </p>
    </main>
  )
}
