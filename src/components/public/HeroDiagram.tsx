/**
 * CSS-анимированная схема: два потока (AI + Видео) → Синтез → Результат.
 * Чистый SVG + CSS keyframes, без JS и библиотек.
 */
export default function HeroDiagram() {
  return (
    <div className="w-full max-w-[320px] mx-auto opacity-90" aria-hidden="true">
      <svg
        viewBox="0 0 300 380"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
      >
        {/* ── Connecting lines (draw in) ── */}

        {/* Left node → box */}
        <line
          x1="80" y1="76" x2="150" y2="160"
          stroke="#2A2A2A" strokeWidth="1"
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset="1"
          style={{
            animation: "drawPath 0.6s cubic-bezier(0.4,0,0.2,1) 0.8s forwards",
          }}
        />
        {/* Right node → box */}
        <line
          x1="220" y1="76" x2="150" y2="160"
          stroke="#2A2A2A" strokeWidth="1"
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset="1"
          style={{
            animation: "drawPath 0.6s cubic-bezier(0.4,0,0.2,1) 1.0s forwards",
          }}
        />
        {/* Box → diamond */}
        <line
          x1="150" y1="230" x2="150" y2="294"
          stroke="#2A2A2A" strokeWidth="1"
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset="1"
          style={{
            animation: "drawPath 0.5s cubic-bezier(0.4,0,0.2,1) 1.6s forwards",
          }}
        />

        {/* ── Source nodes ── */}

        {/* AI node */}
        <circle
          cx="80" cy="56" r="24"
          stroke="#2A2A2A" strokeWidth="1"
          style={{
            transformOrigin: "80px 56px",
            animation: "nodeIn 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.2s both",
          }}
        />
        <text
          x="80" y="60"
          textAnchor="middle"
          fill="#444"
          fontSize="9"
          fontFamily="var(--font-geist-mono)"
          letterSpacing="0.08em"
          style={{ animation: "fadeIn 0.4s ease 0.4s both" }}
        >
          СИСТЕМА
        </text>

        {/* Video node */}
        <circle
          cx="220" cy="56" r="24"
          stroke="#2A2A2A" strokeWidth="1"
          style={{
            transformOrigin: "220px 56px",
            animation: "nodeIn 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.4s both",
          }}
        />
        <text
          x="220" y="60"
          textAnchor="middle"
          fill="#444"
          fontSize="9"
          fontFamily="var(--font-geist-mono)"
          letterSpacing="0.08em"
          style={{ animation: "fadeIn 0.4s ease 0.6s both" }}
        >
          ИСТОРИЯ
        </text>

        {/* ── Synthesis box ── */}
        <rect
          x="90" y="160" width="120" height="70"
          stroke="#333" strokeWidth="1"
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset="1"
          style={{
            animation: "drawPath 0.8s cubic-bezier(0.4,0,0.2,1) 1.2s forwards",
          }}
        />
        {/* Inner line 1 */}
        <line
          x1="108" y1="183" x2="192" y2="183"
          stroke="#252525" strokeWidth="1"
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset="1"
          style={{
            animation: "drawPath 0.5s ease 1.7s forwards",
          }}
        />
        {/* Inner line 2 */}
        <line
          x1="108" y1="197" x2="174" y2="197"
          stroke="#252525" strokeWidth="1"
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset="1"
          style={{
            animation: "drawPath 0.4s ease 1.9s forwards",
          }}
        />
        <text
          x="150" y="222"
          textAnchor="middle"
          fill="#555"
          fontSize="8"
          fontFamily="var(--font-geist-mono)"
          letterSpacing="0.1em"
          style={{ animation: "fadeIn 0.4s ease 2.0s both" }}
        >
          СИНТЕЗ
        </text>

        {/* ── Output diamond ── */}
        <polygon
          points="150,298 170,318 150,338 130,318"
          stroke="#3A3A3A" strokeWidth="1"
          style={{
            animation: "diamondIn 0.6s cubic-bezier(0.34,1.56,0.64,1) 2.1s both",
          }}
        />
        <text
          x="150" y="358"
          textAnchor="middle"
          fill="#3A3A3A"
          fontSize="8"
          fontFamily="var(--font-geist-mono)"
          letterSpacing="0.1em"
          style={{ animation: "fadeIn 0.4s ease 2.3s both" }}
        >
          РЕЗУЛЬТАТ
        </text>
      </svg>
    </div>
  );
}
