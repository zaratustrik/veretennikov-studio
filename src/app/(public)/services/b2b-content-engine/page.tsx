import type { Metadata } from "next"
import Link from "next/link"
import JsonLd from "@/components/JsonLd"
import {
  SITE_URL,
  breadcrumbListSchema,
  serviceSchema,
  faqPageSchema,
} from "@/lib/seo"

const PAGE_URL = `${SITE_URL}/services/b2b-content-engine`

export const metadata: Metadata = {
  title: "B2B-контент для промышленных и технологических компаний",
  description:
    "Ежемесячная контент-система: видео, кейсы, экспертные материалы, графика и контент для продаж сложных B2B-продуктов. Один план — одна команда.",
  alternates: { canonical: "/services/b2b-content-engine" },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "B2B Content Engine — Veretennikov Studio",
    description:
      "Регулярный контент для сложного B2B: ежемесячное планирование, производство видео, кейсов, экспертных материалов и графики.",
    siteName: "Veretennikov Studio",
    locale: "ru_RU",
  },
}

const FORMATS = [
  "Короткие ролики о продуктах и технологиях (60–90 сек)",
  "Экспертные видео и интервью с инженерами и руководителями",
  "Кейсы и истории клиентских внедрений",
  "Визуальные карточки и инфографика для соцсетей",
  "Нарезки и репортажи с выставок и мероприятий",
  "Материалы для отдела продаж — short-form, презентации, КП",
  "Демо-ролики и продуктовые анимации",
  "Текстовые лонгриды и экспертные статьи",
  "Раздаточные материалы и обновления для сайта",
  "Ежемесячный план + редакторская проверка тематики",
]

const PACKAGES = [
  {
    title: "Compact",
    body:
      "Одна тема в месяц: 1 короткое видео + 2–3 визуальные карточки + 1 экспертный пост. Подходит компаниям, которым нужно «не пропадать» из инфополя без серьёзной нагрузки на команду.",
  },
  {
    title: "Standard",
    body:
      "2–3 темы в месяц: продукт + кейс + эксперт. Полноценная редакционная работа, регулярный поток для сайта, соцсетей и отдела продаж. Самый распространённый формат для среднего B2B.",
  },
  {
    title: "Extended",
    body:
      "Полная контент-фабрика: 4–6 тем в месяц, видео-серии, лонгриды, материалы для выставок и совместные проекты. Подходит компаниям, у которых контент — часть стратегии продаж.",
  },
]

const TRIGGERS = [
  "Один большой фильм в год не делает компанию заметной",
  "Менеджеры просят актуальные материалы — каждый раз с нуля",
  "Соцсети и блог компании пустуют или ведутся «по остаточному»",
  "Готовите регулярный поток к выставкам и форумам",
  "Запускаете продукт и нужна постоянная поддержка интереса",
  "Хочется отстроиться от конкурентов через экспертный контент",
]

const FAQ = [
  {
    question: "Чем это отличается от обычного SMM-агентства?",
    answer:
      "Мы не «ведём аккаунты» и не пишем посты для галочки. Это редакционная работа с продуктом и людьми: понимаем технологию, разговариваем с инженерами, выстраиваем план тем, который реально продаёт. Производство — внутри студии (видео, графика, тексты), без субподряда на ключевых ролях. Если ищете дешёвый поток постов — мы не подойдём.",
  },
  {
    question: "Какие форматы делаете чаще всего?",
    answer:
      "Самая частая комбинация — короткое видео о продукте + кейс с клиентом + экспертный пост от руководителя или инженера. Дальше добавляем визуальные карточки, отчёты с выставок, демо-ролики и материалы для отдела продаж. Подбираем под индустрию — для промышленности, IT и инжиниринга стек разный.",
  },
  {
    question: "Сколько занимает запуск?",
    answer:
      "От подписания до первого выпуска — 3–4 недели. Первая неделя: погружение в продукт, интервью с командой, согласование редакционной линии. Вторая–третья: подготовка контент-плана и съёмка/производство первой партии. Четвёртая: публикация и ритм.",
  },
  {
    question: "На какой срок заключаете контракт?",
    answer:
      "От 3 месяцев. Контент-система не работает «попробовать на месяц» — нужно время на калибровку тематики, отлаживание процесса согласования и накопление аудитории. Стандартный контракт — 6 месяцев с продлением.",
  },
  {
    question: "Как формируется стоимость?",
    answer:
      "Зависит от объёма ежемесячного выпуска (форматы и количество), сложности тематики, наличия съёмок на производстве и числа спикеров. Точную смету собираем после согласования контент-плана и пакета — на этом этапе понятен ритм производства и состав команды.",
  },
  {
    question: "Что нужно от компании для старта?",
    answer:
      "Доступ к экспертам в команде (15–30 минут в неделю на интервью или комментарий), существующие материалы и кейсы, понимание целевой аудитории. Если есть отдел маркетинга — работаем с ним; если нет — берём редакторскую функцию на себя и согласовываем с одним контактным лицом.",
  },
]

export default function B2bContentEnginePage() {
  const jsonLd = [
    breadcrumbListSchema([
      { name: "Главная", url: SITE_URL },
      { name: "Услуги", url: `${SITE_URL}/services` },
      { name: "B2B Content Engine", url: PAGE_URL },
    ]),
    serviceSchema({
      name: "B2B Content Engine — регулярный контент для B2B-компаний",
      description:
        "Ежемесячное производство видео, кейсов, экспертных материалов и графики для промышленных и технологических компаний.",
      url: PAGE_URL,
      serviceType: "Контент-маркетинг и регулярный видеопродакшн для B2B",
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
            <span className="eyebrow">Service · 07</span>
            <span className="eyebrow text-center hidden md:block">
              Studio Quarterly
            </span>
            <span className="eyebrow text-right">Ежемесячный цикл</span>
          </div>

          <div className="pt-20 pb-12">
            <p className="eyebrow mb-7">B2B Content Engine</p>
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
              Регулярный контент{" "}
              <span style={{ color: "var(--ink-3)", fontStyle: "italic" }}>
                для сложного B2B.
              </span>
            </h1>

            <p
              className="text-[var(--ink-2)] leading-[1.7] max-w-[680px] mb-10"
              style={{ fontSize: "clamp(1rem, 1.2vw, 1.1rem)" }}
            >
              Помогаем промышленным и технологическим компаниям системно
              рассказывать о продуктах, проектах, экспертизе и людях. Один план
              на квартал, одна команда на всё производство — короткие видео,
              кейсы, экспертные материалы, графика и контент для продаж.
            </p>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <Link
                href="/brief?source=b2b-content-engine"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[var(--ink)] text-[var(--paper)] text-[14px] font-medium rounded-full hover:bg-black transition-colors"
                style={{ transitionDuration: "220ms" }}
              >
                Обсудить контент-систему
                <span>→</span>
              </Link>
              <Link
                href="/audit"
                className="inline-flex items-center px-7 py-3.5 border border-[var(--ink-3)] text-[var(--ink)] text-[14px] rounded-full hover:bg-[var(--paper-1)] transition-colors"
              >
                Получить план на месяц
              </Link>
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
                Один большой фильм в год{" "}
                <span style={{ color: "var(--ink-3)", fontStyle: "italic" }}>
                  не делает компанию заметной.
                </span>
              </h2>
            </div>
            <div
              className="lg:pt-3 space-y-5 text-[var(--ink-2)] leading-[1.75]"
              style={{ fontSize: "clamp(1rem, 1.15vw, 1.05rem)" }}
            >
              <p>
                Сложные B2B-продукты не покупают после одного просмотра. Решение
                созревает месяцами — клиент должен регулярно видеть, что
                компания делает, какие проекты ведёт, кто её эксперты, как она
                решает реальные задачи. Один корпоративный фильм закрывает только
                первую встречу.
              </p>
              <p className="text-[var(--ink-3)]">
                Контент-фабрика решает эту задачу иначе: каждый месяц компания
                выпускает 3–6 значимых единиц контента — короткие видео, кейсы,
                экспертные посты, материалы для продаж. Не для «галочки в
                соцсетях», а для того, чтобы клиент к моменту разговора с
                менеджером уже понимал, кто перед ним и почему этой компании
                можно доверять.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Formats ──────────────────────────────────────────────── */}
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
                Десять форматов{" "}
                <span style={{ color: "var(--ink-3)", fontStyle: "italic" }}>
                  внутри одного движка.
                </span>
              </h2>
            </div>
            <ol className="flex flex-col">
              {FORMATS.map((item, i) => (
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

      {/* ── Packages ─────────────────────────────────────────────── */}
      <section
        className="border-b border-[var(--rule)] bg-[var(--paper-1)]"
        style={{ paddingTop: "var(--s-9)", paddingBottom: "var(--s-9)" }}
      >
        <div
          className="mx-auto px-5 md:px-8"
          style={{ maxWidth: "var(--content-max)" }}
        >
          <div className="mb-12">
            <p className="eyebrow mb-6">Пакеты · 04</p>
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
              Три формата подписки{" "}
              <span style={{ color: "var(--ink-3)", fontStyle: "italic" }}>
                под разную интенсивность.
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-px bg-[var(--rule)] border border-[var(--rule)]">
            {PACKAGES.map((p, i) => (
              <div
                key={p.title}
                className="bg-[var(--paper-1)] p-7 lg:p-9"
              >
                <p
                  className="font-mono text-[10px] tracking-[0.18em] uppercase mb-3"
                  style={{ color: i === 1 ? "var(--cobalt)" : "var(--ink-3)" }}
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
                  {p.title}
                </h3>
                <p
                  className="text-[var(--ink-2)] leading-[1.6]"
                  style={{ fontSize: "14px" }}
                >
                  {p.body}
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
            Не «ведём{" "}
            <span style={{ fontStyle: "italic", color: "oklch(70% 0.02 75)" }}>
              соцсети»,
            </span>{" "}
            а собираем{" "}
            <span style={{ color: "var(--cobalt-tint)" }}>редакцию.</span>
          </h2>

          <p
            className="leading-[1.75] max-w-[720px]"
            style={{
              fontSize: "clamp(1rem, 1.2vw, 1.15rem)",
              color: "oklch(85% 0.02 75)",
            }}
          >
            Дешёвый SMM делает то, что задано в плане — и его контент через
            месяц неотличим от соседского. Редакция работает иначе: разбирается
            в продукте, разговаривает с инженерами, ищет интересные кейсы и
            людей, выстраивает редакционную линию. Производство — внутри
            студии: видео, графика, тексты — без субподряда на ключевых ролях.
            Это разница между «потоком постов» и узнаваемой компанией.
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
              что разовых проектов уже мало.
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
                  до подписания контракта.
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
              href="/services/expo-stand"
              className="inline-flex items-center px-5 py-2.5 border border-[var(--rule)] text-[var(--ink-2)] hover:text-[var(--ink)] hover:border-[var(--ink-3)] transition-colors"
              style={{ fontSize: "13px", borderRadius: 2 }}
            >
              Expo Stand 4.0
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
              Готовы к{" "}
              <span style={{ color: "var(--cobalt)" }}>регулярному ритму?</span>
            </h2>
            <p
              className="text-[var(--ink-2)] leading-[1.6] max-w-[560px]"
              style={{ fontSize: "15px" }}
            >
              Заполните бриф — отвечу лично в течение рабочего дня и предложу
              план на первый месяц. Если ещё не уверены, какие темы и форматы
              нужны — начните с аудита коммуникаций.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <Link
              href="/brief?source=b2b-content-engine"
              className="text-center px-7 py-4 bg-[var(--ink)] text-[var(--paper)] font-medium rounded-full hover:bg-black transition-colors"
              style={{ fontSize: "14px" }}
            >
              Обсудить контент-систему →
            </Link>
            <Link
              href="/audit"
              className="text-center px-7 py-4 border border-[var(--ink-3)] text-[var(--ink)] rounded-full hover:bg-[var(--paper-1)] transition-colors"
              style={{ fontSize: "14px" }}
            >
              Аудит коммуникаций
            </Link>
            <p
              className="text-center font-mono text-[var(--ink-3)]"
              style={{
                fontSize: "11px",
                letterSpacing: "0.04em",
                marginTop: "8px",
              }}
            >
              Контракт от 3 месяцев · NDA до брифа
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
