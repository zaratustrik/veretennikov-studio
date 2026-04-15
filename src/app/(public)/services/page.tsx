import type { Metadata } from "next";
import Link from "next/link";
import FadeIn from "@/components/public/FadeIn";

export const metadata: Metadata = { title: "Задачи → решения" };

const TASKS = [
  {
    num: "01",
    problem: "Процесс съедает время команды. Его можно автоматизировать.",
    title: "AI в бизнес-процессы",
    description:
      "Аудит процесса, проектирование системы, разработка и запуск. Не пилот на месяц и не демо для инвесторов — рабочий инструмент под конкретную задачу.",
    deliverables: [
      "Анализ процесса и техническое задание",
      "Разработка AI-приложения или автоматизации",
      "Интеграция в существующую инфраструктуру",
      "Документация и обучение команды",
    ],
  },
  {
    num: "02",
    problem: "Есть история, которую нужно рассказать правильно.",
    title: "Корпоративный фильм",
    description:
      "Режиссура, сценарий, съёмка, монтаж, VFX — своими руками, без субподряда. Специализация: корпоративные истории, которые не скучно смотреть.",
    deliverables: [
      "Сценарий и раскадровка",
      "Съёмка и режиссура",
      "Монтаж, цветокоррекция, саунд-дизайн",
      "VFX и инфографика при необходимости",
    ],
  },
  {
    num: "03",
    problem: "Продукт отличный. Люди не понимают, зачем он им нужен.",
    title: "Объяснить сложный продукт",
    description:
      "Презентационный ролик, анимационное объяснение, обучающее видео. Сложное — не значит непонятное. Это вопрос не упрощения, а точности.",
    deliverables: [
      "Структура и сценарий объяснения",
      "Анимация или съёмка с инфографикой",
      "Адаптация под разные форматы и площадки",
      "Варианты для разной аудитории (инвесторы, сотрудники, клиенты)",
    ],
  },
  {
    num: "04",
    problem: "Нужно внедрить систему и провести изменения в команде.",
    title: "Синтез: система + история",
    description:
      "Построить AI-решение и снять о нём фильм — в рамках одного проекта, с единым брифом. Без потери контекста на стыке. Без двойного управления. Без компромисса в качестве.",
    deliverables: [
      "Единый бриф и стратегия проекта",
      "Разработка AI-системы",
      "Фильм о системе для команды и стейкхолдеров",
      "Комплект материалов для запуска изменений",
    ],
    isMain: true,
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* Header */}
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-16 border-b border-[var(--border)]">
        <FadeIn>
          <p className="text-[11px] tracking-[0.2em] uppercase font-mono text-[var(--text-3)] mb-6">
            Задачи → решения
          </p>
          <h1
            className="font-medium tracking-[-0.03em] text-[var(--text-1)] mb-6 max-w-2xl"
            style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)", lineHeight: 1.1 }}
          >
            Мы не делаем видео и разработку как отдельные услуги.
            <span className="text-[var(--text-2)]"> Мы решаем задачи.</span>
          </h1>
          <p className="text-[var(--text-2)] leading-relaxed max-w-xl" style={{ fontSize: "clamp(0.9rem, 1.2vw, 1rem)" }}>
            Инструмент определяется задачей, не наоборот. Ниже — четыре типа
            задач, с которыми мы работаем.
          </p>
        </FadeIn>
      </section>

      {/* Tasks */}
      <section className="mx-auto max-w-6xl px-6 py-4">
        {TASKS.map(({ num, problem, title, description, deliverables, isMain }, i) => (
          <FadeIn key={num} delay={i * 0.05}>
            <div
              className={`py-14 border-b border-[var(--border)] ${
                isMain ? "bg-[var(--bg-surface)] -mx-6 px-6" : ""
              }`}
            >
              <div className="grid md:grid-cols-[80px_1fr_1fr] gap-6 md:gap-12">
                {/* Number */}
                <span className="text-[11px] tracking-[0.15em] font-mono text-[var(--text-3)] pt-1">
                  {num}
                  {isMain && (
                    <span className="block mt-2 text-[10px] tracking-[0.12em] uppercase text-[var(--text-3)]">
                      Ключевое
                    </span>
                  )}
                </span>

                {/* Left: problem + title + desc */}
                <div>
                  <p className="text-[var(--text-3)] text-sm mb-4 italic leading-relaxed">
                    «{problem}»
                  </p>
                  <h2
                    className="font-medium tracking-[-0.02em] text-[var(--text-1)] mb-4"
                    style={{ fontSize: "clamp(1.1rem, 1.8vw, 1.4rem)" }}
                  >
                    {title}
                  </h2>
                  <p className="text-sm text-[var(--text-2)] leading-relaxed">
                    {description}
                  </p>
                </div>

                {/* Right: deliverables */}
                <div className="flex flex-col gap-3">
                  <p className="text-[10px] tracking-[0.15em] uppercase font-mono text-[var(--text-3)] mb-1">
                    Что входит
                  </p>
                  {deliverables.map((d) => (
                    <p key={d} className="text-sm text-[var(--text-2)] leading-snug flex gap-3">
                      <span className="text-[var(--text-3)] shrink-0 mt-0.5">—</span>
                      {d}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        ))}
      </section>

      {/* CTA */}
      <div className="mx-auto max-w-6xl px-6 py-20">
        <FadeIn>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <p
              className="font-medium tracking-[-0.025em] text-[var(--text-1)] max-w-md"
              style={{ fontSize: "clamp(1.2rem, 2vw, 1.6rem)", lineHeight: 1.25 }}
            >
              Узнали свою задачу?{" "}
              <span className="text-[var(--text-2)]">Давайте обсудим.</span>
            </p>
            <Link
              href="/contact"
              className="shrink-0 px-7 py-3.5 bg-[var(--text-1)] text-[var(--bg-base)] text-sm font-medium rounded-full hover:bg-white transition-colors"
            >
              Написать →
            </Link>
          </div>
        </FadeIn>
      </div>
    </>
  );
}
