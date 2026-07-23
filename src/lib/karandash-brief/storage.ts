import type { Answers, BriefDraft } from "@/types/karandash-brief";
import { BRIEF_SCHEMA_VERSION } from "@/types/karandash-brief";

const STORAGE_KEY = "karandash-brief-draft-v1";

/** Есть ли сохранённый черновик. */
export function hasDraft(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return Boolean(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return false;
  }
}

export function loadDraft(): BriefDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as BriefDraft;
    if (!parsed || typeof parsed !== "object" || typeof parsed.answers !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveDraft(answers: Answers, lastStageId?: string): BriefDraft | null {
  if (typeof window === "undefined") return null;
  const draft: BriefDraft = {
    schemaVersion: BRIEF_SCHEMA_VERSION,
    updatedAt: new Date().toISOString(),
    answers,
    lastStageId
  };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    return draft;
  } catch {
    return null;
  }
}

export function clearDraft(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* noop */
  }
}
