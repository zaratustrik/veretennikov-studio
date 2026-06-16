import { notFound } from "next/navigation"
import Link from "next/link"
import { loadPortalData } from "@/lib/baghovPortal"
import SeasonControl from "./SeasonControl"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function SeasonControlPage({
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
      <p className="bgv-kicker">Приборная панель сезона</p>
      <h1 className="bgv-display mt-3 text-[clamp(1.8rem,4vw,2.6rem)] font-bold">
        Контроль сезона
      </h1>
      <p className="mt-3 max-w-[760px] text-[0.95rem] leading-relaxed text-[var(--mal-text-3)]">
        Не паутина связей, а ответы на вопросы: не развалится ли сезон, честен ли
        твист, у всех ли героев арка. Продюсеру — доказательство контроля за
        минуту; сценаристу — рабочий срез по сериям.
      </p>

      <div className="mt-8">
        <SeasonControl data={data} />
      </div>

      <p className="mt-12 text-[0.85rem] text-[var(--mal-text-3)]">
        Источник истины и десять структурных проверок —{" "}
        <Link href={`${base}/dokumenty/graf`} className="text-[#3ecf8e] underline underline-offset-2">
          документ 12 «Story graph + аудит»
        </Link>
        .
      </p>
    </main>
  )
}
