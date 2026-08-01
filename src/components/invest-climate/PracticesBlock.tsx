"use client";

import { useMemo } from "react";
import type { Practice } from "@/types/investment-climate";
import {
  APPLICABILITY_META,
  Reveal,
  Section,
  StatusBadge,
  orDash,
} from "./shared";
import { ExpandablePracticeLibrary } from "./ExpandablePracticeLibrary";
import { SectionReturnLink } from "./SectionReturnLink";

export function PracticeCard({
  practice,
  emphasizeTakeaway = false,
}: {
  practice: Practice;
  emphasizeTakeaway?: boolean;
}) {
  const am = APPLICABILITY_META[practice.applicability];
  return (
    <article className="ic-card flex h-full flex-col gap-2 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[12.5px] font-semibold text-[var(--ic-ink-2)]">
          {practice.scope === "ru" ? "Россия" : "Международная"} ·{" "}
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
          {emphasizeTakeaway ? (
            <>
              <strong className="text-[var(--ic-ink)]">Что перенять: </strong>
              {practice.applicabilityNote}
            </>
          ) : (
            practice.applicabilityNote
          )}
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

/**
 * PracticesBlock — по умолчанию 6–8 наиболее применимых практик
 * (прямой перенос, подтверждённый результат — приоритетно) с выводом
 * «что перенять»; остальные — в раскрывающейся библиотеке с фильтрами.
 */
export function PracticesBlock({
  practices,
  onOverview,
  onPackage,
}: {
  practices: Practice[];
  onOverview: () => void;
  onPackage: () => void;
}) {
  const top = useMemo(() => {
    const score = (p: Practice) =>
      (p.applicability === "direct" ? 2 : 0) +
      (p.resultStatus === "confirmed" ? 1 : 0);
    return [...practices]
      .sort((a, b) => score(b) - score(a))
      .filter((p) => p.applicability === "direct")
      .slice(0, 8);
  }, [practices]);

  return (
    <Section
      id="practices"
      title="Практики других регионов и стран"
      lead="Восемь наиболее применимых механизмов — прямой перенос с подтверждённым результатом приоритетно. Полная библиотека с фильтрами по стране, функции и применимости раскрывается ниже. «Заявлено организацией» означает, что цифра не подтверждена независимым источником."
      printHidden
    >
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {top.map((p, i) => (
          <Reveal key={p.id} delay={Math.min(i * 0.04, 0.25)}>
            <PracticeCard practice={p} emphasizeTakeaway />
          </Reveal>
        ))}
      </div>

      <div className="mt-8">
        <ExpandablePracticeLibrary
          practices={practices}
          excludeIds={top.map((p) => p.id)}
        />
      </div>

      <SectionReturnLink onOverview={onOverview} onPackage={onPackage} />
    </Section>
  );
}
