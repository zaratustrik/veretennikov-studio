import { notFound } from "next/navigation"
import { loadPortalData } from "@/lib/baghovPortal"

export const dynamic = "force-dynamic"
export const revalidate = 0

/**
 * Light, print-friendly one-pager. Deliberately styled inline (not the dark
 * portal theme) so Ctrl+P produces a clean single A4 page for forwarding.
 */
export default async function OnePagerPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  await params
  const data = await loadPortalData()
  if (!data?.producer) notFound()
  const p = data.producer

  return (
    <main
      className="min-h-screen bg-white text-[#10231a] print:bg-white"
      style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
    >
      <div className="mx-auto max-w-[720px] px-8 py-10 print:py-4">
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-[#5f7a6b]">
          {data.meta.format} · {data.meta.authors}
        </p>
        <h1 className="mt-2 text-[2rem] font-bold leading-tight">
          Не буди Хозяйку
          <span className="block text-[1.1rem] font-normal text-[#2e6b4f]">
            Малахитовый район
          </span>
        </h1>

        <p className="mt-4 text-[1.05rem] font-semibold italic text-[#1d4d38]">
          «{p.hook}»
        </p>

        <p className="mt-3 text-[0.95rem] leading-[1.65]">{p.logline}</p>

        <p className="mt-2 text-[0.9rem] italic text-[#4a6557]">{data.hero.tone_rule}</p>

        <div className="mt-5 grid grid-cols-2 gap-6 text-[0.88rem] leading-[1.55]">
          <div>
            <h2 className="mb-1.5 font-mono text-[0.65rem] uppercase tracking-[0.15em] text-[#5f7a6b]">
              Почему это будут смотреть
            </h2>
            <ul className="list-disc space-y-1 pl-4">
              {p.reasons_viewer.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="mb-1.5 font-mono text-[0.65rem] uppercase tracking-[0.15em] text-[#5f7a6b]">
              Аргументы каналу
            </h2>
            <ul className="list-disc space-y-1 pl-4">
              {p.reasons_channel.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-5 rounded border border-[#c9a64b] bg-[#fdf8ec] px-4 py-3 text-[0.9rem]">
          <strong>Бюджет:</strong> {p.budget_formula}
        </div>

        <h2 className="mb-1.5 mt-5 font-mono text-[0.65rem] uppercase tracking-[0.15em] text-[#5f7a6b]">
          Комедия — доказательством
        </h2>
        <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-[0.85rem] italic leading-[1.5]">
          {p.best_lines.slice(0, 6).map((l) => (
            <p key={l}>{l}</p>
          ))}
        </div>

        <div className="mt-5 border-t border-[#d6e3da] pt-3 text-[0.8rem] leading-[1.55] text-[#4a6557]">
          <p>
            <strong>Сезон:</strong> серии 1–8 — Хозяйка проверяет, КАК ты
            делаешь; серии 9–16 — Полоз спрашивает, ЧЕГО ты хочешь. Выбор
            героини между горой и людьми — дверь, через которую входит вторая
            арка.
          </p>
          <p className="mt-1.5">
            <strong>Готово:</strong> библия мира и правил · карточки 16 серий ·
            карта твистов · фрагмент пилота · story graph · полнометражная
            версия сценария (вселенная проверена на 97 страницах).
          </p>
        </div>

        <p className="mt-5 text-center font-mono text-[0.6rem] uppercase tracking-[0.18em] text-[#8aa295] print:hidden">
          Ctrl+P → сохранить как PDF → одна страница
        </p>
      </div>
    </main>
  )
}
