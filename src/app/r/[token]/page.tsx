import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import {
  ANALYSIS_TITLE,
  ANALYSIS_INTRO,
  DOCS,
  GROUP_ORDER,
  getSlug,
} from "@/lib/sosppAnalysis"

/**
 * Hidden, link-only overview of the СОСПП expert analysis.
 * Path = /r/<token> where <token> must equal env SOSPP_ANALYSIS_SLUG
 * (set only on the production VM). noindex, not in sitemap, 404 otherwise.
 */

export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata: Metadata = {
  title: "Экспертиза · закрытый доступ",
  robots: { index: false, follow: false, noarchive: true, nosnippet: true },
}

export default async function AnalysisOverview({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const expected = getSlug()
  if (!expected || token !== expected) notFound()

  return (
    <main className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <div className="mx-auto max-w-[920px] px-6 py-14 md:py-20">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[var(--ink-3)]">
          СОСПП · экспертиза · закрытый доступ
        </p>
        <h1
          className="mt-4 font-[var(--font-display)] text-[var(--fs-h1)] font-semibold leading-[1.1] text-[var(--ink)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {ANALYSIS_TITLE}
        </h1>
        <p className="mt-5 max-w-[720px] text-[var(--fs-lead)] leading-[1.7] text-[var(--ink-2)]">
          {ANALYSIS_INTRO}
        </p>

        <div className="mt-7 flex flex-wrap gap-2">
          {["3 исходных документа", "106 страниц основного документа", "16 материалов", "7 регионов сравнения"].map(
            (s) => (
              <span
                key={s}
                className="rounded-full border border-[var(--rule)] bg-[var(--paper-1)] px-3 py-1 text-[0.8rem] text-[var(--ink-2)]"
              >
                {s}
              </span>
            ),
          )}
        </div>

        <hr className="my-12 border-0 border-t border-[var(--rule)]" />

        {GROUP_ORDER.map((group) => {
          const docs = DOCS.filter((d) => d.group === group)
          if (!docs.length) return null
          return (
            <section key={group} className="mb-12">
              <h2 className="mb-5 font-mono text-[0.75rem] uppercase tracking-[0.14em] text-[var(--ink-3)]">
                {group}
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {docs.map((d) => (
                  <Link
                    key={d.slug}
                    href={`/r/${token}/${d.slug}`}
                    className="group flex gap-4 rounded-[8px] border border-[var(--rule)] bg-[var(--paper-1)] p-4 transition-colors hover:border-[var(--cobalt)] hover:bg-[var(--cobalt-tint)]"
                  >
                    <span className="flex h-9 w-9 flex-none items-center justify-center rounded-[6px] bg-[var(--paper-3)] font-mono text-[0.8rem] font-semibold text-[var(--ink)] group-hover:bg-[var(--cobalt)] group-hover:text-white">
                      {d.num}
                    </span>
                    <span>
                      <span className="block font-semibold leading-snug text-[var(--ink)]">
                        {d.title}
                      </span>
                      <span className="mt-1 block text-[0.85rem] leading-snug text-[var(--ink-3)]">
                        {d.blurb}
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )
        })}

        <hr className="my-10 border-0 border-t border-[var(--rule)]" />
        <p className="text-[0.8rem] leading-relaxed text-[var(--ink-3)]">
          Закрытая страница, доступ только по прямой ссылке. Не индексируется
          поисковыми системами. Числовые данные процитированы из проекта
          Концепции либо из официальных источников; недостающие сведения помечены
          статусами и не домысливались. Дата экспертизы — 10 июня 2026 года.
        </p>
      </div>
    </main>
  )
}
