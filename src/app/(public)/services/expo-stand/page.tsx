import type { Metadata } from "next"
import Link from "next/link"
import JsonLd from "@/components/JsonLd"
import {
  SITE_URL,
  breadcrumbListSchema,
  serviceSchema,
  faqPageSchema,
} from "@/lib/seo"

const PAGE_URL = `${SITE_URL}/services/expo-stand`

export const metadata: Metadata = {
  title: "Интерактивные выставочные стенды и видеостены",
  description:
    "Создаём мультимедийные стенды: синхронные экраны, планшеты, mini apps, AI-консультант и сбор заявок. Стенд работает как система продаж, а не фон.",
  alternates: { canonical: "/services/expo-stand" },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Expo Stand 4.0 — Veretennikov Studio",
    description:
      "Интерактивные стенды для выставок и форумов: синхронные экраны, планшеты, mini apps, AI-консультант и сбор заявок.",
    siteName: "Veretennikov Studio",
    locale: "ru_RU",
  },
}

const CAPABILITIES = [
  "Синхронное видео на нескольких экранах и видеостенах",
  "Запуск роликов на моноблоках, планшетах и телефонах посетителей",
  "Планшет управления стендом для менеджера",
  "Интерактивная карта продукта или линейки оборудования",
  "AI-консультант по материалам компании (продукты, FAQ, КП)",
  "QR-сценарии: посетитель уходит с персональной презентацией",
  "Mini app с подборкой продуктов и формой заявки",
  "Сбор лидов с тегами и контекстом разговора",
  "Отчёт после выставки: кто чем интересовался",
]

const SCENARIOS = [
  {
    title: "Промышленная компания",
    body:
      "На большом экране — производство и оборудование в работе. На планшете — интерактивная схема продукта с разрезами и характеристиками. На телефоне посетителя — персональная презентация под его сегмент и форма заявки.",
  },
  {
    title: "IT и B2B-сервисы",
    body:
      "AI-консультант объясняет продукт, подбирает сценарий внедрения под индустрию посетителя, собирает интерес и передаёт менеджеру структурированную заявку с историей разговора.",
  },
  {
    title: "Ассоциация или союз",
    body:
      "Стенд показывает проекты участников, карту предприятий, события и статистику. Посетитель находит партнёра или поставщика по фильтру и забирает контакт через QR.",
  },
]

const TRIGGERS = [
  "Готовитесь к крупной выставке (ИННОПРОМ, отраслевые форумы)",
  "Прошлый стенд работал «фоном» — лиды собирались хаотично",
  "Менеджеры не успевают поговорить со всеми посетителями",
  "Нужно показать сложный продукт без долгого объяснения",
  "Хочется собрать данные о посетителях для постпродажи",
  "Есть видеоконтент, но он не вовлекает на стенде",
]

const FAQ = [
  {
    question: "Можно ли синхронизировать 10–30 устройств на стенде?",
    answer:
      "Да. Используем медиасервер или web-based решение в зависимости от задачи. Заранее проектируем сеть, запуск, погрешности синхронизации, fallback на локальное воспроизведение и отладку на стенде до открытия выставки.",
  },
  {
    question: "Можно ли использовать уже имеющееся оборудование?",
    answer:
      "Да. Сначала проводим аудит устройств: экраны, моноблоки, планшеты, телефоны, сеть, разрешения, браузеры, мощность и расположение. На многих стендах удаётся обойтись существующим парком — это экономит 30–50% бюджета.",
  },
  {
    question: "Можно ли добавить AI-консультанта?",
    answer:
      "Да, если у компании есть материалы: презентации, FAQ, сайт, продуктовые описания. AI-ассистент работает в рамках проверенной базы знаний и не «фантазирует». Подробнее — на странице AI Automation.",
  },
  {
    question: "Сколько занимает подготовка стенда?",
    answer:
      "От 6 до 12 недель в зависимости от сложности. Сценарий и контент — 2–3 недели. Разработка и сборка — 3–6 недель. Отладка на площадке — 1–3 дня. Срочный режим возможен с увеличенной командой.",
  },
  {
    question: "Как формируется стоимость стенда?",
    answer:
      "Зависит от размера стенда, количества устройств, наличия кастомного железа, AI-консультанта и съёмки контента. Точную смету собираем после брифа и согласования сценария — на этом этапе уже понятен план-схема, технологии и состав команды.",
  },
  {
    question: "Что нужно от компании для старта?",
    answer:
      "План-схему стенда от застройщика, бренд-материалы, существующие презентации и видео, продуктовые описания. Если что-то не оформлено — поможем подготовить на этапе предпродакшна.",
  },
]

export default function ExpoStandPage() {
  const jsonLd = [
    breadcrumbListSchema([
      { name: "Главная", url: SITE_URL },
      { name: "Услуги", url: `${SITE_URL}/services` },
      { name: "Expo Stand 4.0", url: PAGE_URL },
    ]),
    serviceSchema({
      name: "Expo Stand 4.0 — интерактивные выставочные стенды",
      description:
        "Интерактивные стенды для выставок и форумов: синхронные экраны, планшеты, mini apps, AI-консультант и сбор заявок.",
      url: PAGE_URL,
      serviceType: "Разработка интерактивных выставочных стендов",
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
          <div className="grid grid-cols-3 gap-4 pt-5 border-b border-[var(--rule)] pb-5">
            <span className="eyebrow">Service · 04</span>
            <span className="eyebrow text-center hidden md:block">
              Studio Quarterly
            </span>
            <span className="eyebrow text-right">6–12 недель</span>
          </div>

          <div className="pt-20 pb-12">
            <p className="eyebrow mb-7">Expo Stand 4.0</p>
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
              Стенд, который работает{" "}
              <span style={{ color: "var(--ink-3)", fontStyle: "italic" }}>
                как система продаж.
              </span>
            </h1>

            <p
              className="text-[var(--ink-2)] leading-[1.7] max-w-[680px] mb-10"
              style={{ fontSize: "clamp(1rem, 1.2vw, 1.1rem)" }}
            >
              Делаем мультимедийные решения для выставок и форумов: синхронные
              экраны, видеостены, планшеты, mini apps, AI-консультанты и сбор
              заявок. Стенд не просто показывает ролик — он управляет
              демонстрацией, вовлекает посетителей и передаёт лиды в работу
              менеджеру.
            </p>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <Link
                href="/brief?source=expo-stand"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[var(--ink)] text-[var(--paper)] text-[14px] font-medium rounded-full hover:bg-black transition-colors"
                style={{ transitionDuration: "220ms" }}
              >
                Обсудить стенд
                <span>→</span>
              </Link>
              <a
                href="https://t.me/VeretennikovINFO"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 border border-[var(--ink-3)] text-[var(--ink)] text-[14px] rounded-full hover:bg-[var(--paper-1)] transition-colors"
              >
                Получить концепцию
                <span aria-hidden>↗</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Problem ──────────────────────────────────────────────── */}
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
              <p className="eyebrow mb-6">Проблема · 02</p>
              <h2
                className="display"
                style={{
                  fontSize: "clamp(1.8rem, 3.2vw, 2.6rem)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                  animation: "none",
                }}
              >
                На выставке мало{" "}
                <span style={{ color: "var(--ink-3)", fontStyle: "italic" }}>
                  просто поставить экран.
                </span>
              </h2>
            </div>
            <div
              className="lg:pt-3 space-y-5 text-[var(--ink-2)] leading-[1.75]"
              style={{ fontSize: "clamp(1rem, 1.15vw, 1.05rem)" }}
            >
              <p>
                Посетитель проходит мимо десятков стендов. Менеджер не успевает
                поговорить со всеми. Видео крутится фоном. Лиды собираются
                хаотично — на визитки, в блокнот, в телефон. После выставки
                невозможно понять, кто чем интересовался и кому что отправлять.
              </p>
              <p className="text-[var(--ink-3)]">
                Интерактивный стенд решает это иначе: посетитель сам выбирает,
                что хочет узнать, оставляет данные через QR или mini app, а
                менеджер получает структурированный лид с историей взаимодействия
                и переходит сразу к содержательному разговору.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Capabilities ─────────────────────────────────────────── */}
      <section
        className="border-b border-[var(--rule)]"
        style={{ paddingTop: "var(--s-9)", paddingBottom: "var(--s-9)" }}
      >
        <div
          className="mx-auto px-5 md:px-8"
          style={{ maxWidth: "var(--content-max)" }}
        >
          <div className="grid lg:grid-cols-[280px_1fr] gap-12 lg:gap-20">
            <div>
              <p className="eyebrow mb-6">Что входит · 03</p>
              <h2
                className="display"
                style={{
                  fontSize: "clamp(1.8rem, 3.2vw, 2.6rem)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                  animation: "none",
                }}
              >
                От синхронного видео{" "}
                <span style={{ color: "var(--ink-3)", fontStyle: "italic" }}>
                  до отчёта после выставки.
                </span>
              </h2>
            </div>
            <ol className="flex flex-col">
              {CAPABILITIES.map((item, i) => (
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

      {/* ── Scenarios ────────────────────────────────────────────── */}
      <section
        className="border-b border-[var(--rule)] bg-[var(--paper-1)]"
        style={{ paddingTop: "var(--s-9)", paddingBottom: "var(--s-9)" }}
      >
        <div
          className="mx-auto px-5 md:px-8"
          style={{ maxWidth: "var(--content-max)" }}
        >
          <div className="mb-12">
            <p className="eyebrow mb-6">Сценарии · 04</p>
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
              Три типа стендов{" "}
              <span style={{ color: "var(--ink-3)", fontStyle: "italic" }}>
                под разные задачи.
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-px bg-[var(--rule)] border border-[var(--rule)]">
            {SCENARIOS.map((s, i) => (
              <div
                key={s.title}
                className="bg-[var(--paper-1)] p-7 lg:p-9"
              >
                <p
                  className="font-mono text-[10px] tracking-[0.18em] uppercase mb-3"
                  style={{ color: i === 0 ? "var(--cobalt)" : "var(--ink-3)" }}
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
                  {s.title}
                </h3>
                <p
                  className="text-[var(--ink-2)] leading-[1.6]"
                  style={{ fontSize: "14px" }}
                >
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Approach (ink inversion) ─────────────────────────────── */}
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
            Подход · 05
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
            Сначала{" "}
            <span style={{ fontStyle: "italic", color: "oklch(70% 0.02 75)" }}>
              сценарий посетителя,
            </span>{" "}
            потом <span style={{ color: "var(--cobalt-tint)" }}>железо.</span>
          </h2>

          <p
            className="leading-[1.75] max-w-[720px]"
            style={{
              fontSize: "clamp(1rem, 1.2vw, 1.15rem)",
              color: "oklch(85% 0.02 75)",
            }}
          >
            Мы начинаем с вопроса: что должен сделать посетитель за 90 секунд на
            стенде? Понять продукт, оставить контакт, забрать материалы, поговорить
            с менеджером. Только после этого подбираем оборудование, mini app и
            сценарий синхронизации. Это разница между «стендом, на который
            смотрят» и «стендом, который собирает квалифицированные заявки».
          </p>
        </div>
      </section>

      {/* ── Triggers ─────────────────────────────────────────────── */}
      <section
        className="border-b border-[var(--rule)]"
        style={{ paddingTop: "var(--s-9)", paddingBottom: "var(--s-9)" }}
      >
        <div
          className="mx-auto px-5 md:px-8"
          style={{ maxWidth: "var(--content-max)" }}
        >
          <p className="eyebrow mb-7">Когда это нужно · 06</p>
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
            Шесть сигналов,{" "}
            <span style={{ color: "var(--ink-3)", fontStyle: "italic" }}>
              что обычного стенда уже мало.
            </span>
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
              <p className="eyebrow mb-6">FAQ · 07</p>
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

      {/* ── Related services ─────────────────────────────────────── */}
      <section
        className="border-b border-[var(--rule)]"
        style={{ paddingTop: "var(--s-7)", paddingBottom: "var(--s-7)" }}
      >
        <div
          className="mx-auto px-5 md:px-8"
          style={{ maxWidth: "var(--content-max)" }}
        >
          <p className="eyebrow mb-6">Связанные направления</p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/services/industrial-video"
              className="inline-flex items-center px-5 py-2.5 border border-[var(--rule)] text-[var(--ink-2)] hover:text-[var(--ink)] hover:border-[var(--ink-3)] transition-colors"
              style={{ fontSize: "13px", borderRadius: 2 }}
            >
              Industrial Story Film
            </Link>
            <Link
              href="/services/ai-automation"
              className="inline-flex items-center px-5 py-2.5 border border-[var(--rule)] text-[var(--ink-2)] hover:text-[var(--ink)] hover:border-[var(--ink-3)] transition-colors"
              style={{ fontSize: "13px", borderRadius: 2 }}
            >
              AI Automation
            </Link>
            <Link
              href="/audit"
              className="inline-flex items-center px-5 py-2.5 border border-[var(--rule)] text-[var(--ink-2)] hover:text-[var(--ink)] hover:border-[var(--ink-3)] transition-colors"
              style={{ fontSize: "13px", borderRadius: 2 }}
            >
              AI &amp; Visual Audit
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center px-5 py-2.5 border border-[var(--rule)] text-[var(--ink-2)] hover:text-[var(--ink)] hover:border-[var(--ink-3)] transition-colors"
              style={{ fontSize: "13px", borderRadius: 2 }}
            >
              Все услуги
            </Link>
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────── */}
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
              Готовитесь{" "}
              <span style={{ color: "var(--cobalt)" }}>к выставке?</span>
            </h2>
            <p
              className="text-[var(--ink-2)] leading-[1.6] max-w-[560px]"
              style={{ fontSize: "15px" }}
            >
              Заполните бриф — отвечу лично в течение рабочего дня и предложу
              сценарий стенда с примерной сметой. Чем раньше начинаем — тем больше
              времени на отладку и тестирование на площадке.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <Link
              href="/brief?source=expo-stand"
              className="text-center px-7 py-4 bg-[var(--ink)] text-[var(--paper)] font-medium rounded-full hover:bg-black transition-colors"
              style={{ fontSize: "14px" }}
            >
              Обсудить стенд →
            </Link>
            <a
              href="https://t.me/VeretennikovINFO"
              target="_blank"
              rel="noopener noreferrer"
              className="text-center px-7 py-4 border border-[var(--ink-3)] text-[var(--ink)] rounded-full hover:bg-[var(--paper-1)] transition-colors"
              style={{ fontSize: "14px" }}
            >
              Написать в Telegram ↗
            </a>
            <p
              className="text-center font-mono text-[var(--ink-3)]"
              style={{
                fontSize: "11px",
                letterSpacing: "0.04em",
                marginTop: "8px",
              }}
            >
              Работаем по всей России · NDA до брифа
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
