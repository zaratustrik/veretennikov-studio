"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Trash2, CheckCircle2, Download, FileJson } from "@/components/karandash-brief/icons";
import type { Answers, AnswerValue, BriefSubmission } from "@/types/karandash-brief";
import { BRIEF_SCHEMA_VERSION } from "@/types/karandash-brief";
import { stages } from "@/lib/karandash-brief/questions";
import { isAnswered, isVisible, completionPercent } from "@/lib/karandash-brief/values";
import { validateRequired } from "@/lib/karandash-brief/validation";
import { buildMarkdown, briefFileBase } from "@/lib/karandash-brief/markdown";
import { buildExportJson } from "@/lib/karandash-brief/json";
import { downloadTextFile } from "@/lib/karandash-brief/download";
import { loadDraft, saveDraft, clearDraft, hasDraft } from "@/lib/karandash-brief/storage";
import { AccessGate } from "./AccessGate";
import { IntroScreen } from "./IntroScreen";
import { StageView } from "./StageView";
import { SummaryScreen } from "./SummaryScreen";
import { ProgressHeader } from "./ProgressHeader";
import { PrimaryButton, GhostButton, AccentButton, Card } from "./ui";

type Phase = "loading" | "gate" | "intro" | "form" | "summary" | "done";

const stageTitles = stages.map((s) => s.title);

export function BriefApp() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [answers, setAnswers] = useState<Answers>({});
  const [stageIndex, setStageIndex] = useState(0);
  const [draftExists, setDraftExists] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [invalidIds, setInvalidIds] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [submitTone, setSubmitTone] = useState<"info" | "error">("info");

  const hydrated = useRef(false);

  // --- Инициализация: доступ + черновик ---
  useEffect(() => {
    let active = true;
    async function init() {
      const draft = loadDraft();
      if (draft && active) {
        setAnswers(draft.answers);
        setDraftExists(true);
        const idx = stages.findIndex((s) => s.id === draft.lastStageId);
        if (idx >= 0) setStageIndex(idx);
      }
      try {
        const res = await fetch("/api/karandash-brief/access", { method: "GET" });
        const data = (await res.json()) as { required?: boolean; authorized?: boolean };
        if (!active) return;
        if (data.required && !data.authorized) {
          setPhase("gate");
        } else {
          setPhase("intro");
        }
      } catch {
        if (active) setPhase("intro");
      } finally {
        hydrated.current = true;
      }
    }
    init();
    return () => {
      active = false;
    };
  }, []);

  // --- Автосохранение (debounce) ---
  useEffect(() => {
    if (!hydrated.current) return;
    if (phase === "loading" || phase === "gate" || phase === "done") return;
    if (Object.keys(answers).length === 0) return;
    setDraftSaved(false);
    const t = setTimeout(() => {
      saveDraft(answers, stages[stageIndex]?.id);
      setDraftExists(true);
      setDraftSaved(true);
    }, 600);
    return () => clearTimeout(t);
  }, [answers, stageIndex, phase]);

  // --- Предупреждение о закрытии с несохранёнными изменениями ---
  useEffect(() => {
    function onBeforeUnload(e: BeforeUnloadEvent) {
      if ((phase === "form" || phase === "summary") && Object.keys(answers).length > 0) {
        e.preventDefault();
        e.returnValue = "";
      }
    }
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [phase, answers]);

  const setAnswer = useCallback((id: string, value: AnswerValue | undefined) => {
    setAnswers((prev) => {
      const next = { ...prev };
      if (value === undefined) delete next[id];
      else next[id] = value;
      return next;
    });
    setInvalidIds((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const scrollTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const validateStage = useCallback(
    (index: number): boolean => {
      const stage = stages[index];
      const bad = new Set<string>();
      for (const q of stage.questions) {
        if (q.required && isVisible(q, answers) && !isAnswered(q, answers[q.id])) {
          bad.add(q.id);
        }
      }
      if (bad.size > 0) {
        setInvalidIds(bad);
        return false;
      }
      return true;
    },
    [answers]
  );

  const goNext = useCallback(() => {
    if (!validateStage(stageIndex)) {
      scrollTop();
      return;
    }
    if (stageIndex < stages.length - 1) {
      setStageIndex((i) => i + 1);
      scrollTop();
    } else {
      // на итог: проверим все обязательные
      const errors = validateRequired(answers);
      if (errors.length > 0) {
        const firstStage = stages.findIndex((s) => s.questions.some((q) => q.id === errors[0].id));
        setInvalidIds(new Set(errors.map((e) => e.id)));
        if (firstStage >= 0) setStageIndex(firstStage);
        scrollTop();
        return;
      }
      setPhase("summary");
      scrollTop();
    }
  }, [stageIndex, validateStage, answers, scrollTop]);

  const goBack = useCallback(() => {
    if (stageIndex > 0) {
      setStageIndex((i) => i - 1);
      scrollTop();
    } else {
      setPhase("intro");
      scrollTop();
    }
  }, [stageIndex, scrollTop]);

  const jumpTo = useCallback(
    (index: number) => {
      setStageIndex(index);
      scrollTop();
    },
    [scrollTop]
  );

  const startFilling = useCallback(() => {
    setPhase("form");
    setStageIndex(0);
    scrollTop();
  }, [scrollTop]);

  const continueDraft = useCallback(() => {
    setPhase("form");
    scrollTop();
  }, [scrollTop]);

  const editStage = useCallback(
    (index: number) => {
      setPhase("form");
      setStageIndex(index);
      scrollTop();
    },
    [scrollTop]
  );

  const resetDraft = useCallback(() => {
    if (!window.confirm("Очистить сохранённый черновик? Все введённые ответы будут удалены.")) return;
    clearDraft();
    setAnswers({});
    setDraftExists(false);
    setDraftSaved(false);
    setInvalidIds(new Set());
    setStageIndex(0);
    setPhase("intro");
    scrollTop();
  }, [scrollTop]);

  // --- Экспорт ---
  const downloadMd = useCallback(() => {
    const now = new Date();
    downloadTextFile(`${briefFileBase(now)}.md`, buildMarkdown(answers, now.toISOString()), "text/markdown");
  }, [answers]);

  const downloadJson = useCallback(() => {
    const now = new Date();
    const json = buildExportJson(answers, now.toISOString());
    downloadTextFile(`${briefFileBase(now)}.json`, JSON.stringify(json, null, 2), "application/json");
  }, [answers]);

  // --- Отправка ---
  const submit = useCallback(async () => {
    const errors = validateRequired(answers);
    if (errors.length > 0) {
      setSubmitTone("error");
      setSubmitMessage("Заполните обязательные поля: " + errors.map((e) => e.label).join(", "));
      return;
    }
    setSubmitting(true);
    setSubmitMessage(null);

    const payload: BriefSubmission = {
      schemaVersion: BRIEF_SCHEMA_VERSION,
      answers,
      website: "",
      meta: {
        filledAt: new Date().toISOString(),
        completion: completionPercent(answers),
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined
      }
    };

    try {
      const res = await fetch("/api/karandash-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        delivered?: boolean;
        reason?: string;
        error?: string;
      };

      if (res.ok && data.ok && data.delivered) {
        clearDraft();
        setPhase("done");
        setSubmitting(false);
        scrollTop();
        return;
      }

      // Ошибки/фолбэки — черновик НЕ удаляем
      setSubmitTone("error");
      if (res.status === 401) {
        setSubmitMessage("Доступ истёк. Обновите страницу и войдите заново. Черновик сохранён.");
      } else if (res.status === 429) {
        setSubmitMessage("Слишком много попыток отправки. Подождите немного и попробуйте снова.");
      } else if (data.reason === "telegram_not_configured") {
        setSubmitTone("info");
        setSubmitMessage(
          "Автоматическая отправка пока не настроена. Скачайте бриф в .md или .json и перешлите Анатолию — черновик сохранён."
        );
      } else if (data.reason === "telegram_error") {
        setSubmitMessage(
          "Не удалось отправить бриф автоматически. Скачайте файл и перешлите вручную — черновик сохранён, отправку можно повторить."
        );
      } else {
        setSubmitMessage(data.error || "Не удалось отправить бриф. Скачайте файл и попробуйте позже.");
      }
    } catch {
      setSubmitTone("error");
      setSubmitMessage(
        "Ошибка сети. Бриф не отправлен, но черновик сохранён. Скачайте файл или попробуйте ещё раз."
      );
    } finally {
      setSubmitting(false);
    }
  }, [answers, scrollTop]);

  const completion = useMemo(() => completionPercent(answers), [answers]);

  if (phase === "loading") {
    return (
      <main className="mx-auto max-w-3xl px-5 py-24 text-center text-muted">
        <p>Загрузка брифа…</p>
      </main>
    );
  }

  if (phase === "gate") {
    return <AccessGate onUnlock={() => setPhase("intro")} />;
  }

  if (phase === "intro") {
    return (
      <IntroScreen
        answers={answers}
        setAnswer={setAnswer}
        hasDraft={draftExists && hasDraft()}
        onStart={startFilling}
        onContinue={continueDraft}
        invalidIds={invalidIds}
      />
    );
  }

  if (phase === "summary") {
    return (
      <>
        <SummaryScreen
          answers={answers}
          onEditStage={editStage}
          onDownloadMd={downloadMd}
          onDownloadJson={downloadJson}
          onSubmit={submit}
          submitting={submitting}
          submitMessage={submitMessage}
          submitTone={submitTone}
        />
        <div className="mx-auto max-w-3xl px-5 pb-16 sm:px-8">
          <GhostButton onClick={() => editStage(stages.length - 1)}>
            <ArrowLeft size={18} aria-hidden /> Вернуться к разделам
          </GhostButton>
        </div>
      </>
    );
  }

  if (phase === "done") {
    return <DoneScreen onDownloadMd={downloadMd} onDownloadJson={downloadJson} />;
  }

  // phase === "form"
  const stage = stages[stageIndex];
  const isLast = stageIndex === stages.length - 1;
  return (
    <main className="mx-auto max-w-3xl px-5 pb-16 sm:px-8">
      <ProgressHeader
        stageTitles={stageTitles}
        currentIndex={stageIndex}
        onJump={jumpTo}
        completion={completion}
        draftSaved={draftSaved}
      />
      <div className="pt-8">
        <StageView
          stage={stage}
          stageNumber={stageIndex + 1}
          answers={answers}
          setAnswer={setAnswer}
          invalidIds={invalidIds}
        />

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <GhostButton onClick={goBack} className="w-full sm:w-auto">
            <ArrowLeft size={18} aria-hidden /> Назад
          </GhostButton>
          {isLast ? (
            <AccentButton onClick={goNext} className="w-full sm:ml-auto sm:w-auto">
              К итогу <ArrowRight size={18} aria-hidden />
            </AccentButton>
          ) : (
            <PrimaryButton onClick={goNext} className="w-full sm:ml-auto sm:w-auto">
              Далее <ArrowRight size={18} aria-hidden />
            </PrimaryButton>
          )}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-line pt-6 text-sm">
          <button
            onClick={downloadMd}
            className="inline-flex items-center gap-1.5 text-muted transition-colors hover:text-graphite"
          >
            <Download size={16} aria-hidden /> Скачать .md
          </button>
          <button
            onClick={downloadJson}
            className="inline-flex items-center gap-1.5 text-muted transition-colors hover:text-graphite"
          >
            <FileJson size={16} aria-hidden /> Скачать .json
          </button>
          <button
            onClick={resetDraft}
            className="ml-auto inline-flex items-center gap-1.5 text-muted transition-colors hover:text-redBrand"
          >
            <Trash2 size={16} aria-hidden /> Очистить черновик
          </button>
        </div>
      </div>
    </main>
  );
}

function DoneScreen({
  onDownloadMd,
  onDownloadJson
}: {
  onDownloadMd: () => void;
  onDownloadJson: () => void;
}) {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-xl items-center px-5 py-16">
      <Card className="w-full text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="text-green-700" size={30} aria-hidden />
        </div>
        <h1 className="font-kbh text-2xl font-bold text-graphite">Спасибо. Ответы отправлены.</h1>
        <p className="mt-3 text-secondary">
          Мы изучим их и подготовим предложение по архитектуре и этапам разработки нового сайта.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <GhostButton onClick={onDownloadMd}>
            <Download size={18} aria-hidden /> Скачать Markdown
          </GhostButton>
          <GhostButton onClick={onDownloadJson}>
            <FileJson size={18} aria-hidden /> Скачать JSON
          </GhostButton>
        </div>
      </Card>
    </main>
  );
}
