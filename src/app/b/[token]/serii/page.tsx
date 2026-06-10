import { notFound } from "next/navigation"
import { loadPortalData, type PortalEpisode } from "@/lib/baghovPortal"

export const dynamic = "force-dynamic"
export const revalidate = 0

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="bgv-field-label">{label}</p>
      <p className="mt-1 text-[0.9rem] leading-relaxed text-[var(--mal-text-2)]">{children}</p>
    </div>
  )
}

function EpisodeCard({ e }: { e: PortalEpisode }) {
  const gold = e.arc === 2
  return (
    <details id={`ep-${e.n}`} className={"bgv-ep bgv-card scroll-mt-20 " + (gold ? "bgv-card--gold bgv-ep--gold" : "")}>
      <summary className="flex items-center gap-4 p-5">
        <span className={"bgv-num flex-none " + (gold ? "bgv-num--gold" : "")}>{e.n}</span>
        <span className="min-w-0 flex-1">
          <span className="block font-semibold leading-snug text-[var(--mal-text)]">
            {e.title}
          </span>
          <span className="mt-0.5 block truncate text-[0.8rem] text-[var(--mal-text-3)]">
            {e.motif}
          </span>
        </span>
        <span className="bgv-ep-caret flex-none text-[1.1rem]" aria-hidden>
          ›
        </span>
      </summary>

      <div className="space-y-4 px-5 pb-5 pt-1">
        <Field label="Бытовая проблема">{e.problem}</Field>
        <Field label="Мистическое вмешательство">{e.mystic}</Field>
        <Field label="Комедийный двигатель">{e.comedy}</Field>

        <div className="grid gap-4 rounded-[10px] border border-[var(--mal-rule)] bg-[rgba(8,16,12,.4)] p-4 sm:grid-cols-2">
          <Field label="Илья">{e.lines.ilya}</Field>
          <Field label="Лера">{e.lines.lera}</Field>
          <Field label="Кира">{e.lines.kira}</Field>
          <Field label="Ансамбль">{e.lines.ensemble}</Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Твист серии">{e.twist}</Field>
          <Field label="Подсказка сезонной тайны">{e.clue}</Field>
          <Field label="Пэйофф / закладка">{e.payoff}</Field>
          <Field label="Финальный крючок">{e.hook}</Field>
        </div>

        <div className="bgv-social -mx-5 -mb-5 grid gap-4 px-5 py-4 sm:grid-cols-2">
          <Field label="Social hook">{e.social.hook}</Field>
          <Field label="Vertical short · 30–90 сек">{e.social.vertical}</Field>
          <Field label="Fan theory seed">{e.social.theory}</Field>
          <Field label="Meme line">
            <span className="bgv-quote">{e.social.meme}</span>
          </Field>
        </div>
      </div>
    </details>
  )
}

export default async function EpisodesPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  await params
  const data = await loadPortalData()
  if (!data) notFound()

  const arc1 = data.episodes.filter((e) => e.arc === 1)
  const arc2 = data.episodes.filter((e) => e.arc === 2)

  return (
    <main className="mx-auto max-w-[920px] px-5 pb-10 pt-12">
      <p className="bgv-kicker">Посерийник · 16 эпизодов</p>
      <h1 className="bgv-display mt-3 text-[clamp(1.8rem,4vw,2.6rem)] font-bold">
        Карточки серий
      </h1>
      <p className="mt-3 max-w-[680px] text-[0.95rem] leading-relaxed text-[var(--mal-text-3)]">
        Каждая серия — закрытая комедийная история недели + один шаг сезонной
        тайны. Нечётные серии открываются прошлым (1901 / 1850-е / 1996 / 1998),
        чётные — современной мини-сценкой. Кликните карточку, чтобы раскрыть.
      </p>

      <h2 className="bgv-kicker mb-4 mt-10 text-[#8fe6bd]">
        Арка Хозяйки · серии 1–8 · испытания
      </h2>
      <div className="space-y-3">
        {arc1.map((e) => (
          <EpisodeCard key={e.n} e={e} />
        ))}
      </div>

      <h2 className="bgv-kicker mb-4 mt-12 text-[#ecd9a8]">
        Арка Полоза · серии 9–16 · соблазны
      </h2>
      <div className="space-y-3">
        {arc2.map((e) => (
          <EpisodeCard key={e.n} e={e} />
        ))}
      </div>
    </main>
  )
}
