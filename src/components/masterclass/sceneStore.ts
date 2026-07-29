/**
 * Быстрое состояние сцены вне React render-loop.
 * GSAP пишет сюда на каждом тике, three.js читает в useFrame —
 * без setState на кадр (см. ТЗ §8.1).
 */
export type CanvasStateId = "hero" | "dimmed";

export const sceneStore = {
  /** 0..1 — прогресс прокрутки hero-сцены */
  heroProgress: 0,
  /** 0..1 — глобальное затухание canvas после hero */
  fade: 1,
  canvasState: "hero" as CanvasStateId,
};
