"use client";

import { useMemo, useState } from "react";
import type { SourceCategory, SourceRef } from "@/types/investment-climate";
import { Reveal, Section, StatusBadge } from "./shared";

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

export function SourcesBlock({ sources }: { sources: SourceRef[] }) {
  const [category, setCategory] = useState<SourceCategory | null>(null);
  const [query, setQuery] = useState("");

  const categories = useMemo(
    () =>
      (Object.keys(CATEGORY_LABELS) as SourceCategory[]).filter((c) =>
        sources.some((s) => s.category === c),
      ),
    [sources],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sources.filter((s) => {
      if (category && s.category !== category) return false;
      if (!q) return true;
      return [s.id, s.title, s.organization, s.note ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [sources, category, query]);

  return (
    <Section
      id="sources"
      title="Источники"
      lead="Библиотека документов и данных, на которых основан аудит. Источники без независимого подтверждения помечены."
    >
      <div className="ic-filters ic-no-print mb-4 space-y-3">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск по названию, организации, номеру…"
          aria-label="Поиск по источникам"
          className="w-full max-w-[420px] rounded-lg border border-[var(--ic-line)] bg-[var(--ic-surface)] px-3.5 py-2 text-[14px]"
        />
        <div className="flex flex-wrap gap-1.5">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              className="ic-chip"
              aria-pressed={category === c}
              onClick={() => setCategory(category === c ? null : c)}
            >
              {CATEGORY_LABELS[c]} ({sources.filter((s) => s.category === c).length})
            </button>
          ))}
          <span className="ml-2 self-center text-[13px] font-semibold" aria-live="polite">
            Показано {filtered.length} из {sources.length}
          </span>
        </div>
      </div>
      <Reveal>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((s) => (
            <article key={s.id} className="ic-card flex h-full flex-col gap-1.5 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[12px] font-bold text-[var(--ic-accent)]">{s.id}</span>
                <span className="text-[11.5px] font-semibold uppercase tracking-wide text-[var(--ic-ink-2)]">
                  {CATEGORY_LABELS[s.category] ?? s.category}
                </span>
                {!s.verified ? (
                  <StatusBadge color="var(--ic-s-nodata)" label="Не подтверждён независимо" />
                ) : null}
              </div>
              <h3 className="text-[13.5px] font-semibold leading-snug">{s.title}</h3>
              <p className="text-[12.5px] text-[var(--ic-ink-2)]">
                {s.organization} · {s.date} · доступ {s.accessed}
              </p>
              {s.note ? (
                <p className="text-[12.5px] leading-relaxed text-[var(--ic-ink-2)]">{s.note}</p>
              ) : null}
              {s.url ? (
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto break-all pt-1 text-[12.5px] font-medium text-[var(--ic-accent)] hover:text-[var(--ic-accent-ink)]"
                >
                  {s.url}
                </a>
              ) : (
                <p className="mt-auto pt-1 text-[12px] text-[var(--ic-s-nodata)]">
                  Ссылка недоступна (закрытый или офлайн-документ)
                </p>
              )}
            </article>
          ))}
        </div>
        {filtered.length === 0 ? (
          <p className="py-8 text-center text-[14px] text-[var(--ic-ink-2)]">
            По запросу источников не найдено.
          </p>
        ) : null}
      </Reveal>
    </Section>
  );
}
