"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type {
  NewRoadmapRow,
  Practice,
  Problem,
  RoadmapItem,
  SourceRef,
} from "@/types/investment-climate";
import {
  APPLICABILITY_META,
  CONFIDENCE_LABELS,
  EVIDENCE_META,
  EvidenceTag,
  GROUP_LABELS,
  INFLUENCE_LABELS,
  ImpactDots,
  PRIORITY_META,
  StatusBadge,
  VERDICT_META,
  orDash,
} from "./shared";

const TABS = [
  { id: "original", label: "Исходная редакция" },
  { id: "verdict", label: "Заключение" },
  { id: "impact", label: "Влияние" },
  { id: "recommendation", label: "Рекомендация" },
  { id: "proposed", label: "Предлагаемая редакция" },
  { id: "practices", label: "Практики" },
  { id: "sources", label: "Источники" },
  { id: "evidence", label: "Доказательность" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[12px] font-semibold uppercase tracking-wide text-[var(--ic-ink-2)]">
        {label}
      </div>
      <div className="mt-1 text-[14px] leading-relaxed">{children}</div>
    </div>
  );
}

function CompareRow({
  label,
  was,
  proposed,
}: {
  label: string;
  was: string;
  proposed: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="text-[12px] font-semibold uppercase tracking-wide text-[var(--ic-ink-2)]">
        {label}
      </div>
      <div className="ic-compare">
        <div className="ic-compare-was">
          <div className="mb-1 text-[11px] font-semibold uppercase text-[var(--ic-ink-2)]">
            Было
          </div>
          {orDash(was)}
        </div>
        <div>
          <div
            className="mb-1 text-[11px] font-semibold uppercase"
            style={{ color: "var(--ic-s-new)" }}
          >
            Предлагается
          </div>
          {orDash(proposed)}
        </div>
      </div>
    </div>
  );
}

export function ItemDrawer({
  item,
  visibleIds,
  problems,
  practices,
  sources,
  newRoadmap,
  onClose,
  onNavigate,
}: {
  item: RoadmapItem;
  visibleIds: number[];
  problems: Problem[];
  practices: Practice[];
  sources: SourceRef[];
  newRoadmap: NewRoadmapRow[];
  onClose: () => void;
  onNavigate: (id: number) => void;
}) {
  const [tab, setTab] = useState<TabId>("original");
  const [copied, setCopied] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();

  // При смене строки — вкладка сбрасывается на первую.
  useEffect(() => {
    setTab("original");
    setCopied(false);
  }, [item.id]);

  // Focus trap + Esc + возврат фокуса.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const focusables = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => !el.hasAttribute("disabled"));
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown, true);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      document.body.style.overflow = "";
      previouslyFocused?.focus?.();
    };
    // Ловушка ставится один раз на время жизни drawer.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const idx = visibleIds.indexOf(item.id);
  const prevId = idx > 0 ? visibleIds[idx - 1] : null;
  const nextId = idx >= 0 && idx < visibleIds.length - 1 ? visibleIds[idx + 1] : null;

  const itemProblems = useMemo(
    () => problems.filter((p) => item.issues.includes(p.id)),
    [problems, item],
  );
  const itemPractices = useMemo(
    () => practices.filter((p) => item.benchmarkIds.includes(p.id)),
    [practices, item],
  );
  const itemSources = useMemo(
    () => sources.filter((s) => item.sourceIds.includes(s.id)),
    [sources, item],
  );
  const relatedRows = useMemo(
    () => newRoadmap.filter((r) => r.fromItems.includes(item.id)),
    [newRoadmap, item],
  );

  const copyLink = useCallback(() => {
    const url = `${window.location.origin}${window.location.pathname}?item=${item.id}`;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        // Клипборд недоступен (например, http) — показываем URL для ручного копирования.
        window.prompt("Скопируйте ссылку вручную:", url);
      });
  }, [item.id]);

  const vm = VERDICT_META[item.verdict];
  const pm = PRIORITY_META[item.priority];

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        className="ic-drawer-overlay"
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClose}
        aria-hidden
      />
      <motion.div
        key={`panel`}
        ref={panelRef}
        className="ic-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={`Мероприятие ${item.id}`}
        initial={reduced ? false : { x: 48, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.24, ease: "easeOut" }}
      >
        {/* Шапка */}
        <div className="flex items-start justify-between gap-3 border-b border-[var(--ic-line)] px-5 py-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[15px] font-bold text-[var(--ic-accent)]">
                Строка {item.id}
              </span>
              <StatusBadge color={vm.color} label={item.verdictLabel} />
              <StatusBadge color={pm.color} label={`Приоритет: ${pm.label.toLowerCase()}`} />
              {item.defect ? (
                <StatusBadge
                  color="var(--ic-s-remove)"
                  label={`Дефект ${item.defect}`}
                  title="Дефект первоисточника"
                />
              ) : null}
            </div>
            <h3 className="mt-1.5 text-[16px] font-semibold leading-snug">
              {item.originalActivity.trim() ||
                "Строка не заполнена в проекте карты"}
            </h3>
            <p className="mt-0.5 text-[12.5px] text-[var(--ic-ink-2)]">
              Показатель {item.indicatorCode} · {item.indicatorName}
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="flex-shrink-0 rounded-lg border border-[var(--ic-line)] px-2.5 py-1.5 text-[13px] font-semibold text-[var(--ic-ink-2)] hover:border-[var(--ic-accent)] hover:text-[var(--ic-accent-ink)]"
            aria-label="Закрыть карточку (Esc)"
          >
            Закрыть ✕
          </button>
        </div>

        {/* Вкладки */}
        <div className="ic-drawer-tabs" role="tablist" aria-label="Разделы карточки">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              className="ic-drawer-tab"
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Содержимое */}
        <div className="flex-1 overflow-y-auto px-5 py-5" role="tabpanel">
          {tab === "original" ? (
            <div className="space-y-4">
              <Field label="Полный текст мероприятия">
                {item.originalActivity.trim() ? (
                  item.originalActivity
                ) : (
                  <span className="text-[var(--ic-s-nodata)]">
                    Строка {item.id} не заполнена в проекте карты — данных
                    недостаточно. Предлагаемое наполнение см. на вкладке
                    «Предлагаемая редакция».
                  </span>
                )}
              </Field>
              <Field label="Показатель">
                {item.indicatorCode} · {item.indicatorName} (сейчас {item.baselineRating},
                цель {item.targetRating})
              </Field>
              <Field label="Критерий показателя">{orDash(item.criterion)}</Field>
              <Field label="Срок">
                {item.period.start || item.period.end
                  ? `${orDash(item.period.start)} — ${orDash(item.period.end)}`
                  : "—"}
              </Field>
              <Field label="Исходный KPI">{orDash(item.originalKpi)}</Field>
              <Field label="Ответственные (как в документе)">
                {item.responsible.length > 0 ? item.responsible.join(", ") : "—"}{" "}
                <span className="text-[12.5px] text-[var(--ic-ink-2)]">
                  (группа: {GROUP_LABELS[item.responsibleGroup]})
                </span>
              </Field>
              <Field label="Первоисточник">
                Проект дорожной карты (DOCX, сверен по SHA-256) — см. вкладку
                «Источники».
              </Field>
            </div>
          ) : null}

          {tab === "verdict" ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <StatusBadge color={vm.color} label={item.verdictLabel} />
                <span className="text-[12.5px] text-[var(--ic-ink-2)]">
                  вердикт аудита
                </span>
              </div>
              <Field label="Почему">{orDash(item.analysis.why)}</Field>
              <Field label="Подтверждённая проблема">
                {orDash(item.analysis.problem)}
              </Field>
              <Field label="Разрыв причинной цепочки">
                {orDash(item.analysis.causalGap)}
              </Field>
              <Field label="Риск формального исполнения">
                {orDash(item.analysis.formalRisk)}
              </Field>
            </div>
          ) : null}

          {tab === "impact" ? (
            <div className="space-y-4">
              <Field label="Потенциал влияния на показатель">
                {INFLUENCE_LABELS[item.influencePotential] ?? "—"}
              </Field>
              <Field label="Влияние на рейтинг">
                <ImpactDots value={item.ratingImpact} label="Влияние на рейтинг" />
              </Field>
              <Field label="Влияние на инвестора">
                <ImpactDots value={item.investorImpact} label="Влияние на инвестора" />
              </Field>
              <p className="rounded-lg bg-[var(--ic-surface-2)] px-3.5 py-2.5 text-[13px] text-[var(--ic-ink-2)]">
                Текстовые пояснения по отдельным осям влияния (сроки,
                административная нагрузка, прозрачность) в структурированных
                данных отсутствуют — данных недостаточно. Аргументация по сути
                — на вкладке «Заключение».
              </p>
            </div>
          ) : null}

          {tab === "recommendation" ? (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge color={vm.color} label={item.verdictLabel} />
                <StatusBadge
                  color={pm.color}
                  label={`Приоритет: ${pm.label.toLowerCase()}`}
                />
              </div>
              <Field label="Суть предложения">{orDash(item.proposed.activity)}</Field>
              {itemProblems.length > 0 ? (
                <Field label="Связанные системные проблемы">
                  <span className="flex flex-wrap gap-1.5">
                    {itemProblems.map((p) => (
                      <span key={p.id} className="ic-chip" title={p.description}>
                        {p.title}
                      </span>
                    ))}
                  </span>
                </Field>
              ) : null}
              <Field label="Куда переходит в новой карте">
                {relatedRows.length > 0 ? (
                  <span className="flex flex-wrap gap-1.5">
                    {relatedRows.map((r) => (
                      <span key={r.id} className="ic-chip" title={r.outcomeKpi}>
                        {r.id} · {r.title}
                      </span>
                    ))}
                  </span>
                ) : (
                  "— (в новую карту строка не переносится)"
                )}
              </Field>
            </div>
          ) : null}

          {tab === "proposed" ? (
            <div className="space-y-4">
              <CompareRow
                label="Мероприятие"
                was={item.originalActivity}
                proposed={item.proposed.activity}
              />
              <CompareRow
                label="KPI"
                was={item.originalKpi}
                proposed={item.proposed.kpiName}
              />
              <CompareRow label="Базовое значение" was="" proposed={item.proposed.baseline} />
              <CompareRow label="Целевое значение" was="" proposed={item.proposed.target} />
              <CompareRow label="Формула расчёта" was="" proposed={item.proposed.formula} />
              <CompareRow label="Источник данных" was="" proposed={item.proposed.dataSource} />
              <CompareRow
                label="Владелец"
                was={item.responsible.join(", ")}
                proposed={item.proposed.owner}
              />
              <CompareRow label="Stop-критерий" was="" proposed={item.proposed.stopCriterion} />
              <p className="text-[12.5px] text-[var(--ic-ink-2)]">
                «—» в колонке «Было» означает, что в исходной карте этот атрибут
                не задан (baseline, формула, stop-критерии в проекте карты
                отсутствуют).
              </p>
            </div>
          ) : null}

          {tab === "practices" ? (
            <div className="space-y-3">
              {itemPractices.length === 0 ? (
                <p className="text-[14px] text-[var(--ic-ink-2)]">
                  Для этой строки аналоги в собранных практиках не привязаны — «—».
                </p>
              ) : (
                itemPractices.map((p) => {
                  const am = APPLICABILITY_META[p.applicability];
                  return (
                    <article key={p.id} className="ic-card p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[12.5px] font-semibold text-[var(--ic-ink-2)]">
                          {p.scope === "ru" ? "Россия" : "Международная"} · {p.jurisdiction}
                        </span>
                        <StatusBadge
                          color={p.resultStatus === "confirmed" ? "var(--ic-s-keep)" : "var(--ic-s-improve)"}
                          label={p.resultStatus === "confirmed" ? "Результат подтверждён" : "Заявлено организацией"}
                        />
                        <StatusBadge color={am.color} label={am.label} />
                      </div>
                      <h4 className="mt-1.5 text-[14.5px] font-semibold">{p.title}</h4>
                      <p className="mt-1 text-[13px] text-[var(--ic-ink-2)]">{p.mechanism}</p>
                      <p className="mt-1.5 text-[13px]">
                        <strong>Результат:</strong> {orDash(p.provenResult)}
                      </p>
                      <p className="mt-1 text-[12.5px] text-[var(--ic-ink-2)]">
                        Применимость: {p.applicabilityNote}
                      </p>
                    </article>
                  );
                })
              )}
            </div>
          ) : null}

          {tab === "sources" ? (
            <div className="space-y-3">
              {itemSources.length === 0 ? (
                <p className="text-[14px] text-[var(--ic-ink-2)]">
                  Источники к строке не привязаны — «—».
                </p>
              ) : (
                itemSources.map((s) => (
                  <article key={s.id} className="ic-card p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[12px] font-bold text-[var(--ic-accent)]">{s.id}</span>
                      {!s.verified ? (
                        <StatusBadge
                          color="var(--ic-s-nodata)"
                          label="Не подтверждён независимо"
                        />
                      ) : null}
                    </div>
                    <h4 className="mt-1 text-[14px] font-semibold">{s.title}</h4>
                    <p className="mt-0.5 text-[12.5px] text-[var(--ic-ink-2)]">
                      {s.organization} · {s.date} · доступ {s.accessed}
                    </p>
                    {s.note ? <p className="mt-1 text-[13px]">{s.note}</p> : null}
                    {s.url ? (
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-block break-all text-[13px] font-medium text-[var(--ic-accent)] hover:text-[var(--ic-accent-ink)]"
                      >
                        {s.url}
                      </a>
                    ) : (
                      <p className="mt-1 text-[12.5px] text-[var(--ic-s-nodata)]">
                        Ссылка недоступна (закрытый или офлайн-документ)
                      </p>
                    )}
                  </article>
                ))
              )}
            </div>
          ) : null}

          {tab === "evidence" ? (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <EvidenceTag grade={item.evidenceGrade} />
                <StatusBadge
                  color="var(--ic-s-new)"
                  label={`Тип вывода: ${CONFIDENCE_LABELS[item.confidence]}`}
                />
              </div>
              <Field label="Шкала доказательности">
                <span className="flex flex-col gap-1.5">
                  {(["высокая", "средняя", "низкая"] as const).map((g) => (
                    <span key={g} className="flex items-center gap-2 text-[13px]">
                      <span
                        aria-hidden
                        className="inline-block h-2.5 w-2.5 rounded-full"
                        style={{
                          background:
                            g === item.evidenceGrade
                              ? EVIDENCE_META[g].color
                              : "var(--ic-line)",
                        }}
                      />
                      <span
                        className={
                          g === item.evidenceGrade ? "font-semibold" : "text-[var(--ic-ink-2)]"
                        }
                      >
                        {EVIDENCE_META[g].label}
                        {g === item.evidenceGrade ? " — оценка этой строки" : ""}
                      </span>
                    </span>
                  ))}
                </span>
              </Field>
              <Field label="На чём основан вывод">
                {itemSources.length > 0
                  ? `${itemSources.length} привязанных источников (см. вкладку «Источники»)`
                  : "данных недостаточно"}
              </Field>
            </div>
          ) : null}
        </div>

        {/* Футер: prev / next / копировать ссылку */}
        <div className="flex items-center justify-between gap-2 border-t border-[var(--ic-line)] px-5 py-3">
          <div className="flex gap-2">
            <button
              type="button"
              disabled={prevId === null}
              onClick={() => prevId !== null && onNavigate(prevId)}
              className="rounded-lg border border-[var(--ic-line)] px-3 py-1.5 text-[13px] font-semibold text-[var(--ic-ink-2)] enabled:hover:border-[var(--ic-accent)] enabled:hover:text-[var(--ic-accent-ink)] disabled:opacity-40"
            >
              ← Предыдущее
            </button>
            <button
              type="button"
              disabled={nextId === null}
              onClick={() => nextId !== null && onNavigate(nextId)}
              className="rounded-lg border border-[var(--ic-line)] px-3 py-1.5 text-[13px] font-semibold text-[var(--ic-ink-2)] enabled:hover:border-[var(--ic-accent)] enabled:hover:text-[var(--ic-accent-ink)] disabled:opacity-40"
            >
              Следующее →
            </button>
          </div>
          <button
            type="button"
            onClick={copyLink}
            className="rounded-lg border border-[var(--ic-line)] px-3 py-1.5 text-[13px] font-semibold text-[var(--ic-accent)] hover:border-[var(--ic-accent)]"
          >
            {copied ? "Ссылка скопирована ✓" : "Копировать ссылку"}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
