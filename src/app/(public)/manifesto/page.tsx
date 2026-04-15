import type { Metadata } from "next";
import Link from "next/link";
import FadeIn from "@/components/public/FadeIn";

export const metadata: Metadata = { title: "Манифест" };

const PRINCIPLES = [
  {
    num: "01",
    title: "Системы без истории остаются незапущенными.",
    body: "Хорошую AI-систему можно построить за месяц. Провести изменения в команде — за год. Технология не работает сама по себе: ей нужен нарратив, который люди примут. Мы работаем над обеими частями.",
  },
  {
    num: "02",
    title: "Истории без систем — красивые обещания.",
    body: "Корпоративный фильм — это инструмент. Он должен что-то делать: объяснять, убеждать, менять поведение. Если его можно убрать и ничего не изменится — он не нужен. Мы не снимаем для красоты.",
  },
  {
    num: "03",
    title: "Сложное не значит непонятное.",
    body: "Любую систему можно объяснить. Любой продукт можно показать. Это вопрос не упрощения — упрощение убивает суть. Это вопрос точности: найти правильный уровень детализации для конкретной аудитории.",
  },
  {
    num: "04",
    title: "Личная ответственность лучше корпоративной анонимности.",
    body: "Продюсер студии отвечает за каждый проект — за сроки, качество и соответствие задаче клиента. Создаёт его команда: разработчики, операторы, монтажёры, дизайнеры. Это не противоречие — это правильное разделение. Ответственность без анонимности, работа без одного человека на всё.",
  },
  {
    num: "05",
    title: "Процесс — это тоже продукт.",
    body: "Клиент не должен объяснять одно и то же дважды. Не должен искать правки в Telegram. Не должен гадать, на каком этапе проект. Профессиональный процесс — это не сервис сверх работы, это часть работы.",
  },
  {
    num: "06",
    title: "Меньше, но лучше.",
    body: "Мы не берём всё подряд. Лучше пять проектов в год, за которые не стыдно, чем двадцать, в которых уверены частично. Это не скромность — это уважение к клиенту и к себе.",
  },
];

export default function ManifestoPage() {
  return (
    <>
      {/* Header */}
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-20 border-b border-[var(--border)]">
        <FadeIn>
          <p className="text-[11px] tracking-[0.2em] uppercase font-mono text-[var(--text-3)] mb-8">
            Позиция
          </p>
          <h1
            className="font-medium tracking-[-0.03em] text-[var(--text-1)] mb-6 max-w-2xl"
            style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", lineHeight: 1.05 }}
          >
            Почему мы работаем
            <br />
            <span className="text-[var(--text-2)]">именно так.</span>
          </h1>
          <p className="text-[var(--text-2)] leading-relaxed max-w-lg" style={{ fontSize: "clamp(0.9rem, 1.2vw, 1rem)" }}>
            Шесть убеждений, которые определяют каждый проект студии.
          </p>
        </FadeIn>
      </section>

      {/* Principles */}
      <section className="mx-auto max-w-6xl px-6 py-4">
        {PRINCIPLES.map(({ num, title, body }, i) => (
          <FadeIn key={num} delay={i * 0.05}>
            <div className="border-b border-[var(--border)] py-12 grid md:grid-cols-[80px_1fr] gap-6 md:gap-12">
              <span className="text-[11px] tracking-[0.15em] font-mono text-[var(--text-3)] pt-1.5">
                {num}
              </span>
              <div>
                <h2
                  className="font-medium tracking-[-0.02em] text-[var(--text-1)] mb-4"
                  style={{ fontSize: "clamp(1.05rem, 1.6vw, 1.3rem)", lineHeight: 1.3 }}
                >
                  {title}
                </h2>
                <p className="text-sm text-[var(--text-2)] leading-[1.8] max-w-2xl">
                  {body}
                </p>
              </div>
            </div>
          </FadeIn>
        ))}
      </section>

      {/* Closing */}
      <section className="mx-auto max-w-6xl px-6 py-20 border-t border-[var(--border)] mt-4">
        <FadeIn>
          <div className="grid md:grid-cols-2 gap-12 items-end">
            <div>
              <p
                className="font-medium tracking-[-0.025em] text-[var(--text-1)] mb-3"
                style={{ fontSize: "clamp(1.2rem, 2vw, 1.6rem)", lineHeight: 1.3 }}
              >
                Это не декларация.
                <br />
                <span className="text-[var(--text-2)]">Это рабочие принципы.</span>
              </p>
              <p className="text-sm text-[var(--text-2)] leading-relaxed max-w-md">
                Каждый принцип стоит за конкретным решением: как мы строим
                процесс, что берём в работу, как отвечаем на сложные вопросы.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 md:justify-end">
              <Link
                href="/contact"
                className="px-7 py-3.5 bg-[var(--text-1)] text-[var(--bg-base)] text-sm font-medium rounded-full hover:bg-white transition-colors"
              >
                Обсудить проект
              </Link>
              <Link
                href="/about"
                className="px-7 py-3.5 border border-[var(--border-mid)] text-[var(--text-2)] text-sm rounded-full hover:text-[var(--text-1)] hover:border-[#3A3A3A] transition-colors"
              >
                О студии →
              </Link>
            </div>
          </div>
        </FadeIn>
      </section>
    </>
  );
}
