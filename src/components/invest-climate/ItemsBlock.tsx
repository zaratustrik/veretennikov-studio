"use client";

import { useId, useState, type RefObject } from "react";
import type {
  MetaData,
  Problem,
  RoadmapItem,
} from "@/types/investment-climate";
import {
  GROUP_LABELS,
  ImpactDots,
  PRIORITY_META,
  Reveal,
  Section,
  StatusBadge,
  VERDICT_META,
  orDash,
} from "./shared";
import type { Filters } from "./filters";
import { CompactFilters } from "./CompactFilters";
import { SectionReturnLink } from "./SectionReturnLink";

export type ListMode = "key" | "all";

/** Название строки в списке: для незаполненных 33–36 — честная пометка. */
function itemTitle(item: RoadmapItem): string {
  if (item.originalActivity.trim()) return item.originalActivity;
  return `Строка не заполнена в проекте карты — предлагается: ${item.proposed.activity}`;
}

export function ItemsBlock({
  items,
  displayed,
  keyCount,
  total,
  meta,
  problems,
  filters,
  query,
  listMode,
  onListModeChange,
  onFiltersChange,
  onQueryChange,
  onReset,
  onOpenItem,
  onOverview,
  onPackage,
  searchInputRef,
}: {
  items: RoadmapItem[];
  displayed: RoadmapItem[];
  keyCount: number;
  total: number;
  meta: MetaData;
  problems: Problem[];
  filters: Filters;
  query: string;
  listMode: ListMode;
  onListModeChange: (mode: ListMode) => void;
  onFiltersChange: (patch: Partial<Filters>) => void;
  onQueryChange: (q: string) => void;
  onReset: () => void;
  onOpenItem: (id: number) => void;
  onOverview: () => void;
  onPackage: () => void;
  searchInputRef?: RefObject<HTMLInputElement | null>;
}) {
  const jumpId = useId();
  const [jump, setJump] = useState("");

  const openByNumber = () => {
    const n = Number(jump);
    if (Number.isInteger(n) && n >= 1 && n <= total) {
      onOpenItem(n);
      setJump("");
    }
  };

  return (
    <Section
      id="items"
      title="43 мероприятия исходной карты"
      lead="Центральный модуль: каждая строка дорожной карты с вердиктом, влиянием и предлагаемой редакцией. По умолчанию показаны главные строки — критические, с высоким влиянием, дефектами или без наполнения; полный список — по переключателю."
      wide
    >
      <CompactFilters
        meta={meta}
        problems={problems}
        filters={filters}
        query={query}
        shown={displayed.length}
        total={total}
        onFiltersChange={onFiltersChange}
        onQueryChange={onQueryChange}
        onReset={onReset}
        searchInputRef={searchInputRef}
      />

      {/* ── Представление и быстрый переход ── */}
      <div className="ic-no-print mb-3 flex flex-wrap items-center justify-between gap-3">
        <div
          className="ic-seg"
          role="group"
          aria-label="Представление списка мероприятий"
        >
          <button
            type="button"
            className="ic-seg-btn"
            aria-pressed={listMode === "key"}
            onClick={() => onListModeChange("key")}
          >
            Главные ({keyCount})
          </button>
          <button
            type="button"
            className="ic-seg-btn"
            aria-pressed={listMode === "all"}
            onClick={() => onListModeChange("all")}
          >
            Все {total}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <label
            htmlFor={jumpId}
            className="text-[12.5px] font-semibold text-[var(--ic-ink-2)]"
          >
            Перейти к №
          </label>
          <input
            id={jumpId}
            type="number"
            min={1}
            max={total}
            value={jump}
            onChange={(e) => setJump(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") openByNumber();
            }}
            className="w-[72px] rounded-lg border border-[var(--ic-line)] bg-[var(--ic-surface)] px-2.5 py-1.5 text-[13px]"
          />
          <button
            type="button"
            onClick={openByNumber}
            className="rounded-lg border border-[var(--ic-line)] bg-[var(--ic-surface)] px-3 py-1.5 text-[13px] font-semibold text-[var(--ic-ink-2)] transition hover:border-[var(--ic-accent)] hover:text-[var(--ic-accent-ink)]"
          >
            Открыть
          </button>
        </div>
      </div>

      {/* ── Таблица-гибрид (desktop) / карточки (mobile) ── */}
      <Reveal>
        <div className="ic-card ic-no-print">
          <div className="ic-items-head" aria-hidden>
            <span>№</span>
            <span>Мероприятие · исходный КПЭ</span>
            <span className="ic-col-ind">Показатель</span>
            <span className="ic-col-resp">Ответственный</span>
            <span>Вердикт</span>
            <span>Рейтинг</span>
            <span>Инвестор</span>
            <span>Приоритет</span>
          </div>
          {displayed.length === 0 ? (
            <p className="border-t border-[var(--ic-line)] px-5 py-8 text-center text-[14px] text-[var(--ic-ink-2)]">
              По заданным фильтрам мероприятий не найдено. Сбросьте фильтры или
              измените запрос.
            </p>
          ) : (
            <ul>
              {displayed.map((item) => {
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
                          КПЭ: {orDash(item.originalKpi)}
                        </span>
                      </span>
                      <span className="ic-item-cell-secondary ic-col-ind text-[12.5px] text-[var(--ic-ink-2)]">
                        {item.indicatorCode}
                      </span>
                      <span
                        className="ic-item-cell-secondary ic-col-resp truncate text-[12.5px] text-[var(--ic-ink-2)]"
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
          Сводная таблица 43 мероприятий: вердикт и предлагаемый КПЭ
        </caption>
        <thead>
          <tr>
            <th>№</th>
            <th>Мероприятие</th>
            <th>Вердикт</th>
            <th>Предлагаемый КПЭ</th>
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

      <SectionReturnLink onOverview={onOverview} onPackage={onPackage} />
    </Section>
  );
}
