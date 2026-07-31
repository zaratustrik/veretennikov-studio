"use client";

import type { NewRoadmapRow, SummaryData } from "@/types/investment-climate";
import { Reveal, Section, StatusBadge } from "./shared";

/** Быстрые горизонты новой карты. */
const FAST = new Set(["0-3", "0-6", "3-6"]);
/** Системные горизонты. */
const SYSTEM = new Set(["3-12", "6-12", "12-24"]);

export function ProposalsBlock({
  summary,
  newRoadmap,
}: {
  summary: SummaryData;
  newRoadmap: NewRoadmapRow[];
}) {
  const fastRows = newRoadmap.filter((r) => FAST.has(r.horizon));
  const systemRows = newRoadmap.filter((r) => SYSTEM.has(r.horizon));
  // «Цифровой контур» — блоки новой карты, связанные с сервисами и данными
  // (Инвесткарта и цифровые каналы спецорганизации).
  const digitalRows = newRoadmap.filter((r) => r.block === "Д" || r.block === "Г");

  const columns: {
    title: string;
    note: string;
    rows: NewRoadmapRow[];
    color: string;
  }[] = [
    {
      title: "Быстрые меры",
      note: "горизонт 0–6 месяцев",
      rows: fastRows,
      color: "var(--ic-s-keep)",
    },
    {
      title: "Системные меры",
      note: "горизонт 6–24 месяца",
      rows: systemRows,
      color: "var(--ic-s-rewrite)",
    },
    {
      title: "Цифровой контур",
      note: "блоки Г и Д новой карты",
      rows: digitalRows,
      color: "var(--ic-s-new)",
    },
  ];

  return (
    <Section
      id="proposals"
      title="Наши предложения"
      lead="Приоритеты запуска из резюме и три среза новой карты: быстрые меры, системные изменения и цифровой контур."
    >
      <Reveal>
        <div className="ic-card mb-6 p-5">
          <h3 className="ic-h3 mb-3">Приоритеты запуска (из резюме)</h3>
          <ol className="grid gap-x-8 gap-y-2 md:grid-cols-2">
            {summary.priorities.map((p) => (
              <li key={p.n} className="flex gap-2.5 text-[13.5px]">
                <span className="font-bold text-[var(--ic-accent)]">{p.n}.</span>
                <span>
                  {p.title}{" "}
                  <span className="text-[12.5px] text-[var(--ic-ink-2)]">
                    ({p.term}, эффект {p.effect}, ресурс {p.cost})
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </Reveal>
      <div className="grid gap-4 lg:grid-cols-3">
        {columns.map((col, i) => (
          <Reveal key={col.title} delay={Math.min(i * 0.07, 0.2)}>
            <div className="ic-card h-full p-5">
              <div className="mb-3 flex items-center justify-between gap-2">
                <h3 className="ic-h3">{col.title}</h3>
                <StatusBadge color={col.color} label={col.note} />
              </div>
              <ul className="space-y-2.5">
                {col.rows.map((r) => (
                  <li key={r.id} className="flex gap-2.5 border-t border-[var(--ic-line)] pt-2.5 text-[13.5px] first:border-t-0 first:pt-0">
                    <span className="flex-shrink-0 font-bold text-[var(--ic-accent)]">
                      {r.id}
                    </span>
                    <span>
                      {r.title}
                      <span className="mt-0.5 block text-[12px] text-[var(--ic-ink-2)]">
                        {r.outcomeKpi} · {r.horizon} мес.
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
