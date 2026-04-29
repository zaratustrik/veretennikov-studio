import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { prisma } from "@/lib/db"
import JsonLd from "@/components/JsonLd"
import FallbackPoster from "@/components/public/FallbackPoster"
import {
  SITE_URL,
  breadcrumbListSchema,
  serviceSchema,
  faqPageSchema,
} from "@/lib/seo"

const PAGE_URL = `${SITE_URL}/services/industrial-video`

export const metadata: Metadata = {
  title: "Промышленный и корпоративный фильм в Екатеринбурге",
  description:
    "Снимаем презентационные и корпоративные фильмы для заводов, производств, IT и B2B-компаний: сценарий, съёмка, VFX, 3D и инфографика. Объясняем сложное.",
  alternates: { canonical: "/services/industrial-video" },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Промышленный фильм — Veretennikov Studio",
    description:
      "Корпоративные фильмы для заводов, производств и B2B-компаний. Сценарий, съёмка, VFX, 3D, инфографика — внутри одной производственной логики.",
    siteName: "Veretennikov Studio",
    locale: "ru_RU",
  },
}

// ─── Curated featured cases (in display order) ─────────────────────
const FEATURED_SLUGS = [
  "belojarskaya-aes",
  "9vn3wPsEmvYiF3VibYT6ha",   // Парогенератор ПГм-15
  "pdVG48P5PMc5h6TCtctZoA",   // Автодор Р242
  "tarket",
  "8r45SdwNJrDMKBM8MDtCLo",   // NIPIGORMASH
  "6YA7dyiF3th9v3tRTcKu77",   // ПРОМЭЛЕКТРОНИКА · Презентационный фильм
  "8wjNKW31ftL3rGpAq2xCYu",   // ТЕХНЭКС · Презентационный фильм
  "kESPfvNod3wgWQYPMAecCX",   // БИОСМАРТ · Промо оборудования
  "wTWpUo7DmVKGGZT1gnCAvA",   // СГМ ИСЕТЬ · Промо светильника
]

const DELIVERABLES = [
  "Интервью и сценарная структура",
  "Режиссёрский сценарий и раскадровка",
  "Съёмка на производстве, в офисе, на локации",
  "Монтаж, цветокоррекция, саунд-дизайн",
  "VFX и compositing, clean-up кадров",
  "2D и 3D-инфографика, анимация технических процессов",
  "Адаптация под выставку, сайт, презентацию и соцсети",
  "Версии разной длительности из единого мастера",
]

const TRIGGERS = [
  "Запуск нового продукта или линейки",
  "Подготовка к выставке (ИННОПРОМ, отраслевые форумы)",
  "Юбилей компании или отчётный фильм",
  "Презентация для совета директоров или инвесторов",
  "Привлечение партнёров и заказчиков",
  "Объяснение цифровизации производства",
  "HR и бренд работодателя",
  "Обучение клиентов или сотрудников",
]

const FAQ = [
  {
    question: "Сколько занимает производство фильма?",
    answer:
      "От 7 до 14 недель в зависимости от объёма. Бриф и сценарий — 1–2 недели. Съёмка — 3–7 рабочих дней. Постпродакшн (монтаж, графика, VFX) — 4–8 недель. Срочный режим возможен с увеличенной командой и стоимостью.",
  },
  {
    question: "Можно ли сделать фильм без большой съёмочной группы?",
    answer:
      "Да. Для многих промышленных задач достаточно компактной команды из 3–5 человек, если заранее точно спланировать сценарий, локации и графику. Это часто экономит 30–40% бюджета без потери качества.",
  },
  {
    question: "Делаете ли вы графику и 3D?",
    answer:
      "Да. Для промышленных продуктов это обычно ключевая часть фильма — схемы, разрезы оборудования, технологические процессы, интерфейсы, инфографика. Делаем своими силами, без субподряда.",
  },
  {
    question: "Как формируется стоимость фильма?",
    answer:
      "Зависит от состава работ: длительности, количества съёмочных дней, объёма VFX и 3D, числа локаций и срока. Точную смету собираем после брифа и согласования сценарной структуры — на этом этапе уже понятен и состав команды, и оборудование.",
  },
  {
    question: "Что нужно подготовить со стороны компании?",
    answer:
      "Доступ на производственные площадки, согласования по безопасности, контактных людей для интервью, существующие технические материалы (3D-модели, схемы, фото). Если что-то не готово — поможем подготовить на этапе предпродакшна.",
  },
  {
    question: "Снимаете ли вы за пределами Екатеринбурга?",
    answer:
      "Да. Работали с производствами в Москве, Челябинске, ХМАО, Тюменской области, Татарстане. Логистика и командировки команды учитываются в смете отдельно.",
  },
]

export default async function IndustrialVideoPage() {
  // Pull featured cases by slug list, preserving display order
  const cases = await prisma.case.findMany({
    where: {
      isPublic: true,
      slug: { in: FEATURED_SLUGS },
    },
    select: {
      id: true, slug: true, client: true, title: true,
      year: true, posterUrl: true, type: true, duration: true,
    },
  })
  // Preserve manual order
  const orderedCases = FEATURED_SLUGS
    .map((slug) => cases.find((c) => c.slug === slug))
    .filter((c): c is NonNullable<typeof c> => Boolean(c))

  const jsonLd = [
    breadcrumbListSchema([
      { name: "Главная", url: SITE_URL },
      { name: "Услуги", url: `${SITE_URL}/services` },
      { name: "Промышленный фильм", url: PAGE_URL },
    ]),
    serviceSchema({
      name: "Промышленный и корпоративный фильм",
      description:
        "Презентационные и корпоративные фильмы для заводов, производств, IT и B2B-компаний: сценарий, съёмка, VFX, 3D и инфографика.",
      url: PAGE_URL,
      serviceType: "Видеопродакшн для промышленности и B2B",
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
            <span className="eyebrow">Service · 02</span>
            <span className="eyebrow text-center hidden md:block">
              Studio Quarterly
            </span>
            <span className="eyebrow text-right">7–14 недель</span>
          </div>

          <div className="pt-20 pb-12">
            <p className="eyebrow mb-7">Industrial Story Film</p>
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
              Промышленные фильмы,{" "}
              <span style={{ color: "var(--ink-3)", fontStyle: "italic" }}>
                которые объясняют
              </span>{" "}
              и продают.
            </h1>

            <p
              className="text-[var(--ink-2)] leading-[1.7] max-w-[680px] mb-10"
              style={{ fontSize: "clamp(1rem, 1.2vw, 1.1rem)" }}
            >
              Снимаем корпоративные и презентационные фильмы для заводов,
              производств, инженерных компаний и сложных B2B-продуктов. Соединяем
              сценарий, съёмку, VFX, 3D-графику и инфографику, чтобы зритель не
              просто увидел производство, а понял ценность компании.
            </p>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <Link
                href="/brief?source=industrial-video"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[var(--ink)] text-[var(--paper)] text-[14px] font-medium rounded-full hover:bg-black transition-colors"
                style={{ transitionDuration: "220ms" }}
              >
                Обсудить фильм
                <span>→</span>
              </Link>
              <a
                href="https://t.me/VeretennikovINFO"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 border border-[var(--ink-3)] text-[var(--ink)] text-[14px] rounded-full hover:bg-[var(--paper-1)] transition-colors"
              >
                Написать в Telegram
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
                Производство сложно показать{" "}
                <span style={{ color: "var(--ink-3)", fontStyle: "italic" }}>
                  понятно.
                </span>
              </h2>
            </div>
            <div
              className="lg:pt-3 space-y-5 text-[var(--ink-2)] leading-[1.75]"
              style={{ fontSize: "clamp(1rem, 1.15vw, 1.05rem)" }}
            >
              <p>
                У промышленной компании может быть сильный продукт, уникальное
                оборудование, опытная команда и серьёзные технологии. Но для клиента,
                партнёра или инвестора это часто остаётся набором цехов, станков,
                терминов и презентационных слайдов.
              </p>
              <p className="text-[var(--ink-3)]">
                Хороший фильм собирает всё в историю: что делает компания, почему это
                важно, как устроена технология и какую пользу получает заказчик. Это
                не отчёт «о работе предприятия» и не нарезка красивых кадров — это
                инструмент объяснения и доверия.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured cases ───────────────────────────────────────── */}
      {orderedCases.length > 0 && (
        <section
          className="border-b border-[var(--rule)]"
          style={{ paddingTop: "var(--s-9)", paddingBottom: "var(--s-9)" }}
        >
          <div
            className="mx-auto px-5 md:px-8"
            style={{ maxWidth: "var(--content-max)" }}
          >
            <div className="flex justify-between items-baseline mb-12 flex-wrap gap-4">
              <div>
                <p className="eyebrow mb-3">Кейсы · 03</p>
                <h2
                  className="display"
                  style={{
                    fontSize: "clamp(1.8rem, 3.2vw, 2.6rem)",
                    lineHeight: 1.1,
                    letterSpacing: "-0.02em",
                    animation: "none",
                  }}
                >
                  Что мы уже сняли{" "}
                  <span style={{ color: "var(--ink-3)", fontStyle: "italic" }}>
                    в этом формате.
                  </span>
                </h2>
              </div>
              <Link
                href="/cases?type=video"
                className="font-mono text-[12px] tracking-[0.06em] text-[var(--ink-2)] hover:text-[var(--cobalt)] transition-colors uppercase"
              >
                Все видеоработы →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
              {orderedCases.map((c, i) => {
                const idx = String(i + 1).padStart(2, "0")
                const dur = c.duration
                  ? `${Math.floor(c.duration / 60)}:${String(c.duration % 60).padStart(2, "0")}`
                  : ""

                return (
                  <Link
                    key={c.id}
                    href={`/show/${c.slug}`}
                    className="group block"
                  >
                    <div
                      className="relative w-full overflow-hidden bg-[var(--paper-2)] mb-4"
                      style={{ aspectRatio: "16 / 9", borderRadius: 2 }}
                    >
                      {c.posterUrl ? (
                        <Image
                          src={c.posterUrl}
                          alt={c.title}
                          fill
                          sizes="(min-width: 1024px) 384px, (min-width: 768px) 50vw, 100vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                        />
                      ) : (
                        <FallbackPoster
                          client={c.client}
                          title={c.title}
                          year={c.year}
                          index={i + 1}
                          type={c.type}
                        />
                      )}

                      <span
                        className="absolute top-3 left-3 font-mono text-[10px] tracking-[0.12em] text-white px-2 py-1"
                        style={{
                          background: "rgba(15, 26, 46, 0.65)",
                          backdropFilter: "blur(8px)",
                        }}
                      >
                        {idx}
                      </span>

                      {dur && (
                        <span
                          className="absolute bottom-3 right-3 font-mono text-[10px] tracking-[0.06em] text-white px-2 py-1"
                          style={{
                            background: "rgba(15, 26, 46, 0.65)",
                            backdropFilter: "blur(8px)",
                          }}
                        >
                          ▸ {dur}
                        </span>
                      )}

                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                        style={{ boxShadow: "inset 0 0 0 1px var(--cobalt)" }}
                      />
                    </div>

                    <div>
                      {c.client ? (
                        <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--ink-3)] mb-2 group-hover:text-[var(--cobalt)] transition-colors">
                          {c.client}
                        </p>
                      ) : (
                        <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--ink-4)] mb-2">
                          —
                        </p>
                      )}

                      <h3
                        className="display text-[var(--ink)]"
                        style={{
                          fontSize: "clamp(1rem, 1.3vw, 1.15rem)",
                          lineHeight: 1.25,
                          letterSpacing: "-0.012em",
                          animation: "none",
                        }}
                      >
                        {c.title}
                      </h3>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

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
                Полный цикл{" "}
                <span style={{ color: "var(--ink-3)", fontStyle: "italic" }}>
                  под одной командой.
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

      {/* ── Triggers ─────────────────────────────────────────────── */}
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
            Восемь типичных задач,{" "}
            <span style={{ color: "var(--ink-3)", fontStyle: "italic" }}>
              с которыми приходят клиенты.
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
            Сначала{" "}
            <span style={{ fontStyle: "italic", color: "oklch(70% 0.02 75)" }}>
              смысл,
            </span>{" "}
            потом <span style={{ color: "var(--cobalt-tint)" }}>камера.</span>
          </h2>

          <p
            className="leading-[1.75] max-w-[720px]"
            style={{
              fontSize: "clamp(1rem, 1.2vw, 1.15rem)",
              color: "oklch(85% 0.02 75)",
            }}
          >
            Мы начинаем не со съёмочного плана, а с вопроса: что зритель должен
            понять после просмотра? Только после этого собираем сценарий, визуальный
            язык, локации, графику и финальный темп фильма. Это разница между
            «красивым роликом» и фильмом, который реально работает на бизнес-задачу.
          </p>
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
              href="/cases?type=video"
              className="inline-flex items-center px-5 py-2.5 border border-[var(--rule)] text-[var(--ink-2)] hover:text-[var(--ink)] hover:border-[var(--ink-3)] transition-colors"
              style={{ fontSize: "13px", borderRadius: 2 }}
            >
              Все видеоработы
            </Link>
            <Link
              href="/lab"
              className="inline-flex items-center px-5 py-2.5 border border-[var(--rule)] text-[var(--ink-2)] hover:text-[var(--ink)] hover:border-[var(--ink-3)] transition-colors"
              style={{ fontSize: "13px", borderRadius: 2 }}
            >
              Лаборатория
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
              Хочется, чтобы фильм{" "}
              <span style={{ color: "var(--cobalt)" }}>работал на задачу?</span>
            </h2>
            <p
              className="text-[var(--ink-2)] leading-[1.6] max-w-[560px]"
              style={{ fontSize: "15px" }}
            >
              Заполните бриф — отвечу лично в течение рабочего дня и предложу
              сценарную идею с примерной сметой. Если не уверены, что именно нужно —
              начните с аудита.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <Link
              href="/brief?source=industrial-video"
              className="text-center px-7 py-4 bg-[var(--ink)] text-[var(--paper)] font-medium rounded-full hover:bg-black transition-colors"
              style={{ fontSize: "14px" }}
            >
              Обсудить фильм →
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
              Снимаем по всей России · NDA до брифа
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
