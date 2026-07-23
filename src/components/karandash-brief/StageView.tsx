"use client";

import { useEffect, useRef } from "react";
import { AlertCircle } from "@/components/karandash-brief/icons";
import type { Answers, AnswerValue, Stage } from "@/types/karandash-brief";
import { isVisible } from "@/lib/karandash-brief/values";
import { QuestionField } from "./QuestionField";
import { Card } from "./ui";

export function StageView({
  stage,
  stageNumber,
  answers,
  setAnswer,
  invalidIds
}: {
  stage: Stage;
  stageNumber: number;
  answers: Answers;
  setAnswer: (id: string, value: AnswerValue | undefined) => void;
  invalidIds: Set<string>;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  // при смене раздела переносим фокус на заголовок (клавиатурная доступность)
  useEffect(() => {
    headingRef.current?.focus();
  }, [stage.id]);

  return (
    <section aria-labelledby={`stage-${stage.id}`}>
      <p className="text-xs font-semibold uppercase tracking-wider text-redBrand">
        Раздел {stageNumber}
      </p>
      <h2
        id={`stage-${stage.id}`}
        ref={headingRef}
        tabIndex={-1}
        className="mt-1 font-kbh text-2xl font-bold text-graphite outline-none sm:text-3xl"
      >
        {stage.title}
      </h2>
      {stage.intro ? <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">{stage.intro}</p> : null}

      {stage.note ? (
        <div className="mt-5 flex gap-3 rounded-xl border border-accent-yellow/50 bg-accent-yellow/10 p-4">
          <AlertCircle size={20} className="mt-0.5 shrink-0 text-primary" aria-hidden />
          <p className="text-sm font-medium text-graphite">{stage.note}</p>
        </div>
      ) : null}

      <div className="mt-6 space-y-5">
        {stage.questions.map((q) =>
          isVisible(q, answers) ? (
            <Card key={q.id}>
              <QuestionField
                question={q}
                value={answers[q.id]}
                onChange={(v) => setAnswer(q.id, v)}
                invalid={invalidIds.has(q.id)}
              />
            </Card>
          ) : null
        )}
      </div>
    </section>
  );
}
