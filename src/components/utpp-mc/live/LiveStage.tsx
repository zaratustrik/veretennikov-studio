"use client"

import { useEffect, useRef, useState } from "react"

import { liveFinale } from "../content.ru"
import { Slide } from "../primitives"
import { NetworkRenderer } from "./network"
import { controlHeaders, sendControl, useLiveState } from "./useLiveState"
import { PHASES, PHASE_INDEX } from "@/lib/live/types"
import type { Phase } from "@/lib/live/types"

type P = { index: number; total: number; active: boolean; beat: number }

/**
 * Интерактивный финал: живая карта процессов Палаты.
 *
 * Фаза = beat слайда. Стрелка ведущего двигает показ так же, как
 * на любом другом экране деки, — отдельных клавиш заучивать не нужно.
 * Пульт может перевести фазу независимо; экран замечает это
 * по счётчику смен и догоняет.
 *
 * Canvas живёт всё время, пока слайд смонтирован: дека держит
 * соседние слайды в дереве, поэтому сеть не пересобирается
 * при переходах и не мигает.
 */
export default function LiveStage({
  index,
  total,
  active,
  beat,
  onPhaseJump,
  controlToken,
}: P & { onPhaseJump?: (beatIndex: number) => void; controlToken: string | null }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rendererRef = useRef<NetworkRenderer | null>(null)
  const [qr, setQr] = useState<string | null>(null)
  const lastNonce = useRef<number | null>(null)
  const lastSentPhase = useRef<Phase | null>(null)

  const phase: Phase = PHASES[Math.min(beat, PHASES.length - 1)]!
  const { state, online } = useLiveState(active)

  /* ── Canvas ──────────────────────────────────────────────── */

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let renderer: NetworkRenderer
    try {
      renderer = new NetworkRenderer(canvas)
    } catch {
      return
    }
    rendererRef.current = renderer
    renderer.update({ records: [], phase: "invite", reducedMotion: reduced })
    renderer.start()

    const onResize = () => renderer.resize()
    window.addEventListener("resize", onResize)
    return () => {
      window.removeEventListener("resize", onResize)
      renderer.stop()
      rendererRef.current = null
    }
  }, [])

  // Новая сессия — чистое созвездие: узлы прошлого показа гаснут.
  useEffect(() => {
    rendererRef.current?.reset()
  }, [state?.sessionId])

  useEffect(() => {
    const renderer = rendererRef.current
    if (!renderer) return
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    renderer.update({ records: state?.records ?? [], phase, reducedMotion: reduced })
  }, [state, phase])

  /* ── QR активной сессии ──────────────────────────────────── */

  useEffect(() => {
    if (!active) return
    let stopped = false
    const load = async () => {
      try {
        const res = await fetch("/api/live/control", {
          cache: "no-store",
          headers: controlHeaders(controlToken),
        })
        if (!res.ok) return
        const data = (await res.json()) as { qr?: string | null }
        if (!stopped) setQr(data.qr ?? null)
      } catch {
        /* экран покажет подсказку без кода — пульт может создать сессию */
      }
    }
    void load()
    return () => {
      stopped = true
    }
  }, [active, state?.sessionId, controlToken])

  /* ── Синхронизация фазы ──────────────────────────────────── */

  // Экран сообщает серверу свою фазу, чтобы пульт показывал правду.
  useEffect(() => {
    if (!active || !state?.sessionId) return
    if (lastSentPhase.current === phase) return
    if (state.phase === phase) {
      lastSentPhase.current = phase
      return
    }
    lastSentPhase.current = phase
    void sendControl({ action: "phase", phase }, controlToken)
  }, [active, phase, state?.phase, state?.sessionId, controlToken])

  // Команда с пульта: применяем только при смене счётчика — и только
  // если это не эхо нашей же команды.
  //
  // Экран отправляет фазу серверу, а опрос может вернуть предыдущий
  // снимок уже после того, как ведущий нажал стрелку ещё раз. Без
  // проверки на эхо показ откатывался бы на шаг назад — на сцене это
  // выглядело бы как зависшая стрелка.
  useEffect(() => {
    if (!active || !state) return
    if (lastNonce.current === null) {
      lastNonce.current = state.phaseNonce
      return
    }
    if (state.phaseNonce === lastNonce.current) return
    lastNonce.current = state.phaseNonce
    if (state.phase === lastSentPhase.current) return
    if (state.phase !== phase) {
      lastSentPhase.current = state.phase
      onPhaseJump?.(PHASE_INDEX[state.phase])
    }
  }, [active, state, phase, onPhaseJump])

  /* ── Разметка ────────────────────────────────────────────── */

  const isDemo = state?.mode === "demo"
  const connected = state?.connected ?? 0
  const insights = state?.analysis?.insights ?? []
  const finalIdx = phase.startsWith("final") ? Number(phase.slice(5)) - 1 : -1

  return (
    <Slide
      id={liveFinale.id}
      tone="ink"
      label={liveFinale.label}
      index={index}
      total={total}
      active={active}
    >
      <div className="utpp-live" data-phase={phase}>
        <canvas ref={canvasRef} className="utpp-live-canvas" aria-hidden="true" />

        {/* Приглашение: код крупно, счётчик подключений тикает сразу —
            зал должен увидеть отклик системы раньше первого узла. */}
        <div className="utpp-live-invite" data-on={phase === "invite"}>
          <p className="utpp-live-title">{liveFinale.invite.title}</p>
          {qr ? (
            <div className="utpp-live-qr" dangerouslySetInnerHTML={{ __html: qr }} />
          ) : (
            <div className="utpp-live-qr utpp-live-qr--empty">
              <span>Создайте сессию на пульте</span>
            </div>
          )}
          <p className="utpp-live-hint">{liveFinale.invite.hint}</p>
        </div>

        {/* Код уезжает в угол: опоздавшие всё ещё могут подключиться. */}
        <div className="utpp-live-qr-corner" data-on={phase === "collecting"}>
          {qr ? <div dangerouslySetInnerHTML={{ __html: qr }} /> : null}
        </div>

        {/* Счётчик — тихой моно-подписью, без плашек и процентов.
            В демо-режиме чисел про людей нет вовсе: мы не выдаём
            виртуальных участников за зал. */}
        {!isDemo && (phase === "invite" || phase === "collecting") ? (
          <p className="utpp-live-counter">
            {connected > 0
              ? `${liveFinale.invite.connectedWord} · ${connected}`
              : liveFinale.waiting}
          </p>
        ) : null}

        {isDemo ? <p className="utpp-live-demo">{liveFinale.demoBadge}</p> : null}

        {!online ? <p className="utpp-live-offline">{liveFinale.offline}</p> : null}

        {/* Выводы: считаются на сервере детерминированно, без внешних
            моделей — на сцене нельзя ждать ответ по сети. */}
        <div className="utpp-live-insights" data-on={phase === "insights"}>
          <p className="utpp-eyebrow">{liveFinale.insightsTitle}</p>
          <ol>
            {insights.map((i, k) => (
              <li key={i.type} style={{ ["--k" as string]: k }}>
                <b>{i.headline}</b>
                {i.detail ? <span>{i.detail}</span> : null}
              </li>
            ))}
          </ol>
          <p className="utpp-live-insights-hint">{liveFinale.insightsHint}</p>
        </div>

        {/* Финал: по одной мысли, с паузой внутри. */}
        {liveFinale.finals.map((f, k) => (
          <div key={k} className="utpp-live-final" data-on={finalIdx === k}>
            <p className="utpp-live-final-main">{f.main}</p>
            {f.after ? <p className="utpp-live-final-after">{f.after}</p> : null}
          </div>
        ))}
      </div>
    </Slide>
  )
}
