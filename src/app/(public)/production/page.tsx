import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { prisma } from "@/lib/db"
import JsonLd from "@/components/JsonLd"
import CtaLink from "@/components/public/CtaLink"
import FallbackPoster from "@/components/public/FallbackPoster"
import { SITE_URL, breadcrumbListSchema, faqPageSchema, serviceSchema } from "@/lib/seo"

export const revalidate = 600

export const metadata: Metadata = {
  title: "Промышленное видео, 3D и интерактив",
  description:
    "Промышленные и корпоративные фильмы, 3D-визуализация оборудования, анимация технологических процессов, VFX, интерактивные модели и выставочные решения. 12 лет, десятки проектов для промышленности.",
  alternates: { canonical: "/production" },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/production`,
    title: "Промышленное видео, 3D и интерактив — Veretennikov Studio",
    description:
      "Визуально объясняем сложные продукты, технологии и процессы. Промышленные фильмы, 3D оборудования, анимация процессов, интерактив.",
    siteName: "Veretennikov Studio",
    locale: "ru_RU",
  },
}

/** Витрина направления — только промышленные и продуктовые работы. */
const SHOWCASE = [
  "belojarskaya-aes",
  "9vn3wPsEmvYiF3VibYT6ha", // Парогенератор ПГм-15, 3D техпроцесса
  "tarket",
  "8wjNKW31ftL3rGpAq2xCYu", // Технэкс
  "6YA7dyiF3th9v3tRTcKu77", // Промэлектроника
  "rostelekom",
]

const FORMATS = [
  {
    title: "Промышленный и корпоративный фильм",
    body:
      "Съёмка на действующем производстве, включая технологические зоны с их режимом и ограничениями. Сценарий, режиссура, интервью, монтаж, звук.",
    href: "/services/industrial-video",
  },
  {
    title: "3D-визуализация оборудования",
    body:
      "Как устроена машина внутри и как она работает. Разрезы, сборка-разборка, принцип действия — то, что невозможно снять камерой.",
    href: "/services/digital-twin-visualization",
  },
  {
    title: "Анимация технологических процессов",
    body:
      "Движение среды, химия, тепло, потоки, логистика внутри цеха. Инфографика поверх реальных съёмок или полностью синтетическая сцена.",
    href: "/services/digital-twin-visualization",
  },
  {
    title: "VFX и motion",
    body:
      "Графика, заставки, титры, композитинг, чистка кадра. Уровень, привычный федеральным заказчикам.",
    href: "/services/industrial-video",
  },
  {
    title: "Интерактивные модели и стенды",
    body:
      "Выставочные решения, синхронные экраны, интерактивные схемы производства, мини-приложения для мероприятий.",
    href: "/services/expo-stand",
  },
  {
    title: "Digital-презентации и project rooms",
    body:
      "Закрытые веб-презентации для переговоров и комиссий: страница вместо PDF, с навигацией, режимом показа и понятной структурой.",
    href: "/services/mini-apps-games",
  },
]

const STAGES = [
  ["01", "Задача", "Разбираем, кто принимает решение, в какой момент и чего ему не хватает. Формат выбирается после этого, а не до.", "2–3 дня"],
  ["02", "Сценарий и смета", "Структура, раскадровка ключевых сцен, точная смета. Точка возврата без обязательств.", "1–2 недели"],
  ["03", "Производство", "Съёмка, 3D, анимация, монтаж. Демонстрация промежуточных результатов каждые две недели.", "4–10 недель"],
  ["04", "Сдача", "Финальные мастера в нужных форматах, исходники по договорённости, версии под площадки.", "1 неделя"],
]

const FAQ = [
  {
    question: "Снимаете на действующем производстве?",
    answer:
      "Да, это основная часть нашей работы: съёмки в цехах и технологических зонах, включая объекты с пропускным режимом и требованиями по безопасности. Согласование съёмки и инструктаж — часть подготовки.",
  },
  {
    question: "Что выбрать — съёмку или 3D?",
    answer:
      "Зависит от того, что нужно показать. Масштаб производства, людей и реальность — снимаем. Внутреннее устройство, принцип работы, невидимые процессы — 3D. Чаще всего работает сочетание, и мы предлагаем его на этапе сценария.",
  },
  {
    question: "Сколько стоит промышленный фильм?",
    answer:
      "Разброс большой: он зависит от числа съёмочных дней, локаций, объёма 3D и графики. Вилку называем после короткого разговора о задаче, точную сумму фиксируем в смете после сценария — дальше она не меняется.",
  },
  {
    question: "Вы работаете по 44-ФЗ и 223-ФЗ?",
    answer:
      "Да, опыт участия в государственных закупках с 2014 года. Формы и документы согласуем заранее.",
  },
  {
    question: "Кто делает работу — штат или подрядчики?",
    answer:
      "Постановку задачи, сценарий и ответственность за результат ведёт ядро студии. Под проект собирается состав из профильных специалистов: операторы, 3D, монтаж, звук, графика. Мы не передаём проект целиком на субподряд.",
  },
]

function formatDuration(seconds: number | null): string {
  if (!seconds) return ""
  const m = Math.floor(seconds / 60)
  const s = String(seconds % 60).padStart(2, "0")
  return `${m}:${s}`
}

export default async function ProductionPage() {
  const [showcaseRaw, videoCount] = await Promise.all([
    prisma.case.findMany({ where: { isPublic: true, slug: { in: SHOWCASE } } }),
    prisma.case.count({ where: { isPublic: true, type: "VIDEO" } }),
  ])

  const showcase = SHOWCASE.map((s) => showcaseRaw.find((c) => c.slug === s)).filter(
    (c): c is (typeof showcaseRaw)[number] => Boolean(c)
  )

  const jsonLd = [
    breadcrumbListSchema([
      { name: "Главная", url: SITE_URL },
      { name: "Промышленное видео, 3D и интерактив", url: `${SITE_URL}/production` },
    ]),
    serviceSchema({
      name: "Промышленное видео, 3D-визуализация и интерактив",
      description:
        "Промышленные и корпоративные фильмы, 3D-визуализация оборудования, анимация технологических процессов, VFX, интерактивные модели и выставочные решения.",
      url: `${SITE_URL}/production`,
      serviceType: "Видеопродакшн, 3D-визуализация и интерактивные решения для промышленности",
    }),
    faqPageSchema(FAQ),
  ]

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* Hero — собственный, не производный от главной */}
      <section className="border-b border-[var(--rule)]">
        <div className="mx-auto px-5 md:px-8" style={{ maxWidth: "var(--content-max)" }}>
          <div className="pt-12 md:pt-16 pb-11">
            <p className="eyebrow mb-6">Направление · производство визуального контента</p>
            <h1
              className="display"
              style={{
                fontSize: "clamp(1.95rem, 4.4vw, 3.9rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.026em",
                fontVariationSettings: '"opsz" 48',
                marginBottom: "20px",
                maxWidth: "20ch",
                animation: "none",
              }}
            >
              Промышленное видео, 3D и интерактив.{" "}
              <span style={{ color: "var(--ink-3)", fontStyle: "italic" }}>
                Объясняем сложное так, чтобы поняли.
              </span>
            </h1>
            <p
              className="text-[var(--ink-2)] leading-[1.7]"
              style={{ fontSize: "clamp(1rem, 1.2vw, 1.12rem)", maxWidth: "62ch" }}
            >
              Оборудование, технологию или производственный процесс трудно
              продать словами. Мы делаем фильмы, 3D-модели и интерактив,
              которые показывают, как оно устроено и почему это работает —
              для заказчиков, комиссий, выставок и обучения.
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-9">
              <CtaLink
                href="/brief?source=production"
                goalName="production_cta"
                goalParams={{ place: "hero" }}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[var(--ink)] text-[var(--paper)] text-[14px] font-medium rounded-full hover:bg-[var(--cobalt)] transition-colors"
              >
                Обсудить задачу и получить смету
                <span aria-hidden>→</span>
              </CtaLink>
              <Link
                href="/cases"
                className="inline-flex items-center px-7 py-3.5 border border-[var(--ink-3)] text-[var(--ink)] text-[14px] rounded-full hover:bg-[var(--paper-1)] transition-colors"
              >
                Смотреть работы ({videoCount})
              </Link>
            </div>

            <p className="mt-7 text-[var(--ink-3)] leading-[1.55]" style={{ fontSize: "12.5px", maxWidth: "62ch" }}>
              12 лет · съёмки в технологических зонах Белоярской АЭС ·
              презентационные фильмы для Технэкс, Промэлектроники, Таркета ·
              опыт госзакупок с 2014 года
            </p>
          </div>
        </div>
      </section>

      {/* Витрина */}
      {showcase.length > 0 && (
        <section
          className="border-b border-[var(--rule)]"
          style={{ paddingTop: "var(--s-8)", paddingBottom: "var(--s-8)" }}
        >
          <div className="mx-auto px-5 md:px-8" style={{ maxWidth: "var(--content-max)" }}>
            <div className="flex justify-between items-baseline mb-9 flex-wrap gap-4">
              <p className="eyebrow">Избранные работы · 02</p>
              <Link
                href="/cases?type=video"
                className="font-mono text-[12px] tracking-[0.06em] text-[var(--ink-2)] hover:text-[var(--cobalt)] transition-colors uppercase"
              >
                Всё направление →
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
              {showcase.map((c, i) => (
                <Link
                  key={c.id}
                  href={`/show/${c.slug}`}
                  className="scroll-reveal group block"
                  style={{ animationDelay: `${(i % 6) * 50}ms` }}
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
                      <FallbackPoster client={c.client} title={c.title} year={c.year} index={i + 1} type={c.type} />
                    )}
                    {c.duration ? (
                      <span
                        className="absolute bottom-3 right-3 font-mono text-[10px] tracking-[0.06em] text-white px-2 py-1"
                        style={{ background: "rgba(15, 26, 46, 0.65)", backdropFilter: "blur(8px)" }}
                      >
                        ▸ {formatDuration(c.duration)}
                      </span>
                    ) : null}
                  </div>
                  <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--ink-3)] mb-2 group-hover:text-[var(--cobalt)] transition-colors">
                    {c.client || "—"}
                  </p>
                  <h3
                    className="display text-[var(--ink)]"
                    style={{ fontSize: "1.05rem", lineHeight: 1.25, letterSpacing: "-0.012em", animation: "none" }}
                  >
                    {c.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Форматы */}
      <section
        className="border-b border-[var(--rule)]"
        style={{ background: "var(--paper-2)", paddingTop: "var(--s-8)", paddingBottom: "var(--s-8)" }}
      >
        <div className="mx-auto px-5 md:px-8" style={{ maxWidth: "var(--content-max)" }}>
          <p className="eyebrow mb-4">Что мы делаем · 03</p>
          <h2
            className="display mb-10"
            style={{
              fontSize: "clamp(1.6rem, 3.2vw, 2.6rem)",
              letterSpacing: "-0.024em",
              lineHeight: 1.12,
              maxWidth: "24ch",
              animation: "none",
            }}
          >
            Формат выбирается под решение,{" "}
            <span style={{ color: "var(--ink-3)", fontStyle: "italic" }}>а не наоборот.</span>
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: "var(--rule)" }}>
            {FORMATS.map((f, i) => (
              <Link
                key={f.title}
                href={f.href}
                className="scroll-reveal group flex flex-col p-6 hover:bg-[var(--paper-1)] transition-colors"
                style={{ background: "var(--paper-2)", animationDelay: `${i * 40}ms` }}
              >
                <h3
                  className="display mb-2.5"
                  style={{ fontSize: "17px", fontWeight: 500, letterSpacing: "-0.014em", lineHeight: 1.28, animation: "none" }}
                >
                  {f.title}
                </h3>
                <p className="text-[var(--ink-2)] leading-[1.6] flex-1" style={{ fontSize: "13.5px" }}>
                  {f.body}
                </p>
                <span className="font-mono text-[10.5px] tracking-[0.06em] uppercase text-[var(--ink-3)] group-hover:text-[var(--cobalt)] transition-colors mt-4">
                  Подробнее →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Этапы */}
      <section className="border-b border-[var(--rule)]" style={{ paddingTop: "var(--s-8)", paddingBottom: "var(--s-8)" }}>
        <div className="mx-auto px-5 md:px-8" style={{ maxWidth: "var(--content-max)" }}>
          <div className="flex justify-between items-baseline mb-9 flex-wrap gap-4">
            <p className="eyebrow">Как идёт работа · 04</p>
            <span className="font-mono text-[11px] tracking-[0.06em] uppercase text-[var(--ink-3)]">
              7–14 недель
            </span>
          </div>
          {STAGES.map(([n, t, d, time], i) => (
            <div
              key={n}
              className="scroll-reveal grid grid-cols-1 lg:grid-cols-[64px_200px_1fr_120px] gap-y-2 lg:gap-6 border-t border-[var(--rule)] py-7 lg:items-baseline"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div
                className="font-mono leading-none"
                style={{ fontSize: "clamp(26px, 3.2vw, 38px)", color: i === 0 ? "var(--cobalt)" : "var(--ink-3)" }}
              >
                {n}
              </div>
              <h3
                className="display"
                style={{ fontSize: "clamp(17px, 2vw, 23px)", fontWeight: 500, letterSpacing: "-0.016em", lineHeight: 1.15, animation: "none" }}
              >
                {t}
              </h3>
              <p className="text-[var(--ink-2)] leading-[1.6]" style={{ fontSize: "14px" }}>
                {d}
              </p>
              <span className="font-mono lg:text-right text-[var(--ink-3)]" style={{ fontSize: "12px" }}>
                {time}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Связка с технологическим контуром */}
      <section
        style={{ background: "var(--ink)", color: "var(--paper)", paddingTop: "var(--s-8)", paddingBottom: "var(--s-8)" }}
      >
        <div className="mx-auto px-5 md:px-8" style={{ maxWidth: "var(--content-max)" }}>
          <div className="grid lg:grid-cols-[1.3fr_1fr] gap-8 lg:gap-16 items-center">
            <div>
              <p
                className="font-mono mb-5"
                style={{ fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "oklch(70% 0.02 75)" }}
              >
                Редкое сочетание · 05
              </p>
              <h2
                className="display mb-4"
                style={{
                  fontSize: "clamp(1.6rem, 3.2vw, 2.6rem)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.024em",
                  color: "var(--paper)",
                  maxWidth: "24ch",
                  animation: "none",
                }}
              >
                Та же команда строит и системы, о которых снимает.
              </h2>
              <p style={{ fontSize: "15px", color: "oklch(85% 0.02 75)", lineHeight: 1.65, maxWidth: "60ch" }}>
                Мы одинаково подробно разбираемся и в технологии заказчика,
                и в том, как её показать. Поэтому фильм о производственной
                системе у нас не пересказывает пресс-релиз, а объясняет
                принцип — и поэтому же интерфейс, который мы делаем, обычно
                понятен без инструкции.
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-7 py-3.5 border text-[14px] rounded-full transition-colors justify-center"
              style={{ borderColor: "oklch(45% 0.03 255)", color: "var(--paper)" }}
            >
              Направление ИИ и автоматизации <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-b border-[var(--rule)]" style={{ paddingTop: "var(--s-8)", paddingBottom: "var(--s-8)" }}>
        <div className="mx-auto px-5 md:px-8" style={{ maxWidth: "var(--content-max)" }}>
          <p className="eyebrow mb-8">Вопросы · 06</p>
          <div className="grid md:grid-cols-2 gap-x-16 gap-y-8">
            {FAQ.map((f) => (
              <div key={f.question}>
                <h3
                  className="display mb-2"
                  style={{ fontSize: "17px", fontWeight: 500, letterSpacing: "-0.013em", lineHeight: 1.3, animation: "none" }}
                >
                  {f.question}
                </h3>
                <p className="text-[var(--ink-2)] leading-[1.65]" style={{ fontSize: "14.5px" }}>
                  {f.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ paddingTop: "var(--s-9)", paddingBottom: "var(--s-9)" }}>
        <div
          className="mx-auto px-5 md:px-8 grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:gap-14 lg:items-end"
          style={{ maxWidth: "var(--content-max)" }}
        >
          <div>
            <h2
              className="display mb-4"
              style={{
                fontSize: "clamp(1.8rem, 3.8vw, 3.2rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.026em",
                fontVariationSettings: '"opsz" 48',
                animation: "none",
              }}
            >
              Расскажите, что нужно показать.
            </h2>
            <p className="text-[var(--ink-2)] leading-[1.65] max-w-[52ch]" style={{ fontSize: "15.5px" }}>
              Опишите продукт, аудиторию и повод — предложим формат и посчитаем
              смету. Если задача проще, чем кажется, скажем и об этом.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <CtaLink
              href="/brief?source=production"
              goalName="production_cta"
              goalParams={{ place: "footer" }}
              className="text-center px-7 py-4 bg-[var(--ink)] text-[var(--paper)] font-medium rounded-full hover:bg-[var(--cobalt)] transition-colors"
              style={{ fontSize: "14.5px" }}
            >
              Заполнить бриф →
            </CtaLink>
            <Link
              href="/contact"
              className="text-center px-7 py-4 border border-[var(--ink-3)] text-[var(--ink)] rounded-full hover:bg-[var(--paper-1)] transition-colors"
              style={{ fontSize: "14.5px" }}
            >
              Позвонить или написать
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
