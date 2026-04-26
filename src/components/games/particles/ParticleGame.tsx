"use client";

import { useEffect, useRef, useState } from "react";
import { ParticleEngine } from "@/lib/particles/engine";
import {
  DEFAULT_POSITION_SEED,
  PRESET_CAROUSEL,
  SPECIES_COLORS_6,
  mulberry32,
} from "@/lib/particles/presets";
import { WebGLRenderer } from "@/lib/particles/renderer-webgl";

// ─────────────────────────────────────────────────────────────────
// ParticleGame — full shell: aspect-ratio canvas box, controls,
// click-to-impulse. Owns its own layout so the parent only needs
// to provide width.
// ─────────────────────────────────────────────────────────────────

interface ParticleGameProps {
  // Particle count. If omitted, picks 4500 (desktop) / 1500 (mobile).
  count?: number;
  // Interaction radius in actual canvas pixels.
  interactionRadius?: number;
  // Force matrix range scaler (used by "Новая вселенная" randomisation).
  randomiseStrength?: number;
}

const DESKTOP_COUNT = 4500;
const MOBILE_COUNT = 1500;
const INTERACTION_RADIUS = 80;
// Beta is the close-range repulsion zone (relative to interactionRadius).
// Wider beta = more "personal space" between particles = less violent
// scattering when neighbours land too close.
const BETA = 0.38;
// Damping is multiplicative per step. 0.70 damps out 30% of velocity each
// step — fluid but not gummy. Higher (0.85+) lets ballistic energy build
// up across many steps and particles teleport across the world.
const DAMPING = 0.70;
// forceScale × dt = per-step velocity contribution per unit force.
// At forceScale=1500, dt=1/60: a max-force (1.0) particle gains ~25 px/s
// per second of acceleration, which damping then bounds. Higher values
// run away into chaos.
const FORCE_SCALE = 1500;
// Hard velocity cap (canvas pixels per step). Wide enough to give clicks
// real visual punch (an explosion needs to *look* explosive) but still
// finite so close-range repulsion can't compound into ballistic streaks.
const MAX_VEL_PER_STEP = 110;
const FIXED_DT = 1 / 60;
// Click impulse settings — explosions need to fling particles visibly
// across a chunk of the screen. With strength 260 the affected particles
// land on the velocity cap and ride it down through damping over ~10
// frames, producing a visible blast wave.
const IMPULSE_RADIUS = 220;
const IMPULSE_STRENGTH = 260;
// Shift+click pulls particles inward with extra tangential swirl so
// they spiral into the click point instead of falling straight in.
const ATTRACT_RADIUS = 240;
const ATTRACT_STRENGTH = 180;
const ATTRACT_SWIRL = 0.55;

export function ParticleGame({
  count,
  interactionRadius = INTERACTION_RADIUS,
  randomiseStrength = 0.55,
}: ParticleGameProps) {
  const canvasBoxRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<ParticleEngine | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ count: 0, fps: 0 });
  // Bumped when user hits "Новая вселенная" so we know to re-randomise
  // both the matrix and positions inside the next frame loop.
  const [universeRev, setUniverseRev] = useState(0);

  // ─── Mount ────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    const box = canvasBoxRef.current;
    if (!canvas || !box) return;

    const isNarrow = window.innerWidth < 768;
    const effCount = count ?? (isNarrow ? MOBILE_COUNT : DESKTOP_COUNT);

    // Pick an initial canvas pixel size based on the box's CSS rect
    // and DPR. The engine's worldW/H matches the canvas pixel size, so
    // when we resize we have to either rebuild the engine or rescale
    // particle positions. For v1 we accept the rebuild cost on resize —
    // it's a cold-path event, and the curated initial state is fine to
    // re-seed.
    const dprCap = isNarrow ? 1.5 : 2;
    const initRect = box.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
    const initW = Math.max(1, Math.floor(initRect.width * dpr));
    const initH = Math.max(1, Math.floor(initRect.height * dpr));
    canvas.width = initW;
    canvas.height = initH;

    // Build the engine.
    const engine = new ParticleEngine({
      count: effCount,
      speciesCount: PRESET_CAROUSEL.speciesCount,
      worldW: initW,
      worldH: initH,
      interactionRadius,
      beta: BETA,
      damping: DAMPING,
      forceScale: FORCE_SCALE,
      maxVelocity: MAX_VEL_PER_STEP,
      topology: "torus",
    });
    engineRef.current = engine;

    // Curated default ecosystem: PRESET_CAROUSEL matrix + seeded RNG.
    seedDefaultEcosystem(engine);

    // Renderer.
    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer(canvas, {
        speciesColors: SPECIES_COLORS_6,
        // Radius in actual canvas pixels. With DPR up to 2 on the canvas
        // backing store, 5 px ≈ 2.5 CSS-px radius — small but legible.
        particleRadius: isNarrow ? 4.0 : 5.5,
        bloomRadius: isNarrow ? 10 : 14,
        // Slower trail decay so motion reads as a smooth track rather
        // than discrete frames stacking on top of each other.
        trailDecayPerSecond: 0.18,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      return;
    }
    renderer.resize(initW, initH);

    // Resize handling.
    let pendingResize = true;
    let lastResizeAt = performance.now();
    const observer = new ResizeObserver(() => {
      pendingResize = true;
      lastResizeAt = performance.now();
    });
    observer.observe(box);

    const applyResize = (now: number) => {
      // Debounce: only reshape after 150 ms of stillness, otherwise the
      // engine gets rebuilt on every browser-window-drag frame.
      if (!pendingResize) return;
      if (now - lastResizeAt < 150) return;
      pendingResize = false;
      const rect = box.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width * dpr));
      const h = Math.max(1, Math.floor(rect.height * dpr));
      if (w === canvas.width && h === canvas.height) return;
      canvas.width = w;
      canvas.height = h;
      renderer.resize(w, h);
      // Rescale particle positions proportionally so the ecosystem
      // doesn't get nuked when the user resizes the window.
      const sx = w / engine.worldW;
      const sy = h / engine.worldH;
      for (let i = 0; i < engine.count; i++) {
        engine.posX[i] *= sx;
        engine.posY[i] *= sy;
      }
      engine.worldW = w;
      engine.worldH = h;
      // The bucket grid is sized in the constructor; for v1 we tolerate
      // it staying the same (the spatial index just becomes slightly off
      // in cell-count, still correct).
    };

    // Loop.
    let raf = 0;
    let mounted = true;
    let fpsFrames = 0;
    let fpsWindowStart = performance.now();
    let prevUniverseRev = -1;

    const frame = (now: number) => {
      if (!mounted) return;
      raf = requestAnimationFrame(frame);

      applyResize(now);

      // Re-seed if the user hit "Новая вселенная" since last frame.
      if (universeRevRef.current !== prevUniverseRev) {
        prevUniverseRev = universeRevRef.current;
        if (prevUniverseRev > 0) {
          // User-triggered randomisation: fresh matrix + fresh positions
          // with non-deterministic RNG.
          engine.randomizeMatrix(randomiseStrength);
          engine.randomizePositions();
        }
      }

      engine.step(FIXED_DT);
      renderer.uploadParticles(engine.snapshot());
      renderer.render(engine.snapshot());

      fpsFrames++;
      const dtWin = now - fpsWindowStart;
      if (dtWin >= 500) {
        const fps = Math.round((fpsFrames * 1000) / dtWin);
        fpsFrames = 0;
        fpsWindowStart = now;
        setStats({ count: engine.count, fps });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, interactionRadius, randomiseStrength]);

  // We use a ref to communicate the universe revision into the RAF loop
  // without re-running the whole effect.
  const universeRevRef = useRef(0);
  useEffect(() => {
    universeRevRef.current = universeRev;
  }, [universeRev]);

  // ─── Player interventions ────────────────────────────────────────
  const handleNewUniverse = () => setUniverseRev((r) => r + 1);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const engine = engineRef.current;
    const canvas = canvasRef.current;
    if (!engine || !canvas) return;
    const rect = canvas.getBoundingClientRect();
    const localX = (e.clientX - rect.left) / rect.width;
    const localY = (e.clientY - rect.top) / rect.height;
    const wx = localX * engine.worldW;
    const wy = localY * engine.worldH;
    // Shift+click pulls inward with swirl (vortex); plain click pushes outward.
    if (e.shiftKey) {
      engine.attract(wx, wy, ATTRACT_RADIUS, ATTRACT_STRENGTH, ATTRACT_SWIRL);
    } else {
      engine.impulse(wx, wy, IMPULSE_RADIUS, IMPULSE_STRENGTH);
    }
  };

  return (
    <div>
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
            </div>
          </div>
        ) : (
          <StatsOverlay stats={stats} />
        )}
      </div>

      {!error && (
        <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <NewUniverseButton onClick={handleNewUniverse} />
          <p
            className="eyebrow"
            style={{ color: "var(--ink-3)", letterSpacing: "0.18em" }}
          >
            Клик — взрыв · Shift+клик — притяжение
          </p>
        </div>
      )}
    </div>
  );
}

function seedDefaultEcosystem(engine: ParticleEngine): void {
  // Curated matrix.
  engine.setMatrix(PRESET_CAROUSEL.matrix);
  // Deterministic position seed so first-impression is consistent
  // across loads — we picked this seed as a known-good distribution.
  const rng = mulberry32(DEFAULT_POSITION_SEED);
  engine.randomizePositions(rng);
}

function StatsOverlay({
  stats,
}: {
  stats: { count: number; fps: number };
}) {
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
      <span>N {stats.count.toString().padStart(5, "0")}</span>
      <span style={{ marginLeft: "auto" }}>{stats.fps} fps</span>
    </div>
  );
}

function NewUniverseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "12px 20px",
        fontFamily: "var(--font-mono)",
        fontSize: 12,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color: "var(--ink)",
        background: "transparent",
        border: "1px solid var(--ink)",
        borderRadius: 2,
        cursor: "pointer",
        transition:
          "color var(--dur-2) var(--ease-out), border-color var(--dur-2) var(--ease-out)",
        minWidth: 240,
      }}
    >
      <span style={{ display: "inline-flex", gap: 10, alignItems: "center" }}>
        <span aria-hidden style={{ color: "var(--cobalt)", fontSize: 14 }}>◉</span>
        Новая вселенная
      </span>
    </button>
  );
}
