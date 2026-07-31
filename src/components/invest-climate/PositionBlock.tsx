"use client";

import type { MetaData } from "@/types/investment-climate";
import { Reveal, Section } from "./shared";

/* Рукописный SVG: динамика места региона в Нацрейтинге (меньше — лучше). */
function TrendLine({ meta }: { meta: MetaData }) {
  const points = [
    { year: 2024, place: meta.rating.y2024 },
    { year: 2025, place: meta.rating.y2025 },
    { year: 2026, place: meta.rating.y2026 },
  ];
  const w = 360;
  const h = 180;
  const padX = 44;
  const padY = 34;
  const places = points.map((p) => p.place);
  const min = Math.min(...places) - 1;
  const max = Math.max(...places) + 1;
  const x = (i: number) => padX + (i * (w - padX * 2)) / (points.length - 1);
  const y = (place: number) =>
    padY + ((place - min) / (max - min)) * (h - padY * 2);
  const path = points.map((p, i) => `${x(i)},${y(p.place)}`).join(" ");

  return (
    <figure>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        role="img"
        aria-label={`Место в Национальном рейтинге: ${points
          .map((p) => `${p.year} год — ${p.place} место`)
          .join(", ")}`}
        className="w-full max-w-[420px]"
      >
        <polyline
          points={path}
          fill="none"
          stroke="var(--ic-accent)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.map((p, i) => (
          <g key={p.year}>
            <circle cx={x(i)} cy={y(p.place)} r="5" fill="var(--ic-accent)" />
            <text
              x={x(i)}
              y={y(p.place) - 12}
              textAnchor="middle"
              fontSize="15"
              fontWeight="700"
              fill="var(--ic-ink)"
            >
              {p.place}
            </text>
            <text
              x={x(i)}
              y={h - 8}
              textAnchor="middle"
              fontSize="12"
              fill="var(--ic-ink-2)"
            >
              {p.year}
            </text>
          </g>
        ))}
      </svg>
      <figcaption className="mt-1 text-[12px] text-[var(--ic-ink-2)]">
        Место Свердловской области в Национальном рейтинге АСИ (ниже цифра —
        выше позиция). Источники: {meta.rating.sources.join(", ")}.
      </figcaption>
    </figure>
  );
}

/* Сравнительная шкала показателя: оценка СО, цель, средняя по РФ. */
function IndicatorScale({
  indicator,
}: {
  indicator: MetaData["indicators"][number];
}) {
  const MIN = 4.2;
  const MAX = 5.0;
  const pct = (v: number) =>
    Math.max(0, Math.min(100, ((v - MIN) / (MAX - MIN)) * 100));

  return (
    <div className="ic-card p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div className="text-[13.5px] font-semibold">
          {indicator.code} · {indicator.name}
        </div>
        <div className="text-[12px] text-[var(--ic-ink-2)]">
          строки {indicator.rows}
        </div>
      </div>
      <div className="relative mt-4 h-2 rounded-full bg-[var(--ic-surface-2)]">
        {/* Текущая оценка — заполненная часть */}
        <div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width: `${pct(indicator.so)}%`,
            background: "var(--ic-accent)",
          }}
          aria-hidden
        />
        {/* Цель — контурный маркер */}
        <span
          aria-hidden
          className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--ic-accent)] bg-[var(--ic-surface)]"
          style={{ left: `${pct(indicator.target)}%` }}
        />
        {/* Средняя по РФ — вертикальная риска */}
        {indicator.rfAvg !== null ? (
          <span
            aria-hidden
            className="absolute top-1/2 h-5 w-0.5 -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${pct(indicator.rfAvg)}%`,
              background: "var(--ic-s-remove)",
            }}
          />
        ) : null}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[12.5px] text-[var(--ic-ink-2)]">
        <span>
          <strong className="text-[var(--ic-ink)]">
            {indicator.so.toFixed(2)}
          </strong>{" "}
          сейчас (группа {indicator.soGroup})
        </span>
        <span>
          цель {indicator.target.toFixed(2)} (группа {indicator.targetGroup})
        </span>
        <span>
          {indicator.rfAvg !== null
            ? `средняя по РФ ${indicator.rfAvg.toFixed(2)}`
            : "средняя по РФ — данных нет"}
        </span>
      </div>
    </div>
  );
}

export function PositionBlock({ meta }: { meta: MetaData }) {
  return (
    <Section
      id="position"
      title="Положение региона"
      lead="Динамика места в Национальном рейтинге и пять показателей дорожной карты в сравнении с целями и средними по РФ."
    >
      <div className="grid gap-6 lg:grid-cols-[420px_minmax(0,1fr)] lg:items-start">
        <Reveal>
          <div className="ic-card p-5">
            <h3 className="ic-h3 mb-2">Место в Нацрейтинге: 11 → 10 → 14</h3>
            <TrendLine meta={meta} />
          </div>
        </Reveal>
        <div className="space-y-3">
          {meta.indicators.map((ind, i) => (
            <Reveal key={ind.code} delay={Math.min(i * 0.06, 0.3)}>
              <IndicatorScale indicator={ind} />
            </Reveal>
          ))}
        </div>
      </div>
      <Reveal className="mt-6">
        <div
          className="rounded-xl border px-4 py-3 text-[13px] leading-relaxed"
          style={{
            borderColor: "color-mix(in srgb, var(--ic-s-improve) 40%, transparent)",
            background: "color-mix(in srgb, var(--ic-s-improve) 8%, transparent)",
            color: "var(--ic-ink-2)",
          }}
          role="note"
          aria-label="Статус достоверности данных"
        >
          <strong className="text-[var(--ic-ink)]">Достоверность данных: </strong>
          {meta.dataCaveats.map((c, i) => (
            <span key={c}>
              {c}
              {i < meta.dataCaveats.length - 1 ? " · " : ""}
            </span>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
