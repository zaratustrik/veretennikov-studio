"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import type {
  Applicability,
  Confidence,
  EvidenceGrade,
  ImpactScore,
  InfluencePotential,
  Priority,
  ResponsibleGroup,
  Verdict,
} from "@/types/investment-climate";

/* ── Словари статусов (цвет всегда сопровождается текстом) ────────── */

export const VERDICT_META: Record<Verdict, { label: string; color: string }> = {
  keep: { label: "Сохранить", color: "var(--ic-s-keep)" },
  improve: { label: "Доработать", color: "var(--ic-s-improve)" },
  rewrite: { label: "Переработать", color: "var(--ic-s-rewrite)" },
  merge: { label: "Объединить", color: "var(--ic-s-improve)" },
  remove: { label: "Исключить", color: "var(--ic-s-remove)" },
  conditional: { label: "Проверить", color: "var(--ic-s-nodata)" },
  "fill-new": { label: "Заполнить новым", color: "var(--ic-s-new)" },
};

export const PRIORITY_META: Record<Priority, { label: string; color: string }> = {
  critical: { label: "Критический", color: "var(--ic-s-remove)" },
  high: { label: "Высокий", color: "var(--ic-s-rewrite)" },
  medium: { label: "Средний", color: "var(--ic-s-improve)" },
  low: { label: "Низкий", color: "var(--ic-s-nodata)" },
};

export const GROUP_LABELS: Record<ResponsibleGroup, string> = {
  ministry: "Министерство",
  agency: "АПИ",
  digital: "Минцифры и др.",
  none: "Не указано",
};

export const INFLUENCE_LABELS: Record<InfluencePotential, string> = {
  high: "высокий",
  medium: "средний",
  low: "низкий",
  unproven: "не доказан",
};

export const EVIDENCE_META: Record<EvidenceGrade, { label: string; color: string }> = {
  высокая: { label: "Высокая", color: "var(--ic-s-keep)" },
  средняя: { label: "Средняя", color: "var(--ic-s-improve)" },
  низкая: { label: "Низкая", color: "var(--ic-s-rewrite)" },
};

export const CONFIDENCE_LABELS: Record<Confidence, string> = {
  official: "официальный источник",
  "multi-source": "несколько источников",
  analytical: "аналитический вывод",
  hypothesis: "гипотеза",
  insufficient: "данных недостаточно",
};

export const APPLICABILITY_META: Record<
  Applicability,
  { label: string; color: string }
> = {
  direct: { label: "Прямой перенос", color: "var(--ic-s-keep)" },
  "needs-legal": {
    label: "Требует изменения актов",
    color: "var(--ic-s-improve)",
  },
  principle: { label: "Перенос принципа", color: "var(--ic-s-new)" },
  "not-transferable": { label: "Непереносимо", color: "var(--ic-s-nodata)" },
};

export const FUNCTION_GROUP_LABELS: Record<string, string> = {
  "one-stop": "Единое окно",
  crm: "CRM и сопровождение",
  sites: "Площадки и парки",
  geodata: "Геоданные и инвесткарта",
  permits: "Разрешения и согласования",
  utilities: "Подключение к сетям",
  aftercare: "Aftercare — поддержка действующих",
  disputes: "Споры и омбудсмен",
  sla: "SLA и стандарты услуг",
};

/** Пустое значение → длинное тире (не скрывать молча). */
export function orDash(value: string | null | undefined): string {
  const v = (value ?? "").trim();
  return v.length > 0 ? v : "—";
}

/* ── StatusBadge: цвет + обязательный текст ───────────────────────── */

export function StatusBadge({
  color,
  label,
  title,
}: {
  color: string;
  label: string;
  title?: string;
}) {
  return (
    <span
      className="ic-badge"
      title={title}
      style={{
        color,
        background: `color-mix(in srgb, ${color} 11%, transparent)`,
      }}
    >
      {label}
    </span>
  );
}

/* ── ImpactDots: шкала 1–3 + текст для screen reader ──────────────── */

export function ImpactDots({
  value,
  label,
}: {
  value: ImpactScore;
  label: string;
}) {
  return (
    <span
      className="inline-flex items-center gap-1"
      role="img"
      aria-label={`${label}: ${value} из 3`}
      title={`${label}: ${value} из 3`}
    >
      {[1, 2, 3].map((n) => (
        <span
          key={n}
          aria-hidden
          className="inline-block h-2 w-2 rounded-full"
          style={{
            background: n <= value ? "var(--ic-accent)" : "var(--ic-line)",
          }}
        />
      ))}
      <span className="ml-0.5 text-[11px] font-semibold text-[var(--ic-ink-2)]" aria-hidden>
        {value}
      </span>
    </span>
  );
}

/* ── EvidenceTag: шкала доказательности ───────────────────────────── */

export function EvidenceTag({ grade }: { grade: EvidenceGrade }) {
  const meta = EVIDENCE_META[grade] ?? {
    label: "Данных недостаточно",
    color: "var(--ic-s-nodata)",
  };
  return <StatusBadge color={meta.color} label={`Доказательность: ${meta.label.toLowerCase()}`} />;
}

/* ── MetricCard: число + подпись + примечание ─────────────────────── */

export function MetricCard({
  value,
  label,
  note,
}: {
  value: number;
  label: string;
  note?: string;
}) {
  return (
    <div className="ic-card px-5 py-4">
      <div className="text-[30px] font-bold leading-9 text-[var(--ic-ink)]">
        <CountUp value={value} />
      </div>
      <div className="mt-1 text-[13.5px] font-medium text-[var(--ic-ink-2)]">{label}</div>
      {note ? (
        <div className="mt-1 text-[12px] text-[var(--ic-s-nodata)]">{note}</div>
      ) : null}
    </div>
  );
}

/* ── CountUp: 600ms, уважает prefers-reduced-motion ───────────────── */

export function CountUp({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView || reduced) return;
    const duration = 600;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(value * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, value]);

  // При reduced motion значение показывается сразу, без анимации счётчика.
  return <span ref={ref}>{reduced ? value : display}</span>;
}

/* ── Reveal: fade + 8px rise, один раз ────────────────────────────── */

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.3, delay }}
    >
      {children}
    </motion.div>
  );
}

/* ── Секция с заголовком ──────────────────────────────────────────── */

export function Section({
  id,
  title,
  lead,
  children,
  wide = false,
  printHidden = false,
}: {
  id: string;
  title: string;
  lead?: string;
  children: React.ReactNode;
  wide?: boolean;
  printHidden?: boolean;
}) {
  return (
    <section
      id={id}
      className={`ic-section ${printHidden ? "ic-print-hidden" : ""}`}
      aria-label={title}
    >
      <div className={wide ? "ic-container-wide" : "ic-container"}>
        <Reveal>
          <h2 className="ic-h2">{title}</h2>
          {lead ? <p className="ic-section-lead">{lead}</p> : null}
        </Reveal>
        {children}
      </div>
    </section>
  );
}
