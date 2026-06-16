import { notFound } from "next/navigation"
import { getPortalSlug, loadPilotScreenplay } from "@/lib/baghovPortal"
import { parseFountain } from "@/lib/fountain"
import Reader from "../../../p/[slug]/Reader"
import "../../../p/[slug]/reader.css"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function PilotScreenplayPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const expected = getPortalSlug()
  if (!expected || token !== expected) notFound()

  const raw = await loadPilotScreenplay()
  if (!raw) notFound()

  const parsed = parseFountain(raw)
  return <Reader data={parsed} />
}
