"use client";

import type { Problem } from "@/types/investment-climate";
import { Reveal, Section } from "./shared";

export function ProblemsBlock({
  problems,
  onProblemClick,
}: {
  problems: Problem[];
  onProblemClick: (id: string) => void;
}) {
  return (
    <Section
      id="problems"
      title="Карта проблем"
      lead="Десять системных проблем, к которым сводятся дефекты исходной карты. Клик по карточке фильтрует список мероприятий."
      printHidden
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {problems.map((p, i) => (
          <Reveal key={p.id} delay={Math.min(i * 0.05, 0.3)}>
            <button
              type="button"
              onClick={() => onProblemClick(p.id)}
              className="ic-card block h-full w-full p-4 text-left transition hover:border-[var(--ic-accent)]"
              aria-label={`Показать мероприятия с проблемой «${p.title}»`}
            >
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="text-[15px] font-semibold leading-snug">{p.title}</h3>
                <span className="flex-shrink-0 rounded-md bg-[var(--ic-surface-2)] px-2 py-0.5 text-[12px] font-bold text-[var(--ic-ink-2)]">
                  {p.itemIds.length} стр.
                </span>
              </div>
              <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--ic-ink-2)]">
                {p.description}
              </p>
              <span className="mt-2 inline-block text-[12.5px] font-semibold text-[var(--ic-accent)]">
                Показать мероприятия →
              </span>
            </button>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
