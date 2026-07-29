"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap, ScrollTrigger } from "../gsapSetup";
import { ease, motion } from "../motion";
import { finale, hero, stepColors } from "../content.ru";
import { sceneStore } from "../sceneStore";
import { track } from "../analytics";

type Props = {
  lite: boolean;
  ready: boolean;
};

type PilotValues = Record<string, string>;

const STORAGE_KEY = "mc-pilot-card-v1";

function loadValues(): PilotValues {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PilotValues) : {};
  } catch {
    return {};
  }
}

function toMarkdown(values: PilotValues): string {
  const lines = ["# Мой первый ИИ-пилот", ""];
  finale.pilotFields.forEach((f) => {
    lines.push(`## ${f.name}`);
    lines.push((values[f.id] ?? "").trim() || "—");
    lines.push("");
  });
  lines.push("_Методика 4П: Понять · Поручить · Проверить · Перестроить_");
  lines.push("_https://veretennikov.info/ai-masterclass_");
  return lines.join("\n");
}

export default function FinaleSection({ lite, ready }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const [values, setValues] = useState<PilotValues>({});
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setValues(loadValues()), 0);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
    } catch {
      /* приватный режим */
    }
  }, [values]);

  const filledCount = finale.pilotFields.filter((f) => (values[f.id] ?? "").trim()).length;

  useEffect(() => {
    if (filledCount === finale.pilotFields.length) track("mc_pilot_card_complete");
  }, [filledCount]);

  // возвращение hero-сети: история визуально замыкается
  useEffect(() => {
    if (!ready || lite || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: "#finale-main",
        start: "top 80%",
        end: "bottom top",
        scrub: motion.scrubSoft,
        onUpdate: (self) => {
          sceneStore.fade = Math.min(1, self.progress * 1.4);
          sceneStore.heroProgress = Math.max(0, 0.6 - self.progress * 0.6);
        },
      });
      gsap.from("#finale-main", {
        opacity: 0,
        y: 24,
        duration: motion.cinematic,
        ease: ease.major,
        scrollTrigger: { trigger: "#finale-main", start: "top 72%" },
      });
      gsap.from(".mc-final-step", {
        opacity: 0,
        y: 16,
        duration: motion.base,
        stagger: 0.14,
        ease: ease.ui,
        scrollTrigger: { trigger: ".mc-final-steps", start: "top 78%" },
      });
      gsap.from(".mc-final-words span", {
        opacity: 0,
        y: 10,
        duration: motion.slow,
        stagger: 0.12,
        ease: ease.ui,
        scrollTrigger: { trigger: ".mc-final-words", start: "top 85%" },
      });
      ScrollTrigger.create({
        trigger: ".mc-final-footer",
        start: "top 90%",
        once: true,
        onEnter: () => track("mc_finished"),
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [ready, lite]);

  const fillDemo = () => {
    const demo: PilotValues = {};
    finale.pilotFields.forEach((f) => {
      demo[f.id] = f.demo;
    });
    setValues(demo);
  };

  const clearAll = () => setValues({});

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(toMarkdown(values));
      setCopied(true);
      track("mc_pilot_card_copy");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard недоступен */
    }
  };

  const exportMd = () => {
    const blob = new Blob([toMarkdown(values)], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "moi-pervyi-ii-pilot.md";
    a.click();
    URL.revokeObjectURL(url);
    track("mc_pilot_card_export");
  };

  return (
    <section ref={sectionRef} id="finale" className="mc-section" aria-labelledby="pilot-title">
      {/* Практика */}
      <div className="mc-center">
        <p className="mc-eyebrow" style={{ color: "var(--accent-delegate)" }}>
          {finale.eyebrow}
        </p>
        <h2 id="pilot-title" className="mc-h2">
          {finale.titlePilot}
        </h2>
        <p className="mc-lead">Одна повторяющаяся задача — восемь коротких ответов.</p>
      </div>

      <div className="mc-pilot">
        <div className="mc-pilot-fields" aria-label="Поля карточки ИИ-пилота">
          {finale.pilotFields.map((f) => (
            <div key={f.id} className="mc-pilot-field">
              <label htmlFor={`pilot-${f.id}`}>
                {f.name}
                <span>{f.hint}</span>
              </label>
              <textarea
                id={`pilot-${f.id}`}
                value={values[f.id] ?? ""}
                placeholder={f.demo}
                onChange={(e) => setValues((v) => ({ ...v, [f.id]: e.target.value }))}
              />
            </div>
          ))}
        </div>

        <div className="mc-builder-preview">
          <h3>
            Карточка · {filledCount}/{finale.pilotFields.length}
          </h3>
          <div className="mc-builder-text" aria-live="polite">
            {filledCount ? toMarkdown(values) : "Заполните поля — карточка соберётся здесь."}
          </div>
          <div className="mc-builder-actions">
            <button type="button" className="mc-btn mc-btn-ghost mc-btn-small" onClick={fillDemo}>
              Пример
            </button>
            <button type="button" className="mc-btn mc-btn-ghost mc-btn-small" onClick={clearAll}>
              Очистить
            </button>
            <button type="button" className="mc-btn mc-btn-ghost mc-btn-small" onClick={exportMd} disabled={!filledCount}>
              Скачать .md
            </button>
            <button type="button" className="mc-btn mc-btn-primary mc-btn-small" onClick={copy} disabled={!filledCount}>
              {copied ? "Скопировано ✓" : "Скопировать"}
            </button>
          </div>
          <p className="mc-privacy-note">Ответы сохраняются только в этом браузере и никуда не отправляются.</p>
        </div>
      </div>

      {/* Главная мысль */}
      <div className="mc-center" style={{ marginTop: "9rem", minHeight: "70svh", justifyContent: "center" }}>
        <p id="finale-main" className="mc-final-main">
          {finale.main}
        </p>
        <div className="mc-final-steps">
          {finale.steps.map((s, i) => (
            <div key={s} className="mc-final-step">
              <i>{i + 1}</i>
              <span>{s}</span>
            </div>
          ))}
        </div>
        <div className="mc-hero-words mc-final-words" style={{ marginTop: "3rem", justifyContent: "center" }}>
          {hero.words.map((w) => (
            <span key={w.step} style={{ color: stepColors[w.step] }}>
              <span className="mc-dot" style={{ background: stepColors[w.step] }} />
              {w.text}
            </span>
          ))}
        </div>

        <div className="mc-final-footer">
          <Image src="/ai-masterclass/qr-ai-masterclass.svg" alt="QR-код страницы мастер-класса" width={108} height={108} className="mc-qr" />
          <div style={{ textAlign: "left", display: "grid", gap: "0.5rem" }}>
            <Link
              className="mc-btn mc-btn-ghost mc-btn-small"
              href="/contact"
              onClick={() => track("mc_contact_click")}
            >
              Связаться с автором
            </Link>
            <button
              type="button"
              className="mc-btn mc-btn-ghost mc-btn-small"
              onClick={() => document.getElementById("four-p")?.scrollIntoView({ behavior: "smooth" })}
            >
              Вернуться к методике 4П
            </button>
          </div>
        </div>
        <p className="mc-small" style={{ marginTop: "2rem", opacity: 0.7 }}>
          {hero.author} · veretennikov.info
        </p>
      </div>
    </section>
  );
}
