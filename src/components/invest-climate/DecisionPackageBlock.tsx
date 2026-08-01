"use client";

import { useMemo, useState } from "react";
import type { NewRoadmapRow, SummaryData } from "@/types/investment-climate";
import { Reveal, Section, StatusBadge } from "./shared";
import { DecisionCard } from "./DecisionCard";
import { SectionReturnLink } from "./SectionReturnLink";

const HORIZON_META: Record<string, { label: string; color: string }> = {
  "0-3": { label: "0–3 мес.", color: "var(--ic-s-keep)" },
  "0-6": { label: "0–6 мес.", color: "var(--ic-s-keep)" },
  "3-6": { label: "3–6 мес.", color: "var(--ic-s-improve)" },
  "3-12": { label: "3–12 мес.", color: "var(--ic-s-improve)" },
  "6-12": { label: "6–12 мес.", color: "var(--ic-s-rewrite)" },
  "12-24": { label: "12–24 мес.", color: "var(--ic-s-new)" },
};

/** Метки характера меры: одна мера — один раз, категории — метками. */
function rowTags(r: NewRoadmapRow): { label: string; color: string }[] {
  const tags: { label: string; color: string }[] = [];
  if (["0-3", "0-6"].includes(r.horizon)) {
    tags.push({ label: "быстрая", color: "var(--ic-s-keep)" });
  }
  if (["6-12", "12-24"].includes(r.horizon)) {
    tags.push({ label: "системная", color: "var(--ic-s-rewrite)" });
  }
  if (r.block === "Г" || r.block === "Д") {
    tags.push({ label: "цифровая", color: "var(--ic-s-new)" });
  }
  return tags;
}

/** Колонки плана: строка попадает в колонку по началу горизонта. */
const PLAN_COLUMNS: { label: string; starts: string[] }[] = [
  { label: "0–3 мес.", starts: ["0-3"] },
  { label: "3–6 мес.", starts: ["0-6", "3-6"] },
  { label: "6–12 мес.", starts: ["3-12", "6-12"] },
  { label: "12–24 мес.", starts: ["12-24"] },
];

/**
 * DecisionPackageBlock — единый раздел «Пакет решений»: семь
 * первоочередных решений, план по горизонтам и новая карта 30 строк
 * (полная таблица раскрывается по запросу). Объединяет прежние секции
 * «Предложения» и «Новая карта» без дублирования мер (ТЗ п. 7).
 */
export function DecisionPackageBlock({
  summary,
  newRoadmap,
  onOpenItem,
  onOverview,
}: {
  summary: SummaryData;
  newRoadmap: NewRoadmapRow[];
  onOpenItem: (id: number) => void;
  onOverview: () => void;
}) {
  const [tableOpen, setTableOpen] = useState(false);

  const planColumns = useMemo(
    () =>
      PLAN_COLUMNS.map((c) => ({
        label: c.label,
        rows: newRoadmap.filter((r) => c.starts.includes(r.horizon)),
      })),
    [newRoadmap],
  );

  const blocks = useMemo(() => {
    const map = new Map<string, { title: string; rows: NewRoadmapRow[] }>();
    for (const r of newRoadmap) {
      const entry = map.get(r.block) ?? { title: r.blockTitle, rows: [] };
      entry.rows.push(r);
      map.set(r.block, entry);
    }
    return Array.from(map.entries());
  }, [newRoadmap]);

  return (
    <Section
      id="proposals"
      title="Пакет решений"
      lead="Семь первоочередных решений, план по горизонтам и новая редакция карты: 30 строк в пяти блоках. Каждая мера встречается один раз; характер меры — быстрая, системная, цифровая — показан метками."
      wide
    >
      {/* ── Семь первоочередных решений ── */}
      <h3 className="ic-h3 mb-3">Семь первоочередных решений</h3>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {summary.priorities.map((p, i) => (
          <Reveal key={p.n} delay={Math.min(i * 0.05, 0.25)}>
            <DecisionCard priority={p} />
          </Reveal>
        ))}
      </div>

      {/* ── План по горизонтам ── */}
      <h3 className="ic-h3 mb-3 mt-10">План по горизонтам</h3>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {planColumns.map((c, i) => (
          <Reveal key={c.label} delay={Math.min(i * 0.05, 0.2)}>
            <div className="ic-card h-full p-4">
              <p className="flex items-baseline justify-between gap-2 border-b border-[var(--ic-line)] pb-2 text-[14.5px] font-bold">
                {c.label}
                <span className="text-[13px] font-semibold text-[var(--ic-ink-2)]">
                  {c.rows.length} строк
                </span>
              </p>
              <ul className="mt-2.5 space-y-2">
                {c.rows.map((r) => (
                  <li key={r.id} className="text-[13px] leading-snug">
                    <strong className="text-[var(--ic-accent)]">{r.id}</strong>{" "}
                    {r.title}
                    <span className="mt-0.5 flex flex-wrap gap-1">
                      {rowTags(r).map((t) => (
                        <StatusBadge key={t.label} color={t.color} label={t.label} />
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>

      {/* ── Новая карта: 30 строк (полная таблица по запросу) ── */}
      <div id="new-roadmap" className="mt-10" style={{ scrollMarginTop: 76 }}>
        <button
          type="button"
          className="ic-group-toggle ic-no-print"
          aria-expanded={tableOpen}
          onClick={() => setTableOpen((v) => !v)}
        >
          <span>
            Новая карта: все {newRoadmap.length} строк по пяти блокам
            <span className="ml-2 text-[13px] font-normal text-[var(--ic-ink-2)]">
              каждая строка наследует мероприятия исходной карты и получает КПЭ
              результата
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
        <div className={tableOpen ? "mt-4 space-y-6" : "ic-collapsed mt-4 space-y-6"}>
          {blocks.map(([blockId, block]) => (
            <div key={blockId} className="ic-card overflow-hidden">
              <h4 className="border-b border-[var(--ic-line)] bg-[var(--ic-surface-2)] px-5 py-3 text-[15px] font-semibold">
                Блок {blockId} · {block.title}
              </h4>
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
                        <span className="mt-0.5 flex flex-wrap gap-1">
                          {rowTags(r).map((t) => (
                            <StatusBadge key={t.label} color={t.color} label={t.label} />
                          ))}
                        </span>
                      </span>
                      <span className="text-[12.5px] leading-snug text-[var(--ic-ink-2)]">
                        КПЭ: {r.outcomeKpi}
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
          ))}
        </div>
      </div>

      <SectionReturnLink onOverview={onOverview} onPackage={() => {}} hidePackage />
    </Section>
  );
}
