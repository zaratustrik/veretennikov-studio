"use client";

import { useState } from "react";
import type { JourneyStage } from "@/types/investment-climate";
import { Reveal, Section } from "./shared";

export function JourneyBlock({
  journey,
  onOpenItem,
}: {
  journey: JourneyStage[];
  onOpenItem: (id: number) => void;
}) {
  const [activeId, setActiveId] = useState(journey[0]?.id ?? "");
  const active = journey.find((s) => s.id === activeId) ?? journey[0];

  return (
    <Section
      id="journey"
      title="Путь инвестора"
      lead="Двенадцать этапов пути инвестора в регионе: какие сервисы есть, где разрывы, какие строки карты и предложения их закрывают."
      printHidden
    >
      <Reveal>
        <div
          className="flex gap-2 overflow-x-auto pb-2"
          role="tablist"
          aria-label="Этапы пути инвестора"
        >
          {journey.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={s.id === active?.id}
              onClick={() => setActiveId(s.id)}
              className={`flex flex-shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-[13px] font-medium transition ${
                s.id === active?.id
                  ? "border-[var(--ic-accent)] bg-[rgba(30,79,163,0.08)] font-semibold text-[var(--ic-accent-ink)]"
                  : "border-[var(--ic-line)] bg-[var(--ic-surface)] text-[var(--ic-ink-2)] hover:border-[var(--ic-accent)]"
              }`}
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold ${
                  s.id === active?.id
                    ? "bg-[var(--ic-accent)] text-white"
                    : "bg-[var(--ic-surface-2)] text-[var(--ic-ink-2)]"
                }`}
                aria-hidden
              >
                {i + 1}
              </span>
              {s.title}
            </button>
          ))}
        </div>
      </Reveal>
      {active ? (
        <div className="ic-card mt-3 grid gap-5 p-5 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-[var(--ic-ink-2)]">
              Сервисы этапа
            </h3>
            {active.services.length > 0 ? (
              <ul className="space-y-1.5 text-[13.5px]">
                {active.services.map((s) => (
                  <li key={s} className="flex gap-2">
                    <span aria-hidden className="mt-[7px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--ic-s-keep)]" />
                    {s}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[13.5px] text-[var(--ic-s-nodata)]">—</p>
            )}
          </div>
          <div>
            <h3 className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-[var(--ic-ink-2)]">
              Разрывы
            </h3>
            {active.gaps.length > 0 ? (
              <ul className="space-y-1.5 text-[13.5px]">
                {active.gaps.map((g) => (
                  <li key={g} className="flex gap-2">
                    <span aria-hidden className="mt-[7px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--ic-s-remove)]" />
                    {g}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[13.5px] text-[var(--ic-s-nodata)]">—</p>
            )}
          </div>
          <div>
            <h3 className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-[var(--ic-ink-2)]">
              Строки карты
            </h3>
            {active.itemIds.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {active.itemIds.map((id) => (
                  <button
                    key={id}
                    type="button"
                    className="ic-chip"
                    onClick={() => onOpenItem(id)}
                    aria-label={`Открыть карточку мероприятия ${id}`}
                  >
                    № {id}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-[13.5px] text-[var(--ic-s-nodata)]">—</p>
            )}
          </div>
          <div>
            <h3 className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-[var(--ic-ink-2)]">
              Предложения
            </h3>
            {active.proposals.length > 0 ? (
              <ul className="space-y-1.5 text-[13.5px]">
                {active.proposals.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span aria-hidden className="mt-[7px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--ic-s-new)]" />
                    {p}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[13.5px] text-[var(--ic-s-nodata)]">—</p>
            )}
            {active.kpi ? (
              <p className="mt-2 text-[12.5px] text-[var(--ic-ink-2)]">
                КПЭ этапа: {active.kpi}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </Section>
  );
}
