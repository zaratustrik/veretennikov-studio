"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SbAnswers, SbQuestion } from "@/lib/sobolek/questions";
import { sections, SB_SCHEMA_VERSION } from "@/lib/sobolek/questions";

const DRAFT_KEY = "sobolek-anketa-draft-v1";

type SubmitState =
  | { phase: "idle" }
  | { phase: "sending" }
  | { phase: "done" }
  | { phase: "error"; message: string };

function loadDraft(): SbAnswers {
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as { answers?: SbAnswers };
    return parsed.answers && typeof parsed.answers === "object" ? parsed.answers : {};
  } catch {
    return {};
  }
}

function saveDraft(answers: SbAnswers) {
  try {
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify({ v: SB_SCHEMA_VERSION, answers }));
  } catch {
    // квота/приватный режим — молча пропускаем, анкета работает и без черновика
  }
}

/* ── Мелкие строительные блоки ────────────────────────────────────── */

function OptionRow({
  type,
  name,
  value,
  checked,
  onChange,
}: {
  type: "checkbox" | "radio";
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label
      className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-4 py-2.5 transition-colors ${
        checked
          ? "border-[var(--sb-teal)] bg-[var(--sb-teal-tint)]"
          : "border-[var(--sb-line)] bg-white hover:border-[var(--sb-teal-soft)]"
      }`}
    >
      <input
        type={type}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="h-5 w-5 shrink-0 accent-[#12798c]"
      />
      <span className="text-[15px] leading-snug text-[var(--sb-brown)]">{value}</span>
    </label>
  );
}

function TextInput({
  id,
  value,
  placeholder,
  onChange,
}: {
  id: string;
  value: string;
  placeholder?: string;
  onChange: (v: string) => void;
}) {
  return (
    <input
      id={id}
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="h-12 w-full rounded-xl border border-[var(--sb-line)] bg-white px-4 text-[15px] text-[var(--sb-brown)] placeholder:text-[var(--sb-gray)]/60 focus:border-[var(--sb-teal)]"
    />
  );
}

/* ── Вопрос ───────────────────────────────────────────────────────── */

function QuestionField({
  q,
  answers,
  setAnswer,
}: {
  q: SbQuestion;
  answers: SbAnswers;
  setAnswer: (id: string, value: string | string[] | undefined) => void;
}) {
  const otherId = `${q.id}__other`;
  const otherValue = typeof answers[otherId] === "string" ? (answers[otherId] as string) : "";

  if (q.type === "multi") {
    const values = Array.isArray(answers[q.id]) ? (answers[q.id] as string[]) : [];
    const toggle = (option: string) => {
      const next = values.includes(option)
        ? values.filter((v) => v !== option)
        : [...values, option];
      setAnswer(q.id, next.length > 0 ? next : undefined);
    };
    return (
      <fieldset>
        <legend className="mb-3 text-[15px] font-semibold text-[var(--sb-brown)]">{q.label}</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {q.options.map((option) => (
            <OptionRow
              key={option}
              type="checkbox"
              name={q.id}
              value={option}
              checked={values.includes(option)}
              onChange={() => toggle(option)}
            />
          ))}
        </div>
        {q.other && (
          <div className="mt-2">
            <label htmlFor={otherId} className="mb-1.5 block text-sm text-[var(--sb-gray)]">
              Другое
            </label>
            <TextInput
              id={otherId}
              value={otherValue}
              placeholder="Свой вариант"
              onChange={(v) => setAnswer(otherId, v || undefined)}
            />
          </div>
        )}
      </fieldset>
    );
  }

  if (q.type === "single") {
    const value = typeof answers[q.id] === "string" ? (answers[q.id] as string) : "";
    return (
      <fieldset>
        <legend className="mb-3 text-[15px] font-semibold text-[var(--sb-brown)]">{q.label}</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {q.options.map((option) => (
            <OptionRow
              key={option}
              type="radio"
              name={q.id}
              value={option}
              checked={value === option}
              onChange={() => setAnswer(q.id, option)}
            />
          ))}
        </div>
        {q.other && (
          <div className="mt-2">
            <label htmlFor={otherId} className="mb-1.5 block text-sm text-[var(--sb-gray)]">
              Уточнение
            </label>
            <TextInput
              id={otherId}
              value={otherValue}
              placeholder="Например, название среды"
              onChange={(v) => setAnswer(otherId, v || undefined)}
            />
          </div>
        )}
      </fieldset>
    );
  }

  const value = typeof answers[q.id] === "string" ? (answers[q.id] as string) : "";

  if (q.type === "textarea") {
    return (
      <div>
        <label htmlFor={q.id} className="mb-3 block text-[15px] font-semibold text-[var(--sb-brown)]">
          {q.label}
        </label>
        <textarea
          id={q.id}
          value={value}
          placeholder={q.placeholder}
          rows={4}
          onChange={(e) => setAnswer(q.id, e.target.value || undefined)}
          className="w-full rounded-xl border border-[var(--sb-line)] bg-white px-4 py-3 text-[15px] text-[var(--sb-brown)] placeholder:text-[var(--sb-gray)]/60 focus:border-[var(--sb-teal)]"
        />
      </div>
    );
  }

  return (
    <div>
      <label htmlFor={q.id} className="mb-3 block text-[15px] font-semibold text-[var(--sb-brown)]">
        {q.label}
      </label>
      <TextInput
        id={q.id}
        value={value}
        placeholder={q.placeholder}
        onChange={(v) => setAnswer(q.id, v || undefined)}
      />
    </div>
  );
}

/* ── Анкета ───────────────────────────────────────────────────────── */

export function SobolekForm() {
  const [answers, setAnswers] = useState<SbAnswers>({});
  const [consent, setConsent] = useState(false); // 152-ФЗ: в черновик не пишем
  const [honeypot, setHoneypot] = useState("");
  const [submit, setSubmit] = useState<SubmitState>({ phase: "idle" });
  const hydrated = useRef(false);

  useEffect(() => {
    let active = true;
    // Черновик читается из localStorage после маунта (на сервере его нет);
    // микрозадача выводит setState из тела эффекта.
    Promise.resolve().then(() => {
      if (!active) return;
      const draft = loadDraft();
      if (Object.keys(draft).length > 0) setAnswers(draft);
      hydrated.current = true;
    });
    return () => {
      active = false;
    };
  }, []);

  // Автосохранение черновика (debounce)
  useEffect(() => {
    if (!hydrated.current) return;
    const t = setTimeout(() => saveDraft(answers), 500);
    return () => clearTimeout(t);
  }, [answers]);

  const setAnswer = useCallback((id: string, value: string | string[] | undefined) => {
    setAnswers((prev) => {
      const next = { ...prev };
      if (value === undefined) delete next[id];
      else next[id] = value;
      return next;
    });
  }, []);

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      // Защита от повторной отправки: кнопка уже disabled, но Enter в поле
      // или двойной клик до ре-рендера не должны создать дубликат.
      if (submit.phase === "sending") return;
      if (Object.keys(answers).length === 0) {
        setSubmit({ phase: "error", message: "Отметьте хотя бы один ответ — иначе нам не с чем работать." });
        return;
      }
      if (!consent) {
        setSubmit({
          phase: "error",
          message: "Для отправки отметьте согласие на обработку персональных данных.",
        });
        return;
      }
      setSubmit({ phase: "sending" });
      try {
        const res = await fetch("/api/sobolek-brief", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ v: SB_SCHEMA_VERSION, answers, consent, website: honeypot }),
        });
        const data = (await res.json().catch(() => ({}))) as {
          ok?: boolean;
          delivered?: boolean;
          reason?: string;
          error?: string;
        };

        if (res.ok && data.ok) {
          // Ответы намеренно не стираем: черновик остаётся доступен.
          setSubmit({ phase: "done" });
          return;
        }
        if (res.status === 429) {
          setSubmit({
            phase: "error",
            message: "Слишком много попыток отправки. Подождите пару минут и попробуйте снова.",
          });
        } else if (data.reason === "telegram_not_configured" || data.reason === "telegram_error") {
          setSubmit({
            phase: "error",
            message:
              "Не получилось доставить анкету автоматически. Ответы сохранены в этом браузере — попробуйте отправить позже или напишите нам напрямую.",
          });
        } else {
          setSubmit({
            phase: "error",
            message: data.error || "Не удалось отправить анкету. Попробуйте ещё раз чуть позже.",
          });
        }
      } catch {
        setSubmit({
          phase: "error",
          message: "Ошибка сети. Ответы сохранены в этом браузере — попробуйте отправить ещё раз.",
        });
      }
    },
    [answers, consent, honeypot, submit.phase]
  );

  if (submit.phase === "done") {
    return (
      <div className="rounded-2xl border border-[var(--sb-teal-soft)] bg-[var(--sb-teal-tint)] p-8 text-center sm:p-10">
        <span className="sb-diamond mb-5 !h-3 !w-3" aria-hidden />
        <h3 className="sb-heading text-xl font-bold sm:text-2xl">Анкета отправлена</h3>
        <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-[var(--sb-gray)]">
          Спасибо. Мы изучим ответы и вернёмся с уточнёнными предложениями по составу работ.
          Ваши отметки сохранены в этом браузере — при необходимости к ним можно вернуться.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="space-y-10">
        {sections.map((section, i) => (
          <section
            key={section.id}
            aria-labelledby={`sb-fs-${section.id}`}
            className="rounded-2xl border border-[var(--sb-line)] bg-white/70 p-5 sm:p-7"
          >
            <div className="mb-5 flex items-baseline gap-3">
              <span className="idx text-sm text-[var(--sb-teal-deep)]">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 id={`sb-fs-${section.id}`} className="sb-heading text-lg font-bold sm:text-xl">
                  {section.title}
                </h3>
                {section.note && <p className="mt-1 text-sm text-[var(--sb-gray)]">{section.note}</p>}
              </div>
            </div>
            <div className="space-y-7">
              {section.questions.map((q) => (
                <QuestionField key={q.id} q={q} answers={answers} setAnswer={setAnswer} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Honeypot — скрытое от людей поле против ботов */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        name="website"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
      />

      <div className="mt-8 space-y-5 border-t border-[var(--sb-line)] pt-7">
        {/* 152-ФЗ: согласие на обработку ПДн — снято по умолчанию, обязательно */}
        <label className="flex max-w-2xl cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 h-5 w-5 shrink-0 accent-[#12798c]"
          />
          <span className="text-[13px] leading-relaxed text-[var(--sb-gray)]">
            Я даю{" "}
            <a
              href="/consent"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--sb-teal-deep)] underline underline-offset-2"
            >
              согласие на обработку персональных данных
            </a>{" "}
            на условиях{" "}
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--sb-teal-deep)] underline underline-offset-2"
            >
              Политики обработки персональных данных
            </a>
            . Контактные данные в анкете можно не указывать.
          </span>
        </label>

        {submit.phase === "error" && (
          <p role="alert" className="max-w-2xl rounded-xl bg-[#fdf1ee] px-4 py-3 text-sm text-[#9c3c22]">
            {submit.message}
          </p>
        )}

        <button
          type="submit"
          disabled={submit.phase === "sending"}
          className="inline-flex h-13 min-h-12 items-center justify-center rounded-full bg-[var(--sb-teal)] px-8 text-[15px] font-semibold text-white transition-colors hover:bg-[var(--sb-teal-deep)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submit.phase === "sending" ? "Отправляем…" : "Отправить анкету"}
        </button>
        <p className="text-sm text-[var(--sb-gray)]">
          Черновик сохраняется в вашем браузере автоматически — анкету можно заполнить в несколько подходов.
        </p>
      </div>
    </form>
  );
}
