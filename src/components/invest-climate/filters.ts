import type {
  EvidenceGrade,
  Priority,
  ResponsibleGroup,
  RoadmapItem,
  Verdict,
} from "@/types/investment-climate";

/** Наличие аналогов в практиках. */
export type BenchFilter = "ru" | "intl" | "none";

export type Filters = {
  ind: string | null; // код показателя
  verdict: Verdict | null;
  group: ResponsibleGroup | null;
  ri: number | null; // влияние на рейтинг 1–3
  ii: number | null; // влияние на инвестора 1–3
  priority: Priority | null;
  problem: string | null; // id проблемы
  bench: BenchFilter | null;
  ev: EvidenceGrade | null;
};

export const EMPTY_FILTERS: Filters = {
  ind: null,
  verdict: null,
  group: null,
  ri: null,
  ii: null,
  priority: null,
  problem: null,
  bench: null,
  ev: null,
};

export function hasActiveFilters(f: Filters, query: string): boolean {
  return query.trim().length > 0 || Object.values(f).some((v) => v !== null);
}

export function filterItems(
  items: RoadmapItem[],
  f: Filters,
  query: string,
): RoadmapItem[] {
  const q = query.trim().toLowerCase();
  return items.filter((item) => {
    if (f.ind && item.indicatorCode !== f.ind) return false;
    if (f.verdict && item.verdict !== f.verdict) return false;
    if (f.group && item.responsibleGroup !== f.group) return false;
    if (f.ri && item.ratingImpact !== f.ri) return false;
    if (f.ii && item.investorImpact !== f.ii) return false;
    if (f.priority && item.priority !== f.priority) return false;
    if (f.problem && !item.issues.includes(f.problem)) return false;
    if (f.bench) {
      const hasRu = item.benchmarkIds.some((id) => id.startsWith("ru-"));
      const hasIntl = item.benchmarkIds.some((id) => id.startsWith("intl-"));
      if (f.bench === "ru" && !hasRu) return false;
      if (f.bench === "intl" && !hasIntl) return false;
      if (f.bench === "none" && (hasRu || hasIntl)) return false;
    }
    if (f.ev && item.evidenceGrade !== f.ev) return false;
    if (q && !item.searchText.includes(q)) return false;
    return true;
  });
}

/* ── Сериализация состояния в URL searchParams ────────────────────── */

const EV_TO_URL: Record<EvidenceGrade, string> = {
  высокая: "high",
  средняя: "mid",
  низкая: "low",
};

const EV_FROM_URL: Record<string, EvidenceGrade> = {
  high: "высокая",
  mid: "средняя",
  low: "низкая",
};

export function filtersToParams(
  f: Filters,
  query: string,
  openItem: number | null,
  present: boolean,
): URLSearchParams {
  const p = new URLSearchParams();
  if (openItem !== null) p.set("item", String(openItem));
  if (query.trim()) p.set("q", query.trim());
  if (f.ind) p.set("ind", f.ind);
  if (f.verdict) p.set("v", f.verdict);
  if (f.group) p.set("g", f.group);
  if (f.ri) p.set("ri", String(f.ri));
  if (f.ii) p.set("ii", String(f.ii));
  if (f.priority) p.set("p", f.priority);
  if (f.problem) p.set("prob", f.problem);
  if (f.bench) p.set("an", f.bench);
  if (f.ev) p.set("ev", EV_TO_URL[f.ev]);
  if (present) p.set("mode", "present");
  return p;
}

const VERDICTS: Verdict[] = [
  "keep",
  "improve",
  "rewrite",
  "merge",
  "remove",
  "conditional",
  "fill-new",
];

const GROUPS: ResponsibleGroup[] = ["ministry", "agency", "digital", "none"];
const PRIORITIES: Priority[] = ["critical", "high", "medium", "low"];
const BENCH: BenchFilter[] = ["ru", "intl", "none"];

function oneOf<T extends string>(value: string | null, allowed: T[]): T | null {
  return value !== null && (allowed as string[]).includes(value)
    ? (value as T)
    : null;
}

function impact(value: string | null): number | null {
  const n = value === null ? NaN : Number(value);
  return n === 1 || n === 2 || n === 3 ? n : null;
}

export function paramsToState(search: string): {
  filters: Filters;
  query: string;
  openItem: number | null;
  present: boolean;
} {
  const p = new URLSearchParams(search);
  const itemRaw = Number(p.get("item"));
  const openItem =
    Number.isInteger(itemRaw) && itemRaw >= 1 && itemRaw <= 43 ? itemRaw : null;
  return {
    filters: {
      ind: p.get("ind"),
      verdict: oneOf(p.get("v"), VERDICTS),
      group: oneOf(p.get("g"), GROUPS),
      ri: impact(p.get("ri")),
      ii: impact(p.get("ii")),
      priority: oneOf(p.get("p"), PRIORITIES),
      problem: p.get("prob"),
      bench: oneOf(p.get("an"), BENCH),
      ev: EV_FROM_URL[p.get("ev") ?? ""] ?? null,
    },
    query: p.get("q") ?? "",
    openItem,
    present: p.get("mode") === "present",
  };
}
