"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type {
  JourneyStage,
  NewRoadmapRow,
  Practice,
  Problem,
  RoadmapItem,
  SourceRef,
} from "@/types/investment-climate";
import {
  APPLICABILITY_META,
  CONFIDENCE_LABELS,
  GROUP_LABELS,
  INFLUENCE_LABELS,
  ImpactDots,
  PRIORITY_META,
  StatusBadge,
  VERDICT_META,
  orDash,
} from "./shared";
import { SourceLink } from "./SourceReference";

/** Четыре смысловых раздела карточки (вместо восьми вкладок — аудит П-1). */
export const DRAWER_SECTIONS = [
  { id: "decision", label: "Решение" },
  { id: "compare", label: "Было и предлагается" },
  { id: "evidence", label: "Основания" },
  { id: "data", label: "Исходные данные" },
] as const;

export type DrawerSectionId = (typeof DRAWER_SECTIONS)[number]["id"];

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

/* ── Графическая шкала доказательности: 4 ступени ─────────────────── */

const EVIDENCE_STEPS = [
  "Данных недостаточно",
  "Низкая",
  "Средняя",
  "Высокая",
] as const;

function EvidenceScale({ item }: { item: RoadmapItem }) {
  const current =
    item.confidence === "insufficient"
      ? 0
      : item.evidenceGrade === "низкая"
        ? 1
        : item.evidenceGrade === "средняя"
          ? 2
          : 3;
  return (
    <div
      className="ic-evidence-scale"
      role="img"
      aria-label={`Шкала доказательности: ${EVIDENCE_STEPS[current]} (ступень ${current + 1} из 4)`}
    >
      {EVIDENCE_STEPS.map((s, i) => (
        <span
          key={s}
          className={`ic-evidence-step ${i === current ? "ic-evidence-current" : ""}`}
          aria-hidden
        >
          {s}
          {i === current ? " — эта строка" : ""}
        </span>
      ))}
    </div>
  );
}

/* ── EvidenceTrail: проблемы → строка новой карты → практики → путь ── */

function TrailStep({
  title,
  last = false,
  children,
}: {
  title: string;
  last?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="ic-trail-step">
      <span className="ic-trail-marker" aria-hidden>
        <span className="ic-trail-dot" />
        {!last ? <span className="ic-trail-line" /> : null}
      </span>
      <div className="min-w-0 pb-1">
        <div className="text-[11.5px] font-semibold uppercase tracking-wide text-[var(--ic-ink-2)]">
          {title}
        </div>
        <div className="mt-1 flex flex-wrap gap-1.5">{children}</div>
      </div>
    </div>
  );
}

function EvidenceTrail({
  problems,
  rows,
  practices,
  stages,
}: {
  problems: Problem[];
  rows: NewRoadmapRow[];
  practices: Practice[];
  stages: JourneyStage[];
}) {
  const dash = (
    <span className="text-[13px] text-[var(--ic-s-nodata)]">—</span>
  );
  return (
    <div className="ic-trail" aria-label="Связи мероприятия">
      <TrailStep title="Системные проблемы">
        {problems.length > 0
          ? problems.map((p) => (
              <span key={p.id} className="ic-chip" title={p.description}>
                {p.title}
              </span>
            ))
          : dash}
      </TrailStep>
      <TrailStep title="Строка новой карты">
        {rows.length > 0
          ? rows.map((r) => (
              <span key={r.id} className="ic-chip" title={r.outcomeKpi}>
                {r.id} · {r.title}
              </span>
            ))
          : dash}
      </TrailStep>
      <TrailStep title="Опорные практики">
        {practices.length > 0
          ? practices.map((p) => (
              <span key={p.id} className="ic-chip" title={p.title}>
                {p.jurisdiction}
              </span>
            ))
          : dash}
      </TrailStep>
      <TrailStep title="Этапы пути инвестора" last>
        {stages.length > 0
          ? stages.map((s) => (
              <span key={s.id} className="ic-chip">
                {s.title}
              </span>
            ))
          : dash}
      </TrailStep>
    </div>
  );
}

/**
 * ItemDrawer — карточка мероприятия: широкая панель primary-detail
 * с четырьмя разделами; выбранный раздел живёт в родителе и
 * сохраняется при prev/next (аудит П-5).
 */
export function ItemDrawer({
  item,
  visibleIds,
  problems,
  practices,
  sources,
  newRoadmap,
  journey,
  section,
  onSectionChange,
  onClose,
  onNavigate,
}: {
  item: RoadmapItem;
  visibleIds: number[];
  problems: Problem[];
  practices: Practice[];
  sources: SourceRef[];
  newRoadmap: NewRoadmapRow[];
  journey: JourneyStage[];
  section: DrawerSectionId;
  onSectionChange: (s: DrawerSectionId) => void;
  onClose: () => void;
  onNavigate: (id: number) => void;
}) {
  const [copied, setCopied] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    setCopied(false);
    contentRef.current?.scrollTo({ top: 0 });
  }, [item.id, section]);

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
  const relatedStages = useMemo(
    () => journey.filter((s) => s.itemIds.includes(item.id)),
    [journey, item],
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
  const sectionCounts: Partial<Record<DrawerSectionId, number>> = {
    evidence: itemSources.length,
  };

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
        {/* ── Шапка ── */}
        <div className="flex items-start justify-between gap-3 border-b border-[var(--ic-line)] px-5 py-3.5">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[15px] font-bold text-[var(--ic-accent)]">
                Строка {item.id}
              </span>
              {item.defect ? (
                <StatusBadge
                  color="var(--ic-s-remove)"
                  label={`Дефект ${item.defect}`}
                  title="Дефект первоисточника"
                />
              ) : null}
            </div>
            <h3 className="mt-1 text-[16px] font-semibold leading-snug">
              {item.originalActivity.trim() ||
                "Строка не заполнена в проекте карты"}
            </h3>
            <p className="mt-0.5 text-[12.5px] text-[var(--ic-ink-2)]">
              Показатель {item.indicatorCode} · {item.indicatorName}
            </p>
          </div>
          <div className="flex flex-shrink-0 gap-2">
            <button
              type="button"
              onClick={onClose}
              className="hidden rounded-lg border border-[var(--ic-line)] px-2.5 py-1.5 text-[13px] font-semibold text-[var(--ic-ink-2)] hover:border-[var(--ic-accent)] hover:text-[var(--ic-accent-ink)] sm:block"
            >
              ← Вернуться к списку
            </button>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[var(--ic-line)] px-2.5 py-1.5 text-[13px] font-semibold text-[var(--ic-ink-2)] hover:border-[var(--ic-accent)] hover:text-[var(--ic-accent-ink)]"
              aria-label="Закрыть карточку (Esc)"
            >
              Закрыть ✕
            </button>
          </div>
        </div>

        {/* ── Краткое резюме решения: видно всегда ── */}
        <div className="ic-drawer-summary">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge color={vm.color} label={item.verdictLabel} />
            <StatusBadge color={pm.color} label={`Приоритет: ${pm.label.toLowerCase()}`} />
            <span className="inline-flex items-center gap-1.5 text-[12px] text-[var(--ic-ink-2)]">
              рейтинг <ImpactDots value={item.ratingImpact} label="Влияние на рейтинг" />
            </span>
            <span className="inline-flex items-center gap-1.5 text-[12px] text-[var(--ic-ink-2)]">
              инвестор <ImpactDots value={item.investorImpact} label="Влияние на инвестора" />
            </span>
          </div>
          <p className="mt-1.5 text-[13px] leading-snug">
            <strong>Предлагается:</strong> {orDash(item.proposed.activity)}
          </p>
        </div>

        {/* ── Переключатель 4 разделов ── */}
        <div
          className="ic-drawer-sections"
          role="tablist"
          aria-label="Разделы карточки"
        >
          {DRAWER_SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={section === s.id}
              className="ic-drawer-section-btn"
              onClick={() => onSectionChange(s.id)}
            >
              {s.label}
              {sectionCounts[s.id] !== undefined ? (
                <span className="ic-drawer-section-count">
                  {sectionCounts[s.id]}
                </span>
              ) : null}
            </button>
          ))}
        </div>
        <div className="px-5 py-2 sm:hidden">
          <label className="sr-only" htmlFor="ic-drawer-section-select">
            Раздел карточки
          </label>
          <select
            id="ic-drawer-section-select"
            className="ic-drawer-section-select"
            value={section}
            onChange={(e) => onSectionChange(e.target.value as DrawerSectionId)}
          >
            {DRAWER_SECTIONS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
                {sectionCounts[s.id] !== undefined
                  ? ` (${sectionCounts[s.id]})`
                  : ""}
              </option>
            ))}
          </select>
        </div>

        {/* ── Содержимое раздела ── */}
        <div
          ref={contentRef}
          className="flex-1 overflow-y-auto px-5 py-5"
          role="tabpanel"
        >
          {section === "decision" ? (
            <div className="space-y-5">
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="ic-level-conclusion space-y-4 p-4">
                  <p className="ic-level-caption">Заключение аудита</p>
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
                  <Field label="Потенциал влияния на показатель">
                    {INFLUENCE_LABELS[item.influencePotential] ?? "—"}
                  </Field>
                </div>
                <div className="space-y-4">
                  <div className="ic-level-proposal space-y-3 p-4">
                    <p className="ic-level-caption">Рекомендация</p>
                    <p className="text-[14px] leading-relaxed">
                      {orDash(item.proposed.activity)}
                    </p>
                    <p className="text-[12.5px] text-[var(--ic-ink-2)]">
                      Владелец: {orDash(item.proposed.owner)} · Целевое
                      значение: {orDash(item.proposed.target)}
                    </p>
                  </div>
                  <div className="ic-card p-4">
                    <p className="ic-level-caption mb-2">Связи мероприятия</p>
                    <EvidenceTrail
                      problems={itemProblems}
                      rows={relatedRows}
                      practices={itemPractices}
                      stages={relatedStages}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {section === "compare" ? (
            <div className="space-y-4">
              <CompareRow
                label="Мероприятие"
                was={item.originalActivity}
                proposed={item.proposed.activity}
              />
              <CompareRow
                label="Ключевой показатель эффективности (КПЭ)"
                was={item.originalKpi}
                proposed={item.proposed.kpiName}
              />
              <div className="grid gap-4 lg:grid-cols-2">
                <CompareRow
                  label="Исходное значение"
                  was=""
                  proposed={item.proposed.baseline}
                />
                <CompareRow
                  label="Целевое значение"
                  was=""
                  proposed={item.proposed.target}
                />
                <CompareRow
                  label="Формула расчёта"
                  was=""
                  proposed={item.proposed.formula}
                />
                <CompareRow
                  label="Источник данных"
                  was=""
                  proposed={item.proposed.dataSource}
                />
              </div>
              <CompareRow
                label="Владелец"
                was={item.responsible.join(", ")}
                proposed={item.proposed.owner}
              />
              <CompareRow
                label="Условие пересмотра мероприятия"
                was=""
                proposed={item.proposed.stopCriterion}
              />
              <p className="text-[12.5px] text-[var(--ic-ink-2)]">
                «—» в колонке «Было» означает, что в исходной карте этот
                атрибут не задан (исходные значения, формулы и условия
                пересмотра в проекте карты отсутствуют).
              </p>
            </div>
          ) : null}

          {section === "evidence" ? (
            <div className="space-y-5">
              <div className="space-y-3">
                <Field label="Шкала доказательности">
                  <EvidenceScale item={item} />
                </Field>
                <StatusBadge
                  color="var(--ic-s-new)"
                  label={`Тип вывода: ${CONFIDENCE_LABELS[item.confidence]}`}
                />
              </div>

              <div>
                <h4 className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-[var(--ic-ink-2)]">
                  Источники ({itemSources.length})
                </h4>
                {itemSources.length === 0 ? (
                  <p className="text-[14px] text-[var(--ic-ink-2)]">
                    Источники к строке не привязаны — «—».
                  </p>
                ) : (
                  <div className="space-y-3">
                    {itemSources.map((s) => (
                      <article key={s.id} className="ic-level-fact p-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[12px] font-bold text-[var(--ic-accent)]">
                            {s.id}
                          </span>
                          {!s.verified ? (
                            <StatusBadge
                              color="var(--ic-s-nodata)"
                              label="Не подтверждён независимо"
                            />
                          ) : null}
                        </div>
                        <h5 className="mt-1 text-[14px] font-semibold">{s.title}</h5>
                        <p className="mt-0.5 text-[12.5px] text-[var(--ic-ink-2)]">
                          {s.organization} · {s.date} · доступ {s.accessed}
                        </p>
                        {s.note ? <p className="mt-1 text-[13px]">{s.note}</p> : null}
                        <div className="mt-1.5">
                          <SourceLink url={s.url} />
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h4 className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-[var(--ic-ink-2)]">
                  Практики других регионов и стран ({itemPractices.length})
                </h4>
                {itemPractices.length === 0 ? (
                  <p className="text-[14px] text-[var(--ic-ink-2)]">
                    Для этой строки аналоги в собранных практиках не привязаны — «—».
                  </p>
                ) : (
                  <div className="space-y-3">
                    {itemPractices.map((p) => {
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
                          <h5 className="mt-1.5 text-[14.5px] font-semibold">{p.title}</h5>
                          <p className="mt-1 text-[13px] text-[var(--ic-ink-2)]">{p.mechanism}</p>
                          <p className="mt-1.5 text-[13px]">
                            <strong>Результат:</strong> {orDash(p.provenResult)}
                          </p>
                          <p className="mt-1 text-[12.5px] text-[var(--ic-ink-2)]">
                            Применимость: {p.applicabilityNote}
                          </p>
                          {p.limitations ? (
                            <p className="mt-1 text-[12.5px] text-[var(--ic-ink-2)]">
                              Ограничения: {p.limitations}
                            </p>
                          ) : null}
                        </article>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ) : null}

          {section === "data" ? (
            <div className="space-y-4">
              <Field label="Полный текст мероприятия">
                {item.originalActivity.trim() ? (
                  item.originalActivity
                ) : (
                  <span className="text-[var(--ic-s-nodata)]">
                    Строка {item.id} не заполнена в проекте карты — данных
                    недостаточно. Предлагаемое наполнение см. в разделе
                    «Было и предлагается».
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
              <Field label="Исходный КПЭ">{orDash(item.originalKpi)}</Field>
              <Field label="Ответственные (как в документе)">
                {item.responsible.length > 0 ? item.responsible.join(", ") : "—"}{" "}
                <span className="text-[12.5px] text-[var(--ic-ink-2)]">
                  (группа: {GROUP_LABELS[item.responsibleGroup]})
                </span>
              </Field>
              <Field label="Первоисточник">
                Проект дорожной карты (DOCX, сверен по SHA-256) — реквизиты в
                разделе «Основания».
              </Field>
            </div>
          ) : null}
        </div>

        {/* ── Футер: prev / next / копировать ссылку ── */}
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
