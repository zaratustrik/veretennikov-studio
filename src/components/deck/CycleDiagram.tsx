"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Slide 04 — the adaptive loop. A sequence with a return arc: reads
 * left to right, but closes, which is the whole point of the slide.
 */
export default function CycleDiagram({
  steps,
}: {
  steps: readonly { readonly k: string; readonly v: string }[];
}) {
  const reduce = useReducedMotion();

  const W = 1080;
  const H = 210;
  const top = 58;
  const padX = 40;
  const span = (W - padX * 2) / (steps.length - 1);

  const pts = steps.map((s, i) => ({ ...s, x: padX + i * span, y: top }));
  const first = pts[0];
  const last = pts[pts.length - 1];
  const arc = `M ${last.x} ${last.y + 16} C ${last.x} ${H - 22}, ${first.x} ${H - 22}, ${first.x} ${first.y + 16}`;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full"
      role="img"
      aria-label={`Постоянный цикл: ${steps.map((s) => s.k).join(" → ")} и снова`}
    >
      {/* base line */}
      <motion.line
        x1={first.x}
        y1={top}
        x2={last.x}
        y2={top}
        stroke="currentColor"
        strokeOpacity={0.28}
        strokeWidth={1}
        initial={reduce ? false : { pathLength: 0 }}
        whileInView={reduce ? {} : { pathLength: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 1.1, ease: "easeInOut" }}
      />

      {/* return arc — the loop */}
      <motion.path
        d={arc}
        fill="none"
        stroke="var(--deck-copper)"
        strokeWidth={1.2}
        strokeDasharray="3 5"
        initial={reduce ? false : { pathLength: 0 }}
        whileInView={reduce ? {} : { pathLength: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 1.1, delay: 0.7, ease: "easeInOut" }}
      />

      {pts.map((p, i) => (
        <motion.g
          key={p.k}
          initial={reduce ? false : { opacity: 0, y: 8 }}
          whileInView={reduce ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.15 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
        >
          <circle cx={p.x} cy={top} r={4} fill="currentColor" />
          <text
            x={p.x}
            y={top - 22}
            textAnchor={i === 0 ? "start" : i === pts.length - 1 ? "end" : "middle"}
            fill="currentColor"
            style={{ font: "500 15px var(--font-body)" }}
          >
            {p.k}
          </text>
          <text
            x={p.x}
            y={top + 26}
            textAnchor={i === 0 ? "start" : i === pts.length - 1 ? "end" : "middle"}
            fill="currentColor"
            fillOpacity={0.55}
            style={{ font: "400 12px var(--font-body)" }}
          >
            {p.v}
          </text>
        </motion.g>
      ))}
    </svg>
  );
}
