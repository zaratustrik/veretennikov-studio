import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import HeroMarkVideo from "@/components/public/HeroMarkVideo";
import HeroDiagramMarkMobile from "@/components/public/HeroDiagramMarkMobile";
import FallbackPoster from "@/components/public/FallbackPoster";
import CtaLink from "@/components/public/CtaLink";
import JsonLd from "@/components/JsonLd";
import { faqPageSchema } from "@/lib/seo";
import { SITUATIONS } from "@/data/situations";
import { METHOD } from "@/data/method";

export const revalidate = 600;

/** Заказчики с опубликованными работами. Только выполненные проекты. */
const CLIENTS = [
  "Белоярская АЭС",
  "Ростелеком",
  "Уральские Авиалинии",
  "УБРиР",
  "Таркет",
  "УрФУ",
  "Технэкс",
  "Промэлектроника",
  "СКБ Контур",
  "Деловые Линии",
];

/** Витрина в блоке доказательств — три разных типа работы. */
const FEATURED_SLUGS = [
  "industrial-cooperation",
  "belojarskaya-aes",
  "road-analytics-platform",
];

const PARTNERSHIP: [string, string][] = [
  ["Размещение внутри контура", "Проектируем с расчётом на то, что данные не должны покидать вашу инфраструктуру. Требования к защите обсуждаем до начала работ."],
  ["44-ФЗ / 223-ФЗ", "Опыт участия в государственных закупках с 2014 года."],
  ["Старт за неделю", "От первого письма до подписанного брифа — 5–7 рабочих дней. Без многомесячного согласования."],
  ["Один договор", "Система, видео и интерактив — внутри одного контракта, если задача этого требует."],
  ["Гарантия 12 мес", "На разработку. Бесплатные правки в рамках брифа."],
  ["Без субподряда", "Постановку задачи и ответственность за результат не передаём никому."],
];

const FAQ = [
  {
    question: "Сколько это стоит?",
    answer:
      "Разбор процесса — бесплатно, 40 минут. Дальше стоимость зависит от объёма: сколько процессов смотрим, в каком состоянии данные, сколько нужно интеграций. После разбора называем вилку, после диагностики — точную сумму в смете, которая дальше не меняется.",
  },
  {
    question: "А если окажется, что ИИ нам не нужен?",
    answer:
      "Так бывает, и мы скажем об этом прямо. Часть задач дешевле и надёжнее решается обычной интеграцией или изменением регламента — тогда порекомендуем именно это. Отчёт остаётся у вас в любом случае.",
  },
  {
    question: "Данные не уйдут наружу?",
    answer:
      "Архитектуру размещения обсуждаем до начала работ. Для чувствительных данных проектируем решение так, чтобы они не покидали ваш контур, — с локальными моделями вместо внешних сервисов. Конкретные требования зависят от класса ваших данных, и это первый вопрос, который мы задаём.",
  },
  {
    question: "Кто будет поддерживать систему после сдачи?",
    answer:
      "Есть отдельный этап поддержки: переиндексация, мониторинг качества ответов, доработка. Но система остаётся вашей — с документацией и доступами, без привязки к нам. Если решите вести её сами, обучим вашу команду.",
  },
  {
    question: "Вы студия или ИТ-компания?",
    answer:
      "Компактная команда, где ядро ведёт задачу от постановки до результата, а под проект подключаются профильные специалисты — разработка, данные, 3D, съёмка, предметная экспертиза. Двенадцать лет мы делали сложные визуальные проекты для промышленности; последние годы — ещё и системы для их процессов.",
  },
  {
    question: "Работаете по 44-ФЗ и 223-ФЗ?",
    answer:
      "Да, опыт участия в государственных закупках с 2014 года. Документы и формы согласуем заранее, NDA подписываем до содержательного разговора.",
  },
];

function formatDuration(seconds: number | null): string {
  if (!seconds) return "";
  const m = Math.floor(seconds / 60);
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

export default async function HomePage() {
  const [featuredRaw, publicCount] = await Promise.all([
    prisma.case.findMany({
      where: { isPublic: true, slug: { in: FEATURED_SLUGS } },
    }),
    prisma.case.count({ where: { isPublic: true } }),
  ]);

  // Порядок задаём мы, а не база
  const featured = FEATURED_SLUGS.map((s) =>
    featuredRaw.find((c) => c.slug === s)
  ).filter((c): c is (typeof featuredRaw)[number] => Boolean(c));

  return (
    <>
      <JsonLd data={faqPageSchema(FAQ)} />

      {/* ── 01 · Hero ────────────────────────────────────────────── */}
      <section
        style={{ background: "var(--paper)" }}
        className="border-b border-[var(--rule)]"
      >
        <div className="mx-auto px-5 md:px-8" style={{ maxWidth: "var(--content-max)" }}>
          <div className="grid lg:grid-cols-[1fr_340px] gap-8 lg:gap-16 items-center pt-9 md:pt-14 pb-12 md:pb-18">
            {/* Mobile — компактная диаграмма, без видео */}
            <div className="lg:hidden order-first -mb-2">
              <HeroDiagramMarkMobile />
            </div>

            <div>
              <p
                className="anim-fade-up eyebrow mb-5"
                style={{ "--delay": "0.05s" } as React.CSSProperties}
              >
                ИИ и автоматизация процессов · Екатеринбург
              </p>

              <h1
                className="anim-fade-up display"
                style={{
                  fontSize: "clamp(1.95rem, 4.4vw, 4rem)",
                  lineHeight: 1.05,
                  letterSpacing: "-0.026em",
                  marginBottom: "20px",
                  fontVariationSettings: '"opsz" 48',
                  maxWidth: "19ch",
                  "--delay": "0.15s",
                } as React.CSSProperties}
              >
                Находим процессы, где ИИ окупается.{" "}
                <span style={{ color: "var(--ink-3)", fontStyle: "italic" }}>
                  И доводим их до работающей системы.
                </span>
              </h1>

              <p
                className="anim-fade-up text-[var(--ink-2)] leading-[1.6] mb-7 max-w-[560px]"
                style={{
                  fontSize: "clamp(0.95rem, 1.15vw, 1.08rem)",
                  "--delay": "0.3s",
                } as React.CSSProperties}
              >
                Разбираем, как работа устроена сейчас, считаем, сколько она
                стоит, и выбираем один процесс с измеримым эффектом.
                Дальше — пилот, внедрение, поддержка.
              </p>

              <div
                className="anim-fade-up flex flex-wrap items-center gap-3"
                style={{ "--delay": "0.4s" } as React.CSSProperties}
              >
                <CtaLink
                  href="/razbor"
                  goalName="razbor_cta"
                  goalParams={{ place: "hero" }}
                  className="inline-flex items-center gap-2 px-6 sm:px-7 py-3.5 bg-[var(--ink)] text-[var(--paper)] text-[14px] font-medium rounded-full hover:bg-[var(--cobalt)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cobalt)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--paper)]"
                  style={{ transitionDuration: "220ms" }}
                >
                  Разобрать процесс — 40 минут
                  <span aria-hidden>→</span>
                </CtaLink>
                <Link
                  href="/diagnostika"
                  className="inline-flex items-center px-6 sm:px-7 py-3.5 border border-[var(--ink-3)] text-[var(--ink)] text-[14px] rounded-full hover:bg-[var(--paper-1)] transition-colors"
                >
                  Как проходит диагностика
                </Link>
              </div>

              {/* Доказательство сразу под кнопками — не через шесть экранов */}
              <p
                className="anim-fade-up mt-6 text-[var(--ink-3)] leading-[1.55]"
                style={{
                  fontSize: "12.5px",
                  maxWidth: "62ch",
                  "--delay": "0.5s",
                } as React.CSSProperties}
              >
                12 лет проектов для промышленности и госсектора · Белоярская АЭС,
                Ростелеком, УБРиР, Таркет, Технэкс · в 2026 провели программы
                по ИИ для Уральской ТПП и Технопарка «Университетский»
              </p>
            </div>

            {/* Desktop — motion-марка */}
            <div className="hidden lg:block">
              <HeroMarkVideo />
            </div>
          </div>
        </div>
      </section>

      {/* ── 02 · Узнайте свою ситуацию ───────────────────────────── */}
      <section
        className="border-b border-[var(--rule)]"
        style={{ background: "var(--paper-2)", paddingTop: "var(--s-8)", paddingBottom: "var(--s-8)" }}
      >
        <div className="mx-auto px-5 md:px-8" style={{ maxWidth: "var(--content-max)" }}>
          <p className="eyebrow mb-4">С чем к нам приходят · 02</p>
          <h2
            className="display mb-10"
            style={{
              fontSize: "clamp(1.7rem, 3.4vw, 2.8rem)",
              letterSpacing: "-0.024em",
              lineHeight: 1.1,
              fontVariationSettings: '"opsz" 32',
              maxWidth: "24ch",
              animation: "none",
            }}
          >
            Найдите свою ситуацию.{" "}
            <span style={{ color: "var(--ink-3)", fontStyle: "italic" }}>
              Технологию подберём сами.
            </span>
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: "var(--rule)" }}>
            {SITUATIONS.map((s, i) => (
              <Link
                key={s.href + s.title}
                href={s.href}
                className="scroll-reveal group flex flex-col p-6 lg:p-7 hover:bg-[var(--paper-1)] transition-colors"
                style={{ background: "var(--paper-2)", animationDelay: `${i * 50}ms`, transitionDuration: "220ms" }}
              >
                <p className="font-mono text-[9.5px] tracking-[0.18em] uppercase text-[var(--ink-4)] mb-4 group-hover:text-[var(--cobalt)] transition-colors">
                  {s.tag}
                </p>
                <h3
                  className="display mb-3"
                  style={{
                    fontSize: "clamp(1.05rem, 1.35vw, 1.22rem)",
                    fontWeight: 500,
                    letterSpacing: "-0.014em",
                    lineHeight: 1.3,
                    animation: "none",
                  }}
                >
                  «{s.title}»
                </h3>
                <p className="text-[var(--ink-2)] leading-[1.6] mb-5 flex-1" style={{ fontSize: "13.5px" }}>
                  {s.answer}
                </p>
                <span className="font-mono text-[10.5px] tracking-[0.06em] uppercase text-[var(--ink-3)] group-hover:text-[var(--cobalt)] transition-colors">
                  Подробнее →
                </span>
              </Link>
            ))}
          </div>

          <p className="mt-8 text-[14px] text-[var(--ink-3)]">
            Не нашли себя в списке?{" "}
            <Link href="/razbor" className="text-[var(--cobalt)] hover:underline underline-offset-4">
              Разберём вашу ситуацию за 40 минут →
            </Link>
          </p>
        </div>
      </section>

      {/* ── 03 · Метод ───────────────────────────────────────────── */}
      <section className="border-b border-[var(--rule)]" style={{ paddingTop: "var(--s-9)", paddingBottom: "var(--s-9)" }}>
        <div className="mx-auto px-5 md:px-8" style={{ maxWidth: "var(--content-max)" }}>
          <div className="flex justify-between items-baseline mb-10 flex-wrap gap-5">
            <div>
              <p className="eyebrow mb-4">Как мы работаем · 03</p>
              <h2
                className="display"
                style={{
                  fontSize: "clamp(1.8rem, 4vw, 3.4rem)",
                  letterSpacing: "-0.025em",
                  lineHeight: 1.05,
                  fontVariationSettings: '"opsz" 48',
                  maxWidth: "22ch",
                  animation: "none",
                }}
              >
                Сначала считаем.{" "}
                <span style={{ fontStyle: "italic", color: "var(--ink-3)" }}>Потом строим.</span>
              </h2>
            </div>
            <p className="text-[var(--ink-2)] text-[14px] leading-[1.6] max-w-[34ch]">
              На каждом шаге есть точка возврата. Если ИИ не нужен — скажем
              об этом, и это тоже результат работы.
            </p>
          </div>

          <div>
            {METHOD.map((m, i) => (
              <div
                key={m.n}
                className="scroll-reveal grid grid-cols-1 lg:grid-cols-[70px_180px_1fr_1fr] gap-y-3 lg:gap-6 border-t border-[var(--rule)] py-8 lg:items-baseline"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div
                  className="font-mono leading-none"
                  style={{
                    fontSize: "clamp(28px, 3.6vw, 44px)",
                    color: i === 0 ? "var(--cobalt)" : "var(--ink-3)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {m.n}
                </div>

                <div>
                  {m.href ? (
                    <Link href={m.href} className="group inline-block">
                      <h3
                        className="display group-hover:text-[var(--cobalt)] transition-colors"
                        style={{
                          fontSize: "clamp(18px, 2.1vw, 25px)",
                          fontWeight: 500,
                          letterSpacing: "-0.018em",
                          lineHeight: 1.1,
                          animation: "none",
                        }}
                      >
                        {m.title}{" "}
                        <span className="font-mono text-[13px] align-middle" aria-hidden>→</span>
                      </h3>
                    </Link>
                  ) : (
                    <h3
                      className="display"
                      style={{
                        fontSize: "clamp(18px, 2.1vw, 25px)",
                        fontWeight: 500,
                        letterSpacing: "-0.018em",
                        lineHeight: 1.1,
                        animation: "none",
                      }}
                    >
                      {m.title}
                    </h3>
                  )}
                  <p className="font-mono text-[11px] tracking-[0.04em] text-[var(--ink-3)] mt-1.5">
                    {m.time}
                  </p>
                </div>

                <p className="text-[var(--ink-2)] leading-[1.6]" style={{ fontSize: "14px" }}>
                  {m.body}
                </p>

                <div>
                  <p className="font-mono text-[9.5px] tracking-[0.16em] uppercase text-[var(--ink-4)] mb-1.5">
                    На выходе
                  </p>
                  <p className="text-[var(--ink-2)] leading-[1.55] mb-3" style={{ fontSize: "13.5px" }}>
                    {m.output}
                  </p>
                  <p
                    className="leading-[1.5] pl-3"
                    style={{ fontSize: "12.5px", color: "var(--ink-3)", borderLeft: "1px solid var(--cobalt)" }}
                  >
                    {m.exit}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 04 · Доказательства ──────────────────────────────────── */}
      <section className="border-b border-[var(--rule)]" style={{ paddingTop: "var(--s-9)", paddingBottom: "var(--s-9)" }}>
        <div className="mx-auto px-5 md:px-8" style={{ maxWidth: "var(--content-max)" }}>
          <div className="flex justify-between items-baseline mb-10 flex-wrap gap-4">
            <p className="eyebrow">Доказательства · 04</p>
            <Link
              href="/cases"
              className="font-mono text-[12px] tracking-[0.06em] text-[var(--ink-2)] hover:text-[var(--cobalt)] transition-colors uppercase"
            >
              Все работы ({publicCount}) →
            </Link>
          </div>

          {featured.length > 0 && (
            <div className="grid md:grid-cols-3 gap-x-6 gap-y-10 mb-14">
              {featured.map((c, i) => (
                <Link
                  key={c.id}
                  href={`/show/${c.slug}`}
                  className="scroll-reveal group block"
                  style={{ animationDelay: `${i * 60}ms` }}
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
                      <FallbackPoster client={c.client} title={c.title} year={c.year} index={i + 1} type={c.type} />
                    )}
                    {c.type === "VIDEO" && c.duration ? (
                      <span
                        className="absolute bottom-3 right-3 font-mono text-[10px] tracking-[0.06em] text-white px-2 py-1"
                        style={{ background: "rgba(15, 26, 46, 0.65)", backdropFilter: "blur(8px)" }}
                      >
                        ▸ {formatDuration(c.duration)}
                      </span>
                    ) : null}
                  </div>
                  <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--ink-3)] mb-2 group-hover:text-[var(--cobalt)] transition-colors">
                    {c.client || "—"}
                  </p>
                  <h3
                    className="display text-[var(--ink)] mb-2"
                    style={{ fontSize: "1.06rem", lineHeight: 1.25, letterSpacing: "-0.012em", animation: "none" }}
                  >
                    {c.title}
                  </h3>
                  <p className="text-[var(--ink-3)] leading-[1.55] line-clamp-2" style={{ fontSize: "13px" }}>
                    {c.description}
                  </p>
                </Link>
              ))}
            </div>
          )}

          {/* Клиенты и программы разведены: это разные категории доверия */}
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 border-t border-[var(--rule)] pt-10">
            <div>
              <p className="font-mono text-[9.5px] tracking-[0.18em] uppercase text-[var(--ink-3)] mb-5">
                Выполненные проекты для
              </p>
              <div className="flex flex-wrap gap-x-5 gap-y-2.5">
                {CLIENTS.map((c) => (
                  <span key={c} className="text-[var(--ink-2)]" style={{ fontSize: "14.5px" }}>
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="font-mono text-[9.5px] tracking-[0.18em] uppercase text-[var(--ink-3)] mb-5">
                Программы и выступления, 2026
              </p>
              <p className="text-[var(--ink-2)] leading-[1.6] mb-3" style={{ fontSize: "14.5px" }}>
                Провели программы по ИИ для руководителей в Уральской
                торгово-промышленной палате и для аудитории Технопарка
                «Университетский».
              </p>
              <Link
                href="/programs"
                className="font-mono text-[11px] tracking-[0.06em] uppercase text-[var(--cobalt)] hover:underline underline-offset-4"
              >
                О программах →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 05 · Для крупных заказчиков ──────────────────────────── */}
      <section
        style={{
          background: "var(--ink)",
          color: "var(--paper)",
          paddingTop: "var(--s-9)",
          paddingBottom: "var(--s-9)",
        }}
      >
        <div className="mx-auto px-5 md:px-8" style={{ maxWidth: "var(--content-max)" }}>
          <p
            className="font-mono mb-7"
            style={{ fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "oklch(70% 0.02 75)" }}
          >
            Для крупных заказчиков · 05
          </p>
          <h2
            className="display mb-12"
            style={{
              fontSize: "clamp(1.9rem, 4vw, 3.4rem)",
              lineHeight: 1.06,
              letterSpacing: "-0.025em",
              fontVariationSettings: '"opsz" 60',
              color: "var(--paper)",
              maxWidth: "900px",
              animation: "none",
            }}
          >
            Удобно <span style={{ fontStyle: "italic", color: "oklch(70% 0.02 75)" }}>работать,</span>{" "}
            предсказуемо <span style={{ color: "var(--cobalt-tint)" }}>считать.</span>
          </h2>

          <div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-px border-t border-b"
            style={{ background: "oklch(28% 0.04 255)", borderColor: "oklch(28% 0.04 255)" }}
          >
            {PARTNERSHIP.map(([k, v], i) => (
              <div
                key={k}
                className="scroll-reveal"
                style={{ padding: "26px 24px", background: "var(--ink)", animationDelay: `${i * 50}ms` }}
              >
                <div
                  className="font-mono mb-2.5"
                  style={{ fontSize: "10.5px", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--cobalt-tint)" }}
                >
                  {k}
                </div>
                <div style={{ fontSize: "14.5px", color: "oklch(88% 0.015 75)", lineHeight: 1.55 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 06 · Второй контур ───────────────────────────────────── */}
      <section className="border-b border-[var(--rule)]" style={{ paddingTop: "var(--s-9)", paddingBottom: "var(--s-9)" }}>
        <div className="mx-auto px-5 md:px-8" style={{ maxWidth: "var(--content-max)" }}>
          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 items-start">
            <div>
              <p className="eyebrow mb-6">Второе направление · 06</p>
              <h2
                className="display mb-5"
                style={{
                  fontSize: "clamp(1.8rem, 3.6vw, 3rem)",
                  letterSpacing: "-0.024em",
                  lineHeight: 1.07,
                  fontVariationSettings: '"opsz" 40',
                  maxWidth: "20ch",
                  animation: "none",
                }}
              >
                Промышленное видео, 3D и интерактив.
              </h2>
              <p className="text-[var(--ink-2)] leading-[1.65] mb-5 max-w-[54ch]" style={{ fontSize: "15.5px" }}>
                Самостоятельное направление студии со своей историей
                и своим портфолио: визуально объясняем сложные продукты,
                технологии и процессы. Промышленные и корпоративные фильмы,
                3D-визуализация оборудования, анимация технологических
                процессов, VFX и motion, интерактивные модели, выставочные
                решения и digital-презентации.
              </p>
              <p className="text-[var(--ink-3)] leading-[1.6] mb-8 max-w-[54ch]" style={{ fontSize: "14px" }}>
                Двенадцать лет и десятки промышленных проектов — от съёмок
                в технологических зонах Белоярской АЭС до 3D-визуализации
                производственных процессов.
              </p>
              <CtaLink
                href="/production"
                goalName="production_cta"
                goalParams={{ place: "home" }}
                className="inline-flex items-center gap-2 px-7 py-3.5 border border-[var(--ink)] text-[var(--ink)] text-[14px] font-medium rounded-full hover:bg-[var(--ink)] hover:text-[var(--paper)] transition-colors"
              >
                Смотреть направление
                <span aria-hidden>→</span>
              </CtaLink>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                ["Промышленные фильмы", "съёмка в цехах и технологических зонах"],
                ["3D оборудования", "как устроено и как работает"],
                ["Анимация процессов", "то, что нельзя снять камерой"],
                ["Интерактив и выставки", "стенды, модели, project rooms"],
              ].map(([t, d]) => (
                <div key={t} className="p-5" style={{ background: "var(--paper-2)", borderRadius: 2 }}>
                  <p
                    className="display mb-1.5"
                    style={{ fontSize: "15px", fontWeight: 500, letterSpacing: "-0.01em", lineHeight: 1.25, animation: "none" }}
                  >
                    {t}
                  </p>
                  <p className="text-[var(--ink-3)] leading-[1.45]" style={{ fontSize: "12.5px" }}>
                    {d}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 07 · Вопросы ─────────────────────────────────────────── */}
      <section className="border-b border-[var(--rule)]" style={{ paddingTop: "var(--s-9)", paddingBottom: "var(--s-9)" }}>
        <div className="mx-auto px-5 md:px-8" style={{ maxWidth: "var(--content-max)" }}>
          <p className="eyebrow mb-8">Вопросы, которые задают · 07</p>
          <div className="grid md:grid-cols-2 gap-x-16 gap-y-9">
            {FAQ.map((f) => (
              <div key={f.question}>
                <h3
                  className="display mb-2.5"
                  style={{ fontSize: "17.5px", fontWeight: 500, letterSpacing: "-0.014em", lineHeight: 1.3, animation: "none" }}
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

      {/* ── 08 · Финальный CTA ───────────────────────────────────── */}
      <section style={{ paddingTop: "var(--s-9)", paddingBottom: "var(--s-10)" }}>
        <div
          className="mx-auto px-5 md:px-8 grid gap-9 lg:grid-cols-[1.5fr_1fr] lg:gap-14 lg:items-end"
          style={{ maxWidth: "var(--content-max)" }}
        >
          <div>
            <h2
              className="display mb-4"
              style={{
                fontSize: "clamp(2rem, 4.4vw, 4rem)",
                lineHeight: 1.03,
                letterSpacing: "-0.028em",
                fontVariationSettings: '"opsz" 60',
                animation: "none",
              }}
            >
              Начнём с одного процесса<span style={{ color: "var(--cobalt)" }}>.</span>
            </h2>
            <p className="text-[var(--ink-2)] leading-[1.65] max-w-[52ch]" style={{ fontSize: "15.5px" }}>
              Сорок минут, без презентаций. Разберём одну вашу операцию
              и скажем, есть ли там что автоматизировать. Если нет — так
              и скажем.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <CtaLink
              href="/razbor"
              goalName="razbor_cta"
              goalParams={{ place: "footer_cta" }}
              className="text-center px-7 py-4 bg-[var(--ink)] text-[var(--paper)] font-medium rounded-full hover:bg-[var(--cobalt)] transition-colors"
              style={{ fontSize: "14.5px" }}
            >
              Разобрать процесс →
            </CtaLink>
            <Link
              href="/diagnostika"
              className="text-center px-7 py-4 border border-[var(--ink-3)] text-[var(--ink)] rounded-full hover:bg-[var(--paper-1)] transition-colors"
              style={{ fontSize: "14.5px" }}
            >
              Как проходит диагностика
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
  );
}
