"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import {
  AI_SCALE,
  DIRECTIONS,
  PROCESSES,
  PROCESS_HINTS,
} from "@/lib/live/taxonomy"
import type { AiRole, DirId, ProcId } from "@/lib/live/taxonomy"

/**
 * Экран участника: вход → три выбора → личный итог.
 *
 * Это не анкета. Один вопрос — один экран — крупные карточки,
 * никакого скролла по длинным спискам и никаких полей ввода.
 * Весь путь рассчитан на 30–60 секунд.
 *
 * Идентификатор участника анонимный и живёт в localStorage: он нужен
 * ровно для того, чтобы повторная отправка заменяла прежний ответ,
 * а не удваивала узел на большом экране. Персональных данных
 * не собирается никаких.
 */

type Step = "hello" | "direction" | "process" | "ai" | "done"

const PID_KEY = "utpp-live-pid"
const PICK_DELAY = 340

function getPid(): string {
  try {
    const found = localStorage.getItem(PID_KEY)
    if (found) return found
    const made = Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4)
    localStorage.setItem(PID_KEY, made)
    return made
  } catch {
    // Приватный режим — идентификатор живёт только в памяти вкладки.
    return Math.random().toString(36).slice(2, 14)
  }
}

async function post(url: string, body: unknown): Promise<Response | null> {
  try {
    return await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    })
  } catch {
    return null
  }
}

export default function Mobile({ sessionId }: { sessionId: string }) {
  const [step, setStep] = useState<Step>("hello")
  const [direction, setDirection] = useState<DirId | null>(null)
  const [process, setProcess] = useState<ProcId | null>(null)
  const [aiRole, setAiRole] = useState<AiRole | null>(null)
  const [picked, setPicked] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const pidRef = useRef<string>("")

  useEffect(() => {
    pidRef.current = getPid()
    void post("/api/live/join", { pid: pidRef.current, sessionId })
    const t = window.setTimeout(() => setStep("direction"), 1400)
    return () => window.clearTimeout(t)
  }, [sessionId])

  /** Общая механика выбора: залипание карточки, пауза, следующий экран. */
  const choose = useCallback((value: string, next: () => void) => {
    setPicked(value)
    window.setTimeout(() => {
      setPicked(null)
      next()
    }, PICK_DELAY)
  }, [])

  // Каждый шаг уходит отдельно: узел на большом экране загорается
  // сразу после первого выбора, а не через двадцать секунд.
  const onDirection = (id: DirId) =>
    choose(id, () => {
      setDirection(id)
      setStep("process")
      void post("/api/live/answer", { pid: pidRef.current, sessionId, direction: id })
    })

  const onProcess = (id: ProcId) =>
    choose(id, () => {
      setProcess(id)
      setStep("ai")
      void post("/api/live/answer", { pid: pidRef.current, sessionId, process: id })
    })

  const onAi = (value: AiRole) =>
    choose(String(value), async () => {
      setAiRole(value)
      setStep("done")
      const res = await post("/api/live/answer", {
        pid: pidRef.current,
        sessionId,
        // Отправляем всё целиком: если промежуточный шаг не дошёл
        // из-за слабой связи, финальный запрос всё равно соберёт запись.
        direction,
        process,
        aiRole: value,
      })
      if (!res) setError("Ответ не ушёл — проверьте связь и попробуйте ещё раз.")
      else if (res.status === 409) setError("Началась новая сессия. Отсканируйте код заново.")
      else if (res.status === 423) setError("Приём ответов уже закрыт.")
      else if (!res.ok) setError("Ответ не ушёл. Попробуйте ещё раз.")
      else setError(null)
    })

  const ticks = (n: number) => (
    <div className="lv-steps" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <i key={i} data-on={i < n} />
      ))}
    </div>
  )

  if (step === "hello") {
    return (
      <div className="lv-center">
        <p className="lv-big">Вы подключены</p>
        <p className="lv-note">Три коротких вопроса. Меньше минуты.</p>
      </div>
    )
  }

  if (step === "direction") {
    return (
      <>
        {ticks(0)}
        <h1 className="lv-q">Какое направление работы вам ближе?</h1>
        <div className="lv-cards" data-picked={picked !== null}>
          {DIRECTIONS.map((d) => (
            <button
              key={d.id}
              type="button"
              className="lv-card"
              data-picked={picked === d.id}
              onClick={() => onDirection(d.id)}
            >
              <b>{d.title}</b>
              <span>{d.hint}</span>
            </button>
          ))}
        </div>
      </>
    )
  }

  if (step === "process" && direction) {
    const hints = PROCESS_HINTS[direction]
    return (
      <>
        {ticks(1)}
        <h1 className="lv-q">Что забирает больше всего времени?</h1>
        <div className="lv-cards" data-picked={picked !== null}>
          {PROCESSES.map((p) => (
            <button
              key={p.id}
              type="button"
              className="lv-card"
              data-picked={picked === p.id}
              onClick={() => onProcess(p.id)}
            >
              <b>{p.title}</b>
              <span>{hints[p.id]}</span>
            </button>
          ))}
        </div>
      </>
    )
  }

  if (step === "ai" && process) {
    const proc = PROCESSES.find((p) => p.id === process)
    return (
      <>
        {ticks(2)}
        <h1 className="lv-q">Где здесь проходит граница?</h1>
        <p className="lv-sub">«{proc?.title}» — что из этого можно доверить машине</p>
        <div className="lv-cards lv-scale" data-picked={picked !== null}>
          {AI_SCALE.map((s) => (
            <button
              key={s.value}
              type="button"
              className="lv-card"
              data-step={s.value}
              data-picked={picked === String(s.value)}
              onClick={() => onAi(s.value)}
            >
              <i aria-hidden="true" />
              <b>{s.title}</b>
            </button>
          ))}
        </div>
      </>
    )
  }

  // Итог. Здесь и происходит раскрытие механики: человек узнаёт,
  // что его выбор уже на большом экране, и поднимает голову ровно
  // тогда, когда его собственный узел ещё пульсирует.
  const dir = DIRECTIONS.find((d) => d.id === direction)
  const proc = PROCESSES.find((p) => p.id === process)
  const ai = AI_SCALE.find((s) => s.value === aiRole)

  return (
    <div className="lv-center">
      <p className="lv-big">
        Ваш выбор уже <span className="lv-mark">на большом экране</span>
      </p>
      <div className="lv-branch">
        <div>{dir?.title}</div>
        <div>{proc?.title}</div>
        <div>{ai?.title}</div>
      </div>
      {error ? <p className="lv-err">{error}</p> : null}
      <p className="lv-foot">Посмотрите на экран</p>
    </div>
  )
}
