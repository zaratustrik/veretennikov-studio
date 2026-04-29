import type { Metadata } from "next"
import Link from "next/link"
import JsonLd from "@/components/JsonLd"
import {
  SITE_URL,
  breadcrumbListSchema,
  serviceSchema,
  faqPageSchema,
} from "@/lib/seo"

const PAGE_URL = `${SITE_URL}/services/ai-sales-assistant`

export const metadata: Metadata = {
  title: "AI-ассистент для сайта, продаж и базы знаний",
  description:
    "Разрабатываем AI-консультантов, которые работают с документами, FAQ, КП и продуктами компании. Помощник для сайта, отдела продаж, выставки и команды.",
  alternates: { canonical: "/services/ai-sales-assistant" },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "AI Sales & Knowledge Assistant — Veretennikov Studio",
    description:
      "AI-ассистент, который знает продукты, документы и FAQ компании. Для сайта, отдела продаж или выставочного стенда.",
    siteName: "Veretennikov Studio",
    locale: "ru_RU",
  },
}

const CAPABILITIES = [
  "Сборка корпоративной базы знаний из документов, презентаций и FAQ",
  "Подбор модели под задачу — облачные API или on-prem решения",
  "Чат-интерфейс на сайте, в Telegram, на стенде или в CRM",
  "Голосовой ввод и озвучка ответов для выставочного формата",
  "Передача структурированной заявки менеджеру",
  "Аналитика: какие вопросы задают, что не находится в базе",
  "Гард-рейлы — границы тематики и тона ответов",
  "Логирование и контроль галлюцинаций до прода",
  "Регулярное обновление базы знаний по мере развития продукта",
]

const SCENARIOS = [
  {
    title: "Посетитель сайта",
    body:
      "Задаёт вопрос про продукт и получает точный ответ со ссылками на материалы. Если вопрос не покрыт базой — собирает контакт и передаёт менеджеру с историей разговора.",
  },
  {
    title: "Менеджер отдела продаж",
    body:
      "Быстро находит аргументы под индустрию клиента, актуальные КП-шаблоны, кейсы по сегменту и параметры продукта. Не нужно помнить всю продуктовую линейку или искать по папкам.",
  },
  {
    title: "Участник выставки",
    body:
      "Получает персональную презентацию по своему сегменту в виде PDF или mini app. Бот квалифицирует посетителя за 90 секунд и передаёт менеджеру тёплый лид.",
  },
  {
    title: "Внутренний сотрудник",
    body:
      "Ищет информацию в корпоративных документах, регламентах, базе проектов и FAQ. Особенно полезно при онбординге и в распределённых командах.",
  },
  {
    title: "Первичная квалификация",
    body:
      "Бот собирает структурированную заявку: что за компания, какая задача, какой бюджет, сроки. Менеджер начинает разговор не с нуля, а с готовым контекстом.",
  },
  {
    title: "Аналитика для руководителя",
    body:
      "Отчёт по самым частым вопросам, темам, сегментам и пробелам в базе знаний. Подсветка того, какой контент нужно создать в первую очередь.",
  },
]

const TRIGGERS = [
  "Менеджеры тратят часы на одинаковые вопросы клиентов",
  "У продукта большая документация — найти нужное сложно",
  "На сайте мало конверсий, потому что вопросы остаются без ответа",
  "Готовите выставку и хотите квалифицировать посетителей",
  "Команда распределённая — новичкам сложно искать информацию",
  "Нужно понять, какие вопросы реально задают клиенты",
]

const FAQ = [
  {
    question: "Будет ли ассистент «фантазировать» как ChatGPT?",
    answer:
      "Не должен. Мы используем RAG — модель работает только с проверенной базой знаний компании, без «домысливания». Если вопрос не покрыт документами — ассистент честно говорит «не знаю» и предлагает связаться с менеджером. Гард-рейлы и тестирование на пограничных случаях — обязательная часть проекта.",
  },
  {
    question: "Какие модели и инфраструктуру используете?",
    answer:
      "Подбираем под задачу: облачные API (OpenAI, Anthropic, YandexGPT, GigaChat) для быстрого старта или open-source модели на собственной инфраструктуре для чувствительных данных. Гибридные схемы — когда поиск идёт локально, а генерация в облаке — тоже работают.",
  },
  {
    question: "Где можно разместить ассистента?",
    answer:
      "На сайте — виджет в углу или встроенный чат. В Telegram — отдельный бот компании. На выставочном стенде — на планшете или большом экране. В CRM — как панель помощника для менеджера. В корпоративном портале — как внутренний поиск. Часто делаем сразу несколько каналов из одного движка.",
  },
  {
    question: "Что если у нас нет готовой базы знаний?",
    answer:
      "Часть проекта — собрать её. Импортируем существующие материалы (сайт, PDF, презентации, FAQ, переписку), очищаем от противоречий, структурируем и добавляем недостающее. Часто оказывается, что у компании контента больше, чем кажется — он просто разрознен.",
  },
  {
    question: "Сколько занимает разработка?",
    answer:
      "От 4 до 10 недель. Сборка базы знаний — 1–3 недели. Разработка движка и интерфейса — 2–4 недели. Тестирование на пограничных случаях, гард-рейлы и подключение каналов — 1–3 недели. Срочный режим возможен на узких задачах с готовыми материалами.",
  },
  {
    question: "Как формируется стоимость?",
    answer:
      "Зависит от объёма базы знаний, числа каналов размещения, требований к инфраструктуре (cloud / on-prem) и сложности интеграций с CRM или сайтом. Точную смету собираем после анализа материалов и согласования сценариев использования.",
  },
  {
    question: "Что нужно от компании для старта?",
    answer:
      "Доступ к существующим материалам — сайт, документы, презентации, FAQ, шаблоны КП, описания продуктов. Контактного человека из команды, кто знает продукт изнутри. Если есть данные о реальных вопросах клиентов (письма, чаты, звонки) — это ускоряет работу и повышает качество ассистента.",
  },
]

export default function AiSalesAssistantPage() {
  const jsonLd = [
    breadcrumbListSchema([
      { name: "Главная", url: SITE_URL },
      { name: "Услуги", url: `${SITE_URL}/services` },
      { name: "AI Sales & Knowledge Assistant", url: PAGE_URL },
    ]),
    serviceSchema({
      name: "AI Sales & Knowledge Assistant — AI-ассистент для сайта и продаж",
      description:
        "Разработка AI-консультантов и помощников, которые работают с документами, FAQ, КП и продуктами компании.",
      url: PAGE_URL,
      serviceType: "Разработка AI-ассистентов и систем работы с базой знаний",
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
            <span className="eyebrow">Service · 06</span>
            <span className="eyebrow text-center hidden md:block">
              Studio Quarterly
            </span>
            <span className="eyebrow text-right">4–10 недель</span>
          </div>

          <div className="pt-20 pb-12">
            <p className="eyebrow mb-7">AI Sales & Knowledge Assistant</p>
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
              AI-ассистент,{" "}
              <span style={{ color: "var(--ink-3)", fontStyle: "italic" }}>
                который знает ваш продукт.
              </span>
            </h1>

            <p
              className="text-[var(--ink-2)] leading-[1.7] max-w-[680px] mb-10"
              style={{ fontSize: "clamp(1rem, 1.2vw, 1.1rem)" }}
            >
              Создаём AI-консультантов для сайта, отдела продаж, выставочного
              стенда или внутренней команды. Ассистент работает с вашими
              документами, презентациями, FAQ и описаниями продуктов — отвечает
              точно, не фантазирует и передаёт менеджеру тёплый лид с готовым
              контекстом.
            </p>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <Link
                href="/brief?source=ai-sales-assistant"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[var(--ink)] text-[var(--paper)] text-[14px] font-medium rounded-full hover:bg-black transition-colors"
                style={{ transitionDuration: "220ms" }}
              >
                Обсудить ассистента
                <span>→</span>
              </Link>
              <Link
                href="/audit"
                className="inline-flex items-center px-7 py-3.5 border border-[var(--ink-3)] text-[var(--ink)] text-[14px] rounded-full hover:bg-[var(--paper-1)] transition-colors"
              >
                Провести аудит базы знаний
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
                Бот, который фантазирует,{" "}
                <span style={{ color: "var(--ink-3)", fontStyle: "italic" }}>
                  хуже, чем нет бота вовсе.
                </span>
              </h2>
            </div>
            <div
              className="lg:pt-3 space-y-5 text-[var(--ink-2)] leading-[1.75]"
              style={{ fontSize: "clamp(1rem, 1.15vw, 1.05rem)" }}
            >
              <p>
                Большинство «AI-консультантов» на сайтах — это либо тупой FAQ,
                либо большая модель без рамок. Первое не отвечает на половину
                вопросов. Второе — обещает то, чего нет, путает цены, выдумывает
                характеристики и подставляет компанию.
              </p>
              <p className="text-[var(--ink-3)]">
                AI-ассистент должен работать в проверенной базе знаний и
                понятных сценариях. Не отвечать от лица компании без контроля.
                Не обещать невозможное. И — что важно — честно говорить «не
                знаю», когда вопрос выходит за границы. Это разница между
                полезным помощником и репутационной проблемой.
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
                От сборки базы знаний{" "}
                <span style={{ color: "var(--ink-3)", fontStyle: "italic" }}>
                  до контроля галлюцинаций.
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
              Шесть применений{" "}
              <span style={{ color: "var(--ink-3)", fontStyle: "italic" }}>
                одного движка.
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--rule)] border border-[var(--rule)]">
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
              база знаний,
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
            Хороший AI-ассистент на 70% состоит из проверенной, чистой и
            структурированной базы знаний — и только на 30% из модели.
            Большинство неудачных проектов проваливаются не на стороне
            технологии, а на стороне контента: документы устарели, противоречат
            друг другу или просто отсутствуют. Мы начинаем с аудита материалов,
            а не с подбора API.
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
              что AI-ассистент окупится.
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
              href="/services/ai-automation"
              className="inline-flex items-center px-5 py-2.5 border border-[var(--rule)] text-[var(--ink-2)] hover:text-[var(--ink)] hover:border-[var(--ink-3)] transition-colors"
              style={{ fontSize: "13px", borderRadius: 2 }}
            >
              AI Automation
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
              Хотите ассистента,{" "}
              <span style={{ color: "var(--cobalt)" }}>которому можно доверять?</span>
            </h2>
            <p
              className="text-[var(--ink-2)] leading-[1.6] max-w-[560px]"
              style={{ fontSize: "15px" }}
            >
              Заполните бриф — отвечу лично в течение рабочего дня и предложу
              сценарий пилота. Если ещё не уверены, что у компании достаточно
              материалов — начните с аудита базы знаний.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <Link
              href="/brief?source=ai-sales-assistant"
              className="text-center px-7 py-4 bg-[var(--ink)] text-[var(--paper)] font-medium rounded-full hover:bg-black transition-colors"
              style={{ fontSize: "14px" }}
            >
              Обсудить ассистента →
            </Link>
            <Link
              href="/audit"
              className="text-center px-7 py-4 border border-[var(--ink-3)] text-[var(--ink)] rounded-full hover:bg-[var(--paper-1)] transition-colors"
              style={{ fontSize: "14px" }}
            >
              Аудит базы знаний
            </Link>
            <p
              className="text-center font-mono text-[var(--ink-3)]"
              style={{
                fontSize: "11px",
                letterSpacing: "0.04em",
                marginTop: "8px",
              }}
            >
              NDA до брифа · работаем по всей России
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
