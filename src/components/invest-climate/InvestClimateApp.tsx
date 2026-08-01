"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { InvestClimateData, Verdict } from "@/types/investment-climate";
import {
  EMPTY_FILTERS,
  filterItems,
  filtersToParams,
  isKeyItem,
  paramsToState,
  type Filters,
  type ViewMode,
} from "./filters";
import { TitleBlock } from "./TitleBlock";
import { ManagementOverview } from "./ManagementOverview";
import { SummaryBlock } from "./SummaryBlock";
import { PositionBlock } from "./PositionBlock";
import { DiagnosticsBlock } from "./DiagnosticsBlock";
import { ItemsBlock, type ListMode } from "./ItemsBlock";
import { ItemDrawer, type DrawerSectionId } from "./ItemDrawer";
import { ProblemsBlock } from "./ProblemsBlock";
import { JourneyBlock } from "./JourneyBlock";
import { MapAuditBlock } from "./MapAuditBlock";
import { PracticesBlock } from "./PracticesBlock";
import { DecisionPackageBlock } from "./DecisionPackageBlock";
import { MethodBlock } from "./MethodBlock";
import { SourcesBlock } from "./SourcesBlock";
import { PageContents, type ContentsEntry } from "./PageContents";
import { PresentationStory } from "./PresentationStory";

/* Секции подробного режима (порядок = порядок на странице). */
const SECTION_IDS = [
  "top",
  "summary",
  "position",
  "diagnostics",
  "items",
  "problems",
  "journey",
  "map-audit",
  "practices",
  "proposals",
  "method",
  "sources",
];

/* Оглавление: все разделы с подуровнями. */
const CONTENTS: ContentsEntry[] = [
  { id: "overview", label: "Основные выводы" },
  { id: "summary", label: "Резюме" },
  { id: "position", label: "Положение региона" },
  { id: "diagnostics", label: "Диагностика карты" },
  {
    id: "items",
    label: "43 мероприятия",
    children: [{ id: "items", label: "Фильтры и список строк" }],
  },
  { id: "problems", label: "Карта проблем" },
  { id: "journey", label: "Путь инвестора" },
  { id: "map-audit", label: "Инвестиционная карта: аудит" },
  { id: "practices", label: "Практики регионов и стран" },
  {
    id: "proposals",
    label: "Пакет решений",
    children: [{ id: "new-roadmap", label: "Новая карта: 30 строк" }],
  },
  { id: "method", label: "Методика" },
  { id: "sources", label: "Источники" },
];

/** Единое интерактивное состояние страницы (фильтры, поиск, карточка, режимы). */
type UiState = {
  filters: Filters;
  query: string;
  openItem: number | null;
  present: boolean;
  view: ViewMode;
};

const INITIAL_UI: UiState = {
  filters: EMPTY_FILTERS,
  query: "",
  openItem: null,
  present: false,
  view: "main",
};

export function InvestClimateApp({ data }: { data: InvestClimateData }) {
  const [ui, setUi] = useState<UiState>(INITIAL_UI);
  const [activeSection, setActiveSection] = useState("top");
  const [drawerSection, setDrawerSection] = useState<DrawerSectionId>("decision");
  const [listMode, setListMode] = useState<ListMode>("key");
  const [contentsOpen, setContentsOpen] = useState(false);
  const hydratedRef = useRef(false);
  const pendingScrollRef = useRef<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const { filters, query, openItem: openId, present, view } = ui;

  /* ── Инициализация из URL (deep link ?item=N, ?view=full, фильтры).
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
    const params = filtersToParams(filters, query, openId, present, view);
    const qs = params.toString();
    const url = `${window.location.pathname}${qs ? `?${qs}` : ""}`;
    window.history.replaceState(null, "", url);
  }, [filters, query, openId, present, view]);

  /* ── Активная секция для оглавления (IntersectionObserver) ── */
  useEffect(() => {
    if (view !== "full") return;
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
  }, [view]);

  /* ── Отложенная прокрутка после смены уровня (main ⇄ full) ── */
  const scrollToSection = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    const target = pendingScrollRef.current;
    if (!target) return;
    pendingScrollRef.current = null;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => scrollToSection(target));
    });
  }, [view, scrollToSection]);

  /* ── Навигация между уровнями и разделами ── */
  const goOverview = useCallback(() => {
    setUi((prev) => ({ ...prev, view: "main" }));
    pendingScrollRef.current = "overview";
  }, []);

  const goToSection = useCallback(
    (id: string) => {
      if (id === "overview" || id === "top") {
        goOverview();
        return;
      }
      setUi((prev) => ({ ...prev, view: "full" }));
      if (view === "full") scrollToSection(id);
      else pendingScrollRef.current = id;
    },
    [view, scrollToSection, goOverview],
  );

  const goFull = useCallback(
    (sectionId?: string) => goToSection(sectionId ?? "summary"),
    [goToSection],
  );

  const goToSearch = useCallback(() => {
    goToSection("items");
    window.setTimeout(() => searchInputRef.current?.focus(), 450);
  }, [goToSection]);

  /* ── Производные данные ── */
  const filtered = useMemo(
    () => filterItems(data.items, filters, query),
    [data.items, filters, query],
  );
  const displayed = useMemo(
    () => (listMode === "key" ? filtered.filter(isKeyItem) : filtered),
    [filtered, listMode],
  );
  const keyCount = useMemo(
    () => data.items.filter(isKeyItem).length,
    [data.items],
  );
  const displayedIds = useMemo(() => displayed.map((i) => i.id), [displayed]);
  const openItem = useMemo(
    () => (openId !== null ? data.items.find((i) => i.id === openId) ?? null : null),
    [data.items, openId],
  );
  const drawerVisibleIds = useMemo(() => {
    if (openId !== null && displayedIds.includes(openId)) return displayedIds;
    return data.items.map((i) => i.id);
  }, [openId, displayedIds, data.items]);

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

  /* Открытие карточки из списка/сцен: раздел карточки — «Решение». */
  const openItemCard = useCallback((id: number) => {
    setDrawerSection("decision");
    setUi((prev) => ({ ...prev, openItem: id, view: "full" }));
  }, []);

  /* Prev/next внутри карточки: выбранный раздел сохраняется (аудит П-5). */
  const navigateItemCard = useCallback((id: number) => {
    setUi((prev) => ({ ...prev, openItem: id }));
  }, []);

  const closeItemCard = useCallback(() => {
    setUi((prev) => ({ ...prev, openItem: null }));
  }, []);

  const applyFilterAndScroll = useCallback(
    (patch: Partial<Filters>) => {
      setListMode("all");
      setUi((prev) => ({
        ...prev,
        view: "full",
        filters: { ...EMPTY_FILTERS, ...patch },
      }));
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
      goToSection(anchor.replace(/^#/, ""));
    },
    [goToSection],
  );

  const goPackage = useCallback(() => goToSection("proposals"), [goToSection]);

  const goMapAudit = useCallback(() => goToSection("map-audit"), [goToSection]);

  const startPresent = useCallback(() => {
    setUi((prev) => ({ ...prev, present: true }));
  }, []);

  const exitPresent = useCallback(() => {
    setUi((prev) => ({ ...prev, present: false }));
  }, []);

  const contentsActive = view === "main" ? "overview" : activeSection;

  return (
    <div>
      {/* ── Компактная шапка: сегмент-контрол + 6 постоянных действий ── */}
      <nav className="ic-nav ic-no-print" aria-label="Навигация по странице">
        <div className="ic-container-wide ic-nav-row">
          <div className="ic-seg" role="group" aria-label="Уровень изложения">
            <button
              type="button"
              className="ic-seg-btn"
              aria-pressed={view === "main"}
              onClick={goOverview}
            >
              <span className="ic-label-long">Основные выводы</span>
              <span className="ic-label-short">Выводы</span>
            </button>
            <button
              type="button"
              className="ic-seg-btn"
              aria-pressed={view === "full"}
              onClick={() => goToSection("summary")}
            >
              <span className="ic-label-long">Подробный анализ</span>
              <span className="ic-label-short">Анализ</span>
            </button>
          </div>
          <div className="ic-nav-actions flex-1">
            <button
              type="button"
              className="ic-nav-link ic-nav-desktop-only"
              onClick={() => goToSection("items")}
            >
              43 мероприятия
            </button>
            <button
              type="button"
              className="ic-nav-link ic-nav-desktop-only"
              onClick={goPackage}
            >
              Пакет решений
            </button>
            <button
              type="button"
              className="ic-nav-link ic-nav-desktop-only"
              onClick={goToSearch}
            >
              Поиск
            </button>
          </div>
          <button
            type="button"
            className="ic-nav-btn"
            onClick={() => setContentsOpen(true)}
            aria-haspopup="dialog"
          >
            Оглавление
          </button>
          <button
            type="button"
            className="ic-nav-btn"
            onClick={startPresent}
            title="Режим демонстрации: 10 сцен, стрелки ←/→, выход — Esc"
          >
            Демонстрация
          </button>
        </div>
      </nav>

      {/* ── Титульный блок с авторской схемой ── */}
      <TitleBlock
        meta={data.meta}
        decisionsCount={data.summary.priorities.length}
        newRowsCount={data.newRoadmap.length}
      />

      {/* ── Управленческий уровень (основные выводы) ── */}
      {view === "main" ? (
        <>
          <ManagementOverview data={data} onGoFull={goFull} />
          {/* Аудит карты в управленческом изложении: шапка, вывод, связь
              с рейтингом и шаги; остальное — в подробном режиме. */}
          <MapAuditBlock
            audit={data.mapAudit}
            compact
            onOverview={goOverview}
            onPackage={goPackage}
            onExpand={goMapAudit}
          />
        </>
      ) : null}

      {/* ── Подробный анализ ── */}
      {view === "full" ? (
        <>
          <SummaryBlock
            summary={data.summary}
            sources={data.sources}
            onAnchor={handleAnchor}
          />
          <PositionBlock meta={data.meta} />
          <DiagnosticsBlock
            meta={data.meta}
            items={data.items}
            onVerdictClick={handleVerdictClick}
            onMatrixClick={handleMatrixClick}
          />
          <ItemsBlock
            items={data.items}
            displayed={displayed}
            keyCount={keyCount}
            total={data.items.length}
            meta={data.meta}
            problems={data.problems}
            filters={filters}
            query={query}
            listMode={listMode}
            onListModeChange={setListMode}
            onFiltersChange={patchFilters}
            onQueryChange={setQuery}
            onReset={resetFilters}
            onOpenItem={openItemCard}
            onOverview={goOverview}
            onPackage={goPackage}
            searchInputRef={searchInputRef}
          />
          <ProblemsBlock problems={data.problems} onProblemClick={handleProblemClick} />
          <JourneyBlock journey={data.journey} onOpenItem={openItemCard} />
          <MapAuditBlock
            audit={data.mapAudit}
            onOverview={goOverview}
            onPackage={goPackage}
          />
          <PracticesBlock
            practices={data.practices}
            onOverview={goOverview}
            onPackage={goPackage}
          />
          <DecisionPackageBlock
            summary={data.summary}
            newRoadmap={data.newRoadmap}
            onOpenItem={openItemCard}
            onOverview={goOverview}
          />
          <MethodBlock meta={data.meta} />
          <SourcesBlock
            sources={data.sources}
            onOverview={goOverview}
            onPackage={goPackage}
          />
        </>
      ) : null}

      <footer className="ic-container ic-no-print pb-16 pt-4 text-[12.5px] text-[var(--ic-ink-2)]">
        {data.meta.status}. Данные по состоянию на {data.meta.dataDate}. Закрытая
        страница — не предназначена для публичного распространения.
      </footer>

      {/* ── Оглавление (боковая панель) ── */}
      <PageContents
        open={contentsOpen}
        entries={CONTENTS}
        activeSection={contentsActive}
        onNavigate={goToSection}
        onClose={() => setContentsOpen(false)}
      />

      {/* ── Режим демонстрации: 10 самостоятельных сцен ── */}
      {present ? (
        <PresentationStory
          data={data}
          paused={openItem !== null}
          onExit={exitPresent}
          onOpenItem={openItemCard}
        />
      ) : null}

      {/* ── Карточка мероприятия ── */}
      {openItem ? (
        <ItemDrawer
          item={openItem}
          visibleIds={drawerVisibleIds}
          problems={data.problems}
          practices={data.practices}
          sources={data.sources}
          newRoadmap={data.newRoadmap}
          journey={data.journey}
          section={drawerSection}
          onSectionChange={setDrawerSection}
          onClose={closeItemCard}
          onNavigate={navigateItemCard}
        />
      ) : null}
    </div>
  );
}
