import type { Metadata } from "next"
import { Suspense } from "react"
import BriefForm from "./BriefForm"

export const metadata: Metadata = {
  title: "Бриф",
  description: "Расскажите о задаче — Анатолий ответит лично в течение рабочего дня.",
}

export default function BriefPage() {
  return (
    <>
      {/* ── Header ───────────────────────────────────────────────── */}
      <section className="border-b border-[var(--rule)]">
        <div
          className="mx-auto px-5 md:px-8"
          style={{ maxWidth: "var(--content-max)" }}
        >
          {/* Mono masthead */}
          <div className="grid grid-cols-3 gap-4 pt-5 border-b border-[var(--rule)] pb-5">
            <span className="eyebrow">Brief · 01</span>
            <span className="eyebrow text-center hidden md:block">Veretennikov Studio</span>
            <span className="eyebrow text-right">Заполнение ~5 минут</span>
          </div>

          <div className="pt-20 pb-12">
            <p className="eyebrow mb-7">Расскажите о задаче</p>
            <h1
              className="display"
              style={{
                fontSize: "clamp(2.25rem, 4.6vw, 4.25rem)",
                lineHeight: 1.04,
                letterSpacing: "-0.025em",
                fontVariationSettings: '"opsz" 48',
                marginBottom: "24px",
                animation: "none",
              }}
            >
              Бриф —{" "}
              <span style={{ color: "var(--ink-3)", fontStyle: "italic" }}>
                это начало разговора,
              </span>
              <br />
              не контракт.
            </h1>
            <p
              className="text-[var(--ink-2)] leading-[1.7] max-w-[640px]"
              style={{ fontSize: "clamp(1rem, 1.2vw, 1.1rem)" }}
            >
              Заполните что можете. Что не знаете — оставьте пустым, обсудим голосом.
              Чем точнее опишите задачу, тем быстрее посчитаю смету и предложу решение.
            </p>
          </div>
        </div>
      </section>

      {/* Form */}
      <Suspense fallback={null}>
        <BriefForm />
      </Suspense>
    </>
  )
}
