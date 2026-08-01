"use client";

import type { MetaData, RoadmapItem, Verdict } from "@/types/investment-climate";
import { Reveal, Section, VERDICT_META } from "./shared";

const VERDICT_ORDER: Verdict[] = [
  "keep",
  "rewrite",
  "improve",
  "merge",
  "remove",
  "conditional",
  "fill-new",
];

export function DiagnosticsBlock({
  meta,
  items,
  onVerdictClick,
  onMatrixClick,
}: {
  meta: MetaData;
  items: RoadmapItem[];
  onVerdictClick: (verdict: Verdict) => void;
  onMatrixClick: (ratingImpact: number, investorImpact: number) => void;
}) {
  const formalCount = items.filter((i) => i.issues.includes("formal-kpi")).length;
  const filledCount = items.filter((i) => i.originalActivity.trim().length > 0).length;

  // Матрица 3×3: строки — влияние на инвестора (3 сверху), колонки — на рейтинг.
  const cell = (ri: number, ii: number) =>
    items.filter((i) => i.ratingImpact === ri && i.investorImpact === ii);
  const maxCell = Math.max(
    1,
    ...[1, 2, 3].flatMap((ri) => [1, 2, 3].map((ii) => cell(ri, ii).length)),
  );

  return (
    <Section
      id="diagnostics"
      title="Диагностика карты"
      lead="Итог построчного разбора 43 мероприятий: вердикты, доля формальных ключевых показателей эффективности (КПЭ) и матрица влияния. Клик по вердикту или ячейке матрицы фильтрует список ниже."
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_440px] lg:items-start">
        <Reveal>
          <div className="ic-card p-5">
            <h3 className="ic-h3 mb-4">Вердикты по 43 строкам</h3>
            <div className="flex flex-wrap gap-2.5">
              {VERDICT_ORDER.map((v) => {
                const count = meta.verdictStats[v] ?? 0;
                const m = VERDICT_META[v];
                return (
                  <button
                    key={v}
                    type="button"
                    onClick={() => onVerdictClick(v)}
                    className="ic-no-print flex items-center gap-2.5 rounded-lg border border-[var(--ic-line)] bg-[var(--ic-surface)] px-3.5 py-2.5 text-left transition hover:border-[var(--ic-accent)]"
                    title={`Показать мероприятия с вердиктом «${m.label}»`}
                  >
                    <span
                      className="text-[22px] font-bold leading-none"
                      style={{ color: m.color }}
                    >
                      {count}
                    </span>
                    <span className="text-[13px] font-medium text-[var(--ic-ink-2)]">
                      {m.label}
                    </span>
                  </button>
                );
              })}
            </div>
            <dl className="mt-5 grid gap-3 border-t border-[var(--ic-line)] pt-4 text-[13.5px] sm:grid-cols-2">
              <div>
                <dt className="text-[var(--ic-ink-2)]">
                  КПЭ формальной активности (документы, встречи, публикации)
                </dt>
                <dd className="mt-0.5 text-[19px] font-bold">
                  {formalCount} из {filledCount} заполненных строк
                </dd>
              </div>
              <div>
                <dt className="text-[var(--ic-ink-2)]">
                  Незаполненные строки в проекте карты
                </dt>
                <dd className="mt-0.5 text-[19px] font-bold">
                  {items.length - filledCount} из {items.length} (строки 33–36)
                </dd>
              </div>
            </dl>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="ic-card ic-no-print p-5">
            <h3 className="ic-h3 mb-1">Матрица влияния</h3>
            <p className="mb-4 text-[12.5px] text-[var(--ic-ink-2)]">
              Влияние на рейтинг (по горизонтали) × влияние на инвестора (по
              вертикали). Клик по ячейке — фильтр списка.
            </p>
            <div className="grid grid-cols-[24px_repeat(3,1fr)] gap-1.5">
              {[3, 2, 1].map((ii) => (
                <div key={ii} className="contents">
                  <div className="flex items-center justify-center text-[12px] font-semibold text-[var(--ic-ink-2)]">
                    {ii}
                  </div>
                  {[1, 2, 3].map((ri) => {
                    const list = cell(ri, ii);
                    const alpha = list.length === 0 ? 0.04 : 0.1 + (list.length / maxCell) * 0.5;
                    return (
                      <button
                        key={ri}
                        type="button"
                        onClick={() => onMatrixClick(ri, ii)}
                        disabled={list.length === 0}
                        aria-label={`Рейтинг ${ri}, инвестор ${ii}: ${list.length} мероприятий`}
                        className="flex h-[64px] flex-col items-center justify-center rounded-lg border border-[var(--ic-line)] transition enabled:cursor-pointer enabled:hover:border-[var(--ic-accent)] disabled:cursor-default"
                        style={{
                          background: `rgba(30, 79, 163, ${alpha})`,
                        }}
                      >
                        <span className="text-[19px] font-bold text-[var(--ic-ink)]">
                          {list.length}
                        </span>
                        <span className="text-[11px] text-[var(--ic-ink-2)]">
                          {list.length === 1 ? "строка" : "строк"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ))}
              <div aria-hidden />
              {[1, 2, 3].map((ri) => (
                <div
                  key={ri}
                  className="pt-1 text-center text-[12px] font-semibold text-[var(--ic-ink-2)]"
                >
                  {ri}
                </div>
              ))}
            </div>
            <div className="mt-2 flex justify-between text-[11.5px] text-[var(--ic-ink-2)]">
              <span>← слабее влияние на рейтинг</span>
              <span>сильнее →</span>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
