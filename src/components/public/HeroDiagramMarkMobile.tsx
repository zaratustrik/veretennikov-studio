/**
 * Compact horizontal variant of the hero schematic for mobile / tablet,
 * where the full 360×460 HeroDiagramMark is too tall. Shows the same
 * model — СИСТЕМА + ИСТОРИЯ = СИНТЕЗ → РЕЗУЛЬТАТ — in a wide band.
 * Reuses the existing .diagram-* CSS animation classes (globals.css).
 */
export default function HeroDiagramMarkMobile() {
  return (
    <svg
      viewBox="0 0 340 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "auto" }}
      role="img"
      aria-label="Схема студии: Система плюс История равно Синтез, Результат"
    >
      {/* Frame */}
      <rect x="4" y="4" width="332" height="132" stroke="var(--ink-4)" strokeWidth="1" />
      {[[4, 4], [336, 4], [4, 136], [336, 136]].map(([x, y]) => (
        <g key={`reg-${x}-${y}`}>
          <line x1={x - 5} y1={y} x2={x + 5} y2={y} stroke="var(--ink-3)" strokeWidth="1" />
          <line x1={x} y1={y - 5} x2={x} y2={y + 5} stroke="var(--ink-3)" strokeWidth="1" />
        </g>
      ))}

      <text x="14" y="22" fill="var(--ink-3)" fontSize="8"
        fontFamily="var(--font-mono)" letterSpacing="0.1em" fontWeight="500">
        FIG.01
      </text>
      <g>
        <circle cx="298" cy="18" r="2.5" fill="var(--cobalt)" className="diagram-live" />
        <text x="307" y="21" fill="var(--ink-3)" fontSize="8"
          fontFamily="var(--font-mono)" letterSpacing="0.12em" fontWeight="500">
          LIVE
        </text>
      </g>

      {/* Connecting lines source → synthesis */}
      <line x1="62" y1="70" x2="170" y2="62" stroke="var(--ink-3)" strokeWidth="1.1"
        className="diagram-line" style={{ "--len": "110px", animationDelay: "0.5s" } as React.CSSProperties} />
      <line x1="136" y1="68" x2="170" y2="62" stroke="var(--ink-3)" strokeWidth="1.1"
        className="diagram-line" style={{ "--len": "40px", animationDelay: "0.5s" } as React.CSSProperties} />

      {/* СИСТЕМА */}
      <g className="diagram-node" style={{ animationDelay: "0.2s" }}>
        <circle cx="50" cy="62" r="15" stroke="var(--ink-2)" strokeWidth="1.4" fill="var(--paper)" />
        <circle cx="50" cy="55" r="1.8" fill="var(--ink-2)" />
        <circle cx="43" cy="67" r="1.8" fill="var(--ink-2)" />
        <circle cx="57" cy="67" r="1.8" fill="var(--ink-2)" />
        <text x="50" y="96" textAnchor="middle" fill="var(--ink-2)" fontSize="7.5"
          fontFamily="var(--font-mono)" letterSpacing="0.12em" fontWeight="500">
          СИСТЕМА
        </text>
      </g>

      {/* Plus */}
      <text x="86" y="67" textAnchor="middle" fill="var(--ink-3)" fontSize="13"
        fontFamily="var(--font-display)">
        +
      </text>

      {/* ИСТОРИЯ */}
      <g className="diagram-node" style={{ animationDelay: "0.35s" }}>
        <circle cx="122" cy="62" r="15" stroke="var(--ink-2)" strokeWidth="1.4" fill="var(--paper)" />
        <line x1="114" y1="57" x2="130" y2="57" stroke="var(--ink-2)" strokeWidth="1" />
        <line x1="114" y1="62" x2="127" y2="62" stroke="var(--ink-2)" strokeWidth="1" />
        <line x1="114" y1="67" x2="124" y2="67" stroke="var(--ink-2)" strokeWidth="1" />
        <text x="122" y="96" textAnchor="middle" fill="var(--ink-2)" fontSize="7.5"
          fontFamily="var(--font-mono)" letterSpacing="0.12em" fontWeight="500">
          ИСТОРИЯ
        </text>
      </g>

      {/* СИНТЕЗ */}
      <g className="diagram-node" style={{ animationDelay: "0.7s" }}>
        <rect x="170" y="46" width="64" height="32" stroke="var(--ink)" strokeWidth="1.4" fill="var(--paper)" />
        <circle cx="184" cy="58" r="2.4" fill="var(--ink-2)" />
        <circle cx="220" cy="58" r="2.4" fill="var(--ink-2)" />
        <circle cx="202" cy="68" r="2.8" fill="var(--ink)" />
        <line x1="186" y1="59" x2="200" y2="67" stroke="var(--ink-3)" strokeWidth="0.8" />
        <line x1="218" y1="59" x2="204" y2="67" stroke="var(--ink-3)" strokeWidth="0.8" />
        <text x="202" y="96" textAnchor="middle" fill="var(--ink)" fontSize="7.5"
          fontFamily="var(--font-mono)" letterSpacing="0.18em" fontWeight="600">
          СИНТЕЗ
        </text>
      </g>

      {/* Synthesis → result */}
      <line x1="234" y1="62" x2="274" y2="62" stroke="var(--ink-3)" strokeWidth="1.1"
        strokeDasharray="3 3"
        className="diagram-line" style={{ "--len": "44px", animationDelay: "1s" } as React.CSSProperties} />

      {/* РЕЗУЛЬТАТ */}
      <g className="diagram-node" style={{ animationDelay: "1.2s" }}>
        <circle cx="296" cy="62" r="13" stroke="var(--cobalt)" strokeWidth="0.8" fill="none"
          className="diagram-radiate" />
        <g className="diagram-pulse">
          <polygon points="296,46 312,62 296,78 280,62"
            stroke="var(--cobalt)" strokeWidth="1.5" fill="var(--paper)" />
          <circle cx="296" cy="62" r="2.6" fill="var(--cobalt)" />
        </g>
        <text x="296" y="96" textAnchor="middle" fill="var(--ink-2)" fontSize="7.5"
          fontFamily="var(--font-mono)" letterSpacing="0.12em" fontWeight="500">
          РЕЗУЛЬТАТ
        </text>
      </g>

      {/* Bottom block */}
      <line x1="14" y1="110" x2="326" y2="110" stroke="var(--ink-4)" strokeWidth="1" />
      <text x="14" y="125" fill="var(--ink-3)" fontSize="7.5"
        fontFamily="var(--font-mono)" letterSpacing="0.12em">
        STUDIO MODEL
      </text>
      <text x="326" y="125" textAnchor="end" fill="var(--ink-3)" fontSize="7.5"
        fontFamily="var(--font-mono)" letterSpacing="0.12em">
        v.01 · 2026
      </text>
    </svg>
  );
}
