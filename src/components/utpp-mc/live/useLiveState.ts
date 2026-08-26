"use client"

import { useEffect, useRef, useState } from "react"

import type { Analysis } from "@/lib/live/insights"
import type { LiveState } from "@/lib/live/types"

/**
 * Опрос состояния сессии.
 *
 * Обновления нужны единственному клиенту — большому экрану, поэтому
 * ни SSE, ни websocket здесь не нужны: это полтора запроса в секунду.
 * Плюс опрос проходит через nginx без единой правки конфига, а SSE
 * потребовал бы выключить проксирующую буферизацию на боевом сервере
 * за двое суток до выступления.
 *
 * При обрыве связи последнее состояние остаётся в памяти вкладки:
 * сеть на экране продолжает жить, а когда связь вернётся — догонит.
 */

export type LiveSnapshot = LiveState & { analysis: Analysis | null }

const INTERVAL = 600

export function useLiveState(active: boolean) {
  const [state, setState] = useState<LiveSnapshot | null>(null)
  const [online, setOnline] = useState(true)
  const etag = useRef<string | null>(null)
  const failures = useRef(0)

  useEffect(() => {
    if (!active) return
    let stopped = false
    let timer = 0

    const tick = async () => {
      try {
        const res = await fetch("/api/live/state", {
          cache: "no-store",
          headers: etag.current ? { "If-None-Match": etag.current } : undefined,
        })
        if (stopped) return
        if (res.status === 304) {
          failures.current = 0
          setOnline(true)
        } else if (res.ok) {
          const tag = res.headers.get("etag")
          if (tag) etag.current = tag
          const data = (await res.json()) as LiveSnapshot
          if (!stopped && data.sessionId) setState(data)
          failures.current = 0
          setOnline(true)
        }
      } catch {
        failures.current += 1
        // Один пропущенный запрос — не повод пугать зал. Отметку
        // о потере связи ставим только после нескольких подряд.
        if (failures.current >= 4) setOnline(false)
      } finally {
        if (!stopped) timer = window.setTimeout(tick, INTERVAL)
      }
    }

    void tick()
    return () => {
      stopped = true
      window.clearTimeout(timer)
    }
  }, [active])

  return { state, online }
}

/** Заголовок с токеном пульта: cookie раздела до /api/ не доходит. */
export function controlHeaders(token: string | null): Record<string, string> {
  return token ? { "X-Utpp-Control": token } : {}
}

/** Команда пульта. Ошибки намеренно проглатываются: сцена важнее. */
export async function sendControl(
  body: Record<string, unknown>,
  token: string | null,
): Promise<boolean> {
  try {
    const res = await fetch("/api/live/control", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...controlHeaders(token) },
      body: JSON.stringify(body),
      cache: "no-store",
    })
    return res.ok
  } catch {
    return false
  }
}
