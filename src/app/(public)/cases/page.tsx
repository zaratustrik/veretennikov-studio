import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { prisma } from "@/lib/db"
import FallbackPoster from "@/components/public/FallbackPoster"
import JsonLd from "@/components/JsonLd"
import { SITE_URL, breadcrumbListSchema, collectionPageSchema } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Работа",
  description:
    "Корпоративные фильмы, презентационные ролики, событийные проекты. Сданные работы Veretennikov Studio для государственных и частных клиентов.",
  alternates: { canonical: "/cases" },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/cases`,
    title: "Работа — Veretennikov Studio",
    description:
      "Корпоративные фильмы и презентационные ролики студии Анатолия Веретенникова.",
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

export default async function CasesPage() {
  const cases = await prisma.case.findMany({
    where: { isPublic: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  })

  const jsonLd = [
    breadcrumbListSchema([
      { name: "Главная", url: SITE_URL },
      { name: "Работы", url: `${SITE_URL}/cases` },
    ]),
    collectionPageSchema({
      url: `${SITE_URL}/cases`,
      name: "Работы Veretennikov Studio",
      description: "Сданные видео-проекты студии — корпоративные фильмы, презентационные ролики, событийные ролики.",
      itemsCount: cases.length,
    }),
  ]

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* ── Header ───────────────────────────────────────────────── */}
      <section className="border-b border-[var(--rule)]">
        <div className="mx-auto px-5 md:px-8" style={{ maxWidth: "var(--content-max)" }}>
          {/* Mono masthead */}
          <div className="grid grid-cols-3 gap-4 pt-5 border-b border-[var(--rule)] pb-5">
            <span className="eyebrow">Index № 02</span>
            <span className="eyebrow text-center hidden md:block">Studio Quarterly</span>
            <span className="eyebrow text-right">{cases.length} проектов</span>
          </div>

          <div className="pt-20 pb-12">
            <p className="eyebrow mb-7">Работа · Видеопродакшн</p>
            <h1
              className="display"
              style={{
                fontSize: "clamp(2.25rem, 4.6vw, 4.25rem)",
                lineHeight: 1.04,
                letterSpacing: "-0.025em",
                fontVariationSettings: '"opsz" 48',
                marginBottom: "24px",
                animation: "none",
              }}
            >
              Корпоративные фильмы,{" "}
              <span style={{ color: "var(--ink-3)", fontStyle: "italic" }}>презентации,</span>
              <br />
              событийные ролики.
            </h1>
            <p
              className="text-[var(--ink-2)] leading-[1.7] max-w-[640px]"
              style={{ fontSize: "clamp(1rem, 1.2vw, 1.1rem)" }}
            >
              Здесь — сданные проекты. Кейсы по AI-разработке и синтезу появятся позже,
              <span className="text-[var(--ink-3)]"> когда мы будем готовы рассказать о них целиком.</span>
            </p>
          </div>
        </div>
      </section>

      {/* ── Grid ─────────────────────────────────────────────────── */}
      <section
        className="border-b border-[var(--rule)]"
        style={{ paddingTop: "var(--s-7)", paddingBottom: "var(--s-9)" }}
      >
        <div className="mx-auto px-5 md:px-8" style={{ maxWidth: "var(--content-max)" }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
            {cases.map((c, i) => {
              const idx = String(i + 1).padStart(2, "0")
              const dur = formatDuration(c.duration)

              return (
                <Link
                  key={c.id}
                  href={`/show/${c.slug}`}
                  className="scroll-reveal group block"
                  style={{ animationDelay: `${(i % 9) * 50}ms` }}
                >
                  {/* Thumbnail */}
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

                    {/* Index — top-left mono */}
                    <span
                      className="absolute top-3 left-3 font-mono text-[10px] tracking-[0.12em] text-white px-2 py-1"
                      style={{ background: "rgba(15, 26, 46, 0.65)", backdropFilter: "blur(8px)" }}
                    >
                      {idx}
                    </span>

                    {/* Duration — bottom-right */}
                    {dur && (
                      <span
                        className="absolute bottom-3 right-3 font-mono text-[10px] tracking-[0.06em] text-white px-2 py-1"
                        style={{ background: "rgba(15, 26, 46, 0.65)", backdropFilter: "blur(8px)" }}
                      >
                        ▸ {dur}
                      </span>
                    )}

                    {/* Cobalt overlay on hover */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{ boxShadow: "inset 0 0 0 1px var(--cobalt)" }}
                    />
                  </div>

                  {/* Meta */}
                  <div>
                    {c.client ? (
                      <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--ink-3)] mb-2 group-hover:text-[var(--cobalt)] transition-colors">
                        {c.client}
                      </p>
                    ) : (
                      <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--ink-4)] mb-2">
                        —
                      </p>
                    )}

                    <h3
                      className="display text-[var(--ink)]"
                      style={{
                        fontSize: "clamp(1rem, 1.3vw, 1.15rem)",
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
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section style={{ paddingTop: "var(--s-9)", paddingBottom: "var(--s-9)" }}>
        <div
          className="mx-auto px-5 md:px-8 grid lg:grid-cols-[1fr_auto] gap-10 items-center"
          style={{ maxWidth: "var(--content-max)" }}
        >
          <div>
            <h2
              className="display mb-3"
              style={{
                fontSize: "clamp(1.8rem, 3.2vw, 2.8rem)",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                animation: "none",
              }}
            >
              Не нашли похожий проект?{" "}
              <span style={{ color: "var(--ink-3)" }}>Расскажите о задаче.</span>
            </h2>
            <p className="text-[var(--ink-2)] text-[15px] leading-[1.6]">
              Анатолий ответит лично в течение рабочего дня.
            </p>
          </div>
          <Link
            href="/contact"
            className="shrink-0 px-7 py-3.5 bg-[var(--ink)] text-[var(--paper)] text-[14px] font-medium rounded-full hover:bg-black transition-colors inline-flex items-center gap-2"
          >
            Написать <span>→</span>
          </Link>
        </div>
      </section>
    </>
  )
}
