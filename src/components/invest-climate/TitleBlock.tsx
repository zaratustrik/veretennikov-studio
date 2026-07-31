"use client";

import type { MetaData } from "@/types/investment-climate";
import { MetricCard, Reveal } from "./shared";

export function TitleBlock({ meta }: { meta: MetaData }) {
  const counters = [
    { value: meta.counters.items, label: "мероприятий исходной карты" },
    { value: meta.counters.documents, label: "документов и источников" },
    { value: meta.counters.ruPractices, label: "российских практик" },
    { value: meta.counters.intlPractices, label: "международных практик" },
    { value: meta.counters.proposals, label: "предложений по итогам аудита" },
  ];

  return (
    <header id="top" className="ic-section" style={{ paddingTop: 48 }}>
      <div className="ic-container grid gap-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <Reveal>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--ic-line)] bg-[var(--ic-surface)] px-3.5 py-1.5 text-[12.5px] font-semibold text-[var(--ic-ink-2)]">
            <span
              aria-hidden
              className="h-2 w-2 rounded-full"
              style={{ background: "var(--ic-accent)" }}
            />
            {meta.status}
          </p>
          <h1 className="text-[30px] font-bold leading-[1.18] sm:text-[34px] sm:leading-[40px]">
            {meta.title}
          </h1>
          <p className="mt-4 max-w-[62ch] text-[16px] leading-relaxed text-[var(--ic-ink-2)]">
            {meta.subtitle}
          </p>
          <dl className="mt-6 space-y-1 text-[13.5px] text-[var(--ic-ink-2)]">
            <div className="flex gap-2">
              <dt className="font-semibold">Горизонт карты:</dt>
              <dd>{meta.period}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold">Данные по состоянию на:</dt>
              <dd>{meta.dataDate}</dd>
            </div>
          </dl>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="grid grid-cols-2 gap-3">
            {counters.map((c, i) => (
              <div key={c.label} className={i === 0 ? "col-span-2" : undefined}>
                <MetricCard value={c.value} label={c.label} />
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </header>
  );
}
