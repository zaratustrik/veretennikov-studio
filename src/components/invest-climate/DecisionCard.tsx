"use client";

import type { SummaryPriority } from "@/types/investment-climate";
import { StatusBadge } from "./shared";

/** Категория меры по сроку и ресурсу (метки, без дублирования меры). */
export function decisionTags(p: SummaryPriority): { label: string; color: string }[] {
  const tags: { label: string; color: string }[] = [];
  if (/^0[–-]/.test(p.term)) {
    tags.push({ label: "Быстрая мера", color: "var(--ic-s-keep)" });
  } else {
    tags.push({ label: "Системная мера", color: "var(--ic-s-rewrite)" });
  }
  if (/ИТ/i.test(p.cost)) {
    tags.push({ label: "Цифровой контур", color: "var(--ic-s-new)" });
  }
  return tags;
}

/**
 * DecisionCard — карточка управленческого решения (уровень «предложение»):
 * номер, действие, срок, ожидаемый эффект, ресурс, метки категории.
 */
export function DecisionCard({
  priority,
  compact = false,
}: {
  priority: SummaryPriority;
  compact?: boolean;
}) {
  const tags = decisionTags(priority);
  return (
    <article className="ic-level-proposal flex h-full flex-col gap-2 p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[var(--ic-accent)] text-[13px] font-bold text-white">
          {priority.n}
        </span>
        <span className="flex flex-wrap justify-end gap-1.5">
          {tags.map((t) => (
            <StatusBadge key={t.label} color={t.color} label={t.label} />
          ))}
        </span>
      </div>
      <h4
        className={`font-semibold leading-snug ${compact ? "text-[13.5px]" : "text-[14.5px]"}`}
      >
        {priority.title}
      </h4>
      <dl className="mt-auto flex flex-wrap gap-x-4 gap-y-0.5 text-[12.5px] text-[var(--ic-ink-2)]">
        <div className="flex gap-1">
          <dt className="font-semibold">Срок:</dt>
          <dd>{priority.term}</dd>
        </div>
        <div className="flex gap-1">
          <dt className="font-semibold">Эффект:</dt>
          <dd>{priority.effect}</dd>
        </div>
        <div className="flex gap-1">
          <dt className="font-semibold">Ресурс:</dt>
          <dd>{priority.cost}</dd>
        </div>
      </dl>
    </article>
  );
}
