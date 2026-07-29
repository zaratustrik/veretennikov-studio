"use client";

/**
 * Тонкая обёртка над Яндекс.Метрикой сайта.
 * Содержимое пользовательских полей никогда не передаётся.
 * Счётчик инициализируется глобальным CookieConsent после согласия;
 * без согласия track() — no-op.
 */

let metrikaId: number | null = null;
const sent = new Set<string>();

export function initAnalytics(id?: string) {
  const n = Number(id);
  metrikaId = Number.isFinite(n) && n > 0 ? n : null;
}

type YM = (id: number, action: string, goal: string) => void;

export function track(goal: string, once = true) {
  if (once && sent.has(goal)) return;
  sent.add(goal);
  const ym = (window as unknown as { ym?: YM }).ym;
  if (metrikaId && typeof ym === "function") {
    try {
      ym(metrikaId, "reachGoal", goal);
    } catch {
      /* счётчик не готов — молча пропускаем */
    }
  }
}
