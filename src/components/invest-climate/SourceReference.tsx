"use client";

import { useId, useState } from "react";
import type { SourceRef } from "@/types/investment-climate";
import { StatusBadge } from "./shared";

/** Статус утверждения в интерфейсе (ТЗ п. 14). */
export type StatementStatus = "official" | "analytical" | "hypothesis";

export const STATEMENT_STATUS_META: Record<
  StatementStatus,
  { label: string; color: string }
> = {
  official: { label: "Официальный факт", color: "var(--ic-s-keep)" },
  analytical: { label: "Аналитический вывод", color: "var(--ic-s-new)" },
  hypothesis: { label: "Рабочая гипотеза", color: "var(--ic-s-nodata)" },
};

/** Привязка главных выводов резюме к статусу и 1–3 источникам библиотеки.
    Презентационный слой: сами данные выводов живут в summary.json. */
export const FINDING_EVIDENCE: Record<
  string,
  { status: StatementStatus; sourceIds: string[] }
> = {
  f1: { status: "analytical", sourceIds: ["DOCX"] },
  f2: { status: "analytical", sourceIds: ["AUDIT-LK", "AUDIT-PORTAL"] },
  f3: { status: "official", sourceIds: ["REG-05", "AUDIT-TP"] },
  f4: { status: "official", sourceIds: ["SRC-03", "AUDIT-MAP"] },
  f5: { status: "official", sourceIds: ["DOCX"] },
  f6: { status: "official", sourceIds: ["STAT-INV"] },
  f7: { status: "analytical", sourceIds: ["DOCX"] },
};

/** Домен без «www.» для подписи ссылки. */
export function domainOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/** Ссылка на официальный документ вместо сырого URL (ТЗ п. 14). */
export function SourceLink({ url }: { url: string | null }) {
  if (!url) {
    return (
      <p className="text-[12px] text-[var(--ic-s-nodata)]">
        Ссылка недоступна (закрытый или офлайн-документ)
      </p>
    );
  }
  return (
    <p className="flex flex-wrap items-baseline gap-x-2 text-[12.5px]">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-[var(--ic-accent)] hover:text-[var(--ic-accent-ink)]"
      >
        Открыть официальный документ →
      </a>
      <span className="text-[var(--ic-ink-2)]">{domainOf(url)}</span>
    </p>
  );
}

/** Статус утверждения + кнопка «Основание» с раскрытием 1–3 источников. */
export function SourceReference({
  status,
  sources,
}: {
  status: StatementStatus;
  sources: SourceRef[];
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const sm = STATEMENT_STATUS_META[status];

  return (
    <div className="ic-no-print">
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge color={sm.color} label={sm.label} />
        {sources.length > 0 ? (
          <button
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((v) => !v)}
            className="text-[12.5px] font-semibold text-[var(--ic-accent)] hover:text-[var(--ic-accent-ink)]"
          >
            {open ? "Скрыть основание" : `Основание (${sources.length})`}
          </button>
        ) : null}
      </div>
      {open ? (
        <ul id={panelId} className="mt-2 space-y-2">
          {sources.map((s) => (
            <li
              key={s.id}
              className="rounded-lg bg-[var(--ic-surface-2)] px-3 py-2.5"
            >
              <p className="text-[12.5px] font-semibold leading-snug">
                {s.title}
              </p>
              <p className="mt-0.5 text-[12px] text-[var(--ic-ink-2)]">
                {s.organization} · {s.date}
              </p>
              <div className="mt-1">
                <SourceLink url={s.url} />
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
