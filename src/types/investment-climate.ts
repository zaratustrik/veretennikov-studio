/**
 * Типы данных закрытой аналитической страницы
 * «Инвестиционный климат Свердловской области».
 *
 * Соответствуют фактической структуре JSON-модулей
 * `src/data/investment-climate/*.json` (сгенерированы скриптом из корпуса
 * _ANALIZ; см. docs/investment-climate-content-model.md).
 */

export type Verdict =
  | "keep" // сохранить / усилить
  | "improve" // уточнить / доработать
  | "rewrite" // переработать / переписать KPI
  | "merge" // объединить
  | "remove" // исключить / операционное
  | "conditional" // проверить необходимость
  | "fill-new"; // заполнить новым (строки 33–36)

export type Confidence =
  | "official"
  | "multi-source"
  | "analytical"
  | "hypothesis"
  | "insufficient";

/** Оценка доказательности в данных хранится русским словом. */
export type EvidenceGrade = "высокая" | "средняя" | "низкая";

export type ResponsibleGroup = "ministry" | "agency" | "digital" | "none";

export type InfluencePotential = "high" | "medium" | "low" | "unproven";

export type Priority = "critical" | "high" | "medium" | "low";

export type ImpactScore = 1 | 2 | 3;

export type RoadmapItem = {
  id: number; // 1..43
  indicatorCode: string; // "3.1.1"
  indicatorName: string;
  baselineRating: string; // "4,58(D)"
  targetRating: string; // "4,71(С)"
  criterion: string;
  originalActivity: string; // "" для незаполненных строк 33–36
  originalKpi: string;
  period: { start: string | null; end: string | null };
  responsible: string[];
  responsibleGroup: ResponsibleGroup;
  verdict: Verdict;
  verdictLabel: string; // русская формулировка вердикта
  influencePotential: InfluencePotential;
  ratingImpact: ImpactScore;
  investorImpact: ImpactScore;
  priority: Priority;
  issues: string[]; // id проблем из problems.json
  defect: string | null; // "D-01".."D-07" — дефект первоисточника
  analysis: {
    why: string;
    problem: string;
    causalGap: string;
    formalRisk: string;
  };
  proposed: {
    activity: string;
    kpiName: string;
    baseline: string;
    target: string;
    formula: string;
    dataSource: string;
    owner: string;
    stopCriterion: string;
  };
  benchmarkIds: string[];
  sourceIds: string[];
  confidence: Confidence;
  evidenceGrade: EvidenceGrade;
  searchText: string; // подготовленный индекс для клиентского поиска
};

export type PracticeScope = "ru" | "intl";

export type Applicability =
  | "direct"
  | "needs-legal"
  | "principle"
  | "not-transferable";

export type Practice = {
  id: string; // "intl-kr-ombudsman", "ru-mo-css"
  scope: PracticeScope;
  functionGroup: string; // "one-stop" | "crm" | "sites" | ...
  jurisdiction: string;
  organization: string;
  title: string;
  mechanism: string;
  provenResult: string;
  resultStatus: "confirmed" | "claimed";
  applicability: Applicability;
  applicabilityNote: string;
  limitations?: string;
  sourceIds: string[];
};

export type SourceCategory =
  | "federal"
  | "regional"
  | "rating"
  | "stats"
  | "research"
  | "ru-practice"
  | "intl-practice"
  | "legal"
  | "service";

export type SourceRef = {
  id: string; // "SRC-03", "REG-04", "B-KR"...
  title: string;
  organization: string;
  date: string;
  accessed: string;
  category: SourceCategory;
  url: string | null;
  note?: string;
  verified: boolean; // false → показывать как неподтверждённый
};

export type Problem = {
  id: string;
  title: string;
  description: string;
  itemIds: number[];
};

export type JourneyStage = {
  id: string;
  title: string;
  services: string[];
  gaps: string[];
  itemIds: number[];
  proposals: string[];
  kpi?: string;
};

export type SummaryFinding = {
  id: string;
  thesis: string;
  explanation: string;
  significance: "critical" | "high" | "medium";
  anchor: string;
};

export type SummaryPriority = {
  n: number;
  title: string;
  effect: string;
  term: string;
  cost: string;
};

export type SummaryData = {
  findings: SummaryFinding[];
  priorities: SummaryPriority[];
};

export type NewRoadmapRow = {
  id: string; // "A1".."Д4"
  block: string; // "A" | "Б" | "В" | "Г" | "Д"
  blockTitle: string;
  title: string;
  fromItems: number[];
  outcomeKpi: string;
  horizon: string; // "0-3" | "3-6" | "6-12" | "12-24" | смешанные "0-6", "3-12"
};

export type MetaIndicator = {
  code: string;
  name: string;
  so: number; // оценка Свердловской области
  soGroup: string;
  target: number;
  targetGroup: string;
  rfAvg: number | null;
  rows: string;
};

export type MetaData = {
  title: string;
  subtitle: string;
  status: string;
  dataDate: string;
  period: string;
  counters: {
    items: number;
    documents: number;
    ruPractices: number;
    intlPractices: number;
    proposals: number;
  };
  rating: {
    y2024: number;
    y2025: number;
    y2026: number;
    sources: string[];
  };
  indicators: MetaIndicator[];
  dataCaveats: string[];
  verdictStats: Record<string, number>;
};

/** Полный набор данных, передаваемый server-компонентом клиентскому корню. */
export type InvestClimateData = {
  meta: MetaData;
  items: RoadmapItem[];
  problems: Problem[];
  journey: JourneyStage[];
  summary: SummaryData;
  newRoadmap: NewRoadmapRow[];
  practices: Practice[];
  sources: SourceRef[];
};
