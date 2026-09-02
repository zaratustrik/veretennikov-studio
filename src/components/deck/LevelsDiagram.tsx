"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Slide «Одно окно» — three levels, top down.
 *
 * Built from HTML rather than SVG text: the level-3 labels are Cyrillic
 * names of very different widths, and laying them out by hand in an SVG
 * made them collide. Flow layout wraps them correctly at any size; the
 * only SVG here is the connector that draws itself.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

function Connector({ delay, reduce }: { delay: number; reduce: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 2 40"
      preserveAspectRatio="none"
      className="mx-auto h-7 w-[2px]"
    >
      <motion.line
        x1="1"
        y1="0"
        x2="1"
        y2="40"
        stroke="currentColor"
        strokeOpacity={0.35}
        strokeWidth={2}
        initial={reduce ? false : { pathLength: 0 }}
        whileInView={reduce ? {} : { pathLength: 1 }}
        viewport={{ once: true, margin: "-70px" }}
        transition={{ duration: 0.5, delay, ease: "easeInOut" }}
      />
    </svg>
  );
}

function LevelLabel({ children }: { children: string }) {
  return (
    <span className="deck-eyebrow deck-secondary shrink-0 pt-[6px] opacity-55 md:w-[86px] md:text-right">
      {children}
    </span>
  );
}

export default function LevelsDiagram({
  l1,
  l1note,
  l2,
  l2note,
  ring,
}: {
  l1: string;
  l1note: string;
  l2: string;
  l2note: string;
  ring: readonly string[];
}) {
  const reduce = useReducedMotion() ?? false;

  const appear = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 10 },
    whileInView: reduce ? {} : { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-70px" } as const,
    transition: { duration: 0.5, delay, ease: EASE },
  });

  return (
    <div
      role="img"
      aria-label={`Три уровня. Уровень 1 — ${l1}. Уровень 2 — ${l2}. Уровень 3 — экосистема: ${ring.join(", ")}`}
    >
      {/* ── Level 1 ─────────────────────────────────────────── */}
      <motion.div className="flex items-start gap-5" {...appear(0.05)}>
        <LevelLabel>Уровень 1</LevelLabel>
        <div className="deck-hairline flex-1 border px-6 py-4 text-center">
          <p className="text-[17px] font-medium">{l1}</p>
          <p className="deck-body deck-secondary mt-1">{l1note}</p>
        </div>
      </motion.div>

      <div className="md:pl-[106px]">
        <Connector delay={0.35} reduce={reduce} />
      </div>

      {/* ── Level 2 — the only copper block ─────────────────── */}
      <motion.div className="flex items-start gap-5" {...appear(0.5)}>
        <span
          className="deck-eyebrow shrink-0 pt-[6px] md:w-[86px] md:text-right"
          style={{ color: "var(--deck-copper)" }}
        >
          Уровень 2
        </span>
        <div
          className="flex-1 border px-6 py-5 text-center"
          style={{
            borderColor: "var(--deck-copper)",
            borderWidth: 1.4,
            background: "rgba(190,95,43,0.10)",
          }}
        >
          <p className="deck-accent text-[17px] font-semibold">{l2}</p>
          <p className="deck-body mt-1 opacity-80">{l2note}</p>
        </div>
      </motion.div>

      <div className="md:pl-[106px]">
        <Connector delay={0.85} reduce={reduce} />
      </div>

      {/* ── Level 3 ─────────────────────────────────────────── */}
      <motion.div className="flex items-start gap-5" {...appear(1)}>
        <LevelLabel>Уровень 3</LevelLabel>
        <div className="deck-hairline-soft flex-1 border-t pt-4">
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {ring.map((r, i) => (
              <motion.span
                key={r}
                className="deck-body opacity-85"
                {...appear(1.05 + i * 0.04)}
              >
                {r}
              </motion.span>
            ))}
          </div>
          <p className="deck-body deck-secondary mt-4 opacity-60">
            Экосистема: исполнение, экспертиза, инфраструктура, финансирование
          </p>
        </div>
      </motion.div>
    </div>
  );
}
