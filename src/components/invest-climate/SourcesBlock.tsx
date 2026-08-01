"use client";

import { useMemo, useState } from "react";
import type { SourceCategory, SourceRef } from "@/types/investment-climate";
import { Reveal, Section, StatusBadge } from "./shared";
import { SourceLink } from "./SourceReference";
import { SectionReturnLink } from "./SectionReturnLink";

const CATEGORY_LABELS: Record<SourceCategory, string> = {
  federal: "Федеральные",
  regional: "Региональные",
  rating: "Рейтинг АСИ",
  stats: "Статистика",
  research: "Исследования",
  "ru-practice": "Российские практики",
  "intl-practice": "Международные практики",
  legal: "Правовые акты",
  service: "Сервисы и порталы",
};

/**
 * SourcesBlock — библиотека источников, сгруппированная по категориям
 * со свёрнутыми группами (не 47 карточек подряд — аудит П-7). Ссылки —
 * «Открыть официальный документ» с доменом вместо сырых URL (ТЗ п. 14).
 */
export function SourcesBlock({
  sources,
  onOverview,
  onPackage,
}: {
  sources: SourceRef[];
  onOverview: () => void;
  onPackage: () => void;
}) {
  const [query, setQuery] = useState("");
  const [openGroups, setOpenGroups] = useState<Set<SourceCategory>>(new Set());

  const q = query.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      sources.filter((s) => {
        if (!q) return true;
        return [s.id, s.title, s.organization, s.note ?? ""]
          .join(" ")
          .toLowerCase()
          .includes(q);
      }),
    [sources, q],
  );

  const grouped = useMemo(() => {
    const cats = Object.keys(CATEGORY_LABELS) as SourceCategory[];
    return cats
      .map((c) => ({
        category: c,
        list: filtered.filter((s) => s.category === c),
        total: sources.filter((s) => s.category === c).length,
      }))
      .filter((g) => g.total > 0);
  }, [filtered, sources]);

  const toggleGroup = (c: SourceCategory) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });
  };

  return (
    <Section
      id="sources"
      title="Источники"
      lead="Библиотека документов и данных, на которых основан аудит, — по категориям. Источники без независимого подтверждения помечены."
    >
      <div className="ic-filters ic-no-print mb-4 flex flex-wrap items-center gap-3">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск по названию, организации, номеру…"
          aria-label="Поиск по источникам"
          className="w-full max-w-[420px] rounded-lg border border-[var(--ic-line)] bg-[var(--ic-surface)] px-3.5 py-2 text-[14px]"
        />
        {q ? (
          <span className="text-[13px] font-semibold" aria-live="polite">
            Найдено {filtered.length} из {sources.length}
          </span>
        ) : null}
      </div>

      <Reveal>
        <div className="space-y-3">
          {grouped.map((g) => {
            // При активном поиске группы с совпадениями раскрыты.
            const open = q ? g.list.length > 0 : openGroups.has(g.category);
            return (
              <div key={g.category}>
                <button
                  type="button"
                  className="ic-group-toggle ic-no-print"
                  aria-expanded={open}
                  onClick={() => toggleGroup(g.category)}
                >
                  <span>
                    {CATEGORY_LABELS[g.category]}
                    <span className="ml-2 text-[13px] font-normal text-[var(--ic-ink-2)]">
                      {q ? `${g.list.length} из ${g.total}` : g.total}
                    </span>
                  </span>
                  <svg
                    className="ic-group-chevron"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    aria-hidden
                  >
                    <path
                      d="M3 6l5 5 5-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
                <div
                  className={
                    open
                      ? "mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3"
                      : "ic-collapsed mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3"
                  }
                >
                  {g.list.map((s) => (
                    <article
                      key={s.id}
                      className="ic-level-fact flex h-full flex-col gap-1.5 p-4"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[12px] font-bold text-[var(--ic-accent)]">
                          {s.id}
                        </span>
                        {!s.verified ? (
                          <StatusBadge
                            color="var(--ic-s-nodata)"
                            label="Не подтверждён независимо"
                          />
                        ) : null}
                      </div>
                      <h3 className="text-[13.5px] font-semibold leading-snug">
                        {s.title}
                      </h3>
                      <p className="text-[12.5px] text-[var(--ic-ink-2)]">
                        {s.organization} · {s.date} · доступ {s.accessed}
                      </p>
                      {s.note ? (
                        <p className="text-[12.5px] leading-relaxed text-[var(--ic-ink-2)]">
                          {s.note}
                        </p>
                      ) : null}
                      <div className="mt-auto pt-1">
                        <SourceLink url={s.url} />
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        {q && filtered.length === 0 ? (
          <p className="py-8 text-center text-[14px] text-[var(--ic-ink-2)]">
            По запросу источников не найдено.
          </p>
        ) : null}
      </Reveal>

      <SectionReturnLink onOverview={onOverview} onPackage={onPackage} />
    </Section>
  );
}
