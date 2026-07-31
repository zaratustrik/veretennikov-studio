"use client";

import type { MetaData } from "@/types/investment-climate";
import { Reveal, Section } from "./shared";

const METHOD_POINTS: { title: string; text: string }[] = [
  {
    title: "Первоисточник зафиксирован",
    text: "Проект дорожной карты (DOCX, 43 строки) сверен по контрольной сумме SHA-256; все цитаты — из этой редакции.",
  },
  {
    title: "Построчный разбор",
    text: "Каждая из 43 строк проанализирована отдельно: текст мероприятия, KPI, сроки, ответственные, связь с критерием показателя.",
  },
  {
    title: "Проверка причинной цепочки",
    text: "Для каждой строки проверено, ведёт ли мероприятие к росту оценки показателя: «активность → результат для инвестора → оценка в опросе». Разрывы цепочки зафиксированы в карточках.",
  },
  {
    title: "Аудит KPI",
    text: "KPI классифицированы на показатели результата и показатели формальной активности (документы, встречи, публикации); составлен KPI-словарь.",
  },
  {
    title: "Бенчмаркинг",
    text: "Собраны практики 18 зарубежных юрисдикций (9 функций) и 6 российских регионов; для каждой оценена применимость и различаются «подтверждено» и «заявлено организацией».",
  },
  {
    title: "Матрица доказательств",
    text: "Каждое утверждение привязано к источнику; неподтверждённые независимо источники и данные помечены явно, гипотезы не выдаются за факты.",
  },
  {
    title: "Контекст рейтинга и экономики",
    text: "Динамика места региона (11 → 10 → 14) и показатели карты сопоставлены со средними по РФ и экономическим фоном (промышленное производство, инвестиции).",
  },
  {
    title: "Предложения с stop-критериями",
    text: "Новая редакция (30 строк, 5 блоков) и дополнительные меры содержат KPI результата, базовые и целевые значения, владельцев, горизонты и stop-критерии невыполнения.",
  },
];

export function MethodBlock({ meta }: { meta: MetaData }) {
  return (
    <Section
      id="method"
      title="Методика"
      lead="Как проводился аудит и какие ограничения имеют данные."
      printHidden
    >
      <div className="grid gap-3 md:grid-cols-2">
        {METHOD_POINTS.map((p, i) => (
          <Reveal key={p.title} delay={Math.min(i * 0.04, 0.25)}>
            <div className="ic-card h-full p-4">
              <div className="flex items-baseline gap-2.5">
                <span className="text-[13px] font-bold text-[var(--ic-accent)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-[14.5px] font-semibold">{p.title}</h3>
              </div>
              <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--ic-ink-2)]">
                {p.text}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-5">
        <div className="ic-card p-5">
          <h3 className="ic-h3 mb-2">Ограничения данных</h3>
          <ul className="space-y-1.5 text-[13.5px] text-[var(--ic-ink-2)]">
            {meta.dataCaveats.map((c) => (
              <li key={c} className="flex gap-2">
                <span aria-hidden className="mt-[8px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--ic-s-improve)]" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </Section>
  );
}
