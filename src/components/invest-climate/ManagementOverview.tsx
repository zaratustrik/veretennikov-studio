"use client";

import { useMemo } from "react";
import type { InvestClimateData } from "@/types/investment-climate";
import { Reveal, Section, VERDICT_META } from "./shared";
import { DecisionCard } from "./DecisionCard";
import { FINDING_EVIDENCE, SourceReference } from "./SourceReference";

/** Горизонты мини-плана: строка новой карты попадает в колонку по началу срока. */
const PLAN_COLUMNS: { id: string; label: string; starts: string[] }[] = [
  { id: "h1", label: "0–3 мес.", starts: ["0-3"] },
  { id: "h2", label: "3–6 мес.", starts: ["0-6", "3-6"] },
  { id: "h3", label: "6–12 мес.", starts: ["3-12", "6-12"] },
  { id: "h4", label: "12–24 мес.", starts: ["12-24"] },
];

/**
 * ManagementOverview — управленческий уровень (~2 экрана):
 * положение региона, пять главных выводов, диагноз карты, семь
 * первоочередных решений и мини-план. Подробный анализ — по кнопке.
 */
export function ManagementOverview({
  data,
  onGoFull,
}: {
  data: InvestClimateData;
  onGoFull: (sectionId?: string) => void;
}) {
  const { meta, summary, items, newRoadmap, sources } = data;

  const topFindings = useMemo(() => {
    const order = { critical: 0, high: 1, medium: 2 } as const;
    return [...summary.findings]
      .sort((a, b) => order[a.significance] - order[b.significance])
      .slice(0, 5);
  }, [summary.findings]);

  const mapIndicator = meta.indicators.find((i) => i.code === "4.1.3");
  const filledCount = items.filter((i) => i.originalActivity.trim().length > 0).length;
  const formalCount = items.filter((i) => i.issues.includes("formal-kpi")).length;

  const diagnosisTiles: { value: string; label: string }[] = [
    {
      value: `${meta.verdictStats.rewrite ?? 0} из ${items.length}`,
      label: `строк — вердикт «${VERDICT_META.rewrite.label.toLowerCase()}»`,
    },
    {
      value: `${formalCount} из ${filledCount}`,
      label: "заполненных строк измеряют активность, а не результат",
    },
    {
      value: `${items.length - filledCount}`,
      label: "строки (33–36) не заполнены в проекте карты",
    },
    {
      value: `${meta.verdictStats.keep ?? 0}`,
      label: `строк — вердикт «${VERDICT_META.keep.label.toLowerCase()}»`,
    },
  ];

  const planCounts = PLAN_COLUMNS.map((c) => ({
    ...c,
    count: newRoadmap.filter((r) => c.starts.includes(r.horizon)).length,
  }));

  return (
    <Section
      id="overview"
      title="Основные выводы"
      lead="Главная мысль аудита за три минуты: где регион находится, что не так с картой и какие решения нужны в первую очередь. Подробный анализ — по кнопке в конце или переключателем в шапке."
    >
      {/* ── Положение региона: факты ── */}
      <Reveal>
        <div className="ic-level-fact grid gap-x-8 gap-y-4 px-6 py-5 sm:grid-cols-3">
          <div>
            <p className="ic-level-caption">Место в Нацрейтинге АСИ</p>
            <p className="mt-1 text-[30px] font-bold leading-9">
              {meta.rating.y2024} → {meta.rating.y2025} →{" "}
              <span style={{ color: "var(--ic-s-remove)" }}>{meta.rating.y2026}</span>
            </p>
            <p className="mt-1 text-[12px] text-[var(--ic-ink-2)]">
              2024–2026 · источник: {meta.rating.sources[meta.rating.sources.length - 1]}
            </p>
          </div>
          <div>
            <p className="ic-level-caption">Инвестиционная карта</p>
            <p className="mt-1 text-[30px] font-bold leading-9">
              {mapIndicator ? mapIndicator.so.toFixed(2).replace(".", ",") : "—"}
            </p>
            <p className="mt-1 text-[12px] text-[var(--ic-ink-2)]">
              самая низкая оценка из пяти показателей карты
              {mapIndicator?.rfAvg
                ? ` (средняя по РФ ${mapIndicator.rfAvg.toFixed(2).replace(".", ",")})`
                : ""}{" "}
              · АСИ, 2025
            </p>
          </div>
          <div>
            <p className="ic-level-caption">Горизонт карты</p>
            <p className="mt-1 text-[17px] font-bold leading-7">{meta.period}</p>
            <p className="mt-1 text-[12px] text-[var(--ic-ink-2)]">
              данные по состоянию на {meta.dataDate}
            </p>
          </div>
        </div>
      </Reveal>

      {/* ── Пять главных выводов ── */}
      <h3 className="ic-h3 mb-3 mt-8">Пять главных выводов</h3>
      <div className="grid gap-3 lg:grid-cols-2">
        {topFindings.map((f, i) => {
          const ev = FINDING_EVIDENCE[f.id];
          const evSources = ev
            ? sources.filter((s) => ev.sourceIds.includes(s.id))
            : [];
          return (
            <Reveal key={f.id} delay={Math.min(i * 0.05, 0.25)}>
              <article
                className={`ic-level-conclusion flex h-full flex-col gap-2 p-4 ${
                  i === 0 ? "lg:col-span-2" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <h4 className="text-[15.5px] font-semibold leading-snug">
                    {f.thesis}
                  </h4>
                  <span className="text-[13px] font-bold text-[var(--ic-accent)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <p className="text-[13.5px] leading-relaxed text-[var(--ic-ink-2)]">
                  {f.explanation}
                </p>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-1">
                  {ev ? (
                    <SourceReference status={ev.status} sources={evSources} />
                  ) : (
                    <span />
                  )}
                  <button
                    type="button"
                    onClick={() => onGoFull(f.anchor.replace(/^#/, ""))}
                    className="ic-no-print text-[12.5px] font-semibold text-[var(--ic-accent)] hover:text-[var(--ic-accent-ink)]"
                  >
                    Подробнее →
                  </button>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>

      {/* ── Диагноз карты ── */}
      <h3 className="ic-h3 mb-3 mt-8">Диагноз дорожной карты</h3>
      <Reveal>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {diagnosisTiles.map((t) => (
            <div key={t.label} className="ic-level-fact px-5 py-4">
              <p className="text-[24px] font-bold leading-8">{t.value}</p>
              <p className="mt-1 text-[12.5px] font-medium text-[var(--ic-ink-2)]">
                {t.label}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-2 text-[12px] text-[var(--ic-ink-2)]">
          Источник: построчный разбор проекта дорожной карты (43 строки, сверен
          по SHA-256), {meta.dataDate}.
        </p>
      </Reveal>

      {/* ── Семь первоочередных решений ── */}
      <h3 className="ic-h3 mb-3 mt-8">Семь первоочередных решений</h3>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {summary.priorities.map((p, i) => (
          <Reveal key={p.n} delay={Math.min(i * 0.04, 0.2)}>
            <DecisionCard priority={p} compact />
          </Reveal>
        ))}
        {/* Мини-план в той же сетке — чередование плотности */}
        <Reveal delay={0.25}>
          <div className="ic-card flex h-full flex-col gap-2.5 p-4">
            <p className="ic-level-caption">Мини-план: строки новой карты</p>
            <ul className="space-y-1.5">
              {planCounts.map((c) => (
                <li
                  key={c.id}
                  className="flex items-center justify-between gap-3 text-[13.5px]"
                >
                  <span>{c.label}</span>
                  <span className="font-bold">{c.count}</span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => onGoFull("proposals")}
              className="ic-no-print mt-auto self-start text-[13px] font-semibold text-[var(--ic-accent)] hover:text-[var(--ic-accent-ink)]"
            >
              Открыть пакет решений →
            </button>
          </div>
        </Reveal>
      </div>

      {/* ── Переход к подробному анализу ── */}
      <Reveal className="ic-no-print mt-10">
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => onGoFull()}
            className="rounded-lg bg-[var(--ic-accent)] px-5 py-2.5 text-[14.5px] font-semibold text-white transition hover:bg-[var(--ic-accent-ink)]"
          >
            Перейти к подробному анализу
          </button>
          <p className="text-[13px] text-[var(--ic-ink-2)]">
            43 мероприятия построчно, путь инвестора, практики, методика и
            источники.
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
