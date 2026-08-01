import { cookies } from "next/headers";

import { InvestClimateApp } from "@/components/invest-climate/InvestClimateApp";
import type {
  InvestClimateData,
  JourneyStage,
  MapAuditData,
  MetaData,
  NewRoadmapRow,
  Practice,
  Problem,
  RoadmapItem,
  SourceRef,
  SummaryData,
} from "@/types/investment-climate";

import itemsJson from "@/data/investment-climate/items.json";
import journeyJson from "@/data/investment-climate/journey.json";
import mapAuditJson from "@/data/investment-climate/mapAudit.json";
import metaJson from "@/data/investment-climate/meta.json";
import newRoadmapJson from "@/data/investment-climate/newRoadmap.json";
import practicesJson from "@/data/investment-climate/practices.json";
import problemsJson from "@/data/investment-climate/problems.json";
import sourcesJson from "@/data/investment-climate/sources.json";
import summaryJson from "@/data/investment-climate/summary.json";

import { GateNotConfigured, PasswordGate } from "./PasswordGate";
import { IC_AUTH_COOKIE, isAuthorized } from "./gate";

// Данные типизируем через unknown: JSON-модули инференциируются как широкие
// строки, фактическая структура проверена генератором данных.
const data: InvestClimateData = {
  meta: metaJson as unknown as MetaData,
  items: itemsJson as unknown as RoadmapItem[],
  problems: problemsJson as unknown as Problem[],
  journey: journeyJson as unknown as JourneyStage[],
  summary: summaryJson as unknown as SummaryData,
  newRoadmap: newRoadmapJson as unknown as NewRoadmapRow[],
  practices: practicesJson as unknown as Practice[],
  sources: sourcesJson as unknown as SourceRef[],
  mapAudit: mapAuditJson as unknown as MapAuditData,
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

/** Сериализация searchParams для возврата на deep link после входа. */
function serializeSearchParams(
  sp: Record<string, string | string[] | undefined>,
): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(sp)) {
    if (typeof value === "string") params.set(key, value);
    else if (Array.isArray(value) && value.length > 0) params.set(key, value[0]);
  }
  return params.toString();
}

export default async function InvestClimatePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const secret = process.env.INVEST_CLIMATE_PASSWORD;

  // Пароль не настроен → понятная заглушка, входа нет.
  if (!secret) return <GateNotConfigured />;

  const store = await cookies();
  const authed = isAuthorized(store.get(IC_AUTH_COOKIE)?.value, secret);
  if (!authed) return <PasswordGate query={serializeSearchParams(sp)} />;

  return <InvestClimateApp data={data} />;
}
