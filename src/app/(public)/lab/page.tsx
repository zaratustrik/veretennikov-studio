import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { prisma } from "@/lib/db"
import FallbackPoster from "@/components/public/FallbackPoster"
import JsonLd from "@/components/JsonLd"
import { SITE_URL, breadcrumbListSchema, collectionPageSchema } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Лаборатория эмерджентности",
  description:
    "Серия экспериментов студии: интерактивные симуляции, в которых из нескольких простых правил рождается поведение, которое никто не задавал. Личные работы Veretennikov Studio.",
  alternates: { canonical: "/lab" },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/lab`,
    title: "Лаборатория эмерджентности — Veretennikov Studio",
    description:
      "Простые правила → бесконечность поведений. Серия интерактивных симуляций студии Анатолия Веретенникова.",
    siteName: "Veretennikov Studio",
    locale: "ru_RU",
  },
}

export default async function LabPage() {
  const games = await prisma.case.findMany({
    where: { isPublic: true, type: "GAME" },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  })

  const jsonLd = [
    breadcrumbListSchema([
      { name: "Главная", url: SITE_URL },
      { name: "Лаборатория", url: `${SITE_URL}/lab` },
    ]),
    collectionPageSchema({
      url: `${SITE_URL}/lab`,
      name: "Лаборатория эмерджентности",
      description:
        "Серия интерактивных симуляций студии. Простые правила, сложное поведение.",
      itemsCount: games.length,
    }),
  ]

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* ── Header ─────────────────────────────────────────────── */}
      <section className="border-b border-[var(--rule)]">
        <div
          className="mx-auto px-5 md:px-8"
          style={{ maxWidth: "var(--content-max)" }}
        >
          <div className="grid grid-cols-3 gap-4 pt-5 border-b border-[var(--rule)] pb-5">
            <span className="eyebrow">Index № 03</span>
            <span className="eyebrow text-center hidden md:block">Эмерджентность</span>
            <span className="eyebrow text-right">
              {games.length} {games.length === 1 ? "эксперимент" : games.length < 5 ? "эксперимента" : "экспериментов"}
            </span>
          </div>

          <div className="pt-20 pb-12">
            <p className="eyebrow mb-7">Лаборатория</p>
            <h1
              className="display"
              style={{
                fontSize: "clamp(2.25rem, 4.6vw, 4.25rem)",
                lineHeight: 1.04,
                letterSpacing: "-0.025em",
                fontVariationSettings: '"opsz" 60',
                marginBottom: "32px",
                animation: "none",
              }}
            >
              Простые правила.{" "}
              <span style={{ color: "var(--ink-3)", fontStyle: "italic" }}>
                Поведение, которого никто не задавал.
              </span>
            </h1>

            <div
              className="text-[var(--ink-2)] leading-[1.7] max-w-[680px] space-y-5"
              style={{ fontSize: "clamp(1rem, 1.2vw, 1.1rem)" }}
            >
              <p>
                Эмерджентность — когда несколько простых правил применяются ко множеству
                одновременных взаимодействий, и из них вырастает поведение, которого никто
                не закладывал. Конвей не предсказывал глайдеры. Биологи не описывают каждую
                рыбу в косяке отдельно — они задают три правила и получают форму косяка.
              </p>
              <p className="text-[var(--ink-3)]">
                Этот раздел — личные эксперименты студии. Каждый из них — короткий ответ на
                один и тот же вопрос: что ещё можно получить из набора правил, который умещается
                в одну строчку?
              </p>
              <p className="text-[var(--ink-3)]">
                Связь с тем, что мы делаем по работе, прямая. Бизнес-процесс — это система,
                где много участников действуют по простым правилам и порождают поведение,
                которое нельзя описать через одного сотрудника. AI-системы для крупных компаний
                строятся на том же принципе. Здесь та же материя, разобранная в её самой
                чистой форме.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Grid ───────────────────────────────────────────────── */}
      <section
        className="border-b border-[var(--rule)]"
        style={{ paddingTop: "var(--s-7)", paddingBottom: "var(--s-9)" }}
      >
        <div
          className="mx-auto px-5 md:px-8"
          style={{ maxWidth: "var(--content-max)" }}
        >
          {games.length === 0 ? (
            <p
              className="text-center text-[var(--ink-3)] py-16"
              style={{ fontSize: "14px" }}
            >
              Эксперименты появятся здесь.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-12">
              {games.map((g, i) => {
                const idx = String(i + 1).padStart(2, "0")
                return (
                  <Link
                    key={g.id}
                    href={`/show/${g.slug}`}
                    className="group block"
                  >
                    <div
                      className="relative w-full overflow-hidden bg-[var(--paper-2)] mb-4"
                      style={{ aspectRatio: "2 / 1", borderRadius: 2 }}
                    >
                      {g.posterUrl ? (
                        <Image
                          src={g.posterUrl}
                          alt={g.title}
                          fill
                          sizes="(min-width: 768px) 50vw, 100vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                        />
                      ) : (
                        <FallbackPoster
                          client={g.client}
                          title={g.title}
                          year={g.year}
                          index={i + 1}
                          type={g.type}
                        />
                      )}
                      <span
                        className="absolute top-3 left-3 font-mono text-[10px] tracking-[0.12em] text-white px-2 py-1"
                        style={{
                          background: "rgba(15, 26, 46, 0.65)",
                          backdropFilter: "blur(8px)",
                        }}
                      >
                        {idx}
                      </span>
                      <span
                        className="absolute bottom-3 right-3 font-mono text-[10px] tracking-[0.18em] uppercase text-white px-2 py-1"
                        style={{
                          background: "rgba(31, 77, 222, 0.85)",
                          backdropFilter: "blur(8px)",
                        }}
                      >
                        Игра
                      </span>
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                        style={{ boxShadow: "inset 0 0 0 1px var(--cobalt)" }}
                      />
                    </div>

                    <div>
                      <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--ink-3)] mb-2 group-hover:text-[var(--cobalt)] transition-colors">
                        {g.client}
                      </p>
                      <h3
                        className="display text-[var(--ink)]"
                        style={{
                          fontSize: "clamp(1.1rem, 1.5vw, 1.35rem)",
                          lineHeight: 1.25,
                          letterSpacing: "-0.012em",
                          animation: "none",
                        }}
                      >
                        {g.title}
                      </h3>
                      {g.description && (
                        <p
                          className="text-[var(--ink-3)] leading-[1.55] mt-2 line-clamp-3"
                          style={{ fontSize: "13px" }}
                        >
                          {g.description}
                        </p>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────── */}
      <section
        style={{ paddingTop: "var(--s-9)", paddingBottom: "var(--s-9)" }}
      >
        <div
          className="mx-auto px-5 md:px-8 grid lg:grid-cols-[1fr_auto] gap-10 items-center"
          style={{ maxWidth: "var(--content-max)" }}
        >
          <div>
            <h2
              className="display mb-3"
              style={{
                fontSize: "clamp(1.6rem, 2.8vw, 2.4rem)",
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
                animation: "none",
              }}
            >
              Эмерджентность в вашем процессе?{" "}
              <span style={{ color: "var(--ink-3)" }}>Обсудим.</span>
            </h2>
            <p className="text-[var(--ink-3)] text-[14px]">
              Те же принципы — в AI-системах для бизнеса.
            </p>
          </div>
          <Link
            href="/contact"
            className="px-7 py-3.5 bg-[var(--ink)] text-[var(--paper)] text-[14px] font-medium rounded-full hover:bg-black transition-colors inline-flex items-center gap-2"
          >
            Написать <span>→</span>
          </Link>
        </div>
      </section>
    </>
  )
}
