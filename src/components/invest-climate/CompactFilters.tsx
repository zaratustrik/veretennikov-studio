"use client";

import { useId, useState, type RefObject } from "react";
import type {
  EvidenceGrade,
  MetaData,
  Priority,
  Problem,
  ResponsibleGroup,
  Verdict,
} from "@/types/investment-climate";
import {
  EVIDENCE_META,
  GROUP_LABELS,
  PRIORITY_META,
  VERDICT_META,
} from "./shared";
import {
  countActiveFilters,
  hasActiveFilters,
  type BenchFilter,
  type Filters,
} from "./filters";

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

/** Метка активного фильтра с кнопкой снятия (паттерн dismissible tag). */
function FilterTag({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <span className="ic-filter-tag">
      {label}
      <button
        type="button"
        className="ic-filter-tag-x"
        onClick={onRemove}
        aria-label={`Снять фильтр: ${label}`}
      >
        ×
      </button>
    </span>
  );
}

/**
 * CompactFilters — строка фильтров по умолчанию: поиск + вердикт +
 * приоритет + «Все фильтры» (остальные шесть групп в раскрытии).
 * Активные фильтры — метки с «×», общий сброс, счётчик найденного
 * (паттерн Carbon Filtering, реализация своя на токенах --ic-*).
 */
export function CompactFilters({
  meta,
  problems,
  filters,
  query,
  shown,
  total,
  onFiltersChange,
  onQueryChange,
  onReset,
  searchInputRef,
}: {
  meta: MetaData;
  problems: Problem[];
  filters: Filters;
  query: string;
  shown: number;
  total: number;
  onFiltersChange: (patch: Partial<Filters>) => void;
  onQueryChange: (q: string) => void;
  onReset: () => void;
  searchInputRef?: RefObject<HTMLInputElement | null>;
}) {
  const searchId = useId();
  const verdictId = useId();
  const priorityId = useId();
  const problemSelectId = useId();
  const morePanelId = useId();
  const [expanded, setExpanded] = useState(false);

  const active = hasActiveFilters(filters, query);
  const activeCount = countActiveFilters(filters, query);
  // Счётчик на кнопке «Все фильтры» — только фильтры скрытых групп.
  const hiddenActive = countActiveFilters(
    { ...filters, verdict: null, priority: null },
    "",
  );

  const tags: { key: string; label: string; onRemove: () => void }[] = [];
  if (query.trim()) {
    tags.push({
      key: "q",
      label: `Поиск: «${query.trim()}»`,
      onRemove: () => onQueryChange(""),
    });
  }
  if (filters.verdict) {
    tags.push({
      key: "verdict",
      label: `Вердикт: ${VERDICT_META[filters.verdict].label.toLowerCase()}`,
      onRemove: () => onFiltersChange({ verdict: null }),
    });
  }
  if (filters.priority) {
    tags.push({
      key: "priority",
      label: `Приоритет: ${PRIORITY_META[filters.priority].label.toLowerCase()}`,
      onRemove: () => onFiltersChange({ priority: null }),
    });
  }
  if (filters.ind) {
    tags.push({
      key: "ind",
      label: `Показатель ${filters.ind}`,
      onRemove: () => onFiltersChange({ ind: null }),
    });
  }
  if (filters.group) {
    tags.push({
      key: "group",
      label: `Ответственный: ${GROUP_LABELS[filters.group]}`,
      onRemove: () => onFiltersChange({ group: null }),
    });
  }
  if (filters.ri) {
    tags.push({
      key: "ri",
      label: `Влияние на рейтинг: ${filters.ri}`,
      onRemove: () => onFiltersChange({ ri: null }),
    });
  }
  if (filters.ii) {
    tags.push({
      key: "ii",
      label: `Влияние на инвестора: ${filters.ii}`,
      onRemove: () => onFiltersChange({ ii: null }),
    });
  }
  if (filters.ev) {
    tags.push({
      key: "ev",
      label: `Доказательность: ${EVIDENCE_META[filters.ev].label.toLowerCase()}`,
      onRemove: () => onFiltersChange({ ev: null }),
    });
  }
  if (filters.bench) {
    const b = BENCH_OPTIONS.find((o) => o.value === filters.bench);
    tags.push({
      key: "bench",
      label: b?.label ?? "Аналоги",
      onRemove: () => onFiltersChange({ bench: null }),
    });
  }
  if (filters.problem) {
    const p = problems.find((pr) => pr.id === filters.problem);
    tags.push({
      key: "problem",
      label: `Проблема: ${p?.title ?? filters.problem}`,
      onRemove: () => onFiltersChange({ problem: null }),
    });
  }

  return (
    <div className="ic-filters ic-card ic-no-print mb-4 space-y-3 p-4">
      {/* ── Одна строка по умолчанию ── */}
      <div className="flex flex-wrap items-center gap-2.5">
        <label htmlFor={searchId} className="sr-only">
          Поиск по мероприятиям
        </label>
        <input
          id={searchId}
          ref={searchInputRef}
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Поиск: текст, КПЭ, заключение, ответственные…"
          className="w-full min-w-[200px] max-w-[360px] flex-1 rounded-lg border border-[var(--ic-line)] bg-[var(--ic-bg)] px-3.5 py-2 text-[14px]"
        />
        <label htmlFor={verdictId} className="sr-only">
          Вердикт
        </label>
        <select
          id={verdictId}
          className="ic-filter-select"
          value={filters.verdict ?? ""}
          onChange={(e) =>
            onFiltersChange({
              verdict: (e.target.value || null) as Verdict | null,
            })
          }
        >
          <option value="">Вердикт: любой</option>
          {VERDICTS.map((v) => (
            <option key={v} value={v}>
              {VERDICT_META[v].label}
            </option>
          ))}
        </select>
        <label htmlFor={priorityId} className="sr-only">
          Приоритет
        </label>
        <select
          id={priorityId}
          className="ic-filter-select"
          value={filters.priority ?? ""}
          onChange={(e) =>
            onFiltersChange({
              priority: (e.target.value || null) as Priority | null,
            })
          }
        >
          <option value="">Приоритет: любой</option>
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {PRIORITY_META[p].label}
            </option>
          ))}
        </select>
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={morePanelId}
          onClick={() => setExpanded((v) => !v)}
          className="inline-flex items-center gap-2 rounded-lg border border-[var(--ic-line)] bg-[var(--ic-surface)] px-3 py-2 text-[13px] font-semibold text-[var(--ic-ink-2)] transition hover:border-[var(--ic-accent)] hover:text-[var(--ic-accent-ink)]"
        >
          {expanded ? "Свернуть фильтры" : "Все фильтры"}
          {hiddenActive > 0 ? (
            <span className="ic-filter-count">{hiddenActive}</span>
          ) : null}
        </button>
        {active ? (
          <span className="text-[13px] font-semibold" aria-live="polite">
            Показано {shown} из {total}
          </span>
        ) : null}
      </div>

      {/* ── Раскрытие остальных групп ── */}
      {expanded ? (
        <div id={morePanelId} className="space-y-3 border-t border-[var(--ic-line)] pt-3">
          <ChipGroup
            label="Показатель"
            options={meta.indicators.map((i) => ({ value: i.code, label: i.code }))}
            active={filters.ind}
            onToggle={(v) => onFiltersChange({ ind: v })}
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
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <ChipGroup
              label="Доказательность"
              options={EVIDENCE.map((e) => ({
                value: e,
                label: EVIDENCE_META[e].label,
              }))}
              active={filters.ev}
              onToggle={(v) => onFiltersChange({ ev: v })}
            />
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
                className="ic-filter-select"
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
      ) : null}

      {/* ── Активные фильтры-метки + сброс ── */}
      {tags.length > 0 ? (
        <div className="flex flex-wrap items-center gap-1.5 border-t border-[var(--ic-line)] pt-3">
          <span className="sr-only">Активные фильтры: {activeCount}</span>
          {tags.map((t) => (
            <FilterTag key={t.key} label={t.label} onRemove={t.onRemove} />
          ))}
          <button
            type="button"
            onClick={onReset}
            className="ml-1 text-[13px] font-semibold text-[var(--ic-accent)] hover:text-[var(--ic-accent-ink)]"
          >
            Сбросить всё
          </button>
        </div>
      ) : null}
    </div>
  );
}
