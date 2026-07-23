import type { Answers, BriefExportJson } from "@/types/karandash-brief";
import { BRIEF_SCHEMA_VERSION } from "@/types/karandash-brief";
import { stages, visionQuestions, questionStageMap } from "./questions";
import { answerToDisplay, completionPercent } from "./values";
import { buildSummary } from "./summary";

/** Формирует экспортируемый JSON со стабильными ключами и метаданными. */
export function buildExportJson(answers: Answers, exportedAtIso: string): BriefExportJson {
  const orderedQuestions = [...visionQuestions, ...stages.flatMap((s) => s.questions)];

  return {
    schemaVersion: BRIEF_SCHEMA_VERSION,
    exportedAt: exportedAtIso,
    completion: completionPercent(answers),
    summary: buildSummary(answers),
    answers: orderedQuestions.map((q) => {
      const stage = questionStageMap[q.id] ?? { stageId: "unknown", stageTitle: "" };
      return {
        stageId: stage.stageId,
        stageTitle: stage.stageTitle,
        questionId: q.id,
        label: q.label,
        value: answerToDisplay(q, answers[q.id])
      };
    })
  };
}
