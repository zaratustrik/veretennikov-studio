"use client"

import { useCallback, useEffect, useState } from "react"

import { PHASES } from "@/lib/live/types"
import type { LiveState, Phase } from "@/lib/live/types"
import { controlHeaders, sendControl } from "./useLiveState"

/**
 * Пульт ведущего. Открывается на телефоне или во второй вкладке
 * и защищён тем же паролем, что и вся дека.
 *
 * Пульт не единственная точка управления: на большом экране те же фазы
 * двигаются стрелками, как на любом слайде. Если телефон разрядится
 * или отвалится от сети, показ не встанет.
 */

const PHASE_LABEL: Record<Phase, string> = {
  invite: "1 · Показать код",
  collecting: "2 · Сбор ответов",
  frozen: "3 · Стабилизировать",
  insights: "4 · Показать выводы",
  final1: "5 · Каждый видел свой выбор",
  final2: "6 · Цифровая модель",
  final3: "7 · Теперь мы видим систему",
  final4: "8 · Финальная строка",
}

export default function Control({ controlToken }: { controlToken: string | null }) {
  const [state, setState] = useState<LiveState | null>(null)
  const [qr, setQr] = useState<string | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  const [note, setNote] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/live/control", {
        cache: "no-store",
        headers: controlHeaders(controlToken),
      })
      if (!res.ok) return
      const data = (await res.json()) as { state: LiveState | null; qr: string | null }
      setState(data.state)
      setQr(data.qr)
    } catch {
      /* пульт переживает обрыв молча */
    }
  }, [controlToken])

  useEffect(() => {
    // Первый опрос ставим в очередь микрозадач, а не выполняем в теле
    // эффекта: синхронный setState здесь запускает каскад перерисовок.
    let stopped = false
    queueMicrotask(() => {
      if (!stopped) void load()
    })
    const t = window.setInterval(load, 1200)
    return () => {
      stopped = true
      window.clearInterval(t)
    }
  }, [load])

  const act = async (body: Record<string, unknown>, label: string) => {
    setBusy(label)
    const ok = await sendControl(body, controlToken)
    setNote(ok ? null : "Команда не прошла. Повторите.")
    await load()
    setBusy(null)
  }

  const phase = state?.phase ?? "invite"
  const url = state ? `${location.origin}/live/${state.sessionId}` : null

  return (
    <div className="utpp-ctrl">
      <header>
        <p className="utpp-note">Пульт ведущего</p>
        <h1>
          {state ? (
            <>
              Сессия <b>{state.sessionId}</b>
              {state.mode === "demo" ? <em> · демо</em> : null}
            </>
          ) : (
            "Сессия не создана"
          )}
        </h1>
        {url ? <p className="utpp-ctrl-url">{url}</p> : null}
      </header>

      <div className="utpp-ctrl-stats">
        <div>
          <b>{state?.connected ?? 0}</b>
          <span>подключились</span>
        </div>
        <div>
          <b>{state?.started ?? 0}</b>
          <span>начали</span>
        </div>
        <div>
          <b>{state?.completed ?? 0}</b>
          <span>завершили</span>
        </div>
        <div data-state={state?.closed ? "closed" : "open"}>
          <b>{state?.closed ? "стоп" : "идёт"}</b>
          <span>{state?.closed ? "приём закрыт" : "приём идёт"}</span>
        </div>
      </div>

      <section>
        <p className="utpp-note">Фаза показа</p>
        <div className="utpp-ctrl-phases">
          {PHASES.map((p) => (
            <button
              key={p}
              type="button"
              data-active={phase === p}
              disabled={busy !== null}
              onClick={() => act({ action: "phase", phase: p }, p)}
            >
              {PHASE_LABEL[p]}
            </button>
          ))}
        </div>
      </section>

      <section>
        <p className="utpp-note">Сессия</p>
        <div className="utpp-ctrl-actions">
          <button type="button" disabled={busy !== null} onClick={() => act({ action: "new-session" }, "new")}>
            Новая сессия
          </button>
          <button
            type="button"
            disabled={busy !== null}
            onClick={() => act({ action: state?.closed ? "open" : "close" }, "close")}
          >
            {state?.closed ? "Возобновить приём" : "Остановить приём"}
          </button>
          <button type="button" disabled={busy !== null} onClick={() => act({ action: "reset" }, "reset")}>
            Сбросить ответы
          </button>
          <button
            type="button"
            data-demo="true"
            disabled={busy !== null}
            onClick={() => act({ action: "demo" }, "demo")}
          >
            Демо-режим
          </button>
        </div>
        <p className="utpp-small">
          Демо создаёт отдельную сессию с виртуальным потоком. Реальные ответы
          зала в неё не попадают и никогда с ней не смешиваются.
        </p>
      </section>

      {qr ? (
        <section>
          <p className="utpp-note">Код активной сессии</p>
          <div className="utpp-ctrl-qr" dangerouslySetInnerHTML={{ __html: qr }} />
        </section>
      ) : null}

      {note ? <p className="utpp-ctrl-note">{note}</p> : null}

      <footer className="utpp-small">
        На большом экране те же фазы двигаются стрелками. Пульт — удобство,
        а не единственная точка управления.
      </footer>
    </div>
  )
}
