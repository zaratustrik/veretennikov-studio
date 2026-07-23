"use client";

import { useId } from "react";
import type { AnswerValue, Question } from "@/types/karandash-brief";
import { OTHER_LABEL } from "@/lib/karandash-brief/values";

type Props = {
  question: Question;
  value: AnswerValue | undefined;
  onChange: (value: AnswerValue | undefined) => void;
  invalid?: boolean;
};

const inputClass =
  "w-full rounded-lg border border-outline-variant bg-white px-4 py-3 text-on-surface outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-secondary-container";

export function QuestionField({ question, value, onChange, invalid }: Props) {
  const baseId = useId();
  const describedBy = question.help ? `${baseId}-help` : undefined;
  const errorId = invalid ? `${baseId}-error` : undefined;

  return (
    <div className="space-y-2">
      <FieldLabel question={question} htmlFor={fieldControlId(question, baseId)} />
      {question.help ? (
        <p id={describedBy} className="text-sm text-muted">
          {question.help}
        </p>
      ) : null}

      <FieldControl
        question={question}
        value={value}
        onChange={onChange}
        baseId={baseId}
        describedBy={describedBy}
        errorId={errorId}
        invalid={invalid}
      />

      {invalid ? (
        <p id={errorId} className="text-sm font-medium text-redBrand" role="alert">
          {question.type === "contacts" ? "Укажите хотя бы один контакт" : "Заполните это поле"}
        </p>
      ) : null}
    </div>
  );
}

function fieldControlId(question: Question, baseId: string): string | undefined {
  // только для полей с единственным нативным контролом
  if (question.type === "text" || question.type === "textarea") return `${baseId}-input`;
  return undefined;
}

function FieldLabel({ question, htmlFor }: { question: Question; htmlFor?: string }) {
  const text = (
    <>
      {question.label}
      {question.required ? <span className="ml-1 text-redBrand">*</span> : null}
    </>
  );
  const groupTypes = ["single", "multi", "contacts", "numberPair"];
  if (groupTypes.includes(question.type)) {
    // для групп подпись задаётся через <legend> внутри контрола
    return <span className="block font-semibold text-graphite">{text}</span>;
  }
  return (
    <label htmlFor={htmlFor} className="block font-semibold text-graphite">
      {text}
    </label>
  );
}

function FieldControl({
  question,
  value,
  onChange,
  baseId,
  describedBy,
  errorId,
  invalid
}: Props & { baseId: string; describedBy?: string; errorId?: string }) {
  const aria = {
    "aria-describedby": describedBy,
    "aria-invalid": invalid || undefined,
    "aria-errormessage": errorId
  };

  switch (question.type) {
    case "text":
      return (
        <input
          id={`${baseId}-input`}
          type="text"
          className={inputClass}
          placeholder={question.placeholder}
          value={value?.kind === "text" ? value.text : ""}
          onChange={(e) => onChange(e.target.value ? { kind: "text", text: e.target.value } : undefined)}
          {...aria}
        />
      );
    case "textarea":
      return (
        <textarea
          id={`${baseId}-input`}
          rows={4}
          className={inputClass}
          placeholder={question.placeholder}
          value={value?.kind === "text" ? value.text : ""}
          onChange={(e) => onChange(e.target.value ? { kind: "text", text: e.target.value } : undefined)}
          {...aria}
        />
      );
    case "single":
      return (
        <SingleControl question={question} value={value} onChange={onChange} aria={aria} baseId={baseId} />
      );
    case "multi":
      return (
        <MultiControl question={question} value={value} onChange={onChange} aria={aria} baseId={baseId} />
      );
    case "contacts":
      return <ContactsControl value={value} onChange={onChange} aria={aria} baseId={baseId} />;
    case "numberPair":
      return (
        <NumberPairControl question={question} value={value} onChange={onChange} aria={aria} baseId={baseId} />
      );
    default:
      return null;
  }
}

type AriaProps = {
  "aria-describedby"?: string;
  "aria-invalid"?: true | undefined;
  "aria-errormessage"?: string;
};

function SingleControl({
  question,
  value,
  onChange,
  aria,
  baseId
}: {
  question: Extract<Question, { type: "single" }>;
  value: AnswerValue | undefined;
  onChange: (v: AnswerValue | undefined) => void;
  aria: AriaProps;
  baseId: string;
}) {
  const current = value?.kind === "single" ? value : undefined;
  const options = question.allowOther ? [...question.options, OTHER_LABEL] : question.options;

  return (
    <fieldset {...aria} className="space-y-2">
      <legend className="sr-only">{question.label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const selected = current?.value === opt;
          return (
            <label
              key={opt}
              className={`cursor-pointer rounded-lg border px-4 py-2.5 text-sm transition-colors ${
                selected
                  ? "border-primary bg-secondary-container font-semibold text-primary"
                  : "border-outline-variant bg-white text-on-surface hover:border-primary/40"
              }`}
            >
              <input
                type="radio"
                name={`${baseId}-single`}
                className="sr-only"
                checked={selected}
                onChange={() => onChange({ kind: "single", value: opt, other: current?.other })}
              />
              {opt}
            </label>
          );
        })}
      </div>
      {question.allowOther && current?.value === OTHER_LABEL ? (
        <input
          type="text"
          className={inputClass}
          placeholder="Уточните"
          value={current.other ?? ""}
          onChange={(e) => onChange({ kind: "single", value: OTHER_LABEL, other: e.target.value })}
          aria-label={`${question.label}: уточнение`}
        />
      ) : null}
    </fieldset>
  );
}

function MultiControl({
  question,
  value,
  onChange,
  aria,
  baseId
}: {
  question: Extract<Question, { type: "multi" }>;
  value: AnswerValue | undefined;
  onChange: (v: AnswerValue | undefined) => void;
  aria: AriaProps;
  baseId: string;
}) {
  const current = value?.kind === "multi" ? value : undefined;
  const selectedValues = current?.values ?? [];
  const options = question.allowOther ? [...question.options, OTHER_LABEL] : question.options;
  const atMax = question.maxSelections ? selectedValues.length >= question.maxSelections : false;

  function toggle(opt: string) {
    const has = selectedValues.includes(opt);
    let next: string[];
    if (has) {
      next = selectedValues.filter((v) => v !== opt);
    } else {
      if (atMax) return;
      next = [...selectedValues, opt];
    }
    if (next.length === 0 && !current?.other) {
      onChange(undefined);
      return;
    }
    onChange({ kind: "multi", values: next, other: current?.other });
  }

  return (
    <fieldset {...aria} className="space-y-2">
      <legend className="sr-only">{question.label}</legend>
      {question.maxSelections ? (
        <p className="text-xs text-muted" aria-live="polite">
          Выбрано {selectedValues.length} из {question.maxSelections}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const selected = selectedValues.includes(opt);
          const disabled = !selected && atMax;
          return (
            <label
              key={opt}
              className={`rounded-lg border px-4 py-2.5 text-sm transition-colors ${
                selected
                  ? "border-primary bg-secondary-container font-semibold text-primary"
                  : disabled
                    ? "cursor-not-allowed border-outline-variant bg-surface-container-low text-muted opacity-60"
                    : "cursor-pointer border-outline-variant bg-white text-on-surface hover:border-primary/40"
              }`}
            >
              <input
                type="checkbox"
                name={`${baseId}-multi`}
                className="sr-only"
                checked={selected}
                disabled={disabled}
                onChange={() => toggle(opt)}
              />
              {opt}
            </label>
          );
        })}
      </div>
      {question.allowOther && selectedValues.includes(OTHER_LABEL) ? (
        <input
          type="text"
          className={inputClass}
          placeholder="Уточните"
          value={current?.other ?? ""}
          onChange={(e) =>
            onChange({ kind: "multi", values: selectedValues, other: e.target.value })
          }
          aria-label={`${question.label}: уточнение`}
        />
      ) : null}
    </fieldset>
  );
}

function ContactsControl({
  value,
  onChange,
  aria,
  baseId
}: {
  value: AnswerValue | undefined;
  onChange: (v: AnswerValue | undefined) => void;
  aria: AriaProps;
  baseId: string;
}) {
  const current = value?.kind === "contacts" ? value : { kind: "contacts" as const };

  function update(patch: Partial<Omit<typeof current, "kind">>) {
    const next = { ...current, ...patch, kind: "contacts" as const };
    const empty = !next.phone?.trim() && !next.email?.trim() && !next.telegram?.trim();
    onChange(empty ? undefined : next);
  }

  const fields: Array<{ key: "phone" | "email" | "telegram"; label: string; type: string; placeholder: string }> = [
    { key: "phone", label: "Телефон", type: "tel", placeholder: "+7 (___) ___-__-__" },
    { key: "email", label: "Email", type: "email", placeholder: "mail@example.ru" },
    { key: "telegram", label: "Telegram", type: "text", placeholder: "@username" }
  ];

  return (
    <fieldset {...aria} className="grid gap-3 sm:grid-cols-3">
      <legend className="sr-only">Контакты</legend>
      {fields.map((f) => (
        <label key={f.key} className="block">
          <span className="mb-1 block text-sm text-muted">{f.label}</span>
          <input
            id={`${baseId}-${f.key}`}
            type={f.type}
            className={inputClass}
            placeholder={f.placeholder}
            value={current[f.key] ?? ""}
            onChange={(e) => update({ [f.key]: e.target.value })}
          />
        </label>
      ))}
    </fieldset>
  );
}

function NumberPairControl({
  question,
  value,
  onChange,
  aria,
  baseId
}: {
  question: Extract<Question, { type: "numberPair" }>;
  value: AnswerValue | undefined;
  onChange: (v: AnswerValue | undefined) => void;
  aria: AriaProps;
  baseId: string;
}) {
  const current = value?.kind === "numberPair" ? value : { kind: "numberPair" as const };

  function update(patch: { a?: string; b?: string }) {
    const next = { ...current, ...patch, kind: "numberPair" as const };
    const empty = !next.a?.trim() && !next.b?.trim();
    onChange(empty ? undefined : next);
  }

  return (
    <fieldset {...aria} className="grid gap-3 sm:grid-cols-2">
      <legend className="sr-only">{question.label}</legend>
      {(["a", "b"] as const).map((key) => (
        <label key={key} className="block">
          <span className="mb-1 block text-sm text-muted">
            {key === "a" ? question.aLabel : question.bLabel}
          </span>
          <div className="flex items-center gap-2">
            <input
              id={`${baseId}-${key}`}
              type="text"
              inputMode="numeric"
              className={inputClass}
              value={current[key] ?? ""}
              onChange={(e) => update({ [key]: e.target.value })}
            />
            {question.suffix ? <span className="text-muted">{question.suffix}</span> : null}
          </div>
        </label>
      ))}
    </fieldset>
  );
}
