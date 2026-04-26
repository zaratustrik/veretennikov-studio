"use client";

import { useEffect, useRef, useState } from "react";
import { LifeEngine } from "@/lib/life/engine";
import { findPattern } from "@/lib/life/patterns";
import { WebGLRenderer } from "@/lib/life/renderer-webgl";

// ─────────────────────────────────────────────────────────────────
// LifeGame — full shell: aspect-ratio canvas box, stats overlay,
// intervention controls (epidemic button + canvas-click impulse).
// Owns its own layout so the parent only needs to provide width.
// ─────────────────────────────────────────────────────────────────

interface LifeGameProps {
  // Grid dimensions in cells. Aspect must match the canvas aspect
  // (set by CSS below) so cells render as discs, not ovals. If omitted,
  // values are picked from viewport width: 300×150 desktop / 180×180 mobile.
  gridWidth?: number;
  gridHeight?: number;
  ticksPerSecond?: number;
  initialPattern?: string;
  // Cooldown for the epidemic button, in milliseconds.
  epidemicCooldownMs?: number;
}

const IMPULSE_RADIUS = 5;
const IMPULSE_DENSITY = 0.6;
const EPIDEMIC_PERCENT = 0.05;

export function LifeGame({
  gridWidth,
  gridHeight,
  ticksPerSecond = 12,
  initialPattern = "r-pentomino",
  epidemicCooldownMs = 8000,
}: LifeGameProps) {
  const canvasBoxRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<LifeEngine | null>(null);
  // Effective grid size as decided at mount — used by the click handler
  // to convert canvas-relative coords back into engine-grid coords.
  const gridDimsRef = useRef<{ w: number; h: number }>({ w: 0, h: 0 });

  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    generation: 0,
    population: 0,
    infectedPopulation: 0,
    fps: 0,
  });
  const [cooldownEndsAt, setCooldownEndsAt] = useState(0);
  // Bumped by interval while a cooldown is active so the progress label
  // re-renders without anything else having to mark itself dirty.
  const [, setCooldownTick] = useState(0);

  // ─── Mount: engine + renderer + RAF loop ─────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    const box = canvasBoxRef.current;
    if (!canvas || !box) return;

    const isNarrow = window.innerWidth < 768;
    const effGridW = gridWidth ?? (isNarrow ? 180 : 300);
    const effGridH = gridHeight ?? (isNarrow ? 180 : 150);
    gridDimsRef.current = { w: effGridW, h: effGridH };

    const engine = new LifeEngine({ width: effGridW, height: effGridH });
    engineRef.current = engine;

    const pattern = findPattern(initialPattern);
    if (pattern) {
      const ox = Math.floor((effGridW - pattern.width) / 2);
      const oy = Math.floor((effGridH - pattern.height) / 2);
      engine.stamp(pattern.cells, pattern.width, pattern.height, ox, oy);
    } else {
      engine.randomize(0.3);
    }

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer(canvas, {
        bloomRadius: isNarrow ? 10 : 16,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      return;
    }
    renderer.setGridSize(effGridW, effGridH);

    let pendingResize = true;
    const dprCap = isNarrow ? 1.5 : 2;
    const observer = new ResizeObserver(() => {
      pendingResize = true;
    });
    observer.observe(box);

    const applyResize = () => {
      if (!pendingResize) return;
      pendingResize = false;
      const rect = box.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
      const w = Math.max(1, Math.floor(rect.width * dpr));
      const h = Math.max(1, Math.floor(rect.height * dpr));
      if (canvas.width !== w) canvas.width = w;
      if (canvas.height !== h) canvas.height = h;
      renderer.resize(w, h);
    };

    const tickIntervalMs = 1000 / ticksPerSecond;
    let lastTickAt = performance.now();
    let fpsFrames = 0;
    let fpsWindowStart = performance.now();
    let raf = 0;
    let mounted = true;

    const frame = (now: number) => {
      if (!mounted) return;
      raf = requestAnimationFrame(frame);
      applyResize();

      let stepsThisFrame = 0;
      while (now - lastTickAt >= tickIntervalMs && stepsThisFrame < 4) {
        engine.step();
        lastTickAt += tickIntervalMs;
        stepsThisFrame++;
      }
      if (now - lastTickAt > tickIntervalMs * 4) {
        lastTickAt = now;
      }

      const t = Math.max(0, Math.min(1, (now - lastTickAt) / tickIntervalMs));
      renderer.uploadState(engine.prev(), engine.curr());
      renderer.render(t);

      fpsFrames++;
      const dtWindow = now - fpsWindowStart;
      if (dtWindow >= 500) {
        const fps = Math.round((fpsFrames * 1000) / dtWindow);
        fpsFrames = 0;
        fpsWindowStart = now;
        setStats({
          generation: engine.generation,
          population: engine.population,
          infectedPopulation: engine.infectedPopulation,
          fps,
        });
      }
    };

    raf = requestAnimationFrame(frame);

    return () => {
      mounted = false;
      cancelAnimationFrame(raf);
      observer.disconnect();
      renderer.destroy();
      engineRef.current = null;
    };
  }, [gridWidth, gridHeight, ticksPerSecond, initialPattern]);

  // ─── Cooldown ticker ─────────────────────────────────────────────
  // While the cooldown is active, force re-renders at 4 Hz so the
  // progress label and bar update. We don't need the RAF cadence here
  // — 250 ms is well below human perception threshold for this UI.
  useEffect(() => {
    if (cooldownEndsAt <= Date.now()) return;
    const id = setInterval(() => setCooldownTick((t) => t + 1), 250);
    return () => clearInterval(id);
  }, [cooldownEndsAt]);

  // ─── Interventions ───────────────────────────────────────────────
  const triggerEpidemic = () => {
    const engine = engineRef.current;
    if (!engine) return;
    if (Date.now() < cooldownEndsAt) return;
    engine.infect(EPIDEMIC_PERCENT);
    setCooldownEndsAt(Date.now() + epidemicCooldownMs);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const engine = engineRef.current;
    const canvas = canvasRef.current;
    if (!engine || !canvas) return;
    const rect = canvas.getBoundingClientRect();
    const localX = e.clientX - rect.left;
    const localY = e.clientY - rect.top;
    const { w, h } = gridDimsRef.current;
    const gridX = Math.floor((localX / rect.width) * w);
    const gridY = Math.floor((localY / rect.height) * h);
    engine.impulse(gridX, gridY, IMPULSE_RADIUS, IMPULSE_DENSITY);
  };

  const now = Date.now();
  const remainingMs = Math.max(0, cooldownEndsAt - now);
  const onCooldown = remainingMs > 0;
  const cooldownProgress = onCooldown ? remainingMs / epidemicCooldownMs : 0;

  return (
    <div>
      {/* ── Canvas with aspect ratio and overlays ──────────────── */}
      <div
        ref={canvasBoxRef}
        className="relative w-full aspect-square md:aspect-[2/1]"
        style={{
          borderRadius: 2,
          overflow: "hidden",
          background: "var(--ink)",
          boxShadow:
            "0 1px 0 0 rgba(15, 26, 46, 0.04), 0 24px 48px -32px rgba(15, 26, 46, 0.45)",
        }}
      >
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            background: "var(--ink)",
            cursor: error ? "default" : "crosshair",
            // Vertical scroll passes through canvas swipes.
            touchAction: "pan-y",
          }}
        />
        {error ? (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "var(--s-6)",
              background: "var(--ink)",
              color: "var(--paper)",
              textAlign: "center",
            }}
          >
            <div style={{ maxWidth: 420 }}>
              <p className="eyebrow" style={{ color: "var(--ink-4)", marginBottom: "var(--s-3)" }}>
                WebGL2 недоступен
              </p>
              <p style={{ fontSize: "var(--fs-small)", lineHeight: 1.5, color: "var(--ink-4)" }}>
                {error}
              </p>
              <p style={{ fontSize: "var(--fs-small)", marginTop: "var(--s-4)", color: "var(--ink-4)" }}>
                Игра требует WebGL2. Попробуйте обновить браузер до текущей версии Chrome, Firefox, Safari или Edge.
              </p>
            </div>
          </div>
        ) : (
          <StatsOverlay stats={stats} />
        )}
      </div>

      {/* ── Controls strip ─────────────────────────────────────── */}
      {!error && (
        <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <EpidemicButton
            onClick={triggerEpidemic}
            onCooldown={onCooldown}
            cooldownProgress={cooldownProgress}
            remainingSeconds={Math.ceil(remainingMs / 1000)}
          />
          <p
            className="eyebrow"
            style={{ color: "var(--ink-3)", letterSpacing: "0.18em" }}
          >
            Клик по полю — импульс жизни
          </p>
        </div>
      )}
    </div>
  );
}

function StatsOverlay({
  stats,
}: {
  stats: { generation: number; population: number; infectedPopulation: number; fps: number };
}) {
  const showInfected = stats.infectedPopulation > 0;
  return (
    <div
      style={{
        position: "absolute",
        bottom: "var(--s-4)",
        left: "var(--s-4)",
        right: "var(--s-4)",
        display: "flex",
        gap: "var(--s-5)",
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "rgba(244, 241, 234, 0.55)",
        pointerEvents: "none",
      }}
    >
      <span>Gen {stats.generation.toString().padStart(5, "0")}</span>
      <span>Pop {stats.population.toString().padStart(5, "0")}</span>
      {showInfected && (
        <span style={{ color: "rgba(216, 68, 58, 0.85)" }}>
          Inf {stats.infectedPopulation.toString().padStart(4, "0")}
        </span>
      )}
      <span style={{ marginLeft: "auto" }}>{stats.fps} fps</span>
    </div>
  );
}

function EpidemicButton({
  onClick,
  onCooldown,
  cooldownProgress,
  remainingSeconds,
}: {
  onClick: () => void;
  onCooldown: boolean;
  cooldownProgress: number; // 0..1, 1 = full cooldown remaining
  remainingSeconds: number;
}) {
  const label = onCooldown ? `Восстановление · ${remainingSeconds}s` : "Вызвать эпидемию";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={onCooldown}
      aria-label={label}
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "12px 20px",
        fontFamily: "var(--font-mono)",
        fontSize: 12,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color: onCooldown ? "var(--ink-3)" : "var(--ink)",
        background: "transparent",
        border: `1px solid ${onCooldown ? "var(--rule)" : "var(--ink)"}`,
        borderRadius: 2,
        cursor: onCooldown ? "default" : "pointer",
        transition: "color var(--dur-2) var(--ease-out), border-color var(--dur-2) var(--ease-out)",
        minWidth: 240,
      }}
    >
      <span style={{ position: "relative", zIndex: 1, display: "inline-flex", gap: 10, alignItems: "center" }}>
        <span aria-hidden style={{ color: onCooldown ? "var(--ink-4)" : "#D8443A", fontSize: 14 }}>✱</span>
        {label}
      </span>
      {/* Cooldown bar — recedes from full to empty as cooldown elapses. */}
      {onCooldown && (
        <span
          aria-hidden
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: `${cooldownProgress * 100}%`,
            background: "var(--paper-2)",
            transformOrigin: "left",
            transition: "width 250ms linear",
            zIndex: 0,
          }}
        />
      )}
    </button>
  );
}
