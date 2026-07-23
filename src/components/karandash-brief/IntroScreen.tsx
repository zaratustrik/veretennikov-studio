"use client";

import { Clock, Save, CheckCircle2, Download } from "@/components/karandash-brief/icons";
import type { Answers, AnswerValue } from "@/types/karandash-brief";
import { introCopy, visionCards, visionQuestions } from "@/lib/karandash-brief/questions";
import { isVisible } from "@/lib/karandash-brief/values";
import { QuestionField } from "./QuestionField";
import { AccentButton, GhostButton, Card, Eyebrow } from "./ui";

const pointIcons = [Save, CheckCircle2, Download];

export function IntroScreen({
  answers,
  setAnswer,
  hasDraft,
  onStart,
  onContinue,
  invalidIds
}: {
  answers: Answers;
  setAnswer: (id: string, value: AnswerValue | undefined) => void;
  hasDraft: boolean;
  onStart: () => void;
  onContinue: () => void;
  invalidIds: Set<string>;
}) {
  return (
    <main className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
      <Eyebrow>Бриф для владельцев</Eyebrow>
      <h1 className="font-kbh text-[30px] font-bold leading-tight text-graphite sm:text-4xl">
        {introCopy.title}
      </h1>
      <p className="mt-4 text-base leading-7 text-secondary sm:text-lg">{introCopy.subtitle}</p>

      <div className="mt-6 flex items-center gap-2 rounded-lg bg-secondary-container px-4 py-2.5 text-sm font-medium text-primary">
        <Clock size={18} aria-hidden />
        Ориентировочное время заполнения: {introCopy.estimate}
      </div>

      <ul className="mt-6 grid gap-3 sm:grid-cols-3">
        {introCopy.points.map((point, i) => {
          const Icon = pointIcons[i] ?? CheckCircle2;
          return (
            <li key={point} className="flex gap-3 rounded-xl border border-line bg-white p-4 text-sm text-on-surface-variant">
              <Icon size={18} className="mt-0.5 shrink-0 text-primary" aria-hidden />
              {point}
            </li>
          );
        })}
      </ul>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <AccentButton onClick={onStart} className="w-full sm:w-auto">
          Начать заполнение
        </AccentButton>
        {hasDraft ? (
          <GhostButton onClick={onContinue} className="w-full sm:w-auto">
            Продолжить сохранённый черновик
          </GhostButton>
        ) : null}
      </div>

      <section className="mt-14" aria-labelledby="vision-heading">
        <h2 id="vision-heading" className="font-kbh text-2xl font-bold text-graphite">
          К чему мы стремимся
        </h2>
        <p className="mt-2 text-sm text-muted">
          Это наше предварительное видение. Подтвердите, измените или дополните его ниже.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {visionCards.map((card, index) => (
            <article key={card.title} className="rounded-2xl border border-line bg-white p-5 shadow-soft">
              <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-accent-yellow text-sm font-bold text-primary">
                {index + 1}
              </div>
              <h3 className="font-kbh text-base font-semibold text-graphite">{card.title}</h3>
              <p className="mt-2 text-sm leading-6 text-on-surface-variant">{card.text}</p>
            </article>
          ))}
        </div>

        <Card className="mt-6">
          <div className="space-y-6">
            {visionQuestions.map((q) =>
              isVisible(q, answers) ? (
                <QuestionField
                  key={q.id}
                  question={q}
                  value={answers[q.id]}
                  onChange={(v) => setAnswer(q.id, v)}
                  invalid={invalidIds.has(q.id)}
                />
              ) : null
            )}
          </div>
        </Card>
      </section>
    </main>
  );
}
