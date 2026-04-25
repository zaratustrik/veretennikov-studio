import Link from "next/link";
import HeroDiagramMark from "@/components/public/HeroDiagramMark";

const PROCESS = [
  {
    n: "01",
    t: "Бриф",
    d: "Знакомство, контекст задачи, ограничения. NDA до содержательного разговора.",
    time: "2–3 дня",
  },
  {
    n: "02",
    t: "Концепция",
    d: "Архитектура решения, сценарий, точная смета. Точка возврата без обязательств.",
    time: "1–2 нед",
  },
  {
    n: "03",
    t: "Производство",
    d: "Разработка, съёмка, монтаж. Демо каждые две недели, прозрачные правки.",
    time: "4–10 нед",
  },
  {
    n: "04",
    t: "Сдача",
    d: "Документация, обучение команды, премьера фильма. Гарантийная поддержка.",
    time: "1 нед",
  },
];

const PARTNERSHIP: [string, string][] = [
  ["Юр. лицо",     "ООО, НДС, договор. Все формы оплаты, акты, ЭДО."],
  ["44-ФЗ / 223-ФЗ", "Опыт участия в государственных закупках с 2014 года."],
  ["NDA до брифа", "Подписываем до содержательных обсуждений."],
  ["Один договор", "Разработка и видео — внутри одного контракта."],
  ["Гарантия 12 мес", "На разработку. Бесплатные правки в рамках брифа."],
  ["Без субподряда", "Ключевые роли — штатная команда студии."],
];

export default function HomePage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section
        style={{ background: "var(--paper)" }}
        className="border-b border-[var(--rule)]"
      >
        <div
          className="mx-auto px-8"
          style={{ maxWidth: "var(--content-max)" }}
        >
          {/* Mono masthead strip — "Issue / Studio / Location" */}
          <div className="grid grid-cols-3 gap-4 pt-5 border-b border-[var(--rule)] pb-5">
            <span className="eyebrow">Issue №01 · 2026</span>
            <span className="eyebrow text-center hidden md:block">Studio Quarterly</span>
            <span className="eyebrow text-right">Екатеринбург · 56°50′N</span>
          </div>

          <div className="grid lg:grid-cols-[1fr_320px] gap-16 lg:gap-20 items-center pt-20 pb-16">
            {/* Left — text */}
            <div>
              <p
                className="anim-fade-up eyebrow mb-7"
                style={{ "--delay": "0.1s" } as React.CSSProperties}
              >
                AI-автоматизация · Корпоративное видео · Синтез
              </p>

              <h1
                className="anim-fade-up display"
                style={{
                  fontSize: "clamp(3rem, 7.5vw, 6rem)",
                  lineHeight: 1.02,
                  letterSpacing: "-0.028em",
                  marginBottom: "32px",
                  fontVariationSettings: '"opsz" 60',
                  "--delay": "0.2s",
                } as React.CSSProperties}
              >
                Системы, которые работают.<br />
                <span style={{ color: "var(--ink-3)", fontStyle: "italic" }}>
                  Истории, которые убеждают.
                </span>
              </h1>

              <p
                className="anim-fade-up text-[var(--ink-2)] leading-[1.7] mb-10 max-w-[540px]"
                style={{
                  fontSize: "clamp(1rem, 1.2vw, 1.15rem)",
                  "--delay": "0.4s",
                } as React.CSSProperties}
              >
                Большинство умеют либо строить системы, либо рассказывать истории.
                Мы делаем и то, и другое — в рамках одного проекта,
                с одной командой, без субподряда на ключевых ролях.
              </p>

              <div
                className="anim-fade-up flex flex-wrap items-center gap-3"
                style={{ "--delay": "0.5s" } as React.CSSProperties}
              >
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-[var(--ink)] text-[var(--paper)] text-[14px] font-medium rounded-full hover:bg-black transition-colors"
                  style={{ transitionDuration: "220ms" }}
                >
                  Обсудить задачу
                  <span>→</span>
                </Link>
                <Link
                  href="/manifesto"
                  className="inline-flex items-center px-7 py-3.5 border border-[var(--ink-3)] text-[var(--ink)] text-[14px] rounded-full hover:bg-[var(--paper-1)] transition-colors"
                >
                  Манифест
                </Link>
              </div>
            </div>

            {/* Right — diagram-mark */}
            <div className="hidden lg:flex justify-center">
              <HeroDiagramMark />
            </div>
          </div>
        </div>
      </section>

      {/* ── Three pillars — typographic equation 01 + 02 = 03 ───── */}
      <section
        className="border-b border-[var(--rule)]"
        style={{ background: "var(--paper-2)", paddingTop: "var(--s-9)", paddingBottom: "var(--s-9)" }}
      >
        <div
          className="mx-auto px-8"
          style={{ maxWidth: "var(--content-max)" }}
        >
          <p className="eyebrow mb-10">Уравнение студии · 02</p>

          {/* Desktop equation */}
          <div className="hidden lg:grid items-start mb-12" style={{ gridTemplateColumns: "1fr 60px 1fr 60px 1.2fr", gap: "var(--s-5)" }}>
            {/* 01 — AI */}
            <div className="scroll-reveal">
              <div
                className="font-mono text-[var(--ink-4)] leading-none mb-5"
                style={{ fontSize: "64px" }}
              >
                01
              </div>
              <h3
                className="display mb-3"
                style={{
                  fontSize: "28px",
                  letterSpacing: "-0.018em",
                  fontVariationSettings: '"opsz" 24',
                  fontWeight: 500,
                  lineHeight: 1.15,
                }}
              >
                AI-разработка
              </h3>
              <p className="text-[var(--ink-2)] leading-[1.65]" style={{ fontSize: "13.5px" }}>
                Анализ процесса, архитектура, разработка под задачу.
                Не пилот на месяц, не демо — рабочий инструмент.
              </p>
            </div>

            {/* + */}
            <div
              className="display text-[var(--ink-3)] text-center"
              style={{ fontSize: "80px", lineHeight: 1, paddingTop: "40px", animation: "none" }}
              aria-hidden="true"
            >
              +
            </div>

            {/* 02 — Video */}
            <div className="scroll-reveal" style={{ animationDelay: "100ms" }}>
              <div
                className="font-mono text-[var(--ink-4)] leading-none mb-5"
                style={{ fontSize: "64px" }}
              >
                02
              </div>
              <h3
                className="display mb-3"
                style={{
                  fontSize: "28px",
                  letterSpacing: "-0.018em",
                  fontVariationSettings: '"opsz" 24',
                  fontWeight: 500,
                  lineHeight: 1.15,
                }}
              >
                Видеопродакшн
              </h3>
              <p className="text-[var(--ink-2)] leading-[1.65]" style={{ fontSize: "13.5px" }}>
                Сценарий, съёмка, VFX. Своими руками, без субподряда
                на ключевых ролях.
              </p>
            </div>

            {/* = (cobalt) */}
            <div
              className="display text-[var(--cobalt)] text-center"
              style={{ fontSize: "80px", lineHeight: 1, paddingTop: "40px", animation: "none" }}
              aria-hidden="true"
            >
              =
            </div>

            {/* 03 — Synthesis (ink inversion) */}
            <div
              className="scroll-reveal"
              style={{
                background: "var(--ink)",
                color: "var(--paper)",
                padding: "32px",
                marginTop: "-8px",
                animationDelay: "200ms",
              }}
            >
              <div
                className="mono-eyebrow font-mono mb-3.5"
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--cobalt-tint)",
                }}
              >
                03 · Ключевое
              </div>
              <h3
                className="display mb-3"
                style={{
                  fontSize: "32px",
                  fontStyle: "italic",
                  fontWeight: 500,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.05,
                  color: "var(--paper)",
                  fontVariationSettings: '"opsz" 32',
                }}
              >
                Синтез
              </h3>
              <p
                className="leading-[1.7]"
                style={{ fontSize: "14px", color: "oklch(85% 0.02 75)" }}
              >
                Один проект, один бриф, одна команда. Система —
                и фильм о ней. Контекст не теряется на стыке. Качество
                не падает ни с одной стороны.
              </p>
            </div>
          </div>

          {/* Mobile fallback — stacked vertical */}
          <div className="lg:hidden flex flex-col gap-8">
            {[
              { n: "01", t: "AI-разработка", d: "Анализ процесса, архитектура, разработка под задачу. Не пилот на месяц, не демо — рабочий инструмент.", main: false },
              { n: "02", t: "Видеопродакшн", d: "Сценарий, съёмка, VFX. Своими руками, без субподряда на ключевых ролях.", main: false },
              { n: "03", t: "Синтез", d: "Один проект, один бриф, одна команда. Система — и фильм о ней. Контекст не теряется на стыке.", main: true },
            ].map((p) => (
              <div
                key={p.n}
                className={p.main ? "p-6" : ""}
                style={p.main ? { background: "var(--ink)", color: "var(--paper)" } : undefined}
              >
                <div
                  className="font-mono leading-none mb-3"
                  style={{
                    fontSize: "40px",
                    color: p.main ? "var(--cobalt-tint)" : "var(--ink-4)",
                  }}
                >
                  {p.n}
                </div>
                <h3
                  className="display mb-2"
                  style={{
                    fontSize: "22px",
                    letterSpacing: "-0.018em",
                    fontWeight: 500,
                    fontStyle: p.main ? "italic" : "normal",
                    color: p.main ? "var(--paper)" : "var(--ink)",
                    animation: "none",
                  }}
                >
                  {p.t}
                </h3>
                <p
                  className="leading-[1.65]"
                  style={{
                    fontSize: "14px",
                    color: p.main ? "oklch(85% 0.02 75)" : "var(--ink-2)",
                  }}
                >
                  {p.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process — typographic ladder ─────────────────────────── */}
      <section className="border-b border-[var(--rule)]" style={{ paddingTop: "var(--s-9)", paddingBottom: "var(--s-9)" }}>
        <div className="mx-auto px-8" style={{ maxWidth: "var(--content-max)" }}>
          <div className="flex justify-between items-baseline mb-12 flex-wrap gap-4">
            <h2
              className="display"
              style={{
                fontSize: "clamp(2rem, 4.5vw, 4rem)",
                letterSpacing: "-0.025em",
                lineHeight: 1,
                fontVariationSettings: '"opsz" 48',
                animation: "none",
              }}
            >
              Процесс <span style={{ fontStyle: "italic", color: "var(--ink-3)" }}>в четыре такта.</span>
            </h2>
            <span className="eyebrow">7–14 недель</span>
          </div>

          <div>
            {PROCESS.map((p, i) => (
              <div
                key={p.n}
                className="scroll-reveal grid items-baseline border-t border-[var(--rule)] py-9"
                style={{
                  gridTemplateColumns: "100px 1fr 1.5fr 120px",
                  gap: "var(--s-6)",
                  animationDelay: `${i * 80}ms`,
                }}
              >
                <div
                  className="font-mono leading-none"
                  style={{
                    fontSize: "clamp(40px, 5vw, 64px)",
                    color: i === 0 ? "var(--cobalt)" : "var(--ink-3)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {p.n}
                </div>
                <h3
                  className="display"
                  style={{
                    fontSize: "clamp(20px, 2.4vw, 32px)",
                    fontWeight: 500,
                    letterSpacing: "-0.018em",
                    lineHeight: 1,
                    animation: "none",
                  }}
                >
                  {p.t}
                </h3>
                <p
                  className="text-[var(--ink-2)] leading-[1.65]"
                  style={{ fontSize: "14px" }}
                >
                  {p.d}
                </p>
                <span
                  className="font-mono text-right text-[var(--ink-3)]"
                  style={{ fontSize: "12px" }}
                >
                  {p.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why convenient — ink inversion contrast block ────────── */}
      <section
        style={{
          background: "var(--ink)",
          color: "var(--paper)",
          paddingTop: "var(--s-10)",
          paddingBottom: "var(--s-10)",
        }}
      >
        <div className="mx-auto px-8" style={{ maxWidth: "var(--content-max)" }}>
          <p
            className="font-mono mb-8"
            style={{
              fontSize: "11px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "oklch(70% 0.02 75)",
            }}
          >
            Для крупных клиентов · 04
          </p>
          <h2
            className="display mb-14"
            style={{
              fontSize: "clamp(2.2rem, 4.5vw, 4rem)",
              lineHeight: 1.04,
              letterSpacing: "-0.025em",
              fontVariationSettings: '"opsz" 60',
              color: "var(--paper)",
              maxWidth: "900px",
              animation: "none",
            }}
          >
            Удобно <span style={{ fontStyle: "italic", color: "oklch(70% 0.02 75)" }}>работать,</span><br />
            предсказуемо <span style={{ color: "var(--cobalt-tint)" }}>считать.</span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3" style={{ gap: 0 }}>
            {PARTNERSHIP.map(([k, v], i) => {
              const cols = 3;
              const rightBorder = (i + 1) % cols !== 0;
              return (
                <div
                  key={k}
                  className="scroll-reveal"
                  style={{
                    padding: "28px 24px",
                    borderTop: "1px solid oklch(28% 0.04 255)",
                    borderRight: rightBorder ? "1px solid oklch(28% 0.04 255)" : undefined,
                    borderBottom: i >= cols ? "1px solid oklch(28% 0.04 255)" : undefined,
                    animationDelay: `${i * 60}ms`,
                  }}
                >
                  <div
                    className="font-mono mb-2.5"
                    style={{
                      fontSize: "10.5px",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "var(--cobalt-tint)",
                    }}
                  >
                    {k}
                  </div>
                  <div style={{ fontSize: "15px", color: "oklch(88% 0.015 75)", lineHeight: 1.55 }}>
                    {v}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Levitt — full-bleed display quote with strikethrough ─── */}
      <section
        className="border-b border-[var(--rule)]"
        style={{ paddingTop: "var(--s-10)", paddingBottom: "var(--s-10)" }}
      >
        <div className="mx-auto px-8" style={{ maxWidth: "var(--content-max)" }}>
          <p className="eyebrow mb-8">Принцип · 05</p>

          <blockquote
            className="display"
            style={{
              fontStyle: "italic",
              fontSize: "clamp(2.5rem, 6.5vw, 6rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: "var(--ink)",
              marginBottom: "32px",
              maxWidth: "1100px",
              fontVariationSettings: '"opsz" 60',
              animation: "none",
            }}
          >
            «Люди покупают не{" "}
            <span
              style={{
                color: "var(--ink-3)",
                textDecoration: "line-through",
                textDecorationColor: "var(--cobalt)",
                textDecorationThickness: "3px",
              }}
            >
              дрель
            </span>
            ,<br />
            а <span style={{ color: "var(--cobalt)" }}>дырку в стене</span>.»
          </blockquote>

          <div className="flex justify-between items-baseline border-t border-[var(--rule)] pt-6 flex-wrap gap-4">
            <cite
              className="font-mono"
              style={{
                fontStyle: "normal",
                fontSize: "11px",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--ink-3)",
              }}
            >
              — Теодор Левитт · Marketing Myopia · 1960
            </cite>
            <Link
              href="/manifesto"
              style={{
                fontSize: "14px",
                color: "var(--cobalt)",
                textDecoration: "none",
              }}
              className="hover:underline underline-offset-4"
            >
              Читать манифест целиком →
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA — confident split ────────────────────────────────── */}
      <section style={{ paddingTop: "var(--s-10)", paddingBottom: "var(--s-10)" }}>
        <div
          className="mx-auto px-8 grid lg:grid-cols-[1.6fr_1fr] gap-12 items-end"
          style={{ maxWidth: "var(--content-max)" }}
        >
          <h2
            className="display"
            style={{
              fontSize: "clamp(2.5rem, 5vw, 5rem)",
              lineHeight: 1,
              letterSpacing: "-0.028em",
              fontVariationSettings: '"opsz" 60',
              animation: "none",
            }}
          >
            Есть задача<span style={{ color: "var(--cobalt)" }}>?</span><br />
            <span style={{ fontStyle: "italic", color: "var(--ink-3)" }}>Расскажите.</span>
          </h2>

          <div className="flex flex-col gap-4">
            <Link
              href="/contact"
              className="text-center px-7 py-4 bg-[var(--ink)] text-[var(--paper)] font-medium rounded-full hover:bg-black transition-colors"
              style={{ fontSize: "14px" }}
            >
              Заполнить бриф →
            </Link>
            <a
              href="mailto:strana.vfx@gmail.com"
              className="text-center px-7 py-4 border border-[var(--ink-3)] text-[var(--ink)] rounded-full hover:bg-[var(--paper-1)] transition-colors"
              style={{ fontSize: "14px" }}
            >
              strana.vfx@gmail.com
            </a>
            <p
              className="text-center font-mono text-[var(--ink-3)]"
              style={{ fontSize: "11px", letterSpacing: "0.04em", marginTop: "8px" }}
            >
              Ответ в течение рабочего дня · NDA до брифа
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
