/**
 * Hero diagram-mark — engineering schematic with continuous animations.
 *
 * Layers:
 * 1. Initial draw (stroke-dashoffset, fade-in nodes) — one-shot, ~2s
 * 2. Continuous: flow dots on source→synthesis paths, scan line inside
 *    synthesis box, breathing result diamond, radiating rings, LIVE pulse.
 *
 * All animations are CSS-only and respect prefers-reduced-motion.
 */
export default function HeroDiagramMark() {
  return (
    <svg
      viewBox="0 0 360 460"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", maxWidth: 360, height: "auto" }}
      role="img"
      aria-label="Схема студии: Система плюс История равно Синтез, Результат"
    >
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="0" cy="0" r="0.5" fill="var(--ink-4)" opacity="0.5" />
        </pattern>
        {/* Clip path for scan line */}
        <clipPath id="synthesisClip">
          <rect x="100" y="222" width="160" height="76" />
        </clipPath>
      </defs>

      {/* ── Frame ────────────────────────────────────────────────── */}
      <rect x="40" y="40" width="280" height="380" fill="url(#grid)" opacity="0.4" />
      <rect x="40" y="40" width="280" height="380" stroke="var(--ink-4)" strokeWidth="1" />

      {/* Corner registration marks */}
      {[[40, 40], [320, 40], [40, 420], [320, 420]].map(([x, y]) => (
        <g key={`reg-${x}-${y}`}>
          <line x1={x - 6} y1={y} x2={x + 6} y2={y} stroke="var(--ink-3)" strokeWidth="1" />
          <line x1={x} y1={y - 6} x2={x} y2={y + 6} stroke="var(--ink-3)" strokeWidth="1" />
        </g>
      ))}

      {/* Top labels */}
      <text x="44" y="58" fill="var(--ink-3)" fontSize="8"
        fontFamily="var(--font-mono)" letterSpacing="0.1em" fontWeight="500"
      >
        FIG.01
      </text>

      {/* LIVE indicator — top-right corner with pulsing dot */}
      <g>
        <circle cx="294" cy="55" r="2.5" fill="var(--cobalt)" className="diagram-live" />
        <text x="304" y="58" fill="var(--ink-3)" fontSize="8"
          fontFamily="var(--font-mono)" letterSpacing="0.12em" fontWeight="500"
        >
          LIVE
        </text>
      </g>

      {/* ── Coordinate ticks along left edge ─────────────────────── */}
      {[78, 142, 222, 298, 338, 382].map((y, i) => (
        <line
          key={`tick-${i}`}
          x1="36" y1={y} x2="40" y2={y}
          stroke="var(--ink-4)" strokeWidth="1"
        />
      ))}

      {/* Side dimension annotations (rotated -90°) */}
      <text x="20" y="114" textAnchor="middle" fill="var(--ink-4)" fontSize="7"
        fontFamily="var(--font-mono)" letterSpacing="0.05em"
        transform="rotate(-90 20 114)"
      >
        SOURCE
      </text>
      <text x="20" y="262" textAnchor="middle" fill="var(--ink-4)" fontSize="7"
        fontFamily="var(--font-mono)" letterSpacing="0.05em"
        transform="rotate(-90 20 262)"
      >
        PROCESS
      </text>
      <text x="20" y="362" textAnchor="middle" fill="var(--ink-4)" fontSize="7"
        fontFamily="var(--font-mono)" letterSpacing="0.05em"
        transform="rotate(-90 20 362)"
      >
        OUTPUT
      </text>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* SOURCE LAYER                                               */}
      {/* ══════════════════════════════════════════════════════════ */}

      {/* СИСТЕМА node */}
      <g className="diagram-node" style={{ animationDelay: "0.2s" }}>
        <circle cx="110" cy="110" r="32" stroke="var(--ink-2)" strokeWidth="1.4" fill="var(--paper)" />
        {/* Inner gear-like detail (3 small dots arranged in triangle) */}
        <circle cx="110" cy="100" r="2" fill="var(--ink-2)" />
        <circle cx="101" cy="116" r="2" fill="var(--ink-2)" />
        <circle cx="119" cy="116" r="2" fill="var(--ink-2)" />
        {/* Connecting hairlines between inner dots */}
        <line x1="110" y1="100" x2="101" y2="116" stroke="var(--ink-3)" strokeWidth="0.8" />
        <line x1="110" y1="100" x2="119" y2="116" stroke="var(--ink-3)" strokeWidth="0.8" />
        <line x1="101" y1="116" x2="119" y2="116" stroke="var(--ink-3)" strokeWidth="0.8" />
        {/* Label */}
        <text x="110" y="158" textAnchor="middle"
          fill="var(--ink-2)" fontSize="10"
          fontFamily="var(--font-mono)" letterSpacing="0.15em" fontWeight="500"
        >
          СИСТЕМА
        </text>
        <text x="110" y="172" textAnchor="middle"
          fill="var(--ink-3)" fontSize="8"
          fontFamily="var(--font-mono)" letterSpacing="0.08em"
        >
          /01
        </text>
      </g>

      {/* ИСТОРИЯ node */}
      <g className="diagram-node" style={{ animationDelay: "0.35s" }}>
        <circle cx="250" cy="110" r="32" stroke="var(--ink-2)" strokeWidth="1.4" fill="var(--paper)" />
        {/* Inner detail — narrative lines (3 horizontal lines, decreasing length) */}
        <line x1="240" y1="103" x2="262" y2="103" stroke="var(--ink-2)" strokeWidth="1" />
        <line x1="240" y1="110" x2="258" y2="110" stroke="var(--ink-2)" strokeWidth="1" />
        <line x1="240" y1="117" x2="254" y2="117" stroke="var(--ink-2)" strokeWidth="1" />
        {/* Label */}
        <text x="250" y="158" textAnchor="middle"
          fill="var(--ink-2)" fontSize="10"
          fontFamily="var(--font-mono)" letterSpacing="0.15em" fontWeight="500"
        >
          ИСТОРИЯ
        </text>
        <text x="250" y="172" textAnchor="middle"
          fill="var(--ink-3)" fontSize="8"
          fontFamily="var(--font-mono)" letterSpacing="0.08em"
        >
          /02
        </text>
      </g>

      {/* ── Connecting lines source → synthesis ──────────────────── */}
      <line
        x1="132" y1="135" x2="175" y2="218"
        stroke="var(--ink-3)" strokeWidth="1.2"
        className="diagram-line"
        style={{ "--len": "92px", animationDelay: "0.5s" } as React.CSSProperties}
      />
      <line
        x1="228" y1="135" x2="185" y2="218"
        stroke="var(--ink-3)" strokeWidth="1.2"
        className="diagram-line"
        style={{ "--len": "92px", animationDelay: "0.5s" } as React.CSSProperties}
      />

      {/* Plus sign */}
      <text x="180" y="200" textAnchor="middle"
        fill="var(--ink-3)" fontSize="13"
        fontFamily="var(--font-display)"
      >
        +
      </text>

      {/* Flow dots — travel along source-to-synthesis lines (continuous) */}
      <circle r="2.5" className="diagram-flow-left" />
      <circle r="2.5" className="diagram-flow-right" />

      {/* ══════════════════════════════════════════════════════════ */}
      {/* PROCESS LAYER — СИНТЕЗ box with internal mini-system       */}
      {/* ══════════════════════════════════════════════════════════ */}

      <g className="diagram-node" style={{ animationDelay: "0.85s" }}>
        {/* Box outline */}
        <rect x="100" y="222" width="160" height="76"
          stroke="var(--ink)" strokeWidth="1.4" fill="var(--paper)"
        />

        {/* Internal mini-system: 3 connected nodes forming a small architecture */}
        {/* Top-left node (input) */}
        <circle cx="124" cy="244" r="3" fill="var(--ink-2)" />
        <circle cx="124" cy="244" r="6" stroke="var(--ink-3)" strokeWidth="0.8" fill="none" />
        {/* Top-right node (output) */}
        <circle cx="236" cy="244" r="3" fill="var(--ink-2)" />
        <circle cx="236" cy="244" r="6" stroke="var(--ink-3)" strokeWidth="0.8" fill="none" />
        {/* Bottom-center node (process) */}
        <circle cx="180" cy="270" r="3.5" fill="var(--ink)" />
        <circle cx="180" cy="270" r="7" stroke="var(--ink-2)" strokeWidth="1" fill="none" />
        {/* Connecting lines (forming triangle) */}
        <line x1="130" y1="244" x2="174" y2="268" stroke="var(--ink-3)" strokeWidth="0.9" />
        <line x1="230" y1="244" x2="186" y2="268" stroke="var(--ink-3)" strokeWidth="0.9" />
        <line x1="124" y1="244" x2="236" y2="244"
          stroke="var(--ink-4)" strokeWidth="0.8"
          strokeDasharray="2 2"
        />

        {/* Label inside box, bottom */}
        <text x="180" y="290" textAnchor="middle"
          fill="var(--ink)" fontSize="10"
          fontFamily="var(--font-mono)" letterSpacing="0.22em" fontWeight="600"
        >
          СИНТЕЗ
        </text>

        {/* Scan line — travels vertically inside the box */}
        <g clipPath="url(#synthesisClip)">
          <line
            x1="100" y1="226" x2="260" y2="226"
            stroke="var(--cobalt)" strokeWidth="1"
            opacity="0"
            className="diagram-scan"
          />
        </g>
      </g>

      {/* ── Connection synthesis → result (dashed) ───────────────── */}
      <line
        x1="180" y1="298" x2="180" y2="338"
        stroke="var(--ink-3)" strokeWidth="1.2"
        strokeDasharray="3 3"
        className="diagram-line"
        style={{ "--len": "44px", animationDelay: "1.1s" } as React.CSSProperties}
      />

      {/* ══════════════════════════════════════════════════════════ */}
      {/* OUTPUT LAYER — РЕЗУЛЬТАТ diamond with breathing + radiate  */}
      {/* ══════════════════════════════════════════════════════════ */}

      <g className="diagram-node" style={{ animationDelay: "1.4s" }}>
        {/* Radiating rings (continuous) */}
        <circle cx="180" cy="360" r="14"
          stroke="var(--cobalt)" strokeWidth="0.8" fill="none"
          className="diagram-radiate"
        />
        <circle cx="180" cy="360" r="14"
          stroke="var(--cobalt)" strokeWidth="0.8" fill="none"
          className="diagram-radiate-2"
        />

        {/* Diamond — pulsing */}
        <g className="diagram-pulse">
          <polygon
            points="180,338 204,360 180,382 156,360"
            stroke="var(--cobalt)" strokeWidth="1.5"
            fill="var(--paper)"
          />
          <circle cx="180" cy="360" r="3" fill="var(--cobalt)" />
        </g>

        <text x="180" y="402" textAnchor="middle"
          fill="var(--ink-2)" fontSize="10"
          fontFamily="var(--font-mono)" letterSpacing="0.18em" fontWeight="500"
        >
          РЕЗУЛЬТАТ
        </text>
      </g>

      {/* ── Bottom title block ───────────────────────────────────── */}
      <line x1="40" y1="436" x2="320" y2="436" stroke="var(--ink-4)" strokeWidth="1" />
      <text x="44" y="452" fill="var(--ink-3)" fontSize="8"
        fontFamily="var(--font-mono)" letterSpacing="0.12em"
      >
        STUDIO MODEL
      </text>
      <text x="180" y="452" textAnchor="middle" fill="var(--ink-3)" fontSize="8"
        fontFamily="var(--font-mono)" letterSpacing="0.12em"
      >
        v.01 · 2026
      </text>
      <text x="316" y="452" textAnchor="end" fill="var(--ink-3)" fontSize="8"
        fontFamily="var(--font-mono)" letterSpacing="0.12em"
      >
        VS/ENG
      </text>
    </svg>
  );
}
