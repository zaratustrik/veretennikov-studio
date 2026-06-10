import { notFound } from "next/navigation"
import Link from "next/link"
import { loadPortalData } from "@/lib/baghovPortal"
import GraphView from "./GraphView"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function GraphPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const data = await loadPortalData()
  if (!data) notFound()
  const base = `/b/${token}`

  return (
    <main className="mx-auto max-w-[1400px] px-5 pb-10 pt-12">
      <p className="bgv-kicker">Story graph · драматургическая карта</p>
      <h1 className="bgv-display mt-3 text-[clamp(1.8rem,4vw,2.6rem)] font-bold">
        Карта связей
      </h1>
      <p className="mt-3 max-w-[760px] text-[0.95rem] leading-relaxed text-[var(--mal-text-3)]">
        Под текстом серий лежит система: карта желаний, конфликтов, тайн,
        правил и закладок. Если у красивой идеи нет связи в графе — она
        подозрительна. Если связь есть, но нет сцены — связь пока не работает.
      </p>

      <div className="mt-8">
        <GraphView nodes={data.graph.nodes} edges={data.graph.edges} />
      </div>

      <p className="mt-8 text-[0.85rem] text-[var(--mal-text-3)]">
        Источник данных и десять структурных проверок (graph-аудит) —{" "}
        <Link href={`${base}/dokumenty/graf`} className="text-[#3ecf8e] underline underline-offset-2">
          документ 12 «Story graph + аудит»
        </Link>
        .
      </p>
    </main>
  )
}
