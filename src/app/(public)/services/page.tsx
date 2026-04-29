import type { Metadata } from "next"
import Link from "next/link"
import JsonLd from "@/components/JsonLd"
import {
  SITE_URL,
  breadcrumbListSchema,
  collectionPageSchema,
} from "@/lib/seo"

const PAGE_URL = `${SITE_URL}/services`

export const metadata: Metadata = {
  title: "Услуги студии — AI, видео и интерактив для B2B",
  description:
    "AI-автоматизация, корпоративные фильмы, выставочные стенды, цифровые двойники, AI-ассистенты, контент-системы и mini apps. Один бриф, одна команда.",
  alternates: { canonical: "/services" },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Услуги — Veretennikov Studio",
    description:
      "AI-разработка, корпоративный видеопродакшн и интерактивные системы для B2B и промышленных компаний.",
    siteName: "Veretennikov Studio",
    locale: "ru_RU",
  },
}

const PILLARS = [
  {
    n: "01",
    title: "AI-разработка",
    body:
      "Проектируем и собираем инструменты, которые встраиваются в работу компании: обработка заявок, разбор документов, помощь менеджерам, поиск по базе знаний, скоринг и автоматизация рутины.",
  },
  {
    n: "02",
    title: "Видеопродакшн",
    body:
      "Снимаем корпоративные фильмы, презентационные ролики, продуктовые видео и контент для выставок. Сценарий, съёмка, монтаж, VFX, 3D и инфографика — внутри одной производственной логики.",
  },
  {
    n: "03",
    title: "Интерактив и визуальные системы",
    body:
      "Делаем мультимедийные стенды, mini apps, визуальные цифровые двойники, интерактивные презентации и игровые промо-инструменты для продаж, обучения и демонстрации сложных продуктов.",
  },
]

interface Product {
  n: string
  href?: string
  status: "ready" | "soon"
  category: "Аудит" | "Видео" | "AI" | "Интерактив" | "Контент"
  title: string
  body: string
  meta?: string
}

const PRODUCTS: Product[] = [
  {
    n: "01",
    href: "/audit",
    status: "ready",
    category: "Аудит",
    title: "AI & Visual Audit",
    body:
      "Аудит коммуникаций компании: сайт, видео, презентации, выставочные материалы и AI-возможности. На выходе — карта улучшений и план внедрения.",
    meta: "1–2 недели",
  },
  {
    n: "02",
    href: "/services/industrial-video",
    status: "ready",
    category: "Видео",
    title: "Industrial Story Film",
    body:
      "Презентационные и корпоративные фильмы для заводов, производств, IT и B2B-компаний. Сценарий, съёмка, VFX, 3D и инфографика.",
    meta: "7–14 недель",
  },
  {
    n: "03",
    href: "/services/ai-automation",
    status: "ready",
    category: "AI",
    title: "AI Automation",
    body:
      "AI-инструменты для бизнес-процессов: обработка заявок, разбор документов, помощь менеджерам, поиск по базе знаний и автоматизация рутины.",
    meta: "от 4 недель",
  },
  {
    n: "04",
    href: "/services/expo-stand",
    status: "ready",
    category: "Интерактив",
    title: "Expo Stand 4.0",
    body:
      "Интерактивный выставочный стенд: синхронные экраны, планшеты, AI-консультант, mini app, сбор заявок и отчёт после мероприятия.",
    meta: "6–12 недель",
  },
  {
    n: "05",
    href: "/services/digital-twin-visualization",
    status: "ready",
    category: "Интерактив",
    title: "Visual Digital Twin Lite",
    body:
      "Визуальный цифровой двойник для презентаций и обучения: 3D/2.5D-модель процесса, объекта или системы. Не тяжёлый инженерный twin — понятная визуальная модель.",
    meta: "6–12 недель",
  },
  {
    n: "06",
    href: "/services/ai-sales-assistant",
    status: "ready",
    category: "AI",
    title: "AI Sales & Knowledge Assistant",
    body:
      "AI-ассистент, который знает продукты, документы и FAQ компании. Для сайта, отдела продаж или выставочного стенда.",
    meta: "4–10 недель",
  },
  {
    n: "07",
    href: "/services/b2b-content-engine",
    status: "ready",
    category: "Контент",
    title: "B2B Content Engine",
    body:
      "Регулярная система видео, кейсов, экспертных материалов и визуального контента для сложных B2B-компаний. Ежемесячный план и производство.",
    meta: "Ежемесячный цикл",
  },
  {
    n: "08",
    status: "soon",
    category: "Интерактив",
    title: "Mini Apps & Brand Games",
    body:
      "Мини-приложения, Telegram WebApp, интерактивные калькуляторы и брендированные игры для сайтов, выставок, HR и обучения.",
    meta: "В подготовке",
  },
]

const AUDIENCE = [
  "Промышленные предприятия",
  "Производители оборудования",
  "IT и B2B-сервисы",
  "Инженерные компании",
  "Участники выставок и форумов",
  "Ассоциации и отраслевые союзы",
  "Образовательные и медицинские проекты",
  "Компании, внедряющие цифровизацию",
]

export default function ServicesPage() {
  const jsonLd = [
    breadcrumbListSchema([
      { name: "Главная", url: SITE_URL },
      { name: "Услуги", url: PAGE_URL },
    ]),
    collectionPageSchema({
      url: PAGE_URL,
      name: "Услуги студии",
      description:
        "AI-автоматизация, корпоративный видеопродакшн и интерактивные системы для B2B-компаний.",
      itemsCount: PRODUCTS.length,
    }),
  ]

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* ── Header ───────────────────────────────────────────────── */}
      <section className="border-b border-[var(--rule)]">
        <div
          className="mx-auto px-5 md:px-8"
          style={{ maxWidth: "var(--content-max)" }}
        >
          <div className="grid grid-cols-3 gap-4 pt-5 border-b border-[var(--rule)] pb-5">
            <span className="eyebrow">Services · Index</span>
            <span className="eyebrow text-center hidden md:block">
              Studio Quarterly
            </span>
            <span className="eyebrow text-right">{PRODUCTS.length} продуктов</span>
          </div>

          <div className="pt-20 pb-12">
            <p className="eyebrow mb-7">Что мы делаем</p>
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
              Один бриф. Одна команда.{" "}
              <span style={{ color: "var(--ink-3)", fontStyle: "italic" }}>
                Система и история.
              </span>
            </h1>

            <p
              className="text-[var(--ink-2)] leading-[1.7] max-w-[680px] mb-10"
              style={{ fontSize: "clamp(1rem, 1.2vw, 1.1rem)" }}
            >
              Мы не делаем видео и разработку как отдельные услуги. Мы строим
              решения под бизнес-задачу: AI-инструмент, корпоративный фильм,
              интерактивный стенд, цифровой двойник или их комбинацию — в рамках
              одного проекта, с одной командой, без субподряда на ключевых ролях.
            </p>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <Link
                href="/brief"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[var(--ink)] text-[var(--paper)] text-[14px] font-medium rounded-full hover:bg-black transition-colors"
                style={{ transitionDuration: "220ms" }}
              >
                Обсудить задачу
                <span>→</span>
              </Link>
              <Link
                href="/audit"
                className="inline-flex items-center px-7 py-3.5 border border-[var(--ink-3)] text-[var(--ink)] text-[14px] rounded-full hover:bg-[var(--paper-1)] transition-colors"
              >
                Не уверены — начните с аудита
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Three pillars ────────────────────────────────────────── */}
      <section
        className="border-b border-[var(--rule)] bg-[var(--paper-1)]"
        style={{ paddingTop: "var(--s-9)", paddingBottom: "var(--s-9)" }}
      >
        <div
          className="mx-auto px-5 md:px-8"
          style={{ maxWidth: "var(--content-max)" }}
        >
          <p className="eyebrow mb-10">Направления · 02</p>

          <div className="grid lg:grid-cols-3 gap-px bg-[var(--rule)] border border-[var(--rule)]">
            {PILLARS.map((p) => (
              <div
                key={p.n}
                className="bg-[var(--paper-1)] p-7 lg:p-9"
              >
                <div
                  className="font-mono leading-none mb-5"
                  style={{ fontSize: "48px", color: "var(--ink-4)" }}
                >
                  {p.n}
                </div>
                <h3
                  className="display mb-3"
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 500,
                    letterSpacing: "-0.018em",
                    lineHeight: 1.15,
                    animation: "none",
                  }}
                >
                  {p.title}
                </h3>
                <p
                  className="text-[var(--ink-2)] leading-[1.65]"
                  style={{ fontSize: "14px" }}
                >
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Product list ─────────────────────────────────────────── */}
      <section
        className="border-b border-[var(--rule)]"
        style={{ paddingTop: "var(--s-9)", paddingBottom: "var(--s-9)" }}
      >
        <div
          className="mx-auto px-5 md:px-8"
          style={{ maxWidth: "var(--content-max)" }}
        >
          <div className="flex justify-between items-baseline mb-12 flex-wrap gap-4">
            <div>
              <p className="eyebrow mb-3">Продукты · 03</p>
              <h2
                className="display"
                style={{
                  fontSize: "clamp(1.8rem, 3.2vw, 2.6rem)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                  animation: "none",
                }}
              >
                Восемь продуктов{" "}
                <span style={{ color: "var(--ink-3)", fontStyle: "italic" }}>
                  под разные задачи.
                </span>
              </h2>
            </div>
            <span className="eyebrow">7 готовы · 1 в подготовке</span>
          </div>

          <div className="flex flex-col">
            {PRODUCTS.map((p, i) => {
              const isReady = p.status === "ready"
              const Wrapper = ({ children }: { children: React.ReactNode }) =>
                isReady && p.href ? (
                  <Link
                    href={p.href}
                    className="group block border-t border-[var(--rule)] last:border-b py-9 hover:bg-[var(--paper-1)] transition-colors"
                    style={{ transitionDuration: "220ms" }}
                  >
                    {children}
                  </Link>
                ) : (
                  <div className="border-t border-[var(--rule)] last:border-b py-9 opacity-70">
                    {children}
                  </div>
                )

              return (
                <Wrapper key={p.n}>
                  <div className="grid grid-cols-1 lg:grid-cols-[80px_180px_1fr_180px] gap-y-3 lg:gap-x-8 lg:items-baseline">
                    <span
                      className="font-mono leading-none"
                      style={{
                        fontSize: "32px",
                        color: isReady ? "var(--cobalt)" : "var(--ink-4)",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {p.n}
                    </span>

                    <div>
                      <p
                        className="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--ink-3)] mb-2"
                      >
                        {p.category}
                      </p>
                      <h3
                        className="display"
                        style={{
                          fontSize: "clamp(1.15rem, 1.6vw, 1.4rem)",
                          fontWeight: 500,
                          letterSpacing: "-0.018em",
                          lineHeight: 1.15,
                          color: isReady ? "var(--ink)" : "var(--ink-2)",
                          animation: "none",
                        }}
                      >
                        {isReady ? (
                          <span className="group-hover:text-[var(--cobalt)] transition-colors">
                            {p.title}
                          </span>
                        ) : (
                          p.title
                        )}
                      </h3>
                    </div>

                    <p
                      className="text-[var(--ink-2)] leading-[1.65]"
                      style={{ fontSize: "14.5px" }}
                    >
                      {p.body}
                    </p>

                    <div className="lg:text-right">
                      <p
                        className="font-mono text-[var(--ink-3)] mb-2"
                        style={{
                          fontSize: "11px",
                          letterSpacing: "0.04em",
                        }}
                      >
                        {p.meta}
                      </p>
                      {isReady && (
                        <span
                          className="font-mono text-[var(--ink-3)] group-hover:text-[var(--cobalt)] transition-colors"
                          style={{
                            fontSize: "12px",
                            letterSpacing: "0.06em",
                          }}
                        >
                          Подробнее →
                        </span>
                      )}
                    </div>
                  </div>
                </Wrapper>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Audience ─────────────────────────────────────────────── */}
      <section
        className="border-b border-[var(--rule)] bg-[var(--paper-1)]"
        style={{ paddingTop: "var(--s-9)", paddingBottom: "var(--s-9)" }}
      >
        <div
          className="mx-auto px-5 md:px-8"
          style={{ maxWidth: "var(--content-max)" }}
        >
          <div className="grid lg:grid-cols-[280px_1fr] gap-12 lg:gap-20">
            <div>
              <p className="eyebrow mb-6">Для кого · 04</p>
              <h2
                className="display"
                style={{
                  fontSize: "clamp(1.8rem, 3.2vw, 2.6rem)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                  animation: "none",
                }}
              >
                Работаем с теми,{" "}
                <span style={{ color: "var(--ink-3)", fontStyle: "italic" }}>
                  кому нужно объяснять сложное.
                </span>
              </h2>
            </div>
            <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3 lg:pt-3">
              {AUDIENCE.map((a) => (
                <li
                  key={a}
                  className="flex items-baseline gap-3 py-2 border-t border-[var(--rule)]"
                >
                  <span className="block w-1 h-1 rounded-full bg-[var(--cobalt)] mt-2 shrink-0" />
                  <span
                    className="text-[var(--ink-2)]"
                    style={{ fontSize: "14px", lineHeight: 1.55 }}
                  >
                    {a}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Why this works (ink inversion) ───────────────────────── */}
      <section
        style={{
          background: "var(--ink)",
          color: "var(--paper)",
          paddingTop: "var(--s-10)",
          paddingBottom: "var(--s-10)",
        }}
      >
        <div
          className="mx-auto px-5 md:px-8"
          style={{ maxWidth: "var(--content-max)" }}
        >
          <p
            className="font-mono mb-8"
            style={{
              fontSize: "11px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "oklch(70% 0.02 75)",
            }}
          >
            Принцип · 05
          </p>
          <h2
            className="display mb-10"
            style={{
              fontSize: "clamp(2rem, 4.5vw, 4rem)",
              lineHeight: 1.04,
              letterSpacing: "-0.025em",
              fontVariationSettings: '"opsz" 60',
              color: "var(--paper)",
              maxWidth: "900px",
              animation: "none",
            }}
          >
            Сложным продуктам нужен{" "}
            <span style={{ fontStyle: "italic", color: "oklch(70% 0.02 75)" }}>
              не один формат,
            </span>{" "}
            а <span style={{ color: "var(--cobalt-tint)" }}>система.</span>
          </h2>

          <p
            className="leading-[1.75] max-w-[720px]"
            style={{
              fontSize: "clamp(1rem, 1.2vw, 1.15rem)",
              color: "oklch(85% 0.02 75)",
            }}
          >
            Презентация устаревает за месяц. Ролик без логики не объясняет продукт.
            AI-бот без контекста не помогает продажам. Интерактив без сценария
            превращается в игрушку. Мы соединяем форматы в систему: сначала
            разбираемся в задаче, потом проектируем сценарий, визуальный язык,
            механику взаимодействия — и только потом производим инструмент или
            контент.
          </p>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section
        style={{ paddingTop: "var(--s-10)", paddingBottom: "var(--s-10)" }}
      >
        <div
          className="mx-auto px-5 md:px-8 grid lg:grid-cols-[1fr_auto] gap-10 items-end"
          style={{ maxWidth: "var(--content-max)" }}
        >
          <div>
            <h2
              className="display mb-4"
              style={{
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
                lineHeight: 1,
                letterSpacing: "-0.025em",
                fontVariationSettings: '"opsz" 60',
                animation: "none",
              }}
            >
              Узнали свою задачу{" "}
              <span style={{ color: "var(--cobalt)" }}>в этом списке?</span>
            </h2>
            <p
              className="text-[var(--ink-2)] leading-[1.6] max-w-[560px]"
              style={{ fontSize: "15px" }}
            >
              Заполните бриф — отвечу лично в течение рабочего дня и предложу
              формат решения. Если не уверены, что именно нужно — начните с аудита.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <Link
              href="/brief"
              className="text-center px-7 py-4 bg-[var(--ink)] text-[var(--paper)] font-medium rounded-full hover:bg-black transition-colors"
              style={{ fontSize: "14px" }}
            >
              Заполнить бриф →
            </Link>
            <Link
              href="/audit"
              className="text-center px-7 py-4 border border-[var(--ink-3)] text-[var(--ink)] rounded-full hover:bg-[var(--paper-1)] transition-colors"
              style={{ fontSize: "14px" }}
            >
              Начать с аудита
            </Link>
            <p
              className="text-center font-mono text-[var(--ink-3)]"
              style={{
                fontSize: "11px",
                letterSpacing: "0.04em",
                marginTop: "8px",
              }}
            >
              Ответ в течение рабочего дня · NDA до брифа
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
