import type { Metadata } from "next"
import Link from "next/link"
import JsonLd from "@/components/JsonLd"
import CtaLink from "@/components/public/CtaLink"
import { SITE_URL, breadcrumbListSchema, collectionPageSchema } from "@/lib/seo"
import { METHOD } from "@/data/method"

export const metadata: Metadata = {
  title: "Что мы делаем",
  description:
    "Два направления: ИИ и автоматизация процессов — диагностика, базы знаний, ИИ-агенты, обработка документов, данные и отчётность. И промышленное видео, 3D и интерактив.",
  alternates: { canonical: "/services" },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/services`,
    title: "Что мы делаем — Veretennikov Studio",
    description:
      "ИИ и автоматизация процессов. Промышленное видео, 3D и интерактив. Вход — разбор одного процесса за 40 минут.",
    siteName: "Veretennikov Studio",
    locale: "ru_RU",
  },
}

const AI_SERVICES = [
  {
    href: "/diagnostika",
    label: "Диагностика процессов",
    lead: "С этого начинают",
    body:
      "Разбираем процессы, замеряем baseline и показываем, что имеет смысл автоматизировать, а что нет. На выходе — карта процесса, гипотезы с оценкой эффекта и план на 30–90 дней.",
    time: "1–2 недели",
    flagship: true,
  },
  {
    href: "/services/ai-knowledge-base",
    label: "Корпоративная база знаний",
    lead: "Ответы по вашим документам",
    body:
      "Система отвечает на вопросы сотрудников по документам компании — со ссылкой на источник и честным «не знаю» вместо выдумки. С размещением внутри вашего контура.",
    time: "от 6 недель",
  },
  {
    href: "/services/ai-agents",
    label: "ИИ-агенты и помощники",
    lead: "Работа доведена до результата",
    body:
      "Помощник руководителя, разбор почты, подготовка документов и черновиков, сбор аналитики. Агент останавливается там, где решение принимает человек.",
    time: "от 4 недель",
  },
  {
    href: "/services/document-processing",
    label: "Обработка заявок и документов",
    lead: "Входящий поток разбирается сам",
    body:
      "Классификация обращений, извлечение данных из счетов и актов, проверка комплектности, маршрутизация — поверх систем, которые у вас уже работают.",
    time: "от 4 недель",
  },
  {
    href: "/services/data-reporting",
    label: "Данные и отчётность",
    lead: "Цифры, которые не спорят",
    body:
      "Сводим данные из разных систем, договариваемся о показателях и делаем отчётность, которая собирается сама. Мониторинг отклонений — там, где он нужен.",
    time: "от 6 недель",
  },
  {
    href: "/services/ai-automation",
    label: "Разработка под задачу",
    lead: "Когда ТЗ уже есть",
    body:
      "Проектирование и разработка цифрового решения под сформулированную задачу: сервис, платформа, инструмент для внутренней работы, интеграции.",
    time: "от 8 недель",
  },
]

const PRODUCTION_SERVICES = [
  {
    href: "/services/industrial-video",
    label: "Промышленный фильм",
    body: "Съёмка на действующем производстве, сценарий, режиссура, монтаж, звук.",
    time: "7–14 недель",
  },
  {
    href: "/services/digital-twin-visualization",
    label: "3D и визуальные модели",
    body: "Устройство и принцип работы оборудования, анимация технологических процессов.",
    time: "6–12 недель",
  },
  {
    href: "/services/expo-stand",
    label: "Выставочные решения",
    body: "Интерактивный стенд: синхронные экраны, планшеты, сбор заявок, отчёт после события.",
    time: "6–12 недель",
  },
  {
    href: "/services/mini-apps-games",
    label: "Интерактив и мини-приложения",
    body: "Telegram WebApp, калькуляторы, брендированные механики для сайта, выставки и обучения.",
    time: "3–8 недель",
  },
  {
    href: "/services/b2b-content-engine",
    label: "Контент-подписка",
    body: "Регулярная система видео, кейсов и экспертных материалов для сложного B2B.",
    time: "ежемесячный цикл",
  },
]

const AUDIENCE = [
  "Промышленные предприятия",
  "Производители оборудования",
  "НИИ, КБ и проектные организации",
  "Инженерные и сервисные компании",
  "Транспорт и логистика",
  "IT и B2B-сервисы",
  "Госсектор и отраслевые объединения",
  "Медицина и образование",
]

export default function ServicesPage() {
  const jsonLd = [
    breadcrumbListSchema([
      { name: "Главная", url: SITE_URL },
      { name: "Что мы делаем", url: `${SITE_URL}/services` },
    ]),
    collectionPageSchema({
      url: `${SITE_URL}/services`,
      name: "Направления Veretennikov Studio",
      description:
        "ИИ и автоматизация процессов; промышленное видео, 3D и интерактив.",
      itemsCount: AI_SERVICES.length + PRODUCTION_SERVICES.length,
    }),
  ]

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* Hero */}
      <section className="border-b border-[var(--rule)]">
        <div className="mx-auto px-5 md:px-8" style={{ maxWidth: "var(--content-max)" }}>
          <div className="pt-12 md:pt-16 pb-11">
            <p className="eyebrow mb-6">Что мы делаем · два направления</p>
            <h1
              className="display"
              style={{
                fontSize: "clamp(1.9rem, 4.2vw, 3.6rem)",
                lineHeight: 1.06,
                letterSpacing: "-0.025em",
                fontVariationSettings: '"opsz" 48',
                marginBottom: "20px",
                maxWidth: "20ch",
                animation: "none",
              }}
            >
              Сначала разбираемся в задаче.{" "}
              <span style={{ color: "var(--ink-3)", fontStyle: "italic" }}>
                Потом выбираем инструмент.
              </span>
            </h1>
            <p
              className="text-[var(--ink-2)] leading-[1.7]"
              style={{ fontSize: "clamp(1rem, 1.2vw, 1.12rem)", maxWidth: "64ch" }}
            >
              Мы не продаём услуги по списку. Приходят обычно не с готовым
              техническим заданием, а с ситуацией: люди делают много руками,
              информацию невозможно найти, продукт трудно объяснить.
              Что именно нужно сделать — определяется до того, как выбрана
              технология.
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-9">
              <CtaLink
                href="/razbor"
                goalName="razbor_cta"
                goalParams={{ place: "services" }}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[var(--ink)] text-[var(--paper)] text-[14px] font-medium rounded-full hover:bg-[var(--cobalt)] transition-colors"
              >
                Разобрать процесс — 40 минут
                <span aria-hidden>→</span>
              </CtaLink>
              <Link
                href="/diagnostika"
                className="inline-flex items-center px-7 py-3.5 border border-[var(--ink-3)] text-[var(--ink)] text-[14px] rounded-full hover:bg-[var(--paper-1)] transition-colors"
              >
                Как проходит диагностика
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Контур 1 */}
      <section
        className="border-b border-[var(--rule)]"
        style={{ paddingTop: "var(--s-8)", paddingBottom: "var(--s-8)" }}
      >
        <div className="mx-auto px-5 md:px-8" style={{ maxWidth: "var(--content-max)" }}>
          <div className="flex items-baseline justify-between gap-4 flex-wrap mb-9">
            <div>
              <p className="eyebrow mb-4">Направление 01</p>
              <h2
                className="display"
                style={{
                  fontSize: "clamp(1.6rem, 3.2vw, 2.6rem)",
                  letterSpacing: "-0.024em",
                  lineHeight: 1.1,
                  animation: "none",
                }}
              >
                ИИ и автоматизация процессов
              </h2>
            </div>
            <p className="text-[var(--ink-2)] text-[14px] leading-[1.6] max-w-[38ch]">
              Инструменты, которые встраиваются в работу компании и снимают
              с людей то, что можно не делать руками.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: "var(--rule)" }}>
            {AI_SERVICES.map((s, i) => (
              <Link
                key={s.href}
                href={s.href}
                className="scroll-reveal group flex flex-col p-6 lg:p-7 transition-colors"
                style={{
                  background: s.flagship ? "var(--ink)" : "var(--paper)",
                  color: s.flagship ? "var(--paper)" : undefined,
                  animationDelay: `${i * 40}ms`,
                }}
              >
                <p
                  className="font-mono text-[9.5px] tracking-[0.18em] uppercase mb-4"
                  style={{ color: s.flagship ? "var(--cobalt-tint)" : "var(--ink-4)" }}
                >
                  {s.lead}
                </p>
                <h3
                  className="display mb-3"
                  style={{
                    fontSize: "clamp(1.08rem, 1.4vw, 1.28rem)",
                    fontWeight: 500,
                    letterSpacing: "-0.015em",
                    lineHeight: 1.25,
                    color: s.flagship ? "var(--paper)" : "var(--ink)",
                    animation: "none",
                  }}
                >
                  {s.label}
                </h3>
                <p
                  className="leading-[1.6] mb-5 flex-1"
                  style={{
                    fontSize: "13.5px",
                    color: s.flagship ? "oklch(85% 0.02 75)" : "var(--ink-2)",
                  }}
                >
                  {s.body}
                </p>
                <div className="flex items-baseline justify-between gap-3">
                  <span
                    className="font-mono text-[10.5px] tracking-[0.06em] uppercase transition-colors"
                    style={{ color: s.flagship ? "var(--cobalt-tint)" : "var(--ink-3)" }}
                  >
                    Подробнее →
                  </span>
                  <span
                    className="font-mono text-[10.5px]"
                    style={{ color: s.flagship ? "oklch(70% 0.02 75)" : "var(--ink-4)" }}
                  >
                    {s.time}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Контур 2 */}
      <section
        className="border-b border-[var(--rule)]"
        style={{ background: "var(--paper-2)", paddingTop: "var(--s-8)", paddingBottom: "var(--s-8)" }}
      >
        <div className="mx-auto px-5 md:px-8" style={{ maxWidth: "var(--content-max)" }}>
          <div className="flex items-baseline justify-between gap-4 flex-wrap mb-9">
            <div>
              <p className="eyebrow mb-4">Направление 02</p>
              <h2
                className="display"
                style={{
                  fontSize: "clamp(1.6rem, 3.2vw, 2.6rem)",
                  letterSpacing: "-0.024em",
                  lineHeight: 1.1,
                  animation: "none",
                }}
              >
                Промышленное видео, 3D и интерактив
              </h2>
            </div>
            <Link
              href="/production"
              className="font-mono text-[12px] tracking-[0.06em] uppercase text-[var(--cobalt)] hover:underline underline-offset-4"
            >
              Направление целиком →
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: "var(--rule)" }}>
            {PRODUCTION_SERVICES.map((s, i) => (
              <Link
                key={s.href}
                href={s.href}
                className="scroll-reveal group flex flex-col p-6 lg:p-7 hover:bg-[var(--paper-1)] transition-colors"
                style={{ background: "var(--paper-2)", animationDelay: `${i * 40}ms` }}
              >
                <h3
                  className="display mb-3"
                  style={{
                    fontSize: "clamp(1.05rem, 1.35vw, 1.22rem)",
                    fontWeight: 500,
                    letterSpacing: "-0.014em",
                    lineHeight: 1.25,
                    animation: "none",
                  }}
                >
                  {s.label}
                </h3>
                <p className="text-[var(--ink-2)] leading-[1.6] mb-5 flex-1" style={{ fontSize: "13.5px" }}>
                  {s.body}
                </p>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-mono text-[10.5px] tracking-[0.06em] uppercase text-[var(--ink-3)] group-hover:text-[var(--cobalt)] transition-colors">
                    Подробнее →
                  </span>
                  <span className="font-mono text-[10.5px] text-[var(--ink-4)]">{s.time}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Программы */}
      <section className="border-b border-[var(--rule)]" style={{ paddingTop: "var(--s-8)", paddingBottom: "var(--s-8)" }}>
        <div className="mx-auto px-5 md:px-8" style={{ maxWidth: "var(--content-max)" }}>
          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-16 items-center">
            <div>
              <p className="eyebrow mb-5">Отдельно · для организаций</p>
              <h2
                className="display mb-4"
                style={{
                  fontSize: "clamp(1.5rem, 2.8vw, 2.2rem)",
                  letterSpacing: "-0.022em",
                  lineHeight: 1.12,
                  maxWidth: "22ch",
                  animation: "none",
                }}
              >
                ИИ для руководителей и команд
              </h2>
              <p className="text-[var(--ink-2)] leading-[1.65] max-w-[56ch]" style={{ fontSize: "15px" }}>
                Мастер-классы, корпоративное обучение и стратегические
                сессии — на реальных задачах организации. На выходе
                не сертификат, а карта процессов, с которых имеет смысл
                начать.
              </p>
            </div>
            <Link
              href="/programs"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-[var(--ink)] text-[var(--ink)] text-[14px] font-medium rounded-full hover:bg-[var(--ink)] hover:text-[var(--paper)] transition-colors"
            >
              Смотреть форматы <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Метод */}
      <section className="border-b border-[var(--rule)]" style={{ paddingTop: "var(--s-8)", paddingBottom: "var(--s-8)" }}>
        <div className="mx-auto px-5 md:px-8" style={{ maxWidth: "var(--content-max)" }}>
          <p className="eyebrow mb-4">Порядок работы · общий для обоих направлений</p>
          <h2
            className="display mb-9"
            style={{
              fontSize: "clamp(1.5rem, 2.8vw, 2.2rem)",
              letterSpacing: "-0.022em",
              lineHeight: 1.12,
              maxWidth: "26ch",
              animation: "none",
            }}
          >
            На каждом шаге можно остановиться.
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-px" style={{ background: "var(--rule)" }}>
            {METHOD.map((m, i) => (
              <div key={m.n} className="p-5" style={{ background: "var(--paper)" }}>
                <p
                  className="font-mono mb-3"
                  style={{ fontSize: "22px", color: i === 0 ? "var(--cobalt)" : "var(--ink-4)", lineHeight: 1 }}
                >
                  {m.n}
                </p>
                <p
                  className="display mb-1.5"
                  style={{ fontSize: "15.5px", fontWeight: 500, letterSpacing: "-0.012em", animation: "none" }}
                >
                  {m.title}
                </p>
                <p className="font-mono text-[10.5px] text-[var(--ink-3)] mb-2.5">{m.time}</p>
                <p className="text-[var(--ink-2)] leading-[1.5]" style={{ fontSize: "12.5px" }}>
                  {m.exit}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Для кого */}
      <section className="border-b border-[var(--rule)]" style={{ paddingTop: "var(--s-8)", paddingBottom: "var(--s-8)" }}>
        <div className="mx-auto px-5 md:px-8" style={{ maxWidth: "var(--content-max)" }}>
          <p className="eyebrow mb-4">С кем работаем · 05</p>
          <h2
            className="display mb-8"
            style={{
              fontSize: "clamp(1.5rem, 2.8vw, 2.2rem)",
              letterSpacing: "-0.022em",
              lineHeight: 1.12,
              maxWidth: "26ch",
              animation: "none",
            }}
          >
            С теми, у кого сложный продукт{" "}
            <span style={{ color: "var(--ink-3)", fontStyle: "italic" }}>и много рутины.</span>
          </h2>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-3">
            {AUDIENCE.map((a) => (
              <li
                key={a}
                className="text-[var(--ink-2)] border-t border-[var(--rule)] pt-3"
                style={{ fontSize: "14px", lineHeight: 1.45 }}
              >
                {a}
              </li>
            ))}
          </ul>
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
              Не уверены, что из этого ваше?
            </h2>
            <p className="text-[var(--ink-2)] leading-[1.65] max-w-[52ch]" style={{ fontSize: "15.5px" }}>
              Это нормально — большинство приходит именно так. Расскажите
              о ситуации, и за сорок минут разберём, что здесь вообще
              имеет смысл делать.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <CtaLink
              href="/razbor"
              goalName="razbor_cta"
              goalParams={{ place: "services_footer" }}
              className="text-center px-7 py-4 bg-[var(--ink)] text-[var(--paper)] font-medium rounded-full hover:bg-[var(--cobalt)] transition-colors"
              style={{ fontSize: "14.5px" }}
            >
              Разобрать процесс →
            </CtaLink>
            <Link
              href="/brief"
              className="text-center px-7 py-4 border border-[var(--ink-3)] text-[var(--ink)] rounded-full hover:bg-[var(--paper-1)] transition-colors"
              style={{ fontSize: "14.5px" }}
            >
              Уже знаю задачу — заполнить бриф
            </Link>
            <p
              className="text-center font-mono text-[var(--ink-3)]"
              style={{ fontSize: "11px", letterSpacing: "0.04em", marginTop: "6px" }}
            >
              Ответ в течение рабочего дня · NDA до брифа
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
