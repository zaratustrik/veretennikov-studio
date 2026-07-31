# Investment Climate Web — Этап 3: контентная модель

Дата: 01.08.2026. Данные собираются скриптом из корпуса `_ANALIZ` (не переписываются руками) в JSON-модули `src/data/investment-climate/`.

## 1. Типы (src/types/investment-climate.ts)

```ts
export type Verdict =
  | "keep"          // сохранить/усилить
  | "improve"       // уточнить/доработать
  | "rewrite"       // переработать/переписать KPI
  | "merge"         // объединить
  | "remove"        // исключить/операционное
  | "conditional"   // проверить необходимость
  | "fill-new";     // заполнить новым (33–36)

export type Confidence = "official" | "multi-source" | "analytical" | "hypothesis" | "insufficient";

export type RoadmapItem = {
  id: number;                   // 1..43
  indicatorCode: string;        // "3.1.1"
  indicatorName: string;
  baselineRating: string;       // "4,58 (D)"
  targetRating: string;         // "4,71 (C)"
  criterion: string;
  originalActivity: string;     // полный текст из DOCX ("" для 33–36)
  originalKpi: string;
  period: { start?: string; end?: string };
  responsible: string[];
  responsibleGroup: "ministry" | "agency" | "digital" | "none";
  verdict: Verdict;
  verdictLabel: string;         // русская формулировка вердикта
  influencePotential: "high" | "medium" | "low" | "unproven";
  ratingImpact: 1 | 2 | 3;      // производное от influencePotential
  investorImpact: 1 | 2 | 3;
  priority: "critical" | "high" | "medium" | "low";
  issues: string[];             // id проблем из problems.json
  defect?: string;              // "D-01".."D-07" если дефект первоисточника
  analysis: {
    why: string;                // «Почему» из карточки 05
    problem: string;            // подтверждённая проблема
    causalGap: string;          // разрыв цепочки
    formalRisk: string;         // риск формального исполнения
  };
  impactNotes: { rating: string; investor: string; timeline?: string; admin?: string; transparency?: string };
  proposed: {
    activity: string;
    kpiName: string;
    baseline: string;
    target: string;
    formula: string;
    dataSource: string;
    frequency?: string;
    owner: string;
    stopCriterion: string;
    dependencies?: string;
  };
  benchmarkIds: string[];
  sourceIds: string[];
  confidence: Confidence;
  evidenceGrade: string;        // "A" | "A/B" | "B" | "C"
  newRoadmapRef?: string;       // "A1".."Д4", "Г8" и т.п.
  searchText: string;           // конкатенация для поиска (lowercase)
};

export type Practice = {
  id: string;                   // "intl-kr-ombudsman", "ru-mo-css"
  scope: "ru" | "intl";
  functionGroup: string;        // "one-stop" | "crm" | "sites" | "geodata" | "permits" | "utilities" | "aftercare" | "disputes" | "sla" | ...
  jurisdiction: string;         // «Южная Корея», «Московская область»
  organization: string;
  title: string;
  mechanism: string;
  provenResult: string;
  resultStatus: "confirmed" | "claimed";   // подтверждено/заявлено
  applicability: "direct" | "needs-legal" | "principle" | "not-transferable";
  applicabilityNote: string;
  limitations?: string;
  sourceIds: string[];
};

export type SourceRef = {
  id: string;                   // "SRC-03", "REG-04", "C-25"...
  title: string;
  organization: string;
  date: string;
  accessed: string;             // дата доступа
  category: "federal" | "regional" | "rating" | "stats" | "research" | "ru-practice" | "intl-practice" | "legal" | "service";
  url?: string;
  note?: string;                // какой вывод подтверждает
  verified: boolean;            // false → показывать как неподтверждённый
};

export type Problem = { id: string; title: string; description: string; itemIds: number[] };
export type JourneyStage = { id: string; title: string; services: string[]; gaps: string[]; itemIds: number[]; proposals: string[]; kpi?: string };
export type Proposal = { id: string; level: "fast" | "system" | "digital"; title: string; problem: string; action: string; effect: string; owner: string; term: string; resource: string; kpi: string; itemIds: number[] };
export type SummaryFinding = { id: string; thesis: string; explanation: string; significance: "critical" | "high" | "medium"; anchor: string };
export type NewRoadmapRow = { id: string; block: string; blockTitle: string; title: string; fromItems: number[]; outcomeKpi: string; horizon: "0-3" | "3-6" | "6-12" | "12-24" };
```

## 2. Файлы данных (генерируются скриптом `scripts/build-invest-climate-data.py` в _ANALIZ, результат коммитится)

| Файл | Источник | Записей |
|---|---|---|
| `items.json` | roadmap_rows.json + 07_revised_roadmap.csv + preliminary_assessments.json + карточки 05 (парсинг секций по «### Строка N») | 43 |
| `practices.json` | 10_benchmark_practices.md + raw_benchmark/01–06 (курируемая выжимка) | ~55 |
| `sources.json` | source_claims.csv + 20_source_index.md + meta/*.json | ~70 |
| `problems.json` | сводка 05 + 04_ris_maturity (курируемо) | 10 |
| `journey.json` | 04_ris_maturity + audit_journal (курируемо) | 12 |
| `proposals.json` | 08_new_measures + 15/16_implementation + 13_legal | ~37 |
| `summary.json` | 00_executive_summary (курируемо) | 7 выводов + 7 приоритетов |
| `newRoadmap.json` | 06_revised_roadmap.md | 30 |
| `meta.json` | счётчики титула, даты, статусы достоверности | 1 |

## 3. Правила данных

1. Скрипт валидирует: 43 items, обязательные поля non-empty (кроме 33–36 original*), все benchmarkIds/sourceIds/issues резолвятся; отчёт валидации печатается при сборке.
2. Пустое поле → UI показывает «данных недостаточно» (серый статус), не скрывает молча.
3. `resultStatus: "claimed"` у практик рендерится бейджем «заявлено организацией».
4. Тексты — как в корпусе; сокращения только в списочных представлениях (полные — в карточке).
5. Обновление данных: правка в _ANALIZ → перезапуск скрипта → перегенерация JSON → commit (инструкция в README страницы).
```
