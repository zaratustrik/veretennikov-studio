import Link from "next/link";
import HeroDiagram from "@/components/public/HeroDiagram";

/* ─── Data ─────────────────────────────────────────────────────── */

const PILLARS = [
  {
    num: "01",
    title: "AI-автоматизация",
    description:
      "Не интеграция ChatGPT и не шаблон на no-code. Продуктовый подход: анализ процесса, проектирование системы, разработка под конкретную задачу бизнеса.",
  },
  {
    num: "02",
    title: "Визуальный контент",
    description:
      "Корпоративные фильмы, презентационные ролики, VFX. Специализация — объяснять сложные продукты и системы так, чтобы было понятно и совету директоров, и рядовым сотрудникам.",
  },
  {
    num: "03",
    title: "Синтез",
    description:
      "Построить AI-решение и снять о нём фильм — в рамках одного проекта, с единой стратегией. Без потери контекста. Без потери в качестве.",
    isMain: true,
  },
];

const CLIENTS = [
  "Ростелеком",
  "Уральские Авиалинии",
  "Белоярская АЭС",
  "СКБ Контур",
  "УБРиР",
  "УрФУ",
  "Промэлектроника",
  "Таркет",
];

/* ─── Page ──────────────────────────────────────────────────────── */

export default function HomePage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 pt-28 pb-24 min-h-[90vh] flex flex-col justify-center">
        <div className="grid lg:grid-cols-[1fr_320px] gap-16 lg:gap-24 items-center">

          {/* Text */}
          <div>
            <p
              className="anim-fade-up text-[11px] tracking-[0.2em] uppercase text-[var(--text-3)] font-mono mb-10"
              style={{ "--delay": "0s" } as React.CSSProperties}
            >
              AI-автоматизация · Корпоративное видео · Синтез
            </p>

            <h1
              className="anim-fade-up font-medium tracking-[-0.03em] leading-[1.05] text-[var(--text-1)] mb-8"
              style={{
                fontSize: "clamp(2.6rem, 5.5vw, 4.5rem)",
                "--delay": "0.1s",
              } as React.CSSProperties}
            >
              Системы, которые
              <br />
              работают.{" "}
              <span className="text-[var(--text-2)]">Истории,</span>
              <br />
              <span className="text-[var(--text-2)]">которые убеждают.</span>
            </h1>

            <p
              className="anim-fade-up text-[var(--text-2)] leading-[1.7] mb-12 max-w-[480px]"
              style={{
                fontSize: "clamp(0.95rem, 1.3vw, 1.05rem)",
                "--delay": "0.2s",
              } as React.CSSProperties}
            >
              Большинство умеют либо строить системы, либо рассказывать истории.
              Мы делаем и то, и другое — для организаций, которым важен
              и инструмент, и восприятие.
            </p>

            <div
              className="anim-fade-up flex flex-wrap gap-4"
              style={{ "--delay": "0.3s" } as React.CSSProperties}
            >
              <Link
                href="/cases"
                className="px-7 py-3.5 bg-[var(--text-1)] text-[var(--bg-base)] text-sm font-medium rounded-full hover:bg-white transition-colors"
              >
                Посмотреть кейсы
              </Link>
              <Link
                href="/contact"
                className="px-7 py-3.5 border border-[var(--border-mid)] text-[var(--text-2)] text-sm rounded-full hover:text-[var(--text-1)] hover:border-[#3A3A3A] transition-colors"
              >
                Написать →
              </Link>
            </div>
          </div>

          {/* Diagram */}
          <div
            className="anim-fade hidden lg:flex items-center justify-center"
            style={{ "--delay": "0.4s" } as React.CSSProperties}
          >
            <HeroDiagram />
          </div>
        </div>
      </section>

      {/* ── Clients strip ─────────────────────────────────────────── */}
      <div className="border-t border-[var(--border)]">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="flex flex-wrap items-center gap-x-10 gap-y-3">
            <span className="text-[10px] tracking-[0.2em] uppercase font-mono text-[var(--text-3)] shrink-0">
              Клиенты
            </span>
            {CLIENTS.map((name) => (
              <span
                key={name}
                className="text-sm text-[var(--text-3)] hover:text-[var(--text-2)] transition-colors cursor-default"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Three Pillars ─────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <p className="text-[10px] tracking-[0.2em] uppercase font-mono text-[var(--text-3)] mb-16">
          Что мы делаем
        </p>

        <div className="flex flex-col">
          {PILLARS.map(({ num, title, description, isMain }) => (
            <div
              key={num}
              className={`group relative border-t border-[var(--border)] last:border-b py-10 grid md:grid-cols-[80px_1fr_1fr] gap-6 md:gap-12 items-start transition-colors ${
                isMain
                  ? "bg-[var(--bg-surface)]"
                  : "hover:bg-[var(--bg-surface)]"
              }`}
            >
              {/* Number */}
              <span className="text-[11px] tracking-[0.15em] font-mono text-[var(--text-3)] pt-1 px-6 md:px-0">
                {num}
              </span>

              {/* Title */}
              <h3
                className="px-6 md:px-0 font-medium tracking-[-0.02em] text-[var(--text-1)]"
                style={{ fontSize: "clamp(1.1rem, 1.8vw, 1.4rem)" }}
              >
                {title}
                {isMain && (
                  <span className="ml-3 text-[10px] tracking-[0.15em] uppercase font-mono text-[var(--text-3)] align-middle">
                    Ключевое
                  </span>
                )}
              </h3>

              {/* Description */}
              <p className="text-sm text-[var(--text-2)] leading-relaxed px-6 md:px-0 pb-4 md:pb-0">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Manifesto strip ───────────────────────────────────────── */}
      <div className="border-t border-[var(--border)]">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <blockquote
            className="font-medium tracking-[-0.025em] text-[var(--text-1)] max-w-2xl"
            style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)", lineHeight: 1.3 }}
          >
            "Люди покупают не дрель, а дырку в стене."
          </blockquote>
          <p className="mt-6 text-xs tracking-[0.15em] uppercase font-mono text-[var(--text-3)]">
            — Теодор Левитт
          </p>
          <div className="mt-8">
            <Link
              href="/manifesto"
              className="text-sm text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors underline underline-offset-4 decoration-[var(--border-mid)]"
            >
              Читать манифест →
            </Link>
          </div>
        </div>
      </div>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <div className="border-t border-[var(--border)]">
        <div className="mx-auto max-w-6xl px-6 py-20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <p
            className="font-medium tracking-[-0.025em] text-[var(--text-1)] max-w-md"
            style={{ fontSize: "clamp(1.4rem, 2.2vw, 1.9rem)", lineHeight: 1.2 }}
          >
            Есть задача?{" "}
            <span className="text-[var(--text-2)]">Расскажите о ней.</span>
          </p>
          <Link
            href="/contact"
            className="shrink-0 px-7 py-3.5 bg-[var(--text-1)] text-[var(--bg-base)] text-sm font-medium rounded-full hover:bg-white transition-colors"
          >
            Связаться →
          </Link>
        </div>
      </div>
    </>
  );
}
