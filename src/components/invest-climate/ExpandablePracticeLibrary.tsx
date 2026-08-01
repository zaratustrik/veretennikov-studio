"use client";

import { useMemo, useState } from "react";
import type {
  Applicability,
  Practice,
  PracticeScope,
} from "@/types/investment-climate";
import { APPLICABILITY_META, FUNCTION_GROUP_LABELS } from "./shared";
import { PracticeCard } from "./PracticesBlock";

const APPLICABILITIES: Applicability[] = [
  "direct",
  "needs-legal",
  "principle",
  "not-transferable",
];

type ResultFilter = "confirmed" | "claimed";

/**
 * ExpandablePracticeLibrary — раскрывающаяся библиотека остальных практик:
 * фильтры (Россия/международные, функция, применимость,
 * подтверждено/заявлено) и сворачиваемые группы по функциям.
 */
export function ExpandablePracticeLibrary({
  practices,
  excludeIds,
}: {
  practices: Practice[];
  excludeIds: string[];
}) {
  const [open, setOpen] = useState(false);
  const [scope, setScope] = useState<PracticeScope | null>(null);
  const [fn, setFn] = useState<string | null>(null);
  const [applicability, setApplicability] = useState<Applicability | null>(null);
  const [result, setResult] = useState<ResultFilter | null>(null);
  const [closedGroups, setClosedGroups] = useState<Set<string>>(new Set());

  const rest = useMemo(
    () => practices.filter((p) => !excludeIds.includes(p.id)),
    [practices, excludeIds],
  );

  const functionGroups = useMemo(
    () => Array.from(new Set(rest.map((p) => p.functionGroup))),
    [rest],
  );

  const filtered = useMemo(
    () =>
      rest.filter((p) => {
        if (scope && p.scope !== scope) return false;
        if (fn && p.functionGroup !== fn) return false;
        if (applicability && p.applicability !== applicability) return false;
        if (result && p.resultStatus !== result) return false;
        return true;
      }),
    [rest, scope, fn, applicability, result],
  );

  const grouped = useMemo(() => {
    const map = new Map<string, Practice[]>();
    for (const p of filtered) {
      const list = map.get(p.functionGroup) ?? [];
      list.push(p);
      map.set(p.functionGroup, list);
    }
    return Array.from(map.entries());
  }, [filtered]);

  const toggleGroup = (g: string) => {
    setClosedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(g)) next.delete(g);
      else next.add(g);
      return next;
    });
  };

  return (
    <div className="ic-no-print">
      <button
        type="button"
        className="ic-group-toggle"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span>
          Библиотека практик ({rest.length})
          <span className="ml-2 text-[13px] font-normal text-[var(--ic-ink-2)]">
            остальные механизмы России и мира с фильтрами по функции и
            применимости
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

      {open ? (
        <div className="mt-4 space-y-5">
          {/* ── Фильтры библиотеки ── */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5">
            <div className="ic-seg" role="group" aria-label="Область практик">
              {[
                { v: null, label: "Все" },
                { v: "ru" as const, label: "Россия" },
                { v: "intl" as const, label: "Международные" },
              ].map((o) => (
                <button
                  key={o.label}
                  type="button"
                  className="ic-seg-btn"
                  aria-pressed={scope === o.v}
                  onClick={() => setScope(o.v)}
                >
                  {o.label}
                </button>
              ))}
            </div>
            <select
              className="ic-filter-select"
              value={fn ?? ""}
              onChange={(e) => setFn(e.target.value || null)}
              aria-label="Функция"
            >
              <option value="">Функция: любая</option>
              {functionGroups.map((g) => (
                <option key={g} value={g}>
                  {FUNCTION_GROUP_LABELS[g] ?? g}
                </option>
              ))}
            </select>
            <select
              className="ic-filter-select"
              value={applicability ?? ""}
              onChange={(e) =>
                setApplicability((e.target.value || null) as Applicability | null)
              }
              aria-label="Применимость"
            >
              <option value="">Применимость: любая</option>
              {APPLICABILITIES.map((a) => (
                <option key={a} value={a}>
                  {APPLICABILITY_META[a].label}
                </option>
              ))}
            </select>
            <div className="ic-seg" role="group" aria-label="Статус результата">
              {[
                { v: null, label: "Все результаты" },
                { v: "confirmed" as const, label: "Подтверждено" },
                { v: "claimed" as const, label: "Заявлено" },
              ].map((o) => (
                <button
                  key={o.label}
                  type="button"
                  className="ic-seg-btn"
                  aria-pressed={result === o.v}
                  onClick={() => setResult(o.v)}
                >
                  {o.label}
                </button>
              ))}
            </div>
            <span className="text-[13px] font-semibold" aria-live="polite">
              Показано {filtered.length} из {rest.length}
            </span>
          </div>

          {/* ── Сворачиваемые группы по функциям ── */}
          {grouped.length === 0 ? (
            <p className="py-6 text-center text-[14px] text-[var(--ic-ink-2)]">
              По заданным фильтрам практик не найдено.
            </p>
          ) : (
            grouped.map(([group, list]) => {
              const closed = closedGroups.has(group);
              return (
                <div key={group}>
                  <button
                    type="button"
                    className="ic-group-toggle"
                    aria-expanded={!closed}
                    onClick={() => toggleGroup(group)}
                  >
                    <span>
                      {FUNCTION_GROUP_LABELS[group] ?? group}
                      <span className="ml-2 text-[13px] font-normal text-[var(--ic-ink-2)]">
                        {list.length}
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
                  {!closed ? (
                    <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                      {list.map((p) => (
                        <PracticeCard key={p.id} practice={p} />
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })
          )}
        </div>
      ) : null}
    </div>
  );
}
