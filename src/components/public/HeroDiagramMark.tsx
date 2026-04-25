export default function HeroDiagramMark() {
  return (
    <svg
      viewBox="0 0 300 380"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", maxWidth: 300, height: "auto" }}
      aria-hidden="true"
    >
      {/* Connecting lines (drawn first to be under nodes) */}
      <line
        x1="80" y1="80" x2="150" y2="160"
        stroke="var(--ink-4)" strokeWidth="1"
        className="diagram-line"
        style={{ "--len": "108px", animationDelay: "0.4s" } as React.CSSProperties}
      />
      <line
        x1="220" y1="80" x2="150" y2="160"
        stroke="var(--ink-4)" strokeWidth="1"
        className="diagram-line"
        style={{ "--len": "108px", animationDelay: "0.4s" } as React.CSSProperties}
      />
      <line
        x1="150" y1="230" x2="150" y2="294"
        stroke="var(--ink-4)" strokeWidth="1"
        className="diagram-line"
        style={{ "--len": "70px", animationDelay: "1.2s" } as React.CSSProperties}
      />

      {/* СИСТЕМА node */}
      <g className="diagram-node" style={{ animationDelay: "0.1s" }}>
        <circle cx="80" cy="56" r="24" stroke="var(--ink-3)" strokeWidth="1" />
        <text
          x="80" y="60" textAnchor="middle"
          fill="var(--ink-3)" fontSize="9"
          fontFamily="var(--font-mono)"
          letterSpacing="0.12em"
        >
          СИСТЕМА
        </text>
      </g>

      {/* ИСТОРИЯ node */}
      <g className="diagram-node" style={{ animationDelay: "0.25s" }}>
        <circle cx="220" cy="56" r="24" stroke="var(--ink-3)" strokeWidth="1" />
        <text
          x="220" y="60" textAnchor="middle"
          fill="var(--ink-3)" fontSize="9"
          fontFamily="var(--font-mono)"
          letterSpacing="0.12em"
        >
          ИСТОРИЯ
        </text>
      </g>

      {/* СИНТЕЗ block */}
      <g className="diagram-node" style={{ animationDelay: "0.7s" }}>
        <rect
          x="90" y="160" width="120" height="70"
          stroke="var(--ink-3)" strokeWidth="1"
          fill="var(--paper)"
        />
        <line x1="108" y1="183" x2="192" y2="183" stroke="var(--ink-4)" strokeWidth="1" />
        <line x1="108" y1="197" x2="174" y2="197" stroke="var(--ink-4)" strokeWidth="1" />
        <text
          x="150" y="220" textAnchor="middle"
          fill="var(--ink-2)" fontSize="9"
          fontFamily="var(--font-mono)"
          letterSpacing="0.18em"
          fontWeight="500"
        >
          СИНТЕЗ
        </text>
      </g>

      {/* РЕЗУЛЬТАТ diamond — cobalt accent */}
      <g className="diagram-node" style={{ animationDelay: "1.5s" }}>
        <polygon
          points="150,298 170,318 150,338 130,318"
          stroke="var(--cobalt)" strokeWidth="1"
          fill="var(--paper)"
        />
        <text
          x="150" y="358" textAnchor="middle"
          fill="var(--ink-3)" fontSize="9"
          fontFamily="var(--font-mono)"
          letterSpacing="0.18em"
        >
          РЕЗУЛЬТАТ
        </text>
      </g>
    </svg>
  );
}
