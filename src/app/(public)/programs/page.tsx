import type { Metadata } from "next"
import Link from "next/link"
import JsonLd from "@/components/JsonLd"
import CtaLink from "@/components/public/CtaLink"
import { SITE_URL, breadcrumbListSchema, faqPageSchema, serviceSchema } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Корпоративные программы по ИИ",
  description:
    "Практические программы по искусственному интеллекту для руководителей, подразделений и отраслевых организаций. На выходе — не сертификат, а список процессов вашей организации, с которых имеет смысл начать.",
  alternates: { canonical: "/programs" },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/programs`,
    title: "Корпоративные программы по ИИ — Veretennikov Studio",
    description:
      "Для руководителей, для подразделения, стратегическая сессия. Результат — карта процессов организации, а не сертификат.",
    siteName: "Veretennikov Studio",
    locale: "ru_RU",
  },
}

const FORMATS = [
  {
    n: "01",
    title: "Для руководителей",
    duration: "3–4 часа",
    audience: "Первые лица, дирекция, руководители направлений. 10–80 человек.",
    body:
      "Непрерывная лестница понимания: чем нейросеть отличается от обычной программы, что она делает хорошо, где ошибается, что такое корпоративный контур и почему подписка на чат — это ещё не результат. Без технической подготовки и без обещаний.",
    result: [
      "Общий язык у управленческой команды — дальше можно обсуждать задачи, а не термины",
      "Понимание, где ИИ даёт эффект, а где это дорогая замена обычной автоматизации",
      "Рамка ответственности: что можно поручать, что нужно проверять, чего нельзя",
    ],
  },
  {
    n: "02",
    title: "Для подразделения",
    duration: "1–2 дня",
    audience: "Отдел или функция целиком: продажи, документооборот, техническая служба, аналитика.",
    body:
      "Работаем на реальных процессах подразделения, а не на абстрактных примерах. Разбираем, что люди делают руками каждый день, и вместе смотрим, что из этого можно переложить — и на что именно.",
    result: [
      "Разобранные процессы подразделения с оценкой трудозатрат",
      "Список задач-кандидатов, отсортированный по соотношению «эффект / сложность»",
      "Понимание границ: что подразделение может сделать само уже сейчас",
    ],
  },
  {
    n: "03",
    title: "Стратегическая AI-сессия",
    duration: "1 день",
    audience: "Управленческая команда, готовая принимать решения на месте.",
    body:
      "Не обучение, а рабочая сессия. Строим карту процессов организации, отбираем 3–5 кандидатов на автоматизацию и по каждому проговариваем, что нужно проверить и чем измерять эффект.",
    result: [
      "Карта процессов организации, собранная руками самой команды",
      "3–5 процессов-кандидатов с обоснованием выбора",
      "Решение, с какого начинать, и что для этого нужно от организации",
    ],
  },
]

const AUDIENCE = [
  "Промышленные предприятия и производственные холдинги",
  "Отраслевые союзы и объединения",
  "Торгово-промышленные палаты",
  "Технопарки и институты развития",
  "Корпоративные университеты и HR-подразделения",
  "Управленческие команды среднего бизнеса",
]

const FAQ = [
  {
    question: "Чем это отличается от обычного семинара про ChatGPT?",
    answer:
      "Тем, что мы не показываем сервисы, а разбираем процессы. Материал построен вокруг того, как руководитель принимает решения и что он может поручить, а не вокруг интерфейсов, которые изменятся через полгода.",
  },
  {
    question: "Что получает организация на выходе?",
    answer:
      "Не сертификат. Список процессов вашей организации, которые имеет смысл разобрать первыми, с аргументацией, почему именно эти. Дальше по этому списку можно работать самим, с нами или с любым другим подрядчиком.",
  },
  {
    question: "Нужна ли участникам техническая подготовка?",
    answer:
      "Нет. Программа рассчитана на руководителей без технического бэкграунда. Термины вводятся по мере необходимости и всегда через рабочий пример, а не через определение.",
  },
  {
    question: "Можно ли адаптировать под нашу отрасль?",
    answer:
      "Да, и мы это делаем всегда: примеры и разборы строятся на процессах, которые аудитория узнаёт как свои. Для этого нужен предварительный разговор с организатором и, желательно, с двумя-тремя участниками.",
  },
  {
    question: "Что происходит после программы?",
    answer:
      "Ничего автоматически. Если по итогам появляется конкретная задача, следующий шаг — разбор процесса на сорок минут, а дальше диагностика. Программа не обязывает продолжать работу с нами.",
  },
  {
    question: "Сколько это стоит?",
    answer:
      "Зависит от формата, объёма подготовки под вашу отрасль и числа участников. Называем стоимость после короткого разговора с организатором.",
  },
]

export default function ProgramsPage() {
  const jsonLd = [
    breadcrumbListSchema([
      { name: "Главная", url: SITE_URL },
      { name: "Программы по ИИ", url: `${SITE_URL}/programs` },
    ]),
    serviceSchema({
      name: "Корпоративные программы по искусственному интеллекту",
      description:
        "Практические программы по ИИ для руководителей, подразделений и отраслевых организаций.",
      url: `${SITE_URL}/programs`,
      serviceType: "Корпоративное обучение и стратегические сессии по искусственному интеллекту",
    }),
    faqPageSchema(FAQ),
  ]

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* Hero */}
      <section className="border-b border-[var(--rule)]">
        <div className="mx-auto px-5 md:px-8" style={{ maxWidth: "var(--content-max)" }}>
          <div className="pt-12 md:pt-16 pb-11">
            <p className="eyebrow mb-6">Корпоративные программы · для организаций</p>
            <h1
              className="display"
              style={{
                fontSize: "clamp(1.9rem, 4.2vw, 3.6rem)",
                lineHeight: 1.06,
                letterSpacing: "-0.025em",
                fontVariationSettings: '"opsz" 48',
                marginBottom: "20px",
                maxWidth: "21ch",
                animation: "none",
              }}
            >
              Результат программы — не сертификат,{" "}
              <span style={{ color: "var(--ink-3)", fontStyle: "italic" }}>
                а список процессов, с которых стоит начать.
              </span>
            </h1>
            <p
              className="text-[var(--ink-2)] leading-[1.7]"
              style={{ fontSize: "clamp(1rem, 1.2vw, 1.12rem)", maxWidth: "62ch" }}
            >
              Практические программы по искусственному интеллекту для
              руководителей и организаций. Строятся вокруг авторской методики
              «Понять → Поручить → Проверить → Перестроить» и работают
              на процессах вашей организации, а не на абстрактных примерах.
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-9">
              <CtaLink
                href="/razbor"
                goalName="programs_cta"
                goalParams={{ place: "hero" }}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[var(--ink)] text-[var(--paper)] text-[14px] font-medium rounded-full hover:bg-[var(--cobalt)] transition-colors"
              >
                Обсудить программу
                <span aria-hidden>→</span>
              </CtaLink>
              <Link
                href="/diagnostika"
                className="inline-flex items-center px-7 py-3.5 border border-[var(--ink-3)] text-[var(--ink)] text-[14px] rounded-full hover:bg-[var(--paper-1)] transition-colors"
              >
                Что дальше после программы
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Где проводили */}
      <section
        className="border-b border-[var(--rule)]"
        style={{ background: "var(--paper-2)", paddingTop: "var(--s-8)", paddingBottom: "var(--s-8)" }}
      >
        <div className="mx-auto px-5 md:px-8" style={{ maxWidth: "var(--content-max)" }}>
          <p className="eyebrow mb-8">Где проводили · 02</p>
          <div className="grid md:grid-cols-2 gap-10 md:gap-16">
            <div>
              <div className="border-t border-[var(--rule)] py-6">
                <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--cobalt)] mb-2">
                  Август 2026
                </p>
                <h3
                  className="display mb-2"
                  style={{ fontSize: "19px", fontWeight: 500, letterSpacing: "-0.015em", lineHeight: 1.25, animation: "none" }}
                >
                  Уральская торгово-промышленная палата
                </h3>
                <p className="text-[var(--ink-2)] leading-[1.6]" style={{ fontSize: "14.5px" }}>
                  Программа «ИИ в работе руководителя» для первых лиц
                  предприятий — членов Палаты. Включала разбор процессов самой
                  Палаты и интерактивный финал, где зал собирал карту
                  собственных процессов с телефонов.
                </p>
              </div>
              <div className="border-t border-b border-[var(--rule)] py-6">
                <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--ink-3)] mb-2">
                  2026
                </p>
                <h3
                  className="display mb-2"
                  style={{ fontSize: "19px", fontWeight: 500, letterSpacing: "-0.015em", lineHeight: 1.25, animation: "none" }}
                >
                  Технопарк «Университетский»
                </h3>
                <p className="text-[var(--ink-2)] leading-[1.6]" style={{ fontSize: "14.5px" }}>
                  Программа по ИИ для аудитории технопарка — резидентов
                  и приглашённых руководителей.
                </p>
              </div>
            </div>

            <div className="lg:pt-6">
              <div className="border-l-2 pl-6" style={{ borderColor: "var(--cobalt)" }}>
                <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--ink-3)] mb-3">
                  Почему это работает
                </p>
                <p className="text-[var(--ink-2)] leading-[1.65] mb-4" style={{ fontSize: "15px" }}>
                  По этому каналу уже получены прямые входящие запросы: после
                  программы к нам обращались за разбором конкретных задач
                  организации. Это ожидаемо — в зале сидят те, кто может
                  назвать процесс и принять решение о его изменении.
                </p>
                <p className="text-[var(--ink-3)] leading-[1.6]" style={{ fontSize: "13.5px" }}>
                  Мы не называем перечисленные организации клиентами:
                  с ними были проведены программы и аналитическая проработка,
                  а не коммерческие проекты внедрения.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Форматы */}
      <section className="border-b border-[var(--rule)]" style={{ paddingTop: "var(--s-8)", paddingBottom: "var(--s-8)" }}>
        <div className="mx-auto px-5 md:px-8" style={{ maxWidth: "var(--content-max)" }}>
          <p className="eyebrow mb-9">Три формата · 03</p>
          <div>
            {FORMATS.map((f, i) => (
              <div
                key={f.n}
                className="scroll-reveal grid grid-cols-1 lg:grid-cols-[64px_240px_1fr_1fr] gap-y-4 lg:gap-6 border-t border-[var(--rule)] py-8"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <div
                  className="font-mono leading-none"
                  style={{ fontSize: "clamp(26px, 3.2vw, 38px)", color: i === 0 ? "var(--cobalt)" : "var(--ink-3)" }}
                >
                  {f.n}
                </div>
                <div>
                  <h2
                    className="display mb-1.5"
                    style={{ fontSize: "clamp(19px, 2.2vw, 26px)", fontWeight: 500, letterSpacing: "-0.018em", lineHeight: 1.12, animation: "none" }}
                  >
                    {f.title}
                  </h2>
                  <p className="font-mono text-[11px] tracking-[0.04em] text-[var(--cobalt)] mb-2">
                    {f.duration}
                  </p>
                  <p className="text-[var(--ink-3)] leading-[1.5]" style={{ fontSize: "13px" }}>
                    {f.audience}
                  </p>
                </div>
                <p className="text-[var(--ink-2)] leading-[1.6]" style={{ fontSize: "14px" }}>
                  {f.body}
                </p>
                <div>
                  <p className="font-mono text-[9.5px] tracking-[0.16em] uppercase text-[var(--ink-4)] mb-2.5">
                    Что остаётся у организации
                  </p>
                  <ul className="flex flex-col gap-2">
                    {f.result.map((r) => (
                      <li
                        key={r}
                        className="flex items-baseline gap-2.5 text-[var(--ink-2)]"
                        style={{ fontSize: "13.5px", lineHeight: 1.5 }}
                      >
                        <span className="font-mono text-[var(--cobalt)] shrink-0" style={{ fontSize: "11px" }}>→</span>
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Методика */}
      <section
        style={{ background: "var(--ink)", color: "var(--paper)", paddingTop: "var(--s-9)", paddingBottom: "var(--s-9)" }}
      >
        <div className="mx-auto px-5 md:px-8" style={{ maxWidth: "var(--content-max)" }}>
          <p
            className="font-mono mb-7"
            style={{ fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "oklch(70% 0.02 75)" }}
          >
            Методика · 04
          </p>
          <h2
            className="display mb-10"
            style={{
              fontSize: "clamp(1.9rem, 4vw, 3.2rem)",
              lineHeight: 1.06,
              letterSpacing: "-0.025em",
              color: "var(--paper)",
              maxWidth: "22ch",
              animation: "none",
            }}
          >
            Понять → Поручить → Проверить → Перестроить
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px" style={{ background: "oklch(28% 0.04 255)" }}>
            {[
              ["Понять", "Чем модель отличается от программы, что она делает хорошо и где ошибается предсказуемо."],
              ["Поручить", "Как ставить задачу так, чтобы результат был воспроизводимым, а не удачным."],
              ["Проверить", "Как принимать работу: что смотреть, чему не верить, где обязательно нужен человек."],
              ["Перестроить", "Как из отдельных задач получается изменённый процесс — и когда этого делать не надо."],
            ].map(([t, d], i) => (
              <div key={t} style={{ padding: "26px 24px", background: "var(--ink)" }}>
                <div
                  className="font-mono mb-3"
                  style={{ fontSize: "10.5px", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--cobalt-tint)" }}
                >
                  {String(i + 1).padStart(2, "0")} · {t}
                </div>
                <p style={{ fontSize: "14px", color: "oklch(88% 0.015 75)", lineHeight: 1.55 }}>{d}</p>
              </div>
            ))}
          </div>
          <p
            className="mt-8 leading-[1.65]"
            style={{ fontSize: "14.5px", color: "oklch(78% 0.02 75)", maxWidth: "62ch" }}
          >
            Главная мысль, к которой всё сходится: ИИ должен упрощать работу
            руководителя, а не создавать ему новую профессию.
          </p>
        </div>
      </section>

      {/* Кому + связка */}
      <section className="border-b border-[var(--rule)]" style={{ paddingTop: "var(--s-8)", paddingBottom: "var(--s-8)" }}>
        <div className="mx-auto px-5 md:px-8" style={{ maxWidth: "var(--content-max)" }}>
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
            <div>
              <p className="eyebrow mb-7">Для кого · 05</p>
              <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
                {AUDIENCE.map((a) => (
                  <li
                    key={a}
                    className="flex items-baseline gap-2.5 text-[var(--ink-2)] border-t border-[var(--rule)] pt-3"
                    style={{ fontSize: "14px", lineHeight: 1.45 }}
                  >
                    {a}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow mb-7">Что дальше · 06</p>
              <div className="flex flex-col gap-4">
                {[
                  ["Программа", "Общий язык и список процессов-кандидатов"],
                  ["Разбор процесса", "40 минут по одному конкретному процессу — бесплатно"],
                  ["Диагностика", "Замер, гипотезы, план на 30–90 дней"],
                  ["Пилот", "Один процесс с измеримым эффектом"],
                ].map(([t, d], i) => (
                  <div key={t} className="flex items-baseline gap-4">
                    <span className="font-mono text-[11px] text-[var(--ink-4)] shrink-0 w-6">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p
                        className="display"
                        style={{ fontSize: "16px", fontWeight: 500, letterSpacing: "-0.012em", animation: "none" }}
                      >
                        {t}
                      </p>
                      <p className="text-[var(--ink-3)] leading-[1.5]" style={{ fontSize: "13.5px" }}>
                        {d}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[var(--ink-3)] leading-[1.6] mt-6" style={{ fontSize: "13.5px", maxWidth: "44ch" }}>
                Ни один шаг не обязывает переходить к следующему. Программа —
                самостоятельный продукт, и её можно заказать, не планируя
                никакого внедрения.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        className="border-b border-[var(--rule)]"
        style={{ background: "var(--paper-2)", paddingTop: "var(--s-8)", paddingBottom: "var(--s-8)" }}
      >
        <div className="mx-auto px-5 md:px-8" style={{ maxWidth: "var(--content-max)" }}>
          <p className="eyebrow mb-8">Вопросы · 07</p>
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
              Проведём программу у вас.
            </h2>
            <p className="text-[var(--ink-2)] leading-[1.65] max-w-[52ch]" style={{ fontSize: "15.5px" }}>
              Расскажите, кто будет в зале и какие процессы у организации
              болят. Под это соберём содержание — примеры должны быть
              узнаваемыми, иначе программа не работает.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <CtaLink
              href="/razbor"
              goalName="programs_cta"
              goalParams={{ place: "footer" }}
              className="text-center px-7 py-4 bg-[var(--ink)] text-[var(--paper)] font-medium rounded-full hover:bg-[var(--cobalt)] transition-colors"
              style={{ fontSize: "14.5px" }}
            >
              Обсудить программу →
            </CtaLink>
            <Link
              href="/contact"
              className="text-center px-7 py-4 border border-[var(--ink-3)] text-[var(--ink)] rounded-full hover:bg-[var(--paper-1)] transition-colors"
              style={{ fontSize: "14.5px" }}
            >
              Другие способы связи
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
