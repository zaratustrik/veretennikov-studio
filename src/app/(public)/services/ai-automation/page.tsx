import type { Metadata } from "next"
import Link from "next/link"
import JsonLd from "@/components/JsonLd"
import {
  SITE_URL,
  breadcrumbListSchema,
  serviceSchema,
  faqPageSchema,
} from "@/lib/seo"

const PAGE_URL = `${SITE_URL}/services/ai-automation`

export const metadata: Metadata = {
  title: "AI-автоматизация бизнеса и разработка AI-систем",
  description:
    "Проектируем и разрабатываем AI-инструменты для заявок, документов, продаж, аналитики и внутренних процессов. Не пилот — рабочий инструмент под задачу.",
  alternates: { canonical: "/services/ai-automation" },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "AI-автоматизация — Veretennikov Studio",
    description:
      "AI-системы для реальных бизнес-процессов: заявки, документы, поиск по базе знаний, помощь менеджерам, скоринг и автоматизация рутины.",
    siteName: "Veretennikov Studio",
    locale: "ru_RU",
  },
}

const SCENARIOS = [
  "Первичная обработка заявок и лидов",
  "Ответы по внутренней базе знаний",
  "Подготовка коммерческих предложений",
  "Разбор и классификация документов",
  "Структурирование сообщений и почты",
  "Обработка диспетчерских сводок",
  "Поиск по внутренним материалам",
  "Помощь менеджерам отдела продаж",
  "FAQ-консультант для клиентов",
  "Внутреннее обучение и онбординг",
]

const DELIVERABLES = [
  "Анализ процесса и описание сценариев",
  "Архитектура решения и выбор моделей",
  "Подбор инфраструктуры (cloud / on-prem)",
  "Прототип на реальных данных",
  "Интерфейс — web, Telegram, CRM-плагин",
  "Интеграция с документами и системами",
  "Тестирование на пограничных случаях",
  "Инструкции и обучение команды",
  "Поддержка и доработка после запуска",
]

const TRIGGERS = [
  "Сотрудники тратят часы на повторяющиеся задачи",
  "Клиенты задают одни и те же вопросы менеджерам",
  "База документов разрослась — поиск не работает",
  "Заявок много, но они теряются и обрабатываются вручную",
  "Хочется попробовать AI, но непонятно с чего начать",
  "Был неудачный опыт с пилотом, который не дошёл до прода",
]

const FAQ = [
  {
    question: "Чем вы отличаетесь от обычной AI-разработки?",
    answer:
      "Мы не выбираем модель в первый день. Сначала разбираемся в процессе: где теряется время, где повторяются действия, где данные неструктурированы. Только после этого решаем, нужен ли вообще AI, какая модель подходит и как её встроить, чтобы это не оказался дорогой пилот без бизнес-эффекта.",
  },
  {
    question: "Какие задачи решаете чаще всего?",
    answer:
      "Обработка входящих заявок, поиск по корпоративным документам, помощь менеджерам отдела продаж, разбор и классификация писем, FAQ-ассистенты для сайта, подготовка КП и анализ диспетчерских сводок. На длинных процессах с большим объёмом текста или однотипных решений AI окупается быстрее всего.",
  },
  {
    question: "Сколько стоит AI-проект?",
    answer:
      "От 300 тысяч ₽ за компактный ассистент по базе знаний или классификатор сообщений до 2–3 млн ₽ за полноценную интеграцию с CRM, документами и пользовательским интерфейсом. Точную смету собираем после анализа процесса и пилотного эксперимента на ваших данных.",
  },
  {
    question: "Какие модели и инфраструктуру используете?",
    answer:
      "Подбираем под задачу и ограничения: облачные API (OpenAI, Anthropic, YandexGPT, GigaChat), open-source модели на собственной инфраструктуре или гибридные схемы. Для чувствительных данных предпочитаем on-prem или российские облака — обсуждаем требования к безопасности на брифе.",
  },
  {
    question: "Сколько занимает разработка?",
    answer:
      "От 4 недель для прототипа на узкой задаче до 3–4 месяцев для полноценной системы с интеграциями. Работаем итерациями: первый рабочий прототип через 2–3 недели, дальше дорабатываем по обратной связи команды.",
  },
  {
    question: "Что нужно от компании для старта?",
    answer:
      "Доступ к процессу, который автоматизируем (заявки, документы, переписка, CRM). Контактного человека из команды, кто знает процесс изнутри. Тестовые данные — реальные примеры обращений, документов или диалогов. Если данных мало или они разрозненны — поможем собрать и подготовить.",
  },
]

export default function AiAutomationPage() {
  const jsonLd = [
    breadcrumbListSchema([
      { name: "Главная", url: SITE_URL },
      { name: "Услуги", url: `${SITE_URL}/services` },
      { name: "AI-автоматизация", url: PAGE_URL },
    ]),
    serviceSchema({
      name: "AI-автоматизация бизнеса и разработка AI-систем",
      description:
        "Проектирование и разработка AI-инструментов для заявок, документов, продаж и внутренних процессов компании.",
      url: PAGE_URL,
      serviceType: "Разработка AI-решений и автоматизация бизнес-процессов",
      offers: {
        priceRange: "₽300000-₽3000000",
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
          <div className="grid grid-cols-3 gap-4 pt-5 border-b border-[var(--rule)] pb-5">
            <span className="eyebrow">Service · 03</span>
            <span className="eyebrow text-center hidden md:block">
              Studio Quarterly
            </span>
            <span className="eyebrow text-right">от 4 недель</span>
          </div>

          <div className="pt-20 pb-12">
            <p className="eyebrow mb-7">AI Automation</p>
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
              AI-системы для{" "}
              <span style={{ color: "var(--ink-3)", fontStyle: "italic" }}>
                реальных бизнес-процессов.
              </span>
            </h1>

            <p
              className="text-[var(--ink-2)] leading-[1.7] max-w-[680px] mb-10"
              style={{ fontSize: "clamp(1rem, 1.2vw, 1.1rem)" }}
            >
              Проектируем и разрабатываем AI-инструменты, которые встраиваются в
              работу компании: помогают обрабатывать заявки, искать информацию в
              документах, поддерживать менеджеров, структурировать сообщения,
              готовить ответы и ускорять рутину.
            </p>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <Link
                href="/brief?source=ai-automation"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[var(--ink)] text-[var(--paper)] text-[14px] font-medium rounded-full hover:bg-black transition-colors"
                style={{ transitionDuration: "220ms" }}
              >
                Обсудить AI-задачу
                <span>→</span>
              </Link>
              <Link
                href="/audit"
                className="inline-flex items-center px-7 py-3.5 border border-[var(--ink-3)] text-[var(--ink)] text-[14px] rounded-full hover:bg-[var(--paper-1)] transition-colors"
              >
                Провести AI-аудит
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Principle ────────────────────────────────────────────── */}
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
              <p className="eyebrow mb-6">Принцип · 02</p>
              <h2
                className="display"
                style={{
                  fontSize: "clamp(1.8rem, 3.2vw, 2.6rem)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                  animation: "none",
                }}
              >
                Не AI ради AI,{" "}
                <span style={{ color: "var(--ink-3)", fontStyle: "italic" }}>
                  а инструмент под задачу.
                </span>
              </h2>
            </div>
            <div
              className="lg:pt-3 space-y-5 text-[var(--ink-2)] leading-[1.75]"
              style={{ fontSize: "clamp(1rem, 1.15vw, 1.05rem)" }}
            >
              <p>
                Мы не начинаем с выбора модели. Сначала разбираем процесс: где
                теряется время, где повторяются действия, где данные
                неструктурированы, где сотруднику нужен помощник, а не очередной
                интерфейс.
              </p>
              <p className="text-[var(--ink-3)]">
                Это разница между «у нас теперь есть AI» и «менеджер тратит на
                первичную обработку заявки 30 секунд вместо 12 минут». Первое —
                для отчёта. Второе — то, ради чего мы беремся за проект.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── What we automate ─────────────────────────────────────── */}
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
              <p className="eyebrow mb-6">Что автоматизируем · 03</p>
              <h2
                className="display"
                style={{
                  fontSize: "clamp(1.8rem, 3.2vw, 2.6rem)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                  animation: "none",
                }}
              >
                Десять типов задач,{" "}
                <span style={{ color: "var(--ink-3)", fontStyle: "italic" }}>
                  где AI окупается.
                </span>
              </h2>
            </div>
            <ol className="flex flex-col">
              {SCENARIOS.map((item, i) => (
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

      {/* ── Deliverables ─────────────────────────────────────────── */}
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
              <p className="eyebrow mb-6">Что входит · 04</p>
              <h2
                className="display"
                style={{
                  fontSize: "clamp(1.8rem, 3.2vw, 2.6rem)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                  animation: "none",
                }}
              >
                От анализа процесса{" "}
                <span style={{ color: "var(--ink-3)", fontStyle: "italic" }}>
                  до поддержки на проде.
                </span>
              </h2>
            </div>
            <ol className="flex flex-col">
              {DELIVERABLES.map((item, i) => (
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
              процесс,
            </span>{" "}
            потом <span style={{ color: "var(--cobalt-tint)" }}>модель.</span>
          </h2>

          <p
            className="leading-[1.75] max-w-[720px]"
            style={{
              fontSize: "clamp(1rem, 1.2vw, 1.15rem)",
              color: "oklch(85% 0.02 75)",
            }}
          >
            Мы не предлагаем решение, пока не поняли задачу. Первая неделя —
            интервью с командой, разбор данных, измерения текущего процесса. Дальше
            прототип на реальных данных, оценка точности и доработка под пограничные
            случаи. Только после этого — интеграция и интерфейс. Это разница между
            демо для совещания и инструментом, которым команда пользуется каждый
            день.
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
              что AI пора подключать.
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
              href="/audit"
              className="inline-flex items-center px-5 py-2.5 border border-[var(--rule)] text-[var(--ink-2)] hover:text-[var(--ink)] hover:border-[var(--ink-3)] transition-colors"
              style={{ fontSize: "13px", borderRadius: 2 }}
            >
              AI &amp; Visual Audit
            </Link>
            <Link
              href="/services/industrial-video"
              className="inline-flex items-center px-5 py-2.5 border border-[var(--rule)] text-[var(--ink-2)] hover:text-[var(--ink)] hover:border-[var(--ink-3)] transition-colors"
              style={{ fontSize: "13px", borderRadius: 2 }}
            >
              Industrial Story Film
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
              Хотите проверить, где у вас{" "}
              <span style={{ color: "var(--cobalt)" }}>работает AI?</span>
            </h2>
            <p
              className="text-[var(--ink-2)] leading-[1.6] max-w-[560px]"
              style={{ fontSize: "15px" }}
            >
              Заполните бриф — отвечу лично в течение рабочего дня и предложу
              формат пилота с примерной сметой. Если ещё не уверены, что нужно
              автоматизировать — начните с AI-аудита.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <Link
              href="/brief?source=ai-automation"
              className="text-center px-7 py-4 bg-[var(--ink)] text-[var(--paper)] font-medium rounded-full hover:bg-black transition-colors"
              style={{ fontSize: "14px" }}
            >
              Обсудить AI-задачу →
            </Link>
            <Link
              href="/audit"
              className="text-center px-7 py-4 border border-[var(--ink-3)] text-[var(--ink)] rounded-full hover:bg-[var(--paper-1)] transition-colors"
              style={{ fontSize: "14px" }}
            >
              Провести AI-аудит
            </Link>
            <p
              className="text-center font-mono text-[var(--ink-3)]"
              style={{
                fontSize: "11px",
                letterSpacing: "0.04em",
                marginTop: "8px",
              }}
            >
              NDA до брифа · от 4 недель до прода
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
