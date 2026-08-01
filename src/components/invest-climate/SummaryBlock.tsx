"use client";

import type { SourceRef, SummaryData } from "@/types/investment-climate";
import { Reveal, Section, StatusBadge } from "./shared";
import { FINDING_EVIDENCE, SourceReference } from "./SourceReference";

const SIGNIFICANCE_META: Record<string, { label: string; color: string }> = {
  critical: { label: "Критично", color: "var(--ic-s-remove)" },
  high: { label: "Высокая значимость", color: "var(--ic-s-rewrite)" },
  medium: { label: "Средняя значимость", color: "var(--ic-s-improve)" },
};

/**
 * SummaryBlock — семь выводов аудита. Выводы оформлены уровнем
 * «аналитический вывод» (акцентная кромка), у каждого — статус
 * (официальный факт / аналитический вывод) и кнопка «Основание»
 * с 1–3 источниками; приоритеты — уровнем «предложение».
 */
export function SummaryBlock({
  summary,
  sources,
  onAnchor,
}: {
  summary: SummaryData;
  sources: SourceRef[];
  onAnchor: (anchor: string) => void;
}) {
  return (
    <Section
      id="summary"
      title="Резюме"
      lead="Семь главных выводов аудита и решения, которые стоит принять в первую очередь. У каждого вывода — статус и основание."
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <div className="grid gap-4 md:grid-cols-2">
          {summary.findings.map((f, i) => {
            const sig = SIGNIFICANCE_META[f.significance] ?? {
              label: "—",
              color: "var(--ic-s-nodata)",
            };
            const ev = FINDING_EVIDENCE[f.id];
            const evSources = ev
              ? sources.filter((s) => ev.sourceIds.includes(s.id))
              : [];
            return (
              <Reveal key={f.id} delay={Math.min(i * 0.06, 0.3)}>
                <article className="ic-level-conclusion flex h-full flex-col gap-2.5 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[13px] font-bold text-[var(--ic-accent)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <StatusBadge color={sig.color} label={sig.label} />
                  </div>
                  <h3 className="ic-h3">{f.thesis}</h3>
                  <p className="text-[13.5px] leading-relaxed text-[var(--ic-ink-2)]">
                    {f.explanation}
                  </p>
                  {ev ? (
                    <SourceReference status={ev.status} sources={evSources} />
                  ) : null}
                  <button
                    type="button"
                    onClick={() => onAnchor(f.anchor)}
                    className="ic-no-print mt-auto self-start text-[13px] font-semibold text-[var(--ic-accent)] hover:text-[var(--ic-accent-ink)]"
                  >
                    Подробнее в разделе →
                  </button>
                </article>
              </Reveal>
            );
          })}
        </div>
        <Reveal className="lg:sticky lg:top-[76px]">
          <aside
            className="ic-level-proposal p-5"
            aria-label="Решить в первую очередь"
          >
            <p className="ic-level-caption mb-1.5">Предложение</p>
            <h3 className="ic-h3 mb-4">Решить в первую очередь</h3>
            <ol className="space-y-3">
              {summary.priorities.map((p) => (
                <li
                  key={p.n}
                  className="flex gap-3 border-t border-[var(--ic-line)] pt-3 first:border-t-0 first:pt-0"
                >
                  <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[var(--ic-accent)] text-[12px] font-bold text-white">
                    {p.n}
                  </span>
                  <div>
                    <div className="text-[13.5px] font-semibold leading-snug">
                      {p.title}
                    </div>
                    <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[12px] text-[var(--ic-ink-2)]">
                      <span>Эффект: {p.effect}</span>
                      <span>Срок: {p.term}</span>
                      <span>Ресурс: {p.cost}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </aside>
        </Reveal>
      </div>
    </Section>
  );
}
