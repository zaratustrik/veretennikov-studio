import type { Metadata } from "next"
import Link from "next/link"
import JsonLd from "@/components/JsonLd"
import {
  SITE_URL,
  breadcrumbListSchema,
  serviceSchema,
  faqPageSchema,
} from "@/lib/seo"

const PAGE_URL = `${SITE_URL}/services/mini-apps-games`

export const metadata: Metadata = {
  title: "Mini apps, Telegram WebApp и промо-игры для бизнеса",
  description:
    "Разрабатываем интерактивные mini apps, симуляторы, калькуляторы и брендированные игры для сайтов, выставок, HR-коммуникаций и обучения.",
  alternates: { canonical: "/services/mini-apps-games" },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Mini Apps & Brand Games — Veretennikov Studio",
    description:
      "Mini apps, Telegram WebApp, калькуляторы и игры для сайтов, выставок, HR и обучения. Интерактив, который удерживает внимание дольше, чем баннер.",
    siteName: "Veretennikov Studio",
    locale: "ru_RU",
  },
}

const CAPABILITIES = [
  "Интерактивные калькуляторы и конфигураторы продукта",
  "Симуляторы — пользователь «играет» с параметрами и видит результат",
  "Telegram WebApp для мероприятий, конференций и сообществ",
  "Игры для выставочного стенда и промо-кампаний",
  "Обучающие тренажёры — для клиентов, подрядчиков, новичков",
  "HR-игры для привлечения и оценки кандидатов",
  "Интерактивные карты, дашборды и квизы",
  "Mini apps под кейс на сайт или landing-page",
  "Web-стек: Three.js / R3F, WebGPU, Canvas, Phaser, PixiJS",
  "Аналитика поведения: что пробуют, где останавливаются, что конвертирует",
]

const SCENARIOS = [
  {
    title: "Игра для выставки",
    body:
      "Брендированная игра на стенде — посетитель играет 60–90 секунд, оставляет контакт за приз и уходит с положительным впечатлением о компании. Лиды собираются с тегами по результату.",
  },
  {
    title: "Калькулятор экономии",
    body:
      "Пользователь вводит параметры (объём, нагрузка, текущий процесс) и сразу видит, сколько компания может сэкономить с вашим продуктом. Лучший инструмент для квалификации лидов на сайте.",
  },
  {
    title: "Симулятор продукта",
    body:
      "Сложный продукт можно «попробовать» до встречи с менеджером: настроить, посмотреть, как работает, увидеть пограничные сценарии. Снимает барьер первого касания.",
  },
  {
    title: "Обучающий тренажёр",
    body:
      "Интерактив для обучения подрядчиков, дистрибьюторов или сотрудников. С прогрессом, проверкой и сертификатом. Замена скучным презентациям и видеолекциям.",
  },
  {
    title: "HR-игра",
    body:
      "Игровой формат для привлечения молодых специалистов: студент или соискатель решает реальную задачу компании, лучшие получают офер или стажировку. Особенно сильно работает на конференциях.",
  },
  {
    title: "Telegram WebApp",
    body:
      "Mini app для мероприятия, сообщества или продукта. Расписание, регистрация, нетворкинг, голосования, материалы спикеров — всё внутри Telegram, без отдельного приложения.",
  },
  {
    title: "Промо-кампания",
    body:
      "Брендированная веб-игра или квиз под запуск продукта или ивент. Расшаривается, собирает контакты, генерит UGC и работает как контент в соцсетях ещё долго после запуска.",
  },
]

const TRIGGERS = [
  "Готовите выставочный стенд и хотите интерактивный объект-герой",
  "На сайте мало конверсий — пользователь уходит, не дождавшись ответа",
  "Запускаете продукт и нужен инструмент для первого касания",
  "Сложно объяснить экономику или технические параметры словами",
  "Нужен HR-инструмент для привлечения молодёжи",
  "Хотите выделиться на отраслевой конференции необычным форматом",
]

const FAQ = [
  {
    question: "Это разработка или геймдев?",
    answer:
      "Это веб-разработка с игровыми механиками. Мы не делаем коммерческие игры на Steam — мы делаем интерактивные инструменты для бизнеса: калькуляторы, симуляторы, mini apps, промо-игры. Используем web-стек (Three.js / R3F, WebGPU, Canvas, Phaser, PixiJS) — продукт работает в браузере без установки.",
  },
  {
    question: "Можно посмотреть, что вы умеете?",
    answer:
      "Да. У студии есть лаборатория с игровыми симуляциями — Conway's Game of Life и Particle Life. Это не клиентские проекты, а наши эксперименты с движками и интерфейсами. Можно потрогать вживую и понять подход — ссылка ниже.",
  },
  {
    question: "Подходит ли для Telegram WebApp?",
    answer:
      "Да, делаем Telegram WebApp как один из основных каналов размещения. Это удобно для мероприятий, сообществ, B2B-сервисов: пользователь не ставит отдельное приложение, всё работает внутри Telegram, авторизация через бота. Ограничения по железу и API учитываем на этапе проектирования.",
  },
  {
    question: "Можно ли встроить mini app на стенде?",
    answer:
      "Да. Это одно из основных применений. Mini app работает на планшете или сенсорном экране, синхронизируется с большим экраном, собирает данные о посетителях. Часто комбинируем с AI-консультантом — посетитель играет, а на выходе получает персональную презентацию. Подробнее на странице Expo Stand 4.0.",
  },
  {
    question: "Сколько занимает разработка?",
    answer:
      "От 3 недель за компактный калькулятор или квиз до 8 недель за полноценную игру с 3D, аналитикой и интеграцией с CRM. Концепция и дизайн — 1–2 недели. Разработка — 2–5 недель. Тестирование на разных устройствах и оптимизация — 1 неделя.",
  },
  {
    question: "Как формируется стоимость?",
    answer:
      "Зависит от сложности механики, объёма контента, наличия 3D-графики и интеграций. Точную смету собираем после согласования концепции — на этом этапе уже понятен стек, время на разработку и состав команды.",
  },
  {
    question: "Что нужно от компании для старта?",
    answer:
      "Понимание задачи: на каком этапе воронки работает инструмент, кто целевая аудитория, какой результат хотите получить (лиды, обучение, узнаваемость). Бренд-материалы. Если есть продуктовые данные или формулы расчёта — это сильно упрощает калькуляторы и симуляторы.",
  },
]

export default function MiniAppsGamesPage() {
  const jsonLd = [
    breadcrumbListSchema([
      { name: "Главная", url: SITE_URL },
      { name: "Услуги", url: `${SITE_URL}/services` },
      { name: "Mini Apps & Brand Games", url: PAGE_URL },
    ]),
    serviceSchema({
      name: "Mini Apps & Brand Games — мини-приложения и промо-игры",
      description:
        "Разработка интерактивных mini apps, симуляторов, калькуляторов и брендированных игр для сайтов, выставок, HR и обучения.",
      url: PAGE_URL,
      serviceType: "Разработка веб-приложений и интерактивных промо-инструментов",
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
            <span className="eyebrow">Service · 08</span>
            <span className="eyebrow text-center hidden md:block">
              Studio Quarterly
            </span>
            <span className="eyebrow text-right">3–8 недель</span>
          </div>

          <div className="pt-20 pb-12">
            <p className="eyebrow mb-7">Mini Apps & Brand Games</p>
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
              Мини-приложения{" "}
              <span style={{ color: "var(--ink-3)", fontStyle: "italic" }}>
                как инструмент продаж.
              </span>
            </h1>

            <p
              className="text-[var(--ink-2)] leading-[1.7] max-w-[680px] mb-10"
              style={{ fontSize: "clamp(1rem, 1.2vw, 1.1rem)" }}
            >
              Разрабатываем mini apps, Telegram WebApp, интерактивные
              калькуляторы, симуляторы продукта и брендированные игры для
              сайтов, выставок, HR и обучения. Не игра ради игры — инструмент,
              который помогает пользователю что-то понять, рассчитать или
              попробовать продукт до встречи с менеджером.
            </p>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <Link
                href="/brief?source=mini-apps-games"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[var(--ink)] text-[var(--paper)] text-[14px] font-medium rounded-full hover:bg-black transition-colors"
                style={{ transitionDuration: "220ms" }}
              >
                Обсудить mini app
                <span>→</span>
              </Link>
              <Link
                href="/lab"
                className="inline-flex items-center px-7 py-3.5 border border-[var(--ink-3)] text-[var(--ink)] text-[14px] rounded-full hover:bg-[var(--paper-1)] transition-colors"
              >
                Смотреть эксперименты в лаборатории
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
                Баннер ловит внимание на 3 секунды.{" "}
                <span style={{ color: "var(--ink-3)", fontStyle: "italic" }}>
                  Симулятор — на 3 минуты.
                </span>
              </h2>
            </div>
            <div
              className="lg:pt-3 space-y-5 text-[var(--ink-2)] leading-[1.75]"
              style={{ fontSize: "clamp(1rem, 1.15vw, 1.05rem)" }}
            >
              <p>
                Сложный продукт нельзя продать одной картинкой и слоганом.
                Пользователю нужно его «потрогать»: настроить параметры,
                посчитать выгоду, сравнить варианты, увидеть, как работает.
                Чем выше барьер первого касания, тем меньше пользователей
                доходит до разговора с менеджером.
              </p>
              <p className="text-[var(--ink-3)]">
                Интерактив снимает этот барьер. Калькулятор, симулятор,
                конфигуратор или брендированная игра удерживают внимание в 50–100
                раз дольше, чем баннер. И — что важнее — конвертируют в лид
                кратно лучше, потому что пользователь сам разобрался в
                ценности продукта, а не верит вам на слово.
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
              <p className="eyebrow mb-6">Что делаем · 03</p>
              <h2
                className="display"
                style={{
                  fontSize: "clamp(1.8rem, 3.2vw, 2.6rem)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                  animation: "none",
                }}
              >
                От калькулятора{" "}
                <span style={{ color: "var(--ink-3)", fontStyle: "italic" }}>
                  до промо-игры с 3D.
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
              Семь применений{" "}
              <span style={{ color: "var(--ink-3)", fontStyle: "italic" }}>
                в реальных задачах.
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

      {/* ── Live demo (Lab) ──────────────────────────────────────── */}
      <section
        className="border-b border-[var(--rule)]"
        style={{ paddingTop: "var(--s-9)", paddingBottom: "var(--s-9)" }}
      >
        <div
          className="mx-auto px-5 md:px-8"
          style={{ maxWidth: "var(--content-max)" }}
        >
          <div className="grid lg:grid-cols-[280px_1fr] gap-12 lg:gap-20 items-start">
            <div>
              <p className="eyebrow mb-6">Лаборатория · 05</p>
              <h2
                className="display"
                style={{
                  fontSize: "clamp(1.8rem, 3.2vw, 2.6rem)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                  animation: "none",
                }}
              >
                Можно потрогать{" "}
                <span style={{ color: "var(--ink-3)", fontStyle: "italic" }}>
                  до брифа.
                </span>
              </h2>
            </div>
            <div
              className="lg:pt-3 space-y-5 text-[var(--ink-2)] leading-[1.75]"
              style={{ fontSize: "clamp(1rem, 1.15vw, 1.05rem)" }}
            >
              <p>
                У студии есть лаборатория с игровыми симуляциями. Это не
                клиентские проекты — это наши эксперименты с движками,
                интерфейсами и производительностью. Что сейчас вживую крутится
                на сайте: <span className="text-[var(--ink)] font-medium">Conway&apos;s Game of Life</span> и{" "}
                <span className="text-[var(--ink)] font-medium">Particle Life</span> на
                Canvas + WebGPU.
              </p>
              <p className="text-[var(--ink-3)]">
                Лаборатория отвечает на простой вопрос: «А вообще они умеют?»
                Можно проверить руками — открыть, поиграть, посмотреть FPS на
                своём железе. Это лучше, чем читать про «опыт в разработке
                интерактивных приложений».
              </p>
              <Link
                href="/lab"
                className="inline-flex items-center gap-2 mt-2 text-[var(--cobalt)] hover:underline underline-offset-4"
                style={{ fontSize: "14px" }}
              >
                Открыть лабораторию <span aria-hidden>→</span>
              </Link>
            </div>
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
            Подход · 06
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
            Не игра{" "}
            <span style={{ fontStyle: "italic", color: "oklch(70% 0.02 75)" }}>
              ради игры,
            </span>{" "}
            а инструмент в{" "}
            <span style={{ color: "var(--cobalt-tint)" }}>воронке продаж.</span>
          </h2>

          <p
            className="leading-[1.75] max-w-[720px]"
            style={{
              fontSize: "clamp(1rem, 1.2vw, 1.15rem)",
              color: "oklch(85% 0.02 75)",
            }}
          >
            На рынке много «брендированных игр», в которые играют один раз и
            забывают. Они не работают, потому что не привязаны к продукту и
            воронке. Наши mini apps решают конкретную задачу: квалифицировать
            лида, объяснить продукт, обучить, привлечь кандидата. Метрика — не
            «сколько играли», а «сколько дошли до менеджера и закрыли сделку».
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
          <p className="eyebrow mb-7">Когда это нужно · 07</p>
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
              что нужен интерактив.
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
              <p className="eyebrow mb-6">FAQ · 08</p>
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
              href="/lab"
              className="inline-flex items-center px-5 py-2.5 border border-[var(--rule)] text-[var(--ink-2)] hover:text-[var(--ink)] hover:border-[var(--ink-3)] transition-colors"
              style={{ fontSize: "13px", borderRadius: 2 }}
            >
              Лаборатория
            </Link>
            <Link
              href="/services/expo-stand"
              className="inline-flex items-center px-5 py-2.5 border border-[var(--rule)] text-[var(--ink-2)] hover:text-[var(--ink)] hover:border-[var(--ink-3)] transition-colors"
              style={{ fontSize: "13px", borderRadius: 2 }}
            >
              Expo Stand 4.0
            </Link>
            <Link
              href="/services/digital-twin-visualization"
              className="inline-flex items-center px-5 py-2.5 border border-[var(--rule)] text-[var(--ink-2)] hover:text-[var(--ink)] hover:border-[var(--ink-3)] transition-colors"
              style={{ fontSize: "13px", borderRadius: 2 }}
            >
              Visual Digital Twin Lite
            </Link>
            <Link
              href="/services/ai-sales-assistant"
              className="inline-flex items-center px-5 py-2.5 border border-[var(--rule)] text-[var(--ink-2)] hover:text-[var(--ink)] hover:border-[var(--ink-3)] transition-colors"
              style={{ fontSize: "13px", borderRadius: 2 }}
            >
              AI Sales Assistant
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
              Хотите дать пользователю{" "}
              <span style={{ color: "var(--cobalt)" }}>что-то потрогать?</span>
            </h2>
            <p
              className="text-[var(--ink-2)] leading-[1.6] max-w-[560px]"
              style={{ fontSize: "15px" }}
            >
              Заполните бриф — отвечу лично в течение рабочего дня и предложу
              механику mini app под вашу задачу. Если хочется сначала
              посмотреть, что мы умеем — загляните в лабораторию.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <Link
              href="/brief?source=mini-apps-games"
              className="text-center px-7 py-4 bg-[var(--ink)] text-[var(--paper)] font-medium rounded-full hover:bg-black transition-colors"
              style={{ fontSize: "14px" }}
            >
              Обсудить mini app →
            </Link>
            <Link
              href="/lab"
              className="text-center px-7 py-4 border border-[var(--ink-3)] text-[var(--ink)] rounded-full hover:bg-[var(--paper-1)] transition-colors"
              style={{ fontSize: "14px" }}
            >
              Смотреть эксперименты
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
