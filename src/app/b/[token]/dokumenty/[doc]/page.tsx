import { notFound } from "next/navigation"
import Link from "next/link"
import Markdown from "@/components/blog/Markdown"
import { loadPortalData, readPortalDoc } from "@/lib/baghovPortal"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function PortalDocPage({
  params,
}: {
  params: Promise<{ token: string; doc: string }>
}) {
  const { token, doc: docSlug } = await params
  const data = await loadPortalData()
  if (!data) notFound()

  const res = await readPortalDoc(docSlug, token)
  if (!res) notFound()

  const base = `/b/${token}`
  const idx = data.docs.findIndex((d) => d.slug === docSlug)
  const prev = idx > 0 ? data.docs[idx - 1] : null
  const next = idx >= 0 && idx < data.docs.length - 1 ? data.docs[idx + 1] : null

  return (
    <main className="mx-auto max-w-[860px] px-5 pb-10 pt-10">
      <Link
        href={`${base}/dokumenty`}
        className="bgv-kicker hover:text-[#3ecf8e]"
      >
        ← Все документы
      </Link>

      <p className="bgv-kicker mt-6">
        Документ {res.doc.num} · {res.doc.group}
      </p>

      <article className="mt-2">
        <Markdown>{res.content}</Markdown>
      </article>

      <hr className="bgv-hr my-10" />

      <nav className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        {prev ? (
          <Link href={`${base}/dokumenty/${prev.slug}`} className="bgv-card px-4 py-3">
            <span className="bgv-field-label block">← Предыдущий</span>
            <span className="mt-0.5 block text-[0.9rem] font-semibold text-[var(--mal-text)]">
              {prev.title}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`${base}/dokumenty/${next.slug}`}
            className="bgv-card px-4 py-3 text-right"
          >
            <span className="bgv-field-label block">Следующий →</span>
            <span className="mt-0.5 block text-[0.9rem] font-semibold text-[var(--mal-text)]">
              {next.title}
            </span>
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </main>
  )
}
