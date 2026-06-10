import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import Markdown from "@/components/blog/Markdown"
import { DOCS, findDoc, readDoc, getSlug } from "@/lib/sosppAnalysis"

/**
 * Hidden, link-only single document of the СОСПП expert analysis.
 * Path = /r/<token>/<doc>. Both the token (env SOSPP_ANALYSIS_SLUG) and the
 * content directory (env SOSPP_ANALYSIS_DIR) live only on the VM. noindex,
 * not in sitemap, 404 otherwise.
 */

export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata: Metadata = {
  title: "Экспертиза · документ",
  robots: { index: false, follow: false, noarchive: true, nosnippet: true },
}

export default async function AnalysisDocPage({
  params,
}: {
  params: Promise<{ token: string; doc: string }>
}) {
  const { token, doc: docSlug } = await params
  const expected = getSlug()
  if (!expected || token !== expected) notFound()

  const doc = findDoc(docSlug)
  if (!doc) notFound()

  const content = await readDoc(docSlug)
  if (content == null) notFound()

  const idx = DOCS.findIndex((d) => d.slug === docSlug)
  const prev = idx > 0 ? DOCS[idx - 1] : null
  const next = idx < DOCS.length - 1 ? DOCS[idx + 1] : null

  return (
    <main className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <div className="mx-auto max-w-[820px] px-6 py-12 md:py-16">
        <Link
          href={`/r/${token}`}
          className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-[var(--ink-3)] hover:text-[var(--cobalt)]"
        >
          ← К оглавлению экспертизы
        </Link>

        <p className="mt-6 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-[var(--ink-3)]">
          Материал {doc.num} · {doc.group}
        </p>

        <article className="mt-2">
          <Markdown>{content}</Markdown>
        </article>

        <hr className="my-10 border-0 border-t border-[var(--rule)]" />

        <nav className="flex flex-col gap-3 sm:flex-row sm:justify-between">
          {prev ? (
            <Link
              href={`/r/${token}/${prev.slug}`}
              className="rounded-[8px] border border-[var(--rule)] bg-[var(--paper-1)] px-4 py-3 transition-colors hover:border-[var(--cobalt)]"
            >
              <span className="block font-mono text-[0.7rem] uppercase tracking-wide text-[var(--ink-3)]">
                ← Предыдущий
              </span>
              <span className="mt-0.5 block text-[0.9rem] font-semibold text-[var(--ink)]">
                {prev.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/r/${token}/${next.slug}`}
              className="rounded-[8px] border border-[var(--rule)] bg-[var(--paper-1)] px-4 py-3 text-right transition-colors hover:border-[var(--cobalt)]"
            >
              <span className="block font-mono text-[0.7rem] uppercase tracking-wide text-[var(--ink-3)]">
                Следующий →
              </span>
              <span className="mt-0.5 block text-[0.9rem] font-semibold text-[var(--ink)]">
                {next.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
        </nav>

        <p className="mt-10 text-[0.78rem] leading-relaxed text-[var(--ink-3)]">
          Закрытая страница, доступ только по прямой ссылке. Не индексируется
          поисковыми системами.
        </p>
      </div>
    </main>
  )
}
