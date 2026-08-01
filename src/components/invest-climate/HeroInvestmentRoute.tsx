"use client";

/**
 * HeroInvestmentRoute — авторская векторная композиция титульного блока:
 * «От разрозненных мероприятий — к управляемому пути инвестора».
 *
 * Центр — «Инвестиционный проект», вокруг — шесть узлов-этапов маршрута,
 * тонкие инженерные линии, ломаная уральского рельефа фоном и встроенные
 * ключевые значения. Анимация однократная (центр → маршрут → узлы → один
 * импульс → статика) реализована CSS-классами ic-hr-* с базовым финальным
 * состоянием: без JS и при prefers-reduced-motion композиция сразу статична.
 */

type HeroStats = {
  place: number; // место в Нацрейтинге
  items: number; // мероприятий исходной карты
  decisions: number; // первоочередных решений
  newRows: number; // строк новой карты
};

const STAGES: {
  n: number;
  label: string[];
  x: number;
  y: number;
  labelDy: number;
}[] = [
  { n: 1, label: ["Площадка"], x: 85, y: 84, labelDy: -16 },
  { n: 2, label: ["Инфраструктура"], x: 208, y: 50, labelDy: -14 },
  { n: 3, label: ["Меры поддержки"], x: 348, y: 74, labelDy: -14 },
  { n: 4, label: ["Разрешения"], x: 470, y: 148, labelDy: -16 },
  { n: 5, label: ["Запуск"], x: 452, y: 272, labelDy: 26 },
  {
    n: 6,
    label: ["Сопровождение", "после запуска"],
    x: 298, y: 356, labelDy: 26,
  },
];

export function HeroInvestmentRoute({ stats }: { stats: HeroStats }) {
  const ariaLabel =
    "Схема: от разрозненных мероприятий — к управляемому пути инвестора. " +
    "Центр — инвестиционный проект; этапы: площадка, инфраструктура, меры " +
    "поддержки, разрешения, запуск, сопровождение после запуска. " +
    `Ключевые значения: ${stats.place}-е место в Национальном рейтинге, ` +
    `${stats.items} мероприятия исходной карты, ${stats.decisions} ` +
    `первоочередных решений, ${stats.newRows} строк новой карты.`;

  return (
    <svg
      viewBox="0 0 560 440"
      role="img"
      aria-label={ariaLabel}
      className="ic-hero-route w-full"
    >
      {/* ── Фон: мотив уральского рельефа + инженерные линии (декор) ── */}
      <g className="ic-hr-decor" aria-hidden>
        <polyline
          points="0,398 52,362 108,388 168,330 232,368 298,326 366,356 428,318 492,352 560,328"
          fill="none"
          stroke="var(--ic-line)"
          strokeWidth="1.5"
        />
        <polyline
          points="0,420 70,396 140,414 220,382 306,406 396,376 480,398 560,380"
          fill="none"
          stroke="var(--ic-line)"
          strokeWidth="1"
          opacity="0.6"
        />
        {/* Тонкие линии от центра к этапам */}
        {STAGES.map((s) => (
          <line
            key={s.n}
            x1="280"
            y1="208"
            x2={s.x}
            y2={s.y}
            stroke="var(--ic-line)"
            strokeWidth="1"
            strokeDasharray="3 4"
          />
        ))}
      </g>

      {/* ── Маршрут через шесть этапов ── */}
      <path
        className="ic-hr-route"
        d="M 85 84 C 130 56, 168 46, 208 50 C 258 55, 300 62, 348 74 C 404 88, 452 110, 470 148 C 488 188, 478 238, 452 272 C 424 310, 366 348, 298 356"
        fill="none"
        stroke="var(--ic-accent)"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.85"
      />

      {/* ── Импульс вокруг центра (однократный) ── */}
      <circle
        className="ic-hr-pulse"
        cx="280"
        cy="208"
        r="40"
        fill="none"
        stroke="var(--ic-accent)"
        strokeWidth="1.5"
        aria-hidden
      />

      {/* ── Центр: инвестиционный проект ── */}
      <g className="ic-hr-center">
        <rect
          x="196"
          y="184"
          width="168"
          height="48"
          rx="10"
          fill="var(--ic-accent)"
        />
        <text
          x="280"
          y="205"
          textAnchor="middle"
          fontSize="13"
          fontWeight="700"
          fill="#ffffff"
        >
          Инвестиционный
        </text>
        <text
          x="280"
          y="221"
          textAnchor="middle"
          fontSize="13"
          fontWeight="700"
          fill="#ffffff"
        >
          проект
        </text>
      </g>

      {/* ── Узлы-этапы ── */}
      <g>
        {STAGES.map((s) => (
          <g key={s.n} className="ic-hr-node">
            <circle
              cx={s.x}
              cy={s.y}
              r="12"
              fill="var(--ic-surface)"
              stroke="var(--ic-accent)"
              strokeWidth="1.75"
            />
            <text
              x={s.x}
              y={s.y + 4}
              textAnchor="middle"
              fontSize="11"
              fontWeight="700"
              fill="var(--ic-accent-ink)"
            >
              {s.n}
            </text>
            {s.label.map((line, i) => (
              <text
                key={line}
                x={s.x}
                y={s.y + s.labelDy + i * 13}
                textAnchor="middle"
                fontSize="11.5"
                fontWeight="600"
                fill="var(--ic-ink)"
              >
                {line}
              </text>
            ))}
          </g>
        ))}
      </g>

      {/* ── Встроенные ключевые значения ── */}
      <g className="ic-hr-stat">
        <text x="30" y="176" fontSize="19" fontWeight="700" fill="var(--ic-ink)">
          {stats.place}-е место
        </text>
        <text x="30" y="192" fontSize="10.5" fill="var(--ic-ink-2)">
          в Нацрейтинге, 2026
        </text>

        <text x="34" y="288" fontSize="19" fontWeight="700" fill="var(--ic-ink)">
          {stats.items} мероприятия
        </text>
        <text x="34" y="304" fontSize="10.5" fill="var(--ic-ink-2)">
          исходной карты — под аудитом
        </text>

        <text x="452" y="52" fontSize="19" fontWeight="700" fill="var(--ic-ink)">
          {stats.decisions} решений
        </text>
        <text x="452" y="68" fontSize="10.5" fill="var(--ic-ink-2)">
          первоочередных
        </text>

        <text x="430" y="392" fontSize="19" fontWeight="700" fill="var(--ic-ink)">
          {stats.newRows} строк
        </text>
        <text x="430" y="408" fontSize="10.5" fill="var(--ic-ink-2)">
          новой карты
        </text>
      </g>
    </svg>
  );
}
