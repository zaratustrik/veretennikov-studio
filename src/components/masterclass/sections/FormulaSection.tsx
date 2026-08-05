"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "../gsapSetup";
import { ease, motion } from "../motion";
import { formula } from "../content.ru";
import { track } from "../analytics";

type Props = {
  lite: boolean;
  ready: boolean;
};

type SlotValues = Record<string, string>;

const STORAGE_KEY = "mc-prompt-builder-v1";

function loadValues(): SlotValues {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SlotValues) : {};
  } catch {
    return {};
  }
}

export default function FormulaSection({ lite, ready }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const [values, setValues] = useState<SlotValues>({});
  const [open, setOpen] = useState<string | null>(formula.slots[0].id);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setValues(loadValues()), 0);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
    } catch {
      /* приватный режим — просто без сохранения */
    }
  }, [values]);

  // мягкое появление секции
  useEffect(() => {
    if (!ready || lite || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".mc-slot", {
        opacity: 0,
        y: 14,
        duration: motion.base,
        stagger: motion.staggerTight,
        ease: ease.ui,
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
      });
      gsap.from(".mc-builder-preview", {
        opacity: 0,
        y: 18,
        duration: motion.slow,
        ease: ease.ui,
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [ready, lite]);

  const filled = formula.slots.filter((s) => (values[s.id] ?? "").trim().length > 0);

  const assembled = filled.length
    ? filled.map((s) => `${s.name}: ${values[s.id].trim()}`).join("\n")
    : "";

  const fillDemo = () => {
    const demo: SlotValues = {};
    formula.slots.forEach((s) => {
      demo[s.id] = s.example;
    });
    setValues(demo);
    track("mc_prompt_builder_demo");
  };

  const clearAll = () => {
    setValues({});
    setCopied(false);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(assembled);
      setCopied(true);
      track("mc_prompt_builder_copy");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard может быть запрещён — молча */
    }
  };

  useEffect(() => {
    if (filled.length === formula.slots.length) track("mc_prompt_builder_complete");
  }, [filled.length]);

  return (
    <section ref={sectionRef} id="delegate-formula" className="mc-section mc-section--calm" aria-labelledby="formula-title">
      <p className="mc-eyebrow" style={{ color: "var(--accent-delegate)" }}>
        {formula.eyebrow}
      </p>
      <h2 id="formula-title" className="mc-h2" style={{ marginTop: "0.7rem" }}>
        {formula.title}
      </h2>
      <p className="mc-lead" style={{ marginTop: "1rem" }}>
        {formula.lead}
      </p>

      <div className="mc-builder">
        <div className="mc-builder-slots" role="list" aria-label="Восемь компонентов рабочего поручения">
          {formula.slots.map((s) => {
            const isOpen = open === s.id;
            return (
              <div key={s.id} className="mc-slot" role="listitem" data-open={isOpen} data-filled={Boolean((values[s.id] ?? "").trim())}>
                <button
                  type="button"
                  className="mc-slot-head"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : s.id)}
                >
                  <span className="mc-slot-name">{s.name}</span>
                  <span className="mc-slot-hint">{s.hint}</span>
                </button>
                {isOpen ? (
                  <textarea
                    value={values[s.id] ?? ""}
                    placeholder={s.example}
                    aria-label={`${s.name} — ${s.hint}`}
                    onChange={(e) => setValues((v) => ({ ...v, [s.id]: e.target.value }))}
                  />
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="mc-builder-preview">
          <h3>
            Поручение · {filled.length}/{formula.slots.length}
          </h3>
          <div className="mc-builder-text" aria-live="polite">
            {assembled || "Заполните компоненты — поручение соберётся здесь."}
          </div>
          <div className="mc-builder-actions">
            <button type="button" className="mc-btn mc-btn-ghost mc-btn-small" onClick={fillDemo}>
              Пример
            </button>
            <button type="button" className="mc-btn mc-btn-ghost mc-btn-small" onClick={clearAll}>
              Очистить
            </button>
            <button type="button" className="mc-btn mc-btn-primary mc-btn-small" onClick={copy} disabled={!assembled}>
              {copied ? "Скопировано ✓" : "Скопировать"}
            </button>
          </div>
          <p className="mc-privacy-note">Ответы сохраняются только в этом браузере и никуда не отправляются.</p>
        </div>
      </div>
    </section>
  );
}
