import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { CASES, TYPE_LABELS, type CaseType } from "@/data/cases";

/* ─── Static generation ────────────────────────────────────────── */

export async function generateStaticParams() {
  return CASES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = CASES.find((c) => c.slug === slug);
  if (!c) return {};
  return {
    title: `${c.client} — ${c.title}`,
    description: c.description,
  };
}

/* ─── Type styling ─────────────────────────────────────────────── */

const TYPE_BG: Record<CaseType, string> = {
  synthesis: "bg-[var(--bg-surface)]",
  video:     "bg-[var(--bg-base)]",
  ai:        "bg-[var(--bg-base)]",
};

/* ─── Page ──────────────────────────────────────────────────────── */

export default async function ShowPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = CASES.find((c) => c.slug === slug);
  if (!project) notFound();

  const { client, title, description, type, year, services, challenge, solution, outcome } = project;

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className={`${TYPE_BG[type]} border-b border-[var(--border)]`}>
        <div className="mx-auto max-w-6xl px-6 pt-16 pb-16">
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <span className="text-[10px] tracking-[0.2em] uppercase font-mono px-3 py-1.5 border border-[var(--border-mid)] text-[var(--text-2)] rounded-full">
              {TYPE_LABELS[type]}
            </span>
            <span className="text-[10px] tracking-[0.15em] font-mono text-[var(--text-3)]">
              {year}
            </span>
          </div>

          <h1
            className="font-medium tracking-[-0.03em] text-[var(--text-1)] mb-4"
            style={{ fontSize: "clamp(2rem, 5vw, 4rem)", lineHeight: 1.05 }}
          >
            {client}
          </h1>
          <p
            className="text-[var(--text-2)] mb-8"
            style={{ fontSize: "clamp(1rem, 1.8vw, 1.3rem)", lineHeight: 1.4 }}
          >
            {title}
          </p>
          <p className="text-[var(--text-2)] leading-[1.75] max-w-2xl text-sm sm:text-base">
            {description}
          </p>
        </div>
      </section>

      {/* ── Services ─────────────────────────────────────────────── */}
      {services && services.length > 0 && (
        <section className="border-b border-[var(--border)]">
          <div className="mx-auto max-w-6xl px-6 py-10">
            <div className="flex flex-wrap items-center gap-x-10 gap-y-3">
              <span className="text-[10px] tracking-[0.2em] uppercase font-mono text-[var(--text-3)] shrink-0">
                Что делали
              </span>
              {services.map((s) => (
                <span key={s} className="text-sm text-[var(--text-2)]">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Media placeholder ────────────────────────────────────── */}
      <section className="border-b border-[var(--border)]">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="aspect-video bg-[var(--bg-surface)] border border-[var(--border)] rounded-sm flex flex-col items-center justify-center gap-3">
            <p className="text-[11px] tracking-[0.15em] uppercase font-mono text-[var(--text-3)]">
              Медиаматериалы
            </p>
            <p className="text-xs text-[var(--text-3)]">
              Доступны по запросу
            </p>
          </div>
        </div>
      </section>

      {/* ── Challenge / Solution / Outcome ───────────────────────── */}
      {(challenge || solution || outcome) && (
        <section className="border-b border-[var(--border)]">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <div className="grid md:grid-cols-3 gap-px bg-[var(--border)]">
              {challenge && (
                <div className="bg-[var(--bg-base)] p-8">
                  <p className="text-[10px] tracking-[0.2em] uppercase font-mono text-[var(--text-3)] mb-4">
                    Задача
                  </p>
                  <p className="text-sm text-[var(--text-2)] leading-[1.8]">
                    {challenge}
                  </p>
                </div>
              )}
              {solution && (
                <div className="bg-[var(--bg-surface)] p-8">
                  <p className="text-[10px] tracking-[0.2em] uppercase font-mono text-[var(--text-3)] mb-4">
                    Решение
                  </p>
                  <p className="text-sm text-[var(--text-2)] leading-[1.8]">
                    {solution}
                  </p>
                </div>
              )}
              {outcome && (
                <div className="bg-[var(--bg-base)] p-8">
                  <p className="text-[10px] tracking-[0.2em] uppercase font-mono text-[var(--text-3)] mb-4">
                    Результат
                  </p>
                  <p className="text-sm text-[var(--text-2)] leading-[1.8]">
                    {outcome}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <div>
            <p
              className="font-medium tracking-[-0.025em] text-[var(--text-1)] mb-2"
              style={{ fontSize: "clamp(1.2rem, 2vw, 1.6rem)", lineHeight: 1.25 }}
            >
              Похожая задача?{" "}
              <span className="text-[var(--text-2)]">Обсудим.</span>
            </p>
            <p className="text-sm text-[var(--text-3)]">
              Анатолий Веретенников ответит лично.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="px-7 py-3.5 bg-[var(--text-1)] text-[var(--bg-base)] text-sm font-medium rounded-full hover:bg-white transition-colors"
            >
              Написать →
            </Link>
            <Link
              href="/cases"
              className="px-7 py-3.5 border border-[var(--border-mid)] text-[var(--text-2)] text-sm rounded-full hover:text-[var(--text-1)] hover:border-[#3A3A3A] transition-colors"
            >
              Все кейсы
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
