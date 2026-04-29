import type { Metadata } from "next"
import Link from "next/link"
import JsonLd from "@/components/JsonLd"
import {
  SITE_URL,
  breadcrumbListSchema,
  serviceSchema,
  faqPageSchema,
} from "@/lib/seo"

const PAGE_URL = `${SITE_URL}/audit`

export const metadata: Metadata = {
  title: "AI & Visual Audit — аудит коммуникаций B2B-компании",
  description:
    "Анализируем сайт, видео, презентации, выставочные материалы и AI-возможности компании. На выходе — карта улучшений и продуктовая стратегия за 1–2 недели.",
  alternates: { canonical: "/audit" },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "AI & Visual Audit — Veretennikov Studio",
    description:
      "Аудит того, как компания показывает продукт. Сайт, видео, презентации, AI-точки. На выходе — карта улучшений за 1–2 недели.",
    siteName: "Veretennikov Studio",
    locale: "ru_RU",
  },
}

const ANALYSE = [
  "Сайт и его конверсионную структуру",
  "Портфолио и кейсы",
  "Корпоративные видео и презентационные ролики",
  "Презентации и питч-документы",
  "Выставочные материалы — стенды, ролики, раздатка",
  "Коммерческие предложения и шаблоны",
  "Контент в социальных сетях",
  "Документы и материалы для отдела продаж",
  "Точки, где можно применить AI без риска",
  "Путь клиента — от первого касания до заявки",
]

const RESULTS = [
  {
    title: "Карта проблем и точек роста",
    body: "Что в текущих коммуникациях работает, что мешает, что можно усилить быстро.",
  },
  {
    title: "Рекомендации по сайту и SEO",
    body: "Структурные правки, которые приводят больше нужных запросов без потери премиальности.",
  },
  {
    title: "Идеи для видео и визуализации",
    body: "Какие форматы реально нужны — фильм, объяснительный ролик, схема, цифровой двойник, выставочный материал.",
  },
  {
    title: "Карта AI-сценариев",
    body: "Где AI даёт ощутимую пользу, а где это «модный пилот без бизнес-эффекта». С честной оценкой риска и трудозатрат.",
  },
  {
    title: "3–5 продуктовых гипотез",
    body: "Конкретные решения, которые можно запускать дальше — с ориентировочным бюджетом и сроком.",
  },
  {
    title: "План внедрения на 30–90 дней",
    body: "Что делать самим, что отдать студии, что подождать. Без размытого «работаем над улучшениями».",
  },
]

const PROCESS = [
  {
    n: "01",
    t: "Бриф и доступ",
    d: "Подписываем NDA, получаем доступ к материалам и собираем 30-минутный звонок с ключевыми людьми из вашей команды.",
    time: "1–2 дня",
  },
  {
    n: "02",
    t: "Анализ",
    d: "Разбираем материалы по 10 направлениям, фиксируем сильные и слабые места, собираем количественные и качественные наблюдения.",
    time: "5–7 дней",
  },
  {
    n: "03",
    t: "Карта решений",
    d: "Формулируем 3–5 продуктовых гипотез, расставляем приоритеты, привязываем к бюджету и срокам внедрения.",
    time: "2–3 дня",
  },
  {
    n: "04",
    t: "Презентация",
    d: "60–90 минут: разбор аудита, ответы на вопросы, обсуждение, что взять в работу прямо сейчас.",
    time: "1 день",
  },
]

const TRIGGERS = [
  "Сайт не приводит заявок на сложные продукты",
  "Готовитесь к выставке и нужна понятная стратегия",
  "Хотите запустить AI-инструменты, но не знаете с чего начать",
  "Команда продаж жалуется на нехватку материалов",
  "Видеоконтент устарел или не объясняет продукт",
  "Запускаете новый продукт и нужна стартовая система коммуникаций",
]

const FAQ = [
  {
    question: "Сколько занимает аудит?",
    answer:
      "Стандартно 1–2 недели от подписания NDA до презентации. Срочный формат — за 5 рабочих дней, с увеличенной стоимостью.",
  },
  {
    question: "Сколько это стоит?",
    answer:
      "От 50 до 150 тысяч рублей в зависимости от объёма материалов и количества направлений анализа. На звонке-знакомстве я уточняю состав работ и фиксирую цену в смете.",
  },
  {
    question: "Что я получу на выходе?",
    answer:
      "PDF-документ на 25–40 страниц с картой проблем, конкретными рекомендациями, 3–5 продуктовыми гипотезами и планом внедрения на 30–90 дней. Плюс часовая презентация результатов.",
  },
  {
    question: "Обязательно ли потом заказывать у вас проекты?",
    answer:
      "Нет. Аудит — самостоятельный продукт. Вы получаете результат, который можно реализовать с любой студией или своими силами. Если решите работать дальше с нами — стоимость аудита вычитается из бюджета следующего проекта.",
  },
  {
    question: "Какие материалы нужны от компании?",
    answer:
      "Доступ к сайту, текущим презентациям, видеоматериалам, выставочным роликам, базовым продуктовым описаниям. Если что-то не оформлено — это часть наблюдений аудита.",
  },
  {
    question: "Подписываете ли вы NDA?",
    answer:
      "Да, NDA — первый этап. До начала анализа. Можем работать по вашей форме или по нашей.",
  },
]

export default function AuditPage() {
  const jsonLd = [
    breadcrumbListSchema([
      { name: "Главная", url: SITE_URL },
      { name: "AI & Visual Audit", url: PAGE_URL },
    ]),
    serviceSchema({
      name: "AI & Visual Audit",
      description:
        "Аудит коммуникаций B2B-компании: сайт, видео, презентации, выставочные материалы и AI-возможности. Карта улучшений и план внедрения.",
      url: PAGE_URL,
      serviceType: "Бизнес-аудит и стратегический консалтинг",
      offers: {
        priceRange: "₽50000-₽150000",
        priceCurrency: "RUB",
      },
    }),
    faqPageSchema(FAQ),
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
          {/* Mono masthead */}
          <div className="grid grid-cols-3 gap-4 pt-5 border-b border-[var(--rule)] pb-5">
            <span className="eyebrow">Service · 01</span>
            <span className="eyebrow text-center hidden md:block">
              Studio Quarterly
            </span>
            <span className="eyebrow text-right">1–2 недели</span>
          </div>

          <div className="pt-20 pb-12">
            <p className="eyebrow mb-7">AI &amp; Visual Audit</p>
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
              Как ваша компания показывает себя.{" "}
              <span style={{ color: "var(--ink-3)", fontStyle: "italic" }}>
                И как это можно сделать сильнее.
              </span>
            </h1>

            <p
              className="text-[var(--ink-2)] leading-[1.7] max-w-[680px] mb-10"
              style={{ fontSize: "clamp(1rem, 1.2vw, 1.1rem)" }}
            >
              За 1–2 недели разбираем сайт, видео, презентации, выставочные материалы
              и AI-возможности компании. На выходе — карта улучшений: что усилить
              быстро, что требует отдельного проекта, какие решения дадут максимальный
              эффект.
            </p>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <Link
                href="/brief"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[var(--ink)] text-[var(--paper)] text-[14px] font-medium rounded-full hover:bg-black transition-colors"
                style={{ transitionDuration: "220ms" }}
              >
                Заказать аудит
                <span>→</span>
              </Link>
              <a
                href="mailto:strana.vfx@gmail.com"
                className="inline-flex items-center px-7 py-3.5 border border-[var(--ink-3)] text-[var(--ink)] text-[14px] rounded-full hover:bg-[var(--paper-1)] transition-colors"
              >
                Обсудить голосом
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── What we analyse ──────────────────────────────────────── */}
      <section className="border-b border-[var(--rule)] bg-[var(--paper-1)]">
        <div
          className="mx-auto px-5 md:px-8"
          style={{
            maxWidth: "var(--content-max)",
            paddingTop: "var(--s-9)",
            paddingBottom: "var(--s-9)",
          }}
        >
          <div className="grid lg:grid-cols-[280px_1fr] gap-12 lg:gap-20">
            <div>
              <p className="eyebrow mb-6">Что анализируем · 02</p>
              <h2
                className="display"
                style={{
                  fontSize: "clamp(1.8rem, 3.2vw, 2.6rem)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                  animation: "none",
                }}
              >
                Десять направлений.
                <br />
                <span style={{ color: "var(--ink-3)", fontStyle: "italic" }}>
                  Один общий ответ.
                </span>
              </h2>
            </div>
            <ol className="flex flex-col">
              {ANALYSE.map((item, i) => (
                <li
                  key={item}
                  className="grid grid-cols-[44px_1fr] gap-6 py-5 border-t border-[var(--rule)] last:border-b items-baseline"
                >
                  <span className="font-mono text-[12px] text-[var(--ink-3)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="text-[var(--ink)]"
                    style={{ fontSize: "15px", lineHeight: 1.55 }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ── Results ──────────────────────────────────────────────── */}
      <section className="border-b border-[var(--rule)]">
        <div
          className="mx-auto px-5 md:px-8"
          style={{
            maxWidth: "var(--content-max)",
            paddingTop: "var(--s-9)",
            paddingBottom: "var(--s-9)",
          }}
        >
          <div className="mb-12">
            <p className="eyebrow mb-6">Что получите · 03</p>
            <h2
              className="display"
              style={{
                fontSize: "clamp(1.8rem, 3.2vw, 2.6rem)",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                maxWidth: "780px",
                animation: "none",
              }}
            >
              PDF-документ и часовая презентация.{" "}
              <span style={{ color: "var(--ink-3)" }}>
                Без размытых формулировок.
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-px bg-[var(--rule)] border border-[var(--rule)]">
            {RESULTS.map((r, i) => (
              <div
                key={r.title}
                className="bg-[var(--paper)] p-7 lg:p-9"
              >
                <p
                  className="font-mono text-[10px] tracking-[0.18em] uppercase mb-3"
                  style={{ color: i === 4 ? "var(--cobalt)" : "var(--ink-3)" }}
                >
                  /{String(i + 1).padStart(2, "0")}
                </p>
                <h3
                  className="display text-[var(--ink)] mb-3"
                  style={{
                    fontSize: "clamp(1.05rem, 1.4vw, 1.2rem)",
                    lineHeight: 1.25,
                    letterSpacing: "-0.012em",
                    animation: "none",
                  }}
                >
                  {r.title}
                </h3>
                <p
                  className="text-[var(--ink-2)] leading-[1.6]"
                  style={{ fontSize: "14px" }}
                >
                  {r.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process ──────────────────────────────────────────────── */}
      <section
        className="border-b border-[var(--rule)]"
        style={{ paddingTop: "var(--s-9)", paddingBottom: "var(--s-9)" }}
      >
        <div
          className="mx-auto px-5 md:px-8"
          style={{ maxWidth: "var(--content-max)" }}
        >
          <div className="flex justify-between items-baseline mb-12 flex-wrap gap-4">
            <h2
              className="display"
              style={{
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
                letterSpacing: "-0.025em",
                lineHeight: 1,
                fontVariationSettings: '"opsz" 48',
                animation: "none",
              }}
            >
              Процесс{" "}
              <span style={{ fontStyle: "italic", color: "var(--ink-3)" }}>
                в четыре этапа.
              </span>
            </h2>
            <span className="eyebrow">7–14 дней</span>
          </div>

          <div>
            {PROCESS.map((p, i) => (
              <div
                key={p.n}
                className="grid grid-cols-1 lg:items-baseline border-t border-[var(--rule)] py-9 gap-y-3 lg:gap-[var(--s-6)] lg:grid-cols-[100px_1fr_1.5fr_120px]"
              >
                <div
                  className="font-mono leading-none"
                  style={{
                    fontSize: "clamp(40px, 5vw, 64px)",
                    color: i === 0 ? "var(--cobalt)" : "var(--ink-3)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {p.n}
                </div>
                <h3
                  className="display"
                  style={{
                    fontSize: "clamp(20px, 2.4vw, 32px)",
                    fontWeight: 500,
                    letterSpacing: "-0.018em",
                    lineHeight: 1,
                    animation: "none",
                  }}
                >
                  {p.t}
                </h3>
                <p
                  className="text-[var(--ink-2)] leading-[1.65]"
                  style={{ fontSize: "14px" }}
                >
                  {p.d}
                </p>
                <span
                  className="font-mono lg:text-right text-[var(--ink-3)]"
                  style={{ fontSize: "12px" }}
                >
                  {p.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing & timing ─────────────────────────────────────── */}
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
            Стоимость и срок · 04
          </p>
          <h2
            className="display mb-12"
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
            <span style={{ fontStyle: "italic", color: "oklch(70% 0.02 75)" }}>
              От
            </span>{" "}
            50 000 ₽.{" "}
            <span style={{ color: "var(--cobalt-tint)" }}>1–2 недели.</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-10">
            <div>
              <p
                className="font-mono mb-3"
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "var(--cobalt-tint)",
                }}
              >
                Базовый формат
              </p>
              <p
                className="display mb-2"
                style={{
                  fontSize: "1.5rem",
                  letterSpacing: "-0.018em",
                  color: "var(--paper)",
                  animation: "none",
                }}
              >
                50–80 тыс. ₽
              </p>
              <p
                style={{
                  fontSize: "14px",
                  color: "oklch(85% 0.02 75)",
                  lineHeight: 1.55,
                }}
              >
                Сайт, видео, основные презентации. До 5 направлений анализа.
              </p>
            </div>
            <div>
              <p
                className="font-mono mb-3"
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "var(--cobalt-tint)",
                }}
              >
                Расширенный
              </p>
              <p
                className="display mb-2"
                style={{
                  fontSize: "1.5rem",
                  letterSpacing: "-0.018em",
                  color: "var(--paper)",
                  animation: "none",
                }}
              >
                100–150 тыс. ₽
              </p>
              <p
                style={{
                  fontSize: "14px",
                  color: "oklch(85% 0.02 75)",
                  lineHeight: 1.55,
                }}
              >
                Все 10 направлений + детальная карта AI-сценариев + 5 продуктовых гипотез с расчётом.
              </p>
            </div>
            <div>
              <p
                className="font-mono mb-3"
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "var(--cobalt-tint)",
                }}
              >
                Срочный
              </p>
              <p
                className="display mb-2"
                style={{
                  fontSize: "1.5rem",
                  letterSpacing: "-0.018em",
                  color: "var(--paper)",
                  animation: "none",
                }}
              >
                +30–50%
              </p>
              <p
                style={{
                  fontSize: "14px",
                  color: "oklch(85% 0.02 75)",
                  lineHeight: 1.55,
                }}
              >
                За 5 рабочих дней. Подключаем команду параллельно по направлениям.
              </p>
            </div>
          </div>

          <p
            className="mt-12 pt-6 border-t border-[oklch(28%_0.04_255)] font-mono"
            style={{
              fontSize: "12px",
              color: "oklch(70% 0.02 75)",
              letterSpacing: "0.04em",
              maxWidth: "640px",
            }}
          >
            При заказе следующего проекта в студии стоимость аудита вычитается из бюджета.
          </p>
        </div>
      </section>

      {/* ── Triggers / Когда это нужно ──────────────────────────── */}
      <section
        className="border-b border-[var(--rule)]"
        style={{ paddingTop: "var(--s-9)", paddingBottom: "var(--s-9)" }}
      >
        <div
          className="mx-auto px-5 md:px-8"
          style={{ maxWidth: "var(--content-max)" }}
        >
          <p className="eyebrow mb-7">Когда это нужно · 05</p>
          <h2
            className="display mb-10"
            style={{
              fontSize: "clamp(1.8rem, 3.2vw, 2.6rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              maxWidth: "780px",
              animation: "none",
            }}
          >
            Аудит окупается, если выбираете между несколькими направлениями
            или хотите потратить бюджет точечно.
          </h2>

          <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
            {TRIGGERS.map((t) => (
              <li
                key={t}
                className="flex items-baseline gap-3 py-2 border-t border-[var(--rule)]"
              >
                <span className="block w-1 h-1 rounded-full bg-[var(--cobalt)] mt-2 shrink-0" />
                <span
                  className="text-[var(--ink-2)]"
                  style={{ fontSize: "14px", lineHeight: 1.55 }}
                >
                  {t}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────── */}
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
              <p className="eyebrow mb-6">FAQ · 06</p>
              <h2
                className="display"
                style={{
                  fontSize: "clamp(1.8rem, 3.2vw, 2.6rem)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                  animation: "none",
                }}
              >
                Что обычно спрашивают{" "}
                <span style={{ color: "var(--ink-3)", fontStyle: "italic" }}>
                  до подписания брифа.
                </span>
              </h2>
            </div>
            <div className="flex flex-col">
              {FAQ.map((item, i) => (
                <details
                  key={item.question}
                  className="group border-t border-[var(--rule)] last:border-b py-5"
                  open={i === 0}
                >
                  <summary
                    className="cursor-pointer list-none flex items-baseline justify-between gap-4 group-hover:text-[var(--cobalt)] transition-colors"
                    style={{ fontSize: "16px", lineHeight: 1.4 }}
                  >
                    <span className="text-[var(--ink)] font-medium">
                      {item.question}
                    </span>
                    <span
                      className="font-mono text-[var(--ink-3)] transition-transform group-open:rotate-45 shrink-0"
                      style={{ fontSize: "16px" }}
                    >
                      +
                    </span>
                  </summary>
                  <p
                    className="mt-3 text-[var(--ink-2)] leading-[1.65]"
                    style={{ fontSize: "14px" }}
                  >
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
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
              Готовы начать{" "}
              <span style={{ color: "var(--cobalt)" }}>с аудита?</span>
            </h2>
            <p
              className="text-[var(--ink-2)] leading-[1.6] max-w-[560px]"
              style={{ fontSize: "15px" }}
            >
              Заполните бриф — отвечу лично в течение рабочего дня и предложу состав работ.
              Если нужно сначала обсудить голосом — пишите на почту или в Telegram.
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
            <a
              href="mailto:strana.vfx@gmail.com"
              className="text-center px-7 py-4 border border-[var(--ink-3)] text-[var(--ink)] rounded-full hover:bg-[var(--paper-1)] transition-colors"
              style={{ fontSize: "14px" }}
            >
              strana.vfx@gmail.com
            </a>
            <p
              className="text-center font-mono text-[var(--ink-3)]"
              style={{
                fontSize: "11px",
                letterSpacing: "0.04em",
                marginTop: "8px",
              }}
            >
              NDA подписываем до брифа
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
