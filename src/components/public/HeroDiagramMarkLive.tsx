"use client";

import { useReducedMotion } from "framer-motion";
import { useRef, useState, useCallback } from "react";

/**
 * Living hero diagram-mark — engineering schematic that stays alive.
 *
 * Concept (unchanged): СИСТЕМА + ИСТОРИЯ → СИНТЕЗ → РЕЗУЛЬТАТ.
 *
 * What makes it "living" vs the old static schematic:
 *  - Continuous, dense particle STREAMS along all three conduits (not 2 sparse
 *    dots). Inputs flow in muted ink (raw), the synthesis→result conduit flows
 *    in cobalt (refined output) — the motion itself tells the story.
 *  - Drifting energy dashes on the conduits, breathing source nodes.
 *  - Subtle cursor parallax (fine-pointer only), giving depth.
 *
 * All motion is CSS (offset-path) + one cheap pointer transform. Respects
 * prefers-reduced-motion (renders a still, fully-drawn diagram).
 */

const PATH_A = "M 132 135 L 175 218"; // СИСТЕМА → СИНТЕЗ
const PATH_B = "M 228 135 L 185 218"; // ИСТОРИЯ → СИНТЕЗ
const PATH_C = "M 180 298 L 180 338"; // СИНТЕЗ → РЕЗУЛЬТАТ

// Build evenly-staggered particle instances for a conduit.
function stream(
  path: string,
  count: number,
  dur: number,
  r: number,
  fill: string,
) {
  return Array.from({ length: count }, (_, i) => ({
    style: {
      offsetPath: `path("${path}")`,
      offsetRotate: "0deg",
      animation: `heroFlow ${dur}s linear ${((dur / count) * i).toFixed(2)}s infinite`,
      opacity: 0,
    } as React.CSSProperties,
    r,
    fill,
  }));
}

const PARTICLES = [
  ...stream(PATH_A, 4, 2.2, 2, "var(--ink-3)"),
  ...stream(PATH_B, 4, 2.2, 2, "var(--ink-3)"),
  ...stream(PATH_C, 3, 1.7, 2.5, "var(--cobalt)"),
];

export default function HeroDiagramMarkLive() {
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const onMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (reduce || e.pointerType !== "mouse") return;
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      // -1..1 relative to centre
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setTilt({ x, y });
    },
    [reduce],
  );

  const onLeave = useCallback(() => setTilt({ x: 0, y: 0 }), []);

  const transform = reduce
    ? undefined
    : `perspective(900px) rotateY(${tilt.x * 3}deg) rotateX(${-tilt.y * 3}deg) translate3d(${tilt.x * 7}px, ${tilt.y * 7}px, 0)`;

  return (
    <div
      ref={wrapRef}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ width: "100%", maxWidth: 360, marginInline: "auto" }}
    >
      <div
        style={{
          transform,
          transition: "transform 380ms cubic-bezier(0.2, 0.7, 0.2, 1)",
          willChange: "transform",
        }}
      >
        <svg
          viewBox="0 0 360 460"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: "100%", height: "auto", display: "block" }}
          role="img"
          aria-label="Схема студии: Система плюс История равно Синтез, Результат"
        >
          <defs>
            <pattern id="gridL" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="0" cy="0" r="0.5" fill="var(--ink-4)" opacity="0.5" />
            </pattern>
            <clipPath id="synthesisClipL">
              <rect x="100" y="222" width="160" height="76" />
            </clipPath>
          </defs>

          {/* Frame */}
          <rect x="40" y="40" width="280" height="380" fill="url(#gridL)" opacity="0.4" />
          <rect x="40" y="40" width="280" height="380" stroke="var(--ink-4)" strokeWidth="1" />

          {[[40, 40], [320, 40], [40, 420], [320, 420]].map(([x, y]) => (
            <g key={`reg-${x}-${y}`}>
              <line x1={x - 6} y1={y} x2={x + 6} y2={y} stroke="var(--ink-3)" strokeWidth="1" />
              <line x1={x} y1={y - 6} x2={x} y2={y + 6} stroke="var(--ink-3)" strokeWidth="1" />
            </g>
          ))}

          <text x="44" y="58" fill="var(--ink-3)" fontSize="8" fontFamily="var(--font-mono)" letterSpacing="0.1em" fontWeight="500">
            FIG.01
          </text>

          <g>
            <circle cx="294" cy="55" r="2.5" fill="var(--cobalt)" className="diagram-live" />
            <text x="304" y="58" fill="var(--ink-3)" fontSize="8" fontFamily="var(--font-mono)" letterSpacing="0.12em" fontWeight="500">
              LIVE
            </text>
          </g>

          {[78, 142, 222, 298, 338, 382].map((y, i) => (
            <line key={`tick-${i}`} x1="36" y1={y} x2="40" y2={y} stroke="var(--ink-4)" strokeWidth="1" />
          ))}

          <text x="20" y="114" textAnchor="middle" fill="var(--ink-4)" fontSize="7" fontFamily="var(--font-mono)" letterSpacing="0.05em" transform="rotate(-90 20 114)">
            SOURCE
          </text>
          <text x="20" y="262" textAnchor="middle" fill="var(--ink-4)" fontSize="7" fontFamily="var(--font-mono)" letterSpacing="0.05em" transform="rotate(-90 20 262)">
            PROCESS
          </text>
          <text x="20" y="362" textAnchor="middle" fill="var(--ink-4)" fontSize="7" fontFamily="var(--font-mono)" letterSpacing="0.05em" transform="rotate(-90 20 362)">
            OUTPUT
          </text>

          {/* СИСТЕМА node */}
          <g className="diagram-node" style={{ animationDelay: "0.2s" }}>
            <circle cx="110" cy="110" r="32" stroke="var(--ink-2)" strokeWidth="1.4" fill="var(--paper)" className="hero-breathe" />
            <circle cx="110" cy="100" r="2" fill="var(--ink-2)" />
            <circle cx="101" cy="116" r="2" fill="var(--ink-2)" />
            <circle cx="119" cy="116" r="2" fill="var(--ink-2)" />
            <line x1="110" y1="100" x2="101" y2="116" stroke="var(--ink-3)" strokeWidth="0.8" />
            <line x1="110" y1="100" x2="119" y2="116" stroke="var(--ink-3)" strokeWidth="0.8" />
            <line x1="101" y1="116" x2="119" y2="116" stroke="var(--ink-3)" strokeWidth="0.8" />
            <text x="110" y="158" textAnchor="middle" fill="var(--ink-2)" fontSize="10" fontFamily="var(--font-mono)" letterSpacing="0.15em" fontWeight="500">
              СИСТЕМА
            </text>
            <text x="110" y="172" textAnchor="middle" fill="var(--ink-3)" fontSize="8" fontFamily="var(--font-mono)" letterSpacing="0.08em">
              /01
            </text>
          </g>

          {/* ИСТОРИЯ node */}
          <g className="diagram-node" style={{ animationDelay: "0.35s" }}>
            <circle cx="250" cy="110" r="32" stroke="var(--ink-2)" strokeWidth="1.4" fill="var(--paper)" className="hero-breathe" style={{ animationDelay: "1.4s" }} />
            <line x1="240" y1="103" x2="262" y2="103" stroke="var(--ink-2)" strokeWidth="1" />
            <line x1="240" y1="110" x2="258" y2="110" stroke="var(--ink-2)" strokeWidth="1" />
            <line x1="240" y1="117" x2="254" y2="117" stroke="var(--ink-2)" strokeWidth="1" />
            <text x="250" y="158" textAnchor="middle" fill="var(--ink-2)" fontSize="10" fontFamily="var(--font-mono)" letterSpacing="0.15em" fontWeight="500">
              ИСТОРИЯ
            </text>
            <text x="250" y="172" textAnchor="middle" fill="var(--ink-3)" fontSize="8" fontFamily="var(--font-mono)" letterSpacing="0.08em">
              /02
            </text>
          </g>

          {/* Connecting conduits source → synthesis (drawn once, then energy-dash) */}
          <line x1="132" y1="135" x2="175" y2="218" stroke="var(--ink-3)" strokeWidth="1.2" className="diagram-line" style={{ "--len": "92px", animationDelay: "0.5s" } as React.CSSProperties} />
          <line x1="228" y1="135" x2="185" y2="218" stroke="var(--ink-3)" strokeWidth="1.2" className="diagram-line" style={{ "--len": "92px", animationDelay: "0.5s" } as React.CSSProperties} />
          {/* drifting energy overlay */}
          <line x1="132" y1="135" x2="175" y2="218" stroke="var(--cobalt)" strokeWidth="1" className="hero-conduit" opacity="0.5" />
          <line x1="228" y1="135" x2="185" y2="218" stroke="var(--cobalt)" strokeWidth="1" className="hero-conduit" opacity="0.5" style={{ animationDelay: "0.8s" }} />

          <text x="180" y="200" textAnchor="middle" fill="var(--ink-3)" fontSize="13" fontFamily="var(--font-display)">
            +
          </text>

          {/* СИНТЕЗ box */}
          <g className="diagram-node" style={{ animationDelay: "0.85s" }}>
            <rect x="100" y="222" width="160" height="76" stroke="var(--ink)" strokeWidth="1.4" fill="var(--paper)" />
            <circle cx="124" cy="244" r="3" fill="var(--ink-2)" />
            <circle cx="124" cy="244" r="6" stroke="var(--ink-3)" strokeWidth="0.8" fill="none" />
            <circle cx="236" cy="244" r="3" fill="var(--ink-2)" />
            <circle cx="236" cy="244" r="6" stroke="var(--ink-3)" strokeWidth="0.8" fill="none" />
            <circle cx="180" cy="270" r="3.5" fill="var(--ink)" />
            <circle cx="180" cy="270" r="7" stroke="var(--ink-2)" strokeWidth="1" fill="none" />
            <line x1="130" y1="244" x2="174" y2="268" stroke="var(--ink-3)" strokeWidth="0.9" />
            <line x1="230" y1="244" x2="186" y2="268" stroke="var(--ink-3)" strokeWidth="0.9" />
            <line x1="124" y1="244" x2="236" y2="244" stroke="var(--ink-4)" strokeWidth="0.8" strokeDasharray="2 2" />
            <text x="180" y="290" textAnchor="middle" fill="var(--ink)" fontSize="10" fontFamily="var(--font-mono)" letterSpacing="0.22em" fontWeight="600">
              СИНТЕЗ
            </text>
            <g clipPath="url(#synthesisClipL)">
              <line x1="100" y1="226" x2="260" y2="226" stroke="var(--cobalt)" strokeWidth="1" opacity="0" className="diagram-scan" />
            </g>
          </g>

          {/* Connection synthesis → result */}
          <line x1="180" y1="298" x2="180" y2="338" stroke="var(--ink-3)" strokeWidth="1.2" strokeDasharray="3 3" className="diagram-line" style={{ "--len": "44px", animationDelay: "1.1s" } as React.CSSProperties} />

          {/* РЕЗУЛЬТАТ diamond */}
          <g className="diagram-node" style={{ animationDelay: "1.4s" }}>
            <circle cx="180" cy="360" r="14" stroke="var(--cobalt)" strokeWidth="0.8" fill="none" className="diagram-radiate" />
            <circle cx="180" cy="360" r="14" stroke="var(--cobalt)" strokeWidth="0.8" fill="none" className="diagram-radiate-2" />
            <g className="diagram-pulse">
              <polygon points="180,338 204,360 180,382 156,360" stroke="var(--cobalt)" strokeWidth="1.5" fill="var(--paper)" />
              <circle cx="180" cy="360" r="3" fill="var(--cobalt)" />
            </g>
            <text x="180" y="402" textAnchor="middle" fill="var(--ink-2)" fontSize="10" fontFamily="var(--font-mono)" letterSpacing="0.18em" fontWeight="500">
              РЕЗУЛЬТАТ
            </text>
          </g>

          {/* ── Continuous particle streams (the "living" layer) ───────── */}
          {PARTICLES.map((p, i) => (
            <circle key={`flow-${i}`} className="hero-flow" r={p.r} fill={p.fill} style={p.style} />
          ))}

          {/* Bottom title block */}
          <line x1="40" y1="436" x2="320" y2="436" stroke="var(--ink-4)" strokeWidth="1" />
          <text x="44" y="452" fill="var(--ink-3)" fontSize="8" fontFamily="var(--font-mono)" letterSpacing="0.12em">
            STUDIO MODEL
          </text>
          <text x="180" y="452" textAnchor="middle" fill="var(--ink-3)" fontSize="8" fontFamily="var(--font-mono)" letterSpacing="0.12em">
            v.01 · 2026
          </text>
          <text x="316" y="452" textAnchor="end" fill="var(--ink-3)" fontSize="8" fontFamily="var(--font-mono)" letterSpacing="0.12em">
            VS/ENG
          </text>
        </svg>
      </div>
    </div>
  );
}
