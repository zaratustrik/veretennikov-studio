"use client";

import { useMemo, useState } from "react";
import type { NewRoadmapRow } from "@/types/investment-climate";
import { Reveal, Section, StatusBadge } from "./shared";

const HORIZON_META: Record<string, { label: string; color: string }> = {
  "0-3": { label: "0–3 мес.", color: "var(--ic-s-keep)" },
  "0-6": { label: "0–6 мес.", color: "var(--ic-s-keep)" },
  "3-6": { label: "3–6 мес.", color: "var(--ic-s-improve)" },
  "3-12": { label: "3–12 мес.", color: "var(--ic-s-improve)" },
  "6-12": { label: "6–12 мес.", color: "var(--ic-s-rewrite)" },
  "12-24": { label: "12–24 мес.", color: "var(--ic-s-new)" },
};

export function NewRoadmapBlock({
  newRoadmap,
  onOpenItem,
}: {
  newRoadmap: NewRoadmapRow[];
  onOpenItem: (id: number) => void;
}) {
  const [horizon, setHorizon] = useState<string | null>(null);

  const horizons = useMemo(
    () => Array.from(new Set(newRoadmap.map((r) => r.horizon))),
    [newRoadmap],
  );

  const blocks = useMemo(() => {
    const rows = horizon
      ? newRoadmap.filter((r) => r.horizon === horizon)
      : newRoadmap;
    const map = new Map<string, { title: string; rows: NewRoadmapRow[] }>();
    for (const r of rows) {
      const entry = map.get(r.block) ?? { title: r.blockTitle, rows: [] };
      entry.rows.push(r);
      map.set(r.block, entry);
    }
    return Array.from(map.entries());
  }, [newRoadmap, horizon]);

  const shown = blocks.reduce((n, [, b]) => n + b.rows.length, 0);

  return (
    <Section
      id="new-roadmap"
      title="Новая карта: 30 строк"
      lead="Предлагаемая редакция дорожной карты по пяти блокам. Каждая строка наследует мероприятия исходной карты (чипы «№») и получает KPI результата."
      wide
    >
      <div className="ic-filters ic-no-print mb-4 flex flex-wrap items-center gap-1.5">
        <span className="mr-1 text-[12px] font-semibold uppercase tracking-wide text-[var(--ic-ink-2)]">
          Горизонт
        </span>
        {horizons.map((h) => (
          <button
            key={h}
            type="button"
            className="ic-chip"
            aria-pressed={horizon === h}
            onClick={() => setHorizon(horizon === h ? null : h)}
          >
            {HORIZON_META[h]?.label ?? `${h} мес.`}
          </button>
        ))}
        <span className="ml-2 text-[13px] font-semibold" aria-live="polite">
          Показано {shown} из {newRoadmap.length}
        </span>
      </div>
      <div className="space-y-6">
        {blocks.map(([blockId, block]) => (
          <Reveal key={blockId}>
            <div className="ic-card overflow-hidden">
              <h3 className="border-b border-[var(--ic-line)] bg-[var(--ic-surface-2)] px-5 py-3 text-[15px] font-semibold">
                Блок {blockId} · {block.title}
              </h3>
              <ul>
                {block.rows.map((r) => {
                  const hm = HORIZON_META[r.horizon] ?? {
                    label: `${r.horizon} мес.`,
                    color: "var(--ic-s-nodata)",
                  };
                  return (
                    <li
                      key={r.id}
                      className="grid gap-2 border-t border-[var(--ic-line)] px-5 py-3 first:border-t-0 md:grid-cols-[64px_minmax(0,1fr)_minmax(0,1fr)_150px_110px] md:items-center"
                    >
                      <span className="text-[14px] font-bold text-[var(--ic-accent)]">
                        {r.id}
                      </span>
                      <span className="text-[13.5px] font-medium leading-snug">
                        {r.title}
                      </span>
                      <span className="text-[12.5px] leading-snug text-[var(--ic-ink-2)]">
                        KPI: {r.outcomeKpi}
                      </span>
                      <span className="flex flex-wrap gap-1">
                        {r.fromItems.length > 0 ? (
                          r.fromItems.map((id) => (
                            <button
                              key={id}
                              type="button"
                              className="ic-chip ic-no-print"
                              onClick={() => onOpenItem(id)}
                              aria-label={`Открыть исходное мероприятие ${id}`}
                            >
                              № {id}
                            </button>
                          ))
                        ) : (
                          <span
                            className="text-[12px] text-[var(--ic-s-nodata)]"
                            title="Новая строка, не наследует мероприятий исходной карты"
                          >
                            новая строка
                          </span>
                        )}
                      </span>
                      <span>
                        <StatusBadge color={hm.color} label={hm.label} />
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
