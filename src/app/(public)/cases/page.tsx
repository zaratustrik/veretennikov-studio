import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { prisma } from "@/lib/db"
import FallbackPoster from "@/components/public/FallbackPoster"
import CtaLink from "@/components/public/CtaLink"
import JsonLd from "@/components/JsonLd"
import { SITE_URL, breadcrumbListSchema, collectionPageSchema } from "@/lib/seo"
import {
  CATEGORY_ORDER,
  categoryOf,
  type CaseCategory,
} from "@/lib/caseTaxonomy"

export const revalidate = 600

export const metadata: Metadata = {
  title: "Работы",
  description:
    "Проекты студии: системы и платформы для бизнес-процессов, промышленные и корпоративные фильмы, 3D-визуализация, интерактив. Все работы сданы и согласованы к публикации.",
  alternates: { canonical: "/cases" },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/cases`,
    title: "Работы — Veretennikov Studio",
    description:
      "Системы для бизнес-процессов, промышленные фильмы, 3D и интерактив. Сданные проекты студии.",
    siteName: "Veretennikov Studio",
    locale: "ru_RU",
  },
}

function formatDuration(seconds: number | null): string {
  if (!seconds) return ""
  const m = Math.floor(seconds / 60)
  const s = String(seconds % 60).padStart(2, "0")
  return `${m}:${s}`
}

type CaseRow = Awaited<ReturnType<typeof prisma.case.findMany>>[number]

function CaseCard({ c, i }: { c: CaseRow; i: number }) {
  const dur = formatDuration(c.duration)
  const cat = categoryOf(c)

  return (
    <Link
      href={`/show/${c.slug}`}
      className="scroll-reveal group block"
      style={{ animationDelay: `${(i % 9) * 45}ms` }}
    >
      <div
        className="relative w-full overflow-hidden bg-[var(--paper-2)] mb-4"
        style={{ aspectRatio: "16 / 9", borderRadius: 2 }}
      >
        {c.posterUrl ? (
          <Image
            src={c.posterUrl}
            alt={c.title}
            fill
            sizes="(min-width: 1024px) 384px, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <FallbackPoster
            client={c.client}
            title={c.title}
            year={c.year}
            index={i + 1}
            type={c.type}
          />
        )}

        {dur ? (
          <span
            className="absolute bottom-3 right-3 font-mono text-[10px] tracking-[0.06em] text-white px-2 py-1"
            style={{ background: "rgba(15, 26, 46, 0.65)", backdropFilter: "blur(8px)" }}
          >
            ▸ {dur}
          </span>
        ) : cat === "ai" || cat === "platform" ? (
          <span
            className="absolute bottom-3 right-3 font-mono text-[10px] tracking-[0.16em] uppercase text-white px-2 py-1"
            style={{ background: "rgba(31, 77, 222, 0.85)", backdropFilter: "blur(8px)" }}
          >
            {cat === "ai" ? "ИИ" : "Разработка"}
          </span>
        ) : null}

        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ boxShadow: "inset 0 0 0 1px var(--cobalt)" }}
        />
      </div>

      <p
        className={`font-mono text-[10px] tracking-[0.18em] uppercase mb-2 transition-colors ${
          c.client
            ? "text-[var(--ink-3)] group-hover:text-[var(--cobalt)]"
            : "text-[var(--ink-4)]"
        }`}
      >
        {c.client || "—"}
      </p>

      <h3
        className="display text-[var(--ink)]"
        style={{
          fontSize: "clamp(1rem, 1.3vw, 1.12rem)",
          lineHeight: 1.25,
          letterSpacing: "-0.012em",
          animation: "none",
        }}
      >
        {c.title}
      </h3>

      {c.description && (
        <p
          className="text-[var(--ink-3)] leading-[1.55] mt-2 line-clamp-2"
          style={{ fontSize: "13px" }}
        >
          {c.description}
        </p>
      )}
    </Link>
  )
}

export default async function CasesPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>
}) {
  const { type: typeParam } = await searchParams

  const all = await prisma.case.findMany({
    where: { isPublic: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  })

  // Раскладываем по категориям
  const byCategory = new Map<CaseCategory, CaseRow[]>()
  for (const meta of CATEGORY_ORDER) byCategory.set(meta.key, [])
  for (const c of all) byCategory.get(categoryOf(c))!.push(c)

  // Старые значения фильтра (?type=video|dev|game) продолжают работать —
  // на них могли остаться внешние ссылки.
  const LEGACY: Record<string, CaseCategory> = {
    video: "film",
    dev: "platform",
    game: "lab",
  }
  const requested = typeParam ? (LEGACY[typeParam] ?? typeParam) : undefined
  const validKeys = CATEGORY_ORDER.map((c) => String(c.key))
  const active: CaseCategory | "all" =
    requested && validKeys.includes(requested)
      ? (requested as CaseCategory)
      : "all"

  const visibleCategories =
    active === "all"
      ? CATEGORY_ORDER.filter((m) => (byCategory.get(m.key) ?? []).length > 0)
      : CATEGORY_ORDER.filter((m) => m.key === active)

  const shownCount =
    active === "all" ? all.length : (byCategory.get(active) ?? []).length

  const jsonLd = [
    breadcrumbListSchema([
      { name: "Главная", url: SITE_URL },
      { name: "Работы", url: `${SITE_URL}/cases` },
    ]),
    collectionPageSchema({
      url: `${SITE_URL}/cases`,
      name: "Работы Veretennikov Studio",
      description:
        "Системы и платформы для бизнес-процессов, промышленные и корпоративные фильмы, 3D-визуализация и интерактив.",
      itemsCount: all.length,
    }),
  ]

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* Header */}
      <section className="border-b border-[var(--rule)]">
        <div className="mx-auto px-5 md:px-8" style={{ maxWidth: "var(--content-max)" }}>
          <div className="pt-12 md:pt-16 pb-10">
            <p className="eyebrow mb-6">Работы · {all.length} проектов</p>
            <h1
              className="display"
              style={{
                fontSize: "clamp(1.9rem, 4.2vw, 3.6rem)",
                lineHeight: 1.06,
                letterSpacing: "-0.025em",
                fontVariationSettings: '"opsz" 48',
                marginBottom: "20px",
                maxWidth: "22ch",
                animation: "none",
              }}
            >
              Системы, которые работают.{" "}
              <span className="studio-accent">
                Видео, которое смотрят.
              </span>
            </h1>
            <p
              className="text-[var(--ink-2)] leading-[1.7]"
              style={{ fontSize: "clamp(1rem, 1.2vw, 1.1rem)", maxWidth: "64ch" }}
            >
              Платформы и системы для бизнес-процессов, промышленные
              и корпоративные фильмы, 3D-визуализация, интерактив.{" "}
              <span className="text-[var(--ink-3)]">
                Все проекты сданы и согласованы к публикации. Часть работ
                показана без названия заказчика — по условиям соглашений.
              </span>
            </p>
          </div>

          {/* Разделы */}
          <nav className="flex gap-2 pb-8 flex-wrap" aria-label="Разделы портфолио">
            <Link
              href="/cases"
              scroll={false}
              className={`px-4 py-2 font-mono text-[12px] tracking-[0.04em] border transition-colors ${
                active === "all"
                  ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]"
                  : "border-[var(--rule)] text-[var(--ink-2)] hover:border-[var(--ink)] hover:text-[var(--ink)]"
              }`}
              style={{ borderRadius: 2 }}
            >
              Все{" "}
              <span className={active === "all" ? "text-[var(--paper)] opacity-60" : "text-[var(--ink-3)]"}>
                / {all.length}
              </span>
            </Link>

            {CATEGORY_ORDER.map((m) => {
              const n = (byCategory.get(m.key) ?? []).length
              if (n === 0) return null
              const isActive = active === m.key
              return (
                <Link
                  key={m.key}
                  href={`/cases?type=${m.key}`}
                  scroll={false}
                  className={`px-4 py-2 font-mono text-[12px] tracking-[0.04em] border transition-colors ${
                    isActive
                      ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]"
                      : "border-[var(--rule)] text-[var(--ink-2)] hover:border-[var(--ink)] hover:text-[var(--ink)]"
                  }`}
                  style={{ borderRadius: 2 }}
                >
                  {m.label}{" "}
                  <span className={isActive ? "text-[var(--paper)] opacity-60" : "text-[var(--ink-3)]"}>
                    / {n}
                  </span>
                </Link>
              )
            })}
          </nav>
        </div>
      </section>

      {/* Витрина по разделам */}
      <section
        className="border-b border-[var(--rule)]"
        style={{ paddingTop: "var(--s-7)", paddingBottom: "var(--s-9)" }}
      >
        <div className="mx-auto px-5 md:px-8" style={{ maxWidth: "var(--content-max)" }}>
          {shownCount === 0 ? (
            <p className="text-center text-[var(--ink-3)] py-16" style={{ fontSize: "14px" }}>
              Проектов в этом разделе пока нет.
            </p>
          ) : (
            visibleCategories.map((meta, sectionIdx) => {
              const items = byCategory.get(meta.key) ?? []
              if (items.length === 0) return null

              return (
                <div key={meta.key} className={sectionIdx > 0 ? "mt-20" : undefined}>
                  <div className="flex items-baseline justify-between gap-4 flex-wrap border-b border-[var(--rule)] pb-4 mb-9">
                    <div>
                      <h2
                        className="display"
                        style={{
                          fontSize: "clamp(1.35rem, 2.4vw, 1.9rem)",
                          letterSpacing: "-0.02em",
                          lineHeight: 1.15,
                          animation: "none",
                        }}
                      >
                        {meta.label}
                      </h2>
                      <p className="text-[var(--ink-3)] mt-1.5" style={{ fontSize: "13.5px" }}>
                        {meta.note}
                      </p>
                    </div>
                    <span className="font-mono text-[11px] tracking-[0.06em] uppercase text-[var(--ink-3)]">
                      {items.length}
                    </span>
                  </div>

                  {/* Честная пометка: доказательств в этом разделе пока мало */}
                  {meta.key === "ai" && items.length < 3 && (
                    <p
                      className="mb-9 pl-4 text-[var(--ink-2)] leading-[1.6]"
                      style={{ fontSize: "14px", borderLeft: "2px solid var(--cobalt)", maxWidth: "70ch" }}
                    >
                      Направление молодое: часть работ идёт под соглашениями
                      о конфиденциальности и пока не может быть показана,
                      первые внедрения в работе. Мы предпочитаем сказать это
                      прямо, а не заполнять раздел проработками, выдавая их
                      за сданные проекты. Как мы подходим к задаче —{" "}
                      <Link
                        href="/diagnostika"
                        className="text-[var(--cobalt)] hover:underline underline-offset-2"
                      >
                        на странице диагностики
                      </Link>
                      .
                    </p>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
                    {items.map((c, i) => (
                      <CaseCard key={c.id} c={c} i={i} />
                    ))}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </section>

      {/* CTA */}
      <section style={{ paddingTop: "var(--s-9)", paddingBottom: "var(--s-9)" }}>
        <div
          className="mx-auto px-5 md:px-8 grid lg:grid-cols-[1fr_auto] gap-8 items-center"
          style={{ maxWidth: "var(--content-max)" }}
        >
          <div>
            <h2
              className="display mb-3"
              style={{
                fontSize: "clamp(1.7rem, 3.2vw, 2.6rem)",
                lineHeight: 1.1,
                letterSpacing: "-0.022em",
                animation: "none",
              }}
            >
              Не нашли похожий проект?{" "}
              <span className="studio-accent">
                Расскажите о задаче.
              </span>
            </h2>
            <p className="text-[var(--ink-2)] leading-[1.6] max-w-[54ch]" style={{ fontSize: "15px" }}>
              Сорок минут разговора обычно дают больше, чем час изучения
              чужого портфолио.
            </p>
          </div>
          <CtaLink
            href="/razbor"
            goalName="razbor_cta"
            goalParams={{ place: "cases" }}
            className="shrink-0 px-7 py-3.5 bg-[var(--ink)] text-[var(--paper)] text-[14px] font-medium rounded-full hover:bg-[var(--cobalt)] transition-colors inline-flex items-center gap-2"
          >
            Разобрать процесс <span aria-hidden>→</span>
          </CtaLink>
        </div>
      </section>
    </>
  )
}
