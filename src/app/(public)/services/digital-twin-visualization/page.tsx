import type { Metadata } from "next"
import Link from "next/link"
import JsonLd from "@/components/JsonLd"
import {
  SITE_URL,
  breadcrumbListSchema,
  serviceSchema,
  faqPageSchema,
} from "@/lib/seo"

const PAGE_URL = `${SITE_URL}/services/digital-twin-visualization`

export const metadata: Metadata = {
  title: "Визуальные цифровые двойники и 3D-визуализация процессов",
  description:
    "Делаем визуальные digital twin-макеты для продаж, обучения и презентаций: шахты, дороги, заводы, оборудование, инфраструктура. Не инженерный twin — понятная модель.",
  alternates: { canonical: "/services/digital-twin-visualization" },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Visual Digital Twin Lite — Veretennikov Studio",
    description:
      "3D/2.5D-макеты процессов, объектов и систем для продаж, обучения и презентаций. Сложная технология становится понятной картиной.",
    siteName: "Veretennikov Studio",
    locale: "ru_RU",
  },
}

const CAPABILITIES = [
  "3D-модель объекта или системы (производство, оборудование, инфраструктура)",
  "2.5D-схема процесса с этапами и связями",
  "Интерактивная карта с фильтрами и слоями",
  "Разрезы, сечения и схемы устройства",
  "Аналитический слой: данные, события, KPI",
  "Сценарные режимы — нормальный / аварийный / прогноз",
  "Привязка реальных данных из CRM, MES, SCADA",
  "Web- и десктоп-версии для встреч и выставок",
  "Документация и обучение команды продаж",
]

const EXAMPLES = [
  {
    title: "Карта шахты или производства",
    body:
      "Техника, маршруты, опасные зоны, смены, KPI участков. Используется для продаж услуг и обучения подрядчиков.",
  },
  {
    title: "Дорога или инфраструктура",
    body:
      "Трасса с ДТП, погодными факторами, плотностью трафика и аналитикой. Для презентаций решений по безопасности и мониторингу.",
  },
  {
    title: "Заводская линия",
    body:
      "Этапы производства, узкие места, материалы и логистика между цехами. Для встреч с инвесторами и B2B-клиентами.",
  },
  {
    title: "Оборудование в разрезе",
    body:
      "3D-модель агрегата с разрезами, узлами, технологическими процессами и интерфейсом обслуживания. Для продаж и обучения.",
  },
  {
    title: "Логистическая схема",
    body:
      "Цепочка поставок, склады, маршруты, временные окна. С симуляцией задержек и сценариев планирования.",
  },
  {
    title: "Диспетчерская и SCADA",
    body:
      "Визуальная модель оперативного контура: объекты, события, тревоги, метрики. Для демонстрации цифровизации.",
  },
]

const TRIGGERS = [
  "Продаёте сложную инфраструктуру и обычные слайды не объясняют ценность",
  "Нужно показать инвестору или совету директоров, как работает система",
  "Готовите выставочный стенд и хотите интерактивный объект-герой",
  "Запускаете обучение для подрядчиков или сотрудников",
  "Презентуете цифровизацию производства партнёрам",
  "Хотите оживить корпоративный фильм 3D-вставками с реальными данными",
]

const FAQ = [
  {
    question: "Это полноценный digital twin?",
    answer:
      "Нет. Мы делаем визуальный цифровой двойник — модель для продаж, обучения и презентаций. Это не тяжёлый инженерный twin для эксплуатации в реальном времени с интеграциями в SCADA. Если нужны такие задачи — мы можем подключиться визуальной частью к команде, которая делает инженерный контур.",
  },
  {
    question: "Используете реальные данные или это статичная модель?",
    answer:
      "По задаче. Часто достаточно сценариев на синтетических данных — модель показывает «как могло бы быть». Если есть выгрузка из CRM, MES или SCADA — подключаем реальные данные через API или импорт. Граница здесь — не технология, а цель использования модели.",
  },
  {
    question: "На каком стеке делаете визуализацию?",
    answer:
      "Зависит от задачи. Для web — Three.js / React Three Fiber, WebGPU, Cesium для гео-данных. Для тяжёлых сцен и фотореализма — Unreal Engine, Unity или Cinema 4D с экспортом в видео. Подбираем под формат демонстрации (встреча, сайт, выставка) и под бюджет.",
  },
  {
    question: "Можно ли использовать на выставочном стенде?",
    answer:
      "Да. Это одно из основных применений. Двойник работает на сенсорном экране, планшете или видеостене. Часто комбинируем с AI-консультантом и mini app — посетитель видит модель и сразу получает разбор по своему сегменту. Подробнее — на странице Expo Stand 4.0.",
  },
  {
    question: "Сколько занимает разработка?",
    answer:
      "От 6 до 12 недель. Концепция и сценарий — 1–2 недели. Сборка модели — 3–6 недель. Интерактивная логика и интерфейс — 2–4 недели. Срочные форматы возможны при готовых 3D-исходниках.",
  },
  {
    question: "Как формируется стоимость?",
    answer:
      "Зависит от детализации модели, числа сценариев, интерактивных слоёв и подключения данных. Точную смету собираем после согласования концепции — на этом этапе уже понятен стек, объём моделирования и сложность UX.",
  },
  {
    question: "Что нужно от компании для старта?",
    answer:
      "Описание объекта или процесса, существующие чертежи, схемы, фото или видео. Контактного человека, который знает технологию изнутри. Если есть готовые 3D-модели или CAD-файлы — это сильно ускоряет работу. Если нет — поможем собрать на этапе предпродакшна.",
  },
]

export default function DigitalTwinPage() {
  const jsonLd = [
    breadcrumbListSchema([
      { name: "Главная", url: SITE_URL },
      { name: "Услуги", url: `${SITE_URL}/services` },
      { name: "Visual Digital Twin Lite", url: PAGE_URL },
    ]),
    serviceSchema({
      name: "Visual Digital Twin Lite — визуальные цифровые двойники",
      description:
        "Визуальные digital twin-макеты для продаж, обучения и презентаций: шахты, дороги, заводы, оборудование, инфраструктура.",
      url: PAGE_URL,
      serviceType: "3D-визуализация и интерактивные цифровые двойники",
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
            <span className="eyebrow">Service · 05</span>
            <span className="eyebrow text-center hidden md:block">
              Studio Quarterly
            </span>
            <span className="eyebrow text-right">6–12 недель</span>
          </div>

          <div className="pt-20 pb-12">
            <p className="eyebrow mb-7">Visual Digital Twin Lite</p>
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
              Цифровой двойник{" "}
              <span style={{ color: "var(--ink-3)", fontStyle: "italic" }}>
                для продаж и обучения.
              </span>
            </h1>

            <p
              className="text-[var(--ink-2)] leading-[1.7] max-w-[680px] mb-10"
              style={{ fontSize: "clamp(1rem, 1.2vw, 1.1rem)" }}
            >
              Создаём 3D и 2.5D-макеты процессов, объектов и систем, чтобы
              сложную технологию можно было показать на встрече, выставке, сайте
              или обучении. Это не тяжёлый инженерный twin для эксплуатации —
              это понятная визуальная модель, которая помогает продавать,
              объяснять и обучать.
            </p>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <Link
                href="/brief?source=digital-twin-visualization"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[var(--ink)] text-[var(--paper)] text-[14px] font-medium rounded-full hover:bg-black transition-colors"
                style={{ transitionDuration: "220ms" }}
              >
                Обсудить визуализацию
                <span>→</span>
              </Link>
              <Link
                href="/cases"
                className="inline-flex items-center px-7 py-3.5 border border-[var(--ink-3)] text-[var(--ink)] text-[14px] rounded-full hover:bg-[var(--paper-1)] transition-colors"
              >
                Смотреть похожие кейсы
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
                Сложную систему{" "}
                <span style={{ color: "var(--ink-3)", fontStyle: "italic" }}>
                  нельзя показать слайдом.
                </span>
              </h2>
            </div>
            <div
              className="lg:pt-3 space-y-5 text-[var(--ink-2)] leading-[1.75]"
              style={{ fontSize: "clamp(1rem, 1.15vw, 1.05rem)" }}
            >
              <p>
                Шахта, завод, дорога, диспетчерская, цепочка поставок, тяжёлое
                оборудование — это системы, у которых много объектов, ролей,
                событий и данных. На слайде их можно только перечислить. На
                фотографии — только сфотографировать. Видео показывает фрагмент,
                но не структуру.
              </p>
              <p className="text-[var(--ink-3)]">
                Клиенту легче принять решение, когда он видит систему целиком:
                объект, процесс, роли, данные, события и результат. Визуальный
                двойник превращает техническую сложность в понятную картину —
                и одновременно работает как инструмент продаж, обучения и
                демонстрации экспертизы.
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
                От 3D-объекта{" "}
                <span style={{ color: "var(--ink-3)", fontStyle: "italic" }}>
                  до интерактивной модели с данными.
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

      {/* ── Examples ─────────────────────────────────────────────── */}
      <section
        className="border-b border-[var(--rule)] bg-[var(--paper-1)]"
        style={{ paddingTop: "var(--s-9)", paddingBottom: "var(--s-9)" }}
      >
        <div
          className="mx-auto px-5 md:px-8"
          style={{ maxWidth: "var(--content-max)" }}
        >
          <div className="mb-12">
            <p className="eyebrow mb-6">Примеры · 04</p>
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
              Шесть типов двойников,{" "}
              <span style={{ color: "var(--ink-3)", fontStyle: "italic" }}>
                которые мы умеем собирать.
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--rule)] border border-[var(--rule)]">
            {EXAMPLES.map((s, i) => (
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
            Не двойник{" "}
            <span style={{ fontStyle: "italic", color: "oklch(70% 0.02 75)" }}>
              для эксплуатации,
            </span>{" "}
            а для{" "}
            <span style={{ color: "var(--cobalt-tint)" }}>решения о покупке.</span>
          </h2>

          <p
            className="leading-[1.75] max-w-[720px]"
            style={{
              fontSize: "clamp(1rem, 1.2vw, 1.15rem)",
              color: "oklch(85% 0.02 75)",
            }}
          >
            Инженерный digital twin для управления реальным объектом — это
            месяцы интеграций, SCADA, сенсоры и ответственность за критическую
            инфраструктуру. Визуальный двойник работает иначе: его задача —
            помочь клиенту, инвестору или сотруднику быстро понять систему и
            принять решение. Меньше технологического стека, больше
            редакторской и продуктовой работы.
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
              что слайдов уже не хватает.
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
              href="/services/expo-stand"
              className="inline-flex items-center px-5 py-2.5 border border-[var(--rule)] text-[var(--ink-2)] hover:text-[var(--ink)] hover:border-[var(--ink-3)] transition-colors"
              style={{ fontSize: "13px", borderRadius: 2 }}
            >
              Expo Stand 4.0
            </Link>
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
              Хотите показать систему{" "}
              <span style={{ color: "var(--cobalt)" }}>целиком?</span>
            </h2>
            <p
              className="text-[var(--ink-2)] leading-[1.6] max-w-[560px]"
              style={{ fontSize: "15px" }}
            >
              Заполните бриф — отвечу лично в течение рабочего дня и предложу
              сценарий двойника с примерной концепцией. Если ещё не уверены, что
              нужно показать — начните с аудита.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <Link
              href="/brief?source=digital-twin-visualization"
              className="text-center px-7 py-4 bg-[var(--ink)] text-[var(--paper)] font-medium rounded-full hover:bg-black transition-colors"
              style={{ fontSize: "14px" }}
            >
              Обсудить визуализацию →
            </Link>
            <Link
              href="/audit"
              className="text-center px-7 py-4 border border-[var(--ink-3)] text-[var(--ink)] rounded-full hover:bg-[var(--paper-1)] transition-colors"
              style={{ fontSize: "14px" }}
            >
              Начать с аудита
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
