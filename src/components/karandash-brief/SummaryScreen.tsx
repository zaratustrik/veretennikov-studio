"use client";

import { Download, FileJson, Send, Pencil, AlertTriangle } from "@/components/karandash-brief/icons";
import type { Answers } from "@/types/karandash-brief";
import { stages } from "@/lib/karandash-brief/questions";
import { answerToDisplay, completionPercent, isAnswered, isVisible } from "@/lib/karandash-brief/values";
import { buildSummary, importantMissing } from "@/lib/karandash-brief/summary";
import { Card, PrimaryButton, GhostButton, AccentButton, Eyebrow } from "./ui";

export function SummaryScreen({
  answers,
  onEditStage,
  onDownloadMd,
  onDownloadJson,
  onSubmit,
  submitting,
  submitMessage,
  submitTone
}: {
  answers: Answers;
  onEditStage: (index: number) => void;
  onDownloadMd: () => void;
  onDownloadJson: () => void;
  onSubmit: () => void;
  submitting: boolean;
  submitMessage: string | null;
  submitTone: "info" | "error";
}) {
  const completion = completionPercent(answers);
  const summary = buildSummary(answers);
  const missing = importantMissing(answers);
  const contacts = answerToDisplay(
    { id: "respondent_contacts", type: "contacts", label: "" },
    answers["respondent_contacts"]
  );

  return (
    <main className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
      <Eyebrow>Проверка перед отправкой</Eyebrow>
      <h1 className="font-kbh text-[28px] font-bold leading-tight text-graphite sm:text-4xl">
        Итог брифа
      </h1>
      <p className="mt-3 text-secondary">
        Проверьте ключевые решения и при необходимости вернитесь к любому разделу. Скачать файлы можно в
        любой момент — даже если бриф заполнен не полностью.
      </p>

      <div className="mt-6 flex items-center gap-4 rounded-2xl border border-line bg-white p-5 shadow-soft">
        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
          <span className="font-kbh text-xl font-bold text-primary">{completion}%</span>
        </div>
        <div>
          <p className="font-semibold text-graphite">Заполнено {completion}%</p>
          <p className="text-sm text-muted">
            Контакт для связи: {Array.isArray(contacts) ? contacts.join(", ") : contacts ?? "Не указан"}
          </p>
        </div>
      </div>

      {/* Ключевые решения */}
      <Card className="mt-6">
        <h2 className="font-kbh text-lg font-bold text-graphite">Ключевые решения</h2>
        <dl className="mt-4 space-y-3">
          {Object.entries(summary).map(([key, value]) => (
            <div key={key} className="grid gap-1 sm:grid-cols-[240px_1fr]">
              <dt className="text-sm font-medium text-muted">{key}</dt>
              <dd className="text-sm text-on-surface">{value}</dd>
            </div>
          ))}
        </dl>
      </Card>

      {/* Важные пропуски */}
      {missing.length > 0 ? (
        <div className="mt-6 rounded-2xl border border-accent-yellow/60 bg-accent-yellow/10 p-5">
          <div className="flex items-center gap-2 font-semibold text-graphite">
            <AlertTriangle size={18} aria-hidden />
            Незаполненные важные вопросы
          </div>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-on-surface-variant">
            {missing.map((m) => (
              <li key={m.id}>{m.label}</li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted">
            Это не блокирует отправку — можно отправить как есть или дополнить позже.
          </p>
        </div>
      ) : null}

      {/* Разделы */}
      <div className="mt-8 space-y-4">
        {stages.map((stage, index) => {
          const visible = stage.questions.filter((q) => isVisible(q, answers));
          const answered = visible.filter((q) => isAnswered(q, answers[q.id]));
          return (
            <Card key={stage.id}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                    Раздел {index + 1}
                  </p>
                  <h3 className="font-kbh text-base font-bold text-graphite">{stage.title}</h3>
                  <p className="mt-1 text-sm text-muted">
                    Отвечено {answered.length} из {visible.length}
                  </p>
                </div>
                <GhostButton onClick={() => onEditStage(index)} className="shrink-0 px-4 py-2 text-sm">
                  <Pencil size={16} aria-hidden /> Изменить
                </GhostButton>
              </div>
              {answered.length > 0 ? (
                <dl className="mt-4 space-y-2 border-t border-line pt-4">
                  {answered.map((q) => {
                    const d = answerToDisplay(q, answers[q.id]);
                    return (
                      <div key={q.id} className="grid gap-0.5 sm:grid-cols-[1fr_1fr]">
                        <dt className="text-sm text-muted">{q.label}</dt>
                        <dd className="text-sm text-on-surface">
                          {Array.isArray(d) ? d.join(", ") : d}
                        </dd>
                      </div>
                    );
                  })}
                </dl>
              ) : null}
            </Card>
          );
        })}
      </div>

      {/* Действия */}
      <div className="mt-8 rounded-2xl border border-line bg-white p-5 shadow-soft sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <GhostButton onClick={onDownloadMd}>
            <Download size={18} aria-hidden /> Скачать Markdown
          </GhostButton>
          <GhostButton onClick={onDownloadJson}>
            <FileJson size={18} aria-hidden /> Скачать JSON
          </GhostButton>
          <AccentButton onClick={onSubmit} disabled={submitting} className="sm:ml-auto">
            <Send size={18} aria-hidden />
            {submitting ? "Отправляем…" : "Отправить заполненный бриф"}
          </AccentButton>
        </div>
        {submitMessage ? (
          <p
            className={`mt-4 text-sm font-medium ${
              submitTone === "error" ? "text-redBrand" : "text-on-surface-variant"
            }`}
            role="alert"
          >
            {submitMessage}
          </p>
        ) : null}
      </div>
    </main>
  );
}
