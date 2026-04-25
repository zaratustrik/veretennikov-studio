import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";

export const metadata: Metadata = { title: "Работа" };

export default async function CasesPage() {
  const cases = await prisma.case.findMany({
    where: { isPublic: true },
    orderBy: { order: "asc" },
  });

  // Group by year (descending)
  const byYear = cases.reduce<Record<number, typeof cases>>((acc, c) => {
    (acc[c.year] ??= []).push(c);
    return acc;
  }, {});
  const years = Object.keys(byYear).map(Number).sort((a, b) => b - a);

  return (
    <>
      {/* ── Header ───────────────────────────────────────────────── */}
      <section className="border-b border-[var(--rule)]">
        <div
          className="mx-auto px-8"
          style={{ maxWidth: "var(--content-max)" }}
        >
          {/* Mono masthead */}
          <div className="grid grid-cols-3 gap-4 pt-5 border-b border-[var(--rule)] pb-5">
            <span className="eyebrow">Index № 02</span>
            <span className="eyebrow text-center hidden md:block">Studio Quarterly</span>
            <span className="eyebrow text-right">{cases.length} проектов</span>
          </div>

          <div className="pt-20 pb-12">
            <p className="eyebrow mb-7">Работа · Видеопродакшн</p>
            <h1
              className="display"
              style={{
                fontSize: "clamp(2.25rem, 4.6vw, 4.25rem)",
                lineHeight: 1.04,
                letterSpacing: "-0.025em",
                fontVariationSettings: '"opsz" 48',
                marginBottom: "24px",
                animation: "none",
              }}
            >
              Корпоративные фильмы, <span style={{ color: "var(--ink-3)", fontStyle: "italic" }}>презентации,</span><br />
              событийные ролики.
            </h1>
            <p
              className="text-[var(--ink-2)] leading-[1.7] max-w-[640px]"
              style={{ fontSize: "clamp(1rem, 1.2vw, 1.1rem)" }}
            >
              Здесь — только сданные проекты, согласованные к публичному показу.
              Кейсы по AI-разработке и синтезу появятся позже,{" "}
              <span className="text-[var(--ink-2)]">когда мы будем готовы рассказать о них целиком.</span>
            </p>
          </div>
        </div>
      </section>

      {/* ── Editorial list ───────────────────────────────────────── */}
      <section
        className="border-b border-[var(--rule)]"
        style={{ paddingTop: "var(--s-9)", paddingBottom: "var(--s-9)" }}
      >
        <div
          className="mx-auto px-8"
          style={{ maxWidth: "var(--content-max)" }}
        >
          {years.map((year) => (
            <div key={year} className="mb-16 last:mb-0">
              {/* Year heading */}
              <div className="flex items-baseline gap-6 mb-8 pb-4 border-b border-[var(--rule)]">
                <span
                  className="display"
                  style={{
                    fontSize: "1.6rem",
                    animation: "none",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {year}
                </span>
                <span className="flex-1 h-px bg-[var(--rule)]" />
                <span className="eyebrow">
                  {byYear[year].length}{" "}
                  {byYear[year].length === 1 ? "проект" : "проектов"}
                </span>
              </div>

              {/* Cases list */}
              <div className="flex flex-col">
                {byYear[year].map((c, i) => {
                  const idx = String(cases.indexOf(c) + 1).padStart(2, "0");
                  return (
                    <Link
                      key={c.id}
                      href={`/show/${c.slug}`}
                      className="scroll-reveal group grid grid-cols-[44px_1fr_auto] gap-6 py-6 border-b border-[var(--rule)] hover:bg-[var(--paper-1)] transition-colors items-baseline"
                      style={{ animationDelay: `${i * 60}ms` }}
                    >
                      <span className="font-mono text-[12px] text-[var(--ink-3)] group-hover:text-[var(--cobalt)] transition-colors">
                        {idx}
                      </span>

                      <div className="min-w-0">
                        <div className="flex items-baseline gap-3 flex-wrap mb-1">
                          <span
                            className="display"
                            style={{
                              fontSize: "clamp(1.1rem, 1.6vw, 1.4rem)",
                              lineHeight: 1.2,
                              animation: "none",
                              letterSpacing: "-0.01em",
                            }}
                          >
                            {c.client}
                          </span>
                          <span className="text-[var(--ink-3)]">·</span>
                          <span className="text-[var(--ink-2)] text-[14px]">
                            {c.title}
                          </span>
                        </div>
                        <p className="text-[13px] text-[var(--ink-3)] leading-[1.5] max-w-[60ch]">
                          {c.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 self-center pl-4">
                        <span className="font-mono text-[14px] text-[var(--ink-3)] group-hover:text-[var(--cobalt)] group-hover:translate-x-1 transition-all duration-300">
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

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section
        style={{ paddingTop: "var(--s-9)", paddingBottom: "var(--s-9)" }}
      >
        <div
          className="mx-auto px-8 grid lg:grid-cols-[1fr_auto] gap-10 items-center"
          style={{ maxWidth: "var(--content-max)" }}
        >
          <div>
            <h2
              className="display mb-3"
              style={{
                fontSize: "clamp(1.8rem, 3.2vw, 2.8rem)",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                animation: "none",
              }}
            >
              Не нашли похожий проект?{" "}
              <span style={{ color: "var(--ink-3)" }}>Расскажите о задаче.</span>
            </h2>
            <p className="text-[var(--ink-2)] text-[15px] leading-[1.6]">
              Анатолий ответит лично в течение рабочего дня.
            </p>
          </div>
          <Link
            href="/contact"
            className="shrink-0 px-7 py-3.5 bg-[var(--ink)] text-[var(--paper)] text-[14px] font-medium rounded-full hover:bg-black transition-colors inline-flex items-center gap-2"
          >
            Написать <span>→</span>
          </Link>
        </div>
      </section>
    </>
  );
}
