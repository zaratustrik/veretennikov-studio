"use client";

import { useMemo, useState } from "react";
import type { Practice, PracticeScope } from "@/types/investment-climate";
import {
  APPLICABILITY_META,
  FUNCTION_GROUP_LABELS,
  Reveal,
  Section,
  StatusBadge,
  orDash,
} from "./shared";

function PracticeCard({ practice }: { practice: Practice }) {
  const am = APPLICABILITY_META[practice.applicability];
  return (
    <article className="ic-card flex h-full flex-col gap-2 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[12.5px] font-semibold text-[var(--ic-ink-2)]">
          {practice.jurisdiction}
        </span>
        <StatusBadge
          color={
            practice.resultStatus === "confirmed"
              ? "var(--ic-s-keep)"
              : "var(--ic-s-improve)"
          }
          label={
            practice.resultStatus === "confirmed"
              ? "Результат подтверждён"
              : "Заявлено организацией"
          }
        />
      </div>
      <h4 className="text-[14.5px] font-semibold leading-snug">{practice.title}</h4>
      <p className="text-[12.5px] text-[var(--ic-ink-2)]">{practice.organization}</p>
      <p className="text-[13px] leading-relaxed">{practice.mechanism}</p>
      <p className="text-[13px] leading-relaxed">
        <strong>Результат:</strong> {orDash(practice.provenResult)}
      </p>
      <div className="mt-auto space-y-1.5 border-t border-[var(--ic-line)] pt-2.5">
        <StatusBadge color={am.color} label={`Применимость: ${am.label.toLowerCase()}`} />
        <p className="text-[12.5px] leading-relaxed text-[var(--ic-ink-2)]">
          {practice.applicabilityNote}
        </p>
        {practice.limitations ? (
          <p className="text-[12.5px] text-[var(--ic-ink-2)]">
            Ограничения: {practice.limitations}
          </p>
        ) : null}
      </div>
    </article>
  );
}

export function PracticesBlock({ practices }: { practices: Practice[] }) {
  const [scope, setScope] = useState<PracticeScope>("ru");

  const grouped = useMemo(() => {
    const filtered = practices.filter((p) => p.scope === scope);
    const map = new Map<string, Practice[]>();
    for (const p of filtered) {
      const list = map.get(p.functionGroup) ?? [];
      list.push(p);
      map.set(p.functionGroup, list);
    }
    return Array.from(map.entries());
  }, [practices, scope]);

  const ruCount = practices.filter((p) => p.scope === "ru").length;
  const intlCount = practices.length - ruCount;

  return (
    <Section
      id="practices"
      title="Практики других регионов и стран"
      lead="Работающие механизмы по функциям инвестиционной инфраструктуры. Формулировки «заявлено организацией» означают, что цифра не подтверждена независимым источником."
      printHidden
    >
      <div className="ic-no-print mb-4 flex gap-2" role="tablist" aria-label="Область практик">
        <button
          type="button"
          role="tab"
          aria-selected={scope === "ru"}
          onClick={() => setScope("ru")}
          className={`rounded-lg border px-4 py-2 text-[14px] font-semibold transition ${
            scope === "ru"
              ? "border-[var(--ic-accent)] bg-[rgba(30,79,163,0.08)] text-[var(--ic-accent-ink)]"
              : "border-[var(--ic-line)] bg-[var(--ic-surface)] text-[var(--ic-ink-2)]"
          }`}
        >
          Российские регионы ({ruCount})
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={scope === "intl"}
          onClick={() => setScope("intl")}
          className={`rounded-lg border px-4 py-2 text-[14px] font-semibold transition ${
            scope === "intl"
              ? "border-[var(--ic-accent)] bg-[rgba(30,79,163,0.08)] text-[var(--ic-accent-ink)]"
              : "border-[var(--ic-line)] bg-[var(--ic-surface)] text-[var(--ic-ink-2)]"
          }`}
        >
          Международные ({intlCount})
        </button>
      </div>
      <div className="space-y-7">
        {grouped.map(([group, list]) => (
          <Reveal key={group}>
            <div>
              <h3 className="ic-h3 mb-3">
                {FUNCTION_GROUP_LABELS[group] ?? group}
                <span className="ml-2 text-[13px] font-normal text-[var(--ic-ink-2)]">
                  {list.length}
                </span>
              </h3>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {list.map((p) => (
                  <PracticeCard key={p.id} practice={p} />
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
