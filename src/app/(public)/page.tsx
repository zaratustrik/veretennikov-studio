import Link from "next/link";
import { prisma } from "@/lib/db";
import RuntimeMetrics from "@/components/public/RuntimeMetrics";
import type { CaseType } from "@/data/cases";

const TYPE_LABEL: Record<string, string> = {
  SYNTHESIS: "Синтез",
  AI: "AI",
  VIDEO: "Видео",
};

const TYPE_TONE: Record<string, string> = {
  SYNTHESIS: "text-[var(--accent-glow)]",
  AI: "text-[var(--text-1)]",
  VIDEO: "text-[var(--text-2)]",
};

function dbTypeToLocal(t: string): CaseType {
  return t.toLowerCase() as CaseType;
}

export default async function HomePage() {
  const dbCases = await prisma.case.findMany({
    where: { isPublic: true },
    orderBy: { order: "asc" },
  });

  // Featured: first SYNTHESIS case if any
  const featured = dbCases.find((c) => c.type === "SYNTHESIS") ?? dbCases[0];

  // Group by year (descending)
  const byYear = dbCases.reduce<Record<number, typeof dbCases>>((acc, c) => {
    (acc[c.year] ??= []).push(c);
    return acc;
  }, {});
  const years = Object.keys(byYear).map(Number).sort((a, b) => b - a);

  return (
    <>
      {/* Titlecard loader (CSS-only, plays once) */}
      <div className="titlecard" aria-hidden="true" />

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1280px] px-8 pt-24 pb-32 min-h-[88vh] flex flex-col justify-center">
        <div className="grid lg:grid-cols-[1fr_280px] gap-16 lg:gap-24 items-start">

          {/* Left — typographic statement */}
          <div>
            <p
              className="mono-meta anim-fade-up mb-12"
              style={{ "--delay": "0.05s" } as React.CSSProperties}
            >
              <span className="text-[var(--accent-glow)]">01</span> · Studio Index · 2024
            </p>

            <h1
              className="display text-[var(--text-1)] mb-10"
              style={{
                fontSize: "clamp(3rem, 9.5vw, 8.5rem)",
                lineHeight: 0.95,
                letterSpacing: "-0.025em",
              }}
            >
              <span className="block">Системы</span>
              <span className="block text-[var(--text-2)]">и истории</span>
              <span className="block">в одном брифе.</span>
            </h1>

            <p
              className="anim-fade-up text-[var(--text-2)] leading-[1.7] max-w-[440px] mb-12"
              style={{
                fontSize: "clamp(0.95rem, 1.1vw, 1.05rem)",
                "--delay": "0.6s",
              } as React.CSSProperties}
            >
              AI-разработка и видеопродакшн под одной крышей. Студия в Екатеринбурге.
              Работаем с организациями, которым важен и инструмент, и восприятие.
            </p>

            <div
              className="anim-fade-up flex flex-wrap items-center gap-6"
              style={{ "--delay": "0.7s" } as React.CSSProperties}
            >
              <Link
                href="#work"
                className="group inline-flex items-center gap-3 text-sm text-[var(--text-1)]"
              >
                <span className="block w-8 h-px bg-[var(--accent)] group-hover:w-12 transition-all duration-300" />
                Работа
              </Link>
              <Link
                href="/contact"
                className="text-sm text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors"
              >
                Связаться →
              </Link>
            </div>
          </div>

          {/* Right — runtime metrics flex */}
          <div className="anim-fade lg:pt-2" style={{ "--delay": "0.9s" } as React.CSSProperties}>
            <RuntimeMetrics />
          </div>
        </div>
      </section>

      {/* ── Featured case ─────────────────────────────────────────── */}
      {featured && (
        <section className="border-t border-[var(--border)] bg-[var(--bg-surface)]">
          <div className="mx-auto max-w-[1280px] px-8 py-24">
            <p className="mono-meta mb-12 flex items-center gap-3">
              <span className="block w-6 h-px bg-[var(--accent)]" />
              Текущий фокус · {featured.year}
            </p>

            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
              {/* Visual */}
              <div className="scroll-reveal">
                <div className="aspect-video bg-[var(--bg-base)] border border-[var(--border-mid)] rounded-sm overflow-hidden flex items-center justify-center">
                  <span className="mono-tag text-[var(--text-3)]">медиа · по запросу</span>
                </div>
                <p className="mono-meta mt-4">
                  {featured.client.toUpperCase()} · {TYPE_LABEL[featured.type]} · {featured.year}
                </p>
              </div>

              {/* Text */}
              <div className="scroll-reveal" style={{ animationDelay: "120ms" }}>
                <h2
                  className="display text-[var(--text-1)] mb-6"
                  style={{
                    fontSize: "clamp(1.7rem, 3vw, 2.6rem)",
                    lineHeight: 1.1,
                    letterSpacing: "-0.02em",
                    animation: "none",
                  }}
                >
                  {featured.title}
                </h2>
                <p className="text-[var(--text-2)] leading-[1.7] mb-8" style={{ fontSize: "1rem" }}>
                  {featured.description}
                </p>

                {featured.outcome && (
                  <div className="border-l-2 border-[var(--accent)] pl-5 py-2 mb-8">
                    <p className="text-sm text-[var(--text-1)] leading-[1.6]">
                      {featured.outcome}
                    </p>
                  </div>
                )}

                <Link
                  href={`/show/${featured.slug}`}
                  className="group inline-flex items-center gap-3 text-sm text-[var(--text-1)]"
                >
                  <span>Читать кейс целиком</span>
                  <span className="block w-8 h-px bg-[var(--text-2)] group-hover:bg-[var(--accent)] group-hover:w-12 transition-all duration-300" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Work — editorial list ─────────────────────────────────── */}
      <section id="work" className="border-t border-[var(--border)]">
        <div className="mx-auto max-w-[1280px] px-8 py-24">
          <div className="flex items-baseline justify-between mb-16 flex-wrap gap-4">
            <p className="mono-meta">Работа · 02</p>
            <p className="mono-meta text-[var(--text-2)]">
              {dbCases.length} {dbCases.length === 1 ? "кейс" : dbCases.length < 5 ? "кейса" : "кейсов"}
            </p>
          </div>

          {years.map((year) => (
            <div key={year} className="mb-16 last:mb-0">
              {/* Year heading */}
              <div className="flex items-baseline gap-6 mb-8 pb-4 border-b border-[var(--border)]">
                <span
                  className="display text-[var(--text-1)]"
                  style={{ fontSize: "1.6rem", animation: "none", letterSpacing: "-0.01em" }}
                >
                  {year}
                </span>
                <span className="flex-1 h-px bg-[var(--border)]" />
                <span className="mono-meta">
                  {byYear[year].length} {byYear[year].length === 1 ? "проект" : "проектов"}
                </span>
              </div>

              {/* Cases list */}
              <div className="flex flex-col">
                {byYear[year].map((c, i) => {
                  const idx = String(dbCases.indexOf(c) + 1).padStart(2, "0");
                  const localType = dbTypeToLocal(c.type);
                  return (
                    <Link
                      key={c.id}
                      href={`/show/${c.slug}`}
                      className="scroll-reveal group grid grid-cols-[44px_1fr_auto] gap-6 py-6 border-b border-[var(--border)] hover:bg-[var(--bg-surface)] transition-colors items-baseline"
                      style={{ animationDelay: `${i * 60}ms` }}
                    >
                      <span className="font-mono text-[12px] text-[var(--text-3)] group-hover:text-[var(--accent-glow)] transition-colors">
                        {idx}
                      </span>

                      <div className="min-w-0">
                        <div className="flex items-baseline gap-3 flex-wrap mb-1">
                          <span
                            className="display text-[var(--text-1)]"
                            style={{
                              fontSize: "clamp(1.1rem, 1.6vw, 1.4rem)",
                              lineHeight: 1.2,
                              animation: "none",
                              letterSpacing: "-0.01em",
                            }}
                          >
                            {c.client}
                          </span>
                          <span className="text-[var(--text-3)]">·</span>
                          <span className="text-[var(--text-2)] text-[14px]">{c.title}</span>
                        </div>
                        <p className="text-[13px] text-[var(--text-3)] leading-[1.5] max-w-[60ch]">
                          {c.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 self-center pl-4">
                        <span className={`mono-tag ${TYPE_TONE[c.type]}`}>
                          {TYPE_LABEL[c.type]}
                        </span>
                        <span className="font-mono text-[14px] text-[var(--text-3)] group-hover:text-[var(--accent-glow)] group-hover:translate-x-1 transition-all duration-300">
                          →
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Approach ──────────────────────────────────────────────── */}
      <section className="border-t border-[var(--border)] bg-[var(--bg-surface)]">
        <div className="mx-auto max-w-[1280px] px-8 py-32">
          <div className="grid lg:grid-cols-[2fr_3fr] gap-12 lg:gap-20 items-start">
            <div>
              <p className="mono-meta mb-8">Подход · 03</p>
              <h2
                className="display text-[var(--text-1)]"
                style={{
                  fontSize: "clamp(2.2rem, 5vw, 4rem)",
                  lineHeight: 1.05,
                  letterSpacing: "-0.025em",
                  animation: "none",
                }}
              >
                Не дрель, <span className="text-[var(--text-2)]">а дырку в стене.</span>
              </h2>
            </div>

            <div className="lg:pt-3">
              <blockquote className="text-[var(--text-2)] italic mb-8 pb-8 border-b border-[var(--border)] leading-[1.6]" style={{ fontSize: "0.95rem" }}>
                «Люди покупают не дрель, а дырку в стене.»
                <span className="block mt-3 not-italic mono-meta">— Теодор Левитт</span>
              </blockquote>

              <div className="space-y-5 text-[var(--text-2)] leading-[1.75]" style={{ fontSize: "1rem" }}>
                <p>
                  В корпоративном продакшене и в AI-разработке клиент часто приходит с уже
                  сформулированной задачей: "снять ролик к юбилею", "сделать чат-бота для отдела".
                  Это не задача — это первое приближение к ней.
                </p>
                <p>
                  Прежде чем браться за решение, мы разбираемся, что лежит за просьбой.
                  Юбилейный фильм нужен не ради юбилея — а чтобы 3000 сотрудников в 12 регионах
                  почувствовали общность. Чат-бот нужен не для автоматизации — а чтобы команда
                  поддержки наконец занялась нестандартными случаями.
                </p>
                <p>
                  Когда понятна реальная цель, форма решения иногда сильно меняется. Это и есть
                  партнёрская позиция — не вместо клиента, а вместе с ним.
                </p>
              </div>

              <Link
                href="/manifesto"
                className="group inline-flex items-center gap-3 mt-10 text-sm text-[var(--text-1)]"
              >
                <span>Полный манифест</span>
                <span className="block w-8 h-px bg-[var(--text-2)] group-hover:bg-[var(--accent)] group-hover:w-12 transition-all duration-300" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="border-t border-[var(--border)]">
        <div className="mx-auto max-w-[1280px] px-8 py-24">
          <div className="grid lg:grid-cols-[1fr_auto] gap-10 items-center">
            <h2
              className="display text-[var(--text-1)]"
              style={{
                fontSize: "clamp(1.8rem, 3.5vw, 3rem)",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                animation: "none",
              }}
            >
              Есть задача — <span className="text-[var(--text-2)]">расскажите о ней.</span>
            </h2>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="group relative px-7 py-3.5 text-sm text-[var(--bg-base)] bg-[var(--text-1)] hover:bg-white transition-colors rounded-full inline-flex items-center gap-3"
              >
                Написать
                <span className="block w-4 h-px bg-[var(--bg-base)] group-hover:w-6 transition-all" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
