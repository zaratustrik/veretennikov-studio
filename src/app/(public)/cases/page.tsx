import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import FadeIn from "@/components/public/FadeIn";
import CasesFilter from "@/components/public/CasesFilter";
import { CASES, TYPE_LABELS, type CaseType } from "@/data/cases";

export const metadata: Metadata = { title: "Кейсы" };

const TYPE_TAG_STYLE: Record<CaseType, string> = {
  synthesis: "text-[var(--text-1)] border-[var(--text-3)]",
  ai:        "text-[var(--text-2)] border-[var(--border-mid)]",
  video:     "text-[var(--text-2)] border-[var(--border-mid)]",
};

export default async function CasesPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type = "all" } = await searchParams;

  const filtered =
    type === "all"
      ? CASES
      : CASES.filter((c) => c.type === type);

  const synthesis = filtered.filter((c) => c.type === "synthesis");
  const rest      = filtered.filter((c) => c.type !== "synthesis");

  return (
    <>
      {/* Header */}
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-12 border-b border-[var(--border)]">
        <FadeIn>
          <p className="text-[11px] tracking-[0.2em] uppercase font-mono text-[var(--text-3)] mb-6">
            Портфолио
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <h1
              className="font-medium tracking-[-0.03em] text-[var(--text-1)]"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.05 }}
            >
              Кейсы
            </h1>
            <Suspense>
              <CasesFilter />
            </Suspense>
          </div>
        </FadeIn>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">

        {/* Синтез — featured, full rows */}
        {synthesis.length > 0 && (
          <div className="mb-10">
            {(type === "all") && (
              <p className="text-[10px] tracking-[0.2em] uppercase font-mono text-[var(--text-3)] mb-6">
                Синтез — ключевые кейсы
              </p>
            )}
            <div className="flex flex-col gap-px bg-[var(--border)]">
              {synthesis.map((c, i) => (
                <FadeIn key={c.id} delay={i * 0.05}>
                  <Link
                    href={`/show/${c.slug}`}
                    className="group bg-[var(--bg-surface)] hover:bg-[var(--bg-raised)] transition-colors block"
                  >
                    <div className="grid md:grid-cols-[80px_1fr_1fr_120px] gap-6 md:gap-12 px-6 py-10 items-start">
                      <span className="text-[11px] tracking-[0.12em] font-mono text-[var(--text-3)] pt-1">
                        {String(CASES.indexOf(c) + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <span className={`inline-block text-[10px] tracking-[0.15em] uppercase font-mono px-2.5 py-1 border rounded-full mb-3 ${TYPE_TAG_STYLE[c.type]}`}>
                          {TYPE_LABELS[c.type]}
                        </span>
                        <h2 className="font-medium tracking-[-0.02em] text-[var(--text-1)]"
                          style={{ fontSize: "clamp(1rem, 1.6vw, 1.25rem)" }}>
                          {c.client}
                        </h2>
                        <p className="text-sm text-[var(--text-2)] mt-1">{c.title}</p>
                      </div>
                      <p className="text-sm text-[var(--text-2)] leading-relaxed hidden md:block">
                        {c.description}
                      </p>
                      <div className="hidden md:flex items-start justify-end pt-1">
                        <span className="text-[11px] font-mono text-[var(--text-3)] group-hover:text-[var(--text-2)] transition-colors">
                          {c.year} →
                        </span>
                      </div>
                    </div>
                  </Link>
                </FadeIn>
              ))}
            </div>
          </div>
        )}

        {/* Rest — grid */}
        {rest.length > 0 && (
          <div>
            {(type === "all") && synthesis.length > 0 && (
              <p className="text-[10px] tracking-[0.2em] uppercase font-mono text-[var(--text-3)] mb-6 mt-4">
                Остальные работы
              </p>
            )}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--border)]">
              {rest.map((c, i) => (
                <FadeIn key={c.id} delay={i * 0.04}>
                  <Link
                    href={`/show/${c.slug}`}
                    className="group bg-[var(--bg-base)] hover:bg-[var(--bg-surface)] transition-colors block h-full"
                  >
                    <div className="p-8 flex flex-col gap-4 h-full">
                      <div className="flex items-start justify-between gap-4">
                        <span className={`text-[10px] tracking-[0.15em] uppercase font-mono px-2.5 py-1 border rounded-full ${TYPE_TAG_STYLE[c.type]}`}>
                          {TYPE_LABELS[c.type]}
                        </span>
                        <span className="text-[11px] font-mono text-[var(--text-3)] group-hover:text-[var(--text-2)] transition-colors shrink-0">
                          {c.year}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h2 className="font-medium tracking-[-0.02em] text-[var(--text-1)] mb-1"
                          style={{ fontSize: "clamp(1rem, 1.4vw, 1.15rem)" }}>
                          {c.client}
                        </h2>
                        <p className="text-sm text-[var(--text-2)]">{c.title}</p>
                      </div>
                      <p className="text-xs text-[var(--text-3)] leading-relaxed line-clamp-2">
                        {c.description}
                      </p>
                      <span className="text-xs text-[var(--text-3)] group-hover:text-[var(--text-2)] transition-colors">
                        Подробнее →
                      </span>
                    </div>
                  </Link>
                </FadeIn>
              ))}
            </div>
          </div>
        )}

        {filtered.length === 0 && (
          <p className="text-sm text-[var(--text-2)] py-16 text-center">
            Кейсов этого типа пока нет в открытом доступе.
          </p>
        )}
      </section>

      {/* CTA */}
      <div className="border-t border-[var(--border)] mx-auto max-w-6xl px-6 py-16">
        <FadeIn>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <p className="font-medium tracking-[-0.02em] text-[var(--text-1)] max-w-sm"
              style={{ fontSize: "clamp(1.1rem, 1.8vw, 1.4rem)", lineHeight: 1.3 }}>
              Не нашли похожий проект?{" "}
              <span className="text-[var(--text-2)]">Расскажите о задаче.</span>
            </p>
            <Link
              href="/contact"
              className="shrink-0 px-7 py-3.5 bg-[var(--text-1)] text-[var(--bg-base)] text-sm font-medium rounded-full hover:bg-white transition-colors"
            >
              Написать →
            </Link>
          </div>
        </FadeIn>
      </div>
    </>
  );
}
