import type { Metadata } from "next"
import Link from "next/link"
import JsonLd from "@/components/JsonLd"
import LeadForm from "./LeadForm"
import { SITE_URL, breadcrumbListSchema, faqPageSchema } from "@/lib/seo"
import { PHONE_HUMAN, TELEGRAM_HANDLE } from "@/lib/contacts"

// Слоты считаются от текущей даты — страница не должна застывать в билде.
export const revalidate = 3600

export const metadata: Metadata = {
  title: "Разбор процесса — 40 минут",
  description:
    "Бесплатный разбор одного рабочего процесса: смотрим, из чего он состоит, где уходит время и есть ли там что автоматизировать. Без презентаций и обязательств.",
  alternates: { canonical: "/razbor" },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/razbor`,
    title: "Разбор процесса — 40 минут — Veretennikov Studio",
    description:
      "Разбираем один процесс: где уходит время и что имеет смысл автоматизировать. Если автоматизировать нечего — скажем прямо.",
    siteName: "Veretennikov Studio",
    locale: "ru_RU",
  },
}

const WEEKDAY = ["вс", "понедельник", "вторник", "среда", "четверг", "пятница", "сб"]
const MONTH = ["янв", "фев", "мар", "апр", "мая", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"]

/**
 * Ближайшие рабочие дни как ориентир для звонка. Это не бронь в календаре —
 * значение уходит в заявку строкой, точное время подтверждается ответом.
 * Так мы даём выбор времени, не обещая интеграции с календарём, которой нет.
 */
function nextSlots(count = 4): string[] {
  const out: string[] = []
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  while (out.length < count) {
    d.setDate(d.getDate() + 1)
    const wd = d.getDay()
    if (wd === 0 || wd === 6) continue
    out.push(`${d.getDate()} ${MONTH[d.getMonth()]} · ${WEEKDAY[wd]}`)
  }
  return out
}

const WHAT_WE_DO = [
  "Разбираем один процесс по шагам: кто, что и в какой момент делает руками",
  "Считаем на пальцах, сколько времени он съедает сейчас",
  "Смотрим, какие данные у вас уже есть, а каких не хватает",
  "Отделяем то, где нужен ИИ, от того, где хватит обычной автоматизации",
  "Говорим, с чего имеет смысл начать — и стоит ли начинать вообще",
]

const WHAT_WE_DONT = [
  "Не показываем презентацию о себе",
  "Не обещаем процентов экономии, которых никто не измерял",
  "Не просим бюджет, ТЗ и список систем заранее",
  "Не продаём на звонке — если задача не наша, скажем об этом",
]

const FAQ = [
  {
    question: "Это бесплатно?",
    answer:
      "Да. Сорок минут разговора — бесплатно и ни к чему не обязывает. Платный этап начинается дальше, если вы решите заказать диагностику.",
  },
  {
    question: "Что нужно подготовить?",
    answer:
      "Ничего. Достаточно, чтобы на звонке был человек, который знает, как процесс устроен на практике. Документы и доступы на этом этапе не нужны.",
  },
  {
    question: "А если у нас ещё нет задачи для ИИ?",
    answer:
      "Это нормальная и частая ситуация — именно для неё разбор и придуман. Мы посмотрим, где вообще уходит время, и честно скажем, если автоматизировать там нечего.",
  },
  {
    question: "Кто будет на звонке с вашей стороны?",
    answer:
      "Тот, кто будет вести задачу дальше, — без менеджера-посредника. Если нужна отраслевая экспертиза, подключим профильного специалиста.",
  },
  {
    question: "Подписываете NDA?",
    answer:
      "Да, если он нужен до содержательного разговора. Для самого разбора конфиденциальные данные обычно не требуются — мы говорим о процессе, а не о его содержимом.",
  },
]

export default function RazborPage() {
  const slots = nextSlots()

  const jsonLd = [
    breadcrumbListSchema([
      { name: "Главная", url: SITE_URL },
      { name: "Разбор процесса", url: `${SITE_URL}/razbor` },
    ]),
    faqPageSchema(FAQ),
  ]

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="border-b border-[var(--rule)]">
        <div className="mx-auto px-5 md:px-8" style={{ maxWidth: "var(--content-max)" }}>
          <div className="pt-14 md:pt-20 pb-12 grid lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-16 items-start">
            <div>
              <p className="eyebrow mb-6">Первый шаг · бесплатно</p>
              <h1
                className="display"
                style={{
                  fontSize: "clamp(2rem, 4.4vw, 3.9rem)",
                  lineHeight: 1.05,
                  letterSpacing: "-0.025em",
                  fontVariationSettings: '"opsz" 48',
                  marginBottom: "22px",
                  animation: "none",
                }}
              >
                Разберём один процесс.{" "}
                <span style={{ color: "var(--ink-3)", fontStyle: "italic" }}>
                  Сорок минут.
                </span>
              </h1>
              <p
                className="text-[var(--ink-2)] leading-[1.7] max-w-[560px]"
                style={{ fontSize: "clamp(1rem, 1.2vw, 1.12rem)" }}
              >
                Возьмём одну вашу рабочую операцию и посмотрим, из чего она
                состоит, где уходит время и есть ли там что автоматизировать.
                Без презентаций о себе. Если автоматизировать нечего — так
                и скажем, это тоже результат.
              </p>
            </div>

            <div className="lg:pt-16">
              <div
                className="border-l-2 pl-6"
                style={{ borderColor: "var(--cobalt)" }}
              >
                <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--ink-3)] mb-3">
                  Что дальше
                </p>
                <p className="text-[var(--ink-2)] text-[14.5px] leading-[1.65]">
                  После разбора вы получите короткое письменное резюме: какой
                  процесс смотрели, что в нём видно и какой следующий шаг имеет
                  смысл. Дальше решаете вы — продолжать диагностикой или нет.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Что делаем / чего не делаем ──────────────────────────── */}
      <section
        className="border-b border-[var(--rule)]"
        style={{ background: "var(--paper-2)", paddingTop: "var(--s-8)", paddingBottom: "var(--s-8)" }}
      >
        <div className="mx-auto px-5 md:px-8" style={{ maxWidth: "var(--content-max)" }}>
          <div className="grid md:grid-cols-2 gap-10 md:gap-16">
            <div>
              <p className="eyebrow mb-6">Что успеваем за 40 минут</p>
              <ul className="flex flex-col gap-3.5">
                {WHAT_WE_DO.map((t) => (
                  <li
                    key={t}
                    className="flex items-baseline gap-3 text-[var(--ink-2)]"
                    style={{ fontSize: "15px", lineHeight: 1.55 }}
                  >
                    <span className="font-mono text-[var(--cobalt)] shrink-0" style={{ fontSize: "12px" }}>
                      →
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow mb-6">Чего не будет</p>
              <ul className="flex flex-col gap-3.5">
                {WHAT_WE_DONT.map((t) => (
                  <li
                    key={t}
                    className="flex items-baseline gap-3 text-[var(--ink-3)]"
                    style={{ fontSize: "15px", lineHeight: 1.55 }}
                  >
                    <span className="font-mono text-[var(--ink-4)] shrink-0" style={{ fontSize: "12px" }}>
                      —
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Форма ────────────────────────────────────────────────── */}
      <section
        className="border-b border-[var(--rule)]"
        style={{ paddingTop: "var(--s-8)", paddingBottom: "var(--s-9)" }}
      >
        <div className="mx-auto px-5 md:px-8" style={{ maxWidth: "780px" }}>
          <h2
            className="display mb-3"
            style={{
              fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
              letterSpacing: "-0.022em",
              lineHeight: 1.1,
              animation: "none",
            }}
          >
            Три поля — и договоримся о времени.
          </h2>
          <p className="text-[var(--ink-2)] text-[15px] leading-[1.65] mb-10 max-w-[56ch]">
            Отвечаем в течение рабочего дня. Если удобнее сразу голосом —{" "}
            <span className="whitespace-nowrap">{PHONE_HUMAN}</span>, если
            письменно — {TELEGRAM_HANDLE}.
          </p>

          <LeadForm
            source="RAZBOR"
            slots={slots}
            page="/razbor"
            submitLabel="Записаться на разбор"
          />
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────── */}
      <section style={{ paddingTop: "var(--s-8)", paddingBottom: "var(--s-9)" }}>
        <div className="mx-auto px-5 md:px-8" style={{ maxWidth: "var(--content-max)" }}>
          <p className="eyebrow mb-8">Вопросы</p>
          <div className="grid md:grid-cols-2 gap-x-16 gap-y-8">
            {FAQ.map((f) => (
              <div key={f.question}>
                <h3
                  className="display mb-2"
                  style={{
                    fontSize: "17px",
                    fontWeight: 500,
                    letterSpacing: "-0.012em",
                    lineHeight: 1.3,
                    animation: "none",
                  }}
                >
                  {f.question}
                </h3>
                <p className="text-[var(--ink-2)] leading-[1.65]" style={{ fontSize: "14.5px" }}>
                  {f.answer}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-12 text-[14px] text-[var(--ink-3)]">
            Уже понимаете, что нужно, и хотите смету?{" "}
            <Link
              href="/brief"
              className="text-[var(--cobalt)] hover:underline underline-offset-4"
            >
              Заполните бриф →
            </Link>
          </p>
        </div>
      </section>
    </>
  )
}
