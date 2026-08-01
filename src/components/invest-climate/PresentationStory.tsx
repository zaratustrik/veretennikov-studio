"use client";

import { useEffect, useMemo, useState } from "react";
import type { InvestClimateData, RoadmapItem } from "@/types/investment-climate";
import { PRIORITY_META, StatusBadge, VERDICT_META } from "./shared";
import { decisionTags } from "./DecisionCard";

/**
 * PresentationStory — режим демонстрации: самостоятельная
 * последовательность из 10 специально свёрстанных сцен (не секции
 * страницы — аудит П-2). Каждая сцена строится из данных JSON и
 * целиком помещается в 1920×1080 и 1366×768: фиксированная
 * композиция, крупная типографика, списки не длиннее 6–7 строк.
 * Управление: ←/→, номер сцены «3 / 10», Esc — выход; клик по
 * мероприятию открывает карточку и возвращает в режим.
 */
export function PresentationStory({
  data,
  paused,
  onExit,
  onOpenItem,
}: {
  data: InvestClimateData;
  paused: boolean;
  onExit: () => void;
  onOpenItem: (id: number) => void;
}) {
  const [scene, setScene] = useState(0);
  const { meta, summary, items, problems, journey, newRoadmap } = data;

  /* Прокрутка страницы под оверлеем заблокирована (в т.ч. после
     возврата из карточки, которая восстанавливает overflow). */
  useEffect(() => {
    if (paused) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [paused]);

  /* ── Производные выборки для сцен ── */
  const topProblems = useMemo(
    () =>
      [...problems]
        .sort((a, b) => b.itemIds.length - a.itemIds.length)
        .slice(0, 5),
    [problems],
  );

  const topItems = useMemo(() => {
    const prio = { critical: 0, high: 1, medium: 2, low: 3 } as const;
    return [...items]
      .sort(
        (a, b) =>
          b.ratingImpact + b.investorImpact - (a.ratingImpact + a.investorImpact) ||
          prio[a.priority] - prio[b.priority] ||
          a.id - b.id,
      )
      .slice(0, 6);
  }, [items]);

  const filledCount = useMemo(
    () => items.filter((i) => i.originalActivity.trim().length > 0).length,
    [items],
  );
  const formalCount = useMemo(
    () => items.filter((i) => i.issues.includes("formal-kpi")).length,
    [items],
  );

  const planColumns = useMemo(() => {
    const cols: { label: string; starts: string[] }[] = [
      { label: "0–3 мес.", starts: ["0-3"] },
      { label: "3–6 мес.", starts: ["0-6", "3-6"] },
      { label: "6–12 мес.", starts: ["3-12", "6-12"] },
      { label: "12–24 мес.", starts: ["12-24"] },
    ];
    return cols.map((c) => ({
      label: c.label,
      rows: newRoadmap.filter((r) => c.starts.includes(r.horizon)),
    }));
  }, [newRoadmap]);

  const expectedResults = useMemo(() => {
    const ids = ["A4", "Б2", "Г1", "Д1"];
    return newRoadmap.filter((r) => ids.includes(r.id));
  }, [newRoadmap]);

  const questions = useMemo(() => {
    const byN = (n: number) => summary.priorities.find((p) => p.n === n);
    const qs: { title: string; note: string }[] = [];
    const p6 = byN(6);
    if (p6) qs.push({ title: p6.title, note: `срок ${p6.term} · ресурс ${p6.cost}` });
    const p5 = byN(5);
    if (p5) qs.push({ title: p5.title, note: `срок ${p5.term} · ресурс ${p5.cost}` });
    const p2 = byN(2);
    if (p2) qs.push({ title: p2.title, note: `срок ${p2.term} · ресурс ${p2.cost}` });
    const p4 = byN(4);
    if (p4) qs.push({ title: p4.title, note: `срок ${p4.term} · ресурс ${p4.cost}` });
    qs.push({
      title: `Порядок обсуждения новой редакции карты (${newRoadmap.length} строк, 5 блоков)`,
      note: "полная таблица — в разделе «Пакет решений»",
    });
    return qs;
  }, [summary.priorities, newRoadmap.length]);

  const gapsStages = journey.filter((s) => s.gaps.length > 0).length;

  /* ── Сцены ── */
  const scenes: { title: string; body: React.ReactNode }[] = [
    {
      title: "Масштаб исследования",
      body: (
        <div>
          <p className="max-w-[64ch] text-[clamp(15px,1.6vw,21px)] leading-relaxed text-[var(--ic-ink-2)]">
            {meta.subtitle}. Горизонт карты: {meta.period}. Данные по
            состоянию на {meta.dataDate}.
          </p>
          <div className="mt-[3vh] grid grid-cols-2 gap-x-10 gap-y-[3vh] md:grid-cols-4">
            {[
              { v: meta.counters.items, l: "мероприятия исходной карты" },
              { v: meta.counters.documents, l: "документ и источник" },
              {
                v: meta.counters.ruPractices + meta.counters.intlPractices,
                l: "практик России и мира",
              },
              { v: meta.counters.proposals, l: "предложений по итогам" },
            ].map((c) => (
              <div key={c.l}>
                <div className="ic-story-big">{c.v}</div>
                <div className="mt-1 text-[clamp(12px,1.1vw,15px)] font-medium text-[var(--ic-ink-2)]">
                  {c.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "Положение региона",
      body: (
        <div className="grid gap-[4vw] lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center">
          <div>
            <p className="ic-level-caption">Место в Нацрейтинге АСИ</p>
            <p className="ic-story-big mt-1">
              {meta.rating.y2024} → {meta.rating.y2025} →{" "}
              <span style={{ color: "var(--ic-s-remove)" }}>
                {meta.rating.y2026}
              </span>
            </p>
            <p className="mt-2 text-[clamp(12px,1.1vw,14px)] text-[var(--ic-ink-2)]">
              2024 → 2025 → 2026 · источники: asi.ru
            </p>
          </div>
          <div className="space-y-[1.2vh]">
            {meta.indicators.map((ind) => (
              <div
                key={ind.code}
                className="flex items-baseline justify-between gap-4 border-b border-[var(--ic-line)] pb-[1vh]"
              >
                <span className="min-w-0 truncate text-[clamp(13px,1.25vw,17px)] font-medium">
                  {ind.code} · {ind.name}
                </span>
                <span className="flex-shrink-0 text-[clamp(13px,1.25vw,17px)]">
                  <strong>{ind.so.toFixed(2).replace(".", ",")}</strong>
                  <span className="text-[var(--ic-ink-2)]">
                    {" "}
                    → цель {ind.target.toFixed(2).replace(".", ",")}
                    {ind.rfAvg !== null
                      ? ` · РФ ${ind.rfAvg.toFixed(2).replace(".", ",")}`
                      : ""}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "Основной диагноз",
      body: (
        <div>
          <p className="max-w-[30ch] text-[clamp(22px,2.6vw,38px)] font-semibold leading-tight">
            Карта измеряет активность, а не результат для инвестора
          </p>
          <div className="mt-[3.5vh] grid grid-cols-2 gap-x-10 gap-y-[3vh] md:grid-cols-4">
            <div>
              <div className="ic-story-big">
                {formalCount}
                <span className="text-[0.5em] font-semibold text-[var(--ic-ink-2)]">
                  {" "}
                  / {filledCount}
                </span>
              </div>
              <div className="mt-1 text-[clamp(12px,1.1vw,15px)] font-medium text-[var(--ic-ink-2)]">
                заполненных строк — КПЭ активности (документы, встречи)
              </div>
            </div>
            <div>
              <div className="ic-story-big">{meta.verdictStats.rewrite ?? 0}</div>
              <div className="mt-1 text-[clamp(12px,1.1vw,15px)] font-medium text-[var(--ic-ink-2)]">
                строк — переработать
              </div>
            </div>
            <div>
              <div className="ic-story-big">{items.length - filledCount}</div>
              <div className="mt-1 text-[clamp(12px,1.1vw,15px)] font-medium text-[var(--ic-ink-2)]">
                строки (33–36) без мероприятий
              </div>
            </div>
            <div>
              <div className="ic-story-big">{meta.verdictStats.keep ?? 0}</div>
              <div className="mt-1 text-[clamp(12px,1.1vw,15px)] font-medium text-[var(--ic-ink-2)]">
                строк — сохранить и усилить
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Пять системных проблем",
      body: (
        <ol className="grid gap-[1.5vh] lg:grid-cols-2">
          {topProblems.map((p, i) => (
            <li
              key={p.id}
              className={`ic-card flex gap-4 px-5 py-[1.6vh] ${i === 0 ? "lg:col-span-2" : ""}`}
            >
              <span className="text-[clamp(18px,1.9vw,26px)] font-bold text-[var(--ic-accent)]">
                {i + 1}
              </span>
              <span className="min-w-0">
                <span className="block text-[clamp(15px,1.5vw,20px)] font-semibold leading-snug">
                  {p.title}
                  <span className="ml-2 text-[0.75em] font-medium text-[var(--ic-ink-2)]">
                    {p.itemIds.length} строк карты
                  </span>
                </span>
                <span className="mt-0.5 block truncate text-[clamp(12px,1.15vw,15px)] text-[var(--ic-ink-2)]">
                  {p.description}
                </span>
              </span>
            </li>
          ))}
        </ol>
      ),
    },
    {
      title: "Мероприятия с наибольшим влиянием",
      body: (
        <div>
          <ul className="space-y-[1.2vh]">
            {topItems.map((it: RoadmapItem) => (
              <li key={it.id}>
                <button
                  type="button"
                  onClick={() => onOpenItem(it.id)}
                  className="ic-card flex w-full items-center gap-4 px-5 py-[1.3vh] text-left transition hover:border-[var(--ic-accent)]"
                >
                  <span className="w-8 flex-shrink-0 text-[clamp(15px,1.5vw,20px)] font-bold text-[var(--ic-accent)]">
                    {it.id}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[clamp(13.5px,1.35vw,18px)] font-medium">
                    {it.originalActivity.trim() ||
                      `Строка не заполнена — предлагается: ${it.proposed.activity}`}
                  </span>
                  <StatusBadge
                    color={VERDICT_META[it.verdict].color}
                    label={VERDICT_META[it.verdict].label}
                  />
                  <StatusBadge
                    color={PRIORITY_META[it.priority].color}
                    label={PRIORITY_META[it.priority].label}
                  />
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-[1.6vh] text-[clamp(12px,1.1vw,14px)] text-[var(--ic-ink-2)]">
            Отбор: влияние на рейтинг и инвестора. Клик по строке открывает
            карточку; закрытие возвращает в демонстрацию.
          </p>
        </div>
      ),
    },
    {
      title: "Семь первоочередных решений",
      body: (
        <ol className="grid gap-x-8 gap-y-[1.4vh] lg:grid-cols-2">
          {summary.priorities.map((p) => (
            <li key={p.n} className="flex gap-3.5">
              <span className="flex h-[1.9em] w-[1.9em] flex-shrink-0 items-center justify-center rounded-full bg-[var(--ic-accent)] text-[clamp(13px,1.2vw,16px)] font-bold text-white">
                {p.n}
              </span>
              <span className="min-w-0">
                <span className="block text-[clamp(13.5px,1.35vw,18px)] font-semibold leading-snug">
                  {p.title}
                </span>
                <span className="mt-0.5 block text-[clamp(11.5px,1.05vw,14px)] text-[var(--ic-ink-2)]">
                  {p.term} · эффект {p.effect} · ресурс {p.cost} ·{" "}
                  {decisionTags(p)
                    .map((t) => t.label.toLowerCase())
                    .join(" · ")}
                </span>
              </span>
            </li>
          ))}
        </ol>
      ),
    },
    {
      title: "Предлагаемый путь инвестора",
      body: (
        <div>
          <ol className="grid grid-cols-2 gap-[1.2vh] md:grid-cols-3 xl:grid-cols-4">
            {journey.map((s, i) => (
              <li
                key={s.id}
                className="ic-card flex items-center gap-3 px-4 py-[1.2vh]"
              >
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[var(--ic-surface-2)] text-[13px] font-bold text-[var(--ic-ink-2)]">
                  {i + 1}
                </span>
                <span className="min-w-0 truncate text-[clamp(12.5px,1.2vw,16px)] font-medium">
                  {s.title}
                </span>
                {s.gaps.length > 0 ? (
                  <span
                    aria-label="есть разрывы"
                    title="Есть разрывы"
                    className="ml-auto h-2 w-2 flex-shrink-0 rounded-full"
                    style={{ background: "var(--ic-s-remove)" }}
                  />
                ) : null}
              </li>
            ))}
          </ol>
          <p className="mt-[1.8vh] text-[clamp(13px,1.25vw,17px)]">
            Разрывы зафиксированы на {gapsStages} из {journey.length} этапов —
            от первого интереса до сопровождения после запуска.
          </p>
        </div>
      ),
    },
    {
      title: "План реализации",
      body: (
        <div className="grid grid-cols-2 gap-[1.5vw] xl:grid-cols-4">
          {planColumns.map((c) => (
            <div key={c.label} className="ic-card flex min-h-0 flex-col px-4 py-[1.4vh]">
              <p className="flex items-baseline justify-between gap-2 border-b border-[var(--ic-line)] pb-[0.8vh] text-[clamp(13px,1.3vw,17px)] font-bold">
                {c.label}
                <span className="text-[var(--ic-ink-2)]">{c.rows.length}</span>
              </p>
              <ul className="mt-[0.8vh] space-y-[0.5vh] overflow-hidden">
                {c.rows.slice(0, 5).map((r) => (
                  <li
                    key={r.id}
                    className="truncate text-[clamp(11.5px,1.05vw,14px)] text-[var(--ic-ink-2)]"
                  >
                    <strong className="text-[var(--ic-accent)]">{r.id}</strong>{" "}
                    {r.title}
                  </li>
                ))}
                {c.rows.length > 5 ? (
                  <li className="text-[clamp(11.5px,1.05vw,14px)] font-semibold text-[var(--ic-ink-2)]">
                    + ещё {c.rows.length - 5}
                  </li>
                ) : null}
              </ul>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Ожидаемые результаты",
      body: (
        <div className="grid gap-[1.5vh] lg:grid-cols-2">
          <div className="ic-card px-5 py-[1.6vh]">
            <p className="ic-level-caption">Показатели рейтинга</p>
            <ul className="mt-[0.8vh] space-y-[0.6vh]">
              {meta.indicators.map((ind) => (
                <li
                  key={ind.code}
                  className="flex items-baseline justify-between gap-3 text-[clamp(12.5px,1.2vw,16px)]"
                >
                  <span className="min-w-0 truncate">{ind.name}</span>
                  <span className="flex-shrink-0 font-semibold">
                    {ind.so.toFixed(2).replace(".", ",")} →{" "}
                    {ind.target.toFixed(2).replace(".", ",")}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="ic-card px-5 py-[1.6vh]">
            <p className="ic-level-caption">КПЭ результата новой карты — примеры</p>
            <ul className="mt-[0.8vh] space-y-[0.7vh]">
              {expectedResults.map((r) => (
                <li key={r.id} className="text-[clamp(12.5px,1.2vw,16px)]">
                  <strong className="text-[var(--ic-accent)]">{r.id}</strong>{" "}
                  {r.outcomeKpi}
                  <span className="text-[var(--ic-ink-2)]"> · {r.horizon} мес.</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: "Вопросы для управленческого решения",
      body: (
        <ol className="space-y-[1.4vh]">
          {questions.map((q, i) => (
            <li key={q.title} className="flex gap-4">
              <span className="text-[clamp(17px,1.8vw,24px)] font-bold text-[var(--ic-accent)]">
                {i + 1}
              </span>
              <span className="min-w-0">
                <span className="block max-w-[70ch] text-[clamp(14px,1.45vw,20px)] font-semibold leading-snug">
                  {q.title}
                </span>
                <span className="mt-0.5 block text-[clamp(11.5px,1.05vw,14px)] text-[var(--ic-ink-2)]">
                  {q.note}
                </span>
              </span>
            </li>
          ))}
        </ol>
      ),
    },
  ];

  const total = scenes.length;
  const prev = () => setScene((s) => Math.max(0, s - 1));
  const next = () => setScene((s) => Math.min(total - 1, s + 1));

  /* Клавиатура: ←/→/Esc; пока открыта карточка — не перехватываем. */
  useEffect(() => {
    if (paused) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onExit();
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setScene((s) => Math.min(total - 1, s + 1));
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setScene((s) => Math.max(0, s - 1));
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [paused, total, onExit]);

  const current = scenes[scene];

  return (
    <div
      className="ic-story ic-no-print"
      role="dialog"
      aria-modal="true"
      aria-label={`Режим демонстрации, сцена ${scene + 1} из ${total}: ${current.title}`}
    >
      <div className="ic-story-scene">
        <p className="ic-story-eyebrow">
          {meta.title} · сцена {scene + 1} из {total}
        </p>
        <h2 className="ic-story-title">{current.title}</h2>
        <div className="ic-story-body">{current.body}</div>
      </div>
      <div className="ic-story-footer">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="ic-story-nav-btn"
            onClick={prev}
            disabled={scene === 0}
            aria-label="Предыдущая сцена (стрелка влево)"
          >
            ←
          </button>
          <span className="ic-story-counter" aria-live="polite">
            {scene + 1} / {total}
          </span>
          <button
            type="button"
            className="ic-story-nav-btn"
            onClick={next}
            disabled={scene === total - 1}
            aria-label="Следующая сцена (стрелка вправо)"
          >
            →
          </button>
        </div>
        <div className="ic-story-progress" aria-hidden>
          {scenes.map((s, i) => (
            <span key={s.title} className={i <= scene ? "ic-story-done" : ""} />
          ))}
        </div>
        <button type="button" className="ic-story-nav-btn" onClick={onExit}>
          Выход (Esc)
        </button>
      </div>
    </div>
  );
}
