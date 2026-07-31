"use client";

import { useId } from "react";
import type {
  EvidenceGrade,
  MetaData,
  Priority,
  Problem,
  ResponsibleGroup,
  RoadmapItem,
  Verdict,
} from "@/types/investment-climate";
import {
  EVIDENCE_META,
  GROUP_LABELS,
  ImpactDots,
  PRIORITY_META,
  Reveal,
  Section,
  StatusBadge,
  VERDICT_META,
  orDash,
} from "./shared";
import { hasActiveFilters, type BenchFilter, type Filters } from "./filters";

const VERDICTS: Verdict[] = [
  "keep",
  "improve",
  "rewrite",
  "merge",
  "remove",
  "conditional",
  "fill-new",
];

const GROUPS: ResponsibleGroup[] = ["ministry", "agency", "none"];
const PRIORITIES: Priority[] = ["critical", "high", "medium", "low"];
const EVIDENCE: EvidenceGrade[] = ["высокая", "средняя", "низкая"];
const BENCH_OPTIONS: { value: BenchFilter; label: string }[] = [
  { value: "ru", label: "Есть российский аналог" },
  { value: "intl", label: "Есть международный аналог" },
  { value: "none", label: "Аналогов нет" },
];

function ChipGroup<T extends string | number>({
  label,
  options,
  active,
  onToggle,
}: {
  label: string;
  options: { value: T; label: string }[];
  active: T | null;
  onToggle: (value: T | null) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="mr-1 text-[12px] font-semibold uppercase tracking-wide text-[var(--ic-ink-2)]">
        {label}
      </span>
      {options.map((o) => (
        <button
          key={String(o.value)}
          type="button"
          className="ic-chip"
          aria-pressed={active === o.value}
          onClick={() => onToggle(active === o.value ? null : o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** Название строки в списке: для незаполненных 33–36 — честная пометка. */
function itemTitle(item: RoadmapItem): string {
  if (item.originalActivity.trim()) return item.originalActivity;
  return `Строка не заполнена в проекте карты — предлагается: ${item.proposed.activity}`;
}

export function ItemsBlock({
  items,
  filtered,
  total,
  meta,
  problems,
  filters,
  query,
  onFiltersChange,
  onQueryChange,
  onReset,
  onOpenItem,
}: {
  items: RoadmapItem[];
  filtered: RoadmapItem[];
  total: number;
  meta: MetaData;
  problems: Problem[];
  filters: Filters;
  query: string;
  onFiltersChange: (patch: Partial<Filters>) => void;
  onQueryChange: (q: string) => void;
  onReset: () => void;
  onOpenItem: (id: number) => void;
}) {
  const searchId = useId();
  const problemSelectId = useId();
  const active = hasActiveFilters(filters, query);

  return (
    <Section
      id="items"
      title="43 мероприятия исходной карты"
      lead="Центральный модуль: каждая строка дорожной карты с вердиктом, влиянием и предлагаемой редакцией. Откройте строку, чтобы увидеть полную карточку."
      wide
    >
      {/* ── Панель фильтров ── */}
      <div className="ic-filters ic-card ic-no-print mb-4 space-y-3 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <label htmlFor={searchId} className="sr-only">
            Поиск по мероприятиям
          </label>
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Поиск: текст, KPI, заключение, ответственные…"
            className="w-full max-w-[420px] rounded-lg border border-[var(--ic-line)] bg-[var(--ic-bg)] px-3.5 py-2 text-[14px]"
          />
          <span className="text-[13.5px] font-semibold" aria-live="polite">
            Показано {filtered.length} из {total}
          </span>
          {active ? (
            <button
              type="button"
              onClick={onReset}
              className="text-[13px] font-semibold text-[var(--ic-accent)] hover:text-[var(--ic-accent-ink)]"
            >
              Сбросить фильтры
            </button>
          ) : null}
        </div>
        <ChipGroup
          label="Показатель"
          options={meta.indicators.map((i) => ({ value: i.code, label: i.code }))}
          active={filters.ind}
          onToggle={(v) => onFiltersChange({ ind: v })}
        />
        <ChipGroup
          label="Вердикт"
          options={VERDICTS.map((v) => ({ value: v, label: VERDICT_META[v].label }))}
          active={filters.verdict}
          onToggle={(v) => onFiltersChange({ verdict: v })}
        />
        <div className="flex flex-wrap gap-x-6 gap-y-3">
          <ChipGroup
            label="Ответственный"
            options={GROUPS.map((g) => ({ value: g, label: GROUP_LABELS[g] }))}
            active={filters.group}
            onToggle={(v) => onFiltersChange({ group: v })}
          />
          <ChipGroup
            label="Влияние на рейтинг"
            options={[1, 2, 3].map((n) => ({ value: n, label: String(n) }))}
            active={filters.ri}
            onToggle={(v) => onFiltersChange({ ri: v })}
          />
          <ChipGroup
            label="Влияние на инвестора"
            options={[1, 2, 3].map((n) => ({ value: n, label: String(n) }))}
            active={filters.ii}
            onToggle={(v) => onFiltersChange({ ii: v })}
          />
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-3">
          <ChipGroup
            label="Приоритет"
            options={PRIORITIES.map((p) => ({ value: p, label: PRIORITY_META[p].label }))}
            active={filters.priority}
            onToggle={(v) => onFiltersChange({ priority: v })}
          />
          <ChipGroup
            label="Доказательность"
            options={EVIDENCE.map((e) => ({ value: e, label: EVIDENCE_META[e].label }))}
            active={filters.ev}
            onToggle={(v) => onFiltersChange({ ev: v })}
          />
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <ChipGroup
            label="Аналоги"
            options={BENCH_OPTIONS}
            active={filters.bench}
            onToggle={(v) => onFiltersChange({ bench: v })}
          />
          <div className="flex items-center gap-2">
            <label
              htmlFor={problemSelectId}
              className="text-[12px] font-semibold uppercase tracking-wide text-[var(--ic-ink-2)]"
            >
              Проблема
            </label>
            <select
              id={problemSelectId}
              value={filters.problem ?? ""}
              onChange={(e) =>
                onFiltersChange({ problem: e.target.value || null })
              }
              className="rounded-lg border border-[var(--ic-line)] bg-[var(--ic-surface)] px-2.5 py-1.5 text-[13px]"
            >
              <option value="">Все проблемы</option>
              {problems.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── Таблица-гибрид (desktop) / карточки (mobile) ── */}
      <Reveal>
        <div className="ic-card ic-no-print overflow-hidden">
          <div className="ic-items-head" aria-hidden>
            <span>№</span>
            <span>Мероприятие · исходный KPI</span>
            <span>Показатель</span>
            <span>Ответственный</span>
            <span>Вердикт</span>
            <span>Рейтинг</span>
            <span>Инвестор</span>
            <span>Приоритет</span>
          </div>
          {filtered.length === 0 ? (
            <p className="border-t border-[var(--ic-line)] px-5 py-8 text-center text-[14px] text-[var(--ic-ink-2)]">
              По заданным фильтрам мероприятий не найдено. Сбросьте фильтры или
              измените запрос.
            </p>
          ) : (
            <ul>
              {filtered.map((item) => {
                const vm = VERDICT_META[item.verdict];
                const pm = PRIORITY_META[item.priority];
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      className="ic-item-row"
                      onClick={() => onOpenItem(item.id)}
                      aria-label={`Открыть карточку мероприятия ${item.id}`}
                    >
                      <span className="text-[14px] font-bold text-[var(--ic-accent)]">
                        {item.id}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-[13.5px] font-medium leading-snug">
                          {itemTitle(item)}
                        </span>
                        <span className="block truncate text-[12px] text-[var(--ic-ink-2)]">
                          KPI: {orDash(item.originalKpi)}
                        </span>
                      </span>
                      <span className="ic-item-cell-secondary text-[12.5px] text-[var(--ic-ink-2)]">
                        {item.indicatorCode}
                      </span>
                      <span
                        className="ic-item-cell-secondary truncate text-[12.5px] text-[var(--ic-ink-2)]"
                        title={item.responsible.join(", ")}
                      >
                        {GROUP_LABELS[item.responsibleGroup]}
                      </span>
                      <span className="ic-item-cell-secondary">
                        <StatusBadge
                          color={vm.color}
                          label={vm.label}
                          title={item.verdictLabel}
                        />
                      </span>
                      <span className="ic-item-cell-secondary">
                        <ImpactDots value={item.ratingImpact} label="Влияние на рейтинг" />
                      </span>
                      <span className="ic-item-cell-secondary">
                        <ImpactDots value={item.investorImpact} label="Влияние на инвестора" />
                      </span>
                      <span className="ic-item-cell-secondary">
                        <StatusBadge color={pm.color} label={pm.label} />
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </Reveal>

      {/* ── Сводная таблица для печати (все 43 строки) ── */}
      <table className="ic-print-table">
        <caption className="mb-1 text-left font-semibold">
          Сводная таблица 43 мероприятий: вердикт и предлагаемый KPI
        </caption>
        <thead>
          <tr>
            <th>№</th>
            <th>Мероприятие</th>
            <th>Вердикт</th>
            <th>Предлагаемый KPI</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{itemTitle(item)}</td>
              <td>{item.verdictLabel}</td>
              <td>{orDash(item.proposed.kpiName)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Section>
  );
}
