"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { InvestClimateData, Verdict } from "@/types/investment-climate";
import {
  EMPTY_FILTERS,
  filterItems,
  filtersToParams,
  paramsToState,
  type Filters,
} from "./filters";
import { TitleBlock } from "./TitleBlock";
import { SummaryBlock } from "./SummaryBlock";
import { PositionBlock } from "./PositionBlock";
import { DiagnosticsBlock } from "./DiagnosticsBlock";
import { ItemsBlock } from "./ItemsBlock";
import { ItemDrawer } from "./ItemDrawer";
import { ProblemsBlock } from "./ProblemsBlock";
import { JourneyBlock } from "./JourneyBlock";
import { PracticesBlock } from "./PracticesBlock";
import { ProposalsBlock } from "./ProposalsBlock";
import { NewRoadmapBlock } from "./NewRoadmapBlock";
import { MethodBlock } from "./MethodBlock";
import { SourcesBlock } from "./SourcesBlock";

/* 9 пунктов sticky-меню; каждой секции страницы сопоставлен пункт. */
const NAV_ITEMS: { id: string; label: string }[] = [
  { id: "summary", label: "Резюме" },
  { id: "position", label: "Положение региона" },
  { id: "diagnostics", label: "Диагностика" },
  { id: "items", label: "43 мероприятия" },
  { id: "problems", label: "Проблемы" },
  { id: "journey", label: "Путь инвестора" },
  { id: "practices", label: "Практики" },
  { id: "proposals", label: "Предложения" },
  { id: "method", label: "Методика и источники" },
];

/* Все секции по порядку (для presentation mode и активного пункта меню). */
const SECTION_IDS = [
  "top",
  "summary",
  "position",
  "diagnostics",
  "items",
  "problems",
  "journey",
  "practices",
  "proposals",
  "new-roadmap",
  "method",
  "sources",
];

/* Секция → пункт меню. */
const SECTION_TO_NAV: Record<string, string> = {
  top: "summary",
  summary: "summary",
  position: "position",
  diagnostics: "diagnostics",
  items: "items",
  problems: "problems",
  journey: "journey",
  practices: "practices",
  proposals: "proposals",
  "new-roadmap": "proposals",
  method: "method",
  sources: "method",
};

/** Единое интерактивное состояние страницы (фильтры, поиск, карточка, режим). */
type UiState = {
  filters: Filters;
  query: string;
  openItem: number | null;
  present: boolean;
};

const INITIAL_UI: UiState = {
  filters: EMPTY_FILTERS,
  query: "",
  openItem: null,
  present: false,
};

export function InvestClimateApp({ data }: { data: InvestClimateData }) {
  const [ui, setUi] = useState<UiState>(INITIAL_UI);
  const [activeSection, setActiveSection] = useState("top");
  const hydratedRef = useRef(false);
  const { filters, query, openItem: openId, present } = ui;

  /* ── Инициализация из URL (deep link ?item=N, фильтры, поиск).
        Однократная гидрация клиентского состояния из внешней системы
        (window.location) после монтирования — сервер этих данных не знает. ── */
  useEffect(() => {
    const state = paramsToState(window.location.search);
    hydratedRef.current = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- однократная гидрация из URL при монтировании
    setUi(state);
  }, []);

  /* ── Синхронизация состояния в URL (replaceState — без роста истории) ── */
  useEffect(() => {
    if (!hydratedRef.current) return;
    const params = filtersToParams(filters, query, openId, present);
    const qs = params.toString();
    const url = `${window.location.pathname}${qs ? `?${qs}` : ""}`;
    window.history.replaceState(null, "", url);
  }, [filters, query, openId, present]);

  /* ── Активная секция для меню (IntersectionObserver) ── */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveSection(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: [0, 0.1, 0.4] },
    );
    for (const id of SECTION_IDS) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  /* ── Presentation mode: Esc — выход, стрелки — навигация по секциям ── */
  const scrollToSection = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (!present) return;
    const onKeyDown = (e: KeyboardEvent) => {
      // Когда открыт drawer, Esc обрабатывает он (capture-фаза + stopPropagation).
      if (e.key === "Escape") {
        setUi((prev) => ({ ...prev, present: false }));
        return;
      }
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const idx = SECTION_IDS.indexOf(activeSection);
      const next =
        e.key === "ArrowRight"
          ? Math.min(SECTION_IDS.length - 1, idx + 1)
          : Math.max(0, idx - 1);
      e.preventDefault();
      scrollToSection(SECTION_IDS[next]);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [present, activeSection, scrollToSection]);

  /* ── Производные данные ── */
  const filtered = useMemo(
    () => filterItems(data.items, filters, query),
    [data.items, filters, query],
  );
  const visibleIds = useMemo(() => filtered.map((i) => i.id), [filtered]);
  const openItem = useMemo(
    () => (openId !== null ? data.items.find((i) => i.id === openId) ?? null : null),
    [data.items, openId],
  );

  /* ── Обработчики ── */
  const patchFilters = useCallback((patch: Partial<Filters>) => {
    setUi((prev) => ({ ...prev, filters: { ...prev.filters, ...patch } }));
  }, []);

  const setQuery = useCallback((query: string) => {
    setUi((prev) => ({ ...prev, query }));
  }, []);

  const resetFilters = useCallback(() => {
    setUi((prev) => ({ ...prev, filters: EMPTY_FILTERS, query: "" }));
  }, []);

  const openItemCard = useCallback((id: number) => {
    setUi((prev) => ({ ...prev, openItem: id }));
  }, []);

  const closeItemCard = useCallback(() => {
    setUi((prev) => ({ ...prev, openItem: null }));
  }, []);

  const applyFilterAndScroll = useCallback(
    (patch: Partial<Filters>) => {
      setUi((prev) => ({ ...prev, filters: { ...EMPTY_FILTERS, ...patch } }));
      scrollToSection("items");
    },
    [scrollToSection],
  );

  const handleVerdictClick = useCallback(
    (verdict: Verdict) => applyFilterAndScroll({ verdict }),
    [applyFilterAndScroll],
  );

  const handleMatrixClick = useCallback(
    (ri: number, ii: number) => applyFilterAndScroll({ ri, ii }),
    [applyFilterAndScroll],
  );

  const handleProblemClick = useCallback(
    (problem: string) => applyFilterAndScroll({ problem }),
    [applyFilterAndScroll],
  );

  const handleAnchor = useCallback(
    (anchor: string) => {
      scrollToSection(anchor.replace(/^#/, ""));
    },
    [scrollToSection],
  );

  const sectionIdx = Math.max(0, SECTION_IDS.indexOf(activeSection));
  const activeNav = SECTION_TO_NAV[activeSection] ?? "summary";

  return (
    <div className={present ? "ic-present" : undefined}>
      {/* ── Sticky-навигация ── */}
      <nav className="ic-nav" aria-label="Разделы страницы">
        <div className="ic-container-wide flex items-center gap-3">
          <div className="ic-nav-inner flex-1">
            {NAV_ITEMS.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                className={`ic-nav-link ${activeNav === n.id ? "ic-nav-active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(n.id);
                }}
              >
                {n.label}
              </a>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setUi((prev) => ({ ...prev, present: true }))}
            className="ic-no-print flex-shrink-0 rounded-lg border border-[var(--ic-line)] bg-[var(--ic-surface)] px-3 py-1.5 text-[12.5px] font-semibold text-[var(--ic-ink-2)] transition hover:border-[var(--ic-accent)] hover:text-[var(--ic-accent-ink)]"
            title="Режим демонстрации: секция на экран, стрелки ←/→, выход — Esc"
          >
            Демонстрация
          </button>
        </div>
      </nav>

      {/* ── Секции ── */}
      <TitleBlock meta={data.meta} />
      <SummaryBlock summary={data.summary} onAnchor={handleAnchor} />
      <PositionBlock meta={data.meta} />
      <DiagnosticsBlock
        meta={data.meta}
        items={data.items}
        onVerdictClick={handleVerdictClick}
        onMatrixClick={handleMatrixClick}
      />
      <ItemsBlock
        items={data.items}
        filtered={filtered}
        total={data.items.length}
        meta={data.meta}
        problems={data.problems}
        filters={filters}
        query={query}
        onFiltersChange={patchFilters}
        onQueryChange={setQuery}
        onReset={resetFilters}
        onOpenItem={openItemCard}
      />
      <ProblemsBlock problems={data.problems} onProblemClick={handleProblemClick} />
      <JourneyBlock journey={data.journey} onOpenItem={openItemCard} />
      <PracticesBlock practices={data.practices} />
      <ProposalsBlock summary={data.summary} newRoadmap={data.newRoadmap} />
      <NewRoadmapBlock newRoadmap={data.newRoadmap} onOpenItem={openItemCard} />
      <MethodBlock meta={data.meta} />
      <SourcesBlock sources={data.sources} />

      <footer className="ic-container ic-no-print pb-16 pt-4 text-[12.5px] text-[var(--ic-ink-2)]">
        {data.meta.status}. Данные по состоянию на {data.meta.dataDate}. Закрытая
        страница — не предназначена для публичного распространения.
      </footer>

      {/* ── Drawer карточки мероприятия ── */}
      {openItem ? (
        <ItemDrawer
          item={openItem}
          visibleIds={visibleIds.length > 0 ? visibleIds : data.items.map((i) => i.id)}
          problems={data.problems}
          practices={data.practices}
          sources={data.sources}
          newRoadmap={data.newRoadmap}
          onClose={closeItemCard}
          onNavigate={openItemCard}
        />
      ) : null}

      {/* ── Прогресс презентационного режима ── */}
      {present ? (
        <>
          <div className="ic-present-bar" aria-hidden>
            <span
              style={{
                width: `${((sectionIdx + 1) / SECTION_IDS.length) * 100}%`,
              }}
            />
          </div>
          <p className="ic-present-hint">←/→ — секции · Esc — выход</p>
        </>
      ) : null}
    </div>
  );
}
